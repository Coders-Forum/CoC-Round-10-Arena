import { Canvas } from "@react-three/fiber"
import VolcanoLand from "../lands/VolcanoLand.jsx"
import SnowLand from "../lands/SnowLand.jsx"
import PlantIsland from "../lands/PlantIsland.jsx"
import IslandLand from "../lands/IslandLand.jsx"
import ColiseumLand from "../lands/ColiseumLand.jsx"
import PyramidLand from "../lands/PyramidLand.jsx"
import CastleFortress from "../lands/CastleFortress.jsx"
import RuinLand from "../lands/RuinLand.jsx"
import MayanTemple from "../lands/MayanTemple.jsx"
import GreekTemple from "../lands/GreekTemple.jsx"
import AudioPlayer from "../ui/AudioPlayer.jsx"
import LazyCanvas from "../ui/LazyCanvas.jsx"
import ArenaCard from "../ui/ArenaCard.jsx"

const cards = {
    volcano: {
        accentColor: "#ff4500",
        glowColor: "#ff2200",
        subtitle: "Difficulty: Inferno",
        title: "Volcano Arena",
        description: "Survive the molten battlefield. Lava flows split the arena as debris rains from above. Only the sharpest minds conquer the fire.",
        tags: ["Extreme", "String Matching", "Most Difficult"]
    },
    snow: {
        accentColor: "#88ccff",
        glowColor: "#aaddff",
        subtitle: "Difficulty: Blizzard",
        title: "Frozen Peaks",
        description: "Battle through icy tundra where every move is calculated. Algorithms freeze mid-execution in the cold of the north.",
        tags: ["Hard", "Dynamic Programming", "Ice Cold"]
    },
    plant: {
        accentColor: "#44cc44",
        glowColor: "#22aa00",
        subtitle: "Difficulty: Overgrowth",
        title: "Jungle Isle",
        description: "Navigate through tangled trees and dense undergrowth. Graph traversal comes alive in the wild jungle maze.",
        tags: ["Medium", "Graph Theory", "Survival"]
    },
    island: {
        accentColor: "#00ccff",
        glowColor: "#00aadd",
        subtitle: "Difficulty: Tidal",
        title: "Island Shores",
        description: "Waves crash as you race against the tide. Greedy algorithms and optimal paths decide who reaches the shore first.",
        tags: ["Medium", "Greedy", "Time Attack"]
    },
    coliseum: {
        accentColor: "#c0d0ff",
        glowColor: "#8899dd",
        subtitle: "Difficulty: Gladiator",
        title: "The Coliseum",
        description: "Enter the grand arena. Face opponents in head-to-head algorithmic combat. Only the most efficient solution wins the crowd.",
        tags: ["Hard", "Sorting", "Combat"]
    },
    pyramid: {
        accentColor: "#ffaa00",
        glowColor: "#ff8800",
        subtitle: "Difficulty: Ancient",
        title: "Desert Pyramid",
        description: "Unlock the secrets buried deep within. Recursive descent into the pyramid reveals hidden patterns and ancient logic.",
        tags: ["Hard", "Recursion", "Hidden Path"]
    },
    castle: {
        accentColor: "#9988cc",
        glowColor: "#6655aa",
        subtitle: "Difficulty: Siege",
        title: "Castle Fortress",
        description: "Storm the fortress walls. Defensive data structures crumble under optimized attacks. Break through every layer.",
        tags: ["Expert", "Trees & Graphs", "Siege"]
    },
    ruin: {
        accentColor: "#88aa44",
        glowColor: "#446622",
        subtitle: "Difficulty: Forgotten",
        title: "Ancient Ruins",
        description: "Decipher the crumbling code of a lost civilization. Fragment reassembly and pattern reconstruction await the brave.",
        tags: ["Medium", "Pattern Match", "Exploration"]
    },
    mayan: {
        accentColor: "#cc8833",
        glowColor: "#aa6611",
        subtitle: "Difficulty: Sacred",
        title: "Mayan Temple",
        description: "Climb the sacred steps to algorithmic enlightenment. Each tier harder than the last. Only the worthy reach the apex.",
        tags: ["Expert", "DP + Backtrack", "Sacred"]
    },
    greek: {
        accentColor: "#fff8ee",
        glowColor: "#ddcc99",
        subtitle: "Difficulty: Olympian",
        title: "Greek Temple",
        description: "Compete under the eyes of the gods. Pure logic, elegant solutions, and mathematical precision define the Olympian coder.",
        tags: ["Extreme", "Math & Logic", "Divine"]
    }
}

const cardBox = (top, left) => ({
    position: "absolute",
    top,
    left,
    display: "flex",
    alignItems: "flex-end",  // ← was "center", now bottom-aligned
    zIndex: 5,
    pointerEvents: "none"
})


const btnStyle = {
    background: "rgba(0,0,0,0.75)",
    border: "1px solid #c47d00",
    borderRadius: "30px",
    padding: "12px 28px",
    color: "#ffe066",
    fontFamily: "'Georgia', serif",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "2px",
    cursor: "pointer",
    textTransform: "uppercase",
    boxShadow: "0 0 12px #c47d00, 0 0 24px #c47d0055",
    transition: "all 0.3s",
    zIndex: 10,
    position: "relative"
}

const canvasBox = (top, left, width = "420px", height = "420px") => ({
    position: "absolute",
    top, left, width, height,
    pointerEvents: "auto"
})

const btnBox = (top, left) => ({
    position: "absolute",
    top, left,
    display: "flex",
    justifyContent: "center",
    width: "420px",
    zIndex: 10
})

export default function Scene() {
    const cameraConfig = {
        position: [25, 20, 25],
        fov: 35,
        near: 0.1,
        far: 2000
    }

    const canvasProps = {
        dpr: [1, 1],  // ← was [1, 1.5], reduces GPU load
        gl: { antialias: false, powerPreference: "high-performance", alpha: true },  // ← antialias off = big perf gain
        style: { background: "transparent" }
    }

    return (
        <>
            <AudioPlayer />

            <div style={{
                width: "100vw",
                height: "500vh",
                position: "relative",
                background: "transparent"
            }}>

                {/* ── SCREEN 1 ── */}

                {/* VOLCANO — top left */}
                <div style={canvasBox("20px", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 15, 10]} intensity={1.5} />
                        <directionalLight position={[-10, 5, -10]} intensity={0.6} />
                        <pointLight position={[0, 22, 0]} intensity={5} color="#ff4500" distance={40} />
                        <VolcanoLand />
                    </LazyCanvas>
                </div>
                {/* Volcano card — right of model, left-aligned */}
                <div style={cardBox("140px", "450px")}>
                    <ArenaCard side="left" {...cards.volcano} />
                </div>
                <div style={btnBox("450px", "20px")}>
                    <button style={btnStyle}>⚔ Enter Volcano Arena</button>
                </div>

                {/* SNOW — bottom right */}
                <div style={canvasBox("calc(100vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[20, 15, 5]} intensity={1.8} color="#cce8ff" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#99ccff" />
                        <pointLight position={[0, -3, 0]} intensity={1.5} color="#ddeeff" distance={30} />
                        <pointLight position={[0, 10, -15]} intensity={1.2} color="#aabbdd" distance={40} />
                        <SnowLand />
                    </LazyCanvas>
                </div>
                {/* Snow card — left of model, right-aligned */}
                <div style={cardBox("calc(100vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.snow} />
                </div>
                <div style={{ ...btnBox("calc(100vh - 440px + 430px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}>❄ Enter Frozen Peaks</button>
                </div>

                {/* ── SCREEN 2 ── */}

                {/* PLANT ISLAND — top left */}
                <div style={canvasBox("calc(100vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaff66" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#114400" />
                        <pointLight position={[0, -2, 0]} intensity={1.5} color="#22aa00" distance={30} />
                        <pointLight position={[5, 10, 5]} intensity={2} color="#aaff44" distance={35} />
                        <PlantIsland />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(100vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.plant} />
                </div>
                <div style={btnBox("calc(100vh + 450px)", "20px")}>
                    <button style={btnStyle}>🌿 Enter Jungle Isle</button>
                </div>

                {/* ISLAND — bottom right */}
                <div style={canvasBox("calc(200vh - 500px)", "calc(100vw - 520px)", "500px", "500px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[15, 30, 10]} intensity={2.2} color="#fff5cc" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#aaddff" />
                        <pointLight position={[0, -3, 0]} intensity={2} color="#00ccff" distance={35} />
                        <pointLight position={[-10, 8, -10]} intensity={1.5} color="#ffaa33" distance={40} />
                        <IslandLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(200vh - 300px)", "calc(100vw - 870px)")}>
                    <ArenaCard side="right" {...cards.island} />
                </div>
                <div style={{ ...btnBox("calc(200vh - 500px + 510px)", "calc(100vw - 520px)"), width: "500px" }}>
                    <button style={btnStyle}>🏝 Enter Island Shores</button>
                </div>

                {/* ── SCREEN 3 ── */}

                {/* COLISEUM — top left */}
                <div style={canvasBox("calc(200vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[25, 20, 5]} intensity={2.0} color="#ddeeff" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#aabbcc" />
                        <pointLight position={[0, 15, -10]} intensity={2} color="#c0d0ff" distance={40} />
                        <pointLight position={[0, -2, 0]} intensity={0.8} color="#886633" distance={25} />
                        <ColiseumLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(200vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.coliseum} />
                </div>
                <div style={btnBox("calc(200vh + 450px)", "20px")}>
                    <button style={btnStyle}>🏛 Enter The Coliseum</button>
                </div>

                {/* PYRAMID — bottom right */}
                <div style={canvasBox("calc(300vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffcc77" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.2} color="#331a00" />
                        <pointLight position={[0, -5, 0]} intensity={1.5} color="#ff8800" distance={40} />
                        <pointLight position={[0, 10, -15]} intensity={2} color="#ffaa00" distance={50} />
                        <PyramidLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(300vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pyramid} />
                </div>
                <div style={btnBox("calc(300vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}>🔺 Enter Desert Pyramid</button>
                </div>

                {/* ── SCREEN 4 ── */}

                {/* CASTLE FORTRESS — top left */}
                <div style={canvasBox("calc(300vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 25, 15]} intensity={1.3} />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                        <CastleFortress />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(300vh + 140px)", "450px")}>
                <ArenaCard side="left" {...cards.castle} />
                </div>
                <div style={btnBox("calc(300vh + 450px)", "20px")}>
                    <button style={btnStyle}>🏰 Enter Castle Fortress</button>
                </div>

                {/* RUIN — bottom right */}
                <div style={canvasBox("calc(400vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 25, 15]} intensity={1.3} />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                        <RuinLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(400vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.ruin} />
                </div>
                <div style={btnBox("calc(400vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}>🏚 Enter Ancient Ruins</button>
                </div>

                {/* ── SCREEN 5 ── */}

                {/* MAYAN TEMPLE — top left */}
                <div style={canvasBox("calc(400vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.35} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ccccbb" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.25} color="#223300" />
                        <pointLight position={[0, -2, 0]} intensity={1.5} color="#554433" distance={30} />
                        <pointLight position={[0, 8, 5]} intensity={2} color="#ff8800" distance={35} />
                        <MayanTemple />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(400vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.mayan} />
                </div>
                <div style={btnBox("calc(400vh + 450px)", "20px")}>
                    <button style={btnStyle}>🗿 Enter Mayan Temple</button>
                </div>

                {/* GREEK TEMPLE — bottom right */}
                <div style={canvasBox("calc(500vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.6} color="#cce0ff" />
                        <pointLight position={[0, -3, 0]} intensity={1.8} color="#fff8ee" distance={35} />
                        <pointLight position={[0, 20, -12]} intensity={2.2} color="#ffe8aa" distance={50} />
                        <GreekTemple />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(500vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.greek} />
                </div>
                <div style={btnBox("calc(500vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}>🏛 Enter Greek Temple</button>
                </div>

            </div>
        </>
    )
}