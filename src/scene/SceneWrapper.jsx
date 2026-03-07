// import { EffectComposer, Bloom } from "@react-three/postprocessing"
// import { Cloud, Clouds } from "@react-three/drei"
//
// export default function SceneWrapper({ children }) {
//     return (
//         <>
//             <Clouds>
//                 <Cloud
//                     position={[-30, 20, -40]}
//                     speed={0.1}
//                     opacity={0.6}
//                     width={60}
//                     depth={30}
//                     segments={40}
//                 />
//                 <Cloud
//                     position={[40, 25, -60]}
//                     speed={0.08}
//                     opacity={0.5}
//                     width={80}
//                     depth={35}
//                     segments={40}
//                 />
//                 <Cloud
//                     position={[0, 18, -30]}
//                     speed={0.06}
//                     opacity={0.4}
//                     width={100}
//                     depth={40}
//                     segments={40}
//                 />
//             </Clouds>
//
//
//             {/* Global Background */}
//             {/* soft sky blue */}
//             <fog attach="fog" args={["#dcefff", 80, 300]} />
//
//             {/* Global Lighting */}
//             <ambientLight intensity={0.6} />
//
//             <directionalLight
//                 position={[10, 20, 10]}
//                 intensity={1.5}
//                 color="#ffffff"
//                 castShadow
//             />
//
//             {/* Postprocessing */}
//             <EffectComposer>
//                 <Bloom
//                     intensity={0.3}
//                     luminanceThreshold={0.8}
//                 />
//             </EffectComposer>
//
//             {children}
//         </>
//     )
// }