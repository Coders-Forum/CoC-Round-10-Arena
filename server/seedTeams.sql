-- ═══════════════════════════════════════════════════════════════════
-- CLASH OF CODERS — SEED 40 TEAMS INTO SUPABASE
-- Paste and execute in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Ensure all required columns exist in the teams table (Safe Migrations)
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS conquered_land JSONB DEFAULT NULL;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS attack_assignments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS rank INT DEFAULT 1;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS total_lands INT DEFAULT 0;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Ensure contest_state table has disabled_lands column
CREATE TABLE IF NOT EXISTS public.contest_state (
    id TEXT PRIMARY KEY DEFAULT 'current',
    active_stage TEXT NOT NULL DEFAULT 'round1' CHECK (active_stage IN ('round0', 'round1', 'round2_phase1', 'round2_phase2', 'round2_phase3')),
    disabled_lands JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contest_state ADD COLUMN IF NOT EXISTS disabled_lands JSONB DEFAULT '[]'::jsonb;

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_state ENABLE ROW LEVEL SECURITY;

-- Allow read lookups on teams for login authentication
DROP POLICY IF EXISTS "Allow public read on teams" ON public.teams;
CREATE POLICY "Allow public read on teams" ON public.teams
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role all on teams" ON public.teams;
CREATE POLICY "Allow service role all on teams" ON public.teams
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow contest state read and update
DROP POLICY IF EXISTS "Allow public read on contest_state" ON public.contest_state;
CREATE POLICY "Allow public read on contest_state" ON public.contest_state
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all on contest_state" ON public.contest_state;
CREATE POLICY "Allow all on contest_state" ON public.contest_state
FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- 40 TEAMS DATA INSERTS
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('phoneix', 'cdf3c0bb0bfdd7e976f2639cf04f3b59bff16476c6484bf5562bd9ae11c2e72e', 'Phoneix', '[{"name":"Varun S","rollNo":"2024PECCS645","dept":"CSE","year":"III Year","section":"I","email":"svarun8507377@gmail.com","role":"Leader"}]'::jsonb, 0, 1, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('team_weberse', '192c4a9fa4132b681815dc4028e1c7ea7e55d715cc4832277060deb1c8927d19', 'Team Weberse', '[{"name":"Al Jaseera Banu H","rollNo":"2024PECEE106","dept":"EEE","year":"III Year","section":"A","email":"aljaseerabanu@gmail.com","role":"Leader"}]'::jsonb, 0, 2, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('tribyte', '5a9b3dcd6071cd8a7aaee35b2c419939d588e87a83aa0ab9b817d48d1766668f', 'TriByte', '[{"name":"Aradhana M","rollNo":"2025PECCS135","dept":"CSE","year":"II Year","section":"A","email":"aradhana.7611@gmail.com","role":"Leader"}]'::jsonb, 0, 3, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('fluxnext', 'e98cf5d8f167387f8f2740b95d72872041d986212ee6ca4958549196c3df1dfe', 'FluxNext', '[{"name":"Kumaran M","rollNo":"2024PECAI435","dept":"AI & DS","year":"III Year","section":"F","email":"kumaran9th@gmail.com","role":"Leader"}]'::jsonb, 0, 4, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('dynamic_trio', 'f07e7a6f322419d639c3454fef9844a81b14e50524b79e81dd127a49b355b5a2', 'DYNAMIC TRIO', '[{"name":"Harshavarthini G","rollNo":"2025PECIT162","dept":"IT","year":"II Year","section":"A","email":"harshagopinath27@gmail.com","role":"Leader"}]'::jsonb, 0, 5, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('zevik', '0459eb3f5ee97e24c68caf6d8fb5cbaa77fa834ba5429a60d8c386421bc64340', 'Zevik', '[{"name":"Johovit V","rollNo":"2024PECCS969","dept":"CSE","year":"III Year","section":"N","email":"johovit123@gmail.com","role":"Leader"}]'::jsonb, 0, 6, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('ctrl_alt_defeat', '9e0ff2c78466428f745beb86485ab0fc708b51dedeca371e181bd379c278ffd4', 'Ctrl Alt Defeat', '[{"name":"Ramya  M","rollNo":"2024PECIT254","dept":"IT","year":"III Year","section":"C","email":"ramyamothilalnehru@gmail.com","role":"Leader"}]'::jsonb, 0, 7, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_vizzzz', '3b87c0005d79594f33a8d3faf0ccef8bd799ca6b7fa5c6930c53fdb0fc157302', 'Code vizzzz..', '[{"name":"Arunapriya S","rollNo":"2025PECCS138","dept":"CSE","year":"II Year","section":"A","email":"arunapriyas40@gmail.com","role":"Leader"}]'::jsonb, 0, 8, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('team_runtime_error', 'b80ae99d093b160996e0bc5afd85e218ecb6a466bb0b46010d208216cc3227e4', 'Team Runtime error', '[{"name":"Padmajaa S","rollNo":"2024PECCS379","dept":"CSE","year":"III Year","section":"E","email":"padmajaasspn2006@gmail.com","role":"Leader"}]'::jsonb, 0, 9, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('the_nullpointer', 'ec4d7d339e4ed82a786a5f0d86af40acf0012605c78763e5ec43a92ff983f7cb', 'The NullPointer', '[{"name":"TANISHKA PANDEY","rollNo":"2024PECCS523","dept":"CSE","year":"III Year","section":"G","email":"tanishkapandey2006@gmail.com","role":"Leader"}]'::jsonb, 0, 10, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('archer_queens', '69c6d8b7364d445c1cdb55aa546d2586c72e5edb28032161d27567e901998ef8', 'Archer queens', '[{"name":"Ashwini S","rollNo":"2024PECCS136","dept":"CSE","year":"III Year","section":"A","email":"ashwini160806@gmail.com","role":"Leader"}]'::jsonb, 0, 11, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('team_titans', 'df359f1ec61e28fe4b83c054de1664dc88dd94556d8ab896b448adef965635bb', 'Team Titans', '[{"name":"Nambi GT","rollNo":"2024PECAI472","dept":"AI & DS","year":"III Year","section":"F","email":"gtnambi7@gmail.com","role":"Leader"}]'::jsonb, 0, 12, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('zsymox', '429aa4c1dd26a7e7042f7a70b95e97863916ef65e13332e77a643ccad45ab9d3', 'Zsymox', '[{"name":"Barath Kumar Basker","rollNo":"2025PECCS628","dept":"CSE","year":"II Year","section":"I","email":"barathkumarbasker2024@gmail.com","role":"Leader"}]'::jsonb, 0, 13, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('team_s', '7fed5a3d5c943769df2eb5151d165be83ed22327b67359b65c8226b6328b5bd2', 'team_S', '[{"name":"SUBASRI S","rollNo":"2025PECCS525","dept":"CSE","year":"II Year","section":"G","email":"subasrisubramaniyan07@gmail.com","role":"Leader"}]'::jsonb, 0, 14, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('triple_threat', '57024671fbf8ab508ed7ca4683af74567c4102fc9477c1c5df56b038cb236a71', 'Triple Threat', '[{"name":"Keerthana R","rollNo":"2024PECCS293","dept":"CSE","year":"III Year","section":"D","email":"keerthanaramkumar20@gmail.com","role":"Leader"}]'::jsonb, 0, 15, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('team_wizards', 'cfaba5176f1ac8f6f3d9ba24265dd008100d78adb5b6b3c1e1fe81665d9b3ae0', 'Team Wizards', '[{"name":"Mohammed Arshath K H","rollNo":"2024PECCS804","dept":"CSE","year":"III Year","section":"L","email":"princearshath786@gmail.com","role":"Leader"}]'::jsonb, 0, 16, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('the_fire_coders', '96707e31fc02f453a8ce71ab358d0b905d2e1d8933f7d691756d839a8132dfc4', 'THE FIRE CODERS', '[{"name":"SAYANTANI BANERJEE","rollNo":"2024PECCS464","dept":"CSE","year":"III Year","section":"F","email":"theinvinciblefire@gmail.com","role":"Leader"}]'::jsonb, 0, 17, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('pulse', '2a3d4ac6a2115140469b465edfa01962198d9a3e02cd6b1fcf1f18e8561e58fd', 'Pulse', '[{"name":"Lavanya J","rollNo":"2025PECIT216","dept":"IT","year":"II Year","section":"B","email":"lavanya57208@gmail.com","role":"Leader"}]'::jsonb, 0, 18, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_crafters', 'ad8794beb3283a3b6c485e800440170726e8c891f46fee1357cee36f61f85f69', 'Code crafters', '[{"name":"Gayathri N","rollNo":"2024PECCS214","dept":"CSE","year":"III Year","section":"B","email":"gayathrinarayanan1204@gmail.com","role":"Leader"}]'::jsonb, 0, 19, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('omnipotent_shadow', 'd0c31eeb5173f64b07dde1c713b4a3960bf817876619df831881a61656e71376', 'Omnipotent shadow', '[{"name":"Abishek. B","rollNo":"2024PECEE167","dept":"EEE","year":"III Year","section":"B","email":"b.abishek312@gmail.com","role":"Leader"}]'::jsonb, 0, 20, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('algonauts', 'b21106ffb51911ce7fbed14ac549e5f0ef5eb5aa7689e64def69165647a6832a', 'AlgoNauts', '[{"name":"Sajan Kumaran M U","rollNo":"2024PECCS820","dept":"CSE","year":"III Year","section":"L","email":"sajankumaran07@gmail.com","role":"Leader"}]'::jsonb, 0, 21, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('flycode', 'fda25073916a7a39c207bb80ade9db13724f8318e6a027888c00c1392a5e01ce', 'Flycode', '[{"name":"Jasmine banu D","rollNo":"2025PECCS261","dept":"CSE","year":"II Year","section":"C","email":"jasmineias786@gmail.com","role":"Leader"}]'::jsonb, 0, 22, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('dracarys', 'c7779c4016894653577efa257e2c854a59384cc5a0f6959755f6ff63aff28428', 'dracarys', '[{"name":"LOKESH S","rollNo":"2024PECIT504","dept":"IT","year":"III Year","section":"G","email":"lokeshsubramani1904@gmail.com","role":"Leader"}]'::jsonb, 0, 23, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('alpha_algorithms', '88100cf76ca4209e617e9a7bc25ddc9f1b5926497894b01af4a0c268a620262a', 'Alpha Algorithms', '[{"name":"GOMATHI V","rollNo":"2024PECCS220","dept":"CSE","year":"III Year","section":"B","email":"gomathivasu266@gmail.com","role":"Leader"}]'::jsonb, 0, 24, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('black_box', 'db9fa57229959c628d78bf4977be2ad7b9d82b346bb3e9bf81e396c69c3e1ce5', 'Black box', '[{"name":"Pretheba.E","rollNo":"2024PECCS402","dept":"CSE","year":"III Year","section":"E","email":"pretheba1266@gmail.com","role":"Leader"}]'::jsonb, 0, 25, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code3', 'd2b6e2e01592f8f65aaced60aedf2c4017b9341dde97d31b885d5c9f3aa160c2', 'Code³', '[{"name":"Akshaya S M","rollNo":"2024PECCS114","dept":"CSE","year":"III Year","section":"A","email":"smakshaya537@gmail.com","role":"Leader"}]'::jsonb, 0, 26, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_warriers', '372c4be0d6ce53f516f36f0c5c90080363b7aa110bd1ef28219d57240c3b2b72', 'Code warriers', '[{"name":"Harini A","rollNo":"2024PECCS228","dept":"CSE","year":"III Year","section":"C","email":"anandharini006@gmail.com","role":"Leader"}]'::jsonb, 0, 27, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_conquerors', '47714df42c7b9db32cd94aa0f6245230257df03ce7a9177d9febf03ef5e480b9', 'CODE CONQUERORS', '[{"name":"BHARATHI POORNA K","rollNo":"2024PECCS147","dept":"CSE","year":"III Year","section":"A","email":"bharathipoorna0710@gmail.com","role":"Leader"}]'::jsonb, 0, 28, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('brainiacs', 'd75b22b30530a24c106ad589d3857a8d447e793aa2f681b6e45bae7fd7b61390', 'Brainiacs', '[{"name":"Geetha Gayathri H","rollNo":"2024PECML121","dept":"AI & ML","year":"III Year","section":"A","email":"hasthigeetha@gmail.com","role":"Leader"}]'::jsonb, 0, 29, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('digital_nemesis', '18a3b6cc544494452477dc2d068560ae410b3389d8771e018a4031661a84f33f', 'Digital Nemesis', '[{"name":"M.Madhuri","rollNo":"2024PECCS353","dept":"CSE","year":"III Year","section":"E","email":"madhurimylu2007@gmail.com","role":"Leader"}]'::jsonb, 0, 30, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_warriors', 'e218339237088382f0040d253311cddbddedcb4dc1cce096cb1fe5eb89155916', 'Code Warriors⚡', '[{"name":"MANISHA H","rollNo":"2025PECCS343","dept":"CSE","year":"II Year","section":"D","email":"manishaharikrishnan2008@gmail.com","role":"Leader"}]'::jsonb, 0, 31, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('sheesdiva', '1e73256e92c6f2339582812fad64cc2cc055114e71ce085a576ee71c607ffeb8', 'Sheesdiva', '[{"name":"SAMEEHA S","rollNo":"2024PECCS448","dept":"CSE","year":"III Year","section":"F","email":"sameehasultan2023@gmail.com","role":"Leader"}]'::jsonb, 0, 32, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('sangavi_s', 'a225c5b137bcc590981aa4271cc40d16f20a38c63adb04b1b25f8b9607907f4c', 'Sangavi S', '[{"name":"Sangavi S","rollNo":"2025PECCS472","dept":"CSE","year":"II Year","section":"F","email":"ssdsangavi0709@gmail.com","role":"Leader"}]'::jsonb, 0, 33, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('byteforce', 'd8d758135800c8621b873e6fe88f10901bd6e14eb574b7537a26b3a93fae9aec', 'ByteForce', '[{"name":"P Rachel Nishika","rollNo":"2024PECCS412","dept":"CSE","year":"III Year","section":"E","email":"p.rachelnishika@gmail.com","role":"Leader"}]'::jsonb, 0, 34, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('algoverse', '4ce2b494f2986c04430b1b73052374c31cfb21fb38cb5280623d55fc2c73a7f6', 'Algoverse', '[{"name":"Bina Y","rollNo":"2024PECCS153","dept":"CSE","year":"III Year","section":"A","email":"peccse153@gmail.com","role":"Leader"}]'::jsonb, 0, 35, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('algorhythm', 'b232175332e4b4f731d2c862a1de2f7baef3544923335db54aec77109fffe23c', 'AlgoRhythm', '[{"name":"Prema Sahithi Aremanda","rollNo":"2024PECCS129","dept":"CSE","year":"III Year","section":"A","email":"navyaaremanda@gmail.com","role":"Leader"}]'::jsonb, 0, 36, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('varshini_s', '2a2191e3a42f667e67a84fa8e3d2b21238a4dc608d64cfe6600a16e846bc50b5', 'Varshini S', '[{"name":"Varshini S","rollNo":"2024PECCS697","dept":"CSBS","year":"III Year","section":"B","email":"varshinitab11@gmail.com","role":"Leader"}]'::jsonb, 0, 37, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('sarvajeeth_thejoananda', '77de018247605c745f199ed7b9a9439bf52fb76d91e9edea8232469d9362dc8d', 'SARVAJEETH THEJOANANDA', '[{"name":"SARVAJEETH THEJOANANDA","rollNo":"2024PECCS224","dept":"CSE","year":"III Year","section":"J","email":"theinvinciblefire@gmail.com","role":"Leader"}]'::jsonb, 0, 38, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('hackpixel', 'a616079d59074950e7dfbfe7607401e3c5635dd628f2e72ed0391ad61009b7d6', 'HACKPIXEL', '[{"name":"PRAVEEN RAJ E","rollNo":"2024PECEC354","dept":"ECE","year":"III Year","section":"E","email":"praveenraje000@gmail.com","role":"Leader"}]'::jsonb, 0, 39, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)
VALUES ('code_blind', '8b8c36659abea5106b3862edad2f8f9e684e7d0e63face64032f72ad87a3b8f4', 'Code Blind', '[{"name":"Dhanalakshmi N","rollNo":"2024PECCS172","dept":"CSE","year":"III Year","section":"B","email":"dsambooranam@gmail.com","role":"Leader"}]'::jsonb, 0, 40, 'active')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  members = EXCLUDED.members,
  rank = EXCLUDED.rank;

