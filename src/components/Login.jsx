import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  stampSession,
  clearSession,
  isLoggedIn,
  REASON_MESSAGES,
  saveTeamData,
} from "../utils/sessionSecurity";

// ── 1. Input Sanitization ─────────────────────────────────────
function sanitize(raw) {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/[\0\x08\x1a]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/&#[\dx]+;?/gi, "")
    .replace(/%[0-9a-f]{2}/gi, (m) => {
      try {
        const decoded = decodeURIComponent(m);
        return /[<>"'`]/.test(decoded) ? "" : decoded;
      } catch {
        return "";
      }
    })
    .replace(/\u200b|\u200c|\u200d|\ufeff/g, "")
    .replace(/[^\x20-\x7e\u00a0-\u024f]/g, "")
    .slice(0, 200);
}

// ── 2. XSS Detection ─────────────────────────────────────────
const XSS_PATTERNS = [
  /<script[\s\S]*?>/i,
  /<\/script>/i,
  /<iframe[\s\S]*?>/i,
  /<object[\s\S]*?>/i,
  /<embed[\s\S]*?>/i,
  /<link[\s\S]*?>/i,
  /<meta[\s\S]*?>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /on(click|load|error|mouseover|focus|blur|input|change|submit|keydown|keyup|keypress|resize|scroll|wheel|drag|drop|paste|cut|copy|contextmenu|pointerover|pointermove)\s*=/i,
  /expression\s*\(/i,
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\s*\.\s*(cookie|write|location|domain|referrer)/i,
  /window\s*\.\s*(location|open|eval|atob|btoa)/i,
  /alert\s*\(/i,
  /confirm\s*\(/i,
  /prompt\s*\(/i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /import\s*\(/i,
  /require\s*\(/i,
  /atob\s*\(/i,
  /btoa\s*\(/i,
  /String\.fromCharCode/i,
  /\\\u0000/,
  /\x00/,
];
function hasXSS(str) {
  return XSS_PATTERNS.some((p) => p.test(str));
}

// ── 3. SQL Injection Detection ────────────────────────────────
const SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|REPLACE|CAST|CONVERT|DECLARE|CURSOR|FETCH|KILL|BACKUP|RESTORE|SHUTDOWN)\b)/i,
  /(--|#|\/\*|\*\/|;)/,
  /(\bOR\b\s*['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i,
  /(\bAND\b\s*['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i,
  /'\s*(OR|AND)\s*'/i,
  /SLEEP\s*\(\s*\d+\s*\)/i,
  /BENCHMARK\s*\(/i,
  /LOAD_FILE\s*\(/i,
  /INTO\s+(OUTFILE|DUMPFILE)/i,
  /INFORMATION_SCHEMA/i,
  /SYS\.(TABLES|COLUMNS|OBJECTS)/i,
  /WAITFOR\s+DELAY/i,
  /PG_SLEEP\s*\(/i,
  /xp_cmdshell/i,
  /OPENROWSET\s*\(/i,
  /BULK\s+INSERT/i,
  /CHAR\s*\(\s*\d/i,
  /0x[0-9a-f]+/i,
];
function hasSQLInjection(str) {
  return SQL_PATTERNS.some((p) => p.test(str));
}

function hasPrototypePollution(str) {
  return /(__proto__|constructor|prototype)\s*[:[{]/i.test(str);
}
function hasPathTraversal(str) {
  return /(\.\.[/\\]|\.\.%2[fF]|\.\.%5[cC]|%2e%2e)/i.test(str);
}
function normalizeUnicode(str) {
  return str.normalize("NFKC");
}
function isSafeLength(str, max = 200) {
  return typeof str === "string" && str.length <= max;
}
function isThreat(raw) {
  if (!isSafeLength(raw)) return true;
  const str = normalizeUnicode(raw);
  return (
    hasXSS(str) ||
    hasSQLInjection(str) ||
    hasPrototypePollution(str) ||
    hasPathTraversal(str)
  );
}

// ── Field validators ──────────────────────────────────────────
function validateUsername(v) {
  if (!v.trim()) return "Username is required.";
  if (isThreat(v)) return "Invalid characters detected.";
  if (v.trim().length < 3) return "Username must be at least 3 characters.";
  if (v.trim().length > 50) return "Username too long.";
  if (!/^[a-zA-Z0-9._-]+$/.test(v.trim()))
    return "Only letters, numbers, . _ - allowed.";
  return null;
}
function validatePassword(v) {
  if (!v) return "Password is required.";
  if (isThreat(v)) return "Invalid characters detected.";
  if (v.length < 6) return "Password too short.";
  if (v.length > 100) return "Password too long.";
  return null;
}

// ── Safe fetch ────────────────────────────────────────────────
async function safeFetch(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-Request-Nonce": nonce,
        ...(options.headers ?? {}),
      },
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      const e = new Error("Request timed out");
      e.name = "TimeoutError";
      throw e;
    }
    throw err;
  }
}

// ── Rate limiter ──────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;
const ATTEMPT_KEY = "coc_login_attempts";
const LOCKOUT_KEY = "coc_lockout_until";

function getAttemptData() {
  try {
    return {
      attempts: parseInt(sessionStorage.getItem(ATTEMPT_KEY) ?? "0", 10),
      lockedUntil: parseInt(sessionStorage.getItem(LOCKOUT_KEY) ?? "0", 10),
    };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}
function recordFailedAttempt() {
  try {
    const { attempts } = getAttemptData();
    const next = attempts + 1;
    sessionStorage.setItem(ATTEMPT_KEY, String(next));
    if (next >= MAX_ATTEMPTS)
      sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
    return next;
  } catch {
    return 0;
  }
}
function clearAttempts() {
  try {
    sessionStorage.removeItem(ATTEMPT_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);
  } catch {
    /* ignore */
  }
}
function isLockedOut() {
  return Date.now() < getAttemptData().lockedUntil;
}
function lockoutSecondsLeft() {
  return Math.max(
    0,
    Math.ceil((getAttemptData().lockedUntil - Date.now()) / 1000),
  );
}

// ── Output encoding ───────────────────────────────────────────
function encodeForDisplay(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ══════════════════════════════════════════════════════════════
//  LOGIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show why the user was redirected back to login
  const logoutReason = location.state?.reason ?? null;
  const reasonMsg = REASON_MESSAGES[logoutReason] ?? null;

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [stage, setStage] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [lockSecs, setLockSecs] = useState(0);

  const lockTimerRef = useRef(null);
  const submitGuard = useRef(false);

  // ── Fix full-width background ─────────────────────────────
  useEffect(() => {
    const el = document.documentElement,
      body = document.body;
    const root = document.getElementById("root");
    el.style.background = body.style.background = "#111827";
    body.style.margin = body.style.padding = "0";
    body.style.minHeight = "100vh";
    if (root) root.style.background = "#111827";
    // Only clear a stale session — don't wipe if already clean (e.g. after logout).
    // Calling clearSession() unconditionally was causing a blank page after logout
    // because it re-triggered a render cycle with no state to show.
    if (isLoggedIn()) clearSession();
    return () => {
      el.style.background = body.style.background = "";
      body.style.margin = body.style.padding = body.style.minHeight = "";
      if (root) root.style.background = "";
    };
  }, []);

  // ── Lockout countdown ──────────────────────────────────────
  useEffect(() => {
    if (isLockedOut()) {
      setLockSecs(lockoutSecondsLeft());
      lockTimerRef.current = setInterval(() => {
        const s = lockoutSecondsLeft();
        setLockSecs(s);
        if (s <= 0) clearInterval(lockTimerRef.current);
      }, 1000);
    }
    return () => clearInterval(lockTimerRef.current);
  }, []);

  // ── Disable devtools shortcuts ─────────────────────────────
  useEffect(() => {
    const block = (e) => e.preventDefault();
    const blockKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "J", "C", "U"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      )
        e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "username") {
        const cleaned = sanitize(value);
        if (isThreat(cleaned)) {
          setErrors((p) => ({ ...p, username: "Invalid characters detected." }));
          return;
        }
        setForm((p) => ({ ...p, username: cleaned }));
        if (touched.username) {
          setErrors((p) => ({ ...p, username: validateUsername(cleaned) }));
        }
      } else {
        // Do not sanitize passwords (preserves full special character set)
        setForm((p) => ({ ...p, password: value }));
        if (touched.password) {
          setErrors((p) => ({ ...p, password: validatePassword(value) }));
        }
      }
    },
    [touched],
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({
      ...p,
      [name]:
        name === "username" ? validateUsername(value) : validatePassword(value),
    }));
  }, []);

  const handlePaste = useCallback((e) => {
    const pasted = e.clipboardData?.getData("text") ?? "";
    if (pasted.length > 200) {
      e.preventDefault();
      setErrors((p) => ({
        ...p,
        [e.target.name]: "Pasted content is too long.",
      }));
      return;
    }
    if (e.target.name === "username" && isThreat(pasted)) {
      e.preventDefault();
      setErrors((p) => ({
        ...p,
        username: "Pasted content contains invalid characters.",
      }));
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitGuard.current || stage === "loading") return;
    if (isLockedOut()) {
      setStatusMsg(`Too many failed attempts. Wait ${lockoutSecondsLeft()}s.`);
      setStage("error");
      return;
    }

    const usernameErr = validateUsername(form.username);
    const passwordErr = validatePassword(form.password);
    setErrors({ username: usernameErr, password: passwordErr });
    setTouched({ username: true, password: true });
    if (usernameErr || passwordErr) return;
    if (isThreat(form.username)) {
      setStatusMsg("Invalid characters detected in username.");
      setStage("error");
      return;
    }

    submitGuard.current = true;
    try {
      setStage("loading");
      setStatusMsg("Verifying credentials...");

      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/login`
        : "/api/login";

      const res = await safeFetch(
        apiUrl,
        {
          method: "POST",
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        },
        10000,
      );

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (res.ok && data?.success === true) {
        clearAttempts();
        if (
          typeof data.sessionToken !== "string" ||
          data.sessionToken.length !== 64
        ) {
          throw new Error("Invalid session token received.");
        }

        // ── Stamp full secure session (token + timestamp + fingerprint + idle) ──
        await stampSession(data.sessionToken);
        // ── Persist team data so dashboard survives a page refresh ──
        saveTeamData(data);

        const safeName = encodeForDisplay(data.teamName ?? "");
        setStage("success");
        setStatusMsg(`⚔ Welcome, ${safeName}!`);
        // replace: true so back button on dashboard won't return to login
        setTimeout(
          () => navigate("/arena", { state: data, replace: true }),
          1200,
        );
      } else {
        const attempts = recordFailedAttempt();
        setStage("error");
        if (isLockedOut()) {
          const secs = lockoutSecondsLeft();
          setLockSecs(secs);
          setStatusMsg(`Too many failed attempts. Locked for ${secs}s.`);
          lockTimerRef.current = setInterval(() => {
            const s = lockoutSecondsLeft();
            setLockSecs(s);
            if (s <= 0) clearInterval(lockTimerRef.current);
          }, 1000);
        } else {
          const left = MAX_ATTEMPTS - attempts;
          const serverMsg = data?.message || "Invalid username or password.";
          setStatusMsg(
            left > 0
              ? `${serverMsg} (${left} attempt${left !== 1 ? "s" : ""} remaining)`
              : "Too many failed attempts. Please wait.",
          );
        }
      }
    } catch (err) {
      recordFailedAttempt();
      setStage("error");
      if (err.name === "TimeoutError") {
        setStatusMsg("Request timed out. Check your connection.");
      } else if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError") ||
        err.message?.includes("ECONNREFUSED")
      ) {
        setStatusMsg(
          "Cannot reach server. Is the backend running on port 5000?",
        );
      } else {
        setStatusMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      submitGuard.current = false;
    }
  }, [form, stage, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  const isLoading = stage === "loading";
  const isLocked = lockSecs > 0;
  const btnDisabled = isLoading || isLocked;

  const statusClass =
    {
      success: "bg-[#FFC451]/10 border-[#FFC451]/40 text-[#FFC451]",
      error: "bg-[#DC2626]/10 border-[#DC2626]/40 text-[#DC2626]",
      loading: "bg-[#FFC451]/10 border-[#FFC451]/20 text-[#FFC451]/70",
    }[stage] ?? "";

  const inputClass = (field) =>
    [
      "w-full bg-[#111827] rounded-xl px-4 py-3 text-white text-sm font-clash outline-none",
      "placeholder:text-white/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
      touched[field] && errors[field]
        ? "border border-[#DC2626]/60 ring-2 ring-[#DC2626]/10"
        : touched[field] && !errors[field]
          ? "border border-[#FFC451]/40 ring-2 ring-[#FFC451]/10"
          : "border border-[#FFC451]/10 focus:border-[#FFC451]/30 focus:ring-2 focus:ring-[#FFC451]/5",
    ].join(" ");

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root {
          margin: 0 !important; padding: 0 !important;
          background: #111827 !important;
          min-height: 100vh !important; width: 100% !important;
        }
      `}</style>

      <div
        className="font-clash relative"
        style={{
          width: "100vw",
          minHeight: "100vh",
          background: "#111827",
          overflowX: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1rem",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Full-viewport background fill */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "#111827",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#DC2626]/8 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#FFC451]/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* ── Logout reason banner ── */}
          {reasonMsg && (
            <div className="mb-5 bg-[#FFC451]/8 border border-[#FFC451]/25 rounded-xl px-4 py-3 text-center">
              <p className="text-[#FFC451]/80 text-[0.72rem] font-clash tracking-wide">
                {reasonMsg}
              </p>
            </div>
          )}

          {/* ── Header ── */}
          <div className="text-center mb-7">
            <span className="inline-block bg-[#FFC451] text-[#000] text-[0.6rem] font-clash tracking-[0.25em] px-5 py-1.5 rounded-full mb-4">
              CLASH OF CODERS
            </span>
            <h1 className="text-[#FFC451] text-3xl font-clash tracking-wide drop-shadow-[0_0_20px_rgba(255,196,81,0.25)]">
              ROUND 1 LOGIN
            </h1>
            <p className="text-white/25 text-xs mt-1 font-clash tracking-widest">
              CODE WARFARE · THE STRATEGIC CONQUEST
            </p>
          </div>

          {/* ── Card ── */}
          <div className="bg-[#000] border border-[#FFC451]/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(220,38,38,0.08),0_25px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-[#FFC451]/10" />
              <span className="text-[#DC2626] text-xs">⚔</span>
              <div className="flex-1 h-px bg-[#FFC451]/10" />
            </div>

            {isLocked && (
              <div className="mb-5 bg-[#DC2626]/10 border border-[#DC2626]/40 rounded-xl px-4 py-3 text-center">
                <p className="text-[#DC2626] text-[0.75rem] font-clash tracking-wide">
                  🔒 LOCKED — Try again in {lockSecs}s
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#FFC451]/60 text-[0.72rem] font-clash tracking-widest uppercase">
                  🧑‍💻 Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your username"
                  disabled={btnDisabled}
                  maxLength={50}
                  autoComplete="username"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Username"
                  aria-invalid={!!(touched.username && errors.username)}
                  className={inputClass("username")}
                />
                {touched.username && errors.username && (
                  <p
                    className="text-[#DC2626] text-[0.7rem] font-clash pl-1"
                    role="alert"
                  >
                    ⚠ {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#FFC451]/60 text-[0.72rem] font-clash tracking-widest uppercase">
                  🔑 Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    disabled={btnDisabled}
                    maxLength={100}
                    autoComplete="current-password"
                    spellCheck="false"
                    aria-label="Password"
                    aria-invalid={!!(touched.password && errors.password)}
                    className={inputClass("password") + " pr-14"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFC451]/30 hover:text-[#FFC451]/70 text-[0.65rem] font-clash tracking-widest transition-colors select-none"
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p
                    className="text-[#DC2626] text-[0.7rem] font-clash pl-1"
                    role="alert"
                  >
                    ⚠ {errors.password}
                  </p>
                )}
                <p className="text-[#FFC451]/35 text-[0.62rem] font-clash pl-2.5 tracking-wide">
                  Credentials shared by the organizer via email
                </p>
              </div>
            </div>

            {statusMsg && (
              <div
                className={`mt-5 flex items-center gap-2 px-4 py-3 rounded-xl border font-clash text-[0.8rem] ${statusClass}`}
                role="alert"
                aria-live="polite"
              >
                {isLoading && (
                  <span className="inline-block w-3 h-3 border-2 border-[#FFC451]/30 border-t-[#FFC451] rounded-full animate-spin shrink-0" />
                )}
                <span>{statusMsg}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={btnDisabled}
              aria-disabled={btnDisabled}
              aria-label="Login to enter the battlefield"
              className={[
                "mt-6 w-full py-3 rounded-xl font-clash text-sm tracking-widest transition-all duration-200 select-none",
                btnDisabled
                  ? "bg-[#111827] border border-[#FFC451]/10 text-[#FFC451]/30 cursor-not-allowed"
                  : "bg-[#DC2626] hover:bg-[#b91c1c] text-[#FFC451] hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_24px_rgba(220,38,38,0.3)] cursor-pointer",
              ].join(" ")}
            >
              {isLocked
                ? `🔒 LOCKED (${lockSecs}s)`
                : isLoading
                  ? "AUTHENTICATING..."
                  : "⚔ ENTER THE BATTLEFIELD"}
            </button>
          </div>

          <p className="text-center text-[#FFC451]/35 text-[0.6rem] font-clash tracking-widest mt-5">
            CLASH OF CODERS · ROUND 1 · SECURED LOGIN
          </p>
        </div>
      </div>
    </>
  );
}
