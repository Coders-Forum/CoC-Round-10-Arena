import { useState, useEffect } from "react"

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const checkScroll = () => {
            const scrollPos =
                window.scrollY ||
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop || 0

            setVisible(scrollPos > 150)
        }

        // Initial check in case page reloaded scrolled down
        checkScroll()

        window.addEventListener("scroll", checkScroll, { passive: true })
        document.addEventListener("scroll", checkScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", checkScroll)
            document.removeEventListener("scroll", checkScroll)
        }
    }, [])

    const handleScrollToTop = () => {
        try {
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (e) {
            window.scrollTo(0, 0)
        }
        if (document.documentElement) document.documentElement.scrollTop = 0
        if (document.body) document.body.scrollTop = 0
    }

    return (
        <button
            onClick={handleScrollToTop}
            aria-label="Scroll to top of page"
            title="Scroll to top"
            style={{
                position: "fixed",
                bottom: "32px",
                right: "32px",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(10, 10, 15, 0.9)",
                border: "2px solid #ffaa00",
                color: "#ffaa00",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(255, 170, 0, 0.5), inset 0 0 12px rgba(255, 170, 0, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                zIndex: 99999
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffaa00"
                e.currentTarget.style.color = "#000000"
                e.currentTarget.style.boxShadow = "0 0 28px rgba(255, 170, 0, 0.95)"
                e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 10, 15, 0.9)"
                e.currentTarget.style.color = "#ffaa00"
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 170, 0, 0.5), inset 0 0 12px rgba(255, 170, 0, 0.2)"
                e.currentTarget.style.transform = visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)"
            }}
        >
            ▲
        </button>
    )
}
