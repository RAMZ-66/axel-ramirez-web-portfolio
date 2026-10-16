import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { accent } from '@/styles/theme'

// Radial gradient texture used for the soft blue halo behind the shape
function useGlowTexture() {
  return useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, accent + '8c')
    gradient.addColorStop(0.4, accent + '2e')
    gradient.addColorStop(1, accent + '00')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

function SpinningPolyhedron() {
  const ref = useRef()
  const glowTexture = useGlowTexture()

  // useFrame runs once per frame
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.003
      ref.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <sprite scale={[5, 5, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {/* Icosahedron: 12 vertices */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial color={'#0b0e14'} metalness={0.6} roughness={0.35} flatShading />
        <Edges color={'#ffffff'} />
      </mesh>
    </>
  )
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 opacity-[0.6]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[2, 2, 3]} intensity={6} color={accent} />
        <pointLight position={[-3, -2, -2]} intensity={4} color={accent} />
        <SpinningPolyhedron />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
