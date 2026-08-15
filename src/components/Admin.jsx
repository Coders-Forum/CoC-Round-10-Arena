import { useState, useEffect, useCallback } from "react";

export default function Admin() {
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem("coc_admin_token") || "";
  });
  const [activeStage, setActiveStage] = useState("round1");
  const [selectedStage, setSelectedStage] = useState("round1");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error" | "info"

  const apiUrl = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? "http://localhost:5000" : "");

  // Fetch current active contest stage
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contest/status`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.activeStage) {
        setActiveStage(data.activeStage);
        setSelectedStage(data.activeStage);
      }
    } catch (err) {
      console.error("Failed to fetch contest status:", err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      setStatusMsg("Please enter username and password.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok && data.success && data.adminToken) {
        sessionStorage.setItem("coc_admin_token", data.adminToken);
        setAdminToken(data.adminToken);
        if (data.activeStage) {
          setActiveStage(data.activeStage);
          setSelectedStage(data.activeStage);
        }
        setStatusMsg("Admin authenticated successfully.");
        setStatusType("success");
      } else {
        setStatusMsg(data.message || "Invalid credentials.");
        setStatusType("error");
      }
    } catch {
      setStatusMsg("Unable to connect to backend server on " + apiUrl);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Stage Update
  const handleUpdateStage = async () => {
    if (selectedStage === activeStage) {
      setStatusMsg("Selected stage is already active.");
      setStatusType("info");
      return;
    }

    setLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/contest/stage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ activeStage: selectedStage }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActiveStage(data.activeStage);
        setSelectedStage(data.activeStage);
        setStatusMsg(`Contest stage successfully updated to: ${getStageLabel(data.activeStage)}`);
        setStatusType("success");
      } else {
        if (res.status === 401) {
          sessionStorage.removeItem("coc_admin_token");
          setAdminToken("");
          setStatusMsg("Session expired. Please log in again.");
          setStatusType("error");
        } else {
          setStatusMsg(data.message || "Failed to update stage.");
          setStatusType("error");
        }
      }
    } catch {
      setStatusMsg("Network error. Could not reach backend.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    fetch(`${apiUrl}/api/admin/logout`, {
      method: "POST",
      headers: { "X-Admin-Token": adminToken, "X-Requested-With": "XMLHttpRequest" },
    }).catch(() => {});
    sessionStorage.removeItem("coc_admin_token");
    setAdminToken("");
    setStatusMsg("Admin logged out.");
    setStatusType("info");
  };

  function getStageLabel(stage) {
    switch (stage) {
      case "round0":
        return "Round 0 — Codefront (Online GFG)";
      case "round1":
        return "Round 1 — Code Warfare";
      case "round2_phase1":
        return "Round 2 — Phase 1";
      case "round2_phase2":
        return "Round 2 — Phase 2";
      case "round2_phase3":
        return "Round 2 — Phase 3";
      default:
        return stage;
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B0F1A",
        color: "#ffffff",
        fontFamily: "'Clash', 'Clash Display', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "rgba(17, 24, 39, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 196, 81, 0.3)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,196,81,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span
            style={{
              background: "#FFC451",
              color: "#000",
              fontSize: "11px",
              fontWeight: "800",
              padding: "4px 12px",
              borderRadius: "100px",
              letterSpacing: "0.15em",
            }}
          >
            ORGANIZER PORTAL
          </span>
          <h1
            style={{
              color: "#FFC451",
              fontSize: "26px",
              fontWeight: "800",
              letterSpacing: "1px",
              marginTop: "12px",
              textShadow: "0 0 20px rgba(255,196,81,0.35)",
            }}
          >
            CLASH OF CODERS — ADMIN
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "4px" }}>
            Contest Stage & Phase Control Panel
          </p>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              background:
                statusType === "success"
                  ? "rgba(34, 197, 94, 0.15)"
                  : statusType === "error"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(255, 196, 81, 0.15)",
              border:
                statusType === "success"
                  ? "1px solid #22c55e"
                  : statusType === "error"
                  ? "1px solid #ef4444"
                  : "1px solid #ffc451",
              color:
                statusType === "success"
                  ? "#4ade80"
                  : statusType === "error"
                  ? "#f87171"
                  : "#ffd700",
            }}
          >
            {statusMsg}
          </div>
        )}

        {/* ── NOT AUTHENTICATED: Show Admin Login Form ── */}
        {!adminToken ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#9CA3AF", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Admin Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={loginForm.username}
                onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,196,81,0.3)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#9CA3AF", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Admin Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,196,81,0.3)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "12px",
                background: "#FFC451",
                color: "#000",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "1px",
                padding: "14px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 0 15px rgba(255,196,81,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "AUTHENTICATING..." : "LOGIN AS ADMIN →"}
            </button>

            <p style={{ fontSize: "11px", color: "#6B7280", textAlign: "center", marginTop: "8px" }}>
              Default dev credentials: <code>admin</code> / <code>Admin@COC2026</code>
            </p>
          </form>
        ) : (
          /* ── AUTHENTICATED: Show Stage Control Panel ── */
          <div>
            {/* Active Stage Indicator */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 215, 0, 0.35)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "#9CA3AF", letterSpacing: "2px", textTransform: "uppercase" }}>
                CURRENTLY ACTIVE STAGE
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#FFD700",
                  marginTop: "6px",
                  letterSpacing: "1px",
                  textShadow: "0 0 12px rgba(255,215,0,0.5)",
                }}
              >
                ⚡ {getStageLabel(activeStage)}
              </div>
            </div>

            <h3 style={{ fontSize: "13px", color: "#FFC451", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px", fontWeight: "700" }}>
              SELECT ACTIVE CONTEST STAGE
            </h3>

            {/* Radio options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { id: "round0", label: "Round 0 — Codefront", desc: "Online GFG Round (External)" },
                { id: "round1", label: "Round 1 — Code Warfare", desc: "25 HackerRank Contests Live" },
                { id: "round2_phase1", label: "Round 2 — Phase 1", desc: "1 Registration + 25 Direct Challenges" },
                { id: "round2_phase2", label: "Round 2 — Phase 2", desc: "1 Registration + 25 Direct Challenges" },
                { id: "round2_phase3", label: "Round 2 — Phase 3", desc: "1 Registration + 25 Direct Challenges" },
              ].map((stage) => {
                const isSelected = selectedStage === stage.id;
                const isCurrentActive = activeStage === stage.id;

                return (
                  <label
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 16px",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(255, 196, 81, 0.12)" : "rgba(0, 0, 0, 0.3)",
                      border: isSelected ? "1px solid #FFC451" : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="contestStage"
                      value={stage.id}
                      checked={isSelected}
                      onChange={() => setSelectedStage(stage.id)}
                      style={{ accentColor: "#FFC451", transform: "scale(1.2)" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: isSelected ? "#FFD700" : "#E5E7EB" }}>
                        {stage.label}
                        {isCurrentActive && (
                          <span
                            style={{
                              marginLeft: "8px",
                              fontSize: "10px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: "#22c55e",
                              color: "#000",
                              fontWeight: "800",
                            }}
                          >
                            LIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                        {stage.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleUpdateStage}
                disabled={loading || selectedStage === activeStage}
                style={{
                  flex: 1,
                  background: selectedStage === activeStage ? "#374151" : "#FFC451",
                  color: selectedStage === activeStage ? "#9CA3AF" : "#000",
                  fontWeight: "800",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  padding: "14px",
                  borderRadius: "8px",
                  cursor: loading || selectedStage === activeStage ? "not-allowed" : "pointer",
                  boxShadow: selectedStage === activeStage ? "none" : "0 0 20px rgba(255,196,81,0.5)",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "UPDATING STAGE..." : "UPDATE STAGE ⚡"}
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(220, 38, 38, 0.2)",
                  border: "1px solid #DC2626",
                  color: "#FCA5A5",
                  fontWeight: "700",
                  fontSize: "13px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
