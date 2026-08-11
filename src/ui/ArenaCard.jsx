export default function ArenaCard({ side, accentColor, glowColor, title, subtitle, tags, description, nextArena, width }) {
    const isLeft = side === "left"
    return (
        <div style={{ position: "relative", width: width || "100%", maxWidth: "360px", boxSizing: "border-box", padding: "24px 20px", background: "rgba(0,0,0,0.75)", border: `1px solid ${accentColor}55`, borderRadius: "14px", backdropFilter: "blur(10px)", boxShadow: `0 0 24px ${glowColor}33, inset 0 0 30px ${glowColor}11`, animation: "cardFloat 4s ease-in-out infinite", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, animation: "glowSweep 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: "-40px", left: isLeft ? "-40px" : "auto", right: isLeft ? "auto" : "-40px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${glowColor}33 0%, transparent 70%)`, animation: "glowPulse 3s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ color: accentColor, fontFamily: "'Georgia', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px", opacity: 0.8 }}>{subtitle}</div>
            <div style={{ color: "#fff", fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: "bold", letterSpacing: "1px", marginBottom: "12px", textShadow: `0 0 10px ${glowColor}88` }}>{title}</div>
            <div style={{ height: "1px", background: `linear-gradient(90deg, ${accentColor}88, transparent)`, marginBottom: "12px" }} />
            <div style={{ color: "#cccccc", fontFamily: "sans-serif", fontSize: "12px", lineHeight: "1.7", marginBottom: "14px" }}>{description}</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: nextArena ? "14px" : "0" }}>
                {tags.map((tag, i) => (
                    <span key={i} style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}55`, color: accentColor, borderRadius: "20px", padding: "3px 10px", fontSize: "10px", letterSpacing: "1px", fontFamily: "sans-serif", textTransform: "uppercase" }}>{tag}</span>
                ))}
            </div>
            {nextArena && (
                <div style={{ paddingTop: "10px", borderTop: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontFamily: "sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>Next Arena</span>
                    <span style={{ color: accentColor, fontFamily: "'Georgia', serif", fontSize: "11px", fontWeight: "bold" }}>{nextArena} →</span>
                </div>
            )}
            <style>{`
                @keyframes cardFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
                @keyframes glowSweep { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
                @keyframes glowPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.2); } }
            `}</style>
        </div>
    )
}