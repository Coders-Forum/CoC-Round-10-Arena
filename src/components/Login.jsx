import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SESSION_KEY, SESSION_TS_KEY, TEAM_DATA_KEY } from "../utils/sessionSecurity.js";
import { validateContestParams } from "../config/contestConfig.js";

// ─── Simple, reliable login for contest day ───────────────────────
// No fingerprinting | No per-browser lockouts | No complex throttles
// Just clean username + password → session token → /arena
// ─────────────────────────────────────────────────────────────────

const FONT = "'Clash', 'Clash Display', sans-serif";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [status, setStatus]      = useState("");   // user-visible message
  const [isError, setIsError]    = useState(false);
  const [loading, setLoading]    = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const abortRef  = useRef(null);

  const { queryString } = validateContestParams(location.search);

  // If already logged in send straight to arena
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      navigate(`/arena${queryString}`, { replace: true });
    }
  }, []);

  // Clean up on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  // ── Show incoming reason if redirected here (e.g. session expired)
  useEffect(() => {
    const reason = location.state?.reason;
    if (reason === "session_expired") msg("⏱ Session expired. Please log in again.", true);
    else if (reason === "logout")     msg("✅ Logged out successfully.", false);
  }, []);

  function msg(text, error = false) {
    setStatus(text);
    setIsError(error);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) { msg("Enter your team username and password.", true); return; }
    if (u.length < 3) { msg("Username too short.", true); return; }
    if (p.length < 6) { msg("Password too short.", true); return; }

    // Abort any ongoing request before starting a new one
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    msg("Verifying credentials…", false);

    const apiBase = import.meta.env.VITE_API_URL !== undefined
      ? import.meta.env.VITE_API_URL
      : (import.meta.env.DEV ? "http://localhost:5000" : "");

    try {
      const res = await fetch(`${apiBase}/api/login`, {
        method:  "POST",
        headers: {
          "Content-Type":    "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body:   JSON.stringify({ username: u, password: p }),
        signal: ctrl.signal,
      });

      const data = await res.json();

      if (data.success && data.sessionToken) {
        // Store session
        sessionStorage.setItem(SESSION_KEY,    data.sessionToken);
        sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
        // Store team data for display in arena
        if (data.teamName) {
          sessionStorage.setItem("teamName", data.teamName);
          try {
            sessionStorage.setItem(TEAM_DATA_KEY, JSON.stringify({
              teamName:   data.teamName,
              members:    data.members    ?? [],
              score:      data.score      ?? 0,
              rank:       data.rank       ?? 0,
              totalLands: data.totalLands ?? 0,
            }));
          } catch { /* storage full — ignore */ }
        }

        msg(`✅ Welcome, ${data.teamName}!`, false);
        setTimeout(() => navigate(`/arena${queryString}`, { replace: true }), 400);
      } else {
        msg(data.message || "Invalid username or password.", true);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      msg("Connection error. Check your network and try again.", true);
    } finally {
      setLoading(false);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,196,81,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontFamily: FONT,
    fontSize: "14px",
    letterSpacing: "0.05em",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0F1A",
        backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(220,38,38,0.08) 0%, transparent 65%)",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(17,24,39,0.92)",
          border: "1px solid rgba(255,196,81,0.18)",
          borderRadius: "18px",
          padding: "36px 30px 32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#FFC451",
              color: "#000",
              fontWeight: "900",
              fontSize: "11px",
              letterSpacing: "0.2em",
              padding: "4px 14px",
              borderRadius: "100px",
              marginBottom: "14px",
              boxShadow: "0 0 20px rgba(255,196,81,0.35)",
            }}
          >
            COC · CLASH OF CODERS
          </span>
          <h1
            style={{
              color: "#FFC451",
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "0.05em",
              margin: 0,
              textShadow: "0 0 20px rgba(255,196,81,0.25)",
            }}
          >
            ⚔ ENTER THE ARENA
          </h1>
          <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "6px", letterSpacing: "0.05em" }}>
            Sign in with your team credentials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", color: "#9CA3AF", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "6px", textTransform: "uppercase" }}
            >
              Team Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e)  => (e.target.style.borderColor = "#FFC451")}
              onBlur={(e)   => (e.target.style.borderColor = "rgba(255,196,81,0.25)")}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{ display: "block", color: "#9CA3AF", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "6px", textTransform: "uppercase" }}
            >
              Password (Roll Number)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e)  => (e.target.style.borderColor = "#FFC451")}
                onBlur={(e)   => (e.target.style.borderColor = "rgba(255,196,81,0.25)")}
                autoComplete="current-password"
                disabled={loading}
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#6B7280", cursor: "pointer",
                  fontSize: "16px", padding: "4px", lineHeight: 1,
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <p style={{ color: "#4B5563", fontSize: "11px", marginBottom: "22px", letterSpacing: "0.03em" }}>
            Credentials sent to you by the organizers
          </p>

          {/* Status message */}
          {status && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                background: isError ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                border: `1px solid ${isError ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
                color: isError ? "#FCA5A5" : "#86EFAC",
                textAlign: "center",
              }}
            >
              {status}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "rgba(255,196,81,0.4)" : "#FFC451",
              color: "#000",
              fontFamily: FONT,
              fontWeight: "800",
              fontSize: "14px",
              letterSpacing: "0.12em",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 20px rgba(255,196,81,0.35)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "AUTHENTICATING…" : "⚔ ENTER THE BATTLEFIELD"}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: "10px",
            letterSpacing: "0.15em",
            marginTop: "24px",
            textTransform: "uppercase",
          }}
        >
          CLASH OF CODERS · SECURED LOGIN
        </p>
      </div>
    </div>
  );
}
