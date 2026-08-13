import { useState, useEffect } from "react"

export default function ScrollToTop({ isCarousel = false, activeIdx = 0, onResetCarousel }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const checkScroll = () => {
            const scrollPos =
                window.scrollY ||
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop || 0

            setScrolled(scrollPos > 50)
        }

        checkScroll()

        window.addEventListener("scroll", checkScroll, { passive: true })
        document.addEventListener("scroll", checkScroll, { passive: true })
        window.addEventListener("resize", checkScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", checkScroll)
            document.removeEventListener("scroll", checkScroll)
            window.removeEventListener("resize", checkScroll)
        }
    }, [])

    // Visible if scrolled down on Desktop OR if navigated past Arena 1 on Mobile Carousel
    const isVisible = isCarousel ? activeIdx > 0 : scrolled

    const handleClick = () => {
        try {
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (e) {
            window.scrollTo(0, 0)
        }
        if (document.documentElement) document.documentElement.scrollTop = 0
        if (document.body) document.body.scrollTop = 0

        if (onResetCarousel) {
            onResetCarousel()
        }
    }

    return (
        <button
            onClick={handleClick}
            aria-label="Scroll to top of page"
            title={isCarousel ? "Return to Arena 1" : "Scroll to Top"}
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                padding: "10px 18px",
                borderRadius: "30px",
                background: "rgba(10, 10, 15, 0.92)",
                border: "1.5px solid #ffaa00",
                color: "#ffaa00",
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 0 20px rgba(255, 170, 0, 0.5), inset 0 0 10px rgba(255, 170, 0, 0.15)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
                transform: isVisible ? "scale(1) translateY(0)" : "scale(0.8) translateY(15px)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                zIndex: 99999
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffaa00"
                e.currentTarget.style.color = "#000000"
                e.currentTarget.style.boxShadow = "0 0 28px rgba(255, 170, 0, 0.95)"
                e.currentTarget.style.transform = "scale(1.08) translateY(-2px)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 10, 15, 0.92)"
                e.currentTarget.style.color = "#ffaa00"
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 170, 0, 0.5), inset 0 0 10px rgba(255, 170, 0, 0.15)"
                e.currentTarget.style.transform = isVisible ? "scale(1) translateY(0)" : "scale(0.8) translateY(15px)"
            }}
        >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>▲</span>
            <span>TOP</span>
        </button>
    )
}
