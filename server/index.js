import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

// Trust reverse proxy (Vercel / Cloudflare / Nginx) for accurate client IP
app.set("trust proxy", 1);

// ═══════════════════════════════════════════════════════════════
//  SUPABASE CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log("⚡ [Supabase] Connected to Supabase Cloud DB:", supabaseUrl);
} else {
  console.log("ℹ️ [Supabase] No SUPABASE_URL detected — running with in-memory store.");
}

// ═══════════════════════════════════════════════════════════════
//  SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: { action: "deny" },
  hsts: { maxAge: 31536000 },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "no-referrer" },
}));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://codersforum.netlify.app",
  "https://kevincodez-ai.github.io",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin, localhost, all vercel.app & github.io domains, or explicit FRONTEND_URL
    let isAllowedDomain = false;
    try {
      if (origin) {
        const hostname = new URL(origin).hostname;
        isAllowedDomain = /\.vercel\.app$/.test(hostname) || /\.github\.io$/.test(hostname);
      }
    } catch {
      isAllowedDomain = false;
    }

    if (
      !origin ||
      isAllowedDomain ||
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin) ||
      (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["POST", "GET", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "X-Requested-With",
    "X-Request-Nonce",
    "X-Session-Token",
    "X-Admin-Token"
  ],
  credentials: false,
}));

app.use(express.json({ limit: "10kb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Try again later." },
}));

app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PATCH") {
    if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }
  }
  next();
});

// ═══════════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function hashPassword(plain) {
  const pepper = process.env.PEPPER ?? "coc_secret_pepper_2025";
  return crypto
    .createHash("sha256")
    .update(plain + pepper)
    .digest("hex");
}

function safeCompare(a, b) {
  const aBuf = Buffer.from(String(a).padEnd(128));
  const bBuf = Buffer.from(String(b).padEnd(128));
  return aBuf.length === bBuf.length && crypto.timingSafeEqual(aBuf, bBuf);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function sanitize(raw) {
  if (typeof raw !== "string") return "";
  return raw
    .trim()
    .replace(/[\0\x08\x1a]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .slice(0, 200);
}

function isThreat(str) {
  if (typeof str !== "string" || str.length > 200) return true;
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|TRUNCATE)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bOR\b\s*\d+\s*=\s*\d+)/i,
    /javascript:/i,
    /<script/i,
    /eval\s*\(/i,
    /document\.(cookie|write)/i,
    /(__proto__|constructor|prototype)\s*[:[{]/i,
    /\.\.[/\\]/,
  ];
  return patterns.some((p) => p.test(str));
}

function isValidUsername(u) {
  return (
    typeof u === "string" &&
    u.length >= 3 &&
    u.length <= 50 &&
    /^[a-zA-Z0-9._-]+$/.test(u)
  );
}

// ═══════════════════════════════════════════════════════════════
//  IN-MEMORY FALLBACK DATA STORE (Dev Only)
// ═══════════════════════════════════════════════════════════════

const USERS = new Map();

// Only populate in-memory fallback in non-production environments
if (process.env.NODE_ENV !== "production") {
  USERS.set("testteam", {
    username: "testteam",
    passwordHash: hashPassword("Battle@2025"),
    teamName: "Test Team Alpha",
    members: [
      { name: "Arjun Sharma", hackerrankId: "arjun_codes", role: "Captain" },
      { name: "Priya Menon", hackerrankId: "priya_m", role: "Member" },
      { name: "Karthik R", hackerrankId: "karthik_r99", role: "Member" },
      { name: "Sneha Das", hackerrankId: "sneha_d", role: "Member" },
    ],
    conqueredLand: { id: 1, name: "Land #1 — Volcano Peak", status: "held" },
    attackAssignments: [
      { member: "Priya Menon", land: "Land #2 — Frozen Wastes", status: "in_progress" },
      { member: "Karthik R", land: "Land #3 — Jungle Canopy", status: "pending" },
    ],
    score: 340,
    rank: 1,
    totalLands: 1,
    status: "active",
  });
}

const SESSIONS = new Map();
const SESSION_TTL = 4 * 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, s] of SESSIONS.entries()) {
    if (now > s.expiresAt) SESSIONS.delete(token);
  }
  for (const [token, s] of ADMIN_SESSIONS.entries()) {
    if (now > s.expiresAt) ADMIN_SESSIONS.delete(token);
  }
  for (const [ip, entry] of FAILED_LOGINS.entries()) {
    if (entry.lockedUntil && now > entry.lockedUntil) {
      FAILED_LOGINS.delete(ip);
    }
  }
}, 15 * 60 * 1000);

const FAILED_LOGINS = new Map();
const MAX_FAILS = 8;
const LOCKOUT_MS = 10 * 60 * 1000;

function checkServerLockout(ip) {
  const entry = FAILED_LOGINS.get(ip);
  if (!entry) return false;
  if (Date.now() < entry.lockedUntil) return true;
  FAILED_LOGINS.delete(ip);
  return false;
}

function recordServerFail(ip) {
  const entry = FAILED_LOGINS.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  FAILED_LOGINS.set(ip, entry);
}

function clearServerFails(ip) {
  FAILED_LOGINS.delete(ip);
}

// ═══════════════════════════════════════════════════════════════
//  RATE LIMITERS
// ═══════════════════════════════════════════════════════════════
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Wait 10 minutes." },
});

// Strict limiter for admin login — 5 attempts per 15 minutes per IP
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many admin login attempts. Wait 15 minutes." },
});

// ═══════════════════════════════════════════════════════════════
//  ROUTES (Supports both direct and /api/ prefixes for Vercel)
// ═══════════════════════════════════════════════════════════════

app.get(["/health", "/api/health"], (_, res) => {
  res.json({
    status: "ok",
    database: supabase ? "supabase_connected" : "in_memory",
    timestamp: new Date().toISOString()
  });
});

app.post(["/login", "/api/login"], loginLimiter, async (req, res) => {
  const ip = req.ip ?? "unknown";

  if (checkServerLockout(ip)) {
    return res.status(429).json({
      success: false,
      message: "Too many failed attempts. Try again later.",
    });
  }

  const rawUsername = sanitize(req.body?.username ?? "");
  // Do NOT strip characters from passwords (preserves full password entropy)
  const rawPassword = typeof req.body?.password === "string" ? req.body.password : "";

  if (isThreat(rawUsername)) {
    recordServerFail(ip);
    return res.status(400).json({ success: false, message: "Invalid input detected." });
  }

  if (!rawUsername || !rawPassword) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  if (!isValidUsername(rawUsername)) {
    return res.status(400).json({ success: false, message: "Invalid username format." });
  }

  if (rawPassword.length < 6 || rawPassword.length > 100) {
    return res.status(400).json({ success: false, message: "Invalid password format." });
  }

  const username = rawUsername.toLowerCase();
  let user = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (!error && data) {
        user = {
          username: data.username,
          passwordHash: data.password_hash,
          teamName: data.team_name,
          members: data.members ?? [],
          conqueredLand: data.conquered_land ?? null,
          attackAssignments: data.attack_assignments ?? [],
          score: data.score ?? 0,
          rank: data.rank ?? 1,
          totalLands: data.total_lands ?? 0,
          status: data.status ?? "active",
        };
      }
    } catch (dbErr) {
      console.error("[Supabase Query Error]:", dbErr.message);
    }
  }

  if (!user) {
    user = USERS.get(username);
  }

  const DUMMY_HASH = hashPassword("__dummy_fallback_password__");
  const hashToCheck = user?.passwordHash ?? DUMMY_HASH;
  const incomingHash = hashPassword(rawPassword);
  const passwordMatch = safeCompare(incomingHash, hashToCheck);

  if (!user || !passwordMatch) {
    recordServerFail(ip);
    console.warn(`[${new Date().toISOString()}] FAILED login attempt from ${ip}`);
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  if (user.status === "disqualified") {
    console.warn(`[${new Date().toISOString()}] Disqualified team login attempt: "${username}"`);
    return res.status(403).json({
      success: false,
      message: "This team has been disqualified from the contest.",
    });
  }

  clearServerFails(ip);

  const token = generateToken();
  const safeUserData = { ...user };
  delete safeUserData.passwordHash;

  SESSIONS.set(token, {
    username: user.username,
    teamName: user.teamName,
    userData: safeUserData,
    expiresAt: Date.now() + SESSION_TTL,
  });

  console.log(`[${new Date().toISOString()}] LOGIN OK: ${user.teamName}`);

  return res.json({
    success: true,
    sessionToken: token,
    teamName: user.teamName,
    members: user.members,
    conqueredLand: user.conqueredLand,
    attackAssignments: user.attackAssignments,
    score: user.score,
    rank: user.rank,
    totalLands: user.totalLands,
  });
});

// ═══════════════════════════════════════════════════════════════
//  CONTEST STAGE MANAGEMENT (Admin-Controlled Single Source of Truth)
// ═══════════════════════════════════════════════════════════════
const ALLOWED_STAGES = ["round0", "round1", "round2_phase1", "round2_phase2", "round2_phase3"];
let memoryActiveStage = "round1";

const ADMIN_SESSIONS = new Map();
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || "Admin@COC2026");
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

async function getActiveContestStage() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contest_state")
        .select("active_stage")
        .eq("id", "current")
        .maybeSingle();

      if (!error && data?.active_stage && ALLOWED_STAGES.includes(data.active_stage)) {
        memoryActiveStage = data.active_stage;
      }
    } catch (err) {
      console.error("[Supabase Stage Query Error]:", err.message);
    }
  }
  return memoryActiveStage;
}

async function setActiveContestStage(newStage) {
  if (!ALLOWED_STAGES.includes(newStage)) {
    throw new Error(`Invalid stage: ${newStage}`);
  }

  if (supabase) {
    const { error } = await supabase
      .from("contest_state")
      .upsert(
        {
          id: "current",
          active_stage: newStage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[Supabase Stage Save Error]:", error.message);
      throw new Error(`Database error saving stage: ${error.message}`);
    }
  }

  memoryActiveStage = newStage;
  return memoryActiveStage;
}

function requireAdmin(req, res, next) {
  const token =
    req.headers["x-admin-token"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin authorization required." });
  }

  const session = ADMIN_SESSIONS.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) ADMIN_SESSIONS.delete(token);
    return res.status(401).json({ success: false, message: "Admin session expired or invalid." });
  }

  req.adminUser = session.username;
  next();
}

// ═══════════════════════════════════════════════════════════════
//  PUBLIC CONTEST STATUS API
// ═══════════════════════════════════════════════════════════════
app.get(["/contest/status", "/api/contest/status", "/api/contest-status"], async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const stage = await getActiveContestStage();
  return res.json({
    success: true,
    activeStage: stage,
    timestamp: new Date().toISOString(),
  });
});

// ═══════════════════════════════════════════════════════════════
//  ADMIN AUTHENTICATION & STAGE CONTROL APIS
// ═══════════════════════════════════════════════════════════════
app.post(["/admin/login", "/api/admin/login"], adminLoginLimiter, async (req, res) => {
  const ip = req.ip ?? "unknown";

  if (checkServerLockout(ip)) {
    return res.status(429).json({
      success: false,
      message: "Too many failed attempts. Try again later.",
    });
  }

  const rawUsername = sanitize(req.body?.username ?? "");
  const rawPassword = typeof req.body?.password === "string" ? req.body.password : "";

  if (!rawUsername || !rawPassword) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  const username = rawUsername.toLowerCase();
  const incomingHash = hashPassword(rawPassword);

  const isUserMatch = safeCompare(username, ADMIN_USERNAME);
  const isPassMatch = safeCompare(incomingHash, ADMIN_PASSWORD_HASH);

  if (!isUserMatch || !isPassMatch) {
    recordServerFail(ip);
    console.warn(`[${new Date().toISOString()}] FAILED admin login attempt for user "${username}" from ${ip}`);
    return res.status(401).json({ success: false, message: "Invalid admin credentials." });
  }

  clearServerFails(ip);

  const token = generateToken();
  ADMIN_SESSIONS.set(token, {
    username,
    role: "admin",
    expiresAt: Date.now() + ADMIN_SESSION_TTL,
  });

  const currentStage = await getActiveContestStage();
  console.log(`[${new Date().toISOString()}] ADMIN LOGIN OK: ${username}`);

  return res.json({
    success: true,
    adminToken: token,
    role: "admin",
    activeStage: currentStage,
    message: "Admin authenticated.",
  });
});

app.get(["/admin/verify", "/api/admin/verify"], requireAdmin, async (_req, res) => {
  const currentStage = await getActiveContestStage();
  return res.json({
    success: true,
    role: "admin",
    activeStage: currentStage,
  });
});

app.post(["/admin/logout", "/api/admin/logout"], (req, res) => {
  const token =
    req.headers["x-admin-token"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "");
  if (token) ADMIN_SESSIONS.delete(token);
  return res.json({ success: true, message: "Admin logged out." });
});

// Update active contest stage (PATCH & POST)
app.all(["/admin/contest/stage", "/api/admin/contest/stage", "/api/admin/stage"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const targetStage = req.body?.activeStage;

  if (!targetStage || typeof targetStage !== "string" || !ALLOWED_STAGES.includes(targetStage)) {
    return res.status(400).json({
      success: false,
      message: `Invalid stage: "${targetStage}". Allowed values: ${ALLOWED_STAGES.join(", ")}`,
    });
  }

  try {
    const updatedStage = await setActiveContestStage(targetStage);
    console.log(`[${new Date().toISOString()}] 🚀 ADMIN UPDATED ACTIVE STAGE TO: "${updatedStage}" (by ${req.adminUser})`);
    return res.json({
      success: true,
      activeStage: updatedStage,
      message: `Active stage updated to ${updatedStage}.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to update stage:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update contest stage." });
  }
});

// ═══════════════════════════════════════════════════════════════
//  CONTEST ACCESS & ELIGIBILITY VERIFICATION API
// ═══════════════════════════════════════════════════════════════
app.all(["/contest/verify-access", "/api/contest/verify-access", "/api/contest/access"], async (req, res) => {
  const token =
    req.headers["x-session-token"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({
      success: false,
      allowed: false,
      message: "Authentication session required.",
    });
  }

  const session = SESSIONS.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) SESSIONS.delete(token);
    return res.status(401).json({
      success: false,
      allowed: false,
      message: "Session expired. Please log in again.",
    });
  }

  const user = session.userData || USERS.get(session.username);
  if (!user) {
    return res.status(404).json({ success: false, allowed: false, message: "Team record not found." });
  }

  if (user.status === "disqualified") {
    return res.status(403).json({
      success: false,
      allowed: false,
      message: "This team is disqualified from the contest.",
    });
  }

  // Parse requested stage
  const rawRound = req.body?.round || req.query?.round;
  const rawPhase = req.body?.phase || req.query?.phase;

  let requestedStage = "round1";
  if (String(rawRound) === "2" && String(rawPhase) === "3") {
    requestedStage = "round2_phase3";
  } else if (String(rawRound) === "2" && String(rawPhase) === "2") {
    requestedStage = "round2_phase2";
  } else if (String(rawRound) === "2" && String(rawPhase) === "1") {
    requestedStage = "round2_phase1";
  } else if (String(rawRound) === "0") {
    requestedStage = "round0";
  } else {
    requestedStage = "round1";
  }

  const activeStage = await getActiveContestStage();

  if (requestedStage !== activeStage) {
    const stageTitles = {
      round0: "Round 0 (Online Codefront — GFG)",
      round1: "Round 1 (Code Warfare)",
      round2_phase1: "Round 2 — Phase 1",
      round2_phase2: "Round 2 — Phase 2",
      round2_phase3: "Round 2 — Phase 3",
    };

    return res.status(403).json({
      success: false,
      allowed: false,
      activeStage,
      requestedStage,
      message: `${stageTitles[requestedStage] || requestedStage} is not currently active. Active stage: ${stageTitles[activeStage] || activeStage}.`,
    });
  }

  return res.json({
    success: true,
    allowed: true,
    activeStage,
    requestedStage,
    teamName: user.teamName,
  });
});

app.post(["/logout", "/api/logout"], (req, res) => {
  const token = req.headers["x-session-token"];
  if (token) SESSIONS.delete(token);
  res.json({ success: true, message: "Logged out." });
});

app.get(["/me", "/api/me"], (req, res) => {
  const token = req.headers["x-session-token"];
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated." });

  const session = SESSIONS.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) SESSIONS.delete(token);
    return res.status(401).json({ success: false, message: "Session expired." });
  }

  const user = session.userData || USERS.get(session.username);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  return res.json({
    success: true,
    teamName: user.teamName,
    members: user.members,
    conqueredLand: user.conqueredLand,
    attackAssignments: user.attackAssignments,
    score: user.score,
    rank: user.rank,
    totalLands: user.totalLands,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// Start local server if run directly
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT ?? 5000;
  app.listen(PORT, () => {
    const isDev = process.env.NODE_ENV !== "production";
    if (!process.env.ADMIN_PASSWORD || !process.env.PEPPER) {
      console.warn("⚠️ [SECURITY WARNING] Using default fallback ADMIN_PASSWORD or PEPPER. Set these in .env for production.");
    }
    console.log(`
╔══════════════════════════════════════╗
║   🔒 COC Backend — Secured Server   ║
║   http://localhost:${PORT}              ║
╠══════════════════════════════════════╣
║  DATABASE: ${supabase ? "SUPABASE CLOUD DB ⚡" : "IN-MEMORY STORE 💾"}
${isDev ? `║  TEST ACCOUNT: testteam (dev only)    ` : ""}
╠══════════════════════════════════════╣
║  GET  /api/contest/status  — active  ║
║  POST /api/admin/login     — admin   ║
║  PATCH/api/admin/stage     — change  ║
║  POST /api/contest/access  — verify  ║
║  POST /api/login           — team    ║
╚══════════════════════════════════════╝
    `);
  });
}

export default app;
