import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function NecroLand() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Necropolis walls V2.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)
    const pulseRef = useRef()
    const pulse2Ref = useRef()
    const timeRef = useRef(0)

    const model = useMemo(() => {
        const cloned = scene.clone(true)
        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        box.getCenter(center)
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

        // Pulsing sacred golden light
        if (pulseRef.current) {
            pulseRef.current.intensity = 2 + Math.sin(timeRef.current * 1.5) * 1.2
        }
        // Secondary slow pulse — opposite phase
        if (pulse2Ref.current) {
            pulse2Ref.current.intensity = 1.5 + Math.sin(timeRef.current * 1.5 + Math.PI) * 0.8
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
            {/* Pulsing sacred golden light from above */}
            <pointLight
                ref={pulseRef}
                position={[0, 8, 0]}
                intensity={2}
                color="#ffcc44"
                distance={35}
            />
            {/* Secondary warm pulse from ground */}
            <pointLight
                ref={pulse2Ref}
                position={[0, -1, 0]}
                intensity={1.5}
                color="#ffaa00"
                distance={20}
            />
            {/* Rim light for sacred silhouette */}
            <pointLight
                position={[-5, 3, -5]}
                intensity={1}
                color="#ffe066"
                distance={25}
            />
            <primitive object={model} scale={5.5} />
        </group>
    )
}