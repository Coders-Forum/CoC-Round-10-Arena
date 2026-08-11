import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"

export default function LazyCanvas({ children, style, camera, forceVisible = false, ...props }) {
    const containerRef = useRef()
    const [visible, setVisible] = useState(forceVisible)

    useEffect(() => {
        if (forceVisible) {
            setVisible(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting)
            },
            { rootMargin: "600px" }
        )

        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [forceVisible])

    const isMounted = forceVisible || visible

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {isMounted && (
                <Canvas
                    camera={camera}
                    dpr={[1, 1]}
                    gl={{
                        antialias: false,
                        powerPreference: "default",
                        alpha: true,
                        failIfMajorPerformanceCaveat: false
                    }}
                    style={{ background: "transparent" }}
                    {...props}
                >
                    {children}
                </Canvas>
            )}
        </div>
    )
}