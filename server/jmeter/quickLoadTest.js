import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Target URL: Test local server or live Vercel
const TARGET_URL = process.env.TARGET_URL || "https://clashofcoders-theta.vercel.app/api/login";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "100", 10);

// Load credentials from CSV
const csvPath = path.join(__dirname, "users.csv");
const lines = fs.readFileSync(csvPath, "utf-8").trim().split("\n").slice(1);
const users = lines.map(line => {
  const [username, password] = line.trim().split(",");
  return { username, password };
}).filter(u => u.username && u.password);

console.log("═══════════════════════════════════════════════════════════════");
console.log(`🚀 STARTING LOAD TEST: ${CONCURRENCY} CONCURRENT LOGINS`);
console.log(`🎯 Target Endpoint: ${TARGET_URL}`);
console.log(`👥 Total Test Users in Pool: ${users.length}`);
console.log("═══════════════════════════════════════════════════════════════\n");

async function singleLogin(user, index) {
  const start = performance.now();
  try {
    const res = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    });

    const elapsed = Math.round(performance.now() - start);
    const data = await res.json().catch(() => ({}));

    return {
      index,
      user: user.username,
      status: res.status,
      success: res.ok && data.success === true,
      timeMs: elapsed,
      message: data.message || (res.ok ? "OK" : `HTTP ${res.status}`),
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    return {
      index,
      user: user.username,
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

  for (let i = 0; i < CONCURRENCY; i++) {
    const user = users[i % users.length];
    tasks.push(singleLogin(user, i + 1));
  }

  const results = await Promise.all(tasks);
  const totalDuration = Math.round(performance.now() - startTime);

  // Compute metrics
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const times = results.map(r => r.timeMs).sort((a, b) => a - b);

  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const minTime = times[0];
  const maxTime = times[times.length - 1];
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const p99 = times[Math.floor(times.length * 0.99)];

  console.log("───────────────────────────────────────────────────────────────");
  console.log("📊 LOAD TEST RESULTS SUMMARY");
  console.log("───────────────────────────────────────────────────────────────");
  console.log(`Total Requests:      ${results.length}`);
  console.log(`✅ Success (200 OK):  ${successful.length} (${((successful.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed:           ${failed.length} (${((failed.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`⏱️ Total Time:        ${totalDuration} ms`);
  console.log(`⚡ Avg Response Time: ${avgTime} ms`);
  console.log(`🚀 Min / Max:         ${minTime} ms / ${maxTime} ms`);
  console.log(`📈 50th Percentile:   ${p50} ms`);
  console.log(`📈 95th Percentile:   ${p95} ms`);
  console.log(`📈 99th Percentile:   ${p99} ms`);
  console.log("───────────────────────────────────────────────────────────────");

  if (failed.length > 0) {
    console.log("\n⚠️ SAMPLE FAILURES (First 5):");
    failed.slice(0, 5).forEach(f => {
      console.log(`   User: ${f.user} | Status: ${f.status} | Error: ${f.message} (${f.timeMs}ms)`);
    });
  } else {
    console.log("\n🎉 ALL 100 CONCURRENT LOGINS SUCCEEDED WITH 0 ERRORS!");
  }
}

run();
