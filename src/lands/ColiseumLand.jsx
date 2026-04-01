import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function ColiseumLand() {
    const base = import.meta.env.BASE_URL
    const { scene } = useGLTF(`${base}models/Coliseum.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(false)
    const rotationVelocity = useRef(0)

    const model = useMemo(() => {
        const cloned = scene.clone(true)
        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        const size = new THREE.Vector3()
        box.getCenter(center)
        box.getSize(size)
        console.log("Coliseum size:", size)

        const pivot = new THREE.Group()
        cloned.position.set(-center.x, -center.y, -center.z)

        // Ancient stone cinematic look
        cloned.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone()
                child.material.roughness = 0.9
                child.material.metalness = 0.15        // slight silver shimmer
                child.material.color.multiplyScalar(0.85) // keep it bright not dark
                child.material.color.lerp(new THREE.Color("#c0c8d0"), 0.3) // cool silver-blue tint
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
            <primitive object={model} scale={0.014} />
        </group>
    )
}