-- Seed existing ATHLIMA sports
INSERT INTO public.sports (id, name, category, capacity, price, min_players, max_players, status) VALUES
('cricket', 'Cricket', 'Team Sport', 8, 1800, 11, 15, 'OPEN'),
('football', 'Football', 'Team Sport', 8, 1800, 9, 16, 'OPEN'),
('basketball-men', 'Basketball (Men)', 'Team Sport', 8, 2000, 7, 13, 'OPEN'),
('basketball-women', 'Basketball (Women)', 'Team Sport', 8, 1000, 3, 6, 'OPEN'),
('volleyball-men', 'Volleyball (Men)', 'Team Sport', 8, 1500, 6, 12, 'OPEN'),
('volleyball-women', 'Volleyball (Women)', 'Team Sport', 8, 1500, 6, 12, 'OPEN'),
('badminton', 'Badminton', 'Team Sport', 8, 1600, 4, 8, 'OPEN'),
('chess', 'Chess', 'Team Sport', 8, 500, 4, 5, 'OPEN'),
('table-tennis', 'Table Tennis', 'Team Sport', 8, 500, 4, 5, 'OPEN'),
('swimming', 'Swimming', 'Individual Sport', 8, 150, 1, 1, 'OPEN')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    capacity = EXCLUDED.capacity,
    price = EXCLUDED.price,
    min_players = EXCLUDED.min_players,
    max_players = EXCLUDED.max_players;
