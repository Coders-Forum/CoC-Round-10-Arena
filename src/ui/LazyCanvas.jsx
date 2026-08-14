import { useRef, useState, useEffect, Component } from "react"
import { Canvas } from "@react-three/fiber"

// ─────────────────────────────────────────────────────────────────────
// Safe WebGL Support Detection
// ─────────────────────────────────────────────────────────────────────
let _webglSupported = null
function isWebGLSupported() {
    if (_webglSupported !== null) return _webglSupported
    try {
        const canvas = document.createElement("canvas")
        _webglSupported = !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl2") || canvas.getContext("webgl"))
        )
    } catch (e) {
        _webglSupported = false
    }
    return _webglSupported
}

// ─────────────────────────────────────────────────────────────────────
// Global Active Context Counter — keeps GPU context count safe across browsers
// ─────────────────────────────────────────────────────────────────────
let activeContextCount = 0
const MAX_CONTEXTS = 8

// ─────────────────────────────────────────────────────────────────────
// Error Boundary — catches synchronous React render errors from Canvas
// ─────────────────────────────────────────────────────────────────────
class WebGLErrorBoundary extends Component {
    state = { hasError: false }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error) {
        console.warn("[WebGL] Canvas render warning:", error?.message || error)
    }
    render() {
        if (this.state.hasError) {
            return <FallbackPlaceholder message="3D Arena View" />
        }
        return this.props.children
    }
}

// ─────────────────────────────────────────────────────────────────────
// Fallback Placeholder
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
// LazyCanvas — Persistent DOM wrapper prevents "Node cannot be found" errors
// ─────────────────────────────────────────────────────────────────────
export default function LazyCanvas({ children, style, camera, forceVisible = false, ...props }) {
    const containerRef = useRef()
    const [inViewport, setInViewport] = useState(forceVisible)
    const [contextLost, setContextLost] = useState(false)
    const [hasSlot, setHasSlot] = useState(false)

    useEffect(() => {
        if (forceVisible) {
            setInViewport(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInViewport(entry.isIntersecting)
            },
            { rootMargin: "250px 0px" }
        )

        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [forceVisible])

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

    if (!isWebGLSupported()) {
        return (
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
                <FallbackPlaceholder message="3D Arena View" />
            </div>
        )
    }

    const shouldMount = (forceVisible || (inViewport && hasSlot)) && !contextLost

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Stable persistent wrapper prevents removeChild race conditions */}
            <div style={{ width: "100%", height: "100%", display: shouldMount ? "block" : "none" }}>
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
                                const handleContextLost = (e) => {
                                    e.preventDefault()
                                    setContextLost(true)
                                    setTimeout(() => setContextLost(false), 1500)
                                }
                                canvasEl.addEventListener("webglcontextlost", handleContextLost, false)
                            }
                        }}
                        style={{ background: "transparent" }}
                        {...props}
                    >
                        {children}
                    </Canvas>
                </WebGLErrorBoundary>
            </div>

            {!shouldMount && (
                inViewport && !hasSlot && !contextLost
                    ? <FallbackPlaceholder message="Loading 3D..." />
                    : null
            )}
        </div>
    )
}