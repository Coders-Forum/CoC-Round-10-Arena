import { useState, useEffect, useRef } from "react"
import { getLandBackground, DEFAULT_BACKGROUND } from "../config/backgrounds.js"
import AtmosphericEffects from "./AtmosphericEffects.jsx"

export default function DynamicBackground({ activeLandId = "volcano" }) {
    const bgConfig = getLandBackground(activeLandId)
    const targetImage = bgConfig.image || DEFAULT_BACKGROUND

    // Dual-layer crossfade state for smooth 1.5s image transition
    const [srcA, setSrcA] = useState(targetImage)
    const [srcB, setSrcB] = useState(targetImage)
    const [activeLayer, setActiveLayer] = useState("A") // "A" = Layer A visible, "B" = Layer B visible

    const prevTargetRef = useRef(targetImage)

    useEffect(() => {
        if (targetImage === prevTargetRef.current) return
        prevTargetRef.current = targetImage

        if (activeLayer === "A") {
            setSrcB(targetImage)
            setActiveLayer("B")
        } else {
            setSrcA(targetImage)
            setActiveLayer("A")
        }
    }, [targetImage, activeLayer])

    const handleImgError = (e) => {
        if (e.target.src !== DEFAULT_BACKGROUND) {
            console.warn(`[DynamicBackground] Failed to load image, using default fallback`)
            e.target.src = DEFAULT_BACKGROUND
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
                background: "#08080a"
            }}
        >
            {/* Background Layer A */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("${srcA}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    opacity: activeLayer === "A" ? 1 : 0,
                    transition: "opacity 1.5s ease-in-out",
                    willChange: "opacity"
                }}
            >
                <img src={srcA} alt="" decoding="async" loading="lazy" fetchpriority="low" onError={handleImgError} style={{ display: "none" }} />
            </div>

            {/* Background Layer B */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("${srcB}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    opacity: activeLayer === "B" ? 1 : 0,
                    transition: "opacity 1.5s ease-in-out",
                    willChange: "opacity"
                }}
            >
                <img src={srcB} alt="" decoding="async" loading="lazy" fetchpriority="low" onError={handleImgError} style={{ display: "none" }} />
            </div>

            {/* Dark Cinematic Vignette Overlay to maintain 3D model & UI focus */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.88) 100%)`,
                    pointerEvents: "none",
                    zIndex: 1
                }}
            />

            {/* Subtle Atmospheric Effects Layer (Embers, Snow, Dust, Mist) */}
            <AtmosphericEffects
                effectType={bgConfig.effectType}
                color={bgConfig.accentColor}
            />
        </div>
    )
}
