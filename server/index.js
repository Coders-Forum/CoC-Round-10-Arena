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
  max: 100000,             // Ultra-high headroom for load testing and contest traffic
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
//  IN-MEMORY STORE & CACHE (Eliminates Supabase connection strain)
// ═══════════════════════════════════════════════════════════════

const USERS = new Map();
const SESSIONS = new Map();
const SESSION_TTL = 4 * 60 * 60 * 1000;

// High-performance cache for all teams (loaded once, served from memory)
const TEAMS_CACHE = new Map();
let teamsCacheExpiresAt = 0;
const TEAMS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

async function refreshTeamsCache(force = false) {
  const now = Date.now();
  if (!force && now < teamsCacheExpiresAt && TEAMS_CACHE.size > 0) {
    return;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from("teams").select("*");
      if (!error && Array.isArray(data)) {
        TEAMS_CACHE.clear();
        for (const t of data) {
          if (t.username) {
            TEAMS_CACHE.set(t.username.toLowerCase(), {
              username: t.username,
              passwordHash: t.password_hash,
              teamName: t.team_name,
              members: t.members ?? [],
              conqueredLand: t.conquered_land ?? null,
              attackAssignments: t.attack_assignments ?? [],
              score: t.score ?? 0,
              rank: t.rank ?? 1,
              totalLands: t.total_lands ?? 0,
              status: t.status ?? "active",
            });
          }
        }
        teamsCacheExpiresAt = now + TEAMS_CACHE_TTL;
        console.log(`⚡ [Teams Cache] Cached ${TEAMS_CACHE.size} teams into memory (0 DB queries per login).`);
      }
    } catch (dbErr) {
      console.error("[Supabase Cache Refresh Error]:", dbErr.message);
    }
  }
}

async function getCachedUser(username) {
  const uname = String(username).toLowerCase();
  await refreshTeamsCache();
  
  if (TEAMS_CACHE.has(uname)) {
    return TEAMS_CACHE.get(uname);
  }

  // Fallback: If not in cache (e.g. newly inserted team), do a single lookup
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("username", uname)
        .maybeSingle();

      if (!error && data) {
        const user = {
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
        TEAMS_CACHE.set(uname, user);
        return user;
      }
    } catch (err) {
      console.error("[Fallback Lookup Error]:", err.message);
    }
  }

  return USERS.get(uname) || null;
}

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
const MAX_FAILS = 100;          // Allow high tolerance for testing
const LOCKOUT_MS = 2 * 60 * 1000;

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
  windowMs: 1 * 60 * 1000,
  max: 10000,               // High throughput capacity
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed logins towards rate limiting
  message: { success: false, message: "Too many login attempts. Please try again in a few minutes." },
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
  const user = await getCachedUser(username);

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
//  CONTEST STAGE & DISABLED LANDS MANAGEMENT (Admin Controlled)
// ═══════════════════════════════════════════════════════════════
const ALLOWED_STAGES = ["round0", "round1", "round2_phase1", "round2_phase2", "round2_phase3"];
let memoryActiveStage = "round1";
let memoryDisabledLands = [];
let memoryBypassLogin = false;

const ADMIN_SESSIONS = new Map();
const rawAdminUser = process.env.ADMIN_USERNAME || "";
const rawAdminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "";
const ADMIN_USERNAME = rawAdminUser ? rawAdminUser.toLowerCase() : "";
const ADMIN_PASSWORD_HASH = rawAdminPass ? hashPassword(rawAdminPass) : "";
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

let stateCacheExpiresAt = 0;
const STATE_CACHE_TTL = 30 * 1000; // 30 seconds — admin writes always invalidate immediately

async function getContestState() {
  const now = Date.now();
  if (now < stateCacheExpiresAt) {
    return { activeStage: memoryActiveStage, disabledLands: memoryDisabledLands, bypassLogin: memoryBypassLogin };
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contest_state")
        .select("active_stage, disabled_lands, bypass_login")
        .eq("id", "current")
        .maybeSingle();

      if (!error && data) {
        if (data.active_stage && ALLOWED_STAGES.includes(data.active_stage)) {
          memoryActiveStage = data.active_stage;
        }
        if (Array.isArray(data.disabled_lands)) {
          memoryDisabledLands = data.disabled_lands;
        }
        if (typeof data.bypass_login === "boolean") {
          memoryBypassLogin = data.bypass_login;
        }
        stateCacheExpiresAt = now + STATE_CACHE_TTL;
      }
    } catch (err) {
      console.error("[Supabase State Query Error]:", err.message);
    }
  }
  return { activeStage: memoryActiveStage, disabledLands: memoryDisabledLands, bypassLogin: memoryBypassLogin };
}

async function getActiveContestStage() {
  const state = await getContestState();
  return state.activeStage;
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
          disabled_lands: memoryDisabledLands,
          bypass_login: memoryBypassLogin,
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
  stateCacheExpiresAt = Date.now() + STATE_CACHE_TTL;
  return memoryActiveStage;
}

async function setDisabledLands(lands) {
  if (!Array.isArray(lands)) {
    throw new Error("disabledLands must be an array");
  }

  const sanitized = lands.map((item) => String(item).toLowerCase().trim()).filter(Boolean);

  if (supabase) {
    const { error } = await supabase
      .from("contest_state")
      .upsert(
        {
          id: "current",
          active_stage: memoryActiveStage,
          disabled_lands: sanitized,
          bypass_login: memoryBypassLogin,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[Supabase Disabled Lands Save Error]:", error.message);
    }
  }

  memoryDisabledLands = sanitized;
  stateCacheExpiresAt = Date.now() + STATE_CACHE_TTL;
  return memoryDisabledLands;
}

async function setBypassLogin(bypass) {
  const isBypassed = Boolean(bypass);

  if (supabase) {
    const { error } = await supabase
      .from("contest_state")
      .upsert(
        {
          id: "current",
          active_stage: memoryActiveStage,
          disabled_lands: memoryDisabledLands,
          bypass_login: isBypassed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[Supabase Bypass Login Save Error]:", error.message);
    }
  }

  memoryBypassLogin = isBypassed;
  stateCacheExpiresAt = Date.now() + STATE_CACHE_TTL;
  return memoryBypassLogin;
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
app.get(["/contest/status", "/api/contest/status", "/api/contest-status", "/api/contest/disabled-lands"], async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const state = await getContestState();
  return res.json({
    success: true,
    activeStage: state.activeStage,
    disabledLands: state.disabledLands,
    bypassLogin: Boolean(state.bypassLogin),
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

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    console.error(`[${new Date().toISOString()}] Admin login attempted but ADMIN_USERNAME or ADMIN_PASSWORD is not configured.`);
    return res.status(503).json({ success: false, message: "Admin portal is not configured on this server." });
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

// Update disabled/conquered lands (PATCH & POST)
app.all(["/admin/contest/disabled-lands", "/api/admin/contest/disabled-lands", "/api/admin/disabled-lands"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const { disabledLands } = req.body;
  if (!Array.isArray(disabledLands)) {
    return res.status(400).json({ success: false, message: "disabledLands array is required." });
  }

  try {
    const updated = await setDisabledLands(disabledLands);
    console.log(`[${new Date().toISOString()}] 🛡️ ADMIN UPDATED DISABLED LANDS: [${updated.join(", ")}] (by ${req.adminUser})`);
    return res.json({
      success: true,
      disabledLands: updated,
      message: `Disabled lands updated (${updated.length} lands conquered/disabled).`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to update disabled lands:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update disabled lands." });
  }
});

// Update login requirement bypass (PATCH & POST)
app.all(["/admin/contest/bypass-login", "/api/admin/contest/bypass-login", "/api/admin/bypass-login"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const { bypassLogin } = req.body;
  if (typeof bypassLogin !== "boolean") {
    return res.status(400).json({ success: false, message: "bypassLogin boolean field is required." });
  }

  try {
    const updated = await setBypassLogin(bypassLogin);
    console.log(`[${new Date().toISOString()}] ☢️ ADMIN UPDATED BYPASS LOGIN TO: ${updated} (by ${req.adminUser})`);
    return res.json({
      success: true,
      bypassLogin: updated,
      activeStage: memoryActiveStage,
      message: updated ? "Login requirement nuked. Arena is public." : "Login requirement restored.",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to update bypass login state:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update bypass login state." });
  }
});

// ═══════════════════════════════════════════════════════════════
//  DYNAMIC TEAM CONQUESTS & RESULTS MANAGEMENT API
//  — RAM cache (30s TTL) backed by Supabase teams & contest_state
//  — Supports Phase 1, Phase 2, and Final Winners activation & locking
// ═══════════════════════════════════════════════════════════════
let memoryActiveResultsPhase = "phase1"; // "phase1" | "phase2" | "all"
let memoryTeamConquests = {};           // { [teamName]: string[] } (overall merged)
let memoryPhase1Conquests = {};         // { [teamName]: string[] }
let memoryPhase2Conquests = {};         // { [teamName]: string[] }
let memoryEliminatedTeams = [];         // string[] array of eliminated team names
let conquestsCacheExpiresAt = 0;
const CONQUESTS_CACHE_TTL = 30 * 1000; // 30 seconds

async function loadTeamConquestsFromDB() {
  if (!supabase) return;
  try {
    const { data: stateData } = await supabase
      .from("contest_state")
      .select("active_results_phase, eliminated_teams")
      .eq("id", "current")
      .maybeSingle();

    if (stateData) {
      if (stateData.active_results_phase) {
        memoryActiveResultsPhase = stateData.active_results_phase;
      }
      if (Array.isArray(stateData.eliminated_teams)) {
        memoryEliminatedTeams = stateData.eliminated_teams;
      }
    }

    const { data, error } = await supabase
      .from("teams")
      .select("team_name, conquered_land, phase1_lands, phase2_lands")
      .eq("status", "active");

    if (!error && Array.isArray(data)) {
      const freshOverall = {};
      const freshP1 = {};
      const freshP2 = {};

      for (const row of data) {
        if (row.team_name) {
          if (Array.isArray(row.conquered_land) && row.conquered_land.length > 0) {
            freshOverall[row.team_name] = row.conquered_land;
          }
          if (Array.isArray(row.phase1_lands) && row.phase1_lands.length > 0) {
            freshP1[row.team_name] = row.phase1_lands;
          }
          if (Array.isArray(row.phase2_lands) && row.phase2_lands.length > 0) {
            freshP2[row.team_name] = row.phase2_lands;
          }
        }
      }
      memoryTeamConquests = freshOverall;
      memoryPhase1Conquests = freshP1;
      memoryPhase2Conquests = freshP2;
      conquestsCacheExpiresAt = Date.now() + CONQUESTS_CACHE_TTL;
      console.log(`[Conquests] Loaded conquest mappings from DB. Active results phase: ${memoryActiveResultsPhase}, Eliminated teams: ${memoryEliminatedTeams.length}`);
    }
  } catch (err) {
    console.error("[Conquests Load Exception]:", err.message);
  }
}

async function getTeamConquests() {
  if (Date.now() < conquestsCacheExpiresAt) {
    return {
      activeResultsPhase: memoryActiveResultsPhase,
      conquests: memoryTeamConquests,
      phase1Conquests: memoryPhase1Conquests,
      phase2Conquests: memoryPhase2Conquests,
      eliminatedTeams: memoryEliminatedTeams,
    };
  }
  await loadTeamConquestsFromDB();
  return {
    activeResultsPhase: memoryActiveResultsPhase,
    conquests: memoryTeamConquests,
    phase1Conquests: memoryPhase1Conquests,
    phase2Conquests: memoryPhase2Conquests,
    eliminatedTeams: memoryEliminatedTeams,
  };
}

async function saveTeamConquest(teamName, phase, conqueredLands) {
  const targetPhase = phase === "phase2" ? "phase2" : "phase1";

  if (targetPhase === "phase2") {
    memoryPhase2Conquests[teamName] = conqueredLands;
  } else {
    memoryPhase1Conquests[teamName] = conqueredLands;
  }

  // Combine phase 1 & phase 2 lands into overall team lands
  const p1 = memoryPhase1Conquests[teamName] || [];
  const p2 = memoryPhase2Conquests[teamName] || [];
  const combined = Array.from(new Set([...p1, ...p2]));
  memoryTeamConquests[teamName] = combined;
  conquestsCacheExpiresAt = Date.now() + CONQUESTS_CACHE_TTL;

  // Persist to Supabase
  if (supabase) {
    const updateObj = {
      conquered_land: combined,
      total_lands: combined.length,
    };

    const { error } = await supabase
      .from("teams")
      .update(updateObj)
      .eq("team_name", teamName);

    if (error) {
      console.error(`[Supabase Conquests Save Error] team="${teamName}":`, error.message);
    } else {
      console.log(`[${new Date().toISOString()}] 🏆 Persisted ${conqueredLands.length} lands for "${teamName}" (${targetPhase}) to Supabase.`);
    }
  }
}

// Public API: Get live team conquered land mappings & active results phase
app.get(["/results/conquests", "/api/results/conquests", "/api/teams/conquered-lands"], async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const data = await getTeamConquests();
  return res.json({
    success: true,
    activeResultsPhase: data.activeResultsPhase,
    conquests: data.conquests,
    phase1Conquests: data.phase1Conquests,
    phase2Conquests: data.phase2Conquests,
    eliminatedTeams: data.eliminatedTeams,
    timestamp: new Date().toISOString(),
  });
});

// Admin API: Set active results phase visibility (phase1 | phase2 | all)
app.all(["/admin/results/active-phase", "/api/admin/results/active-phase"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const { activeResultsPhase } = req.body;
  if (!["phase1", "phase2", "all"].includes(activeResultsPhase)) {
    return res.status(400).json({ success: false, message: "Invalid activeResultsPhase. Must be 'phase1', 'phase2', or 'all'." });
  }

  memoryActiveResultsPhase = activeResultsPhase;
  conquestsCacheExpiresAt = Date.now() + CONQUESTS_CACHE_TTL;

  if (supabase) {
    await supabase
      .from("contest_state")
      .upsert({ id: "current", active_stage: memoryActiveStage, disabled_lands: memoryDisabledLands, bypass_login: memoryBypassLogin, active_results_phase: activeResultsPhase, eliminated_teams: memoryEliminatedTeams, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .catch((err) => console.error("[Supabase Save Active Results Phase Error]:", err.message));
  }

  console.log(`[${new Date().toISOString()}] 🏆 ADMIN SET ACTIVE RESULTS PHASE TO: "${activeResultsPhase}" (by ${req.adminUser})`);
  return res.json({
    success: true,
    activeResultsPhase: memoryActiveResultsPhase,
    message: `Active results phase updated to "${activeResultsPhase}".`,
    timestamp: new Date().toISOString(),
  });
});

// Admin API: Set eliminated teams (PATCH & POST)
app.all(["/admin/teams/eliminate", "/api/admin/teams/eliminate"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const { eliminatedTeams } = req.body;
  if (!Array.isArray(eliminatedTeams)) {
    return res.status(400).json({ success: false, message: "eliminatedTeams array is required." });
  }

  const sanitized = eliminatedTeams.map((t) => String(t).trim()).filter(Boolean);
  memoryEliminatedTeams = sanitized;
  conquestsCacheExpiresAt = Date.now() + CONQUESTS_CACHE_TTL;

  if (supabase) {
    await supabase
      .from("contest_state")
      .upsert({ id: "current", active_stage: memoryActiveStage, disabled_lands: memoryDisabledLands, bypass_login: memoryBypassLogin, active_results_phase: memoryActiveResultsPhase, eliminated_teams: sanitized, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .catch((err) => console.error("[Supabase Save Eliminated Teams Error]:", err.message));
  }

  console.log(`[${new Date().toISOString()}] ❌ ADMIN UPDATED ELIMINATED TEAMS: [${sanitized.join(", ")}] (by ${req.adminUser})`);
  return res.json({
    success: true,
    eliminatedTeams: memoryEliminatedTeams,
    message: `Eliminated teams updated (${memoryEliminatedTeams.length} teams eliminated).`,
    timestamp: new Date().toISOString(),
  });
});


// Admin API: Update team conquered lands for a specific phase
app.all(["/admin/teams/conquered-lands", "/api/admin/teams/conquered-lands"], requireAdmin, async (req, res) => {
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use PATCH or POST." });
  }

  const { teamName, phase, conqueredLands } = req.body;

  if (!teamName || !Array.isArray(conqueredLands)) {
    return res.status(400).json({ success: false, message: "teamName (string) and conqueredLands (array) are required." });
  }

  try {
    await saveTeamConquest(teamName, phase || "phase1", conqueredLands);
    console.log(`[${new Date().toISOString()}] 🏆 ADMIN SET "${teamName}" (${phase || "phase1"}) → [${conqueredLands.join(", ")}] (by ${req.adminUser})`);
    return res.json({
      success: true,
      teamName,
      phase: phase || "phase1",
      conqueredLands,
      message: `Conquered lands for "${teamName}" (${phase || "phase1"}) saved successfully.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save team conquests:", err.message);
    return res.status(500).json({ success: false, message: "Failed to save team conquered lands." });
  }
});



// ═══════════════════════════════════════════════════════════════
//  CONTEST ACCESS & ELIGIBILITY VERIFICATION API
// ═══════════════════════════════════════════════════════════════
app.all(["/contest/verify-access", "/api/contest/verify-access", "/api/contest/access"], async (req, res) => {
  // ── Arena is public — no login/session required ──

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
      bypassLogin: memoryBypassLogin,
      message: `${stageTitles[requestedStage] || requestedStage} is not currently active. Active stage: ${stageTitles[activeStage] || activeStage}.`,
    });
  }

  return res.json({
    success: true,
    allowed: true,
    activeStage,
    requestedStage,
    disabledLands: memoryDisabledLands,
    bypassLogin: memoryBypassLogin,
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
║   🔒 COC Backend — Production Ready ║
║   http://localhost:${PORT}              ║
╠══════════════════════════════════════╣
║  DATABASE: ${supabase ? "SUPABASE CLOUD DB ⚡" : "IN-MEMORY STORE 💾"}
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

// ═══════════════════════════════════════════════════════════════
//  STARTUP CACHE WARM — Fills memory caches on cold start
//  so the first wave of concurrent users gets instant responses
// ═══════════════════════════════════════════════════════════════
if (supabase) {
  Promise.all([
    refreshTeamsCache(true),
    getContestState(),
    loadTeamConquestsFromDB(),
  ]).then(([, state]) => {
    console.log(`🚀 [Startup] Cache warm complete — ${TEAMS_CACHE.size} teams, stage: ${state.activeStage}, conquests: ${Object.keys(memoryTeamConquests).length} teams loaded`);
  }).catch((err) => {
    console.warn("⚠️ [Startup] Cache warm failed (non-fatal):", err.message);
  });
}

export default app;
