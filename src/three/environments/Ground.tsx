import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlaceId } from '../../data/story'
import { storyRuntime } from '../../story/runtime'
import { getPlaceGeometry, placeHeight, surfaceDef, type PlaceDef } from './places'
import { Rover } from './Rover'

// Todo lo que hay aquí vive en coordenadas del TERRENO (x = xt, z = mundo) dentro de un grupo que MarsScene
// desplaza según avanza el robot: así el robot no se mueve de sitio pero el suelo pasa por debajo.

function rng(seed: number) {
  let s = (Math.floor(seed * 9973) + 12345) % 2147483647
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/** Reparte instancias (guijarros / rocas) sobre el terreno, más densas cerca de la ruta del robot. */
function scatter(def: PlaceDef, count: number, seed: number, minS: number, maxS: number) {
  const rand = rng(seed)
  const spanX = def.size * 0.4
  const items: { p: THREE.Vector3; s: number; r: THREE.Euler; tint: number }[] = []
  let guard = 0
  while (items.length < count && guard++ < count * 6) {
    const near = rand() < 0.55
    const xt = def.startX + (near ? (rand() - 0.2) * 60 : (rand() - 0.5) * 2 * spanX)
    const z = (rand() - 0.5) * (near ? 12 : 60)
    // Libre el pasillo exacto por donde van las ruedas del robot al inicio.
    if (Math.abs(xt - def.startX) < 1.6 && Math.abs(z) < 1.2) continue
    // Fuera del cuenco de Eagle, que va lleno de otra cosa.
    const s = minS + Math.pow(rand(), 2.2) * (maxS - minS)
    const y = placeHeight(def, xt, z) + s * 0.28
    items.push({ p: new THREE.Vector3(xt, y, z), s, r: new THREE.Euler(rand() * 3, rand() * 3, rand() * 3), tint: rand() })
  }
  return items
}

function Scatter({ def, count, seed, minS, maxS, color, shadows = false }: { def: PlaceDef; count: number; seed: number; minS: number; maxS: number; color: string; shadows?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const items = useMemo(() => scatter(def, count, seed, minS, maxS), [def, count, seed, minS, maxS])
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    const c = new THREE.Color(color)
    const tmp = new THREE.Color()
    items.forEach((it, i) => {
      o.position.copy(it.p)
      o.rotation.copy(it.r)
      o.scale.set(it.s * (0.8 + it.tint * 0.5), it.s * (0.55 + it.tint * 0.35), it.s)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      tmp.copy(c).offsetHSL(0, 0, (it.tint - 0.5) * 0.12)
      m.setColorAt(i, tmp)
    })
    m.count = items.length
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [items, color])
  if (count <= 0) return null
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, count)]} castShadow={shadows} receiveShadow={shadows} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={1} flatShading />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------
// Props de cada lugar
// ---------------------------------------------------------------------------

/** Roca laminada: losas apiladas, "como las páginas de un libro". */
function LayeredRock({ def, at, width, layers, seed }: { def: PlaceDef; at: [number, number]; width: number; layers: number; seed: number }) {
  const slabs = useMemo(() => {
    const rand = rng(seed)
    const base = placeHeight(def, at[0], at[1])
    const out: { pos: [number, number, number]; size: [number, number, number]; rot: number; color: string }[] = []
    let y = base - 0.15
    for (let i = 0; i < layers; i++) {
      const h = 0.1 + rand() * 0.1
      const w = width * (1 - i * 0.07) * (0.9 + rand() * 0.2)
      y += h * 0.5
      out.push({
        pos: [at[0] + (rand() - 0.5) * 0.15, y, at[1] + (rand() - 0.5) * 0.15],
        size: [w, h, width * 0.38 * (1 - i * 0.05)],
        rot: (rand() - 0.5) * 0.12,
        color: i % 2 ? '#7a4a36' : '#93603f',
      })
      y += h * 0.5
    }
    return out
  }, [def, at, width, layers, seed])
  return (
    <group>
      {slabs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, s.rot, 0]} castShadow receiveShadow>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color={s.color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** "Blueberries": esferitas de hematita regadas por el suelo (tamaño exagerado para que se vean). */
function Blueberries({ def, count }: { def: PlaceDef; count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const rand = rng(99)
    const o = new THREE.Object3D()
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const x = 1.2 + Math.pow(rand(), 1.4) * 8
      const z = (rand() - 0.5) * 7
      const s = 0.03 + rand() * 0.035
      o.position.set(x, placeHeight(def, x, z) + s * 0.5, z)
      o.scale.setScalar(s)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      c.set('#7b86a8').offsetHSL(0, 0, (rand() - 0.5) * 0.1)
      m.setColorAt(i, c)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [def, count])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false} castShadow>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial roughness={0.5} metalness={0.25} />
    </instancedMesh>
  )
}

function EagleProps({ def }: { def: PlaceDef }) {
  const bounceY = placeHeight(def, 4.6, -2.3)
  return (
    <>
      {/* La roca que mira con el microscopio, a un brazo de distancia */}
      <LayeredRock def={def} at={[2.15, -0.45]} width={1.25} layers={5} seed={3} />
      {/* El afloramiento laminado del borde del cráter */}
      <LayeredRock def={def} at={[10.4, -1.2]} width={6.5} layers={8} seed={5} />
      <LayeredRock def={def} at={[9.2, 4.6]} width={3.6} layers={5} seed={8} />
      <mesh position={[4.6, bounceY + 0.12, -2.3]} scale={[0.5, 0.32, 0.42]} rotation={[0.3, 0.8, 0.1]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#8d5236" roughness={0.9} flatShading />
      </mesh>
      <Blueberries def={def} count={260} />
    </>
  )
}

/** Vetas de yeso: losas finas y claras en las colinas del borde de Endeavour. */
function VeinProps({ def }: { def: PlaceDef }) {
  const veins = useMemo(() => {
    const rand = rng(17)
    return Array.from({ length: 22 }, () => {
      const x = def.startX + 4 + rand() * 60
      const z = (rand() - 0.5) * 26
      const w = 0.7 + rand() * 1.5
      return { pos: [x, placeHeight(def, x, z) + 0.12, z] as [number, number, number], w, rot: rand() * Math.PI }
    })
  }, [def])
  return (
    <>
      {veins.map((v, i) => (
        <mesh key={i} position={v.pos} rotation={[0, v.rot, (i % 3) * 0.08]} receiveShadow>
          <boxGeometry args={[v.w, 0.2, 0.12]} />
          <meshStandardMaterial color="#efe6d4" roughness={0.8} flatShading />
        </mesh>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Huellas y polvo de las ruedas
// ---------------------------------------------------------------------------

const TRACK_STEP = 0.4

function Tracks({ def }: { def: PlaceDef }) {
  const built = useMemo(() => {
    const x0 = def.startX - 0.8
    const segs = Math.max(1, Math.ceil((def.driveMax + 2) / TRACK_STEP))
    return [-0.66, 0.66].map((z) => {
      const pos = new Float32Array((segs + 1) * 2 * 3)
      const idx: number[] = []
      for (let i = 0; i <= segs; i++) {
        const x = x0 + i * TRACK_STEP
        for (let k = 0; k < 2; k++) {
          const zz = z + (k ? 0.13 : -0.13)
          pos.set([x, placeHeight(def, x, zz) + 0.025, zz], (i * 2 + k) * 3)
        }
        if (i < segs) {
          const a = i * 2
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
        }
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.setIndex(idx)
      g.computeVertexNormals()
      g.setDrawRange(0, 0)
      return { g, x0 }
    })
  }, [def])

  useFrame(() => {
    const rear = def.startX + storyRuntime.robotX - 0.6
    built.forEach(({ g, x0 }) => {
      const n = THREE.MathUtils.clamp(Math.floor((rear - x0) / TRACK_STEP), 0, g.index!.count / 6)
      g.setDrawRange(0, storyRuntime.active ? n * 6 : 0)
    })
  })

  return (
    <>
      {built.map(({ g }, i) => (
        <mesh key={i} geometry={g} frustumCulled={false} renderOrder={1}>
          <meshBasicMaterial color="#3a1c10" transparent opacity={0.55} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} depthWrite={false} />
        </mesh>
      ))}
    </>
  )
}

const DUST_N = 90

function WheelDust({ def, color }: { def: PlaceDef; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const parts = useRef(
    Array.from({ length: DUST_N }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), age: 99, life: 1, s: 0.3 })),
  )
  const carry = useRef(0)
  const o = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    const list = parts.current
    const moving = storyRuntime.active && storyRuntime.robotVisible && (storyRuntime.speed > 0.04 || storyRuntime.slip > 0.1) && storyRuntime.alt < 0.3
    // Ingenuity: la corriente de los rotores levanta polvo cerca del suelo.
    const wash = storyRuntime.active && storyRuntime.robotVisible ? storyRuntime.spin * Math.max(0, 1 - storyRuntime.alt / 7) : 0
    if (wash > 0.05) {
      carry.current += wash * 38 * dt
      while (carry.current >= 1) {
        carry.current -= 1
        const q = list.find((x) => x.age >= x.life)
        if (!q) break
        const a = Math.random() * Math.PI * 2
        const rr = 0.5 + Math.random() * 1.1
        const xt = def.startX + storyRuntime.robotX + Math.cos(a) * rr
        const z = Math.sin(a) * rr
        q.p.set(xt, placeHeight(def, xt, z) + 0.06, z)
        q.v.set(Math.cos(a) * (1.6 + Math.random()), 0.15 + Math.random() * 0.4, Math.sin(a) * (1.6 + Math.random()))
        q.age = 0
        q.life = 0.8 + Math.random() * 0.8
        q.s = 0.16 + Math.random() * 0.22
      }
    } else if (moving) {
      const rate = (storyRuntime.speed * 16 + storyRuntime.slip * 34) * (storyRuntime.sink > 0.01 ? 1.4 : 1)
      carry.current += rate * dt
      while (carry.current >= 1) {
        carry.current -= 1
        const q = list.find((x) => x.age >= x.life)
        if (!q) break
        const side = Math.random() < 0.5 ? -1 : 1
        const xt = def.startX + storyRuntime.robotX - 0.55 - Math.random() * 0.5
        const z = side * (0.5 + Math.random() * 0.4)
        q.p.set(xt, placeHeight(def, xt, z) + 0.08, z)
        q.v.set(-0.25 - Math.random() * 0.5, 0.25 + Math.random() * 0.45, side * (0.1 + Math.random() * 0.4))
        q.age = 0
        q.life = 0.9 + Math.random() * 0.9
        q.s = 0.14 + Math.random() * 0.2
      }
    }
    list.forEach((q, i) => {
      if (q.age >= q.life) {
        o.scale.setScalar(0)
      } else {
        q.age += dt
        q.p.addScaledVector(q.v, dt)
        q.v.multiplyScalar(1 - dt * 1.2)
        const u = q.age / q.life
        o.position.copy(q.p)
        o.scale.setScalar(q.s * (0.4 + Math.sin(Math.min(1, u) * Math.PI) * 1.4))
      }
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, DUST_N]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.32} depthWrite={false} fog />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------

export function Ground({ place }: { place: PlaceId }) {
  const def = surfaceDef(place)
  const geo = getPlaceGeometry(place)
  const story = def.driveMax > 0
  return (
    <>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial vertexColors flatShading={!story} roughness={1} metalness={0} />
      </mesh>
      {story ? (
        <>
          <Scatter def={def} count={def.pebbles} seed={place.length * 7.3} minS={0.04} maxS={0.2} color={def.pebbleColor} />
          <Scatter def={def} count={def.boulders} seed={place.length * 3.1 + 1} minS={0.35} maxS={1.3} color={def.boulderColor} shadows />
          {def.props === 'eagle' && <EagleProps def={def} />}
          {def.props === 'veins' && <VeinProps def={def} />}
          {def.tracks !== false && <Tracks def={def} />}
          <Rover def={def} />
          <WheelDust def={def} color={def.colors.high} />
        </>
      ) : (
        <Scatter def={def} count={def.boulders} seed={13} minS={0.15} maxS={1.1} color={def.boulderColor} shadows />
      )}
    </>
  )
}
