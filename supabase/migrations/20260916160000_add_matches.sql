-- Matches Table for Schedule
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    round TEXT NOT NULL,
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Ongoing', 'Completed', 'Cancelled')),
    team1_score INTEGER,
    team2_score INTEGER,
    winner_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read matches
CREATE POLICY "Public can read matches" ON public.matches FOR SELECT USING (true);

-- Policy: Admins can manage matches
CREATE POLICY "Admins can manage matches" ON public.matches USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'admin', 'sports_coordinator'))
);
