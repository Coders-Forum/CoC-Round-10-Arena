import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function CastleFortress() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Castle Fortress.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)

    const model = useMemo(() => {
        const cloned = scene.clone(true)
        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        const size = new THREE.Vector3()
        box.getCenter(center)
        box.getSize(size)
        console.log("CastleFortress size:", size)

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
            onPointerDown={(e) => {
                isDragging.current = true
                previousX.current = e.clientX
            }}
            onPointerUp={() => { isDragging.current = false }}
            onPointerLeave={() => { isDragging.current = false }}
            onPointerMove={(e) => {
                if (!isDragging.current) return
                const delta = e.clientX - previousX.current
                rotationVelocity.current = delta * 0.0012
                previousX.current = e.clientX
            }}
        >
            <primitive object={model} scale={8} />
        </group>
    )
}