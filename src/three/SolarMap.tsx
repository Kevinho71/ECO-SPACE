import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, useCursor } from '@react-three/drei'
import { ScaledHtml } from './ScaledHtml'
import * as THREE from 'three'
import { useAppStore, type LocationId } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { SceneCamera } from './SceneCamera'
import { FlyTo } from './FlyTo'
import { getSolarTextures } from './lib/solarTextures'
import { SunBody } from './Sun'
import { TOUR_SEEN_KEY, writeFlag } from '../lib/prefs'

// ---------------------------------------------------------------------------
// Sistema solar realista y rotable. Los destinos con robot (Luna, Marte y la
// baliza "Más allá") se resaltan con un halo luminoso y, al pulsarlos, la
// cámara vuela hacia ellos antes de entrar al globo planetario.
//
// Interacción del menú:
//  - Las órbitas se frenan hasta detenerse cuando hay un destino resaltado,
//    durante el vuelo y durante el recorrido guiado: así el blanco no se escapa.
//  - Cada destino tiene una zona de clic invisible mayor que el planeta.
//  - El resaltado se comparte con la barra de destinos (`hoveredLocation`).
// ---------------------------------------------------------------------------

const LABEL_STYLE: React.CSSProperties = { textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.7)' }

/** Recorrido guiado: orden de las paradas (el paso siguiente a la última vuelve a la vista general). */
export const TOUR_STOPS: LocationId[] = ['moon', 'mars', 'beyond']
const TOUR_STOP_SECONDS = 3.4
const TOUR_DISTANCE: Record<LocationId, number> = { moon: 1.5, mars: 2.4, beyond: 3.2 }
const HOME_POSITION = new THREE.Vector3(0, 12, 26)
const FLY_DISTANCE: Record<LocationId, number> = { moon: 0.5, mars: 1.4, beyond: 1.2 }

/** Velocidad global de las órbitas (1 = normal, 0 = detenidas). Compartida por todos los Orbiter. */
const orbitClock = { scale: 1 }

/**
 * Resplandor de los destinos con robots: un sprite con degradado radial en tonos cálidos
 * (crema → ámbar → naranja → transparente). Siempre mira a la cámara y, como no escribe
 * profundidad, el propio planeta tapa la parte central: solo se ve el brillo alrededor del borde.
 */
const GLOW_PULSE_SPEED = 1.1
const GLOW_OPACITY = 0.55
const GLOW_OPACITY_LIT = 0.95
const GLOW_PULSE = 0.08
/** Cuánto crece el resplandor al resaltar el destino. */
const GLOW_LIT_GROWTH = 0.35

let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0.0, 'rgba(255, 255, 255, 1)')
  g.addColorStop(0.18, 'rgba(250, 252, 255, 0.85)')
  g.addColorStop(0.38, 'rgba(235, 242, 255, 0.45)')
  g.addColorStop(0.6, 'rgba(220, 232, 250, 0.16)')
  g.addColorStop(0.8, 'rgba(210, 225, 245, 0.05)')
  g.addColorStop(1.0, 'rgba(200, 220, 240, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

const noRaycast = () => null

/** Resplandor cálido que respira despacio y se intensifica con suavidad al resaltar. */
function WarmGlow({ size, lit, phase = 0 }: { size: number; lit: boolean; phase?: number }) {
  const sprite = useRef<THREE.Sprite>(null)
  const litAmount = useRef(0)
  const map = getGlowTexture()

  useFrame(({ clock }, delta) => {
    const s = sprite.current
    if (!s) return
    litAmount.current += ((lit ? 1 : 0) - litAmount.current) * (1 - Math.exp(-Math.min(delta, 0.1) * 6))
    const wave = Math.sin(clock.elapsedTime * GLOW_PULSE_SPEED + phase)
    const scale = size * (1 + GLOW_LIT_GROWTH * litAmount.current + 0.05 * wave)
    s.scale.set(scale, scale, 1)
    ;(s.material as THREE.SpriteMaterial).opacity =
      THREE.MathUtils.lerp(GLOW_OPACITY, GLOW_OPACITY_LIT, litAmount.current) + GLOW_PULSE * wave
  })

  return (
    <sprite ref={sprite} raycast={noRaycast}>
      <spriteMaterial
        map={map}
        transparent
        opacity={GLOW_OPACITY}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}

function robotsLabel(id: LocationId) {
  const n = MISSIONS.filter((m) => m.location === id).length
  return n === 1 ? '1 robot' : `${n} robots`
}

function Orbiter({
  radius,
  speed,
  phase = 0,
  groupRef,
  children,
}: {
  radius: number
  speed: number
  phase?: number
  groupRef?: { current: THREE.Group | null } | null
  children: React.ReactNode
}) {
  const local = useRef<THREE.Group>(null)
  const angle = useRef(phase)
  useFrame((_, delta) => {
    angle.current += Math.min(delta, 0.1) * speed * orbitClock.scale
    local.current?.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius)
  })
  useEffect(() => {
    if (groupRef) groupRef.current = local.current
    return () => {
      if (groupRef) groupRef.current = null
    }
  }, [groupRef])
  return <group ref={local}>{children}</group>
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 160]} />
      <meshBasicMaterial color="#8a9bbf" transparent opacity={0.18} />
    </mesh>
  )
}

/** Esfera invisible que amplía la zona de clic (no se dibuja, pero el raycast la detecta). */
function HitArea({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/** Distancia (cámara en la vista general) a la que las etiquetas del sistema solar se ven a tamaño normal. */
const LABEL_REF_DISTANCE = 26

function DestinationLabel({ title, sub, lit, y }: { title: string; sub: string; lit: boolean; y: number }) {
  return (
    <ScaledHtml position={[0, y, 0]} refDistance={LABEL_REF_DISTANCE} min={0.8} max={1.8}>
      <div className="select-none whitespace-nowrap text-center text-white" style={LABEL_STYLE}>
        <div className={`font-semibold transition-colors ${lit ? 'text-base text-amber-200' : 'text-sm'}`}>{title}</div>
        {lit && <div className="text-[11px] text-slate-200">{sub} · clic para visitar</div>}
      </div>
    </ScaledHtml>
  )
}

interface PlanetProps {
  radius: number
  map: THREE.Texture | null
  label?: string
  labelBelow?: boolean
  selectable?: boolean
  id?: LocationId
  lit?: boolean
  hitRadius?: number
  onSelect?: (id: LocationId) => void
  onHover?: (id: LocationId | null) => void
  selfRotation?: number
  tilt?: number
}

function Planet({
  radius,
  map,
  label,
  labelBelow,
  selectable,
  id,
  lit = false,
  hitRadius,
  onSelect,
  onHover,
  selfRotation = 0.15,
  tilt = 0,
}: PlanetProps) {
  const [pointerOver, setPointerOver] = useState(false)
  const mesh = useRef<THREE.Mesh>(null)
  useCursor(!!selectable && pointerOver)

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * selfRotation
  })

  const body = (
    <mesh ref={mesh}>
      <sphereGeometry args={[radius, 48, 48]} />
      {map ? (
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.32} />
      ) : (
        <meshStandardMaterial color="#cccccc" roughness={0.9} />
      )}
    </mesh>
  )

  return (
    <group rotation={[0, 0, tilt]}>
      {selectable ? (
        <group
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.(id!)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setPointerOver(true)
            onHover?.(id!)
          }}
          onPointerOut={() => {
            setPointerOver(false)
            onHover?.(null)
          }}
        >
          {body}
          <HitArea radius={hitRadius ?? radius * 2} />
        </group>
      ) : (
        body
      )}

      {/* Diámetro del resplandor: ~5,5 veces el radio, con un mínimo para que la Luna se note. */}
      {selectable && <WarmGlow size={Math.max(radius * 5.5, 0.7)} lit={lit} phase={radius * 7} />}

      {label && selectable && id && (
        <DestinationLabel title={label} sub={robotsLabel(id)} lit={lit} y={radius + 0.35} />
      )}
      {label && !selectable && (
        <ScaledHtml
          position={[0, labelBelow ? -(radius + 0.3) : radius + 0.35, 0]}
          refDistance={LABEL_REF_DISTANCE}
          min={0.75}
          max={1.5}
        >
          <div className="select-none whitespace-nowrap text-xs font-medium text-white/80" style={LABEL_STYLE}>
            {label}
          </div>
        </ScaledHtml>
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
    if (ref.current) ref.current.rotation.y += delta * 0.02 * orbitClock.scale
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

function BeyondBeacon({
  lit,
  onSelect,
  onHover,
}: {
  lit: boolean
  onSelect: (id: LocationId) => void
  onHover: (id: LocationId | null) => void
}) {
  const [pointerOver, setPointerOver] = useState(false)
  useCursor(pointerOver)

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onSelect('beyond')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setPointerOver(true)
        onHover('beyond')
      }}
      onPointerOut={() => {
        setPointerOver(false)
        onHover(null)
      }}
    >
      {/* Núcleo cálido pequeño (como una estrella lejana) + resplandor, en lugar de un bloque sólido. */}
      <mesh>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <WarmGlow size={2.2} lit={lit} phase={1.7} />
      <HitArea radius={0.8} />
      <DestinationLabel title="Más allá" sub={robotsLabel('beyond')} lit={lit} y={0.75} />
    </group>
  )
}

interface ControlsLike {
  target: THREE.Vector3
  enabled: boolean
  update: () => void
}

type DestRefs = Record<LocationId, { current: THREE.Group | null }>

/**
 * Recorrido guiado de la primera visita: la cámara se acerca a cada destino y
 * vuelve a la vista general. Las órbitas están detenidas mientras dura.
 * Saltar el recorrido = ir directamente al paso final (vuelta a la vista general).
 */
function Tour({ refs }: { refs: DestRefs }) {
  const step = useAppStore((s) => s.tourStep)
  const setTourStep = useAppStore((s) => s.setTourStep)
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const stepStart = useRef<number | null>(null)
  const goalPos = useMemo(() => new THREE.Vector3(), [])
  const goalTarget = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    stepStart.current = null
  }, [step])

  useEffect(() => {
    if (!controls) return
    controls.enabled = false
    return () => {
      controls.enabled = true
    }
  }, [controls])

  useFrame(({ clock }, delta) => {
    if (step === null) return
    if (stepStart.current === null) stepStart.current = clock.elapsedTime
    const elapsed = clock.elapsedTime - stepStart.current

    if (step < TOUR_STOPS.length) {
      const id = TOUR_STOPS[step]
      const g = refs[id].current
      if (g) {
        g.getWorldPosition(goalTarget)
        // Cámara del lado del Sol (cara iluminada) y algo por encima del plano orbital.
        dir.set(-goalTarget.x, 0, -goalTarget.z)
        if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1)
        dir.normalize()
        dir.y = 0.8
        dir.normalize()
        goalPos.copy(goalTarget).addScaledVector(dir, TOUR_DISTANCE[id])
      }
      if (elapsed > TOUR_STOP_SECONDS) setTourStep(step + 1)
    } else {
      goalPos.copy(HOME_POSITION)
      goalTarget.set(0, 0, 0)
      if (camera.position.distanceTo(HOME_POSITION) < 0.2) {
        writeFlag(TOUR_SEEN_KEY)
        setTourStep(null)
      }
    }

    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 2.2)
    camera.position.lerp(goalPos, k)
    if (controls) {
      controls.target.lerp(goalTarget, k)
      controls.update()
    } else {
      camera.lookAt(goalTarget)
    }
  })

  return null
}

export function SolarMap() {
  const selectLocation = useAppStore((s) => s.selectLocation)
  const transitionTo = useAppStore((s) => s.transitionTo)
  const hovered = useAppStore((s) => s.hoveredLocation)
  const setHovered = useAppStore((s) => s.setHoveredLocation)
  const pending = useAppStore((s) => s.pendingLocation)
  const tourStep = useAppStore((s) => s.tourStep)
  const tex = getSolarTextures()

  const moonRef = useRef<THREE.Group>(null)
  const marsRef = useRef<THREE.Group>(null)
  const beyondRef = useRef<THREE.Group>(null)
  const refs: DestRefs = { moon: moonRef, mars: marsRef, beyond: beyondRef }
  const [fly, setFly] = useState<{ follow: THREE.Group; id: LocationId } | null>(null)
  const flying = useRef(false)

  const go = (id: LocationId) => {
    if (flying.current) return
    flying.current = true
    useAppStore.setState({ pendingLocation: null, tourStep: null })
    if (tourStep !== null) writeFlag(TOUR_SEEN_KEY)
    const g = refs[id].current
    if (!g) {
      transitionTo(() => selectLocation(id))
      return
    }
    setFly({ follow: g, id })
  }

  // Destino pedido desde la barra de destinos (UI fuera del Canvas).
  useEffect(() => {
    if (pending) go(pending)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  // Las órbitas se frenan con suavidad cuando el usuario apunta, vuela o hace el recorrido.
  useFrame((_, delta) => {
    const frozen = hovered !== null || fly !== null || tourStep !== null
    const goal = frozen ? 0 : 1
    orbitClock.scale += (goal - orbitClock.scale) * (1 - Math.exp(-Math.min(delta, 0.1) * 5))
  })

  const tourTarget = tourStep !== null && tourStep < TOUR_STOPS.length ? TOUR_STOPS[tourStep] : null
  const isLit = (id: LocationId) => hovered === id || tourTarget === id

  return (
    <>
      <color attach="background" args={['#03040a']} />
      <ambientLight intensity={0.85} color="#cfd8ff" />
      <pointLight position={[0, 0, 0]} intensity={14} decay={0} color="#fff1d6" />
      <Stars radius={160} depth={80} count={5000} factor={4} saturation={0} fade speed={0.3} />

      <SceneCamera position={[HOME_POSITION.x, HOME_POSITION.y, HOME_POSITION.z]} target={[0, 0, 0]} />

      <SunBody radius={1.4} />

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
        {/* Etiqueta de la Tierra debajo para no pisar la de la Luna. */}
        <Planet radius={0.3} map={tex.earth} label="Tierra" labelBelow selfRotation={0.4} />
        <Orbiter groupRef={moonRef} radius={0.55} speed={1.2}>
          <Planet
            radius={0.1}
            map={tex.moon}
            label="Luna"
            selectable
            id="moon"
            lit={isLit('moon')}
            hitRadius={0.32}
            onSelect={go}
            onHover={setHovered}
            selfRotation={0.2}
          />
        </Orbiter>
      </Orbiter>
      <Orbiter groupRef={marsRef} radius={5.8} speed={0.16}>
        <OrbitRing radius={5.8} />
        <Planet
          radius={0.24}
          map={tex.mars}
          label="Marte"
          selectable
          id="mars"
          lit={isLit('mars')}
          hitRadius={0.6}
          onSelect={go}
          onHover={setHovered}
          selfRotation={0.35}
        />
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
      <Orbiter groupRef={beyondRef} radius={17.5} speed={0.04}>
        <OrbitRing radius={17.5} />
        <BeyondBeacon lit={isLit('beyond')} onSelect={go} onHover={setHovered} />
      </Orbiter>

      {fly && (
        <FlyTo
          follow={fly.follow}
          approachDistance={FLY_DISTANCE[fly.id]}
          onNearEnd={() => transitionTo(() => selectLocation(fly.id))}
          onArrive={() => setFly(null)}
        />
      )}

      {tourStep !== null && !fly && <Tour refs={refs} />}

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
