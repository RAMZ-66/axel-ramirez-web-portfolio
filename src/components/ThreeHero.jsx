import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { gsap } from 'gsap';

function SpinningKnot() {
  const ref = useRef()
  return (
    <mesh ref={ref} onUpdate={(m) => {
      // simple animation loop via requestAnimationFrame
      const animate = () => {
        m.rotation.x += 0.003
        m.rotation.y += 0.004
        requestAnimationFrame(animate)
      }
      animate()
    }}>
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
