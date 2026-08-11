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

// Staggered model preloading to avoid network congestion for 1000+ concurrent users
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
            }, idx * 120)
        })
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(schedulePreload)
    } else {
        setTimeout(schedulePreload, 800)
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

const cardBox = (top, left) => ({
    position: "absolute",
    top,
    left,
    display: "flex",
    alignItems: "flex-end",
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
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768)
    const [activeIdx, setActiveIdx] = useState(0)

    const touchStartX = useRef(0)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const cameraConfig = {
        position: [25, 20, 25],
        fov: 35,
        near: 0.1,
        far: 2000
    }

    const currentArena = ARENAS_LIST[activeIdx]
    const CurrentLand = currentArena.LandComponent

    const handlePrev = () => {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : ARENAS_LIST.length - 1))
    }

    const handleNext = () => {
        setActiveIdx((prev) => (prev < ARENAS_LIST.length - 1 ? prev + 1 : 0))
    }

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX
        const diff = touchStartX.current - touchEndX
        if (Math.abs(diff) > 40) {
            if (diff > 0) handleNext()
            else handlePrev()
        }
    }

    if (isMobile) {
        return (
            <>
                <AudioPlayer />
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        minHeight: "100vh",
                        width: "100vw",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 12px 32px 12px",
                        boxSizing: "border-box",
                        background: "radial-gradient(circle at 50% 30%, #1a1200 0%, #080808 80%)",
                        overflowX: "hidden"
                    }}
                >
                    {/* Header Banner */}
                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                        <div style={{ color: "#c47d00", fontFamily: "'Georgia', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" }}>
                            Clash of Coders — 3D Showcase
                        </div>
                        <div style={{ color: "#ffe066", fontFamily: "'Georgia', serif", fontSize: "20px", fontWeight: "bold", letterSpacing: "1px", textShadow: "0 0 12px #c47d00aa" }}>
                            BATTLE ARENAS
                        </div>
                    </div>

                    {/* Navigation Carousel Bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "360px", margin: "12px 0" }}>
                        <button
                            onClick={handlePrev}
                            style={{
                                background: "rgba(0,0,0,0.8)",
                                border: "1px solid #c47d00",
                                color: "#ffe066",
                                borderRadius: "20px",
                                padding: "8px 16px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                backdropFilter: "blur(6px)"
                            }}
                        >
                            ❮ PREV
                        </button>

                        <div style={{ color: "#ffffff", fontFamily: "'Georgia', serif", fontSize: "13px", fontWeight: "bold", letterSpacing: "1px" }}>
                            {activeIdx + 1} / {ARENAS_LIST.length}
                        </div>

                        <button
                            onClick={handleNext}
                            style={{
                                background: "rgba(0,0,0,0.8)",
                                border: "1px solid #c47d00",
                                color: "#ffe066",
                                borderRadius: "20px",
                                padding: "8px 16px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                backdropFilter: "blur(6px)"
                            }}
                        >
                            NEXT ❯
                        </button>
                    </div>

                    {/* 3D Model Display */}
                    <div style={{ width: "290px", height: "290px", position: "relative", margin: "0 auto" }}>
                        <LazyCanvas camera={cameraConfig} forceVisible={true}>
                            {currentArena.lights()}
                            <Suspense fallback={null}>
                                <CurrentLand key={currentArena.id} />
                            </Suspense>
                        </LazyCanvas>
                    </div>

                    {/* Arena Info Card */}
                    <div style={{ width: "100%", maxWidth: "340px", marginTop: "12px" }}>
                        <ArenaCard side="left" {...currentArena.card} />
                    </div>

                    {/* CTA Button */}
                    <div style={{ marginTop: "16px" }}>
                        <button style={btnStyle}>{currentArena.btnText}</button>
                    </div>

                    {/* Quick Arena Pills */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "340px", marginTop: "16px" }}>
                        {ARENAS_LIST.map((a, i) => (
                            <div
                                key={a.id}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    width: i === activeIdx ? "20px" : "8px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    background: i === activeIdx ? "#ffe066" : "rgba(255,255,255,0.2)",
                                    boxShadow: i === activeIdx ? "0 0 8px #ffe066" : "none",
                                    transition: "all 0.3s",
                                    cursor: "pointer"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </>
        )
    }

    // Desktop View
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
                <div style={canvasBox("20px", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 15, 10]} intensity={1.5} />
                        <directionalLight position={[-10, 5, -10]} intensity={0.6} />
                        <pointLight position={[0, 22, 0]} intensity={5} color="#ff4500" distance={40} />
                        <Suspense fallback={null}><VolcanoLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("140px", "450px")}>
                    <ArenaCard side="left" {...cards.volcano} />
                </div>
                <div style={btnBox("450px", "20px")}>
                    <button style={btnStyle}> Enter Volcano Arena</button>
                </div>

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
                <div style={cardBox("calc(100vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.snow} />
                </div>
                <div style={{ ...btnBox("calc(100vh - 440px + 430px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Frozen Peaks</button>
                </div>

                {/* ── SCREEN 2 ── */}
                <div style={canvasBox("calc(100vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaff66" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#114400" />
                        <pointLight position={[0, -2, 0]} intensity={1.5} color="#22aa00" distance={30} />
                        <pointLight position={[5, 10, 5]} intensity={2} color="#aaff44" distance={35} />
                        <Suspense fallback={null}><PlantIsland /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(100vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.plant} />
                </div>
                <div style={btnBox("calc(100vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Jungle Isle</button>
                </div>

                <div style={canvasBox("calc(200vh - 500px)", "calc(100vw - 520px)", "500px", "500px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[15, 30, 10]} intensity={2.2} color="#fff5cc" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#aaddff" />
                        <pointLight position={[0, -3, 0]} intensity={2} color="#00ccff" distance={35} />
                        <pointLight position={[-10, 8, -10]} intensity={1.5} color="#ffaa33" distance={40} />
                        <Suspense fallback={null}><IslandLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(200vh - 300px)", "calc(100vw - 870px)")}>
                    <ArenaCard side="right" {...cards.island} />
                </div>
                <div style={{ ...btnBox("calc(200vh - 500px + 510px)", "calc(100vw - 520px)"), width: "500px" }}>
                    <button style={btnStyle}> Enter Island Shores</button>
                </div>

                {/* ── SCREEN 3 ── */}
                <div style={canvasBox("calc(200vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[25, 20, 5]} intensity={2.0} color="#ddeeff" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#aabbcc" />
                        <pointLight position={[0, 15, -10]} intensity={2} color="#c0d0ff" distance={40} />
                        <pointLight position={[0, -2, 0]} intensity={0.8} color="#886633" distance={25} />
                        <Suspense fallback={null}><ColiseumLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(200vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.coliseum} />
                </div>
                <div style={btnBox("calc(200vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter The Coliseum</button>
                </div>

                <div style={canvasBox("calc(300vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffcc77" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.2} color="#331a00" />
                        <pointLight position={[0, -5, 0]} intensity={1.5} color="#ff8800" distance={40} />
                        <pointLight position={[0, 10, -15]} intensity={2} color="#ffaa00" distance={50} />
                        <Suspense fallback={null}><PyramidLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(300vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pyramid} />
                </div>
                <div style={btnBox("calc(300vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Desert Pyramid</button>
                </div>

                {/* ── SCREEN 4 ── */}
                <div style={canvasBox("calc(300vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 25, 15]} intensity={1.3} />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                        <Suspense fallback={null}><CastleFortress /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(300vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.castle} />
                </div>
                <div style={btnBox("calc(300vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Castle Fortress</button>
                </div>

                <div style={canvasBox("calc(400vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 25, 15]} intensity={1.3} />
                        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                        <Suspense fallback={null}><RuinLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(400vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.ruin} />
                </div>
                <div style={btnBox("calc(400vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Ancient Ruins</button>
                </div>

                {/* ── SCREEN 5 ── */}
                <div style={canvasBox("calc(400vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.35} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ccccbb" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.25} color="#223300" />
                        <pointLight position={[0, -2, 0]} intensity={1.5} color="#554433" distance={30} />
                        <pointLight position={[0, 8, 5]} intensity={2} color="#ff8800" distance={35} />
                        <Suspense fallback={null}><MayanTemple /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(400vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.mayan} />
                </div>
                <div style={btnBox("calc(400vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Mayan Temple</button>
                </div>

                <div style={canvasBox("calc(500vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.6} color="#cce0ff" />
                        <pointLight position={[0, -3, 0]} intensity={1.8} color="#fff8ee" distance={35} />
                        <pointLight position={[0, 20, -12]} intensity={2.2} color="#ffe8aa" distance={50} />
                        <Suspense fallback={null}><GreekTemple /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(500vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.greek} />
                </div>
                <div style={btnBox("calc(500vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Greek Temple</button>
                </div>

                {/* ── SCREEN 6 ── */}
                <div style={canvasBox("calc(500vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} />
                        <pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} />
                        <Suspense fallback={null}><PagodaLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(500vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.pagoda} />
                </div>
                <div style={btnBox("calc(500vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Pagoda Tower</button>
                </div>

                <div style={canvasBox("calc(600vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={1.8} color="#ddeeff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" />
                        <pointLight position={[0, -3, 0]} intensity={1.5} color="#ccddee" distance={35} />
                        <pointLight position={[0, 15, -10]} intensity={1.8} color="#eef0ff" distance={45} />
                        <Suspense fallback={null}><PedestalLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(600vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pedestal} />
                </div>
                <div style={btnBox("calc(600vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Stone Pedestal</button>
                </div>

                {/* ── SCREEN 7 ── */}
                <div style={canvasBox("calc(600vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[15, 30, 10]} intensity={2.2} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#aaccff" />
                        <pointLight position={[0, 10, 0]} intensity={2} color="#ddeeff" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.5} color="#ffffff" distance={35} />
                        <Suspense fallback={null}><CathedralLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(600vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.cathedral} />
                </div>
                <div style={btnBox("calc(600vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Santorini</button>
                </div>

                <div style={canvasBox("calc(700vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} />
                        <pointLight position={[0, 12, -8]} intensity={2} color="#ff8800" distance={40} />
                        <Suspense fallback={null}><ToriiLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(700vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.torii} />
                </div>
                <div style={btnBox("calc(700vh - 440px + 450px)", "calc(100vw - 440px)")}>
                    <button style={btnStyle}> Enter Torii Gate</button>
                </div>

                {/* ── SCREEN 8 ── */}
                <div style={canvasBox("calc(700vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={2.0} color="#ddeeff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" />
                        <pointLight position={[0, 10, 0]} intensity={2} color="#bbccee" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.2} color="#99aabb" distance={30} />
                        <Suspense fallback={null}><Castle2Land /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(700vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.castle2} />
                </div>
                <div style={btnBox("calc(700vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Rock Fort</button>
                </div>

                <div style={canvasBox("calc(800vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaffaa" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#113300" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ff5500" distance={35} />
                        <pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} />
                        <Suspense fallback={null}><Pagoda2Land /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(800vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.pagoda2} />
                </div>
                <div style={{ ...btnBox("calc(800vh - 440px + 430px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Jade Pagoda</button>
                </div>

                {/* ── SCREEN 9 ── */}
                <div style={canvasBox("calc(800vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ddbb88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" />
                        <pointLight position={[0, 5, 0]} intensity={2} color="#cc8833" distance={35} />
                        <pointLight position={[0, 12, -8]} intensity={1.5} color="#ffaa44" distance={40} />
                        <Suspense fallback={null}><BarracksLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(800vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.barracks} />
                </div>
                <div style={btnBox("calc(800vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Barracks</button>
                </div>

                <div style={canvasBox("calc(900vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffeeaa" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#bbaa44" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#ffdd44" distance={40} />
                        <pointLight position={[0, 20, -10]} intensity={2} color="#ffcc00" distance={50} />
                        <Suspense fallback={null}><PalaceLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(900vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.palace} />
                </div>
                <div style={{ ...btnBox("calc(900vh - 440px + 450px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter The Palace</button>
                </div>

                {/* ── SCREEN 10 ── */}
                <div style={canvasBox("calc(900vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={1.8} color="#ffcc88" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" />
                        <pointLight position={[0, 5, 0]} intensity={2.5} color="#ff5500" distance={35} />
                        <pointLight position={[0, 12, 5]} intensity={1.8} color="#ffaa44" distance={40} />
                        <Suspense fallback={null}><JapaneseShrine /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(900vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.shrine} />
                </div>
                <div style={btnBox("calc(900vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Japanese Shrine</button>
                </div>

                <div style={canvasBox("calc(1000vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[20, 30, 10]} intensity={3.0} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={1.5} color="#eef5ff" />
                        <directionalLight position={[0, -10, 15]} intensity={1.0} color="#cce0ff" />
                        <pointLight position={[0, 10, 5]} intensity={4} color="#ffffff" distance={50} />
                        <Suspense fallback={null}><DeadForest /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1000vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.deadforest} />
                </div>
                <div style={{ ...btnBox("calc(1000vh - 440px + 450px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Dead Winter Forest</button>
                </div>

                {/* ── SCREEN 11 ── */}
                <div style={canvasBox("calc(1000vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffeeaa" />
                        <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#ffcc66" />
                        <pointLight position={[0, 10, 0]} intensity={2.5} color="#ffdd44" distance={40} />
                        <pointLight position={[0, -3, 5]} intensity={1.2} color="#ff8800" distance={25} />
                        <Suspense fallback={null}><TempleLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1000vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.temple} />
                </div>
                <div style={btnBox("calc(1000vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Saint Basil's</button>
                </div>

                <div style={canvasBox("calc(1100vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[20, 30, 10]} intensity={2.2} color="#ffffff" />
                        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#ddeeff" />
                        <pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" distance={35} />
                        <pointLight position={[0, 15, -8]} intensity={1.5} color="#eeeeff" distance={40} />
                        <Suspense fallback={null}><ArchwayLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1100vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.archway} />
                </div>
                <div style={{ ...btnBox("calc(1100vh - 440px + 450px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Arc de Triomphe</button>
                </div>

                {/* ── SCREEN 12 ── */}
                <div style={canvasBox("calc(1100vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[15, 25, 10]} intensity={1.5} color="#ffeeaa" />
                        <directionalLight position={[-10, 5, -10]} intensity={0.2} color="#332200" />
                        <Suspense fallback={null}><NecroLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1100vh + 140px)", "450px")}>
                    <ArenaCard side="left" {...cards.necro} />
                </div>
                <div style={btnBox("calc(1100vh + 450px)", "20px")}>
                    <button style={btnStyle}> Enter Necropolis</button>
                </div>

                <div style={canvasBox("calc(1200vh - 440px)", "calc(100vw - 440px)")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={0.9} />
                        <directionalLight position={[8, 15, 8]} intensity={0.8} color="#99aabb" />
                        <directionalLight position={[-8, 10, -8]} intensity={0.5} color="#667788" />
                        <Suspense fallback={null}><CemeteryLand /></Suspense>
                    </LazyCanvas>
                </div>
                <div style={cardBox("calc(1200vh - 300px)", "calc(100vw - 790px)")}>
                    <ArenaCard side="right" {...cards.cemetery} />
                </div>
                <div style={{ ...btnBox("calc(1200vh - 440px + 450px)", "calc(100vw - 440px)") }}>
                    <button style={btnStyle}> Enter Cemetery</button>
                </div>

                {/* ── SCREEN 13 ── */}
                <div style={canvasBox("calc(1200vh + 20px)", "20px")}>
                    <LazyCanvas camera={cameraConfig}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffffff" />
                        <directionalLight position={[-10, 10, -10]} intensity={1.0} color="#aaccff" />
                        <pointLight position={[0, 5, 0]} intensity={3} color="#44aaff" distance={30} />
                        <Suspense fallback={null}><PillarsLand /></Suspense>
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