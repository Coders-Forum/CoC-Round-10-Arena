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

export default function RankedLeaderboard({ title, subtitle, entries }) {
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

                            return (
                                <div key={i}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: GRID_COLS,
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "14px 20px",
                                        borderRadius: "14px",
                                        background: isEliminated
                                            ? "rgba(239, 68, 68, 0.08)"
                                            : "rgba(17, 24, 39, 0.75)",
                                        border: `1px solid ${isEliminated ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 196, 81, 0.1)"}`,
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
                                            color: isEliminated ? "#EF4444" : "#FFC451",
                                            fontFamily: FONT,
                                            fontSize: "14px",
                                            fontWeight: "800",
                                            letterSpacing: "0.5px"
                                        }}>
                                            <span>{rank}</span>
                                        </div>

                                        {/* Team Name */}
                                        <div style={{
                                            color: isEliminated ? "#FCA5A5" : "#E5E7EB",
                                            fontFamily: FONT,
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            letterSpacing: "0.5px",
                                            textDecoration: isEliminated ? "line-through" : "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}>
                                            <span>{entry.teamName}</span>
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
                                                            background: "rgba(255, 196, 81, 0.12)",
                                                            border: "1px solid rgba(255, 196, 81, 0.35)",
                                                            borderRadius: "20px",
                                                            padding: "4px 12px",
                                                            color: "#FFC451",
                                                            fontFamily: FONT,
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            letterSpacing: "0.5px",
                                                            boxShadow: "0 0 10px rgba(255, 196, 81, 0.12)"
                                                        }}
                                                    >
                                                        <span>🏰</span>
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
                            )
                        })}
                    </div>


                </div>
            </div>
        </div>
    )
}

