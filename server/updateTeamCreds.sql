-- ═══════════════════════════════════════════════════════════════════
-- CLASH OF CODERS — CREDENTIAL RESET MIGRATION SCRIPT
-- Paste and execute in Supabase Dashboard -> SQL Editor -> Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Insert or update the demo account (Username: demo | Password: Battle@2025)
INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES (
    'demo',
    '849a3e984185e800f04beea9f329fbecf909725bcaf113b88d38ac0c9201107f',
    'Demo Team',
    '[{"name":"Demo User","role":"Leader"}]'::jsonb,
    0,
    99,
    'active'
)
ON CONFLICT (username) DO UPDATE SET
    password_hash = '849a3e984185e800f04beea9f329fbecf909725bcaf113b88d38ac0c9201107f',
    status = 'active';

-- 2. Insert or update the coc2026 common account (Username: coc2026 | Password: coc@2026)
INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES (
    'coc2026',
    '0bf6084ad5764280aeb277de4352e8a13de2ce001c1ba8dc8d4b23c44bfadaf9',
    'CoC 2026 Team',
    '[{"name":"CoC Contestant","role":"Leader"}]'::jsonb,
    0,
    1,
    'active'
)
ON CONFLICT (username) DO UPDATE SET
    password_hash = '0bf6084ad5764280aeb277de4352e8a13de2ce001c1ba8dc8d4b23c44bfadaf9',
    status = 'active';

-- 3. Update ALL other teams in the database to use common password: "coc@2026"
UPDATE public.teams
SET password_hash = '0bf6084ad5764280aeb277de4352e8a13de2ce001c1ba8dc8d4b23c44bfadaf9'
WHERE username NOT IN ('demo', 'coc2026');
