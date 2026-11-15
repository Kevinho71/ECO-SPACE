import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { storyRuntime } from '../../story/runtime'
import { sampleLinear, type DeepPlaceId } from '../../data/story'
import { getSolarTextures } from '../lib/solarTextures'
import { SunBody } from '../Sun'
import { StarDome } from './Backdrop'
import { DEEP_PLACES, SUN_POS, samplePath, type DeepBody, type DeepGlow, type DeepPlaceDef } from './deepPlaces'

// Renderizador genérico de los escenarios del espacio profundo (ver deepPlaces.ts).
// Todo se anima en `useFrame` leyendo `storyRuntime.placeT`: nada vive en estado de React.

/** Pseudoaleatorio determinista (los mismos asteroides y motas en cada visita). */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

const mod = (a: number, n: number) => ((a % n) + n) % n

// ---------------------------------------------------------------------------
// Cuerpos (planetas y lunas)
// ---------------------------------------------------------------------------

function Body({ def }: { def: DeepBody }) {
  const tex = getSolarTextures()
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const map = tex[def.tex]

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const t = storyRuntime.placeT
    samplePath(def.path, t, g.position)
    let visible = true
    if (def.until !== undefined) {
      if (t >= def.until) visible = false
      else if (t > def.until - 0.9) visible = Math.floor(t * 18) % 2 === 0 // parpadea antes de apagarse
    }
    g.visible = visible
    if (mesh.current) mesh.current.rotation.y += dt * (def.spin ?? 0.03)
  })

  return (
    <group ref={group} rotation={[def.tilt ?? 0.2, 0, 0]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[def.radius, 48, 48]} />
        <meshStandardMaterial
          map={map}
          color={def.tint ?? '#ffffff'}
          roughness={1}
          metalness={0}
          emissive="#ffffff"
          emissiveMap={map}
          emissiveIntensity={0.3}
          fog={false}
        />
      </mesh>
      {def.halo && (
        <mesh>
          <sphereGeometry args={[def.radius * 1.035, 32, 32]} />
          <meshBasicMaterial color={def.halo} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} fog={false} />
        </mesh>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Asteroides que pasan de largo (instanciados)
// ---------------------------------------------------------------------------

const ROCK_SPAN = 160
/** Los asteroides pasan siempre a más de esto del eje de la sonda (no la atraviesan ni rozan la cámara). */
const ROCK_CLEARANCE = 5

function Rocks({ cfg }: { cfg: NonNullable<DeepPlaceDef['rocks']> }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => {
    const r = rng(4242)
    return Array.from({ length: cfg.count }, () => {
      const ang = r() * Math.PI * 2
      const rad = ROCK_CLEARANCE + r() * 17
      return {
        x0: r() * ROCK_SPAN,
        y: Math.sin(ang) * rad * 0.7,
        z: Math.cos(ang) * rad,
        size: 0.5 + r() * 1.5,
        rx: r() * Math.PI,
        ry: r() * Math.PI,
        spin: (r() - 0.5) * 0.8,
        threshold: r(), // con densidad d, se ve si threshold < d
      }
    })
  }, [cfg.count])

  useFrame(() => {
    const m = ref.current
    if (!m) return
    const t = storyRuntime.placeT
    const d = sampleLinear(cfg.density, t, 1)
    for (let i = 0; i < data.length; i++) {
      const a = data[i]
      const x = mod(a.x0 + cfg.speed * t, ROCK_SPAN) - ROCK_SPAN / 2
      // Aparecen y desaparecen encogiéndose (nunca de golpe).
      const s = a.size * THREE.MathUtils.clamp((d - a.threshold) * 8, 0, 1)
      dummy.position.set(x, a.y, a.z)
      dummy.rotation.set(a.rx + t * a.spin, a.ry + t * a.spin * 0.7, 0)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cfg.count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8a8278" roughness={1} flatShading />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------
// Motas de polvo: dan sensación de velocidad (se alejan hacia +X, porque la sonda viaja hacia −X)
// ---------------------------------------------------------------------------

const DUST_COUNT = 420
const DUST_SPAN = 120

function Dust({ speed }: { speed: number }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, base } = useMemo(() => {
    const r = rng(777)
    const base = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      base[i * 3] = r() * DUST_SPAN
      base[i * 3 + 1] = (r() - 0.5) * 50
      base[i * 3 + 2] = (r() - 0.5) * 70
    }
    return { positions: new Float32Array(base), base }
  }, [])

  useFrame(() => {
    const p = ref.current
    if (!p) return
    const t = storyRuntime.placeT
    const attr = p.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < DUST_COUNT; i++) {
      attr.setX(i, mod(base[i * 3] + speed * t, DUST_SPAN) - DUST_SPAN / 2)
      attr.setY(i, base[i * 3 + 1])
      attr.setZ(i, base[i * 3 + 2])
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} sizeAttenuation color="#cfe0ff" transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

// ---------------------------------------------------------------------------
// Anillos de señal: la voz de la sonda viaja hacia la Tierra (+X). Se apagan con la señal.
// ---------------------------------------------------------------------------

const PULSE_RINGS = 5
const PULSE_LENGTH = 60

function Pulses({ life }: { life: number }) {
  const rings = useRef<(THREE.Mesh | null)[]>([])
  useFrame(() => {
    const t = storyRuntime.placeT
    const strength = THREE.MathUtils.clamp(storyRuntime.signal, 0, 1) * (1 - storyRuntime.powerOff)
    for (let i = 0; i < PULSE_RINGS; i++) {
      const m = rings.current[i]
      if (!m) continue
      const age = mod(t + (i * life) / PULSE_RINGS, life) / life // 0 → 1
      m.position.x = 1.4 + age * PULSE_LENGTH
      m.scale.setScalar(0.5 + age * 7)
      ;(m.material as THREE.MeshBasicMaterial).opacity = strength * Math.pow(1 - age, 1.6) * 0.55
    }
  })
  return (
    <group>
      {Array.from({ length: PULSE_RINGS }, (_, i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1, 0.035, 8, 56]} />
          <meshBasicMaterial color="#9fe7ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Cola magnética de Júpiter: capas translúcidas que se extienden hacia −X desde el planeta
// ---------------------------------------------------------------------------

const TAIL_LENGTH = 420

function Tail({ def }: { def: DeepPlaceDef }) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const body = def.bodies.find((b) => b.id === 'jupiter')
  const layers = [
    { k: 1, o: 0.05 },
    { k: 0.65, o: 0.07 },
    { k: 0.35, o: 0.1 },
  ]
  useFrame(({ clock }) => {
    if (!group.current || !body) return
    samplePath(body.path, storyRuntime.placeT, group.current.position)
    layers.forEach((l, i) => {
      const m = mats.current[i]
      if (m) m.opacity = l.o * (0.8 + 0.2 * Math.sin(clock.elapsedTime * 1.4 + i))
    })
  })
  const r0 = body?.radius ?? 20
  return (
    <group ref={group}>
      {layers.map((l, i) => (
        // Cilindro abierto girado: su extremo "superior" (ancho) apunta hacia −X.
        <mesh key={i} position={[-TAIL_LENGTH / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[r0 * 1.7 * l.k, r0 * l.k, TAIL_LENGTH, 40, 1, true]} />
          <meshBasicMaterial
            ref={(m) => (mats.current[i] = m)}
            color="#7aa9ff"
            transparent
            opacity={l.o}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Llama del motor de descenso (módulo lunar frenando): sale por la campana, en el origen, hacia abajo
// ---------------------------------------------------------------------------

function Flame({ y = 0.3 }: { y?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const e = clock.elapsedTime
    // Parpadeo rápido; el motor no se enciende si la historia está en pausa en el punto inicial.
    g.current?.scale.set(1, 1 + 0.12 * Math.sin(e * 38) + 0.08 * Math.sin(e * 23), 1)
  })
  return (
    // La campana del motor está en y = 0,35: la llama nace ahí y apunta hacia abajo.
    <group ref={g} position={[0, y, 0]}>
      <mesh position={[0, -2.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 4.4, 20, 1, true]} />
        <meshBasicMaterial color="#ffd08a" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 2.4, 16, 1, true]} />
        <meshBasicMaterial color="#fff4dc" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Resplandor de una estrella lejana (Aldebarán)
// ---------------------------------------------------------------------------

let glowMap: THREE.CanvasTexture | null = null
function getGlowMap() {
  if (glowMap) return glowMap
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.15, 'rgba(255,255,255,0.7)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  glowMap = new THREE.CanvasTexture(c)
  glowMap.colorSpace = THREE.SRGBColorSpace
  return glowMap
}

function Glow({ def }: { def: DeepGlow }) {
  const sprite = useRef<THREE.Sprite>(null)
  useFrame(({ clock }) => {
    // Palpita muy despacio y crece apenas durante el legado.
    const grow = 1 + Math.min(0.2, storyRuntime.placeT * 0.004)
    const k = def.size * grow * (1 + 0.03 * Math.sin(clock.elapsedTime * 0.9))
    sprite.current?.scale.set(k, k, 1)
  })
  return (
    <sprite ref={sprite} position={def.pos}>
      <spriteMaterial map={getGlowMap()} color={def.color} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} fog={false} />
    </sprite>
  )
}

// ---------------------------------------------------------------------------

/** Escenario del espacio profundo para el lugar `place` de la historia. */
export function DeepSpace({ place }: { place: DeepPlaceId }) {
  const def = DEEP_PLACES[place]
  return (
    <>
      <color attach="background" args={['#04050c']} />
      <hemisphereLight args={['#8fa4ff', '#1a1a30', 0.4]} />
      <directionalLight position={SUN_POS} intensity={2.8} color="#fff6e6" />
      <StarDome opacity={0.85} />
      {/* El Sol no se vuelve a montar al cambiar de lugar: solo cambia su tamaño. */}
      <SunBody radius={def.sunRadius} position={SUN_POS} />

      {def.bodies.map((b) => (
        <Body key={`${place}-${b.id}`} def={b} />
      ))}
      {def.rocks && <Rocks key={`${place}-rocks`} cfg={def.rocks} />}
      {def.dust > 0 && <Dust key={`${place}-dust`} speed={def.dust} />}
      {def.tail && <Tail key={`${place}-tail`} def={def} />}
      {def.pulses && <Pulses key={`${place}-pulses`} life={def.pulses} />}
      {def.flame && <Flame key={`${place}-flame`} y={def.flameY} />}
      {def.glows?.map((g, i) => (
        <Glow key={`${place}-glow-${i}`} def={g} />
      ))}

      {/* Reflejos para los metales dorados y plateados de la sonda (igual que SpaceScene). */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 8, -10]} scale={[30, 30, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.7} position={[-10, -2, 6]} rotation-y={Math.PI / 2} scale={[20, 5, 1]} color="#5566bb" />
      </Environment>
    </>
  )
}
