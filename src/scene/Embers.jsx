import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Embers({ count = 80 }) {
    const mesh = useRef()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 6,
                    Math.random() * 5,
                    (Math.random() - 0.5) * 6
                ],
                speed: 0.01 + Math.random() * 0.02
            })
        }
        return temp
    }, [count])

    useFrame(() => {
        particles.forEach((p) => {
            p.position[1] += p.speed
            p.position[0] += Math.sin(p.position[1]) * 0.002

            if (p.position[1] > 8) {
                p.position[1] = 0
            }
        })

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
                size={0.15}
                color="#ff6600"
                transparent
                opacity={0.8}
                depthWrite={false}
            />
        </points>
    )
}