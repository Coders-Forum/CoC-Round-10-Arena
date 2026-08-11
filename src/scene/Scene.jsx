import { Suspense } from "react"
import { useGLTF } from "@react-three/drei"
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
import PagodaLand from "../lands/PagodaLand.jsx"
import PedestalLand from "../lands/PedestalLand.jsx"
import CathedralLand from "../lands/CathedralLand.jsx"
import ToriiLand from "../lands/ToriiLand.jsx"
import Castle2Land from "../lands/Castle2Land.jsx"
import Pagoda2Land from "../lands/Pagoda2Land.jsx"
import BarracksLand from "../lands/BarracksLand.jsx"
import PalaceLand from "../lands/PalaceLand.jsx"
import JapaneseShrine from "../lands/JapaneseShrine.jsx"
import DeadForest from "../lands/DeadForest.jsx"
import TempleLand from "../lands/TempleLand.jsx"
import ArchwayLand from "../lands/ArchwayLand.jsx"
import CemeteryLand from "../lands/CemeteryLand.jsx"
import NecroLand from "../lands/NecroLand.jsx"
import PillarsLand from "../lands/PillarsLand.jsx"

// Preload all GLB models immediately on page load into memory cache
const base = import.meta.env.BASE_URL
const modelsToPreload = [
    "volcano.glb",
    "snow_mountain.glb",
    "plant_island.glb",
    "Island.glb",
    "Coliseum.glb",
    "Pyramid.glb",
    "Castle Fortress.glb",
    "Ruin.glb",
    "Mayan Temple.glb",
    "Greek Temple.glb",
    "Pagoda.glb",
    "Pedestal.glb",
    "Cathedral.glb",
    "Japanese Torii.glb",
    "Castle (1).glb",
    "Pagoda(2).glb",
    "Barracks.glb",
    "Palace.glb",
    "Torii Gate.glb",
    "Mystic Tree.glb",
    "Dead Trees With Snow.glb",
    "Temple.glb",
    "Archway.glb",
    "Necropolis walls V2.glb",
    "Cemetery scene.glb",
    "Column.glb"
]
modelsToPreload.forEach((m) => useGLTF.preload(`${base}models/${m}`))

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
    },
    pagoda: {
        accentColor: "#cc2200",
        glowColor: "#ff4400",
        subtitle: "Difficulty: Joseon Dynasty",
        title: "Korean Pagoda",
        description: "Standing tall from Korea's Joseon Dynasty, this pagoda holds centuries of algorithmic wisdom. Each tier a harder challenge reach the top or fall with honor.",
        tags: ["Hard", "Joseon Dynasty", "Korean"]
    },
    pedestal: {
        accentColor: "#aabbcc",
        glowColor: "#ddeeff",
        subtitle: "Difficulty: Monolith",
        title: "Stone Pedestal",
        description: "Stand before the monolith. Immovable, ancient, and unforgiving. Only those with flawless logic may claim the pedestal.",
        tags: ["Expert", "Binary Search", "Endgame"]
    },
    cathedral: {
        accentColor: "#aaccff",
        glowColor: "#ffffff",
        subtitle: "Difficulty: Whitestone",
        title: "Santorini",
        description: "A lone white building standing against the sky. Clean walls, sharp edges, pure logic. No shortcuts, no mercy just you and the algorithm.",
        tags: ["Hard", "Divide & Conquer", "Whitestone"]
    },
    torii: {
        accentColor: "#ff2200",
        glowColor: "#ff4400",
        subtitle: "Difficulty: Tang Dynasty",
        title: "Lantern Gate",
        description: "Red lanterns float through the night sky as the sacred gate glows with ancient Chinese spirit. Navigate the maze of floating light one wrong turn and the lanterns go dark.",
        tags: ["Expert", "Tang Dynasty", "Floating Lanterns"]
    },
    castle2: {
        accentColor: "#aabbdd",
        glowColor: "#ccddf0",
        subtitle: "Difficulty: Ironclad",
        title: "Rock Fort",
        description: "Hewn from solid rock, this fortress has never fallen. Brute force won't work here only precise, optimized logic can crack the stone walls.",
        tags: ["Expert", "Graph Traversal", "Ironclad"]
    },
    pagoda2: {
        accentColor: "#44bb44",
        glowColor: "#ff6633",
        subtitle: "Difficulty: Shaolin",
        title: "Shaolin Temple",
        description: "Train in the sacred halls of Shaolin. Master your algorithms like a monk masters his body through discipline, repetition and enlightenment of pure logic.",
        tags: ["Hard", "Shaolin", "Enlightenment"]
    },
    barracks: {
        accentColor: "#aa7733",
        glowColor: "#cc9944",
        subtitle: "Difficulty: Battalion",
        title: "Barracks",
        description: "Where warriors are forged. Train your algorithms under pressure. Speed, discipline and raw efficiency are the only currencies accepted here.",
        tags: ["Medium", "Sorting & Search", "Battalion"]
    },
    palace: {
        accentColor: "#ffdd88",
        glowColor: "#ffcc44",
        subtitle: "Difficulty: Royal",
        title: "The Palace",
        description: "The grandest arena of all. Reserved for coders of royal caliber. Every algorithm must be perfect the king accepts nothing less than optimal.",
        tags: ["Extreme", "All Algorithms", "Royal"]
    },
    shrine: {
        accentColor: "#ff6633",
        glowColor: "#ff4400",
        subtitle: "Difficulty: Zen Master",
        title: "Japanese Shrine",
        description: "Pass through the sacred Torii gate beneath the mystic autumn tree. Silence your mind, find the optimal path, and achieve algorithmic enlightenment.",
        tags: ["Expert", "Path Finding", "Zen"]
    },
    deadforest: {
        accentColor: "#aabbcc",
        glowColor: "#ddeeff",
        subtitle: "Difficulty: Norse Curse",
        title: "Norwegian Dead Forest",
        description: "Deep in the frozen Norwegian wilderness, cursed trees stand under eternal darkness. Face the wrath of Norse winter only Odin's chosen coders survive.",
        tags: ["Hard", "Norse Curse", "Frozen"]
    },
    temple: {
        accentColor: "#ffcc44",
        glowColor: "#ffdd88",
        subtitle: "Difficulty: Orthodox",
        title: "Saint Basil's Cathedral",
        description: "Rising from Red Square, this Russian Orthodox masterpiece demands divine precision. Code with the discipline of a Tsar one mistake and the domes crumble.",
        tags: ["Hard", "Russian Orthodox", "Sacred"]
    },
    archway: {
        accentColor: "#ddccbb",
        glowColor: "#ffffff",
        subtitle: "Difficulty: French Empire",
        title: "Arc de Triomphe",
        description: "Born from Napoleon's victory, the Arc de Triomphe stands at the heart of Paris. Conquer its algorithmic grandeur and march down the Champs Élysées of code.",
        tags: ["Extreme", "French Empire", "Monument"]
    },
    necro: {
        accentColor: "#ffcc44",
        glowColor: "#ffaa00",
        subtitle: "Difficulty: Sacred Burial",
        title: "Necropolis",
        description: "Ancient walls guard the resting place of forgotten coders. The sacred light pulses with the knowledge of the dead. Decode their final algorithms.",
        tags: ["Expert", "Cryptography", "Sacred"]
    },
    cemetery: {
        accentColor: "#44aa44",
        glowColor: "#226622",
        subtitle: "Difficulty: Haunted",
        title: "Cemetery",
        description: "Gravestones float in the cursed moonlight. The lantern flickers as you debug in the dark. One wrong move and your code joins the buried.",
        tags: ["Hard", "Backtracking", "Haunted"]
    },
    pillars: {
        accentColor: "#44aaff",
        glowColor: "#0088ff",
        subtitle: "Difficulty: Eternal",
        title: "Pillars of Eternity",
        description: "Four ancient pillars crackling with electric energy. This is the final test where only the greatest algorithmic minds are worthy of standing between them.",
        tags: ["Extreme", "All Algorithms", "Eternal"]
    },
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
                height: "1270vh",
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
                        <Suspense fallback={null}><VolcanoLand /></Suspense>
                    </LazyCanvas>
                </div>
                {/* Volcano card — right of model, left-aligned */}
                <div style={cardBox("140px", "450px")}>
                    <ArenaCard side="left" {...cards.volcano} />
                </div>
                <div style={btnBox("450px", "20px")}>
                    <button style={btnStyle}> Enter Volcano Arena</button>
                </div>

                {/* SNOW — bottom right */}
                <div style={canvasBox("calc(100vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[20, 15, 5]} intensity={1.8} color="#cce8ff" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#99ccff" />
                        <pointLight position={[0, -3, 0]} intensity={1.5} color="#ddeeff" distance={30} />
                        <pointLight position={[0, 10, -15]} intensity={1.2} color="#aabbdd" distance={40} />
                        <Suspense fallback={null}><SnowLand /></Suspense>
                    </LazyCanvas>
                </div>
                {/* Snow card — left of model, right-aligned */}
                <div style={cardBox("calc(100vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.snow} />
                </div>
                <div style={{ ...btnBox("calc(100vh - 440px + 430px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Frozen Peaks</button>
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
                    <button style={btnStyle}> Enter Jungle Isle</button>
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
                    <button style={btnStyle}> Enter Island Shores</button>
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
                    <button style={btnStyle}> Enter The Coliseum</button>
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
                    <button style={btnStyle}> Enter Desert Pyramid</button>
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
                    <button style={btnStyle}> Enter Castle Fortress</button>
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
                    <button style={btnStyle}> Enter Ancient Ruins</button>
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
                    <button style={btnStyle}> Enter Mayan Temple</button>
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
                    <button style={btnStyle}> Enter Greek Temple</button>
                </div>


                {/* ── SCREEN 6 ── */}

                {/* PAGODA — top left */}
                <div style={canvasBox("calc(500vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} />
                        <pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} />
                        <PagodaLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(500vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.pagoda} />
                </div>
                <div style={btnBox("calc(500vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Pagoda Tower</button>
                </div>

                {/* PEDESTAL — bottom right */}
                <div style={canvasBox("calc(600vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={1.8} color="#ddeeff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" />
                        <pointLight position={[0, -3, 0]} intensity={1.5} color="#ccddee" distance={35} />
                        <pointLight position={[0, 15, -10]} intensity={1.8} color="#eef0ff" distance={45} />
                        <PedestalLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(600vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pedestal} />
                </div>
                <div style={btnBox("calc(600vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Stone Pedestal</button>
                </div>

                {/* ── SCREEN 7 ── */}

                {/* CATHEDRAL — top left */}
                <div style={canvasBox("calc(600vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 30, 10]} intensity={2.2} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#aaccff" />
                        <pointLight position={[0, 10, 0]} intensity={2} color="#ddeeff" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.5} color="#ffffff" distance={35} />
                        <CathedralLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(600vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.cathedral} />
                </div>
                <div style={btnBox("calc(600vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Santorini</button>
                </div>

                {/* TORII — bottom right */}
                <div style={canvasBox("calc(700vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} />
                        <pointLight position={[0, 12, -8]} intensity={2} color="#ff8800" distance={40} />
                        <ToriiLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(700vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.torii} />
                </div>
                <div style={btnBox("calc(700vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Torii Gate</button>
                </div>

                {/* ── SCREEN 8 ── */}

                {/* CASTLE(1) — top left */}
                <div style={canvasBox("calc(700vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={2.0} color="#ddeeff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" />
                        <pointLight position={[0, 10, 0]} intensity={2} color="#bbccee" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.2} color="#99aabb" distance={30} />
                        <Castle2Land />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(700vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.castle2} />
                </div>
                <div style={btnBox("calc(700vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Rock Fort</button>
                </div>

                {/* PAGODA(2) — bottom right */}
                <div style={canvasBox("calc(800vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaffaa" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#113300" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff5500" distance={35} />
                        <pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} />
                        <Pagoda2Land />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(800vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pagoda2} />
                </div>
                <div style={btnBox("calc(800vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Jade Pagoda</button>
                </div>

                {/* ── SCREEN 9 ── */}

                {/* BARRACKS — top left */}
                <div style={canvasBox("calc(800vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ddbb88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" />
                        <pointLight position={[0, 5, 0]} intensity={2} color="#cc8833" distance={35} />
                        <pointLight position={[0, 12, -8]} intensity={1.5} color="#ffaa44" distance={40} />
                        <BarracksLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(800vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.barracks} />
                </div>
                <div style={btnBox("calc(800vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Barracks</button>
                </div>

                {/* PALACE — bottom right */}
                <div style={canvasBox("calc(900vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffeeaa" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#bbaa44" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ffdd44" distance={40} />
                        <pointLight position={[0, 20, -10]} intensity={2} color="#ffcc00" distance={50} />
                        <PalaceLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(900vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.palace} />
                </div>
                <div style={btnBox("calc(900vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter The Palace</button>
                </div>

                {/* ── SCREEN 10 ── */}

                {/* JAPANESE SHRINE — top left */}
                <div style={canvasBox("calc(900vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" />
                        <pointLight position={[0, 5, 0]} intensity={2.5} color="#ff5500" distance={35} />
                        <pointLight position={[0, 12, 5]} intensity={1.8} color="#ffaa44" distance={40} />
                        <JapaneseShrine />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(900vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.shrine} />
                </div>
                <div style={btnBox("calc(900vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Japanese Shrine</button>
                </div>

                {/* DEAD FOREST — bottom right */}
                <div style={canvasBox("calc(1000vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[20, 30, 10]} intensity={3.0} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={1.5} color="#eef5ff" />
                        <directionalLight position={[0, -10, 15]} intensity={1.0} color="#cce0ff" />
                        <pointLight position={[0, 10, 5]} intensity={4} color="#ffffff" distance={50} />
                        <DeadForest />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1000vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.deadforest} />
                </div>
                <div style={btnBox("calc(1000vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Dead Winter Forest</button>
                </div>

                {/* ── SCREEN 11 ── */}

                {/* TEMPLE — top left */}
                <div style={canvasBox("calc(1000vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffeeaa" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#ffcc66" />
                        <pointLight position={[0, 10, 0]} intensity={2.5} color="#ffdd44" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.2} color="#ff8800" distance={25} />
                        <TempleLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1000vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.temple} />
                </div>
                <div style={btnBox("calc(1000vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Saint Basil's</button>
                </div>

                {/* ARCHWAY — bottom right */}
                <div style={canvasBox("calc(1100vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[20, 30, 10]} intensity={2.2} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#ddeeff" />
                        <pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" distance={35} />
                        <pointLight position={[0, 15, -8]} intensity={1.5} color="#eeeeff" distance={40} />
                        <ArchwayLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1100vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.archway} />
                </div>
                <div style={btnBox("calc(1100vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Arc de Triomphe</button>
                </div>

                {/* ── SCREEN 12 ── */}

                {/* NECROPOLIS — top left */}
                <div style={canvasBox("calc(1100vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[15, 25, 10]} intensity={1.5} color="#ffeeaa" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.2} color="#332200" />
                        <NecroLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1100vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.necro} />
                </div>
                <div style={btnBox("calc(1100vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Necropolis</button>
                </div>

                {/* CEMETERY — bottom right */}
                <div style={canvasBox("calc(1200vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.9} />
                        <directionalLight position={[8, 15, 8]} intensity={0.8} color="#99aabb" />
                        <directionalLight position={[-8, 10, -8]} intensity={0.5} color="#667788" />
                        <CemeteryLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1200vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.cemetery} />
                </div>
                <div style={btnBox("calc(1200vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Cemetery</button>
                </div>

                {/* ── SCREEN 13 ── */}

                {/* PILLARS — top left */}
                <div style={canvasBox("calc(1200vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffffff" />
                        <directionalLight position={[-10, 10, -10]} intensity={1.0} color="#aaccff" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#44aaff" distance={30} />
                        <PillarsLand />
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1200vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.pillars} />
                </div>
                <div style={btnBox("calc(1200vh + 450px)", "20px")}>
                    <button style={btnStyle}>Enter Pillars of Eternity</button>
                </div>
            </div>
        </>
    )
}