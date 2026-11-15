import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Stars, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore, type LocationId } from '../store/useAppStore'
import { SceneCamera } from './SceneCamera'
import { getSolarTextures } from './lib/solarTextures'

// ---------------------------------------------------------------------------
// Sistema solar realista y rotable. Los destinos con robot (Luna, Marte y la
// baliza "Más allá") se resaltan con un halo luminoso pulsante.
// ---------------------------------------------------------------------------

function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshBasicMaterial color="#fff2c8" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.75, 32, 32]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Orbiter({
  radius,
  speed,
  phase = 0,
  children,
}: {
  radius: number
  speed: number
  phase?: number
  children: React.ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const a = phase + clock.elapsedTime * speed
    ref.current?.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius)
  })
  return <group ref={ref}>{children}</group>
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 160]} />
      <meshBasicMaterial color="#8a9bbf" transparent opacity={0.18} />
    </mesh>
  )
}

interface PlanetProps {
  radius: number
  map: THREE.Texture | null
  label?: string
  selectable?: boolean
  id?: LocationId
  onSelect?: (id: LocationId) => void
  selfRotation?: number
  tilt?: number
}

function Planet({
  radius,
  map,
  label,
  selectable,
  id,
  onSelect,
  selfRotation = 0.15,
  tilt = 0,
}: PlanetProps) {
  const [hovered, setHovered] = useState(false)
  const mesh = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  useCursor(!!selectable && hovered)

  useFrame(({ clock }, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * selfRotation
    if (halo.current) {
      const s = 1 + 0.15 * Math.sin(clock.elapsedTime * 2.5)
      halo.current.scale.setScalar(s)
      ;(halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.22 + 0.1 * Math.sin(clock.elapsedTime * 2.5)
    }
  })

  return (
    <group rotation={[0, 0, tilt]}>
      <mesh
        ref={mesh}
        onClick={selectable ? (e) => { e.stopPropagation(); onSelect?.(id!) } : undefined}
        onPointerOver={selectable ? () => setHovered(true) : undefined}
        onPointerOut={selectable ? () => setHovered(false) : undefined}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        {map ? (
          <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
        ) : (
          <meshStandardMaterial color="#cccccc" roughness={0.9} />
        )}
      </mesh>

      {/* Halo luminoso para los destinos que tienen robots */}
      {selectable && (
        <mesh ref={halo}>
          <sphereGeometry args={[radius * 1.45, 32, 32]} />
          <meshBasicMaterial color="#7fd4ff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {selectable && hovered && (
        <mesh>
          <sphereGeometry args={[radius * 1.25, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
        </mesh>
      )}
      {label && (
        <Html center distanceFactor={12} position={[0, radius + 0.35, 0]}>
          <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-sm text-slate-200 backdrop-blur-md">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

function SaturnRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.3, radius * 2.1, 64]} />
      <meshBasicMaterial color="#d8c8a0" transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
  )
}

function AsteroidBelt({ inner = 6.8, outer = 8.2, count = 320 }: { inner?: number; outer?: number; count?: number }) {
  const ref = useRef<THREE.Group>(null)
  const positions = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; rot: [number, number, number] }[] = []
    let s = 12345
    const rand = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const r = inner + rand() * (outer - inner)
      const y = (rand() - 0.5) * 0.6
      arr.push({
        pos: [Math.cos(a) * r, y, Math.sin(a) * r],
        scale: 0.03 + rand() * 0.09,
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      })
    }
    return arr
  }, [inner, outer, count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale} rotation={p.rot}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8a8278" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function BeyondBeacon({ onSelect }: { onSelect: (id: LocationId) => void }) {
  const [hovered, setHovered] = useState(false)
  const halo = useRef<THREE.Mesh>(null)
  useCursor(hovered)

  useFrame(({ clock }) => {
    if (halo.current) {
      const s = 1 + 0.18 * Math.sin(clock.elapsedTime * 2.5)
      halo.current.scale.setScalar(s)
    }
  })

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect('beyond') }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color="#7f9fff" emissive="#3b5fd9" emissiveIntensity={1.5} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color="#7fd4ff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      )}
      <Html center distanceFactor={12} position={[0, 0.7, 0]}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-sm text-slate-200 backdrop-blur-md">
          🪐 Más allá
        </div>
      </Html>
    </group>
  )
}

export function SolarMap() {
  const selectLocation = useAppStore((s) => s.selectLocation)
  const tex = getSolarTextures()

  return (
    <>
      <color attach="background" args={['#03040a']} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={3.5} decay={0} color="#fff4e0" />
      <Stars radius={160} depth={80} count={5000} factor={4} saturation={0} fade speed={0.3} />

      <SceneCamera position={[0, 12, 26]} target={[0, 0, 0]} />

      <Sun />

      <Orbiter radius={2.2} speed={0.35}>
        <OrbitRing radius={2.2} />
        <Planet radius={0.16} map={tex.mercury} selfRotation={0.1} />
      </Orbiter>
      <Orbiter radius={3.2} speed={0.26}>
        <OrbitRing radius={3.2} />
        <Planet radius={0.28} map={tex.venus} selfRotation={0.06} />
      </Orbiter>
      <Orbiter radius={4.4} speed={0.2}>
        <OrbitRing radius={4.4} />
        <Planet radius={0.3} map={tex.earth} label="🌍 Tierra" selfRotation={0.4} />
        <Orbiter radius={0.55} speed={1.2}>
          <Planet radius={0.1} map={tex.moon} label="🌕 Luna" selectable id="moon" onSelect={selectLocation} selfRotation={0.2} />
        </Orbiter>
      </Orbiter>
      <Orbiter radius={5.8} speed={0.16}>
        <OrbitRing radius={5.8} />
        <Planet radius={0.24} map={tex.mars} label="🔴 Marte" selectable id="mars" onSelect={selectLocation} selfRotation={0.35} />
      </Orbiter>

      <AsteroidBelt />

      <Orbiter radius={9.5} speed={0.1}>
        <OrbitRing radius={9.5} />
        <Planet radius={0.85} map={tex.jupiter} selfRotation={0.6} />
      </Orbiter>
      <Orbiter radius={11.5} speed={0.08}>
        <OrbitRing radius={11.5} />
        <group rotation={[0, 0, 0.45]}>
          <Planet radius={0.72} map={tex.saturn} selfRotation={0.55} />
          <SaturnRing radius={0.72} />
        </group>
      </Orbiter>
      <Orbiter radius={13.5} speed={0.06}>
        <OrbitRing radius={13.5} />
        <Planet radius={0.5} map={tex.uranus} selfRotation={0.4} tilt={1.4} />
      </Orbiter>
      <Orbiter radius={15.5} speed={0.05}>
        <OrbitRing radius={15.5} />
        <Planet radius={0.48} map={tex.neptune} selfRotation={0.4} tilt={0.5} />
      </Orbiter>
      <Orbiter radius={17.5} speed={0.04}>
        <OrbitRing radius={17.5} />
        <BeyondBeacon onSelect={selectLocation} />
      </Orbiter>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={70}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </>
  )
}
