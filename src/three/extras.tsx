import type { ComponentType } from 'react'
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../story/runtime'
import { terrainHeight, type TerrainOpts } from './lib/terrain'

// Piezas 3D que la historia necesita y que NO están en el GLB del robot. Cada una se registra por id de misión
// (MISSION_EXTRAS) y lee sus valores de las pistas con nombre de la historia (`storyRuntime.tracks`).

const NO_TRACKS: Record<string, number> = {}
/** Pistas de la historia en curso (vacías si no hay historia: las piezas quedan en su estado de reposo). */
const tracks = () => (storyRuntime.active ? storyRuntime.tracks : NO_TRACKS)

/** Mismo relieve que dibuja LunarScene (para apoyar las piezas sobre el suelo). */
const LUNAR_TERRAIN: TerrainOpts = { seed: 7, height: 1.4, flattenStart: 3, flattenEnd: 8, craters: 16 }
const groundY = (x: number, z: number) => terrainHeight(x, -z, LUNAR_TERRAIN)

// ---------------------------------------------------------------------------
// Piezas del módulo lunar del Apolo (esquemáticas, no réplicas)
// ---------------------------------------------------------------------------

/** Altura (y) a la que se apoya la cabina sobre la etapa de descenso: nodo `ascent_mount` del GLB de Eagle. */
const MOUNT_Y = 1.62

/** Cabina de la tripulación: cuerpo bajo, cabina, ventanas, escotilla (hacia +X) y antena. Origen en la base. */
function CabinParts() {
  return (
    <>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.25, 1.1, 8]} />
        <meshStandardMaterial color="#cfcdc4" roughness={0.7} metalness={0.25} flatShading />
      </mesh>
      <mesh position={[0.1, 1.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.85, 1.7]} />
        <meshStandardMaterial color="#b9b7ae" roughness={0.65} metalness={0.3} flatShading />
      </mesh>
      {[0.42, -0.42].map((z) => (
        <mesh key={z} position={[0.97, 1.55, z]}>
          <boxGeometry args={[0.04, 0.3, 0.3]} />
          <meshStandardMaterial color="#12161f" emissive="#1c2740" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[1.17, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.6, 0.55]} />
        <meshStandardMaterial color="#8a8780" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[-0.3, 2.3, 0.4]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
        <meshStandardMaterial color="#e8e6de" roughness={0.6} />
      </mesh>
    </>
  )
}

/** Llama cónica hacia abajo (origen en la boquilla). `size` es la altura de la llama exterior. */
function ExhaustFlame({ size = 4, width = 0.6 }: { size?: number; width?: number }) {
  return (
    <>
      <mesh position={[0, -size / 2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width, size, 18, 1, true]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -size * 0.28, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[width * 0.5, size * 0.56, 14, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

/** Escala del flicker de una llama (0 = apagada). */
function flicker(e: number, fire: number) {
  return fire * (1 + 0.12 * Math.sin(e * 41) + 0.08 * Math.sin(e * 27))
}

/**
 * Etapa de ascenso del módulo lunar de Apolo 11: la cabina donde viajan Armstrong y Aldrin.
 * Va sobre la etapa de descenso (el robot) y, al despegar, la deja atrás.
 *   tracks.ascent = altura sobre el soporte (m) · tracks.fire = motor encendido (0–1)
 */
function AscentStage() {
  const group = useRef<THREE.Group>(null)
  const flame = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const tr = tracks()
    const h = tr.ascent ?? 0
    const fire = tr.fire ?? 0
    g.position.y = MOUNT_Y + h
    g.visible = h < 400
    if (flame.current) {
      flame.current.visible = fire > 0.02
      flame.current.scale.set(1, Math.max(0.001, flicker(clock.elapsedTime, fire)), 1)
    }
  })

  return (
    <group ref={group} position={[0, MOUNT_Y, 0]}>
      <CabinParts />
      <group ref={flame} visible={false}>
        <ExhaustFlame size={3.2} width={0.5} />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Surveyor 3
// ---------------------------------------------------------------------------

const warm = new THREE.Color('#ffb070')

/** Barra entre dos puntos (para las patas del módulo del Apolo 12). */
function Rod({ a, b, r = 0.075, color = '#8f8c86' }: { a: [number, number, number]; b: [number, number, number]; r?: number; color?: string }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)
    const dir = vb.clone().sub(va)
    return {
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      len: dir.length(),
    }
  }, [a, b])
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 8]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.4} />
    </mesh>
  )
}

/** Módulo lunar "Intrepid" (Apolo 12): etapa de descenso dorada + cabina. Esquemático. */
function IntrepidLM() {
  const legs = useMemo(
    () =>
      [0, 1, 2, 3].map((k) => {
        const ang = Math.PI / 4 + (k * Math.PI) / 2
        return {
          top: [Math.cos(ang) * 1.25, 0.95, Math.sin(ang) * 1.25] as [number, number, number],
          foot: [Math.cos(ang) * 2.35, 0.13, Math.sin(ang) * 2.35] as [number, number, number],
        }
      }),
    [],
  )
  return (
    <>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.95, 8]} />
        <meshStandardMaterial color="#c9a24a" roughness={0.5} metalness={0.6} flatShading />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[2.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#e9e4d4" roughness={0.8} />
      </mesh>
      {legs.map((l, i) => (
        <group key={i}>
          <Rod a={l.top} b={l.foot} />
          <mesh position={l.foot}>
            <cylinderGeometry args={[0.3, 0.3, 0.06, 16]} />
            <meshStandardMaterial color="#c9a24a" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      ))}
      <group position={[0, MOUNT_Y, 0]}>
        <CabinParts />
      </group>
    </>
  )
}

/** Astronauta esquemático (blanco, visor dorado), mirando hacia +X. */
function Astronaut() {
  return (
    <>
      {[0.1, -0.1].map((z) => (
        <mesh key={z} position={[0, 0.42, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.84, 8]} />
          <meshStandardMaterial color="#e8e7e2" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.36, 0.62, 0.5]} />
        <meshStandardMaterial color="#f2f1ec" roughness={0.8} />
      </mesh>
      <mesh position={[-0.28, 1.2, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.4]} />
        <meshStandardMaterial color="#dcdad2" roughness={0.8} />
      </mesh>
      <mesh position={[0.02, 1.68, 0]}>
        <sphereGeometry args={[0.2, 14, 12]} />
        <meshStandardMaterial color="#f2f1ec" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 1.68, 0]}>
        <sphereGeometry args={[0.17, 12, 10]} />
        <meshStandardMaterial color="#b88a2a" roughness={0.2} metalness={0.8} />
      </mesh>
    </>
  )
}

// Dónde aterriza el Apolo 12 y hasta dónde caminan: a escala de narración (en la realidad fueron unos 180 m).
const LM_AT: [number, number] = [24, -19]
const LM_SCALE = 1.9
const LM_YAW = -2.46 // la escalera (+X) mira hacia Surveyor 3 (en el origen)
const WALK_START: [number, number] = [LM_AT[0] - 2.6, LM_AT[1] + 2.1]
const WALK_END: [number, number] = [2.8, -1.7]
const ASTRONAUT_OFFSETS: [number, number][] = [
  [0, 0],
  [1.1, 1.0],
]
const STRIPPED = ['tv_camera', 'sampler_scoop']

/**
 * Piezas de la historia de Surveyor 3 que no están en su GLB:
 *  - llama de sus motores durante los rebotes (`fire`),
 *  - el atardecer: baja y calienta la luz según `dust` (0 = día, 1 = noche lunar),
 *  - la visita del Apolo 12: módulo lunar (`lmShow`, `lmAlt`, `lmFire`), astronautas (`astro`, `walk`) y la
 *    cámara y la pala que se llevan (`strip`).
 */
function SurveyorExtras() {
  const scene = useThree((s) => s.scene)
  const flame = useRef<THREE.Group>(null)
  const lm = useRef<THREE.Group>(null)
  const lmFlame = useRef<THREE.Group>(null)
  const astro = useRef<(THREE.Group | null)[]>([])
  const prevWalk = useRef(0)
  const facingBack = useRef(false)
  const stripped = useRef<THREE.Object3D[]>([])
  const lights = useRef<{ l: THREE.Light; i: number; c: THREE.Color; y: number }[]>([])

  useFrame(({ clock }) => {
    const e = clock.elapsedTime
    const tr = tracks()

    // Llama de los motores (la posición sigue a la nave mientras rebota).
    if (flame.current) {
      const fire = tr.fire ?? 0
      flame.current.visible = fire > 0.02
      flame.current.position.y = -storyRuntime.sink + (tr.lift ?? 0) + 0.7
      flame.current.scale.set(1, Math.max(0.001, flicker(e, fire)), 1)
    }

    // Piezas que se llevan los astronautas.
    if (stripped.current.length === 0 || !stripped.current[0].parent) {
      stripped.current = STRIPPED.map((n) => scene.getObjectByName(n)).filter((o): o is THREE.Object3D => !!o)
    }
    const gone = (tr.strip ?? 0) > 0.5
    for (const o of stripped.current) o.visible = !gone

    // Atardecer (y noche): luces del escenario lunar.
    if (lights.current.length === 0 || !lights.current[0].l.parent) {
      lights.current = []
      scene.traverse((o) => {
        const l = o as THREE.Light
        if (l.isLight && ((l as THREE.DirectionalLight).isDirectionalLight || (l as THREE.HemisphereLight).isHemisphereLight)) {
          lights.current.push({ l, i: l.intensity, c: l.color.clone(), y: l.position.y })
        }
      })
    }
    const dusk = storyRuntime.active ? storyRuntime.dust : 0
    for (const b of lights.current) {
      b.l.intensity = b.i * (1 - 0.94 * dusk)
      b.l.color.copy(b.c).lerp(warm, dusk * 0.6)
      if ((b.l as THREE.DirectionalLight).isDirectionalLight) b.l.position.y = b.y * (1 - 0.8 * dusk)
    }

    // Módulo del Apolo 12 descendiendo y posado.
    if (lm.current) {
      const show = (tr.lmShow ?? 0) > 0.5
      lm.current.visible = show
      if (show) {
        lm.current.position.set(LM_AT[0], groundY(LM_AT[0], LM_AT[1]) + (tr.lmAlt ?? 0), LM_AT[1])
      }
    }
    if (lmFlame.current) {
      const fire = tr.lmFire ?? 0
      lmFlame.current.visible = fire > 0.02
      lmFlame.current.scale.set(1, Math.max(0.001, flicker(e, fire)), 1)
    }

    // Astronautas caminando hacia Surveyor 3 (y de vuelta).
    const showAstro = (tr.astro ?? 0) > 0.5
    const u = tr.walk ?? 0
    if (u !== prevWalk.current) facingBack.current = u < prevWalk.current
    prevWalk.current = u
    const dx = WALK_END[0] - WALK_START[0]
    const dz = WALK_END[1] - WALK_START[1]
    const yaw = Math.atan2(-dz, dx) + (facingBack.current ? Math.PI : 0)
    astro.current.forEach((g, i) => {
      if (!g) return
      g.visible = showAstro
      if (!showAstro) return
      const o = ASTRONAUT_OFFSETS[i]
      const x = WALK_START[0] + dx * u + o[0]
      const z = WALK_START[1] + dz * u + o[1]
      g.position.set(x, groundY(x, z) + 0.06 * Math.abs(Math.sin(u * 70 + i)), z)
      g.rotation.y = yaw
    })
  })

  return (
    <>
      <group ref={flame} visible={false}>
        <ExhaustFlame size={4.2} width={0.7} />
      </group>
      <group ref={lm} visible={false} scale={LM_SCALE} rotation={[0, LM_YAW, 0]}>
        <IntrepidLM />
        <group ref={lmFlame} position={[0, 0.3, 0]} visible={false}>
          <ExhaustFlame size={4.4} width={0.6} />
        </group>
      </group>
      {ASTRONAUT_OFFSETS.map((_, i) => (
        <group key={i} ref={(g) => (astro.current[i] = g)} visible={false}>
          <Astronaut />
        </group>
      ))}
    </>
  )
}

/** Piezas extra por misión (las que no están en su GLB). */
export const MISSION_EXTRAS: Record<string, ComponentType> = {
  eagle: AscentStage,
  surveyor3: SurveyorExtras,
}
