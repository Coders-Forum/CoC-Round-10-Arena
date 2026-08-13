import { useState, useEffect } from "react"

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true)
            } else {
                setVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility, { passive: true })
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
                position: "fixed",
                bottom: "28px",
                right: "28px",
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.85)",
                border: "1px solid #ffaa00",
                color: "#ffaa00",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(255, 170, 0, 0.35), inset 0 0 10px rgba(255, 170, 0, 0.15)",
                backdropFilter: "blur(8px)",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: visible ? "scale(1)" : "scale(0.8)",
                transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, box-shadow 0.2s ease",
                zIndex: 9999
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffaa00"
                e.currentTarget.style.color = "#000000"
                e.currentTarget.style.boxShadow = "0 0 24px rgba(255, 170, 0, 0.8)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.85)"
                e.currentTarget.style.color = "#ffaa00"
                e.currentTarget.style.boxShadow = "0 0 16px rgba(255, 170, 0, 0.35), inset 0 0 10px rgba(255, 170, 0, 0.15)"
            }}
        >
            ▲
        </button>
    )
}
