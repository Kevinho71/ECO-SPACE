import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { storyRuntime } from '../../story/runtime'
import { getSolarTextures } from '../lib/solarTextures'
import { SunBody } from '../Sun'
import { CruiseShip, EntryFire, LaunchPad } from '../Spacecraft'
import { FT } from './flightPath'

type FlightPlace = 'launch' | 'cruise' | 'entry'

const lerp = THREE.MathUtils.lerp
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** Tierra que se aleja y Marte que se acerca durante los siete meses de crucero. */
function CruiseWorlds() {
  const { earth, mars } = getSolarTextures()
  const e = useRef<THREE.Group>(null)
  const m = useRef<THREE.Group>(null)
  useFrame(() => {
    const t = storyRuntime.t
    const u = clamp01((t - FT.cruiseStart) / (FT.entryStart - FT.cruiseStart))
    if (e.current) {
      e.current.position.set(-55, 14, lerp(230, 640, u))
      e.current.scale.setScalar(lerp(34, 9, u))
      e.current.rotation.y += 0.0015
    }
    if (m.current) {
      m.current.position.set(14, 4, lerp(-300, -170, u))
      m.current.scale.setScalar(lerp(8, 58, u))
      m.current.rotation.y += 0.0008
    }
  })
  return (
    <>
      <group ref={e}>
        <mesh>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial map={earth} roughness={1} emissive="#ffffff" emissiveMap={earth} emissiveIntensity={0.28} />
        </mesh>
        <mesh scale={1.035}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshBasicMaterial color="#6aa8ff" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      </group>
      <group ref={m}>
        <mesh>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial map={mars} roughness={1} emissive="#ffffff" emissiveMap={mars} emissiveIntensity={0.25} />
        </mesh>
        <mesh scale={1.025}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshBasicMaterial color="#ffa070" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      </group>
    </>
  )
}

/** Marte visto desde arriba, con la nave encendida cruzando la atmósfera. */
function EntryWorld() {
  const { mars } = getSolarTextures()
  return (
    <>
      <group position={[0, -80, 0]}>
        <mesh rotation={[0, 1.2, 0]}>
          <sphereGeometry args={[80, 64, 40]} />
          <meshStandardMaterial map={mars} roughness={1} emissive="#ffffff" emissiveMap={mars} emissiveIntensity={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[84, 48, 32]} />
          <meshBasicMaterial color="#ff9c60" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      </group>
      <EntryFire />
    </>
  )
}

export function FlightScene({ place }: { place: FlightPlace }) {
  const night = place === 'launch'
  return (
    <>
      <color attach="background" args={[night ? '#04060e' : '#000000']} />
      {night ? <fog attach="fog" args={['#04060e', 120, 520]} /> : null}
      <Stars radius={450} depth={80} count={night ? 2500 : 5000} factor={night ? 5 : 7} saturation={0} fade speed={0.2} />
      <ambientLight intensity={night ? 0.12 : 0.22} color="#a8b6ff" />

      {night && <LaunchPad />}

      {place === 'cruise' && (
        <>
          <directionalLight position={[80, 30, -20]} intensity={3.2} color="#fff3dc" />
          <directionalLight position={[-6, 5, 14]} intensity={1.5} color="#cfd8ff" />
          <directionalLight position={[5, 3, -12]} intensity={1.2} color="#ffe9c8" />
          <SunBody radius={16} position={[520, 90, -140]} />
          <CruiseShip />
          <CruiseWorlds />
        </>
      )}

      {place === 'entry' && (
        <>
          <directionalLight position={[-40, 60, 80]} intensity={2.4} color="#fff0d8" />
          <EntryWorld />
        </>
      )}
    </>
  )
}
