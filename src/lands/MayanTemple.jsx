import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function MayanTemple() {
    const { scene } = useGLTF("/models/Mayan Temple.glb")

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
        console.log("MayanTemple size:", size)

        const pivot = new THREE.Group()
        cloned.position.set(-center.x, -center.y, -center.z)

        // Greyish cinematic rockish look
        cloned.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone()
                child.material.roughness = 0.95
                child.material.metalness = 0.05
                child.material.color.multiplyScalar(0.8)
                child.material.color.lerp(new THREE.Color("#888888"), 0.45) // grey rock tint
                if (child.material.map) {
                    child.material.map.anisotropy = 16
                }
            }
        })

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
        // ✅ pointer events on the outer div via onPointerDown on canvas level
        <group
            ref={rotationGroup}
            position={[0, 1.5, 0]}
            onPointerDown={(e) => {
                e.stopPropagation()
                isDragging.current = true
                previousX.current = e.clientX
            }}
            onPointerUp={(e) => {
                e.stopPropagation()
                isDragging.current = false
            }}
            onPointerLeave={(e) => {
                e.stopPropagation()
                isDragging.current = false
            }}
            onPointerMove={(e) => {
                e.stopPropagation()
                if (!isDragging.current) return
                const delta = e.clientX - previousX.current
                rotationVelocity.current = delta * 0.0012
                previousX.current = e.clientX
            }}
        >
            <primitive object={model} scale={25} />
        </group>
    )
}