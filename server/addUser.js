import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const pepper = process.env.PEPPER ?? "coc_secret_pepper_2025";

// CLI arguments: node server/addUser.js <username> <password> <teamName>
const username = (process.argv[2] || "").trim().toLowerCase();
const password = process.argv[3] || "";
const teamName = process.argv[4] || username;

if (!username || !password) {
  console.log(`
Usage:
  node server/addUser.js <username> <password> "<Team Name>"

Example:
  node server/addUser.js team2 Secret@123 "Cyber Titans"
  `);
  process.exit(1);
}

if (!/^[a-zA-Z0-9._-]{3,50}$/.test(username)) {
  console.error("❌ Invalid username format. Must be 3-50 chars: letters, numbers, . _ -");
  process.exit(1);
}

if (password.length < 6 || password.length > 100) {
  console.error("❌ Password must be between 6 and 100 characters.");
  process.exit(1);
}

// Generate secure SHA-256 hash with secret pepper
const passwordHash = crypto
  .createHash("sha256")
  .update(password + pepper)
  .digest("hex");

async function addUser() {
  console.log(`⏳ Adding user "${username}" to Supabase...`);

  const { data, error } = await supabase
    .from("teams")
    .upsert(
      {
        username,
        password_hash: passwordHash,
        team_name: teamName,
        status: "active",
      },
      { onConflict: "username" }
    )
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to add user to Supabase:", error.message);
  } else {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   ✅ USER CREATED & ACTIVE IN SUPABASE!                           ║
╠═══════════════════════════════════════════════════════════════════╣
║  Username   : ${data.username}
║  Password   : •••••••••••• (Stored securely)
║  Team Name  : ${data.team_name}
║  Status     : ${data.status}
╚═══════════════════════════════════════════════════════════════════╝
👉 This team can now immediately log in and enter the 3D Arena!
    `);
  }
}

addUser();
