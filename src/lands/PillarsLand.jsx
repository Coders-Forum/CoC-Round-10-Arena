import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function PillarsLand() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Column.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)
    const energyRef1 = useRef()
    const energyRef2 = useRef()
    const timeRef = useRef(0)

    const model = useMemo(() => {
        const group = new THREE.Group()

        // Helper to clone and scale pillar
        const makePillar = (x, z, scaleY = 1) => {
            const cloned = scene.clone(true)
            const box = new THREE.Box3().setFromObject(cloned)
            const center = new THREE.Vector3()
            box.getCenter(center)
            const size = new THREE.Vector3()
            box.getSize(size)
            cloned.position.set(
                x - center.x * 1,
                -center.y * scaleY,
                z - center.z * 1
            )
            cloned.scale.set(1, scaleY, 1)
            return cloned
        }

        // 4 pillars at corners — slightly different heights
        group.add(makePillar(-2.5,  2.5, 1.0))   // front left
        group.add(makePillar( 2.5,  2.5, 1.2))   // front right
        group.add(makePillar(-2.5, -2.5, 1.15))  // back left
        group.add(makePillar( 2.5, -2.5, 0.9))   // back right

        // Center the whole group
        const finalBox = new THREE.Box3().setFromObject(group)
        const finalCenter = new THREE.Vector3()
        finalBox.getCenter(finalCenter)
        group.position.set(-finalCenter.x, -finalCenter.y, -finalCenter.z)

        return group
    }, [scene])

    useFrame((state, delta) => {
        if (!rotationGroup.current) return
        timeRef.current += delta

        rotationGroup.current.rotation.y += 0.0015
        rotationGroup.current.rotation.y += rotationVelocity.current
        rotationVelocity.current *= 0.97

        // Pulsing electric blue energy — two lights alternating
        if (energyRef1.current) {
            energyRef1.current.intensity = 2.5 + Math.sin(timeRef.current * 3.0) * 1.5
        }
        if (energyRef2.current) {
            energyRef2.current.intensity = 2.5 + Math.sin(timeRef.current * 3.0 + Math.PI) * 1.5
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
            {/* Electric blue energy from center — pulsing alternating */}
            <pointLight
                ref={energyRef1}
                position={[0, 1, 0]}
                intensity={2.5}
                color="#0088ff"
                distance={18}
            />
            <pointLight
                ref={energyRef2}
                position={[0, 3, 0]}
                intensity={2.5}
                color="#44aaff"
                distance={22}
            />
            {/* Rim light for depth */}
            <pointLight
                position={[0, -2, 0]}
                intensity={1.0}
                color="#0044aa"
                distance={15}
            />
            <primitive object={model} scale={2.2} />
        </group>
    )
}