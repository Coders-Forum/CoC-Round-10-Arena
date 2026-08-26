import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RankedLeaderboard from "./RankedLeaderboard.jsx"
import { round0Data, round1Data, phase1Data, phase2Data, overallData } from "./leaderboardData.js"
import { getLandingPageUrl } from "../config/contestConfig.js"

const FONT = "'Clash', 'Clash Display', sans-serif"

// Set to true to temporarily suspend results until Round 2
const RESULTS_SUSPENDED = false

const TABS = [
    { key: "phase1", label: "Phase 1", data: phase1Data, subtitle: "Round 2 · Phase 1 Standings" },
    { key: "phase2", label: "Phase 2", data: phase2Data, subtitle: "Round 2 · Phase 2 Standings" },
    { key: "overall", label: "Final Winners", icon: "🏆", data: overallData, subtitle: "Round 2 · Grand Champions" }
]

export default function LeaderboardHub() {
    const [activeTab, setActiveTab] = useState("phase1")
    const [activeResultsPhase, setActiveResultsPhase] = useState("phase1")
    const [overallConquests, setOverallConquests] = useState({})
    const [phase1Conquests, setPhase1Conquests] = useState({})
    const [phase2Conquests, setPhase2Conquests] = useState({})
    const [eliminatedTeams, setEliminatedTeams] = useState([])
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    )
    const navigate = useNavigate()
    const current = TABS.find((t) => t.key === activeTab) || TABS[0]

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL !== undefined
            ? import.meta.env.VITE_API_URL
            : (import.meta.env.DEV ? "http://localhost:5000" : "");

        fetch(`${apiUrl}/api/results/conquests`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    if (data.activeResultsPhase) setActiveResultsPhase(data.activeResultsPhase);
                    if (Array.isArray(data.eliminatedTeams)) setEliminatedTeams(data.eliminatedTeams);
                    if (data.conquests) setOverallConquests(data.conquests);
                    if (data.phase1Conquests) setPhase1Conquests(data.phase1Conquests);
                    if (data.phase2Conquests) setPhase2Conquests(data.phase2Conquests);
                }
            })
            .catch(() => {})
    }, [])

    const isTabUnlocked = (tabKey) => {
        if (tabKey === "phase1") return true;
        if (tabKey === "phase2") return activeResultsPhase === "phase2" || activeResultsPhase === "all";
        if (tabKey === "overall") return activeResultsPhase === "all";
        return true;
    }

    const activeEntries = (current.data || []).map(entry => {
        const targetMap = activeTab === "phase1" ? phase1Conquests :
                          activeTab === "phase2" ? phase2Conquests : overallConquests;
        const isEliminated = eliminatedTeams.includes(entry.teamName);
        if (targetMap && targetMap[entry.teamName]) {
            return { ...entry, conqueredLands: targetMap[entry.teamName], isEliminated }
        }
        return { ...entry, isEliminated }
    })




    const btnStyle = (active) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: active ? "rgba(255, 196, 81, 0.2)" : "rgba(17, 24, 39, 0.7)",
        border: `1px solid ${active ? "#FFC451" : "rgba(255, 196, 81, 0.25)"}`,
        borderRadius: "100px",
        padding: isSmallScreen ? "6px 12px" : "8px 18px",
        color: active ? "#FFC451" : "#9CA3AF",
        fontFamily: FONT,
        fontSize: isSmallScreen ? "11px" : "12px",
        fontWeight: "700",
        letterSpacing: "1px",
        cursor: "pointer",
        textTransform: "uppercase",
        boxShadow: active ? "0 0 15px rgba(255, 196, 81, 0.3)" : "none",
        transition: "all 0.2s ease"
    })

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#0B0F1A",
            color: "#FFFFFF",
            fontFamily: FONT,
            backgroundImage: `linear-gradient(180deg, rgba(11, 15, 26, 0.85) 0%, rgba(11, 15, 26, 0.95) 100%), url(/backgrounds/leaderboard-bg.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Top Fixed Header */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isSmallScreen ? "10px 14px" : "14px 32px",
                background: "linear-gradient(180deg, rgba(17,24,39,0.92) 0%, rgba(17,24,39,0.6) 70%, transparent 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,196,81,0.15)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: isSmallScreen ? "6px" : "10px" }}>
                    <span style={{
                        background: "#FFC451",
                        color: "#000",
                        fontSize: isSmallScreen ? "9px" : "10px",
                        fontWeight: "800",
                        padding: isSmallScreen ? "2px 8px" : "3px 10px",
                        borderRadius: "100px",
                        letterSpacing: "0.15em",
                        boxShadow: "0 0 12px rgba(255,196,81,0.35)"
                    }}>
                        COC
                    </span>
                    <span style={{
                        color: "#FFC451",
                        fontSize: isSmallScreen ? "12px" : "14px",
                        fontWeight: "700",
                        letterSpacing: "0.15em",
                        textShadow: "0 0 16px rgba(255,196,81,0.25)"
                    }}>
                        LEADERBOARD
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: isSmallScreen ? "6px" : "10px" }}>
                    <a
                        href={getLandingPageUrl()}
                        title="Return to Landing Page"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(255,196,81,0.08)",
                            border: "1px solid rgba(255,196,81,0.3)",
                            color: "#FFC451",
                            fontSize: isSmallScreen ? "10px" : "11px",
                            fontWeight: "600",
                            letterSpacing: "0.1em",
                            padding: isSmallScreen ? "5px 10px" : "6px 14px",
                            borderRadius: "100px",
                            textDecoration: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <span>←</span>
                        <span>{isSmallScreen ? "LANDING" : "LANDING PAGE"}</span>
                    </a>

                    <button
                        onClick={() => navigate("/arena")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#FFC451",
                            border: "1px solid #FFC451",
                            color: "#000",
                            fontSize: isSmallScreen ? "10px" : "11px",
                            fontWeight: "800",
                            letterSpacing: "0.1em",
                            padding: isSmallScreen ? "5px 10px" : "6px 14px",
                            borderRadius: "100px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 0 12px rgba(255,196,81,0.3)"
                        }}
                    >
                        <span>⚔</span>
                        <span>ARENA</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{
                paddingTop: "90px",
                paddingBottom: "60px",
                paddingLeft: "16px",
                paddingRight: "16px",
                maxWidth: "800px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {RESULTS_SUSPENDED ? (
                    <div style={{
                        marginTop: "40px",
                        width: "100%",
                        maxWidth: "520px",
                        padding: isSmallScreen ? "32px 20px" : "44px 36px",
                        borderRadius: "20px",
                        background: "rgba(17, 24, 39, 0.85)",
                        border: "1px solid rgba(255, 196, 81, 0.35)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,196,81,0.15)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "rgba(255, 196, 81, 0.12)",
                            border: "1px solid rgba(255, 196, 81, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            marginBottom: "18px",
                            boxShadow: "0 0 20px rgba(255,196,81,0.2)"
                        }}>
                            🔒
                        </div>

                        <div style={{
                            display: "inline-block",
                            padding: "4px 14px",
                            borderRadius: "100px",
                            background: "rgba(255, 196, 81, 0.12)",
                            border: "1px solid rgba(255, 196, 81, 0.3)",
                            color: "#FFC451",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            marginBottom: "12px"
                        }}>
                            ROUND 1 IN PROGRESS
                        </div>

                        <h2 style={{
                            color: "#FFFFFF",
                            fontSize: isSmallScreen ? "22px" : "26px",
                            fontWeight: "800",
                            letterSpacing: "1px",
                            marginBottom: "12px",
                            textShadow: "0 0 25px rgba(255,196,81,0.35)"
                        }}>
                            RESULTS UNDER EMBARGO
                        </h2>

                        <p style={{
                            color: "#9CA3AF",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            marginBottom: "28px",
                            maxWidth: "420px"
                        }}>
                            The official leaderboard and qualifier standings are temporarily suspended and will be declared live starting from <strong>Round 2</strong>. Focus on conquering your lands!
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "320px" }}>
                            <a
                                href={getLandingPageUrl()}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    background: "#FFC451",
                                    color: "#000",
                                    fontFamily: FONT,
                                    fontSize: "13px",
                                    fontWeight: "800",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    padding: "14px 24px",
                                    borderRadius: "30px",
                                    boxShadow: "0 0 20px rgba(255,196,81,0.35)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>←</span>
                                <span>LANDING PAGE</span>
                            </a>

                            <button
                                onClick={() => navigate("/arena")}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    background: "rgba(255, 196, 81, 0.1)",
                                    border: "1px solid rgba(255, 196, 81, 0.3)",
                                    color: "#FFC451",
                                    fontFamily: FONT,
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    padding: "12px 20px",
                                    borderRadius: "30px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>⚔️</span>
                                <span>ENTER CONTEST ARENA</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Title Badge */}
                        <div style={{
                            display: "inline-block",
                            padding: "4px 14px",
                            borderRadius: "100px",
                            background: "rgba(255, 196, 81, 0.12)",
                            border: "1px solid rgba(255, 196, 81, 0.3)",
                            color: "#FFC451",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            marginBottom: "12px"
                        }}>
                            CLASH OF CODERS 2026
                        </div>

                        <h1 style={{
                            color: "#FFFFFF",
                            fontSize: isSmallScreen ? "24px" : "32px",
                            fontWeight: "800",
                            letterSpacing: "1px",
                            marginBottom: "8px",
                            textAlign: "center",
                            textShadow: "0 0 25px rgba(255,196,81,0.3)"
                        }}>
                            🏆 CONTEST LEADERBOARD
                        </h1>

                        <p style={{
                            color: "#9CA3AF",
                            fontSize: "13px",
                            letterSpacing: "0.5px",
                            marginBottom: "32px",
                            textAlign: "center",
                            maxWidth: "480px",
                            lineHeight: "1.6"
                        }}>
                            Official live rankings and scores across all preliminary rounds and offline arena conquest phases.
                        </p>

                        {/* Tab Controls */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            justifyContent: "center",
                            marginBottom: "36px",
                            padding: "6px",
                            borderRadius: "50px",
                            background: "rgba(17, 24, 39, 0.6)",
                            border: "1px solid rgba(255, 196, 81, 0.15)",
                            backdropFilter: "blur(10px)"
                        }}>
                            {TABS.map((tab) => {
                                const unlocked = isTabUnlocked(tab.key);
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            ...btnStyle(tab.key === activeTab),
                                            opacity: unlocked ? 1 : 0.75,
                                        }}
                                    >
                                        <span>{unlocked ? (tab.icon || "") : "🔒"}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Tab Content: Leaderboard Table or Locked Banner */}
                        {isTabUnlocked(activeTab) ? (
                            <RankedLeaderboard
                                title={current.label}
                                subtitle={current.subtitle}
                                entries={activeEntries}
                                showDivider={activeTab === "round0" || activeTab === "round1"}
                            />
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "60px 20px",
                                background: "rgba(17, 24, 39, 0.6)",
                                borderRadius: "20px",
                                border: "1px solid rgba(255, 196, 81, 0.2)",
                                maxWidth: "540px",
                                margin: "20px auto 60px auto",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
                                <h2 style={{ fontSize: "20px", color: "#FFC451", margin: "0 0 8px 0", letterSpacing: "1px", fontWeight: "800" }}>
                                    {current.label.toUpperCase()} STANDINGS LOCKED
                                </h2>
                                <p style={{ color: "#9CA3AF", fontSize: "13px", lineHeight: "1.6", margin: 0, maxWidth: "420px" }}>
                                    Official standings for this phase are currently locked. Results will be declared live by the organizers once the phase concludes.
                                </p>
                            </div>
                        )}


                    </>
                )}
            </main>
        </div>
    )
}
