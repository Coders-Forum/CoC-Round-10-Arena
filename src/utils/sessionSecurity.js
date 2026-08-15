// ═══════════════════════════════════════════════════════════════
//  SESSION SECURITY HELPERS — shared across App, Login, Dashboard
// ═══════════════════════════════════════════════════════════════

export const SESSION_KEY     = "coc_sessionToken";
export const SESSION_TS_KEY  = "coc_sessionIssuedAt";
export const SESSION_FP_KEY  = "coc_sessionFingerprint";
export const IDLE_TS_KEY     = "coc_lastActivityAt";
export const TEAM_DATA_KEY   = "coc_teamData";
export const SESSION_TTL_MS  = 4 * 60 * 60 * 1000;  // 4 hours
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;       // 30 min idle

// ── Build a browser fingerprint (SHA-256 hash) ─────────────────
export async function buildFingerprint() {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency ?? "",
    navigator.platform ?? "",
  ].join("|");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Session state checks ───────────────────────────────────────
export function isLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

export function isSessionExpired() {
  const t = parseInt(sessionStorage.getItem(SESSION_TS_KEY) ?? "0", 10);
  return t === 0 || Date.now() - t > SESSION_TTL_MS;
}

export function isIdleExpired() {
  const t = parseInt(sessionStorage.getItem(IDLE_TS_KEY) ?? "0", 10);
  return t === 0 || Date.now() - t > IDLE_TIMEOUT_MS;
}

export function isFullyAuthenticated() {
  return isLoggedIn() && !isSessionExpired() && !isIdleExpired();
}

// ── Session lifecycle ──────────────────────────────────────────
export function touchActivity() {
  try { sessionStorage.setItem(IDLE_TS_KEY, String(Date.now())); } catch { /* ignore */ }
}

export function clearSession() {
  [SESSION_KEY, SESSION_TS_KEY, SESSION_FP_KEY, IDLE_TS_KEY, "teamName", TEAM_DATA_KEY].forEach(k => {
    try { sessionStorage.removeItem(k); } catch { /* ignore */ }
  });
}

export async function stampSession(token) {
  const fp = await buildFingerprint();
  sessionStorage.setItem(SESSION_KEY,    token);
  sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
  sessionStorage.setItem(SESSION_FP_KEY, fp);
  sessionStorage.setItem(IDLE_TS_KEY,    String(Date.now()));
}

// ── Team data persistence (survives refresh, cleared on logout) ─
export function saveTeamData(data) {
  try {
    // Only persist the fields we need — never store the session token here
    const safe = {
      teamName:          data.teamName          ?? "",
      score:             data.score             ?? 0,
      rank:              data.rank              ?? 0,
      totalLands:        data.totalLands        ?? 0,
      members:           data.members           ?? [],
      conqueredLand:     data.conqueredLand     ?? null,
      attackAssignments: data.attackAssignments ?? [],
    };
    sessionStorage.setItem(TEAM_DATA_KEY, JSON.stringify(safe));
  } catch { /* ignore */ }
}

export function loadTeamData() {
  try {
    const raw = sessionStorage.getItem(TEAM_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Human-readable logout reason messages ─────────────────────
export const REASON_MESSAGES = {
  session_expired:      "⏱ Your session has expired. Please log in again.",
  idle_timeout:         "💤 You were logged out due to inactivity.",
  tab_hidden:           "🔒 Logged out: tab was hidden for too long.",
  fingerprint_mismatch: "⚠ Security alert: session mismatch. Please log in again.",
  tampered:             "🚨 Session data was modified. Please log in again.",
  logout:               "✅ You have been logged out successfully.",
};