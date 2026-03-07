import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Snowflakes({ count = 120 }) {
    const mesh = useRef()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 12,   // spread wide
                    Math.random() * 14,            // start at various heights
                    (Math.random() - 0.5) * 12
                ],
                speed: 0.008 + Math.random() * 0.015,  // slow gentle fall
                drift: Math.random() * 0.003,           // slight sideways drift
                wobble: Math.random() * Math.PI * 2     // wobble offset
            })
        }
        return temp
    }, [count])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()

        particles.forEach((p) => {
            // fall down
            p.position[1] -= p.speed

            // gentle sideways wobble like real snow
            p.position[0] += Math.sin(t * 0.5 + p.wobble) * 0.003
            p.position[2] += Math.cos(t * 0.4 + p.wobble) * 0.002

            // reset when hits bottom — fade out effect
            if (p.position[1] < -3) {
                p.position[1] = 10 + Math.random() * 4  // respawn at top
                p.position[0] = (Math.random() - 0.5) * 12
                p.position[2] = (Math.random() - 0.5) * 12
            }
        })

        if (!mesh.current) return

        mesh.current.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                particles.flatMap((p) => p.position),
                3
            )
        )
        mesh.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={mesh}>
            <bufferGeometry />
            <pointsMaterial
                size={0.12}
                color="#ddeeff"
                transparent
                opacity={0.75}
                depthWrite={false}
                sizeAttenuation={true}
            />
        </points>
    )
}