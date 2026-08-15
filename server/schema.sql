-- ═══════════════════════════════════════════════════════════════════
-- CLASH OF CODERS — SUPABASE DATABASE SCHEMA
-- Paste and run this in Supabase Dashboard -> SQL Editor -> Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    team_name TEXT NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    conquered_land JSONB DEFAULT NULL,
    attack_assignments JSONB DEFAULT '[]'::jsonb,
    score INT DEFAULT 0,
    rank INT DEFAULT 1,
    total_lands INT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disqualified')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast username lookup
CREATE INDEX IF NOT EXISTS idx_teams_username ON public.teams (LOWER(username));

-- 3. Enable Row Level Security (RLS) on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow backend server full access to teams
DROP POLICY IF EXISTS "Service role access" ON public.teams;
CREATE POLICY "Service role access" 
ON public.teams 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 5. Create contest_state table for admin-controlled stages
CREATE TABLE IF NOT EXISTS public.contest_state (
    id TEXT PRIMARY KEY DEFAULT 'current',
    active_stage TEXT NOT NULL DEFAULT 'round1' CHECK (active_stage IN ('round0', 'round1', 'round2_phase1', 'round2_phase2', 'round2_phase3')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) on contest_state
ALTER TABLE public.contest_state ENABLE ROW LEVEL SECURITY;

-- 7. Policy: Allow backend server full access to contest_state
DROP POLICY IF EXISTS "Service role access on contest_state" ON public.contest_state;
CREATE POLICY "Service role access on contest_state" 
ON public.contest_state 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 8. Seed initial contest stage
INSERT INTO public.contest_state (id, active_stage)
VALUES ('current', 'round1')
ON CONFLICT (id) DO NOTHING;

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
