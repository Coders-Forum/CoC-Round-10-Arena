import { useEffect, useRef } from "react"

export default function AtmosphericEffects({ effectType = "mist", color = "#ffffff" }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        let animId

        const updateSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        updateSize()
        window.addEventListener("resize", updateSize)

        // Generate ~30 subtle particles
        const count = 30
        const particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 1.0,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: effectType === "snow"
                ? Math.random() * 0.8 + 0.3
                : effectType === "embers"
                ? -(Math.random() * 0.8 + 0.3)
                : (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * Math.PI * 2
        }))

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((p) => {
                p.x += p.speedX
                p.y += p.speedY
                p.pulse += 0.02

                // Screen wrapping
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                const alpha = Math.max(0, Math.min(1, p.opacity + Math.sin(p.pulse) * 0.1))

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)

                if (effectType === "embers") {
                    ctx.fillStyle = `rgba(255, 90, 20, ${alpha * 0.6})`
                } else if (effectType === "snow") {
                    ctx.fillStyle = `rgba(220, 240, 255, ${alpha * 0.7})`
                } else if (effectType === "dust") {
                    ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.5})`
                } else {
                    // mist / default
                    ctx.fillStyle = `rgba(180, 210, 230, ${alpha * 0.35})`
                }
                ctx.fill()
            })

            animId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener("resize", updateSize)
            cancelAnimationFrame(animId)
        }
    }, [effectType, color])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0.7
            }}
        />
    )
}
