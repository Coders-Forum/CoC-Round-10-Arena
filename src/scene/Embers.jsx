import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Embers({ count = 80 }) {
    const mesh = useRef()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 6,
                y: Math.random() * 5,
                z: (Math.random() - 0.5) * 6,
                speed: 0.01 + Math.random() * 0.02
            })
        }
        return temp
    }, [count])

    const [posArray, posAttr] = useMemo(() => {
        const arr = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            arr[i * 3] = particles[i].x
            arr[i * 3 + 1] = particles[i].y
            arr[i * 3 + 2] = particles[i].z
        }
        return [arr, new THREE.BufferAttribute(arr, 3)]
    }, [particles, count])

    useFrame(() => {
        if (!mesh.current) return
        for (let i = 0; i < count; i++) {
            const p = particles[i]
            p.y += p.speed
            p.x += Math.sin(p.y) * 0.002

            if (p.y > 8) {
                p.y = 0
            }

            posArray[i * 3] = p.x
            posArray[i * 3 + 1] = p.y
            posArray[i * 3 + 2] = p.z
        }

        posAttr.needsUpdate = true
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    {...posAttr}
                />
            </bufferGeometry>
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