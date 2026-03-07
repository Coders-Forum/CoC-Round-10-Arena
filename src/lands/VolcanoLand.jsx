import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import FloatingRocks from "../scene/FloatingRocks.jsx"
import Embers from "../scene/Embers.jsx"

export default function VolcanoLand() {
    const { scene } = useGLTF("/models/volcano.glb")

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)

    // Center the model properly
    const model = useMemo(() => {
        const cloned = scene.clone(true)

        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        box.getCenter(center)
        cloned.position.sub(center)

        return cloned
    }, [scene])

    useFrame(() => {
        if (!rotationGroup.current) return

        // Auto rotation (slightly slower)
        rotationGroup.current.rotation.y += 0.0015

        // Apply drag velocity
        rotationGroup.current.rotation.y += rotationVelocity.current

        // Stronger smoothing (slower stop = smoother feel)
        rotationVelocity.current *= 0.97
    })

    return (
        <group
            ref={rotationGroup}
            onPointerDown={(e) => {
                isDragging.current = true
                previousX.current = e.clientX
            }}
            onPointerUp={() => {
                isDragging.current = false
            }}
            onPointerLeave={() => {
                isDragging.current = false
            }}
            onPointerMove={(e) => {
                if (!isDragging.current) return
                const delta = e.clientX - previousX.current
                rotationVelocity.current = delta * 0.0012
                previousX.current = e.clientX
            }}
        >
            <primitive object={model} scale={12} />
            <FloatingRocks />
            <Embers />
        </group>
    )
}