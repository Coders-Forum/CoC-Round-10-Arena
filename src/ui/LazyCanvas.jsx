import { useRef, useState, useEffect, Component } from "react"
import { Canvas, useThree } from "@react-three/fiber"

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
    } catch {
        _webglSupported = false
    }
    return _webglSupported
}

// ─────────────────────────────────────────────────────────────────────
// Active WebGL Context Manager
// Restricts concurrently active WebGL contexts to MAX_CONTEXTS (2)
// Browser limit is 8-16. 2 is well within safe bounds.
// ─────────────────────────────────────────────────────────────────────
let activeContextCount = 0
const MAX_CONTEXTS = 2

// ─────────────────────────────────────────────────────────────────────
// Clean Context & Resource Disposer on Unmount
// ─────────────────────────────────────────────────────────────────────
function ContextDisposer() {
    const { gl, scene } = useThree()

    useEffect(() => {
        return () => {
            try {
                // Safely lose WebGL context to immediately release the GPU context slot
                const ctx = gl?.getContext?.()
                if (ctx) {
                    const loseContextExt = ctx.getExtension?.("WEBGL_lose_context")
                    if (loseContextExt && typeof loseContextExt.loseContext === "function") {
                        loseContextExt.loseContext()
                    }
                }
            } catch {
                // Non-fatal if extension not supported or already lost
            }

            try {
                gl?.dispose?.()
            } catch {
                // Ignore disposal errors on unmount
            }
        }
    }, [gl, scene])

    return null
}

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
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(4px)",
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase"
        }}>
            <span style={{ fontSize: "24px", opacity: 0.35 }}>⚔</span>
            <span style={{ opacity: 0.6 }}>{message}</span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────
// LazyCanvas — Only mounts <Canvas> when in viewport and within context quota
// ─────────────────────────────────────────────────────────────────────
export default function LazyCanvas({ children, style, camera, forceVisible = false, ...props }) {
    const containerRef = useRef(null)
    const [inViewport, setInViewport] = useState(forceVisible)
    const [contextLost, setContextLost] = useState(false)
    const [hasSlot, setHasSlot] = useState(forceVisible)

    // Viewport Intersection Observer
    useEffect(() => {
        if (forceVisible) {
            setInViewport(true)
            return
        }

        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInViewport(entry.isIntersecting)
            },
            {
                root: null,
                rootMargin: "200px 0px 200px 0px",
                threshold: 0.05
            }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [forceVisible])

    // GPU Context Slot Management
    useEffect(() => {
        if (forceVisible) {
            setHasSlot(true)
            return
        }

        let acquired = false
        if (inViewport && !contextLost && activeContextCount < MAX_CONTEXTS) {
            activeContextCount++
            acquired = true
            setHasSlot(true)
        } else if (!inViewport || contextLost) {
            setHasSlot(false)
        }

        return () => {
            if (acquired) {
                activeContextCount = Math.max(0, activeContextCount - 1)
            }
        }
    }, [inViewport, contextLost, forceVisible])

    if (!isWebGLSupported()) {
        return (
            <div ref={containerRef} style={{ width: "100%", height: "100%", ...style }}>
                <FallbackPlaceholder message="3D Arena View" />
            </div>
        )
    }

    const shouldMount = (forceVisible || (inViewport && hasSlot)) && !contextLost

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", ...style }}>
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
                                const handleContextLost = (e) => {
                                    e.preventDefault()
                                    setContextLost(true)
                                    const timer = setTimeout(() => {
                                        setContextLost(false)
                                    }, 1000)
                                    return () => clearTimeout(timer)
                                }
                                canvasEl.addEventListener("webglcontextlost", handleContextLost, { once: true })
                            }
                        }}
                        style={{ background: "transparent" }}
                        {...props}
                    >
                        <ContextDisposer />
                        {children}
                    </Canvas>
                </WebGLErrorBoundary>
            ) : (
                <FallbackPlaceholder message={inViewport ? "Loading 3D..." : "3D Arena"} />
            )}
        </div>
    )
}