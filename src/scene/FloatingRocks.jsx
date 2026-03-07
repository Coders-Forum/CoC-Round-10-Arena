    import { useRef, useMemo } from "react"
    import { useFrame } from "@react-three/fiber"
    import * as THREE from "three"

    export default function FloatingRocks({ count = 10 }) {
        const meshRef = useRef()

        // Random positions
        const rocks = useMemo(() => {
            const arr = []
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2
                const radius = 4 + Math.random() * 3
                arr.push({
                    position: [
                        Math.sin(angle) * radius,
                        Math.random() * 4 + 1,
                        Math.cos(angle) * radius
                    ],
                    scale: Math.random() * 0.6 + 0.3,
                    speed: Math.random() * 0.5 + 0.2
                })
            }
            return arr
        }, [count])

        useFrame(({ clock }) => {
            const t = clock.getElapsedTime()
            if (!meshRef.current) return

            meshRef.current.children.forEach((rock, i) => {
                rock.rotation.x += 0.0015
                rock.rotation.y += 0.002
                rock.position.y += Math.sin(t * rocks[i].speed) * 0.001
            })
        })

        return (
            <group ref={meshRef}>
                {rocks.map((rock, i) => (
                    <mesh
                        key={i}
                        position={rock.position}
                        scale={rock.scale}
                    >
                        <dodecahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color="#2b1d0e" roughness={1} />
                    </mesh>
                ))}
            </group>
        )
    }