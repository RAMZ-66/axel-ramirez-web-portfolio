import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ url }) {
  try {
    const { scene } = useGLTF(url)
    return <primitive object={scene} scale={0.6} />
  } catch (e) {
    // fallback primitive
    return (
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={'#60a5fa'} />
      </mesh>
    )
  }
}

export default function ThreeScene({ modelUrl = '' }) {
  return (
    <div className="w-full h-96 card">
      <Canvas camera={{ position: [0, 1.2, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <Model url={modelUrl} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
