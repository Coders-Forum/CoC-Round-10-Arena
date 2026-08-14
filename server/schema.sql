-- ═══════════════════════════════════════════════════════════════════
-- CLASH OF CODERS — MINIMAL SUPABASE LOGIN SCHEMA
-- Paste and run this in Supabase Dashboard -> SQL Editor -> Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Create teams table (Only what's needed for login & arena entry)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    team_name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disqualified')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast username lookup
CREATE INDEX IF NOT EXISTS idx_teams_username ON public.teams (LOWER(username));

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow backend server full access
CREATE POLICY "Service role access" 
ON public.teams 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- HOW TO ADD A NEW TEAM LOGIN (Example)
-- Replace 'your_username', 'your_password_hash', and 'Your Team Name'
--
-- Password Hash formula: SHA256(password + 'coc_secret_pepper_2025')
-- 
-- Examples:
-- Password: "Battle@2025" -> '639f72782b528a47ff8479e51c89f5bc3a45300a89d70ff8ca21cf22dd5c1798'
-- Password: "password123" -> 'a4a581baef80b5cb4e81561f32cbfe7b6d194cf346ec1082531a7206ba75d27d'
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.teams (username, password_hash, team_name)
VALUES ('your_username', 'your_password_hash', 'Your Team Name')
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash, team_name = EXCLUDED.team_name;
