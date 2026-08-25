import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Snowflakes({ count = 120 }) {
    const mesh = useRef()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 12,   // spread wide
                y: Math.random() * 14,            // start at various heights
                z: (Math.random() - 0.5) * 12,
                speed: 0.008 + Math.random() * 0.015,  // slow gentle fall
                drift: Math.random() * 0.003,           // slight sideways drift
                wobble: Math.random() * Math.PI * 2     // wobble offset
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

    useFrame(({ clock }) => {
        if (!mesh.current) return
        const t = clock.getElapsedTime()

        for (let i = 0; i < count; i++) {
            const p = particles[i]
            // fall down
            p.y -= p.speed

            // gentle sideways wobble like real snow
            p.x += Math.sin(t * 0.5 + p.wobble) * 0.003
            p.z += Math.cos(t * 0.4 + p.wobble) * 0.002

            // reset when hits bottom — fade out effect
            if (p.y < -3) {
                p.y = 10 + Math.random() * 4  // respawn at top
                p.x = (Math.random() - 0.5) * 12
                p.z = (Math.random() - 0.5) * 12
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