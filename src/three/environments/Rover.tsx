import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../../story/runtime'
import { placeHeight, type PlaceDef } from './places'

const WHEEL_R = 0.85
const WHEELS: [number, number][] = [
  [-1.9, -1.35], [0, -1.35], [1.9, -1.35],
  [-1.9, 1.35], [0, 1.35], [1.9, 1.35],
]

/**
 * Perseverance, estilizado (maqueta): chasis alto con seis ruedas, mástil con cabeza y antena.
 * Es una pieza del mundo (vive en el grupo del suelo): su posición es `startX + storyRuntime.roverX`.
 * Mira hacia +X. Fuera de escena si roverX ≥ 900.
 */
export function Rover({ def }: { def: PlaceDef }) {
  const g = useRef<THREE.Group>(null)
  const wheels = useRef<THREE.Group>(null)
  const last = useRef(0)

  useFrame(() => {
    const r = g.current
    if (!r) return
    const x = storyRuntime.roverX
    r.visible = storyRuntime.active && x < 900
    if (!r.visible) return
    const xt = def.startX + x
    r.position.set(xt, placeHeight(def, xt, 0), 0)
    // Las ruedas giran con lo que avanza.
    const dx = x - last.current
    last.current = x
    if (Math.abs(dx) < 3 && wheels.current) wheels.current.children.forEach((w) => (w.rotation.z -= dx / WHEEL_R))
  })

  return (
    <group ref={g} visible={false}>
      {/* chasis y cubierta */}
      <mesh position={[0, 2.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.9, 1.8]} />
        <meshStandardMaterial color="#d9d6cf" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-1.9, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.9, 12]} />
        <meshStandardMaterial color="#8d8a85" roughness={0.7} />
      </mesh>
      {/* mástil con cabeza */}
      <mesh position={[0.9, 3.9, 0.45]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.8, 8]} />
        <meshStandardMaterial color="#b9b6b0" />
      </mesh>
      <mesh position={[0.9, 4.85, 0.45]} castShadow>
        <boxGeometry args={[0.55, 0.32, 0.8]} />
        <meshStandardMaterial color="#e6e3dc" roughness={0.5} />
      </mesh>
      {/* antena */}
      <mesh position={[-1.2, 3.55, -0.5]} rotation={[0.4, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 20]} />
        <meshStandardMaterial color="#d9d6cf" />
      </mesh>
      {/* bogies y ruedas */}
      {[-1.35, 1.35].map((z) => (
        <mesh key={z} position={[0, 1.55, z]} castShadow>
          <boxGeometry args={[4.0, 0.12, 0.12]} />
          <meshStandardMaterial color="#8d8a85" />
        </mesh>
      ))}
      <group ref={wheels}>
        {WHEELS.map(([x, z], i) => (
          <group key={i} position={[x, WHEEL_R, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.5, 16]} />
              <meshStandardMaterial color="#2c2c30" roughness={0.9} metalness={0.3} />
            </mesh>
            {/* marca para que se vea girar */}
            <mesh position={[WHEEL_R * 0.7, 0, z > 0 ? 0.26 : -0.26]}>
              <boxGeometry args={[0.35, 0.3, 0.04]} />
              <meshStandardMaterial color="#b9b6b0" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
