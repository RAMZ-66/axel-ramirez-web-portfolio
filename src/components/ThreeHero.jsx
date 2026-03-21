import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

function SpinningKnot() {
  const ref = useRef()

  // useFrame runs once per frame
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.003
      ref.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.35, 256, 64]} />
      <meshStandardMaterial color={'#60a5fa'} metalness={0.4} roughness={0.2} />
    </mesh>
  )
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 opacity-[0.25]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />
        <SpinningKnot />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
