import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getSolarTextures } from '../lib/solarTextures'
import { SunBody } from '../Sun'

// Piezas de fondo reutilizables para los escenarios (estilo suave / low-poly):
// cielo estrellado NASA, cuerpos celestes con textura real, sol y cordillera lejana.

/** Cúpula con el mapa estelar Hipparcos de la NASA (da profundidad al cielo). */
export function StarDome({ opacity = 0.55 }: { opacity?: number }) {
  const { stars } = getSolarTextures()
  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[400, 48, 24]} />
      <meshBasicMaterial map={stars} side={THREE.BackSide} transparent opacity={opacity} depthWrite={false} fog={false} />
    </mesh>
  )
}

/** Cuerpo celeste con textura NASA y halo atmosférico opcional. */
export function CelestialBody({
  texture,
  position,
  radius,
  halo,
  spin = 0.02,
  tilt = 0.3,
}: {
  texture: THREE.Texture
  position: [number, number, number]
  radius: number
  halo?: string
  spin?: number
  tilt?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * spin
  })
  return (
    <group position={position} rotation={[tilt, 0, 0]}>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={0.35} fog={false} />
      </mesh>
      {halo && (
        <mesh>
          <sphereGeometry args={[radius * 1.035, 32, 32]} />
          <meshBasicMaterial color={halo} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} fog={false} />
        </mesh>
      )}
    </group>
  )
}

/** Sol con textura real del SDO/NASA, en la dirección de la luz principal. */
export function SunDisc({ position, size = 5 }: { position: [number, number, number]; color?: string; size?: number }) {
  return <SunBody radius={size} position={position} />
}

/** Anillo de montañas lejanas, low-poly y con flat shading (da horizonte al escenario). */
export function FarMountains({ color, radius = 95, count = 26, seed = 1, maxHeight = 14 }: { color: string; radius?: number; count?: number; seed?: number; maxHeight?: number }) {
  const peaks = useMemo(() => {
    let s = (seed * 9301 + 49297) % 233280
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + rand() * 0.15
      const h = maxHeight * (0.3 + rand() * 0.5)
      const w = h * (2 + rand() * 1.8)
      const r = radius + rand() * 14
      return { pos: [Math.cos(a) * r, h / 2 - 1.2, Math.sin(a) * r] as [number, number, number], h, w, rot: rand() * Math.PI }
    })
  }, [count, seed, radius, maxHeight])
  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[0, p.rot, 0]}>
          <coneGeometry args={[p.w, p.h, 5 + (i % 3), 1]} />
          <meshStandardMaterial color={color} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

/** Asteroides low-poly flotando con giro lento (espacio profundo). */
export function FloatingRocks({ count = 14, color = '#8d8a96', seed = 3 }: { count?: number; color?: string; seed?: number }) {
  const rocks = useMemo(() => {
    let s = seed * 7919
    const rand = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    return Array.from({ length: count }, () => {
      const a = rand() * Math.PI * 2
      const r = 14 + rand() * 30
      return {
        pos: [Math.cos(a) * r, (rand() - 0.5) * 18, Math.sin(a) * r] as [number, number, number],
        scale: 0.4 + rand() * 1.8,
        speed: (rand() - 0.5) * 0.4,
        squash: [1, 0.6 + rand() * 0.5, 0.8 + rand() * 0.5] as [number, number, number],
      }
    })
  }, [count, seed])
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame((_, dt) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.x += dt * rocks[i].speed
      m.rotation.y += dt * rocks[i].speed * 0.7
    })
  })
  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={r.pos} scale={r.squash.map((q) => q * r.scale) as [number, number, number]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
