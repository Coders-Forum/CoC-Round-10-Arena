import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export default function JapaneseShrine() {
    const base = import.meta.env.BASE_URL
    const { scene: toriiScene } = useGLTF(`${base}models/Torii Gate.glb`)
    const { scene: treeScene } = useGLTF(`${base}models/Mystic Tree.glb`)

    const rotationGroup = useRef()
    const isDragging = useRef(false)
    const previousX = useRef(0)
    const rotationVelocity = useRef(0)

    const model = useMemo(() => {
        const group = new THREE.Group()

        // Clone Torii Gate — scale it up to match tree height
        const torii = toriiScene.clone(true)
        const toriiBox = new THREE.Box3().setFromObject(torii)
        const toriiSize = new THREE.Vector3()
        toriiBox.getSize(toriiSize)
        const toriiCenter = new THREE.Vector3()
        toriiBox.getCenter(toriiCenter)
        const toriiPivot = new THREE.Group()
        torii.position.set(-toriiCenter.x, -toriiCenter.y, -toriiCenter.z)
        toriiPivot.add(torii)

        // Clone Mystic Tree
        const tree = treeScene.clone(true)
        const treeBox = new THREE.Box3().setFromObject(tree)
        const treeSize = new THREE.Vector3()
        treeBox.getSize(treeSize)
        const treeCenter = new THREE.Vector3()
        treeBox.getCenter(treeCenter)
        const treePivot = new THREE.Group()
        tree.position.set(-treeCenter.x, -treeCenter.y, -treeCenter.z)
        treePivot.add(tree)

        // Match torii height to tree height
        const heightRatio = treeSize.y / toriiSize.y
        toriiPivot.scale.setScalar(heightRatio)

        // Place side by side with small gap
        toriiPivot.position.set(-treeSize.x * 0.6, 0, 0)
        treePivot.position.set(treeSize.x * 0.3, 0, 0)

        group.add(toriiPivot)
        group.add(treePivot)

        // Center the whole group
        const finalBox = new THREE.Box3().setFromObject(group)
        const finalCenter = new THREE.Vector3()
        finalBox.getCenter(finalCenter)
        group.position.set(-finalCenter.x, -finalCenter.y, -finalCenter.z)

        return group
    }, [toriiScene, treeScene])

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
            <primitive object={model} scale={5.8} />
        </group>
    )
}