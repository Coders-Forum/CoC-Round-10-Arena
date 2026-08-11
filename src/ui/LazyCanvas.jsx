import { useRef, useState, useEffect, Component } from "react"
import { Canvas } from "@react-three/fiber"

class WebGLErrorBoundary extends Component {
    state = { hasError: false }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error) {
        console.warn("WebGL context failed to initialize:", error)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    width: "100%", height: "100%", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#888", fontSize: "12px", border: "1px dashed #444",
                    borderRadius: "8px", background: "rgba(0,0,0,0.3)"
                }}>
                    3D Arena View
                </div>
            )
        }
        return this.props.children
    }
}

export default function LazyCanvas({ children, style, camera, forceVisible = false, ...props }) {
    const containerRef = useRef()
    const [visible, setVisible] = useState(forceVisible)
    const [contextLost, setContextLost] = useState(false)

    useEffect(() => {
        if (forceVisible) {
            setVisible(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting)
            },
            { rootMargin: "150px 0px" } // Only mount when close to viewport to save WebGL contexts
        )

        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [forceVisible])

    const isMounted = (forceVisible || visible) && !contextLost

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {isMounted && (
                <WebGLErrorBoundary>
                    <Canvas
                        camera={camera}
                        dpr={[1, 1]}
                        gl={{
                            antialias: false,
                            powerPreference: "low-power",
                            alpha: true,
                            failIfMajorPerformanceCaveat: false,
                            preserveDrawingBuffer: false
                        }}
                        onCreated={({ gl }) => {
                            const canvasEl = gl.domElement
                            if (canvasEl) {
                                canvasEl.addEventListener("webglcontextlost", (e) => {
                                    e.preventDefault()
                                    setContextLost(true)
                                    // Try recovering context after brief delay
                                    setTimeout(() => setContextLost(false), 1000)
                                }, false)
                            }
                        }}
                        style={{ background: "transparent" }}
                        {...props}
                    >
                        {children}
                    </Canvas>
                </WebGLErrorBoundary>
            )}
        </div>
    )
}