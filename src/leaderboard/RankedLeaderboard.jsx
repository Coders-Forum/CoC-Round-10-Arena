import { characterOrder } from "./characterOrder.js"

const FONT = "'Clash', 'Clash Display', sans-serif"

// Grid: Avatar | Team+Leader | Roll No | Dept | Year | Section
const GRID_COLS = "44px 1fr 120px 90px 100px 60px"

export default function RankedLeaderboard({ title, subtitle, entries, showDivider = true }) {
    return (
        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
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

            {/* Scrollable wrapper so table doesn't break on mid-size screens */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <div style={{ minWidth: "780px" }}>

                    {/* Column Header Row */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: GRID_COLS,
                        alignItems: "center",
                        gap: "10px",
                        padding: "0 18px",
                        marginBottom: "10px"
                    }}>
                        {[
                            { label: "",             align: "left"  }, // avatar
                            { label: "Team / Leader", align: "left" },
                            { label: "Roll No",      align: "left"  },
                            { label: "Dept",         align: "left"  },
                            { label: "Year",         align: "left"  },
                            { label: "Section",      align: "left"  },
                        ].map((col, ci) => (
                            <div
                                key={ci}
                                style={{
                                    color: "#FFC451",
                                    fontFamily: FONT,
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    textAlign: col.align
                                }}
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>

                    {/* Leaderboard Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {entries.map((entry, i) => {
                            const character = characterOrder[i]

                            return (
                                <div key={i}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: GRID_COLS,
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "12px 18px",
                                        borderRadius: "12px",
                                        background: "rgba(17, 24, 39, 0.75)",
                                        border: "1px solid rgba(255, 196, 81, 0.12)",
                                        backdropFilter: "blur(8px)",
                                        WebkitBackdropFilter: "blur(8px)",
                                        transition: "all 0.2s ease"
                                    }}>
                                        {/* Avatar */}
                                        {character ? (
                                            <img
                                                src={`/leaderboard-avatars/${character.image}`}
                                                alt={character.name}
                                                onError={(e) => { e.target.style.visibility = "hidden" }}
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "1px solid rgba(255, 196, 81, 0.3)"
                                                }}
                                            />
                                        ) : <div style={{ width: "36px" }} />}

                                        {/* Team Name + Leader */}
                                        <div>
                                            <div style={{
                                                color: "#FFFFFF",
                                                fontFamily: FONT,
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                letterSpacing: "0.5px",
                                                lineHeight: "1.3"
                                            }}>
                                                {entry.teamName}
                                            </div>
                                            {entry.leader && (
                                                <div style={{
                                                    color: "#9CA3AF",
                                                    fontFamily: FONT,
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                    marginTop: "2px"
                                                }}>
                                                    {entry.leader}
                                                </div>
                                            )}
                                        </div>

                                        {/* Roll No */}
                                        <div style={{
                                            color: "#D1D5DB",
                                            fontFamily: FONT,
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            letterSpacing: "0.3px"
                                        }}>
                                            {entry.rollNo || "—"}
                                        </div>

                                        {/* Dept */}
                                        <div style={{
                                            color: "#D1D5DB",
                                            fontFamily: FONT,
                                            fontSize: "11px",
                                            fontWeight: "600"
                                        }}>
                                            {entry.dept || "—"}
                                        </div>

                                        {/* Year */}
                                        <div style={{
                                            color: "#D1D5DB",
                                            fontFamily: FONT,
                                            fontSize: "11px",
                                            fontWeight: "600"
                                        }}>
                                            {entry.year || "—"}
                                        </div>

                                        {/* Section */}
                                        <div style={{
                                            color: "#D1D5DB",
                                            fontFamily: FONT,
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            textAlign: "center"
                                        }}>
                                            {entry.section || "—"}
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
