import React from "react"

const FONT = "'Clash', 'Clash Display', sans-serif"

// Grid layout for 3 columns: S. No | Team Name | Conquered Land Name(s)
const GRID_COLS = "80px 220px 1fr"

const LAND_MAP = {
    volcano: "Array Realm",
    snow: "String Sanctum",
    plant: "Hash Table Isle",
    island: "Math Arena",
    coliseum: "Sorting Coliseum",
    pyramid: "Searching Pyramid",
    castle: "DFS Fortress",
    ruin: "BFS Ruins",
    mayan: "Database Temple",
    greek: "Matrix Shrine",
    pagoda: "2 Pointers Pagoda",
    pedestal: "Sliding Window Pedestal",
    cathedral: "Stack Citadel",
    torii: "Queue Gate",
    castle2: "Linked List Fort",
    pagoda2: "Pattern Tower",
    barracks: "Recursion Barracks",
    palace: "Backtracking Palace",
    shrine: "Bit Manipulation Shrine",
    deadforest: "Mystery Land",
    temple: "Set Sanctuary",
    archway: "DP Monument",
    necro: "Priority Queue Necropolis",
    cemetery: "Prefix & Suffix Realm",
    pillars: "Greedy Pillars"
};

function getConqueredLands(entry) {
    const raw = entry.conqueredLands ?? entry.conqueredLand ?? entry.conquered_land ?? entry.land;
    if (!raw) return [];
    let list = [];
    if (Array.isArray(raw)) {
        list = raw;
    } else if (typeof raw === "string") {
        list = raw.split(",").map(s => s.trim()).filter(Boolean);
    }
    return list.map(item => {
        const key = String(item).toLowerCase().trim();
        return LAND_MAP[key] || item;
    });
}

export default function RankedLeaderboard({ title, subtitle, entries, showTop5Divider = false }) {
    return (
        <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{
                color: "#FFC451",
                fontFamily: FONT,
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "6px",
                textAlign: "center"
            }}>
                {subtitle}
            </div>
            <h2 style={{
                color: "#FFFFFF",
                fontFamily: FONT,
                fontSize: "26px",
                fontWeight: "800",
                letterSpacing: "1px",
                marginBottom: "24px",
                textAlign: "center",
                textShadow: "0 0 20px rgba(255, 196, 81, 0.35)"
            }}>
                {title}
            </h2>

            {/* Scrollable wrapper so table fits on all screen sizes */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <div style={{ minWidth: "550px" }}>

                    {/* Column Header Row */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: GRID_COLS,
                        alignItems: "center",
                        gap: "12px",
                        padding: "0 20px",
                        marginBottom: "12px"
                    }}>
                        {[
                            { label: "S. No", align: "center" },
                            { label: "Team Name", align: "left" },
                            { label: "Conquered Land Name", align: "left" }
                        ].map((col, ci) => (
                            <div
                                key={ci}
                                style={{
                                    color: "#FFC451",
                                    fontFamily: FONT,
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    textAlign: col.align
                                }}
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {entries.map((entry, i) => {
                            const rank = i + 1;
                            const lands = getConqueredLands(entry);
                            const isEliminated = Boolean(entry.isEliminated || entry.status === "eliminated");
                            const isTop5 = rank <= 5 && !isEliminated;
                            // Render a divider banner after the 5th non-eliminated row on Final Winners
                            const showDividerAfter = showTop5Divider && !isEliminated && rank === 5;

                            const rowEl = (
                                <div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: GRID_COLS,
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "14px 20px",
                                        borderRadius: "14px",
                                        background: isEliminated
                                            ? "rgba(239, 68, 68, 0.08)"
                                            : isTop5
                                            ? "linear-gradient(135deg, rgba(255, 196, 81, 0.22) 0%, rgba(245, 158, 11, 0.12) 50%, rgba(17, 24, 39, 0.85) 100%)"
                                            : "rgba(17, 24, 39, 0.75)",
                                        border: isEliminated
                                            ? "1px solid rgba(239, 68, 68, 0.4)"
                                            : isTop5
                                            ? "1px solid rgba(255, 196, 81, 0.55)"
                                            : "1px solid rgba(255, 196, 81, 0.1)",
                                        boxShadow: isTop5 ? "0 0 20px rgba(255, 196, 81, 0.25), inset 0 0 15px rgba(255, 196, 81, 0.1)" : "none",
                                        opacity: isEliminated ? 0.75 : 1,
                                        backdropFilter: "blur(8px)",
                                        WebkitBackdropFilter: "blur(8px)",
                                        transition: "all 0.2s ease"
                                    }}>
                                        {/* S. No */}
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: isEliminated ? "#EF4444" : isTop5 ? "#FFD700" : "#FFC451",
                                            fontFamily: FONT,
                                            fontSize: "14px",
                                            fontWeight: "800",
                                            letterSpacing: "0.5px"
                                        }}>
                                            <span>{rank}</span>
                                        </div>

                                        {/* Team Name */}
                                        <div style={{
                                            color: isEliminated ? "#FCA5A5" : isTop5 ? "#FFFFFF" : "#E5E7EB",
                                            fontFamily: FONT,
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            letterSpacing: "0.5px",
                                            textDecoration: isEliminated ? "line-through" : "none",
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "8px"
                                        }}>
                                            <span>{entry.teamName}</span>
                                            {isTop5 && (
                                                <span style={{
                                                    fontSize: "10px",
                                                    fontWeight: "800",
                                                    letterSpacing: "0.5px",
                                                    background: "linear-gradient(135deg, #FFC451, #F59E0B)",
                                                    color: "#000",
                                                    padding: "2px 8px",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 0 8px rgba(255, 196, 81, 0.4)"
                                                }}>
                                                    ⭐ TOP 5
                                                </span>
                                            )}
                                        </div>

                                        {/* Conquered Land Name(s) / Eliminated Status */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                                            {isEliminated ? (
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    background: "rgba(239, 68, 68, 0.2)",
                                                    border: "1px solid #EF4444",
                                                    borderRadius: "20px",
                                                    padding: "4px 12px",
                                                    color: "#FCA5A5",
                                                    fontFamily: FONT,
                                                    fontSize: "11px",
                                                    fontWeight: "800",
                                                    letterSpacing: "1px",
                                                    textTransform: "uppercase"
                                                }}>
                                                    <span>❌</span>
                                                    <span>ELIMINATED</span>
                                                </span>
                                            ) : lands.length > 0 ? (
                                                lands.map((land, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "5px",
                                                            background: isTop5
                                                                ? "rgba(255, 215, 0, 0.18)"
                                                                : "rgba(255, 196, 81, 0.12)",
                                                            border: `1px solid ${isTop5 ? "rgba(255, 215, 0, 0.6)" : "rgba(255, 196, 81, 0.35)"}`,
                                                            borderRadius: "20px",
                                                            padding: "4px 12px",
                                                            color: isTop5 ? "#FFD700" : "#FFC451",
                                                            fontFamily: FONT,
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            letterSpacing: "0.5px",
                                                            boxShadow: isTop5
                                                                ? "0 0 12px rgba(255, 215, 0, 0.25)"
                                                                : "0 0 10px rgba(255, 196, 81, 0.12)"
                                                        }}
                                                    >
                                                        <span>{isTop5 ? "👑" : "🏰"}</span>
                                                        <span>{land}</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ color: "#6B7280", fontFamily: FONT, fontSize: "12px", fontStyle: "italic" }}>
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                            return (
                                <React.Fragment key={i}>
                                    {rowEl}
                                    {showDividerAfter && (
                                        <div style={{
                                            margin: "6px 0",
                                            padding: "10px 20px",
                                            borderRadius: "12px",
                                            background: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(17,24,39,0.9) 100%)",
                                            border: "1px dashed rgba(239,68,68,0.4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px"
                                        }}>
                                            <span style={{ fontSize: "16px" }}>❌</span>
                                            <span style={{
                                                color: "#FCA5A5",
                                                fontFamily: FONT,
                                                fontSize: "11px",
                                                fontWeight: "800",
                                                letterSpacing: "2px",
                                                textTransform: "uppercase"
                                            }}>ELIMINATED TEAMS BELOW</span>
                                            <span style={{ fontSize: "16px" }}>❌</span>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>


                </div>
            </div>
        </div>
    )
}

