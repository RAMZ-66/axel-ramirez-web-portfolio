import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useLang } from '@/context/LanguageContext'

/* ── Scene A: Pen — product / e-commerce viewer ── */

function Pen() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.5
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.07
  })
  return (
    <group ref={ref} rotation={[0, 0, -0.38]}>
      {/* Barrel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Grip section */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.086, 0.086, 0.5, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.55} />
      </mesh>
      {/* Tapered tip */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.08, 0.022, 0.3, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Nib point */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.022, 0, 0.1, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 1.175, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.35, 32]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Clip */}
      <mesh position={[0.105, 1.05, 0]}>
        <boxGeometry args={[0.022, 0.52, 0.038]} />
        <meshStandardMaterial color="#93c5fd" metalness={0.85} roughness={0.1} />
      </mesh>
    </group>
  )
}

function PenScene() {
  return (
    <Canvas camera={{ position: [0, 0.1, 4.5], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={3} color="#60a5fa" />
      <pointLight position={[-4, -2, 3]} intensity={2} color="#c084fc" />
      <Pen />
      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}

/* ── Scene B: Particle Wave — ambient hero backgrounds ── */

function ParticleWave() {
  const ref = useRef()
  const COUNT = 52
  const TOTAL = COUNT * COUNT

  const [positions, base] = useMemo(() => {
    const arr = new Float32Array(TOTAL * 3)
    for (let i = 0; i < COUNT; i++) {
      for (let j = 0; j < COUNT; j++) {
        const k = (i * COUNT + j) * 3
        arr[k]     = (i / (COUNT - 1) - 0.5) * 5
        arr[k + 1] = 0
        arr[k + 2] = (j / (COUNT - 1) - 0.5) * 5
      }
    }
    return [arr, arr.slice()]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      for (let j = 0; j < COUNT; j++) {
        const k = (i * COUNT + j) * 3
        const x = base[k], z = base[k + 2]
        arr[k + 1] =
          Math.sin(x * 2.2 + t * 1.1) * 0.28 +
          Math.cos(z * 1.9 + t * 0.85) * 0.22
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#60a5fa"
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

function WaveScene() {
  return (
    <Canvas camera={{ position: [0, 3.2, 4], fov: 48 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={1} />
      <ParticleWave />
    </Canvas>
  )
}

/* ── Scene C: Morphing Blob — generative / creative art ── */

function MorphBlob() {
  const ref = useRef()
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 5), [])
  const original = useMemo(
    () => new Float32Array(geometry.attributes.position.array),
    [geometry]
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.55
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      const ox = original[i], oy = original[i + 1], oz = original[i + 2]
      const n =
        Math.sin(ox * 3.2 + t) *
        Math.cos(oy * 2.6 + t * 1.2) *
        Math.sin(oz * 3.0 + t * 0.75)
      const d = 1 + n * 0.38
      pos[i]     = ox * d
      pos[i + 1] = oy * d
      pos[i + 2] = oz * d
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
    // Oscillate hue through purple → blue
    ref.current.material.color.setHSL(
      0.7 + Math.sin(t * 0.25) * 0.08,
      0.75,
      0.62
    )
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial metalness={0.15} roughness={0.3} />
    </mesh>
  )
}

function BlobScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={4} color="#a78bfa" />
      <pointLight position={[-3, -2, 2]} intensity={2.5} color="#60a5fa" />
      <MorphBlob />
    </Canvas>
  )
}

/* ── Card layout ── */

const SCENES = [PenScene, WaveScene, BlobScene]

export default function ThreeShowcase() {
  const { tr } = useLang()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
      {tr.three.cards.map(({ tag, title, desc, hint }, i) => {
        const Scene = SCENES[i]
        return (
        <div
          key={title}
          className="card overflow-hidden flex flex-col hover:ring-1 hover:ring-accent/30 transition-shadow p-3"
        >
          <div className="relative h-64 md:h-72 rounded-xl overflow-hidden bg-surface">
            <Scene />
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm">
              {tag}
            </span>
            {hint && (
              <span className="absolute bottom-3 right-3 text-xs text-muted/50 select-none">
                ↕ {hint}
              </span>
            )}
          </div>
          <div className="pt-4 pb-3 px-1">
            <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      )})}
    </div>
  )
}
