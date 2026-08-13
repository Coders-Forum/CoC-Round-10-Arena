import { useRef, useState, useEffect, Component } from "react"
import { Canvas } from "@react-three/fiber"

// ─────────────────────────────────────────────────────────────────────
// Global WebGL Support Detection (runs once)
// ─────────────────────────────────────────────────────────────────────
let _webglSupported = null
function isWebGLSupported() {
    if (_webglSupported !== null) return _webglSupported
    try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        _webglSupported = !!ctx
        if (ctx && ctx.getExtension) ctx.getExtension("WEBGL_lose_context")?.loseContext()
    } catch (e) {
        _webglSupported = false
    }
    return _webglSupported
}

// ─────────────────────────────────────────────────────────────────────
// Global Active Context Counter — browsers cap at ~8-16 active WebGL contexts
// ─────────────────────────────────────────────────────────────────────
let activeContextCount = 0
const MAX_CONTEXTS = 6 // Conservative limit to prevent context exhaustion

// ─────────────────────────────────────────────────────────────────────
// Error Boundary — catches synchronous React render errors from Canvas
// ─────────────────────────────────────────────────────────────────────
class WebGLErrorBoundary extends Component {
    state = { hasError: false }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error) {
        console.warn("[WebGL] Renderer initialization warning:", error?.message || error)
    }
    render() {
        if (this.state.hasError) {
            return <FallbackPlaceholder message="3D view unavailable" />
        }
        return this.props.children
    }
}

// ─────────────────────────────────────────────────────────────────────
// Fallback Placeholder — shown when WebGL is unavailable or context limit hit
// ─────────────────────────────────────────────────────────────────────
function FallbackPlaceholder({ message = "3D Arena View" }) {
    return (
        <div style={{
            width: "100%", height: "100%", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "8px",
            color: "#777", fontSize: "12px",
            border: "1px dashed #333",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase"
        }}>
            <span style={{ fontSize: "24px", opacity: 0.4 }}>⚔</span>
            <span>{message}</span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────
// LazyCanvas — Lazy-mounted, context-limited WebGL canvas
// ─────────────────────────────────────────────────────────────────────
export default function LazyCanvas({ children, style, camera, forceVisible = false, ...props }) {
    const containerRef = useRef()
    const [inViewport, setInViewport] = useState(forceVisible)
    const [contextLost, setContextLost] = useState(false)
    const [hasSlot, setHasSlot] = useState(false)

    // IntersectionObserver: only consider mounting when near viewport
    useEffect(() => {
        if (forceVisible) {
            setInViewport(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInViewport(entry.isIntersecting)
            },
            { rootMargin: "200px 0px" }
        )

        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [forceVisible])

    // Context slot management: claim a slot when in viewport, release when leaving
    useEffect(() => {
        if (inViewport && !contextLost && activeContextCount < MAX_CONTEXTS) {
            activeContextCount++
            setHasSlot(true)
            return () => {
                activeContextCount--
                setHasSlot(false)
            }
        } else {
            setHasSlot(false)
        }
    }, [inViewport, contextLost])

    // Don't attempt Canvas at all if WebGL is unsupported
    if (!isWebGLSupported()) {
        return (
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
                <FallbackPlaceholder message="WebGL not supported" />
            </div>
        )
    }

    const shouldMount = (forceVisible || (inViewport && hasSlot)) && !contextLost

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {shouldMount ? (
                <WebGLErrorBoundary>
                    <Canvas
                        camera={camera}
                        dpr={[1, 1.5]}
                        gl={{
                            antialias: false,
                            powerPreference: "default",
                            alpha: true,
                            stencil: false,
                            depth: true,
                            failIfMajorPerformanceCaveat: false,
                            preserveDrawingBuffer: false
                        }}
                        onCreated={({ gl }) => {
                            const canvasEl = gl.domElement
                            if (canvasEl) {
                                canvasEl.addEventListener("webglcontextlost", (e) => {
                                    e.preventDefault()
                                    console.warn("[WebGL] Context lost, will attempt recovery...")
                                    setContextLost(true)
                                    setTimeout(() => setContextLost(false), 2000)
                                }, false)
                            }
                        }}
                        style={{ background: "transparent" }}
                        {...props}
                    >
                        {children}
                    </Canvas>
                </WebGLErrorBoundary>
            ) : (
                inViewport && !hasSlot && !contextLost
                    ? <FallbackPlaceholder message="Loading 3D..." />
                    : null
            )}
        </div>
    )
}