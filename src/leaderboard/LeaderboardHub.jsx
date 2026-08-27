import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RankedLeaderboard from "./RankedLeaderboard.jsx"
import { phase1Data, phase2Data, phase3Data } from "./leaderboardData.js"
import { getLandingPageUrl, getApiUrl } from "../config/contestConfig.js"

const FONT = "'Clash', 'Clash Display', sans-serif"

// Set to true to temporarily suspend results until Round 2
const RESULTS_SUSPENDED = false

// PODIUM_RANKS: visual order for the top-5 podium (2nd left, 1st center, 3rd right, then 4th/5th below)
const PODIUM_RANKS = [2, 1, 3]
const PODIUM_HEIGHTS = { 1: 200, 2: 160, 3: 130 }
const PODIUM_COLORS = {
    1: { bg: "linear-gradient(180deg,#FFD700,#F59E0B)", glow: "rgba(255,215,0,0.5)", label: "#000", badge: "🏆" },
    2: { bg: "linear-gradient(180deg,#C0C0C0,#9CA3AF)", glow: "rgba(192,192,192,0.4)", label: "#000", badge: "🥈" },
    3: { bg: "linear-gradient(180deg,#CD7F32,#92400E)", glow: "rgba(205,127,50,0.4)", label: "#FFF", badge: "🥉" },
}

const TABS = [
    { key: "phase1", label: "Phase 1", data: phase1Data, subtitle: "Round 2 · Phase 1 Standings" },
    { key: "phase2", label: "Phase 2", data: phase2Data, subtitle: "Round 2 · Phase 2 Standings" },
    { key: "overall", label: "Final Winners", icon: "🏆", data: phase3Data, subtitle: "Round 2 · Grand Champions" },
]

function FinalWinnersPodium({ entries }) {
    const active = entries.filter(e => !e.isEliminated).slice(0, 5)
    if (active.length === 0) return (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px", fontFamily: FONT, fontSize: "14px" }}>
            No finalists declared yet.
        </div>
    )

    const top3 = PODIUM_RANKS.map(r => active[r - 1]).filter(Boolean)
    const rest = active.slice(3)

    return (
        <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto", fontFamily: FONT }}>
            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ color: "#FFC451", fontSize: "11px", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>
                    Round 2 · Grand Champions
                </div>
                <h2 style={{ color: "#FFF", fontSize: "28px", fontWeight: "800", margin: "0 0 4px", textShadow: "0 0 30px rgba(255,196,81,0.4)" }}>
                    🏆 Final Winners
                </h2>
                <p style={{ color: "#9CA3AF", fontSize: "13px", margin: 0 }}>Top 5 qualifiers from the Clash of Coders</p>
            </div>

            {/* Podium — top 3 */}
            <div style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: "12px",
                margin: "40px auto 32px",
                padding: "0 8px",
            }}>
                {top3.map((team, idx) => {
                    const podiumRank = PODIUM_RANKS[idx]
                    const actualRank = active.indexOf(team) + 1
                    const cfg = PODIUM_COLORS[podiumRank] || PODIUM_COLORS[3]
                    const podiumH = PODIUM_HEIGHTS[podiumRank] || 100
                    const isFirst = podiumRank === 1
                    return (
                        <div key={team.teamName} style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: isFirst ? "0 0 200px" : "0 0 160px",
                        }}>
                            {/* Team card above podium */}
                            <div style={{
                                width: "100%",
                                padding: "14px 10px",
                                borderRadius: "16px",
                                background: isFirst
                                    ? "linear-gradient(135deg,rgba(255,215,0,0.25),rgba(245,158,11,0.1),rgba(17,24,39,0.9))"
                                    : "rgba(17,24,39,0.8)",
                                border: `1px solid ${isFirst ? "rgba(255,215,0,0.6)" : "rgba(255,196,81,0.2)"}`,
                                boxShadow: `0 0 ${isFirst ? 30 : 15}px ${cfg.glow}`,
                                textAlign: "center",
                                marginBottom: "8px",
                                backdropFilter: "blur(10px)",
                                animation: isFirst ? "pulse-glow 2.5s ease-in-out infinite" : "none",
                            }}>
                                <div style={{ fontSize: isFirst ? "32px" : "24px", marginBottom: "6px" }}>{cfg.badge}</div>
                                <div style={{
                                    color: isFirst ? "#FFD700" : "#E5E7EB",
                                    fontWeight: "800",
                                    fontSize: isFirst ? "15px" : "13px",
                                    letterSpacing: "0.5px",
                                    marginBottom: "4px",
                                    lineHeight: "1.3"
                                }}>{team.teamName}</div>
                                <div style={{ color: "#9CA3AF", fontSize: "11px", marginBottom: "6px" }}>
                                    {team.leader} · {team.dept}
                                </div>
                                {(team.conqueredLands || []).length > 0 && (
                                    <div style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        background: "rgba(255,196,81,0.15)",
                                        border: "1px solid rgba(255,196,81,0.35)",
                                        borderRadius: "20px",
                                        padding: "3px 10px",
                                        color: "#FFC451",
                                        fontSize: "10px",
                                        fontWeight: "700"
                                    }}>
                                        👑 {(team.conqueredLands || []).join(", ")}
                                    </div>
                                )}
                            </div>
                            {/* Podium block */}
                            <div style={{
                                width: "100%",
                                height: `${podiumH}px`,
                                background: cfg.bg,
                                borderRadius: "10px 10px 0 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 -6px 20px ${cfg.glow}`,
                                flexDirection: "column",
                                gap: "4px",
                            }}>
                                <div style={{ fontSize: "28px", fontWeight: "900", color: cfg.label }}>{podiumRank}</div>
                                <div style={{ fontSize: "10px", fontWeight: "800", color: cfg.label, letterSpacing: "1px", opacity: 0.8 }}>
                                    {podiumRank === 1 ? "CHAMPION" : podiumRank === 2 ? "RUNNER-UP" : "3RD PLACE"}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 4th and 5th place cards */}
            {rest.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                    <div style={{
                        textAlign: "center",
                        color: "#6B7280",
                        fontSize: "10px",
                        fontWeight: "800",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "12px"
                    }}>4th & 5th Place Finalists</div>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                        {rest.map((team, idx) => {
                            const rank = idx + 4
                            return (
                                <div key={team.teamName} style={{
                                    flex: "0 0 calc(50% - 6px)",
                                    minWidth: "220px",
                                    maxWidth: "320px",
                                    padding: "16px",
                                    borderRadius: "14px",
                                    background: "rgba(17,24,39,0.8)",
                                    border: "1px solid rgba(255,196,81,0.18)",
                                    backdropFilter: "blur(10px)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}>
                                    <div style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "50%",
                                        background: "rgba(255,196,81,0.1)",
                                        border: "1px solid rgba(255,196,81,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px",
                                        fontWeight: "900",
                                        color: "#FFC451",
                                        flexShrink: 0
                                    }}>
                                        {rank === 4 ? "4" : "5"}
                                    </div>
                                    <div>
                                        <div style={{ color: "#E5E7EB", fontWeight: "800", fontSize: "13px", marginBottom: "2px" }}>{team.teamName}</div>
                                        <div style={{ color: "#9CA3AF", fontSize: "11px" }}>{team.leader} · {team.dept}</div>
                                        {(team.conqueredLands || []).length > 0 && (
                                            <div style={{ color: "#FFC451", fontSize: "10px", marginTop: "4px" }}>
                                                ⭐ {(team.conqueredLands || []).join(", ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* CSS animation for champion card pulse */}
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 30px rgba(255,215,0,0.5); }
                    50% { box-shadow: 0 0 50px rgba(255,215,0,0.8), 0 0 80px rgba(255,196,81,0.3); }
                }
            `}</style>
        </div>
    )
}

export default function LeaderboardHub() {
    const [activeTab, setActiveTab] = useState("phase1")
    const [activeResultsPhase, setActiveResultsPhase] = useState("phase1")
    const [phase1Conquests, setPhase1Conquests] = useState({})
    const [phase2Conquests, setPhase2Conquests] = useState({})
    const [phase3Conquests, setPhase3Conquests] = useState({})
    const [manualRanks, setManualRanks] = useState({ phase1: {}, phase2: {}, phase3: {} })
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
        const apiUrl = getApiUrl();

        fetch(`${apiUrl}/api/results/conquests`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    if (data.activeResultsPhase) setActiveResultsPhase(data.activeResultsPhase);
                    if (Array.isArray(data.eliminatedTeams)) setEliminatedTeams(data.eliminatedTeams);
                    if (data.phase1Conquests) setPhase1Conquests(data.phase1Conquests);
                    if (data.phase2Conquests) setPhase2Conquests(data.phase2Conquests);
                    if (data.phase3Conquests) setPhase3Conquests(data.phase3Conquests);
                    if (data.manualRanks) setManualRanks(data.manualRanks);
                }
            })
            .catch(() => {})
    }, [])

    // "all" OR "phase3" unlocks Final Winners (phase3 = final)
    const isTabUnlocked = (tabKey) => {
        if (tabKey === "phase1") return true;
        if (tabKey === "phase2") return ["phase2", "phase3", "all"].includes(activeResultsPhase);
        if (tabKey === "overall") return ["phase3", "all"].includes(activeResultsPhase);
        return true;
    }

    // Helper to get tie-breaker rank for a team in a phase
    const getTieRank = (phaseKey, teamName) => {
        const pRanks = (manualRanks && manualRanks[phaseKey]) || {};
        const val = pRanks[teamName];
        if (val !== undefined && val !== null && val !== "") {
            const num = Number(val);
            if (!isNaN(num)) return num;
        }
        return 999;
    };

    // Index map for preserving initial seed order when lands & tie-ranks are equal
    const initialIndexMap = new Map();
    (current.data || []).forEach((t, i) => initialIndexMap.set(t.teamName, i));

    // For Phase 1 / Phase 2 tabs — sorted table view
    const activeEntries = (current.data || []).map(entry => {
        const targetMap = activeTab === "phase1" ? phase1Conquests :
                          activeTab === "phase2" ? phase2Conquests : phase3Conquests;
        const isEliminated = eliminatedTeams.includes(entry.teamName);
        // Use ONLY DB data — empty array if team has no lands saved yet. Never fall back to static data.
        const conqueredLands = (targetMap && targetMap[entry.teamName] != null)
            ? (Array.isArray(targetMap[entry.teamName]) ? targetMap[entry.teamName] : [])
            : [];
        return { ...entry, conqueredLands, isEliminated };
    }).sort((a, b) => {
        if (a.isEliminated && !b.isEliminated) return 1;
        if (!a.isEliminated && b.isEliminated) return -1;

        // 1. Sort by land count descending
        const countDiff = (b.conqueredLands || []).length - (a.conqueredLands || []).length;
        if (countDiff !== 0) return countDiff;

        // 2. Tie breaker: Manual position assignment
        const phaseKey = activeTab === "overall" ? "phase3" : activeTab;
        const aTieRank = getTieRank(phaseKey, a.teamName);
        const bTieRank = getTieRank(phaseKey, b.teamName);
        if (aTieRank !== bTieRank) return aTieRank - bTieRank;

        // 3. Preserve seed ranking order
        return (initialIndexMap.get(a.teamName) ?? 0) - (initialIndexMap.get(b.teamName) ?? 0);
    });

    const finalWinnersIndexMap = new Map();
    phase3Data.forEach((t, i) => finalWinnersIndexMap.set(t.teamName, i));

    // For Final Winners tab — top-5 from phase3 data
    const finalWinnersEntries = phase3Data.map(entry => {
        const isEliminated = eliminatedTeams.includes(entry.teamName);
        // Use ONLY DB data — never fall back to static conqueredLands
        const conqueredLands = (phase3Conquests && phase3Conquests[entry.teamName] != null)
            ? (Array.isArray(phase3Conquests[entry.teamName]) ? phase3Conquests[entry.teamName] : [])
            : [];
        return { ...entry, conqueredLands, isEliminated };
    }).sort((a, b) => {
        if (a.isEliminated && !b.isEliminated) return 1;
        if (!a.isEliminated && b.isEliminated) return -1;

        // 1. Sort by land count descending
        const countDiff = (b.conqueredLands || []).length - (a.conqueredLands || []).length;
        if (countDiff !== 0) return countDiff;

        // 2. Tie breaker: Manual position assignment for phase3 / final
        const aTieRank = getTieRank("phase3", a.teamName);
        const bTieRank = getTieRank("phase3", b.teamName);
        if (aTieRank !== bTieRank) return aTieRank - bTieRank;

        // 3. Preserve seed ranking order
        return (finalWinnersIndexMap.get(a.teamName) ?? 0) - (finalWinnersIndexMap.get(b.teamName) ?? 0);
    });







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
                            activeTab === "overall" ? (
                                <FinalWinnersPodium entries={finalWinnersEntries} />
                            ) : (
                                <RankedLeaderboard
                                    title={current.label}
                                    subtitle={current.subtitle}
                                    entries={activeEntries}
                                />
                            )
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
