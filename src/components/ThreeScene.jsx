import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Fallback shape shown while loading
function FallbackModel() {
  return (
    <mesh>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={'#60a5fa'} />
    </mesh>
  )
}

// Actual 3D model
function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} position={[0, -1.8, 0]} />
}

// Background gradient sphere with custom shader
function GradientBackground() {
  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        colorTop: { value: new THREE.Color('#60a5fa') },     // /blue
        colorMiddle: { value: new THREE.Color('#302b63') },  // Purple
        colorBottom: { value: new THREE.Color('#24243e') }   // Dark blue
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorTop;
        uniform vec3 colorMiddle;
        uniform vec3 colorBottom;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 color;
          if (h > 0.0) {
            color = mix(colorMiddle, colorTop, h);
          } else {
            color = mix(colorMiddle, colorBottom, -h);
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `
    })
  }, [])

  return (
    <mesh scale={50} material={gradientMaterial}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  )
}

export default function ThreeScene({ modelUrl = '' }) {
  return (
    <div className="w-48 h-48 md:h-96 md:w-full rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [1, 0, 3], fov: 60 }}>
        <GradientBackground />
        <ambientLight intensity={0.6} />
        <pointLight intensity={10} position={[5, 0, 10]} />
        <pointLight intensity={5} position={[-5, 5, -5]} color="#60a5fa" />
        <Suspense fallback={<FallbackModel />}>
          {modelUrl && <Model url={modelUrl} />}
        </Suspense>
        <Environment preset="sunset" />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

// Preload the model for better performance
useGLTF.preload('/3d/crystal.glb')
