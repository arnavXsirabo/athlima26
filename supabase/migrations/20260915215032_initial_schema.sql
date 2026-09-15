-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SPORTS TABLE
CREATE TABLE IF NOT EXISTS public.sports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 8,
    price INTEGER NOT NULL DEFAULT 0,
    min_players INTEGER NOT NULL DEFAULT 1,
    max_players INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'HIDDEN', 'FULL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number TEXT UNIQUE NOT NULL,
    college_name TEXT NOT NULL,
    team_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    total_amount INTEGER NOT NULL DEFAULT 0,
    payment_utr TEXT NOT NULL,
    payment_screenshot_path TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'submitted' CHECK (payment_status IN ('submitted', 'verified', 'rejected')),
    status TEXT NOT NULL DEFAULT 'payment_submitted' CHECK (status IN ('payment_submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. REGISTRATION_SPORTS TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.registration_sports (
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    sport_id TEXT NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (registration_id, sport_id)
);

-- 4. REGISTRATION_PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.registration_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    sport_id TEXT NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    player_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (registration_id, sport_id, player_index)
);

-- 5. PROFILES TABLE (Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'sports_coordinator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for sports
CREATE POLICY "Public can read sports" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Admins can manage sports" ON public.sports USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin', 'sports_coordinator'))
);

-- Policies for registrations, registration_sports, registration_players (Admin only)
CREATE POLICY "Admins can manage registrations" ON public.registrations USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can manage registration_sports" ON public.registration_sports USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can manage registration_players" ON public.registration_players USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin'))
);

-- Policies for profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin')
);

-- Create the Storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage payment screenshots" ON storage.objects FOR ALL USING (
    bucket_id = 'payment-screenshots' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin'))
);

-- Policy: Public can upload ONLY if they meet strict criteria
CREATE POLICY "Public can upload screenshots" ON storage.objects FOR INSERT TO public WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND (storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'png' OR storage.extension(name) = 'webp')
);

-- Atomic Registration Function
CREATE OR REPLACE FUNCTION public.submit_registration(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS to allow inserts
AS $$
DECLARE
    new_reg_id UUID;
    new_reg_num TEXT;
    sport_rec RECORD;
    sport_id_val TEXT;
    s_status TEXT;
    s_capacity INT;
    s_price INT;
    current_count INT;
    t_amount INT := 0;
    sport_list JSONB;
    player_list JSONB;
    player_obj JSONB;
BEGIN
    -- 1. Generate Registration Number
    -- Format: ATH-2026-00001
    LOCK TABLE public.registrations IN EXCLUSIVE MODE;

    SELECT 'ATH-2026-' || LPAD((COALESCE(MAX(SUBSTRING(registration_number FROM 10)::INT), 0) + 1)::TEXT, 5, '0')
    INTO new_reg_num
    FROM public.registrations;

    -- 2. Create the registration row (initial values, total_amount will be updated later)
    INSERT INTO public.registrations (
        registration_number, college_name, team_name, contact_email, contact_phone, 
        total_amount, payment_utr, payment_screenshot_path
    ) VALUES (
        new_reg_num, 
        payload->>'college_name', 
        payload->>'team_name', 
        payload->>'contact_email', 
        payload->>'contact_phone', 
        0, 
        payload->>'payment_utr', 
        payload->>'payment_screenshot_path'
    ) RETURNING id INTO new_reg_id;

    -- 3. Process each sport
    sport_list := payload->'sports';
    FOR i IN 0 .. jsonb_array_length(sport_list) - 1 LOOP
        sport_id_val := sport_list->>i;

        -- Check sport validity and capacity (FOR UPDATE locks the sport row)
        SELECT status, capacity, price INTO s_status, s_capacity, s_price
        FROM public.sports 
        WHERE id = sport_id_val FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Sport % not found', sport_id_val;
        END IF;

        IF s_status NOT IN ('OPEN', 'LIMITED') THEN
            RAISE EXCEPTION 'Registration is closed for sport %', sport_id_val;
        END IF;

        -- Check registered count
        SELECT COUNT(*) INTO current_count 
        FROM public.registration_sports 
        WHERE sport_id = sport_id_val;

        IF current_count >= s_capacity THEN
            RAISE EXCEPTION 'Sport % is at full capacity', sport_id_val;
        END IF;

        -- Insert into registration_sports
        INSERT INTO public.registration_sports (registration_id, sport_id)
        VALUES (new_reg_id, sport_id_val);

        -- Add to total amount
        t_amount := t_amount + s_price;

        -- Process players for this sport
        player_list := payload->'players'->sport_id_val;
        IF player_list IS NOT NULL THEN
            FOR j IN 0 .. jsonb_array_length(player_list) - 1 LOOP
                player_obj := player_list->j;
                INSERT INTO public.registration_players (
                    registration_id, sport_id, player_name, is_captain, player_index
                ) VALUES (
                    new_reg_id, 
                    sport_id_val, 
                    player_obj->>'name', 
                    (player_obj->>'is_captain')::BOOLEAN, 
                    (player_obj->>'player_index')::INT
                );
            END LOOP;
        END IF;
    END LOOP;

    -- 4. Update total amount
    UPDATE public.registrations 
    SET total_amount = t_amount 
    WHERE id = new_reg_id;

    -- Return success payload
    RETURN jsonb_build_object(
        'success', true,
        'registration_id', new_reg_id,
        'registration_number', new_reg_num
    );
END;
$$;
