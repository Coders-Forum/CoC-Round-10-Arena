import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read seedTeams.sql
const sqlPath = path.join(__dirname, "../seedTeams.sql");
const sql = fs.readFileSync(sqlPath, "utf-8");

// Regex to extract: username and rollNo (which is the plain password)
const lines = sql.split("\n");
const users = [];

for (const line of lines) {
  if (line.startsWith("VALUES (")) {
    const userMatch = line.match(/VALUES \('([^']+)'/);
    const rollMatch = line.match(/"rollNo":"([^"]+)"/);
    if (userMatch && rollMatch) {
      users.push({
        username: userMatch[1],
        password: rollMatch[1]
      });
    }
  }
}

let csv = "username,password\n";
for (const u of users) {
  csv += `${u.username},${u.password}\n`;
}

const csvPath = path.join(__dirname, "users.csv");
fs.writeFileSync(csvPath, csv.trim() + "\n");
console.log(`✅ Successfully generated ${csvPath} with ${users.length} official team credentials!`);
