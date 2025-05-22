"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, PerspectiveCamera, Text, useTexture } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import * as THREE from "three"
import { Bloom, EffectComposer } from "@react-three/postprocessing"

// Define the featured movies
const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    texture: "/placeholder.svg?height=300&width=200",
    position: [-2.5, 0, 0],
    rotation: [0, 0.3, 0],
  },
  {
    id: 2,
    title: "Dune: Part Two",
    texture: "/placeholder.svg?height=300&width=200",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  {
    id: 3,
    title: "Blade Runner 2049",
    texture: "/placeholder.svg?height=300&width=200",
    position: [2.5, 0, 0],
    rotation: [0, -0.3, 0],
  },
]

function MoviePoster({ title, texture, position, rotation, onClick }) {
  const textureMap = useTexture(texture)
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotation[1] + (hovered ? -0.2 : 0),
        0.05,
      )

      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, hovered ? 0.2 : 0, 0.1)
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          rotation={rotation}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <planeGeometry args={[1.5, 2.25]} />
          <meshStandardMaterial map={textureMap} emissive="#ffffff" emissiveIntensity={hovered ? 0.3 : 0.1} />
        </mesh>
      </Float>

      <Text
        position={[0, -1.4, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Regular.json"
      >
        {title}
      </Text>
    </group>
  )
}

function CameraControls() {
  const { camera } = useThree()

  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 60
    const y = (mouse.y * viewport.height) / 60

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function ThreeDMovieShowcase() {
  const [selectedMovie, setSelectedMovie] = useState(null)

  return (
    <div className="relative mx-auto h-[40vh] max-h-[500px] w-full max-w-5xl overflow-hidden rounded-2xl border border-muted/50 bg-black/60 backdrop-blur-md">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <CameraControls />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {FEATURED_MOVIES.map((movie) => (
            <MoviePoster
              key={movie.id}
              title={movie.title}
              texture={movie.texture}
              position={movie.position}
              rotation={movie.rotation}
              onClick={() => setSelectedMovie(movie.id)}
            />
          ))}

          <Environment preset="night" />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-center gap-2">
          {FEATURED_MOVIES.map((movie) => (
            <button
              key={movie.id}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                selectedMovie === movie.id ? "bg-[hsl(var(--neon-blue))] w-8" : "bg-gray-500"
              }`}
              onClick={() => setSelectedMovie(movie.id)}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-6 top-6 rounded-md bg-black/70 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-sm font-medium text-white">Featured Movies</p>
      </div>
    </div>
  )
}
