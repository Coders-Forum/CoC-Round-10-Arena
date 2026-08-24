import { useState, useEffect, useCallback } from "react";
import { getLandingPageUrl, CONTEST_CONFIG } from "../config/contestConfig";

export default function Admin() {
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem("coc_admin_token") || "";
  });
  const [activeStage, setActiveStage] = useState("round1");
  const [selectedStage, setSelectedStage] = useState("round1");
  const [disabledLands, setDisabledLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingLands, setSavingLands] = useState(false);
  const [landFilter, setLandFilter] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error" | "info"

  const apiUrl = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? "http://localhost:5000" : "");

  const round1Lands = CONTEST_CONFIG?.round1?.lands || [];

  // Fetch current active contest stage & disabled lands
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contest/status`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        if (data.activeStage) {
          setActiveStage(data.activeStage);
          setSelectedStage(data.activeStage);
        }
        if (Array.isArray(data.disabledLands)) {
          setDisabledLands(data.disabledLands);
        }
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
        fetchStatus();
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

  // Toggle single land disabled state
  const handleToggleLand = (landKey) => {
    setDisabledLands((prev) => {
      const isAlreadyDisabled = prev.includes(landKey);
      if (isAlreadyDisabled) {
        return prev.filter((k) => k !== landKey);
      } else {
        return [...prev, landKey];
      }
    });
  };

  // Batch toggle all lands
  const handleSelectAllLands = () => {
    setDisabledLands(round1Lands.map((l) => l.landKey));
  };

  const handleClearAllLands = () => {
    setDisabledLands([]);
  };

  // Save disabled lands to backend
  const handleSaveDisabledLands = async () => {
    setSavingLands(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/contest/disabled-lands`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ disabledLands }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDisabledLands(data.disabledLands || disabledLands);
        setStatusMsg(`✅ Conquered lands saved! (${disabledLands.length} of 25 lands disabled)`);
        setStatusType("success");
      } else {
        if (res.status === 401) {
          sessionStorage.removeItem("coc_admin_token");
          setAdminToken("");
          setStatusMsg("Session expired. Please log in again.");
          setStatusType("error");
        } else {
          setStatusMsg(data.message || "Failed to save disabled lands.");
          setStatusType("error");
        }
      }
    } catch {
      setStatusMsg("Network error. Could not save disabled lands.");
      setStatusType("error");
    } finally {
      setSavingLands(false);
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
        {/* Navigation & Header */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
          <a
            href={getLandingPageUrl()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#FFC451",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textDecoration: "none",
              padding: "5px 12px",
              borderRadius: "100px",
              background: "rgba(255, 196, 81, 0.08)",
              border: "1px solid rgba(255, 196, 81, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <span>←</span>
            <span>LANDING PAGE</span>
          </a>
        </div>

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
                placeholder="Enter admin username"
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

            {/* Stage Action Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
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
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ROUND 1: PHASE 1 & 2 CONQUERED / DISABLED LANDS MANAGER   */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div style={{
              borderTop: "1px solid rgba(255, 196, 81, 0.25)",
              paddingTop: "24px",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "14px", color: "#FFC451", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>
                  ⚔️ Round 1 Conquered Lands
                </h3>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "100px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", color: "#4ade80", fontWeight: "700" }}>
                    🟢 Active: {round1Lands.length - disabledLands.length}
                  </span>
                  <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "100px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", fontWeight: "700" }}>
                    🔴 Conquered: {disabledLands.length}
                  </span>
                </div>
              </div>

              <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "16px", lineHeight: "1.5" }}>
                Select lands conquered during Phase 1. When disabled, teams clicking the land in Arena will receive an alert stating <em>"This land has already been conquered"</em>.
              </p>

              {/* Quick Actions & Filter */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                <input
                  type="text"
                  placeholder="Filter lands..."
                  value={landFilter}
                  onChange={(e) => setLandFilter(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,196,81,0.25)",
                    color: "#fff",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={handleSelectAllLands}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#fca5a5",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Conquer All
                </button>
                <button
                  type="button"
                  onClick={handleClearAllLands}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    color: "#86efac",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Enable All
                </button>
              </div>

              {/* Lands Grid List */}
              <div style={{
                maxHeight: "260px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                paddingRight: "4px",
                marginBottom: "16px"
              }}>
                {round1Lands
                  .filter((l) =>
                    !landFilter ||
                    l.landName.toLowerCase().includes(landFilter.toLowerCase()) ||
                    l.landKey.toLowerCase().includes(landFilter.toLowerCase()) ||
                    String(l.landId).includes(landFilter)
                  )
                  .map((land) => {
                    const isConquered = disabledLands.includes(land.landKey);

                    return (
                      <div
                        key={land.landKey}
                        onClick={() => handleToggleLand(land.landKey)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: isConquered ? "rgba(239, 68, 68, 0.12)" : "rgba(0, 0, 0, 0.4)",
                          border: `1px solid ${isConquered ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.08)"}`,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            checked={isConquered}
                            onChange={() => {}} // Handled by container onClick
                            style={{ accentColor: "#ef4444", transform: "scale(1.2)", cursor: "pointer" }}
                          />
                          <div>
                            <span style={{ fontSize: "12px", fontWeight: "800", color: "#FFC451", marginRight: "6px" }}>
                              #{String(land.landId).padStart(2, "0")}
                            </span>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: isConquered ? "#fca5a5" : "#fff" }}>
                              {land.landName}
                            </span>
                            <span style={{ fontSize: "11px", color: "#6B7280", marginLeft: "6px" }}>
                              ({land.landKey})
                            </span>
                          </div>
                        </div>

                        <span style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          letterSpacing: "0.5px",
                          padding: "3px 8px",
                          borderRadius: "100px",
                          background: isConquered ? "#ef4444" : "rgba(34, 197, 94, 0.2)",
                          color: isConquered ? "#fff" : "#4ade80",
                          border: isConquered ? "none" : "1px solid #22c55e"
                        }}>
                          {isConquered ? "🔒 CONQUERED" : "AVAILABLE"}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Save Disabled Lands Button */}
              <button
                type="button"
                onClick={handleSaveDisabledLands}
                disabled={savingLands}
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg, #FFC451 0%, #FFD700 100%)",
                  color: "#000",
                  fontWeight: "800",
                  fontSize: "13px",
                  letterSpacing: "1px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: savingLands ? "not-allowed" : "pointer",
                  boxShadow: "0 0 16px rgba(255,196,81,0.3)",
                  transition: "all 0.2s ease",
                  marginBottom: "16px"
                }}
              >
                {savingLands ? "SAVING CONQUERED LANDS..." : `SAVE CONQUERED LANDS (${disabledLands.length} DISABLED) 🛡️`}
              </button>
            </div>

            {/* Logout Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(220, 38, 38, 0.2)",
                  border: "1px solid #DC2626",
                  color: "#FCA5A5",
                  fontWeight: "700",
                  fontSize: "13px",
                  padding: "10px 20px",
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
