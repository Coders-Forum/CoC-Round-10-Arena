import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.PEPPER ?? "coc_secret_pepper_2025";
const password = process.argv[2];
const username = process.argv[3];
const teamName = (process.argv[4] || "").replace(/'/g, "''");

if (!password || !username) {
  console.log(`
Usage: node server/hashPassword.js <password> <username> "<teamName>"
Example: node server/hashPassword.js "2024PECCS645" "phoneix" "Phoneix"
  `);
  process.exit(1);
}

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
