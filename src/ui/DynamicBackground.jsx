import { useState, useEffect, useRef } from "react"
import { getLandBackground, DEFAULT_BACKGROUND } from "../config/backgrounds.js"
import AtmosphericEffects from "./AtmosphericEffects.jsx"

export default function DynamicBackground({ activeLandId = "volcano" }) {
    const bgConfig = getLandBackground(activeLandId)

    // Manage current & previous background for 1.2s smooth crossfade
    const [currSrc, setCurrSrc] = useState(bgConfig.image)
    const [prevSrc, setPrevSrc] = useState(null)
    const [isCrossfading, setIsCrossfading] = useState(false)
    const [currFailed, setCurrFailed] = useState(false)
    const [prevFailed, setPrevFailed] = useState(false)

    const isFirstRender = useRef(true)

    useEffect(() => {
        const targetSrc = bgConfig.image

        if (isFirstRender.current) {
            isFirstRender.current = false
            setCurrSrc(targetSrc)
            return
        }

        if (targetSrc !== currSrc) {
            setPrevSrc(currSrc)
            setCurrSrc(targetSrc)
            setCurrFailed(false)
            setIsCrossfading(true)

            const timer = setTimeout(() => {
                setIsCrossfading(false)
                setPrevSrc(null)
            }, 1200)

            return () => clearTimeout(timer)
        }
    }, [activeLandId, bgConfig.image, currSrc])

    // Preload image & fallback if main fails
    const handleCurrError = () => {
        if (!currFailed && currSrc !== DEFAULT_BACKGROUND) {
            console.warn(`[DynamicBackground] Failed to load ${currSrc}, falling back to ${DEFAULT_BACKGROUND}`)
            setCurrFailed(true)
            setCurrSrc(DEFAULT_BACKGROUND)
        }
    }

    const handlePrevError = () => {
        if (!prevFailed && prevSrc !== DEFAULT_BACKGROUND) {
            setPrevFailed(true)
            setPrevSrc(DEFAULT_BACKGROUND)
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
            {/* Previous Background Layer (Crossfading out) */}
            {prevSrc && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("${prevSrc}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        opacity: isCrossfading ? 0 : 1,
                        transition: "opacity 1.2s ease-in-out",
                        willChange: "opacity"
                    }}
                >
                    <img
                        src={prevSrc}
                        alt=""
                        onError={handlePrevError}
                        style={{ display: "none" }}
                    />
                </div>
            )}

            {/* Current Active Background Layer (Crossfading in) */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("${currSrc}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    opacity: isCrossfading ? 1 : 1,
                    transition: "opacity 1.2s ease-in-out",
                    willChange: "opacity"
                }}
            >
                <img
                    src={currSrc}
                    alt=""
                    onError={handleCurrError}
                    style={{ display: "none" }}
                />
            </div>

            {/* Dark Cinematic Vignette Overlay to maintain 3D model & UI focus */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.70) 75%, rgba(0,0,0,0.90) 100%)`,
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
