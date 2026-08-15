import { useEffect, useRef, useState } from "react"

export default function AudioPlayer() {
    const audioRef = useRef(null)
    const [muted, setMuted] = useState(false)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.volume = 0.4
        audio.loop = true

        const tryPlay = () => {
            audio.play().then(() => {
                setStarted(true)
            }).catch(() => {
                // Browser blocked autoplay — wait for first interaction
                const unlock = () => {
                    audio.play().then(() => {
                        setStarted(true)
                        document.removeEventListener("click", unlock)
                    })
                }
                document.addEventListener("click", unlock)
            })
        }

        tryPlay()
    }, [])

    const toggleMute = () => {
        audioRef.current.muted = !muted
        setMuted(!muted)
    }

    return (
        <>
            <audio ref={audioRef} src={`${import.meta.env.BASE_URL}audio/battle.mp3`} />
            <button
                onClick={toggleMute}
                style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 100,
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid #c47d00",
                    borderRadius: "50px",
                    padding: "10px 24px",
                    color: "#e8c84a",
                    fontFamily: "'Clash', 'Clash Display', sans-serif",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    backdropFilter: "blur(6px)",
                    transition: "all 0.2s"
                }}
            >
                {muted ? "🔇 UNMUTE" : "🔊 MUTE"}
            </button>
        </>
    )
}