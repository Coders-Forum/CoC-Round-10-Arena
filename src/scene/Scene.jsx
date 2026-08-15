import { Suspense, useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { clearSession, SESSION_KEY } from "../utils/sessionSecurity.js"
import { getLandContestUrl, validateContestParams, CONTEST_CONFIG, getLandingPageUrl } from "../config/contestConfig.js"
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
import DynamicBackground from "../ui/DynamicBackground.jsx"
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

// ─────────────────────────────────────────────────────────────────────
// Light model preloading — loads initial arena only to save GPU memory
// ─────────────────────────────────────────────────────────────────────
const base = import.meta.env.BASE_URL
useGLTF.preload(`${base}models/volcano.glb`)

// ─────────────────────────────────────────────────────────────────────
// Arena Data — 25 Updated Topics
// ─────────────────────────────────────────────────────────────────────
const cards = {
    volcano: {
        accentColor: "#ff4500", glowColor: "#ff2200",
        subtitle: "Topic 01: Contiguous Memory", title: "Array Realm",
        description: "Master linear data structures. Traverse indexed elements, search in O(1) random access time, and solve foundational contiguous memory challenges.",
        tags: ["Easy / Medium", "Arrays", "Contiguous"]
    },
    snow: {
        accentColor: "#88ccff", glowColor: "#aaddff",
        subtitle: "Topic 02: Pattern Matching", title: "String Sanctum",
        description: "Process sequences of characters. Solve palindrome checks, anagrams, substring searches, and text parsing algorithms.",
        tags: ["Easy / Medium", "Strings", "Parsing"]
    },
    plant: {
        accentColor: "#44cc44", glowColor: "#22aa00",
        subtitle: "Topic 03: Fast Lookups", title: "Hash Table Isle",
        description: "Harness O(1) average-time complexity lookups. Store key-value pairs, detect duplicates, and solve instant element mapping problems.",
        tags: ["Medium", "Hash Maps", "Constant Time"]
    },
    island: {
        accentColor: "#00ccff", glowColor: "#00aadd",
        subtitle: "Topic 04: Numerical Logic", title: "Math Arena",
        description: "Apply number theory, prime factorization, GCD, modulo arithmetic, and fast exponentiation to solve core numerical problems.",
        tags: ["Easy / Medium", "Mathematics", "Number Theory"]
    },
    coliseum: {
        accentColor: "#c0d0ff", glowColor: "#8899dd",
        subtitle: "Topic 05: Order & Ranking", title: "Sorting Coliseum",
        description: "Order raw data efficiently using QuickSort, MergeSort, and HeapSort. Understand comparative ranking and algorithmic efficiency.",
        tags: ["Medium", "Sorting", "O(N log N)"]
    },
    pyramid: {
        accentColor: "#ffaa00", glowColor: "#ff8800",
        subtitle: "Topic 06: Binary Search", title: "Searching Pyramid",
        description: "Divide and conquer ordered search spaces in O(log N) logarithmic time. Find lower bounds, upper bounds, and optimal answers.",
        tags: ["Medium", "Binary Search", "O(log N)"]
    },
    castle: {
        accentColor: "#9988cc", glowColor: "#6655aa",
        subtitle: "Topic 07: Depth-First Search", title: "DFS Fortress",
        description: "Explore deep into trees and graphs before backtracking. Solve connected components, cycle detection, and topological sorting.",
        tags: ["Hard", "Graph DFS", "Recursion"]
    },
    ruin: {
        accentColor: "#88aa44", glowColor: "#446622",
        subtitle: "Topic 08: Breadth-First Search", title: "BFS Ruins",
        description: "Traverse graphs layer by layer using queues. Find the shortest path in unweighted networks and explore level-order trees.",
        tags: ["Medium / Hard", "Graph BFS", "Shortest Path"]
    },
    mayan: {
        accentColor: "#cc8833", glowColor: "#aa6611",
        subtitle: "Topic 09: SQL & Relations", title: "Database Temple",
        description: "Query structured data with precision. Master joins, indexing, aggregation, subqueries, and relational schema optimization.",
        tags: ["Medium", "SQL", "Database Engine"]
    },
    greek: {
        accentColor: "#fff8ee", glowColor: "#ddcc99",
        subtitle: "Topic 10: 2D Grids", title: "Matrix Shrine",
        description: "Navigate two-dimensional arrays. Solve spiral traversals, grid rotation, matrix dynamic programming, and island counting.",
        tags: ["Hard", "2D Array", "Grid Traversal"]
    },
    pagoda: {
        accentColor: "#cc2200", glowColor: "#ff4400",
        subtitle: "Topic 11: Multi-Pointer Strategy", title: "2 Pointers Pagoda",
        description: "Optimize O(N^2) problems down to O(N) by moving left and right pointers inward across sorted collections.",
        tags: ["Medium", "Two Pointers", "Linear Optimization"]
    },
    pedestal: {
        accentColor: "#aabbcc", glowColor: "#ddeeff",
        subtitle: "Topic 12: Subarray Windows", title: "Sliding Window Pedestal",
        description: "Maintain a dynamic window across contiguous subarrays to track maximum sums, distinct elements, and substring bounds.",
        tags: ["Medium", "Sliding Window", "Subarrays"]
    },
    cathedral: {
        accentColor: "#aaccff", glowColor: "#ffffff",
        subtitle: "Topic 13: LIFO Structure", title: "Stack Citadel",
        description: "Last-In, First-Out memory management. Solve valid parentheses matching, expression evaluation, and monotonic stacks.",
        tags: ["Easy / Medium", "Stack", "LIFO"]
    },
    torii: {
        accentColor: "#ff2200", glowColor: "#ff4400",
        subtitle: "Topic 14: FIFO Structure", title: "Queue Gate",
        description: "First-In, First-Out task scheduling. Implement event buffers, round-robin processing, and sliding window maximums.",
        tags: ["Easy / Medium", "Queue", "FIFO"]
    },
    castle2: {
        accentColor: "#aabbdd", glowColor: "#ccddf0",
        subtitle: "Topic 15: Pointer Nodes", title: "Linked List Fort",
        description: "Manipulate node references directly. Reverse linked lists, detect Floyd's cycle loops, and merge sorted lists.",
        tags: ["Medium", "Linked Lists", "Pointers"]
    },
    pagoda2: {
        accentColor: "#44bb44", glowColor: "#ff6633",
        subtitle: "Topic 16: Structural Logic", title: "Pattern Tower",
        description: "Recognize recurring algorithmic patterns, number pyramids, string symmetry, and geometric code outputs.",
        tags: ["Easy / Medium", "Pattern Matching", "Logic"]
    },
    barracks: {
        accentColor: "#aa7733", glowColor: "#cc9944",
        subtitle: "Topic 17: Self-Referential Logic", title: "Recursion Barracks",
        description: "Break complex problems into smaller subproblems. Master call stacks, base cases, and divide-and-conquer strategies.",
        tags: ["Medium", "Recursion", "Call Stack"]
    },
    palace: {
        accentColor: "#ffdd88", glowColor: "#ffcc44",
        subtitle: "Topic 18: State-Space Search", title: "Backtracking Palace",
        description: "Prune decision trees to find all valid combinations, permutations, N-Queens solutions, and Sudoku solvers.",
        tags: ["Hard / Expert", "Backtracking", "Combinatorics"]
    },
    shrine: {
        accentColor: "#ff6633", glowColor: "#ff4400",
        subtitle: "Topic 19: Binary Arithmetic", title: "Bit Manipulation Shrine",
        description: "Operate at the machine level with AND, OR, XOR, NOT, and bitwise shifts. Solve single number and power-of-two challenges.",
        tags: ["Hard", "Bitwise", "Machine Code"]
    },
    deadforest: {
        accentColor: "#aabbcc", glowColor: "#ddeeff",
        subtitle: "Topic 20: Classified Challenge", title: "Mystery Land",
        description: "Enter the uncharted realm. Face randomized hidden problem sets, mixed constraints, and secret algorithmic trials.",
        tags: ["Expert", "Unknown Topic", "Wildcard"]
    },
    temple: {
        accentColor: "#ffcc44", glowColor: "#ffdd88",
        subtitle: "Topic 21: Unique Collections", title: "Set Sanctuary",
        description: "Maintain unique elements without duplicates. Compute set unions, intersections, and membership checks in constant time.",
        tags: ["Easy / Medium", "Sets", "Uniqueness"]
    },
    archway: {
        accentColor: "#ddccbb", glowColor: "#ffffff",
        subtitle: "Topic 22: Dynamic Programming", title: "DP Monument",
        description: "Store optimal subproblem results using memoization and tabulation. Solve knapsack, memoized DP, and string edit distances.",
        tags: ["Expert", "Dynamic Programming", "Memoization"]
    },
    necro: {
        accentColor: "#ffcc44", glowColor: "#ffaa00",
        subtitle: "Topic 23: Heaps & Priority", title: "Priority Queue Necropolis",
        description: "Manage elements ranked by custom priority using Min-Heaps and Max-Heaps. Solve K-th largest element and Dijkstra's algorithm.",
        tags: ["Hard", "Min/Max Heap", "Priority Queue"]
    },
    cemetery: {
        accentColor: "#44aa44", glowColor: "#226622",
        subtitle: "Topic 24: Range Query Precomputation", title: "Prefix & Suffix Realm",
        description: "Precompute cumulative sum and product arrays for O(1) range queries, product except self, and subarray balance checks.",
        tags: ["Medium", "Prefix Sums", "Range Queries"]
    },
    pillars: {
        accentColor: "#44aaff", glowColor: "#0088ff",
        subtitle: "Topic 25: Locally Optimal Choices", title: "Greedy Pillars",
        description: "Make the locally optimal choice at each step to reach a global optimum. Solve activity selection, interval scheduling, and Huffman coding.",
        tags: ["Hard / Extreme", "Greedy Strategy", "Optimization"]
    },
}

const ARENAS_LIST = [
    { id: "volcano", LandComponent: VolcanoLand, card: cards.volcano, btnText: "Enter Array Realm", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[10, 15, 10]} intensity={1.5} /><directionalLight position={[-10, 5, -10]} intensity={0.6} /><pointLight position={[0, 22, 0]} intensity={5} color="#ff4500" distance={40} /></>) },
    { id: "snow", LandComponent: SnowLand, card: cards.snow, btnText: "Enter String Sanctum", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[20, 15, 5]} intensity={1.8} color="#cce8ff" /><directionalLight position={[-10, 10, -10]} intensity={0.5} color="#99ccff" /><pointLight position={[0, -3, 0]} intensity={1.5} color="#ddeeff" distance={30} /><pointLight position={[0, 10, -15]} intensity={1.2} color="#aabbdd" distance={40} /></>) },
    { id: "plant", LandComponent: PlantIsland, card: cards.plant, btnText: "Enter Hash Table Isle", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaff66" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#114400" /><pointLight position={[0, -2, 0]} intensity={1.5} color="#22aa00" distance={30} /><pointLight position={[5, 10, 5]} intensity={2} color="#aaff44" distance={35} /></>) },
    { id: "island", LandComponent: IslandLand, card: cards.island, btnText: "Enter Math Arena", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[15, 30, 10]} intensity={2.2} color="#fff5cc" /><directionalLight position={[-10, 10, -10]} intensity={0.4} color="#aaddff" /><pointLight position={[0, -3, 0]} intensity={2} color="#00ccff" distance={35} /><pointLight position={[-10, 8, -10]} intensity={1.5} color="#ffaa33" distance={40} /></>) },
    { id: "coliseum", LandComponent: ColiseumLand, card: cards.coliseum, btnText: "Enter Sorting Coliseum", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[25, 20, 5]} intensity={2.0} color="#ddeeff" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#aabbcc" /><pointLight position={[0, 15, -10]} intensity={2} color="#c0d0ff" distance={40} /><pointLight position={[0, -2, 0]} intensity={0.8} color="#886633" distance={25} /></>) },
    { id: "pyramid", LandComponent: PyramidLand, card: cards.pyramid, btnText: "Enter Searching Pyramid", lights: () => (<><ambientLight intensity={0.3} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffcc77" /><directionalLight position={[-10, 5, -10]} intensity={0.2} color="#331a00" /><pointLight position={[0, -5, 0]} intensity={1.5} color="#ff8800" distance={40} /><pointLight position={[0, 10, -15]} intensity={2} color="#ffaa00" distance={50} /></>) },
    { id: "castle", LandComponent: CastleFortress, card: cards.castle, btnText: "Enter DFS Fortress", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 25, 15]} intensity={1.3} /><directionalLight position={[-10, 10, -10]} intensity={0.5} /></>) },
    { id: "ruin", LandComponent: RuinLand, card: cards.ruin, btnText: "Enter BFS Ruins", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 25, 15]} intensity={1.3} /><directionalLight position={[-10, 10, -10]} intensity={0.5} /></>) },
    { id: "mayan", LandComponent: MayanTemple, card: cards.mayan, btnText: "Enter Database Temple", lights: () => (<><ambientLight intensity={0.35} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ccccbb" /><directionalLight position={[-10, 5, -10]} intensity={0.25} color="#223300" /><pointLight position={[0, -2, 0]} intensity={1.5} color="#554433" distance={30} /><pointLight position={[0, 8, 5]} intensity={2} color="#ff8800" distance={35} /></>) },
    { id: "greek", LandComponent: GreekTemple, card: cards.greek, btnText: "Enter Matrix Shrine", lights: () => (<><ambientLight intensity={0.7} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.6} color="#cce0ff" /><pointLight position={[0, -3, 0]} intensity={1.8} color="#fff8ee" distance={35} /><pointLight position={[0, 20, -12]} intensity={2.2} color="#ffe8aa" distance={50} /></>) },
    { id: "pagoda", LandComponent: PagodaLand, card: cards.pagoda, btnText: "Enter 2 Pointers Pagoda", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} /><pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} /></>) },
    { id: "pedestal", LandComponent: PedestalLand, card: cards.pedestal, btnText: "Enter Sliding Window Pedestal", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={1.8} color="#ddeeff" /><directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" /><pointLight position={[0, -3, 0]} intensity={1.5} color="#ccddee" distance={35} /><pointLight position={[0, 15, -10]} intensity={1.8} color="#eef0ff" distance={45} /></>) },
    { id: "cathedral", LandComponent: CathedralLand, card: cards.cathedral, btnText: "Enter Stack Citadel", lights: () => (<><ambientLight intensity={0.8} /><directionalLight position={[15, 30, 10]} intensity={2.2} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#aaccff" /><pointLight position={[0, 10, 0]} intensity={2} color="#ddeeff" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.5} color="#ffffff" distance={35} /></>) },
    { id: "torii", LandComponent: ToriiLand, card: cards.torii, btnText: "Enter Queue Gate", lights: () => (<><ambientLight intensity={0.4} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#330000" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff4400" distance={35} /><pointLight position={[0, 12, -8]} intensity={2} color="#ff8800" distance={40} /></>) },
    { id: "castle2", LandComponent: Castle2Land, card: cards.castle2, btnText: "Enter Linked List Fort", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={2.0} color="#ddeeff" /><directionalLight position={[-10, 15, -10]} intensity={0.4} color="#aabbcc" /><pointLight position={[0, 10, 0]} intensity={2} color="#bbccee" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.2} color="#99aabb" distance={30} /></>) },
    { id: "pagoda2", LandComponent: Pagoda2Land, card: cards.pagoda2, btnText: "Enter Pattern Tower", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#aaffaa" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#113300" /><pointLight position={[0, 5, 0]} intensity={3} color="#ff5500" distance={35} /><pointLight position={[0, 15, 5]} intensity={2} color="#ffaa00" distance={40} /></>) },
    { id: "barracks", LandComponent: BarracksLand, card: cards.barracks, btnText: "Enter Recursion Barracks", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ddbb88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" /><pointLight position={[0, 5, 0]} intensity={2} color="#cc8833" distance={35} /><pointLight position={[0, 12, -8]} intensity={1.5} color="#ffaa44" distance={40} /></>) },
    { id: "palace", LandComponent: PalaceLand, card: cards.palace, btnText: "Enter Backtracking Palace", lights: () => (<><ambientLight intensity={0.6} /><directionalLight position={[20, 30, 10]} intensity={2.5} color="#ffeeaa" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#bbaa44" /><pointLight position={[0, 5, 0]} intensity={3} color="#ffdd44" distance={40} /><pointLight position={[0, 20, -10]} intensity={2} color="#ffcc00" distance={50} /></>) },
    { id: "shrine", LandComponent: JapaneseShrine, card: cards.shrine, btnText: "Enter Bit Manipulation Shrine", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={1.8} color="#ffcc88" /><directionalLight position={[-10, 5, -10]} intensity={0.3} color="#221100" /><pointLight position={[0, 5, 0]} intensity={2.5} color="#ff5500" distance={35} /><pointLight position={[0, 12, 5]} intensity={1.8} color="#ffaa44" distance={40} /></>) },
    { id: "deadforest", LandComponent: DeadForest, card: cards.deadforest, btnText: "Enter Mystery Land", lights: () => (<><ambientLight intensity={1.2} /><directionalLight position={[20, 30, 10]} intensity={3.0} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={1.5} color="#eef5ff" /><directionalLight position={[0, -10, 15]} intensity={1.0} color="#cce0ff" /><pointLight position={[0, 10, 5]} intensity={4} color="#ffffff" distance={50} /></>) },
    { id: "temple", LandComponent: TempleLand, card: cards.temple, btnText: "Enter Set Sanctuary", lights: () => (<><ambientLight intensity={0.5} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffeeaa" /><directionalLight position={[-10, 10, -10]} intensity={0.4} color="#ffcc66" /><pointLight position={[0, 10, 0]} intensity={2.5} color="#ffdd44" distance={40} /><pointLight position={[0, -3, 5]} intensity={1.2} color="#ff8800" distance={25} /></>) },
    { id: "archway", LandComponent: ArchwayLand, card: cards.archway, btnText: "Enter DP Monument", lights: () => (<><ambientLight intensity={0.7} /><directionalLight position={[20, 30, 10]} intensity={2.2} color="#ffffff" /><directionalLight position={[-10, 15, -10]} intensity={0.5} color="#ddeeff" /><pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" distance={35} /><pointLight position={[0, 15, -8]} intensity={1.5} color="#eeeeff" distance={40} /></>) },
    { id: "necro", LandComponent: NecroLand, card: cards.necro, btnText: "Enter Priority Queue Necropolis", lights: () => (<><ambientLight intensity={0.3} /><directionalLight position={[15, 25, 10]} intensity={1.5} color="#ffeeaa" /><directionalLight position={[-10, 5, -10]} intensity={0.2} color="#332200" /></>) },
    { id: "cemetery", LandComponent: CemeteryLand, card: cards.cemetery, btnText: "Enter Prefix/Suffix Realm", lights: () => (<><ambientLight intensity={0.9} /><directionalLight position={[8, 15, 8]} intensity={0.8} color="#99aabb" /><directionalLight position={[-8, 10, -8]} intensity={0.5} color="#667788" /></>) },
    { id: "pillars", LandComponent: PillarsLand, card: cards.pillars, btnText: "Enter Greedy Pillars", lights: () => (<><ambientLight intensity={1.2} /><directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffffff" /><directionalLight position={[-10, 10, -10]} intensity={1.0} color="#aaccff" /><pointLight position={[0, 5, 0]} intensity={3} color="#44aaff" distance={30} /></>) },
]

const CAROUSEL_BREAKPOINT = 1024

// ─────────────────────────────────────────────────────────────────────
// Desktop Scroll Layout — with IntersectionObserver background switching
// ─────────────────────────────────────────────────────────────────────
function DesktopScrollLayout() {
    const cameraConfig = { position: [25, 20, 25], fov: 35, near: 0.1, far: 2000 }
    const sectionRefs = useRef([])
    const [activeLandIdx, setActiveLandIdx] = useState(0)
    const location = useLocation()
    const { round, phase } = validateContestParams(location.search)

    const handleEnterLand = (landKey) => {
        const url = getLandContestUrl(round, phase, landKey)
        window.open(url, "_blank", "noopener,noreferrer")
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"))
                        if (!isNaN(index)) {
                            setActiveLandIdx(index)
                        }
                    }
                })
            },
            {
                root: null,
                rootMargin: "-25% 0px -25% 0px",
                threshold: 0.15
            }
        )

        sectionRefs.current.forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    const currentLandId = ARENAS_LIST[activeLandIdx]?.id || "volcano"

    return (
        <>
            {/* Dynamic Environmental Background System */}
            <DynamicBackground activeLandId={currentLandId} />

            <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                {ARENAS_LIST.map((arena, idx) => {
                    const LandComp = arena.LandComponent
                    const isEven = idx % 2 === 0
                    const nextArena = idx < ARENAS_LIST.length - 1 ? ARENAS_LIST[idx + 1].card.title : null
                    const accent = arena.card.accentColor
                    const glow = arena.card.glowColor

                    return (
                        <div
                            key={arena.id}
                            data-index={idx}
                            ref={(el) => { sectionRefs.current[idx] = el }}
                            style={{
                                minHeight: "100vh",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "40px 5%",
                                boxSizing: "border-box",
                                position: "relative"
                            }}
                        >
                            {/* Per-section subtle glow overlay */}
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: `radial-gradient(ellipse at ${isEven ? "30%" : "70%"} 50%, ${glow}14 0%, transparent 55%)`,
                                pointerEvents: "none"
                            }} />

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "60px",
                                width: "100%",
                                maxWidth: "1200px",
                                flexDirection: isEven ? "row" : "row-reverse",
                                position: "relative",
                                zIndex: 1
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
                                    <a
                                        href={getLandContestUrl(round, phase, arena.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-block",
                                            background: "rgba(0,0,0,0.85)",
                                            border: `1px solid ${accent}`,
                                            borderRadius: "30px",
                                            padding: "14px 32px",
                                            color: "#ffffff",
                                            fontFamily: "'Clash Display', sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "bold",
                                            letterSpacing: "2px",
                                            cursor: "pointer",
                                            textTransform: "uppercase",
                                            textDecoration: "none",
                                            boxShadow: `0 0 16px ${glow}66, 0 0 32px ${glow}33`,
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        {arena.btnText}
                                    </a>
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
        </>
    )
}

// ─────────────────────────────────────────────────────────────────────
// Carousel Layout — with dynamic background layer
// ─────────────────────────────────────────────────────────────────────
function CarouselLayout() {
    const [activeIdx, setActiveIdx] = useState(0)
    const touchStartX = useRef(0)
    const location = useLocation()
    const { round, phase } = validateContestParams(location.search)

    const handleEnterLand = (landKey) => {
        const url = getLandContestUrl(round, phase, landKey)
        window.open(url, "_blank", "noopener,noreferrer")
    }

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
                overflowX: "hidden",
                position: "relative"
            }}
        >
            {/* Dynamic Environmental Background System */}
            <DynamicBackground activeLandId={currentArena.id} />

            <div style={{
                width: "100%", maxWidth: "600px",
                display: "flex", flexDirection: "column", alignItems: "center",
                zIndex: 2, position: "relative", gap: "16px", marginTop: "32px"
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
                        color: "#fff", fontFamily: "'Clash Display', sans-serif",
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
                    <a
                        href={getLandContestUrl(round, phase, currentArena.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            background: "rgba(0,0,0,0.85)", border: `1px solid ${accent}`,
                            borderRadius: "30px", padding: "12px 28px", color: "#fff",
                            fontFamily: "'Clash Display', sans-serif", fontSize: "12px", fontWeight: "bold",
                            letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase",
                            textDecoration: "none",
                            boxShadow: `0 0 16px ${glow}66, 0 0 32px ${glow}33`,
                            transition: "all 0.3s ease"
                        }}
                    >
                        {currentArena.btnText}
                    </a>
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
// Dedicated Round 0 (GFG External) View
// ─────────────────────────────────────────────────────────────────────
function Round0GFGView() {
    const gfgUrl = CONTEST_CONFIG.round0?.contestUrl || "https://practice.geeksforgeeks.org/contest/clash-of-coders-round0"

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
            backgroundColor: "#0B0F1A",
            color: "#fff",
            fontFamily: "'Clash', 'Clash Display', sans-serif",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(255, 196, 81, 0.12) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0
            }} />

            <div style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "520px",
                width: "100%",
                padding: "44px 32px",
                borderRadius: "20px",
                background: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255, 196, 81, 0.3)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255, 196, 81, 0.15)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)"
            }}>
                <div style={{
                    display: "inline-block",
                    padding: "5px 16px",
                    borderRadius: "100px",
                    background: "rgba(255, 196, 81, 0.15)",
                    border: "1px solid rgba(255, 196, 81, 0.4)",
                    color: "#FFC451",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "18px"
                }}>
                    ROUND 0 · ONLINE GFG
                </div>

                <h1 style={{
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#FFFFFF",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                    textShadow: "0 0 20px rgba(255, 196, 81, 0.3)"
                }}>
                    ROUND 0 IS LIVE ⚔
                </h1>

                <p style={{
                    color: "#9CA3AF",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    marginBottom: "30px"
                }}>
                    Round 0 is hosted externally on GeeksforGeeks. Click below to enter the official contest arena and solve the preliminary challenges.
                </p>

                <a
                    href={gfgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        background: "#FFC451",
                        color: "#000000",
                        fontWeight: "800",
                        fontSize: "15px",
                        letterSpacing: "0.08em",
                        padding: "16px 36px",
                        borderRadius: "50px",
                        textDecoration: "none",
                        boxShadow: "0 0 25px rgba(255, 196, 81, 0.45)",
                        transition: "all 0.25s ease",
                        cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.04)"
                        e.currentTarget.style.boxShadow = "0 0 35px rgba(255, 196, 81, 0.7)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 196, 81, 0.45)"
                    }}
                >
                    <span>ENTER ROUND 0 ON GFG</span>
                    <span style={{ fontSize: "18px" }}>↗</span>
                </a>

                <p style={{
                    color: "#6B7280",
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    marginTop: "22px"
                }}>
                    * Official challenge link will open in a new tab
                </p>

                <div style={{ marginTop: "24px" }}>
                    <a
                        href={getLandingPageUrl("?round=0")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#FFC451",
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textDecoration: "none",
                            padding: "8px 18px",
                            borderRadius: "100px",
                            background: "rgba(255,196,81,0.08)",
                            border: "1px solid rgba(255,196,81,0.25)",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <span>←</span>
                        <span>BACK TO LANDING PAGE</span>
                    </a>
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
    const [accessState, setAccessState] = useState({
        checking: true,
        allowed: true,
        message: "",
        activeStage: "round1"
    })

    const navigate = useNavigate()
    const location = useLocation()
    const { round } = validateContestParams(location.search)

    const handleLogout = () => {
        clearSession()
        const validated = validateContestParams(location.search)
        navigate(`/login${validated.queryString}`, { state: { reason: "logout" } })
    }

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${CAROUSEL_BREAKPOINT - 1}px)`)
        const handler = (e) => setIsSmallScreen(e.matches)
        mq.addEventListener("change", handler)
        setIsSmallScreen(mq.matches)
        return () => mq.removeEventListener("change", handler)
    }, [])

    // ── Backend Stage & Eligibility Verification ──
    useEffect(() => {
        let isMounted = true
        async function verifyStageAccess() {
            const token = sessionStorage.getItem(SESSION_KEY)
            const { round, phase } = validateContestParams(location.search)
            const apiUrl = import.meta.env.VITE_API_URL !== undefined
                ? import.meta.env.VITE_API_URL
                : (import.meta.env.DEV ? "http://localhost:5000" : "");

            try {
                const res = await fetch(`${apiUrl}/api/contest/verify-access`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Session-Token": token || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({ round, phase }),
                })

                const data = await res.json()

                if (isMounted) {
                    if (data.allowed) {
                        setAccessState({
                            checking: false,
                            allowed: true,
                            message: "",
                            activeStage: data.activeStage || "round1"
                        })
                    } else {
                        setAccessState({
                            checking: false,
                            allowed: false,
                            message: data.message || "The requested contest stage is not currently active.",
                            activeStage: data.activeStage || "round1"
                        })
                    }
                }
            } catch {
                // Backend is unreachable — only allow round1 (the default stage)
                // Deny access if the user navigated to any other round/phase
                if (isMounted) {
                    const { round: r, phase: p } = validateContestParams(location.search)
                    const isDefaultStage = r === "1" && !p
                    setAccessState({
                        checking: false,
                        allowed: isDefaultStage,
                        message: isDefaultStage
                            ? ""
                            : "Cannot verify contest stage (server unreachable). Please contact an organizer.",
                        activeStage: "round1"
                    })
                }
            }
        }

        verifyStageAccess()
        return () => { isMounted = false }
    }, [location.search])

    function getStageQuery(stage) {
        switch (stage) {
            case "round0": return "?round=0"
            case "round2_phase1": return "?round=2&phase=1"
            case "round2_phase2": return "?round=2&phase=2"
            case "round2_phase3": return "?round=2&phase=3"
            default: return "?round=1"
        }
    }

    return (
        <>
            {/* Unified Fixed Top Header with Clean Logout for Both Desktop and Mobile */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isSmallScreen ? "12px 14px" : "14px 32px",
                background: "linear-gradient(180deg, rgba(17,24,39,0.85) 0%, rgba(17,24,39,0.3) 70%, transparent 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                fontFamily: "'Clash', 'Clash Display', sans-serif",
                pointerEvents: "auto"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                        background: "#FFC451",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "3px 10px",
                        borderRadius: "100px",
                        letterSpacing: "0.15em",
                        boxShadow: "0 0 12px rgba(255,196,81,0.35)"
                    }}>
                        COC
                    </span>
                    <span style={{
                        color: "#FFC451",
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: "0.2em",
                        textShadow: "0 0 16px rgba(255,196,81,0.25)"
                    }}>
                        {round === "0" ? "ROUND 0" : "3D ARENA"}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a
                        href={getLandingPageUrl(location.search)}
                        title="Return to Main Landing Page"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(255,196,81,0.08)",
                            border: "1px solid rgba(255,196,81,0.3)",
                            color: "#FFC451",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.12em",
                            padding: "6px 14px",
                            borderRadius: "100px",
                            textDecoration: "none",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#FFC451"
                            e.currentTarget.style.background = "rgba(255,196,81,0.2)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,196,81,0.3)"
                            e.currentTarget.style.background = "rgba(255,196,81,0.08)"
                        }}
                    >
                        <span>←</span>
                        <span>LANDING PAGE</span>
                    </a>

                    <button
                        onClick={handleLogout}
                        title="Logout from arena"
                        aria-label="Logout"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(0,0,0,0.5)",
                            border: "1px solid rgba(255,196,81,0.25)",
                            color: "#FFC451",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.12em",
                            padding: "6px 14px",
                            borderRadius: "100px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.4)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#DC2626"
                            e.currentTarget.style.background = "rgba(220,38,38,0.25)"
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(220,38,38,0.35)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,196,81,0.25)"
                            e.currentTarget.style.background = "rgba(0,0,0,0.5)"
                            e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.4)"
                        }}
                    >
                        <span style={{ fontSize: "12px", opacity: 0.85 }}>🚪</span>
                        <span>LOGOUT</span>
                    </button>
                </div>
            </header>

            {/* ── ACCESS DENIED / INACTIVE STAGE OVERLAY ── */}
            {!accessState.checking && !accessState.allowed ? (
                <div style={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    boxSizing: "border-box",
                    backgroundColor: "#0B0F1A",
                    color: "#fff",
                    fontFamily: "'Clash', 'Clash Display', sans-serif",
                    textAlign: "center"
                }}>
                    <div style={{
                        maxWidth: "480px",
                        padding: "36px 28px",
                        borderRadius: "16px",
                        background: "rgba(17, 24, 39, 0.85)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.2)"
                    }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
                        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#EF4444", marginBottom: "12px", letterSpacing: "1px" }}>
                            STAGE NOT ACTIVE
                        </h2>
                        <p style={{ color: "#D1D5DB", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                            {accessState.message}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                            <button
                                onClick={() => navigate(`/login${getStageQuery(accessState.activeStage)}`, { replace: true })}
                                style={{
                                    width: "100%",
                                    background: "#FFC451",
                                    color: "#000",
                                    fontWeight: "800",
                                    fontSize: "14px",
                                    padding: "14px 28px",
                                    borderRadius: "30px",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 0 20px rgba(255,196,81,0.4)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                LOGIN TO ACTIVE STAGE →
                            </button>

                            <a
                                href={getLandingPageUrl(location.search)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "#9CA3AF",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    textDecoration: "none",
                                    padding: "8px 16px",
                                    borderRadius: "100px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>←</span>
                                <span>BACK TO LANDING PAGE</span>
                            </a>
                        </div>
                    </div>
                </div>
            ) : round === "0" ? (
                <Round0GFGView />
            ) : (
                isSmallScreen ? <CarouselLayout /> : <DesktopScrollLayout />
            )}
        </>
    )
}