import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import Snowflakes from "../scene/Snowflakes.jsx"

export default function SnowLand() {
    const { scene } = useGLTF("/models/snow_mountain.glb")

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)

    const model = useMemo(() => {
        const cloned = scene.clone(true)
        const box = new THREE.Box3().setFromObject(cloned)
        const center = new THREE.Vector3()
        box.getCenter(center)
        cloned.position.sub(center)

        // Icy snowy cinematic look
        cloned.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone()
                child.material.roughness = 0.7
                child.material.metalness = 0.05        // slight icy shimmer
                child.material.color.multiplyScalar(1.2) // brighter — fresh snow
                child.material.color.lerp(new THREE.Color("#e8f4ff"), 0.3) // cool ice blue tint
                if (child.material.map) {
                    child.material.map.anisotropy = 16
                }
            }
        })

        return cloned
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
            // position={[0, 1.5, 0]}
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
            {/*
                Snow model raw size is 143 units wide
                Volcano model uses scale 12
                So to match volcano visually: 12 / 143 ≈ 0.084
                Using 0.09 to make it slightly visible and similar size
            */}
            <primitive object={model} scale={1} />
            <Snowflakes count={120} />
        </group>
    )
}