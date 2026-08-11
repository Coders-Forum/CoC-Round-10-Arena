import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"

export default function LazyCanvas({ children, style, camera, ...props }) {
    const containerRef = useRef()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Once visible, NEVER unmount — keeps model in GPU memory
                if (entry.isIntersecting) setVisible(true)
            },
            { rootMargin: "1200px" } // start loading ~1 full screen before entering viewport
        )

        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {visible && (
                <Canvas
                    camera={camera}
                    dpr={[1, 1]}
                    gl={{
                        antialias: false,
                        powerPreference: "high-performance",
                        alpha: true
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