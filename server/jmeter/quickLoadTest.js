import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurable options
const TARGET_URL = process.env.TARGET_URL || "https://clashofcoders-theta.vercel.app/api/login";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "100", 10);
const DURATION_SECS = parseInt(process.env.DURATION || "0", 10); // 0 = single burst, >0 = continuous duration in seconds
const PACING_MS = parseInt(process.env.PACING_MS || "300", 10); // Delay between iterations

// Load credentials from CSV
const csvPath = path.join(__dirname, "users.csv");
const lines = fs.readFileSync(csvPath, "utf-8").trim().split("\n").slice(1);
const users = lines.map(line => {
  const [username, password] = line.trim().split(",");
  return { username, password };
}).filter(u => u.username && u.password);

console.log("═══════════════════════════════════════════════════════════════");
console.log(`🚀 STARTING LOAD TEST`);
console.log(`🎯 Target Endpoint:    ${TARGET_URL}`);
console.log(`👥 Concurrent Users:   ${CONCURRENCY}`);
console.log(`⏳ Test Mode:          ${DURATION_SECS > 0 ? `${DURATION_SECS} seconds duration` : "Single burst"}`);
console.log(`📦 Available Users:    ${users.length}`);
console.log("═══════════════════════════════════════════════════════════════\n");

async function singleLogin(user, index) {
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
  const results = [];
  const overallStart = performance.now();

  if (DURATION_SECS > 0) {
    const endTime = Date.now() + DURATION_SECS * 1000;
    let reqCounter = 0;

    const worker = async (workerId) => {
      while (Date.now() < endTime) {
        reqCounter++;
        const user = users[(workerId + reqCounter) % users.length];
        const res = await singleLogin(user, reqCounter);
        results.push(res);
        if (PACING_MS > 0) {
          await new Promise(r => setTimeout(r, PACING_MS));
        }
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
    await Promise.all(workers);
  } else {
    // Single burst
    const tasks = Array.from({ length: CONCURRENCY }, (_, i) => {
      const user = users[i % users.length];
      return singleLogin(user, i + 1);
    });
    const burstResults = await Promise.all(tasks);
    results.push(...burstResults);
  }

  const totalDuration = Math.round(performance.now() - overallStart);

  // Compute metrics
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const times = results.map(r => r.timeMs).sort((a, b) => a - b);

  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / (times.length || 1));
  const minTime = times[0] || 0;
  const maxTime = times[times.length - 1] || 0;
  const p50 = times[Math.floor(times.length * 0.5)] || 0;
  const p95 = times[Math.floor(times.length * 0.95)] || 0;
  const p99 = times[Math.floor(times.length * 0.99)] || 0;

  console.log("───────────────────────────────────────────────────────────────");
  console.log("📊 LOAD TEST RESULTS SUMMARY");
  console.log("───────────────────────────────────────────────────────────────");
  console.log(`Total Requests:      ${results.length}`);
  console.log(`✅ Success (200 OK):  ${successful.length} (${((successful.length / (results.length || 1)) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed:           ${failed.length} (${((failed.length / (results.length || 1)) * 100).toFixed(1)}%)`);
  console.log(`⏱️ Total Time:        ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`⚡ Avg Response Time: ${avgTime} ms`);
  console.log(`🚀 Min / Max:         ${minTime} ms / ${maxTime} ms`);
  console.log(`📈 50th Percentile:   ${p50} ms`);
  console.log(`📈 95th Percentile:   ${p95} ms`);
  console.log(`📈 99th Percentile:   ${p99} ms`);
  console.log(`📊 Throughput:        ${((results.length / (totalDuration / 1000)) || 0).toFixed(2)} req/sec`);
  console.log("───────────────────────────────────────────────────────────────");

  if (failed.length > 0) {
    console.log("\n⚠️ SAMPLE FAILURES (First 5):");
    failed.slice(0, 5).forEach(f => {
      console.log(`   User: ${f.user} | Status: ${f.status} | Error: ${f.message} (${f.timeMs}ms)`);
    });
  } else {
    console.log(`\n🎉 ALL ${results.length} LOGINS SUCCEEDED WITH 0 ERRORS!`);
  }
}

run();
