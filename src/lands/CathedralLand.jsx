import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function CathedralLand() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Cathedral.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)

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

    useFrame(() => {
        if (!rotationGroup.current) return
        rotationGroup.current.rotation.y += 0.0015
        rotationGroup.current.rotation.y += rotationVelocity.current
        rotationVelocity.current *= 0.97
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
            <primitive object={model} scale={8} />
        </group>
    )
}