import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Config
const TARGET_URL = process.env.TARGET_URL || "https://clashofcoders-theta.vercel.app/api/login";
const MEMBERS_PER_TEAM = 3;

// Load credentials from CSV
const csvPath = path.join(__dirname, "users.csv");
const lines = fs.readFileSync(csvPath, "utf-8").trim().split("\n").slice(1);
const teams = lines.map(line => {
  const [username, password] = line.trim().split(",");
  return { username, password };
}).filter(u => u.username && u.password);

const TOTAL_USERS = teams.length * MEMBERS_PER_TEAM;

console.log("═══════════════════════════════════════════════════════════════");
console.log("👥 3-MEMBER TEAM CONCURRENT LOGIN LOAD TEST");
console.log(`🎯 Target Endpoint:        ${TARGET_URL}`);
console.log(`🏢 Total Unique Teams:      ${teams.length}`);
console.log(`🧑‍💻 Members per Team:      ${MEMBERS_PER_TEAM}`);
console.log(`🚀 Total Concurrent Logins: ${TOTAL_USERS} (40 teams × 3 devices simultaneously)`);
console.log("═══════════════════════════════════════════════════════════════\n");

async function loginMember(team, memberNumber) {
  const start = performance.now();
  try {
    const res = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Connection": "close",
      },
      body: JSON.stringify({
        username: team.username,
        password: team.password,
      }),
    });

    const elapsed = Math.round(performance.now() - start);
    const data = await res.json().catch(() => ({}));

    return {
      team: team.username,
      member: `Member #${memberNumber}`,
      token: data.sessionToken || null,
      status: res.status,
      success: res.ok && data.success === true && !!data.sessionToken,
      timeMs: elapsed,
      message: data.message || (res.ok ? "OK" : `HTTP ${res.status}`),
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    return {
      team: team.username,
      member: `Member #${memberNumber}`,
      token: null,
      status: 0,
      success: false,
      timeMs: elapsed,
      message: err.message,
    };
  }
}

async function run() {
  const tasks = [];
  const startTime = performance.now();

  // Create 3 concurrent login requests for each of the 40 teams
  teams.forEach(team => {
    for (let member = 1; member <= MEMBERS_PER_TEAM; member++) {
      tasks.push(loginMember(team, member));
    }
  });

  console.log(`⚡ Firing all ${tasks.length} login requests simultaneously...\n`);
  const results = await Promise.all(tasks);
  const totalDuration = Math.round(performance.now() - startTime);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const times = results.map(r => r.timeMs).sort((a, b) => a - b);

  // Check token uniqueness (each member must get a unique session token)
  const tokens = results.map(r => r.token).filter(Boolean);
  const uniqueTokens = new Set(tokens);
  const allTokensUnique = tokens.length === uniqueTokens.size;

  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / (times.length || 1));
  const minTime = times[0] || 0;
  const maxTime = times[times.length - 1] || 0;
  const p50 = times[Math.floor(times.length * 0.5)] || 0;
  const p95 = times[Math.floor(times.length * 0.95)] || 0;
  const p99 = times[Math.floor(times.length * 0.99)] || 0;

  console.log("───────────────────────────────────────────────────────────────");
  console.log("📊 TEAM CONCURRENCY TEST RESULTS");
  console.log("───────────────────────────────────────────────────────────────");
  console.log(`Total Requests:         ${results.length}`);
  console.log(`✅ Success (200 OK):     ${successful.length} / ${results.length} (${((successful.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed:              ${failed.length}`);
  console.log(`🔑 Unique Session Tokens Issued: ${uniqueTokens.size} / ${successful.length}`);
  console.log(`🛡️ Multi-Device Isolation:       ${allTokensUnique ? "✅ PASSED (Each member has their own isolated session)" : "❌ FAILED (Duplicate tokens)"}`);
  console.log(`⏱️ Total Batch Time:    ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`⚡ Avg Latency:         ${avgTime} ms`);
  console.log(`🚀 Min / Max:            ${minTime} ms / ${maxTime} ms`);
  console.log(`📈 50th Percentile:      ${p50} ms`);
  console.log(`📈 95th Percentile:      ${p95} ms`);
  console.log(`📈 99th Percentile:      ${p99} ms`);
  console.log("───────────────────────────────────────────────────────────────");

  if (failed.length > 0) {
    console.log("\n⚠️ FAILURES:");
    failed.forEach(f => {
      console.log(`   Team: ${f.team} (${f.member}) | Status: ${f.status} | Error: ${f.message}`);
    });
  } else {
    console.log(`\n🎉 SUCCESS! All 40 teams × 3 members (${TOTAL_USERS} devices) logged in simultaneously with 0 errors!`);
  }
}

run();
