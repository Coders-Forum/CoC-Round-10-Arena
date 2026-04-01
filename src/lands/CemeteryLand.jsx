import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function CemeteryLand() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Cemetery scene.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)
    const flickerRef = useRef()
    const floatRef = useRef()
    const timeRef = useRef(0)

    const model = useMemo(() => {
        const cloned = scene.clone(true)
        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        box.getCenter(center)

        cloned.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone()
                child.material.roughness = 1.0
                child.material.metalness = 0.0
                child.material.envMapIntensity = 0
            }
        })

        const pivot = new THREE.Group()
        cloned.position.set(-center.x, -center.y, -center.z)
        pivot.add(cloned)
        return pivot
    }, [scene])

    useFrame((state, delta) => {
        if (!rotationGroup.current) return
        timeRef.current += delta

        rotationGroup.current.rotation.y += 0.0015
        rotationGroup.current.rotation.y += rotationVelocity.current
        rotationVelocity.current *= 0.97

        // Flickering lantern
        if (flickerRef.current) {
            const flicker =
                Math.sin(timeRef.current * 18) * 0.3 +
                Math.sin(timeRef.current * 31) * 0.2 +
                Math.sin(timeRef.current * 7) * 0.15
            flickerRef.current.intensity = 1.5 + flicker
        }

        // Gentle float
        if (floatRef.current) {
            floatRef.current.position.y = Math.sin(timeRef.current * 0.8) * 0.12
        }
    })

    return (
        <group
            ref={rotationGroup}
            position={[0, 1.5, 0]}
            onPointerDown={(e) => { e.stopPropagation(); isDragging.current = true; previousX.current = e.clientX }}
            onPointerUp={(e) => { e.stopPropagation(); isDragging.current = false }}
            onPointerLeave={(e) => { e.stopPropagation(); isDragging.current = false }}
            onPointerMove={(e) => {
                e.stopPropagation()
                if (!isDragging.current) return
                rotationVelocity.current = (e.clientX - previousX.current) * 0.0012
                previousX.current = e.clientX
            }}
        >
            {/* Flickering lantern inside cemetery */}
            <pointLight
                ref={flickerRef}
                position={[0, 2, 0]}
                intensity={1.5}
                color="#ff8833"
                distance={20}
            />
            {/* Cool moonlight from above */}
            <pointLight
                position={[0, 8, -3]}
                intensity={0.8}
                color="#aabbdd"
                distance={25}
            />
            <group ref={floatRef}>
                <primitive object={model} scale={0.75} />
            </group>
        </group>
    )
}