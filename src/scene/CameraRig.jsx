// import { OrbitControls } from "@react-three/drei"
// import { useFrame } from "@react-three/fiber"
// import { useRef } from "react"
//
// export default function CameraRig() {
//     const controls = useRef()
//
//     useFrame((state, delta) => {
//         if (controls.current) {
//             controls.current.autoRotate = true
//             controls.current.autoRotateSpeed = 0.3
//         }
//     })
//
//     return (
//         <OrbitControls
//             ref={controls}
//             enableZoom={false}
//             enablePan={false}
//             minPolarAngle={Math.PI / 3}
//             maxPolarAngle={Math.PI / 3}
//         />
//     )
// }