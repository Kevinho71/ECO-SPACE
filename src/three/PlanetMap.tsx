import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sparkles, Stars, useCursor } from '@react-three/drei'
import { ScaledHtml } from './ScaledHtml'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { FlyTo } from './FlyTo'
import { getSolarTextures } from './lib/solarTextures'

const PLANET_RADIUS = 3

const LABEL_STYLE: React.CSSProperties = { textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.7)' }

function latLonToPosition(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180
  const theta = (lon * Math.PI) / 180
  return [
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.sin(theta),
  ]
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Movimiento de cámara al entrar a la escena (dolly suave, sin saltos).
 * `from`/`to` se calculan UNA sola vez: si cambiaran en cada render, el efecto de montaje
 * devolvería la cámara al punto de partida y se vería un corte brusco al terminar.
 */
function CameraDolly({
  from,
  to,
  target,
  duration = 2.4,
  onDone,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  target: THREE.Vector3
  duration?: number
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const startRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  // Coloca la cámara ANTES del primer fotograma (solo al montar).
  useLayoutEffect(() => {
    camera.position.copy(from)
    camera.lookAt(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }) => {
    if (doneRef.current) return
    if (startRef.current === null) startRef.current = clock.elapsedTime
    const t = Math.min(1, (clock.elapsedTime - startRef.current) / duration)
    camera.position.lerpVectors(from, to, easeInOutCubic(t))
    camera.lookAt(target)
    if (t >= 1) {
      doneRef.current = true
      onDone()
    }
  })

  return null
}

/**
 * Puntos de partida/llegada del dolly según cómo se llegó:
 *  - 'enter' (desde el sistema solar): empieza con el mismo encuadre con el que terminó el zoom
 *    (planeta ≈ 5 radios de distancia) y se aleja hasta la vista general.
 *  - 'return' (de ver un robot): empieza pegado a su baliza y se aleja hasta verla desde lejos.
 */
function useDollyPlan(missionId: string | null, radius: number) {
  const arrival = useAppStore.getState().arrival
  return useMemo(() => {
    const overview = new THREE.Vector3(0, 1.5, 9)
    const target = new THREE.Vector3(0, 0, 0)
    const m = MISSIONS.find((x) => x.id === missionId)
    if (arrival === 'return' && m?.latlon) {
      const b = new THREE.Vector3(...latLonToPosition(m.latlon[0], m.latlon[1], radius * 1.015))
      const u = b.clone().normalize()
      return { from: b.clone().addScaledVector(u, 1.6), to: u.clone().multiplyScalar(9.5), target }
    }
    if (arrival === 'return' && m?.location === 'beyond') {
      return { from: new THREE.Vector3(0, 0.4, 1.6), to: new THREE.Vector3(0, 0, 8), target }
    }
    return { from: overview.clone().setLength(radius * 5.3), to: overview, target }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function Beacon({
  position,
  label,
  color = '#6ef7ff',
  lit = false,
  onClick,
  onHover,
}: {
  position: [number, number, number]
  label: string
  color?: string
  /** Resaltada desde fuera (tarjeta del catálogo) o por el ratón. */
  lit?: boolean
  onClick: () => void
  onHover?: (over: boolean) => void
}) {
  const [pointerOver, setPointerOver] = useState(false)
  const pulse = useRef<THREE.Mesh>(null)
  useCursor(pointerOver)

  useFrame(({ clock }) => {
    const s = (lit ? 1.5 : 1) + 0.25 * Math.sin(clock.elapsedTime * 3)
    pulse.current?.scale.setScalar(s)
  })

  return (
    <group position={position}>
      <group
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setPointerOver(true)
          onHover?.(true)
        }}
        onPointerOut={() => {
          setPointerOver(false)
          onHover?.(false)
        }}
      >
        <mesh ref={pulse}>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Zona de clic más grande que el punto visible. */}
        <mesh>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {lit && (
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}
      <ScaledHtml position={[0, 0.2, 0]} refDistance={7} min={0.85} max={1.6}>
        <div
          className={`select-none whitespace-nowrap font-medium transition-colors ${lit ? 'text-sm text-amber-200' : 'text-xs text-white'}`}
          style={LABEL_STYLE}
        >
          {label}
        </div>
      </ScaledHtml>
    </group>
  )
}

interface ControlsLike {
  target: THREE.Vector3
  enabled: boolean
  update: () => void
}

/**
 * Vuelo alrededor del globo hacia una baliza: la dirección de la cámara gira sobre la
 * esfera (slerp) en vez de ir en línea recta, así nunca atraviesa el planeta aunque
 * el robot esté en la cara oculta.
 */
function SphereFly({
  to,
  approach = 1.6,
  duration = 1.9,
  onNearEnd,
  onArrive,
}: {
  to: THREE.Vector3
  approach?: number
  duration?: number
  onNearEnd?: () => void
  onArrive?: () => void
}) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const plan = useRef<{
    start: number
    dir: THREE.Vector3
    dist: number
    rot: THREE.Quaternion
    endDist: number
    tgt: THREE.Vector3
  } | null>(null)
  const done = useRef(false)
  const nearFired = useRef(false)
  const q = useMemo(() => new THREE.Quaternion(), [])
  const identity = useMemo(() => new THREE.Quaternion(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (controls) controls.enabled = false
    return () => {
      if (controls) controls.enabled = true
    }
  }, [controls])

  useFrame(({ clock }) => {
    if (done.current) return
    if (!plan.current) {
      const dir = camera.position.clone().normalize()
      const endDir = to.clone().normalize()
      plan.current = {
        start: clock.elapsedTime,
        dir,
        dist: camera.position.length(),
        rot: new THREE.Quaternion().setFromUnitVectors(dir, endDir),
        endDist: to.length() + approach,
        tgt: controls ? controls.target.clone() : new THREE.Vector3(),
      }
    }
    const p = plan.current
    const t = Math.min(1, (clock.elapsedTime - p.start) / duration)
    const e = easeInOutCubic(t)

    q.slerpQuaternions(identity, p.rot, e)
    tmp.copy(p.dir).applyQuaternion(q)
    camera.position.copy(tmp).multiplyScalar(THREE.MathUtils.lerp(p.dist, p.endDist, e))
    if (controls) {
      controls.target.lerpVectors(p.tgt, to, e * e)
      controls.update()
    } else {
      camera.lookAt(to)
    }

    if (t >= 0.75 && !nearFired.current) {
      nearFired.current = true
      onNearEnd?.()
    }
    if (t >= 1) {
      done.current = true
      onArrive?.()
    }
  })

  return null
}

/** Globo rotable de la Luna o Marte, con balizas en las coordenadas reales de las misiones. */
function PlanetSurface({ location }: { location: 'moon' | 'mars' }) {
  const selectMission = useAppStore((s) => s.selectMission)
  const transitionTo = useAppStore((s) => s.transitionTo)
  const lastMissionId = useAppStore((s) => s.selectedMissionId)
  const plan = useDollyPlan(lastMissionId, PLANET_RADIUS)
  const tex = getSolarTextures()
  const isMoon = location === 'moon'
  const map = isMoon ? tex.moon : tex.mars
  const missions = MISSIONS.filter((m) => m.location === location && m.latlon)
  const [ready, setReady] = useState(false)
  const [fly, setFly] = useState<{ target: THREE.Vector3; missionId: string } | null>(null)
  const hoveredMission = useAppStore((s) => s.hoveredMission)
  const setHoveredMission = useAppStore((s) => s.setHoveredMission)
  const pendingMission = useAppStore((s) => s.pendingMission)

  const flyToMission = (id: string) => {
    if (fly) return
    const m = missions.find((x) => x.id === id)
    useAppStore.setState({ pendingMission: null })
    if (!m) return
    setFly({ target: new THREE.Vector3(...latLonToPosition(m.latlon![0], m.latlon![1], PLANET_RADIUS * 1.015)), missionId: id })
  }

  // Robot elegido desde el catálogo lateral (UI fuera del Canvas). Espera a que termine el dolly de entrada.
  useEffect(() => {
    if (pendingMission && ready) flyToMission(pendingMission)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMission, ready])

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.3} />
      <ambientLight intensity={isMoon ? 0.55 : 0.7} />
      <directionalLight position={[10, 6, 8]} intensity={isMoon ? 2.5 : 2} color={isMoon ? '#fff3e0' : '#ffd9b0'} />

      <CameraDolly from={plan.from} to={plan.to} target={plan.target} onDone={() => setReady(true)} />

      <mesh>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.22} />
      </mesh>

      {!isMoon && (
        <mesh>
          <sphereGeometry args={[PLANET_RADIUS * 1.04, 32, 32]} />
          <meshBasicMaterial color="#ff9a60" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {missions.map((m) => {
        const pos = latLonToPosition(m.latlon![0], m.latlon![1], PLANET_RADIUS * 1.015)
        return (
          <Beacon
            key={m.id}
            position={pos}
            label={m.nickname ?? m.name}
            lit={hoveredMission === m.id || fly?.missionId === m.id}
            onClick={() => flyToMission(m.id)}
            onHover={(over) => setHoveredMission(over ? m.id : null)}
          />
        )
      })}

      {fly && (
        <SphereFly
          to={fly.target}
          approach={1.6}
          onNearEnd={() => transitionTo(() => selectMission(fly.missionId))}
        />
      )}

      <OrbitControls
        makeDefault
        enabled={ready && !fly}
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
  const transitionTo = useAppStore((s) => s.transitionTo)
  const lastMissionId = useAppStore((s) => s.selectedMissionId)
  const plan = useDollyPlan(lastMissionId, 1)
  const [ready, setReady] = useState(false)
  const [fly, setFly] = useState<{ target: THREE.Vector3; missionId: string } | null>(null)
  const hoveredMission = useAppStore((s) => s.hoveredMission)
  const setHoveredMission = useAppStore((s) => s.setHoveredMission)
  const pendingMission = useAppStore((s) => s.pendingMission)

  const flyToPioneer = () => {
    useAppStore.setState({ pendingMission: null })
    if (!fly) setFly({ target: new THREE.Vector3(0, 0, 0), missionId: 'pioneer10' })
  }

  useEffect(() => {
    if (pendingMission && ready) flyToPioneer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMission, ready])

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.3} />
      <Sparkles count={200} scale={[20, 20, 20]} size={1.5} speed={0.2} opacity={0.4} color="#9ab0ff" />
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 6, 8]} intensity={1.5} />

      <CameraDolly from={plan.from} to={plan.to} target={plan.target} onDone={() => setReady(true)} />

      <Beacon
        position={[0, 0, 0]}
        label="Pioneer 10"
        color="#6ef7ff"
        lit={hoveredMission === 'pioneer10' || !!fly}
        onClick={flyToPioneer}
        onHover={(over) => setHoveredMission(over ? 'pioneer10' : null)}
      />

      {fly && (
        <FlyTo
          target={fly.target}
          approachDistance={1.6}
          onNearEnd={() => transitionTo(() => selectMission(fly.missionId))}
          onArrive={() => setFly(null)}
        />
      )}

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
