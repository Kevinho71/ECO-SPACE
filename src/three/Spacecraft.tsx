import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../story/runtime'
import { BALL_R, FT, entryPos, landingState, rocketY } from './environments/flightPath'
import { placeHeight, surfaceDef } from './environments/places'

// Piezas 3D del viaje del capítulo 2: cohete Delta II, nave de crucero con cápsula, bola de fuego,
// paracaídas, retrocohetes y airbags. Todo low-poly, con el mismo estilo del resto de la escena.

// ---------------------------------------------------------------------------
// Partículas (humo / fuego) en un anillo de instancias
// ---------------------------------------------------------------------------

type Spawn = (p: THREE.Vector3, v: THREE.Vector3, life: number, size: number) => void

export function Puffs({
  count,
  color,
  opacity,
  additive = false,
  emit,
  active = true,
}: {
  count: number
  color: string
  opacity: number
  additive?: boolean
  emit: (dt: number, spawn: Spawn) => void
  active?: boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const list = useRef(Array.from({ length: count }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), age: 99, life: 1, s: 1 })))
  const cursor = useRef(0)
  const o = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, dtRaw) => {
    const m = ref.current
    if (!m) return
    const dt = Math.min(dtRaw, 0.05)
    if (active) {
      emit(dt, (p, v, life, size) => {
        const q = list.current[cursor.current++ % count]
        q.p.copy(p)
        q.v.copy(v)
        q.age = 0
        q.life = life
        q.s = size
      })
    }
    list.current.forEach((q, i) => {
      if (q.age >= q.life) o.scale.setScalar(0)
      else {
        q.age += dt
        q.p.addScaledVector(q.v, dt)
        const u = q.age / q.life
        o.position.copy(q.p)
        o.scale.setScalar(q.s * (0.35 + u * 1.6) * (1 - u * u))
      }
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------
// Nave: eje +Y = hacia delante (la punta del escudo térmico)
// ---------------------------------------------------------------------------

export function Craft({ shield = true, stage = true, scale = 1 }: { shield?: boolean; stage?: boolean; scale?: number }) {
  return (
    <group scale={scale}>
      {shield && (
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.35, 1.3, 0.75, 28]} />
          <meshStandardMaterial color="#6e4f35" roughness={0.9} flatShading />
        </mesh>
      )}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[1.3, 0.85, 0.7, 28]} />
        <meshStandardMaterial color="#e9e6dd" roughness={0.6} metalness={0.2} flatShading />
      </mesh>
      {stage && (
        <group>
          <mesh position={[0, -0.85, 0]} castShadow>
            <cylinderGeometry args={[0.85, 0.85, 0.45, 20]} />
            <meshStandardMaterial color="#9aa0a8" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* anillo de paneles solares de la etapa de crucero */}
          <mesh position={[0, -0.85, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.08, 24, 1, true]} />
            <meshStandardMaterial color="#1c2b5c" roughness={0.35} metalness={0.5} side={THREE.DoubleSide} emissive="#0c1530" />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.25, 0.4, 0.3, 12]} />
            <meshStandardMaterial color="#555b63" roughness={0.6} metalness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Cohete Delta II en la plataforma
// ---------------------------------------------------------------------------

export function LaunchPad() {
  const rocket = useRef<THREE.Group>(null)
  const flame = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = storyRuntime.t
    const y = rocketY(t)
    const lit = t >= FT.ignition
    if (rocket.current) {
      rocket.current.position.set(0, y, 0)
      // se inclina un poco al ganar altura (ascenso curvo)
      rocket.current.rotation.z = -Math.min(0.5, y * 0.0016)
      // vibración antes de despegar
      if (lit && t < FT.liftoff + 1) rocket.current.position.x = Math.sin(clock.elapsedTime * 60) * 0.05
    }
    if (flame.current) {
      const power = lit ? Math.min(1, 0.45 + (t - FT.ignition) * 0.6) : 0
      const fl = 0.85 + Math.sin(clock.elapsedTime * 38) * 0.12 + Math.random() * 0.08
      flame.current.visible = lit
      flame.current.scale.set(power, power * fl, power)
    }
    if (light.current) light.current.intensity = lit ? 2500 * Math.min(1, (t - FT.ignition) * 0.7 + 0.3) : 0
  })

  // Humo del pad y estela
  const emit = (dt: number, spawn: Spawn) => {
    const t = storyRuntime.t
    if (t < FT.ignition || t > 34) return
    const y = rocketY(t)
    const n = 70 * dt
    for (let i = 0; i < n + (Math.random() < n % 1 ? 1 : 0); i++) {
      const a = Math.random() * Math.PI * 2
      const onPad = y < 14
      const r = onPad ? 2 + Math.random() * 4 : Math.random() * 1.2
      const p = new THREE.Vector3(Math.cos(a) * r, onPad ? 1.2 : Math.max(0, y - 3), Math.sin(a) * r)
      const v = onPad
        ? new THREE.Vector3(Math.cos(a) * (5 + Math.random() * 6), 1 + Math.random() * 2.5, Math.sin(a) * (5 + Math.random() * 6))
        : new THREE.Vector3((Math.random() - 0.5) * 2, -3 - Math.random() * 3, (Math.random() - 0.5) * 2)
      spawn(p, v, onPad ? 4 + Math.random() * 3 : 3 + Math.random() * 2, onPad ? 4 + Math.random() * 3 : 2 + Math.random() * 1.5)
    }
  }

  return (
    <group>
      {/* Suelo y plataforma */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[700, 48]} />
        <meshStandardMaterial color="#0e1511" roughness={1} />
      </mesh>
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 1.2, 16]} />
        <meshStandardMaterial color="#6d6f73" roughness={0.9} />
      </mesh>
      {/* Torre de servicio */}
      <group position={[-9, 0, 0]}>
        {[-1.4, 1.4].flatMap((x) => [-1.4, 1.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 22, z]} castShadow>
            <boxGeometry args={[0.35, 44, 0.35]} />
            <meshStandardMaterial color="#8a2a22" roughness={0.7} />
          </mesh>
        )))}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[0, 3 + i * 4.4, 0]}>
            <boxGeometry args={[3.2, 0.25, 3.2]} />
            <meshStandardMaterial color="#8a2a22" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 45, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshBasicMaterial color="#ff3a2a" />
        </mesh>
      </group>
      {/* Luz de reflectores sobre el cohete en la noche */}
      <pointLight position={[18, 22, 18]} intensity={900} distance={140} color="#fff1d4" />
      <pointLight position={[-18, 30, 16]} intensity={700} distance={140} color="#cfe0ff" />

      {/* Cohete Delta II */}
      <group ref={rocket}>
        {/* primera etapa */}
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.3, 24, 20]} />
          <meshStandardMaterial color="#dfe3ea" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[1.32, 1.32, 3, 20]} />
          <meshStandardMaterial color="#b8501f" roughness={0.6} />
        </mesh>
        {/* segunda etapa y carga */}
        <mesh position={[0, 27, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.3, 6, 20]} />
          <meshStandardMaterial color="#c9ced6" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 32.5, 0]} castShadow>
          <cylinderGeometry args={[1.6, 1.0, 5, 20]} />
          <meshStandardMaterial color="#f1f2f4" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, 37.2, 0]} castShadow>
          <coneGeometry args={[1.6, 4.5, 20]} />
          <meshStandardMaterial color="#f1f2f4" roughness={0.45} metalness={0.2} />
        </mesh>
        {/* tres aceleradores laterales */}
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 + 0.5
          return (
            <group key={i} position={[Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9]}>
              <mesh position={[0, 8, 0]} castShadow>
                <cylinderGeometry args={[0.55, 0.55, 16, 14]} />
                <meshStandardMaterial color="#e6e8ec" roughness={0.5} metalness={0.2} />
              </mesh>
              <mesh position={[0, 16.7, 0]}>
                <coneGeometry args={[0.55, 1.5, 14]} />
                <meshStandardMaterial color="#e6e8ec" roughness={0.5} metalness={0.2} />
              </mesh>
            </group>
          )
        })}
        {/* llama */}
        <group ref={flame} visible={false} position={[0, 0, 0]}>
          <mesh position={[0, -4, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[1.6, 8, 14]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh position={[0, -2.6, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.9, 5.2, 12]} />
            <meshBasicMaterial color="#fff4cf" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <pointLight ref={light} position={[0, -2, 0]} distance={160} color="#ffb060" decay={2} />
        </group>
      </group>
      <Puffs count={160} color="#c9ccd2" opacity={0.5} emit={emit} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Etapa de crucero: nave, Tierra que se aleja y Marte que se acerca
// ---------------------------------------------------------------------------

export function CruiseShip() {
  const spin = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    // Gira lentamente sobre su eje, como la nave real (estabilizada por giro).
    if (spin.current) spin.current.rotation.y = clock.elapsedTime * 0.35
  })
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <Craft scale={0.55} />
      </group>
      <pointLight position={[3, 0, 2]} intensity={60} distance={30} color="#fff3dc" />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Entrada: la nave convertida en bola de fuego
// ---------------------------------------------------------------------------

export function EntryFire() {
  const group = useRef<THREE.Group>(null)
  const fire = useRef<THREE.Group>(null)
  const pos = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }) => {
    entryPos(storyRuntime.t, pos)
    group.current?.position.copy(pos)
    if (!fire.current) return
    const f = 1 + Math.sin(clock.elapsedTime * 30) * 0.08 + Math.random() * 0.06
    fire.current.scale.set(f, f * (0.95 + Math.random() * 0.1), f)
  })
  const emit = (dt: number, spawn: Spawn) => {
    if (storyRuntime.t < FT.entryStart || storyRuntime.t > FT.descentStart) return
    const n = 120 * dt
    for (let i = 0; i < n + (Math.random() < n % 1 ? 1 : 0); i++) {
      const p = new THREE.Vector3(pos.x - 1.2 + Math.random() * 0.4, pos.y + 0.2 + (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6)
      const v = new THREE.Vector3(-6 - Math.random() * 6, 0.8 + Math.random() * 1.2, (Math.random() - 0.5) * 2)
      spawn(p, v, 1.2 + Math.random() * 1.0, 1.2 + Math.random() * 1.2)
    }
  }
  return (
    <>
      {/* el eje +Y de la nave apunta en el sentido del avance (hacia +X y un poco hacia abajo) */}
      <group ref={group}>
        <group rotation={[0, 0, -Math.PI / 2 - 0.3]}>
          <Craft stage={false} />
          <group ref={fire} position={[0, 1.0, 0]}>
            <mesh scale={[1.9, 1.4, 1.9]}>
              <sphereGeometry args={[1, 18, 14]} />
              <meshBasicMaterial color="#ff7a2f" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh scale={[1.25, 1.0, 1.25]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshBasicMaterial color="#ffd9a0" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </mesh>
            <pointLight color="#ff8a40" intensity={900} distance={60} decay={2} />
          </group>
        </group>
      </group>
      <Puffs count={200} color="#ff9a4a" opacity={0.55} additive emit={emit} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Descenso con paracaídas, retrocohetes, airbags y rebotes (sobre el cráter Eagle)
// ---------------------------------------------------------------------------

export function Landing() {
  const root = useRef<THREE.Group>(null)
  const craft = useRef<THREE.Group>(null)
  const shield = useRef<THREE.Group>(null)
  const chute = useRef<THREE.Group>(null)
  const retros = useRef<THREE.Group>(null)
  const bag = useRef<THREE.Group>(null)
  const lander = useRef<THREE.Group>(null)
  const def = useMemo(() => surfaceDef('eagle'), [])

  const lines = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      pts.push(Math.cos(a) * 5, 0, Math.sin(a) * 5, Math.cos(a) * 0.5, -9.5, Math.sin(a) * 0.5)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  const lobes = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, 0)
    const set = new Map<string, THREE.Vector3>()
    const p = ico.attributes.position
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i)
      set.set(v.toArray().map((n) => n.toFixed(3)).join(), v)
    }
    return [...set.values()].map((v) => v.normalize().multiplyScalar(1.05))
  }, [])

  useFrame(({ clock }) => {
    const t = storyRuntime.t
    const s = landingState(t)
    const gy = storyRuntime.groundY
    const y = placeHeight(def, s.x, 0) - gy + s.alt
    const r = root.current
    if (!r) return
    r.visible = t >= FT.descentStart && t < FT.deflateEnd
    r.position.set(s.x, y, 0)

    const airborne = t < FT.airbags
    const inChute = t >= FT.chute && t < FT.airbags + 0.2
    if (craft.current) {
      craft.current.visible = t < FT.airbags + 0.2
      craft.current.rotation.set(0, 0, Math.PI + Math.sin(clock.elapsedTime * 1.3) * 0.08) // el escudo mira hacia abajo
      craft.current.position.set(0, 0, 0)
    }
    if (shield.current) {
      // El escudo térmico se suelta y cae
      const f = t - FT.shieldOff
      shield.current.visible = t < FT.shieldOff + 5 && t >= FT.descentStart
      shield.current.position.set(0.4 * Math.max(0, f), t < FT.shieldOff ? -0.45 : -0.45 - f * f * 3.5, 0)
    }
    if (chute.current) {
      chute.current.visible = inChute
      chute.current.position.set(0, 10.5, 0)
      chute.current.rotation.z = Math.sin(clock.elapsedTime * 1.1) * 0.07
      const open = Math.min(1, Math.max(0, (t - FT.chute) / 0.8))
      chute.current.scale.set(open, open, open)
    }
    if (retros.current) {
      const on = t >= FT.retro && t < FT.airbags
      retros.current.visible = on
      retros.current.scale.y = 0.8 + Math.random() * 0.4
    }
    if (bag.current) {
      const inflate = Math.min(1, Math.max(0, (t - FT.airbags) / 0.7))
      const deflate = t > FT.rest ? 1 - Math.min(1, (t - FT.rest) / (FT.deflateEnd - FT.rest)) : 1
      bag.current.visible = t >= FT.airbags
      bag.current.scale.setScalar(Math.max(0.001, inflate * deflate))
      if (!airborne) bag.current.rotation.z = s.spin
    }
    if (lander.current) {
      lander.current.visible = t >= FT.airbags
      if (!airborne) lander.current.rotation.z = s.spin
    }
  })

  return (
    <group ref={root} visible={false}>
      {/* cápsula (escudo hacia abajo) con retrocohetes */}
      <group ref={craft} visible={false}>
        <Craft shield={false} stage={false} />
        <group ref={retros} visible={false} position={[0, 0.3, 0]}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2
            return (
              <group key={i} position={[Math.cos(a) * 0.95, 0.9, Math.sin(a) * 0.95]}>
                <mesh position={[0, -2.4, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.38, 4.8, 10]} />
                  <meshBasicMaterial color="#ffae4a" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
                </mesh>
              </group>
            )
          })}
          <pointLight position={[0, -1.5, 0]} color="#ffa24a" intensity={500} distance={40} decay={2} />
        </group>
      </group>
      <group ref={shield} visible={false}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.35, 1.3, 0.75, 20]} />
          <meshStandardMaterial color="#6e4f35" roughness={0.9} flatShading />
        </mesh>
      </group>
      {/* paracaídas */}
      <group ref={chute} visible={false}>
        <mesh>
          <sphereGeometry args={[5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f3ece0" roughness={0.9} side={THREE.DoubleSide} flatShading />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 2.6, 24]} />
          <meshBasicMaterial color="#e0602a" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments geometry={lines}>
          <lineBasicMaterial color="#f4efe6" />
        </lineSegments>
      </group>
      {/* airbags + módulo de aterrizaje plegado dentro */}
      <group ref={bag} visible={false}>
        {lobes.map((v, i) => (
          <mesh key={i} position={v.clone().multiplyScalar(BALL_R * 0.55)} castShadow>
            <sphereGeometry args={[BALL_R * 0.62, 14, 10]} />
            <meshStandardMaterial color="#f1eee4" roughness={0.85} />
          </mesh>
        ))}
      </group>
      <group ref={lander} visible={false}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.5, 1.4]} />
          <meshStandardMaterial color="#c9ced6" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
