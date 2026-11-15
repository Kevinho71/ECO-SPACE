import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Sparkles, Stars, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { getSolarTextures } from './lib/solarTextures'

const PLANET_RADIUS = 3

function latLonToPosition(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180
  const theta = (lon * Math.PI) / 180
  return [
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.sin(theta),
  ]
}

/** Animación de acercamiento (dolly) al cargar la escena. */
function CameraDolly({
  from,
  to,
  target,
  duration = 1.8,
  onDone,
}: {
  from: [number, number, number]
  to: [number, number, number]
  target: [number, number, number]
  duration?: number
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const startRef = useRef<number | null>(null)
  const doneRef = useRef(false)
  const fromV = useMemo(() => new THREE.Vector3(...from), [from])
  const toV = useMemo(() => new THREE.Vector3(...to), [to])
  const targetV = useMemo(() => new THREE.Vector3(...target), [target])

  useEffect(() => {
    camera.position.copy(fromV)
    camera.lookAt(targetV)
  }, [camera, fromV, targetV])

  useFrame(({ clock }) => {
    if (doneRef.current) return
    if (startRef.current === null) startRef.current = clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - startRef.current) / duration)
    const e = 1 - Math.pow(1 - t, 3)
    camera.position.lerpVectors(fromV, toV, e)
    camera.lookAt(targetV)
    if (t >= 1) {
      doneRef.current = true
      onDone()
    }
  })

  return null
}

function Beacon({
  position,
  label,
  color = '#6ef7ff',
  onClick,
}: {
  position: [number, number, number]
  label: string
  color?: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const pulse = useRef<THREE.Mesh>(null)
  useCursor(hovered)

  useFrame(({ clock }) => {
    const s = 1 + 0.25 * Math.sin(clock.elapsedTime * 3)
    pulse.current?.scale.setScalar(s)
  })

  return (
    <group position={position}>
      <mesh
        ref={pulse}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      )}
      <Html center distanceFactor={12} position={[0, 0.2, 0]}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-sm text-white backdrop-blur-md">
          {label}
        </div>
      </Html>
    </group>
  )
}

/** Globo rotable de la Luna o Marte, con balizas en las coordenadas reales de las misiones. */
function PlanetSurface({ location }: { location: 'moon' | 'mars' }) {
  const selectMission = useAppStore((s) => s.selectMission)
  const tex = getSolarTextures()
  const isMoon = location === 'moon'
  const map = isMoon ? tex.moon : tex.mars
  const missions = MISSIONS.filter((m) => m.location === location && m.latlon)
  const [ready, setReady] = useState(false)

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.3} />
      <ambientLight intensity={isMoon ? 0.25 : 0.45} />
      <directionalLight position={[10, 6, 8]} intensity={isMoon ? 2.5 : 2} color={isMoon ? '#fff3e0' : '#ffd9b0'} />

      <CameraDolly from={[0, 10, 22]} to={[0, 1.5, 9]} target={[0, 0, 0]} onDone={() => setReady(true)} />

      <mesh>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>

      {!isMoon && (
        <mesh>
          <sphereGeometry args={[PLANET_RADIUS * 1.05, 32, 32]} />
          <meshBasicMaterial color="#ff8a4a" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {missions.map((m) => (
        <Beacon
          key={m.id}
          position={latLonToPosition(m.latlon![0], m.latlon![1], PLANET_RADIUS * 1.015)}
          label={m.nickname ?? m.name}
          onClick={() => selectMission(m.id)}
        />
      ))}

      <OrbitControls
        makeDefault
        enabled={ready}
        enableDamping
        dampingFactor={0.08}
        minDistance={4.5}
        maxDistance={18}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </>
  )
}

/** Espacio profundo: baliza única para Pioneer 10. */
function BeyondMap() {
  const selectMission = useAppStore((s) => s.selectMission)
  const [ready, setReady] = useState(false)

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.3} />
      <Sparkles count={200} scale={[20, 20, 20]} size={1.5} speed={0.2} opacity={0.4} color="#9ab0ff" />
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 6, 8]} intensity={1.5} />

      <CameraDolly from={[0, 6, 20]} to={[0, 0, 8]} target={[0, 0, 0]} onDone={() => setReady(true)} />

      <Beacon position={[0, 0, 0]} label="🛰️ Pioneer 10" color="#6ef7ff" onClick={() => selectMission('pioneer10')} />

      <OrbitControls
        makeDefault
        enabled={ready}
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={22}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </>
  )
}

export function PlanetMap() {
  const location = useAppStore((s) => s.selectedLocation)
  if (!location) return null
  if (location === 'beyond') return <BeyondMap />
  return <PlanetSurface location={location} />
}
