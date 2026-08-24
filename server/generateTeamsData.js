import crypto from "crypto";
import fs from "fs";

const rawData = [
  {
    "Sno": 1,
    "Team Name": "Phoneix",
    "Team Leader Name": "Varun S",
    "Team Department": "CSE",
    "Team Leader Email Id": "svarun8507377@gmail.com",
    "Cumulative Marks": 348.52,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "I",
    "Team Leader Roll Number": "2024PECCS645"
  },
  {
    "Sno": 2,
    "Team Name": "Team Weberse",
    "Team Leader Name": "Al Jaseera Banu H",
    "Team Department": "EEE",
    "Team Leader Email Id": "aljaseerabanu@gmail.com",
    "Cumulative Marks": 321.64,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECEE106"
  },
  {
    "Sno": 3,
    "Team Name": "TriByte",
    "Team Leader Name": "Aradhana M",
    "Team Department": "CSE",
    "Team Leader Email Id": "aradhana.7611@gmail.com",
    "Cumulative Marks": 288.42,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2025PECCS135"
  },
  {
    "Sno": 4,
    "Team Name": "FluxNext",
    "Team Leader Name": "Kumaran M",
    "Team Department": "AI & DS",
    "Team Leader Email Id": "kumaran9th@gmail.com",
    "Cumulative Marks": 265.11,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "F",
    "Team Leader Roll Number": "2024PECAI435"
  },
  {
    "Sno": 5,
    "Team Name": "DYNAMIC TRIO",
    "Team Leader Name": "Harshavarthini G",
    "Team Department": "IT",
    "Team Leader Email Id": "harshagopinath27@gmail.com",
    "Cumulative Marks": 264.16,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2025PECIT162"
  },
  {
    "Sno": 6,
    "Team Name": "Zevik",
    "Team Leader Name": "Johovit V",
    "Team Department": "CSE",
    "Team Leader Email Id": "johovit123@gmail.com",
    "Cumulative Marks": 252.78,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "N",
    "Team Leader Roll Number": "2024PECCS969"
  },
  {
    "Sno": 7,
    "Team Name": "Ctrl Alt Defeat",
    "Team Leader Name": "Ramya  M",
    "Team Department": "IT",
    "Team Leader Email Id": "ramyamothilalnehru@gmail.com",
    "Cumulative Marks": 239.86,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "C",
    "Team Leader Roll Number": "2024pecit254"
  },
  {
    "Sno": 8,
    "Team Name": "Code vizzzz..",
    "Team Leader Name": "Arunapriya S",
    "Team Department": "CSE",
    "Team Leader Email Id": "arunapriyas40@gmail.com",
    "Cumulative Marks": 226.56,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2025PECCS138"
  },
  {
    "Sno": 9,
    "Team Name": "Team Runtime error",
    "Team Leader Name": "Padmajaa S",
    "Team Department": "CSE",
    "Team Leader Email Id": "padmajaasspn2006@gmail.com",
    "Cumulative Marks": 215.76,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "E",
    "Team Leader Roll Number": "2024PECCS379"
  },
  {
    "Sno": 10,
    "Team Name": "The NullPointer",
    "Team Leader Name": "TANISHKA PANDEY",
    "Team Department": "CSE",
    "Team Leader Email Id": "tanishkapandey2006@gmail.com",
    "Cumulative Marks": 212.57,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "G",
    "Team Leader Roll Number": "2024PECCS523"
  },
  {
    "Sno": 11,
    "Team Name": "Archer queens",
    "Team Leader Name": "Ashwini S",
    "Team Department": "CSE",
    "Team Leader Email Id": "ashwini160806@gmail.com",
    "Cumulative Marks": 210.58,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECCS136"
  },
  {
    "Sno": 12,
    "Team Name": "Team Titans",
    "Team Leader Name": "Nambi GT",
    "Team Department": "AI & DS",
    "Team Leader Email Id": "gtnambi7@gmail.com",
    "Cumulative Marks": 207.03,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "F",
    "Team Leader Roll Number": "2024PECAI472"
  },
  {
    "Sno": 13,
    "Team Name": "Zsymox",
    "Team Leader Name": "Barath Kumar Basker",
    "Team Department": "CSE",
    "Team Leader Email Id": "barathkumarbasker2024@gmail.com",
    "Cumulative Marks": 197.42,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "I",
    "Team Leader Roll Number": "2025PECCS628"
  },
  {
    "Sno": 14,
    "Team Name": "team_S",
    "Team Leader Name": "SUBASRI S",
    "Team Department": "CSE",
    "Team Leader Email Id": "subasrisubramaniyan07@gmail.com",
    "Cumulative Marks": 196.1,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "G",
    "Team Leader Roll Number": "2025PECCS525"
  },
  {
    "Sno": 15,
    "Team Name": "Triple Threat",
    "Team Leader Name": "Keerthana R",
    "Team Department": "CSE",
    "Team Leader Email Id": "keerthanaramkumar20@gmail.com",
    "Cumulative Marks": 189.5,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "D",
    "Team Leader Roll Number": "2024PECCS293"
  },
  {
    "Sno": 16,
    "Team Name": "Team Wizards",
    "Team Leader Name": "Mohammed Arshath K H",
    "Team Department": "CSE",
    "Team Leader Email Id": "princearshath786@gmail.com",
    "Cumulative Marks": 182.29,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "L",
    "Team Leader Roll Number": "2024PECCS804"
  },
  {
    "Sno": 17,
    "Team Name": "THE FIRE CODERS",
    "Team Leader Name": "SAYANTANI BANERJEE",
    "Team Department": "CSE",
    "Team Leader Email Id": "theinvinciblefire@gmail.com",
    "Cumulative Marks": 177.57,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "F",
    "Team Leader Roll Number": "2024PECCS464"
  },
  {
    "Sno": 18,
    "Team Name": "Pulse",
    "Team Leader Name": "Lavanya J",
    "Team Department": "IT",
    "Team Leader Email Id": "lavanya57208@gmail.com",
    "Cumulative Marks": 177.07,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2025PECIT216"
  },
  {
    "Sno": 19,
    "Team Name": "Code crafters",
    "Team Leader Name": "Gayathri N",
    "Team Department": "CSE",
    "Team Leader Email Id": "gayathrinarayanan1204@gmail.com",
    "Cumulative Marks": 177.05,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2024PECCS214"
  },
  {
    "Sno": 20,
    "Team Name": "Omnipotent shadow",
    "Team Leader Name": "Abishek. B",
    "Team Department": "EEE",
    "Team Leader Email Id": "b.abishek312@gmail.com",
    "Cumulative Marks": 162.64,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2024PECEE167"
  },
  {
    "Sno": 21,
    "Team Name": "AlgoNauts",
    "Team Leader Name": "Sajan Kumaran M U",
    "Team Department": "CSE",
    "Team Leader Email Id": "sajankumaran07@gmail.com",
    "Cumulative Marks": 161.53,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "L",
    "Team Leader Roll Number": "2024PECCS820"
  },
  {
    "Sno": 22,
    "Team Name": "Flycode",
    "Team Leader Name": "Jasmine banu D",
    "Team Department": "CSE",
    "Team Leader Email Id": "jasmineias786@gmail.com",
    "Cumulative Marks": 156.59,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "C",
    "Team Leader Roll Number": "2025PECCS261"
  },
  {
    "Sno": 23,
    "Team Name": "dracarys",
    "Team Leader Name": "LOKESH S",
    "Team Department": "IT",
    "Team Leader Email Id": "lokeshsubramani1904@gmail.com",
    "Cumulative Marks": 155.65,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "G",
    "Team Leader Roll Number": "2024PECIT504"
  },
  {
    "Sno": 24,
    "Team Name": "Alpha Algorithms",
    "Team Leader Name": "GOMATHI V",
    "Team Department": "CSE",
    "Team Leader Email Id": "gomathivasu266@gmail.com",
    "Cumulative Marks": 151.47,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2024PECCS220"
  },
  {
    "Sno": 25,
    "Team Name": "Black box",
    "Team Leader Name": "Pretheba.E",
    "Team Department": "CSE",
    "Team Leader Email Id": "pretheba1266@gmail.com",
    "Cumulative Marks": 147.05,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "E",
    "Team Leader Roll Number": "2024PECCS402"
  },
  {
    "Sno": 26,
    "Team Name": "Code³",
    "Team Leader Name": "Akshaya S M",
    "Team Department": "CSE",
    "Team Leader Email Id": "smakshaya537@gmail.com",
    "Cumulative Marks": 146.07,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECCS114"
  },
  {
    "Sno": 27,
    "Team Name": "Code warriers",
    "Team Leader Name": "Harini A",
    "Team Department": "CSE",
    "Team Leader Email Id": "anandharini006@gmail.com",
    "Cumulative Marks": 144.39,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "C",
    "Team Leader Roll Number": "2024PECCS228"
  },
  {
    "Sno": 28,
    "Team Name": "CODE CONQUERORS",
    "Team Leader Name": "BHARATHI POORNA K",
    "Team Department": "CSE",
    "Team Leader Email Id": "bharathipoorna0710@gmail.com",
    "Cumulative Marks": 144.15,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECCS147"
  },
  {
    "Sno": 29,
    "Team Name": "Brainiacs",
    "Team Leader Name": "Geetha Gayathri H",
    "Team Department": "AI & ML",
    "Team Leader Email Id": "hasthigeetha@gmail.com",
    "Cumulative Marks": 138.07,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECML121"
  },
  {
    "Sno": 30,
    "Team Name": "Digital Nemesis",
    "Team Leader Name": "M.Madhuri",
    "Team Department": "CSE",
    "Team Leader Email Id": "madhurimylu2007@gmail.com",
    "Cumulative Marks": 137.52,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "E",
    "Team Leader Roll Number": "2024PECCS353"
  },
  {
    "Sno": 31,
    "Team Name": "Code Warriors⚡",
    "Team Leader Name": "MANISHA H",
    "Team Department": "CSE",
    "Team Leader Email Id": "manishaharikrishnan2008@gmail.com",
    "Cumulative Marks": 137.03,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "D",
    "Team Leader Roll Number": "2025PECCS343"
  },
  {
    "Sno": 32,
    "Team Name": "Sheesdiva",
    "Team Leader Name": "SAMEEHA S",
    "Team Department": "CSE",
    "Team Leader Email Id": "sameehasultan2023@gmail.com",
    "Cumulative Marks": 135.65,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "F",
    "Team Leader Roll Number": "2024PECCS448"
  },
  {
    "Sno": 33,
    "Team Name": "Sangavi S",
    "Team Leader Name": "Sangavi S",
    "Team Department": "CSE",
    "Team Leader Email Id": "ssdsangavi0709@gmail.com",
    "Cumulative Marks": 127.05,
    "Team Leader Year of Study": "II",
    "Team Leader Section": "F",
    "Team Leader Roll Number": "2025PECCS472"
  },
  {
    "Sno": 34,
    "Team Name": "ByteForce",
    "Team Leader Name": "P Rachel Nishika",
    "Team Department": "CSE",
    "Team Leader Email Id": "p.rachelnishika@gmail.com",
    "Cumulative Marks": 125.15,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "E",
    "Team Leader Roll Number": "2024PECCS412"
  },
  {
    "Sno": 35,
    "Team Name": "Algoverse",
    "Team Leader Name": "Bina Y",
    "Team Department": "CSE",
    "Team Leader Email Id": "peccse153@gmail.com",
    "Cumulative Marks": 122.67,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECCS153"
  },
  {
    "Sno": 36,
    "Team Name": "AlgoRhythm",
    "Team Leader Name": "Prema Sahithi Aremanda",
    "Team Department": "CSE",
    "Team Leader Email Id": "navyaaremanda@gmail.com",
    "Cumulative Marks": 119.89,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "A",
    "Team Leader Roll Number": "2024PECCS129"
  },
  {
    "Sno": 37,
    "Team Name": "Varshini S",
    "Team Leader Name": "Varshini S",
    "Team Department": "CSBS",
    "Team Leader Email Id": "varshinitab11@gmail.com",
    "Cumulative Marks": 118.47,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2024PECCS697"
  },
  {
    "Sno": 38,
    "Team Name": "SARVAJEETH THEJOANANDA",
    "Team Leader Name": "SARVAJEETH THEJOANANDA",
    "Team Department": "CSE",
    "Team Leader Email Id": "theinvinciblefire@gmail.com",
    "Cumulative Marks": 119.5,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "J",
    "Team Leader Roll Number": "2024PECCS224"
  },
  {
    "Sno": 39,
    "Team Name": "HACKPIXEL",
    "Team Leader Name": "PRAVEEN RAJ E",
    "Team Department": "ECE",
    "Team Leader Email Id": "praveenraje000@gmail.com",
    "Cumulative Marks": 116.41,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "E",
    "Team Leader Roll Number": "2024PECEC354"
  },
  {
    "Sno": 40,
    "Team Name": "Code Blind",
    "Team Leader Name": "Dhanalakshmi N",
    "Team Department": "CSE",
    "Team Leader Email Id": "dsambooranam@gmail.com",
    "Cumulative Marks": 115.57,
    "Team Leader Year of Study": "III",
    "Team Leader Section": "B",
    "Team Leader Roll Number": "2024PECCS172"
  }
];

const PEPPER = "coc_secret_pepper_2025";

function cleanUsername(teamName) {
  return teamName
    .toLowerCase()
    .replace(/³/g, "3")
    .replace(/⚡/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function hashPassword(pass) {
  return crypto.createHash("sha256").update(pass + PEPPER).digest("hex");
}

const processed = rawData.map((item) => {
  const username = cleanUsername(item["Team Name"]);
  const password = item["Team Leader Roll Number"].trim().toUpperCase();
  const passwordHash = hashPassword(password);
  return {
    sno: item.Sno,
    teamName: item["Team Name"].trim(),
    leader: item["Team Leader Name"].trim(),
    rollNo: password,
    dept: item["Team Department"].trim(),
    year: `${item["Team Leader Year of Study"].trim()} Year`,
    section: item["Team Leader Section"].trim(),
    email: item["Team Leader Email Id"].trim(),
    marks: item["Cumulative Marks"],
    username,
    password,
    passwordHash
  };
});

// 1. Generate SQL
let sql = `-- ═══════════════════════════════════════════════════════════════════
-- CLASH OF CODERS — SEED 40 TEAMS INTO SUPABASE
-- Paste and execute in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════\n\n`;

processed.forEach((t) => {
  const safeName = t.teamName.replace(/'/g, "''");
  const membersJson = JSON.stringify([
    { name: t.leader, rollNo: t.rollNo, dept: t.dept, year: t.year, section: t.section, email: t.email, role: "Leader" }
  ]).replace(/'/g, "''");

  sql += `INSERT INTO public.teams (username, password_hash, team_name, members, score, rank, status)\n`;
  sql += `VALUES ('${t.username}', '${t.passwordHash}', '${safeName}', '${membersJson}'::jsonb, 0, ${t.sno}, 'active')\n`;
  sql += `ON CONFLICT (username) DO UPDATE SET\n`;
  sql += `  password_hash = EXCLUDED.password_hash,\n`;
  sql += `  team_name = EXCLUDED.team_name,\n`;
  sql += `  members = EXCLUDED.members,\n`;
  sql += `  rank = EXCLUDED.rank;\n\n`;
});

fs.writeFileSync("server/seedTeams.sql", sql);
console.log("Successfully wrote server/seedTeams.sql");

// 2. Update src/leaderboard/leaderboardData.js
const round0 = processed.map(t => ({
  teamName: t.teamName,
  leader: t.leader,
  rollNo: t.rollNo,
  dept: t.dept,
  year: t.year,
  section: t.section
}));

const round1 = processed.slice(0, 25).map(t => ({
  teamName: t.teamName,
  leader: t.leader,
  rollNo: t.rollNo,
  dept: t.dept,
  year: t.year,
  section: t.section
}));

const phase1 = processed.slice(0, 10).map(t => ({
  teamName: t.teamName,
  leader: t.leader,
  rollNo: t.rollNo,
  dept: t.dept,
  year: t.year,
  section: t.section
}));

const phase2 = processed.slice(0, 10).map(t => ({
  teamName: t.teamName,
  leader: t.leader,
  rollNo: t.rollNo,
  dept: t.dept,
  year: t.year,
  section: t.section
}));

const overall = processed.slice(0, 10).map(t => ({
  teamName: t.teamName,
  leader: t.leader,
  rollNo: t.rollNo,
  dept: t.dept,
  year: t.year,
  section: t.section
}));

const fileContent = `/**
 * Leaderboard Data — Clash of Coders
 * ------------------------------------
 * Each entry has:
 *   teamName    : string  — Team name displayed
 *   leader      : string  — Team leader's full name
 *   rollNo      : string  — Leader's roll number
 *   dept        : string  — Department (e.g. "CSE", "ECE")
 *   year        : string  — Year of study (e.g. "2nd Year")
 *   section     : string  — Section (e.g. "A", "B")
 */

// ── Round 0 — All 40 Registered Teams ─────────────────────────────────
export const round0Data = ${JSON.stringify(round0, null, 4)};

// ── Round 1 — Top 25 Teams ────────────────────────────────────────────
export const round1Data = ${JSON.stringify(round1, null, 4)};

// ── Round 2 — Phase 1 ─────────────────────────────────────────────────
export const phase1Data = ${JSON.stringify(phase1, null, 4)};

// ── Round 2 — Phase 2 ─────────────────────────────────────────────────
export const phase2Data = ${JSON.stringify(phase2, null, 4)};

// ── Final Standings ───────────────────────────────────────────────────
export const overallData = ${JSON.stringify(overall, null, 4)};
`;

fs.writeFileSync("src/leaderboard/leaderboardData.js", fileContent);
console.log("Successfully updated src/leaderboard/leaderboardData.js");
