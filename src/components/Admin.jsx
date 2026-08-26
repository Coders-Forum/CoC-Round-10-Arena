import { useState, useEffect, useCallback } from "react";
import { getLandingPageUrl, CONTEST_CONFIG, getApiUrl } from "../config/contestConfig";
import { phase1Data } from "../leaderboard/leaderboardData";

function getStoredAdminToken() {
  try {
    return sessionStorage.getItem("coc_admin_token") || localStorage.getItem("coc_admin_token") || "";
  } catch {
    return "";
  }
}

function setStoredAdminToken(token) {
  try { sessionStorage.setItem("coc_admin_token", token); } catch {}
  try { localStorage.setItem("coc_admin_token", token); } catch {}
}

function removeStoredAdminToken() {
  try { sessionStorage.removeItem("coc_admin_token"); } catch {}
  try { localStorage.removeItem("coc_admin_token"); } catch {}
}

async function safeParseResponse(res) {
  try {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: text || `Server returned status ${res.status}` };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
}


export default function Admin() {
  const [adminToken, setAdminToken] = useState(() => {
    return getStoredAdminToken();
  });
  const [activeStage, setActiveStage] = useState("round1");
  const [selectedStage, setSelectedStage] = useState("round1");
  const [disabledLands, setDisabledLands] = useState([]);
  const [bypassLogin, setBypassLogin] = useState(false);
  const [togglingBypass, setTogglingBypass] = useState(false);
  const [selectedTeamForResults, setSelectedTeamForResults] = useState("Phoneix");
  const [activeResultsPhase, setActiveResultsPhase] = useState("phase1");
  const [selectedPhaseForEditing, setSelectedPhaseForEditing] = useState("phase1");
  const [phase1Map, setPhase1Map] = useState(() => {
    const init = {};
    phase1Data.forEach(t => { init[t.teamName] = t.conqueredLands || []; });
    return init;
  });
  const [phase2Map, setPhase2Map] = useState(() => {
    const init = {};
    phase1Data.forEach(t => { init[t.teamName] = []; });
    return init;
  });
  const [phase3Map, setPhase3Map] = useState(() => {
    const init = {};
    phase1Data.forEach(t => { init[t.teamName] = []; });
    return init;
  });
  const [updatingResultsPhase, setUpdatingResultsPhase] = useState(false);
  const [eliminatedTeams, setEliminatedTeams] = useState([]);
  const [manualRanks, setManualRanks] = useState({ phase1: {}, phase2: {}, phase3: {} });
  const [savingManualRanks, setSavingManualRanks] = useState(false);
  const [savingEliminations, setSavingEliminations] = useState(false);
  const [savingConquests, setSavingConquests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingLands, setSavingLands] = useState(false);



  const [landFilter, setLandFilter] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error" | "info"

  const apiUrl = getApiUrl();

  const round1Lands = CONTEST_CONFIG?.round1?.lands || [];

  // Fetch current active contest stage & disabled lands
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contest/status`, { cache: "no-store" });
      const data = await safeParseResponse(res);
      if (data.success) {
        if (data.activeStage) {
          setActiveStage(data.activeStage);
          setSelectedStage(data.activeStage);
        }
        if (Array.isArray(data.disabledLands)) {
          setDisabledLands(data.disabledLands);
        }
        if (typeof data.bypassLogin === "boolean") {
          setBypassLogin(data.bypassLogin);
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
    const cleanUsername = (loginForm.username || "").trim();
    const cleanPassword = loginForm.password || "";

    if (!cleanUsername || !cleanPassword) {
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
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
        }),
      });

      const data = await safeParseResponse(res);

      if (res.ok && data.success && data.adminToken) {
        setStoredAdminToken(data.adminToken);
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

      const data = await safeParseResponse(res);

      if (res.ok && data.success) {
        setActiveStage(data.activeStage);
        setSelectedStage(data.activeStage);
        setStatusMsg(`Contest stage successfully updated to: ${getStageLabel(data.activeStage)}`);
        setStatusType("success");
      } else {
        if (res.status === 401) {
          removeStoredAdminToken();
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

  // Handle Login Dependency Bypass Toggle (Nuke Button)
  const handleToggleBypassLogin = async () => {
    const targetState = !bypassLogin;
    setTogglingBypass(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/contest/bypass-login`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ bypassLogin: targetState }),
      });

      const data = await safeParseResponse(res);

      if (res.ok && data.success) {
        setBypassLogin(data.bypassLogin);
        localStorage.setItem("coc_bypass_login", String(data.bypassLogin));
        setStatusMsg(
          data.bypassLogin
            ? "☢️ LOGIN DEPENDENCY NUKED! All incoming users now enter the Arena directly."
            : "🛡️ Login requirement restored. Users must log in with credentials."
        );
        setStatusType(data.bypassLogin ? "error" : "success");
      } else {
        if (res.status === 401) {
          removeStoredAdminToken();
          setAdminToken("");
          setStatusMsg("Session expired. Please log in again.");
          setStatusType("error");
        } else {
          setStatusMsg(data.message || "Failed to update login bypass state.");
          setStatusType("error");
        }
      }
    } catch (err) {
      setStatusMsg("Network error. Could not reach backend: " + err.message);
      setStatusType("error");
    } finally {
      setTogglingBypass(false);
    }
  };

  // Fetch live conquests & active results phase from backend
  const fetchConquests = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/results/conquests`, { cache: "no-store" });
      const data = await safeParseResponse(res);
      if (data.success) {
        if (data.activeResultsPhase) setActiveResultsPhase(data.activeResultsPhase);
        if (Array.isArray(data.eliminatedTeams)) setEliminatedTeams(data.eliminatedTeams);
        if (data.manualRanks) setManualRanks(data.manualRanks);
        if (data.phase1Conquests && Object.keys(data.phase1Conquests).length > 0) {
          setPhase1Map(prev => ({ ...prev, ...data.phase1Conquests }));
        }
        if (data.phase2Conquests && Object.keys(data.phase2Conquests).length > 0) {
          setPhase2Map(prev => ({ ...prev, ...data.phase2Conquests }));
        }
        if (data.phase3Conquests && Object.keys(data.phase3Conquests).length > 0) {
          setPhase3Map(prev => ({ ...prev, ...data.phase3Conquests }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch conquests:", err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchConquests();
  }, [fetchConquests]);

  // Set position / tie rank override for a team in a phase
  const handleSetTeamManualRank = (phase, teamName, rankValue) => {
    setManualRanks(prev => ({
      ...prev,
      [phase]: {
        ...(prev[phase] || {}),
        [teamName]: rankValue
      }
    }));
  };

  // Save manual ranks to backend
  const handleSaveManualRanks = async () => {
    setSavingManualRanks(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/results/manual-ranks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ manualRanks }),
      });

      const data = await safeParseResponse(res);
      if (res.ok && data.success) {
        setStatusMsg("⚖️ Successfully saved tie-breaker / manual rank positions!");
        setStatusType("success");
      } else {
        setStatusMsg(data.message || "Failed to save tie-breaker positions.");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMsg("Failed to connect to backend: " + err.message);
      setStatusType("error");
    } finally {
      setSavingManualRanks(false);
    }
  };

  // Quick Action: Eliminate trailing 5 teams (rank 21-25)
  const handleEliminateTrailing5Teams = () => {
    const trailing5 = phase1Data.slice(-5).map(t => t.teamName);
    setEliminatedTeams(prev => Array.from(new Set([...prev, ...trailing5])));
    setStatusMsg(`❌ Marked trailing 5 teams (${trailing5.join(", ")}) as eliminated. Click SAVE ELIMINATIONS to publish.`);
    setStatusType("info");
  };

  // Toggle single team elimination status
  const handleToggleTeamEliminated = (teamName) => {
    setEliminatedTeams(prev => {
      const exists = prev.includes(teamName);
      return exists ? prev.filter(t => t !== teamName) : [...prev, teamName];
    });
  };

  // Reset all eliminations
  const handleResetEliminations = () => {
    setEliminatedTeams([]);
    setStatusMsg("Cleared all team eliminations.");
    setStatusType("info");
  };

  // Save eliminated teams to backend
  const handleSaveEliminations = async () => {
    setSavingEliminations(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/teams/eliminate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ eliminatedTeams }),
      });

      const data = await safeParseResponse(res);
      if (res.ok && data.success) {
        setStatusMsg(`❌ Successfully saved eliminations! (${eliminatedTeams.length} teams eliminated).`);
        setStatusType("success");
      } else {
        setStatusMsg(data.message || "Failed to save team eliminations.");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMsg("Failed to connect to backend: " + err.message);
      setStatusType("error");
    } finally {
      setSavingEliminations(false);
    }
  };


  // Update active results phase visibility (phase1 | phase2 | phase3 | all)
  const handleUpdateActiveResultsPhase = async (targetPhase) => {
    setUpdatingResultsPhase(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/results/active-phase`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ activeResultsPhase: targetPhase }),
      });

      const data = await safeParseResponse(res);
      if (res.ok && data.success) {
        setActiveResultsPhase(data.activeResultsPhase);
        const labelMap = {
          phase1: "Phase 1 Only (Phase 2, 3 & Final Winners Locked)",
          phase2: "Phase 1 & Phase 2 (Phase 3 & Final Winners Locked)",
          phase3: "Phase 1, 2 & Phase 3 (Final Winners Locked)",
          all: "All Unlocked (Phase 1, 2, 3 & Final Winners Live)"
        };
        setStatusMsg(`🏆 Public Results visibility mode set to: ${labelMap[targetPhase] || targetPhase}`);
        setStatusType("success");
      } else {
        setStatusMsg(data.message || "Failed to update results visibility mode.");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMsg("Failed to connect to backend: " + err.message);
      setStatusType("error");
    } finally {
      setUpdatingResultsPhase(false);
    }
  };

  // Toggle land for selected team and selected phase
  const handleToggleTeamLand = (landName) => {
    const setter = selectedPhaseForEditing === "phase3" ? setPhase3Map :
                   selectedPhaseForEditing === "phase2" ? setPhase2Map : setPhase1Map;
    setter(prev => {
      const currentLands = prev[selectedTeamForResults] || [];
      const exists = currentLands.includes(landName);
      const updated = exists ? currentLands.filter(l => l !== landName) : [...currentLands, landName];
      return { ...prev, [selectedTeamForResults]: updated };
    });
  };

  // Save team conquered lands for selected phase to backend
  const handleSaveTeamConquests = async () => {
    setSavingConquests(true);
    setStatusMsg("");

    const targetMap = selectedPhaseForEditing === "phase3" ? phase3Map :
                      selectedPhaseForEditing === "phase2" ? phase2Map : phase1Map;
    const currentLands = targetMap[selectedTeamForResults] || [];

    try {
      const res = await fetch(`${apiUrl}/api/admin/teams/conquered-lands`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          teamName: selectedTeamForResults,
          phase: selectedPhaseForEditing,
          conqueredLands: currentLands,
        }),
      });

      const data = await safeParseResponse(res);
      if (res.ok && data.success) {
        setStatusMsg(`🏆 Saved ${selectedPhaseForEditing.toUpperCase()} conquered lands for team "${selectedTeamForResults}"! (${currentLands.length} lands)`);
        setStatusType("success");
      } else {
        setStatusMsg(data.message || "Failed to save team conquests.");
        setStatusType("error");
      }
    } catch (err) {
      setStatusMsg("Failed to connect to backend: " + err.message);
      setStatusType("error");
    } finally {
      setSavingConquests(false);
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

      const data = await safeParseResponse(res);

      if (res.ok && data.success) {
        setDisabledLands(data.disabledLands || disabledLands);
        setStatusMsg(`✅ Conquered lands saved! (${disabledLands.length} of 25 lands disabled)`);
        setStatusType("success");
      } else {
        if (res.status === 401) {
          removeStoredAdminToken();
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
    removeStoredAdminToken();
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                autoComplete="username"
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                autoComplete="current-password"
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
            {/* ☢️ LOGIN DEPENDENCY CONTROL PANEL (NUKE BUTTON)            */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div style={{
              borderTop: "1px solid rgba(255, 196, 81, 0.25)",
              paddingTop: "24px",
              marginBottom: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", color: bypassLogin ? "#ef4444" : "#FFC451", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>☢️ Login Dependency Control</span>
                  </h3>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                    Completely remove login requirement and automatically redirect all visitors directly to the Contest Arena of the active stage.
                  </div>
                </div>
                <span style={{
                  fontSize: "11px",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: bypassLogin ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)",
                  border: `1px solid ${bypassLogin ? "#ef4444" : "#22c55e"}`,
                  color: bypassLogin ? "#fca5a5" : "#86efac",
                  fontWeight: "800",
                  letterSpacing: "0.5px"
                }}>
                  {bypassLogin ? "☢️ LOGIN NUKED (PUBLIC ARENA)" : "🔒 LOGIN REQUIRED"}
                </span>
              </div>

              <div style={{
                padding: "16px",
                borderRadius: "12px",
                background: bypassLogin ? "rgba(239, 68, 68, 0.1)" : "rgba(17, 24, 39, 0.6)",
                border: `1px solid ${bypassLogin ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 196, 81, 0.2)"}`,
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#D1D5DB", lineHeight: "1.5" }}>
                  {bypassLogin
                    ? "⚠️ Login dependency is currently NUKED. Anyone accessing the website is routed straight into the 3D Contest Arena without entering credentials."
                    : "Users must enter their valid team credentials on the Login page to access the 3D Contest Arena."}
                </p>

                <button
                  onClick={handleToggleBypassLogin}
                  disabled={togglingBypass}
                  style={{
                    width: "100%",
                    background: bypassLogin ? "#22c55e" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: bypassLogin ? "#000" : "#fff",
                    fontWeight: "900",
                    fontSize: "14px",
                    letterSpacing: "1.5px",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: togglingBypass ? "wait" : "pointer",
                    boxShadow: bypassLogin ? "0 0 15px rgba(34, 197, 94, 0.4)" : "0 0 25px rgba(239, 68, 68, 0.6)",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase"
                  }}
                >
                  {togglingBypass
                    ? "PROCESSING..."
                    : bypassLogin
                      ? "🛡️ RESTORE LOGIN REQUIREMENT"
                      : "☢️ NUKE LOGIN DEPENDENCY (BYPASS LOGIN)"}
                </button>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 🏆 DYNAMIC RESULTS & PHASE ACTIVATION MANAGER            */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div style={{
              borderTop: "1px solid rgba(255, 196, 81, 0.25)",
              paddingTop: "24px",
              marginBottom: "32px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", color: "#FFC451", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>
                    🏆 Results Phase Activation & Lock Control
                  </h3>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                    Control which standings are public on `/results`. Upcoming phases remain locked until activated.
                  </div>
                </div>
                <span style={{
                  fontSize: "11px",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: activeResultsPhase === "all" ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 196, 81, 0.15)",
                  border: `1px solid ${activeResultsPhase === "all" ? "#22c55e" : "#FFC451"}`,
                  color: activeResultsPhase === "all" ? "#86efac" : "#FFD700",
                  fontWeight: "800"
                }}>
                   PUBLIC VIEW: {activeResultsPhase === "phase1" ? "PHASE 1 ONLY (PHASE 2 & FINAL LOCKED)" : activeResultsPhase === "phase2" ? "PHASE 1 & 2 (FINAL LOCKED)" : activeResultsPhase === "phase3" ? "PHASE 1 & 2 (FINAL LOCKED)" : "ALL UNLOCKED 🏆 — FINAL WINNERS LIVE"}
                </span>
              </div>

                {/* Phase Activation Buttons — 3 steps: Phase 1 Only | Phase 1 & 2 | Final Winners */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
                  <button
                    type="button"
                    onClick={() => handleUpdateActiveResultsPhase("phase1")}
                    disabled={updatingResultsPhase || activeResultsPhase === "phase1"}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: activeResultsPhase === "phase1" ? "#FFC451" : "rgba(17, 24, 39, 0.7)",
                      color: activeResultsPhase === "phase1" ? "#000" : "#9CA3AF",
                      border: "1px solid rgba(255,196,81,0.3)",
                      fontWeight: "800",
                      fontSize: "12px",
                      cursor: updatingResultsPhase || activeResultsPhase === "phase1" ? "default" : "pointer"
                    }}
                  >
                    🔒 PHASE 1 ONLY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateActiveResultsPhase("phase2")}
                    disabled={updatingResultsPhase || activeResultsPhase === "phase2"}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: activeResultsPhase === "phase2" ? "#FFC451" : "rgba(17, 24, 39, 0.7)",
                      color: activeResultsPhase === "phase2" ? "#000" : "#9CA3AF",
                      border: "1px solid rgba(255,196,81,0.3)",
                      fontWeight: "800",
                      fontSize: "12px",
                      cursor: updatingResultsPhase || activeResultsPhase === "phase2" ? "default" : "pointer"
                    }}
                  >
                    🔓 PHASE 1 &amp; 2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateActiveResultsPhase("all")}
                    disabled={updatingResultsPhase || activeResultsPhase === "all"}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: activeResultsPhase === "all" ? "#22c55e" : "rgba(17, 24, 39, 0.7)",
                      color: activeResultsPhase === "all" ? "#000" : "#9CA3AF",
                      border: "1px solid rgba(34,197,94,0.3)",
                      fontWeight: "800",
                      fontSize: "12px",
                      cursor: updatingResultsPhase || activeResultsPhase === "all" ? "default" : "pointer"
                    }}
                  >
                    🏆 FINAL WINNERS
                  </button>
                </div>

              {/* Phase-Wise Team Conquest Editor Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <h4 style={{ fontSize: "14px", color: "#E5E7EB", margin: 0, fontWeight: "700" }}>
                  ⚔️ Edit Team Conquered Lands by Phase
                </h4>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPhaseForEditing("phase1")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: selectedPhaseForEditing === "phase1" ? "rgba(255, 196, 81, 0.25)" : "rgba(0,0,0,0.3)",
                      border: `1px solid ${selectedPhaseForEditing === "phase1" ? "#FFC451" : "rgba(255,255,255,0.1)"}`,
                      color: selectedPhaseForEditing === "phase1" ? "#FFD700" : "#9CA3AF",
                      fontWeight: "800",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    PHASE 1 LANDS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhaseForEditing("phase2")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: selectedPhaseForEditing === "phase2" ? "rgba(255, 196, 81, 0.25)" : "rgba(0,0,0,0.3)",
                      border: `1px solid ${selectedPhaseForEditing === "phase2" ? "#FFC451" : "rgba(255,255,255,0.1)"}`,
                      color: selectedPhaseForEditing === "phase2" ? "#FFD700" : "#9CA3AF",
                      fontWeight: "800",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    PHASE 2 LANDS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhaseForEditing("phase3")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: selectedPhaseForEditing === "phase3" ? "rgba(255, 196, 81, 0.25)" : "rgba(0,0,0,0.3)",
                      border: `1px solid ${selectedPhaseForEditing === "phase3" ? "#FFC451" : "rgba(255,255,255,0.1)"}`,
                      color: selectedPhaseForEditing === "phase3" ? "#FFD700" : "#9CA3AF",
                      fontWeight: "800",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    PHASE 3 LANDS
                  </button>
                </div>
              </div>

              {/* Team Dropdown Selector & Save Button */}
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#E5E7EB" }}>
                  Select Team:
                </label>
                <select
                  value={selectedTeamForResults}
                  onChange={(e) => setSelectedTeamForResults(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "#1F2937",
                    border: "1px solid rgba(255, 196, 81, 0.4)",
                    color: "#FFD700",
                    fontWeight: "800",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  {phase1Data.map(t => {
                    const targetMap = selectedPhaseForEditing === "phase3" ? phase3Map : selectedPhaseForEditing === "phase2" ? phase2Map : phase1Map;
                    const count = (targetMap[t.teamName] || []).length;
                    return (
                      <option key={t.teamName} value={t.teamName}>
                        {t.teamName} ({count} Lands in {selectedPhaseForEditing.toUpperCase()})
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  onClick={handleSaveTeamConquests}
                  disabled={savingConquests}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#FFC451",
                    color: "#000",
                    fontWeight: "900",
                    fontSize: "13px",
                    border: "none",
                    cursor: savingConquests ? "wait" : "pointer",
                    boxShadow: "0 0 15px rgba(255,196,81,0.4)"
                  }}
                >
                  {savingConquests ? "SAVING..." : `SAVE ${selectedPhaseForEditing.toUpperCase()} LANDS ⚡`}
                </button>
              </div>

              {/* 25 Lands Checkbox Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                maxHeight: "360px",
                overflowY: "auto"
              }}>
                {round1Lands.map(land => {
                  const targetMap = selectedPhaseForEditing === "phase3" ? phase3Map : selectedPhaseForEditing === "phase2" ? phase2Map : phase1Map;
                  const isChecked = (targetMap[selectedTeamForResults] || []).includes(land.landName);
                  return (
                    <label
                      key={land.landId}
                      onClick={() => handleToggleTeamLand(land.landName)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        background: isChecked ? "rgba(255, 196, 81, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${isChecked ? "#FFC451" : "rgba(255, 255, 255, 0.08)"}`,
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: "#FFC451", transform: "scale(1.2)" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: isChecked ? "700" : "500", color: isChecked ? "#FFD700" : "#D1D5DB" }}>
                        {land.landName}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ❌ TEAM ELIMINATION CONTROL PANEL                          */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div style={{
              borderTop: "1px solid rgba(239, 68, 68, 0.3)",
              paddingTop: "24px",
              marginBottom: "32px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", color: "#EF4444", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>❌ Team Elimination Control</span>
                  </h3>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                    Mark teams as eliminated. Trailing teams will display an `ELIMINATED` red badge on the public Results page.
                  </div>
                </div>
                <span style={{
                  fontSize: "11px",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: eliminatedTeams.length > 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)",
                  border: `1px solid ${eliminatedTeams.length > 0 ? "#EF4444" : "#22c55e"}`,
                  color: eliminatedTeams.length > 0 ? "#FCA5A5" : "#86efac",
                  fontWeight: "800"
                }}>
                  {eliminatedTeams.length} TEAMS ELIMINATED
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                <button
                  type="button"
                  onClick={handleEliminateTrailing5Teams}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid #EF4444",
                    color: "#FCA5A5",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                    letterSpacing: "0.5px"
                  }}
                >
                  ❌ ELIMINATE TRAILING 5 TEAMS (RANK 21–25)
                </button>
                <button
                  type="button"
                  onClick={handleResetEliminations}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "rgba(107, 114, 128, 0.2)",
                    border: "1px solid rgba(107, 114, 128, 0.4)",
                    color: "#D1D5DB",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  CLEAR ALL ELIMINATIONS
                </button>
                <button
                  type="button"
                  onClick={handleSaveEliminations}
                  disabled={savingEliminations}
                  style={{
                    marginLeft: "auto",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#EF4444",
                    color: "#FFF",
                    fontWeight: "900",
                    fontSize: "13px",
                    border: "none",
                    cursor: savingEliminations ? "wait" : "pointer",
                    boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)"
                  }}
                >
                  {savingEliminations ? "SAVING..." : "SAVE ELIMINATIONS ⚡"}
                </button>
              </div>

              {/* 25 Teams Elimination Toggle Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                maxHeight: "320px",
                overflowY: "auto"
              }}>
                {phase1Data.map((t, idx) => {
                  const isEliminated = eliminatedTeams.includes(t.teamName);
                  return (
                    <div
                      key={t.teamName}
                      onClick={() => handleToggleTeamEliminated(t.teamName)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        background: isEliminated ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${isEliminated ? "#EF4444" : "rgba(255, 255, 255, 0.08)"}`,
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: "700", color: isEliminated ? "#FCA5A5" : "#E5E7EB", textDecoration: isEliminated ? "line-through" : "none" }}>
                        <span style={{ color: "#9CA3AF", marginRight: "6px", fontSize: "11px" }}>#{idx + 1}</span>
                        {t.teamName}
                      </div>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: isEliminated ? "#EF4444" : "rgba(34, 197, 94, 0.15)",
                        color: isEliminated ? "#FFF" : "#4ADE80"
                      }}>
                        {isEliminated ? "ELIMINATED" : "ACTIVE"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ⚖️ MANUAL POSITION / TIE-BREAKER CONTROL PANEL             */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div style={{
              borderTop: "1px solid rgba(255, 196, 81, 0.3)",
              paddingTop: "24px",
              marginBottom: "32px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", color: "#FFC451", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>⚖️ Tie-Breaker &amp; Position Assignment</span>
                  </h3>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                    If there is a tie in conquered lands, manually assign position/rank priority (e.g. 1 for 1st, 2 for 2nd) to break ties.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveManualRanks}
                  disabled={savingManualRanks}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#FFC451",
                    color: "#000",
                    fontWeight: "900",
                    fontSize: "13px",
                    border: "none",
                    cursor: savingManualRanks ? "wait" : "pointer",
                    boxShadow: "0 0 15px rgba(255, 196, 81, 0.4)"
                  }}
                >
                  {savingManualRanks ? "SAVING..." : "SAVE TIE-BREAKER POSITIONS ⚡"}
                </button>
              </div>

              {/* Phase Selector for Tie Breaker */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {["phase1", "phase2", "phase3"].map((pKey) => (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setSelectedPhaseForEditing(pKey)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: selectedPhaseForEditing === pKey ? "#FFC451" : "rgba(17,24,39,0.7)",
                      color: selectedPhaseForEditing === pKey ? "#000" : "#9CA3AF",
                      border: "1px solid rgba(255,196,81,0.3)",
                      fontWeight: "800",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    {pKey === "phase3" ? "FINAL WINNERS TIES" : `${pKey.toUpperCase()} TIES`}
                  </button>
                ))}
              </div>

              {/* Teams Position Assignment Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "10px",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                maxHeight: "320px",
                overflowY: "auto"
              }}>
                {phase1Data.map((t) => {
                  const currentVal = (manualRanks[selectedPhaseForEditing] || {})[t.teamName] ?? "";
                  return (
                    <div
                      key={t.teamName}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        gap: "8px"
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#E5E7EB", flex: 1 }}>
                        {t.teamName}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>Position:</span>
                        <input
                          type="number"
                          min="1"
                          max="25"
                          placeholder="Auto"
                          value={currentVal}
                          onChange={(e) => handleSetTeamManualRank(selectedPhaseForEditing, t.teamName, e.target.value)}
                          style={{
                            width: "58px",
                            padding: "4px 6px",
                            borderRadius: "4px",
                            background: "#1F2937",
                            border: "1px solid rgba(255,196,81,0.4)",
                            color: "#FFD700",
                            fontWeight: "800",
                            fontSize: "12px",
                            textAlign: "center",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
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
