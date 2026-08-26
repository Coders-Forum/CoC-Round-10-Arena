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

-- 4. Policy: Allow full read/write access to teams
DROP POLICY IF EXISTS "Service role access" ON public.teams;
DROP POLICY IF EXISTS "Public access on teams" ON public.teams;
CREATE POLICY "Public access on teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);

-- 5. Create contest_state table for admin-controlled stages & disabled lands
CREATE TABLE IF NOT EXISTS public.contest_state (
    id TEXT PRIMARY KEY DEFAULT 'current',
    active_stage TEXT NOT NULL DEFAULT 'round1' CHECK (active_stage IN ('round0', 'round1', 'round2_phase1', 'round2_phase2', 'round2_phase3')),
    disabled_lands JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper if table already exists
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS disabled_lands JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS bypass_login BOOLEAN DEFAULT FALSE;
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS active_results_phase TEXT DEFAULT 'phase1';
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS eliminated_teams JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS phase1_lands JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS phase2_lands JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS phase3_lands JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS manual_ranks JSONB DEFAULT '{}'::jsonb;


-- 6. Enable Row Level Security (RLS) on contest_state
ALTER TABLE public.contest_state ENABLE ROW LEVEL SECURITY;


-- 7. Policy: Allow full read/write access to contest_state
DROP POLICY IF EXISTS "Service role access on contest_state" ON public.contest_state;
DROP POLICY IF EXISTS "Public access on contest_state" ON public.contest_state;
CREATE POLICY "Public access on contest_state" ON public.contest_state FOR ALL USING (true) WITH CHECK (true);

-- 8. Seed initial contest stage
INSERT INTO public.contest_state (id, active_stage)
VALUES ('current', 'round1')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- USE server/seedTeams.sql TO SEED ALL OFFICIAL TEAMS
-- ═══════════════════════════════════════════════════════════════════
