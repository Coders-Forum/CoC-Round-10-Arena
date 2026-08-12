import { Suspense, useState, useEffect, useRef } from "react"
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

// Staggered model preloading
const base = import.meta.env.BASE_URL
const initialModels = ["volcano.glb", "snow_mountain.glb", "plant_island.glb", "Island.glb"]
initialModels.forEach((m) => useGLTF.preload(`${base}models/${m}`))

if (typeof window !== "undefined") {
    const remainingModels = [
        "Coliseum.glb", "Pyramid.glb", "Castle Fortress.glb", "Ruin.glb", "Mayan Temple.glb",
        "Greek Temple.glb", "Pagoda.glb", "Pedestal.glb", "Cathedral.glb", "Japanese Torii.glb",
        "Castle (1).glb", "Pagoda(2).glb", "Barracks.glb", "Palace.glb", "Torii Gate.glb",
        "Mystic Tree.glb", "Dead Trees With Snow.glb", "Temple.glb", "Archway.glb",
        "Necropolis walls V2.glb", "Cemetery scene.glb", "Column.glb"
    ]
    const schedulePreload = () => {
        remainingModels.forEach((m, idx) => {
            setTimeout(() => {
                useGLTF.preload(`${base}models/${m}`)
            }, idx * 100)
        })
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(schedulePreload)
    } else {
        setTimeout(schedulePreload, 600)
    }
}

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

const ARENAS_LIST = [
    { id: "volcano", LandComponent: VolcanoLand, card: cards.volcano, btnText: "Enter Volcano Arena", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[10, 15, 10]} intensity={1.5} /><directionalLight position={[-10, 5, -10]} intensity={0.6} /><pointLight position={[0, 22, 0]} intensity={5} color="#ff4500" distance={40} /></>) },
    { id: "snow", LandComponent: SnowLand, card: cards.snow, btnText: "Enter Frozen Peaks", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[20, 15, 5]} intensity={1.8} color="#cce8ff" /><directionalLight position={[-10, 10, -10]} intensity={0.5} color="#99ccff" /><pointLight position={[0, -3, 0]} intensity={1.5} color="#ddeeff" distance={30} /><pointLight position={[0, 10, -15]} intensity={1.2} color="#aabbdd" distance={40} /></>) },
    { id: "plant", LandComponent: PlantIsland, card: cards.plant, btnText: "Enter Jungle Isle", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaff66" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#114400" /><pointLight position={[0, -2, 0]} intensity={1.5} color="#22aa00" distance={30} /><pointLight position={[5, 10, 5]} intensity={2} color="#aaff44" distance={35} /></>) },
    { id: "island", LandComponent: IslandLand, card: cards.island, btnText: "Enter Island Shores", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[15, 30, 10]} intensity={2.2} color="#fff5cc" /><directionalLight position={[-10, 10, -10]} intensity={0.4} color="#aaddff" /><pointLight position={[0, -3, 0]} intensity={2} color="#00ccff" distance={35} /><pointLight position={[-10, 8, -10]} intensity={1.5} color="#ffaa33" distance={40} /></>) },
    { id: "coliseum", LandComponent: ColiseumLand, card: cards.coliseum, btnText: "Enter The Coliseum", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[25, 20, 5]} intensity={2.0} color="#ddeeff" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#aabbcc" /><pointLight position={[0, 15, -10]} intensity={2} color="#c0d0ff" distance={40} /><pointLight position={[0, -2, 0]} intensity={0.8} color="#886633" distance={25} /></>) },
    { id: "pyramid", LandComponent: PyramidLand, card: cards.pyramid, btnText: "Enter Desert Pyramid", lights: () => (<><ambientLight intensity={0.3} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffcc77" /><directionalLight position={[-10, 5, -10]} intensity={0.2} color="#331a00" /><pointLight position={[0, -5, 0]} intensity={1.5} color="#ff8800" distance={40} /><pointLight position={[0, 10, -15]} intensity={2} color="#ffaa00" distance={50} /></>) },
    { id: "castle", LandComponent: CastleFortress, card: cards.castle, btnText: "Enter Castle Fortress", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 25, 15]} intensity={1.3} /><directionalLight position={[-10, 10, -10]} intensity={0.5} /></>) },
    { id: "ruin", LandComponent: RuinLand, card: cards.ruin, btnText: "Enter Ancient Ruins", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 25, 15]} intensity={1.3} /><directionalLight position={[-10, 10, -10]} intensity={0.5} /></>) },
    { id: "mayan", LandComponent: MayanTemple, card: cards.mayan, btnText: "Enter Mayan Temple", lights: () => (<><ambientLight intensity={0.35} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ccccbb" /><directionalLight position={[-10, 5, -10]} intensity={0.25} color="#223300" /><pointLight position={[0, -2, 0]} intensity={1.5} color="#554433" distance={30} /><pointLight position={[0, 8, 5]} intensity={2} color="#ff8800" distance={35} /></>) },
    { id: "greek", LandComponent: GreekTemple, card: cards.greek, btnText: "Enter Greek Temple", lights: () => (<><ambientLight intensity={0.7} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.6} color="#cce0ff" /><pointLight position={[0, -3, 0]} intensity={1.8} color="#fff8ee" distance={35} /><pointLight position={[0, 20, -12]} intensity={2.2} color="#ffe8aa" distance={50} /></>) },
    { id: "pagoda", LandComponent: PagodaLand, card: cards.pagoda, btnText: "Enter Pagoda Tower", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} /><pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} /></>) },
    { id: "pedestal", LandComponent: PedestalLand, card: cards.pedestal, btnText: "Enter Stone Pedestal", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={1.8} color="#ddeeff" /><directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" /><pointLight position={[0, -3, 0]} intensity={1.5} color="#ccddee" distance={35} /><pointLight position={[0, 15, -10]} intensity={1.8} color="#eef0ff" distance={45} /></>) },
    { id: "cathedral", LandComponent: CathedralLand, card: cards.cathedral, btnText: "Enter Santorini", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 30, 10]} intensity={2.2} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#aaccff" /><pointLight position={[0, 10, 0]} intensity={2} color="#ddeeff" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.5} color="#ffffff" distance={35} /></>) },
    { id: "torii", LandComponent: ToriiLand, card: cards.torii, btnText: "Enter Torii Gate", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} /><pointLight position={[0, 12, -8]} intensity={2} color="#ff8800" distance={40} /></>) },
    { id: "castle2", LandComponent: Castle2Land, card: cards.castle2, btnText: "Enter Rock Fort", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={2.0} color="#ddeeff" /><directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" /><pointLight position={[0, 10, 0]} intensity={2} color="#bbccee" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.2} color="#99aabb" distance={30} /></>) },
    { id: "pagoda2", LandComponent: Pagoda2Land, card: cards.pagoda2, btnText: "Enter Jade Pagoda", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaffaa" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#113300" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff5500" distance={35} /><pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} /></>) },
    { id: "barracks", LandComponent: BarracksLand, card: cards.barracks, btnText: "Enter Barracks", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ddbb88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" /><pointLight position={[0, 5, 0]} intensity={2} color="#cc8833" distance={35} /><pointLight position={[0, 12, -8]} intensity={1.5} color="#ffaa44" distance={40} /></>) },
    { id: "palace", LandComponent: PalaceLand, card: cards.palace, btnText: "Enter The Palace", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffeeaa" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#bbaa44" /><pointLight position={[0, 5, 0]} intensity={3} color="#ffdd44" distance={40} /><pointLight position={[0, 20, -10]} intensity={2} color="#ffcc00" distance={50} /></>) },
    { id: "shrine", LandComponent: JapaneseShrine, card: cards.shrine, btnText: "Enter Japanese Shrine", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" /><pointLight position={[0, 5, 0]} intensity={2.5} color="#ff5500" distance={35} /><pointLight position={[0, 12, 5]} intensity={1.8} color="#ffaa44" distance={40} /></>) },
    { id: "deadforest", LandComponent: DeadForest, card: cards.deadforest, btnText: "Enter Dead Winter Forest", lights: () => (<><ambientLight intensity={1.2} /><directionalLight position={[20, 30, 10]} intensity={3.0} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={1.5} color="#eef5ff" /><directionalLight position={[0, -10, 15]} intensity={1.0} color="#cce0ff" /><pointLight position={[0, 10, 5]} intensity={4} color="#ffffff" distance={50} /></>) },
    { id: "temple", LandComponent: TempleLand, card: cards.temple, btnText: "Enter Saint Basil's", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffeeaa" /><directionalLight position={[-10, 10, -10]} intensity={0.4} color="#ffcc66" /><pointLight position={[0, 10, 0]} intensity={2.5} color="#ffdd44" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.2} color="#ff8800" distance={25} /></>) },
    { id: "archway", LandComponent: ArchwayLand, card: cards.archway, btnText: "Enter Arc de Triomphe", lights: () => (<><ambientLight intensity={0.7} /><directionalLight position={[20, 30, 10]} intensity={2.2} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#ddeeff" /><pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" distance={35} /><pointLight position={[0, 15, -8]} intensity={1.5} color="#eeeeff" distance={40} /></>) },
    { id: "necro", LandComponent: NecroLand, card: cards.necro, btnText: "Enter Necropolis", lights: () => (<><ambientLight intensity={0.3} /><directionalLight position={[15, 25, 10]} intensity={1.5} color="#ffeeaa" /><directionalLight position={[-10, 5, -10]} intensity={0.2} color="#332200" /></>) },
    { id: "cemetery", LandComponent: CemeteryLand, card: cards.cemetery, btnText: "Enter Cemetery", lights: () => (<><ambientLight intensity={0.9} /><directionalLight position={[8, 15, 8]} intensity={0.8} color="#99aabb" /><directionalLight position={[-8, 10, -8]} intensity={0.5} color="#667788" /></>) },
    { id: "pillars", LandComponent: PillarsLand, card: cards.pillars, btnText: "Enter Pillars of Eternity", lights: () => (<><ambientLight intensity={1.2} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffffff" /><directionalLight position={[-10, 10, -10]} intensity={1.0} color="#aaccff" /><pointLight position={[0, 5, 0]} intensity={3} color="#44aaff" distance={30} /></>) },
]

const CAROUSEL_BREAKPOINT = 1024

// ─────────────────────────────────────────────────────────────────────
// Desktop Scroll Layout — each arena is a full viewport-height section
// ─────────────────────────────────────────────────────────────────────
function DesktopScrollLayout() {
    const cameraConfig = { position: [25, 20, 25], fov: 35, near: 0.1, far: 2000 }

    return (
        <div style={{ width: "100%" }}>
            {ARENAS_LIST.map((arena, idx) => {
                const LandComp = arena.LandComponent
                const isEven = idx % 2 === 0
                const nextArena = idx < ARENAS_LIST.length - 1 ? ARENAS_LIST[idx + 1].card.title : null
                const accent = arena.card.accentColor
                const glow = arena.card.glowColor

                return (
                    <div
                        key={arena.id}
                        style={{
                            minHeight: "100vh",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "40px 5%",
                            boxSizing: "border-box",
                            position: "relative",
                            background: `radial-gradient(ellipse at ${isEven ? "30%" : "70%"} 50%, ${glow}18 0%, transparent 60%)`
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "60px",
                            width: "100%",
                            maxWidth: "1200px",
                            flexDirection: isEven ? "row" : "row-reverse"
                        }}>
                            {/* 3D Canvas */}
                            <div style={{
                                width: "55%",
                                maxWidth: "600px",
                                height: "500px",
                                position: "relative"
                            }}>
                                <LazyCanvas camera={cameraConfig}>
                                    {arena.lights()}
                                    <Suspense fallback={null}>
                                        <LandComp />
                                    </Suspense>
                                </LazyCanvas>
                            </div>

                            {/* Card + Button */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "20px",
                                width: "40%",
                                maxWidth: "380px"
                            }}>
                                <ArenaCard
                                    side={isEven ? "right" : "left"}
                                    {...arena.card}
                                    nextArena={nextArena}
                                    width="100%"
                                />
                                <button style={{
                                    background: "rgba(0,0,0,0.85)",
                                    border: `1px solid ${accent}`,
                                    borderRadius: "30px",
                                    padding: "14px 32px",
                                    color: "#ffffff",
                                    fontFamily: "'Georgia', serif",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    letterSpacing: "2px",
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    boxShadow: `0 0 16px ${glow}66, 0 0 32px ${glow}33`,
                                    transition: "all 0.3s ease"
                                }}>
                                    {arena.btnText}
                                </button>
                            </div>
                        </div>

                        {/* Section Divider */}
                        {idx < ARENAS_LIST.length - 1 && (
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: "10%",
                                right: "10%",
                                height: "1px",
                                background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`
                            }} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────
// Carousel Layout — for tablets, mobiles, small screens (<1024px)
// Uses a SINGLE Canvas to avoid WebGL context limits
// ─────────────────────────────────────────────────────────────────────
function CarouselLayout() {
    const [activeIdx, setActiveIdx] = useState(0)
    const touchStartX = useRef(0)

    const cameraConfig = { position: [25, 20, 25], fov: 35, near: 0.1, far: 2000 }

    const currentArena = ARENAS_LIST[activeIdx]
    const CurrentLand = currentArena.LandComponent

    const handlePrev = () => setActiveIdx((p) => (p > 0 ? p - 1 : ARENAS_LIST.length - 1))
    const handleNext = () => setActiveIdx((p) => (p < ARENAS_LIST.length - 1 ? p + 1 : 0))

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") handlePrev()
            else if (e.key === "ArrowRight") handleNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) { diff > 0 ? handleNext() : handlePrev() }
    }

    const accent = currentArena.card.accentColor
    const glow = currentArena.card.glowColor

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                boxSizing: "border-box",
                background: `radial-gradient(circle at 50% 40%, ${glow}15 0%, #080808 75%)`,
                transition: "background 0.8s ease",
                overflowX: "hidden",
                position: "relative"
            }}
        >
            {/* Ambient glow */}
            <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at 50% 50%, ${accent}22 0%, transparent 60%)`,
                pointerEvents: "none", transition: "all 0.8s ease"
            }} />

            <div style={{
                width: "100%", maxWidth: "600px",
                display: "flex", flexDirection: "column", alignItems: "center",
                zIndex: 2, position: "relative", gap: "16px"
            }}>
                {/* Navigation */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", maxWidth: "400px"
                }}>
                    <button onClick={handlePrev} style={{
                        background: "rgba(0,0,0,0.75)", border: `1px solid ${accent}aa`,
                        color: accent, borderRadius: "24px", padding: "8px 18px",
                        fontSize: "11px", fontWeight: "bold", letterSpacing: "1px",
                        cursor: "pointer", backdropFilter: "blur(8px)",
                        boxShadow: `0 0 12px ${glow}33`, transition: "all 0.3s ease"
                    }}>❮ PREV</button>

                    <div style={{
                        color: "#fff", fontFamily: "'Georgia', serif",
                        fontSize: "13px", fontWeight: "bold", letterSpacing: "2px",
                        textShadow: `0 0 10px ${glow}88`
                    }}>ARENA {activeIdx + 1} / {ARENAS_LIST.length}</div>

                    <button onClick={handleNext} style={{
                        background: "rgba(0,0,0,0.75)", border: `1px solid ${accent}aa`,
                        color: accent, borderRadius: "24px", padding: "8px 18px",
                        fontSize: "11px", fontWeight: "bold", letterSpacing: "1px",
                        cursor: "pointer", backdropFilter: "blur(8px)",
                        boxShadow: `0 0 12px ${glow}33`, transition: "all 0.3s ease"
                    }}>NEXT ❯</button>
                </div>

                {/* 3D Viewport */}
                <div style={{
                    width: "100%", aspectRatio: "4/3", maxHeight: "50vh",
                    position: "relative"
                }}>
                    <LazyCanvas camera={cameraConfig} forceVisible={true}>
                        {currentArena.lights()}
                        <Suspense fallback={null}>
                            <CurrentLand key={currentArena.id} />
                        </Suspense>
                    </LazyCanvas>
                </div>

                {/* Arena Card */}
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "16px", width: "100%", maxWidth: "360px"
                }}>
                    <ArenaCard side="left" {...currentArena.card} width="100%" />
                    <button style={{
                        background: "rgba(0,0,0,0.85)", border: `1px solid ${accent}`,
                        borderRadius: "30px", padding: "12px 28px", color: "#fff",
                        fontFamily: "'Georgia', serif", fontSize: "12px", fontWeight: "bold",
                        letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase",
                        boxShadow: `0 0 16px ${glow}66, 0 0 32px ${glow}33`,
                        transition: "all 0.3s ease"
                    }}>{currentArena.btnText}</button>
                </div>

                {/* Indicator Pills */}
                <div style={{
                    display: "flex", gap: "5px", flexWrap: "wrap",
                    justifyContent: "center", maxWidth: "360px", marginTop: "12px"
                }}>
                    {ARENAS_LIST.map((a, i) => (
                        <div
                            key={a.id}
                            onClick={() => setActiveIdx(i)}
                            title={a.card.title}
                            style={{
                                width: i === activeIdx ? "20px" : "7px",
                                height: "7px", borderRadius: "4px",
                                background: i === activeIdx ? accent : "rgba(255,255,255,0.2)",
                                boxShadow: i === activeIdx ? `0 0 10px ${accent}` : "none",
                                transition: "all 0.3s ease", cursor: "pointer"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────
// Main Scene — switches between scroll and carousel based on screen width
// ─────────────────────────────────────────────────────────────────────
export default function Scene() {
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== "undefined" ? window.innerWidth < CAROUSEL_BREAKPOINT : false
    )

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${CAROUSEL_BREAKPOINT - 1}px)`)
        const handler = (e) => setIsSmallScreen(e.matches)
        mq.addEventListener("change", handler)
        setIsSmallScreen(mq.matches)
        return () => mq.removeEventListener("change", handler)
    }, [])

    if (isSmallScreen) {
        return <CarouselLayout />
    }
    return <DesktopScrollLayout />
}