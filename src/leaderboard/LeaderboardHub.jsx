import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RankedLeaderboard from "./RankedLeaderboard.jsx"
import { round0Data, round1Data, phase1Data, phase2Data, overallData } from "./leaderboardData.js"
import { getLandingPageUrl } from "../config/contestConfig.js"
import { isLoggedIn } from "../utils/sessionSecurity.js"

const FONT = "'Clash', 'Clash Display', sans-serif"

const TABS = [
    { key: "round0", label: "Round 0 (Top 40)", data: round0Data, subtitle: "Round 0 — Codefront" },
    { key: "round1", label: "Round 1 (Top 25)", data: round1Data, subtitle: "Round 1 — Code Warfare" },
    { key: "phase1", label: "Phase 1", data: phase1Data, subtitle: "Round 2 · Phase 1 Standings" },
    { key: "phase2", label: "Phase 2", data: phase2Data, subtitle: "Round 2 · Phase 2 Standings" },
    { key: "overall", label: "Final Standings", icon: "🏆", data: overallData, subtitle: "Round 2 · Grand Champions" }
]

export default function LeaderboardHub() {
    const [activeTab, setActiveTab] = useState("round1")
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    )
    const navigate = useNavigate()
    const current = TABS.find((t) => t.key === activeTab) || TABS[0]
    const userAuthed = isLoggedIn()

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

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

                    {userAuthed ? (
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
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                background: "rgba(255,196,81,0.15)",
                                border: "1px solid rgba(255,196,81,0.35)",
                                color: "#FFC451",
                                fontSize: isSmallScreen ? "10px" : "11px",
                                fontWeight: "700",
                                letterSpacing: "0.1em",
                                padding: isSmallScreen ? "5px 10px" : "6px 14px",
                                borderRadius: "100px",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <span>🧑‍💻</span>
                            <span>LOGIN</span>
                        </button>
                    )}
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
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={btnStyle(tab.key === activeTab)}
                        >
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Table Component */}
                <RankedLeaderboard
                    title={current.label}
                    subtitle={current.subtitle}
                    entries={current.data}
                />
            </main>
        </div>
    )
}
