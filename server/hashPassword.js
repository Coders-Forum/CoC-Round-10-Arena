import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.PEPPER ?? "coc_secret_pepper_2025";
const password = process.argv[2] || "Battle@2025";
const username = process.argv[3] || "team1";
const teamName = (process.argv[4] || "Team Alpha").replace(/'/g, "''");

const hash = crypto
  .createHash("sha256")
  .update(password + pepper)
  .digest("hex");

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🔑 CLASH OF CODERS — CREDENTIAL GENERATOR                      ║
╠═══════════════════════════════════════════════════════════════════╣
║  Username  : ${username}
║  Password  : •••••••••••• (Masked)
║  Hash      : ${hash}
╠═══════════════════════════════════════════════════════════════════╣
║  📋 SQL TO PASTE IN SUPABASE:                                     ║
╚═══════════════════════════════════════════════════════════════════╝

INSERT INTO public.teams (username, password_hash, team_name)
VALUES ('${username.toLowerCase()}', '${hash}', '${teamName}');
`);
