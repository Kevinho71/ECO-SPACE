import * as THREE from 'three'
import type { PlaceId } from '../../data/story'

// Línea de tiempo del capítulo 2 (segundos desde el inicio del capítulo). Debe coincidir con opportunity.ts:
// los parpadeos están en (t − 0,3) de cada instante de cambio de escena.
export const FT = {
  ignition: 5,
  liftoff: 6,
  cruiseStart: 22.8,
  cruiseCut: 30.2, // en mitad del crucero: pasa de mirar hacia la Tierra a mirar hacia Marte
  entryStart: 37.8,
  descentStart: 48.8,
  chute: 49,
  shieldOff: 50.5,
  retro: 54,
  airbags: 60,
  impact: 65,
  rest: 73,
  deflateEnd: 77.8,
  pov: 78.2,
}

export interface Shot {
  pos: THREE.Vector3
  look: THREE.Vector3
  fov: number
}

const shot: Shot = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 45 }
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const sm = (x: number) => {
  const u = clamp01(x)
  return u * u * (3 - 2 * u)
}
const lerp = THREE.MathUtils.lerp

// ----- Lanzamiento -----------------------------------------------------------
export function rocketY(t: number): number {
  const u = Math.max(0, t - FT.liftoff)
  return 0.5 * 1.5 * u * u
}

// ----- Entrada en la atmósfera -----------------------------------------------
export function entryPos(t: number, out: THREE.Vector3): THREE.Vector3 {
  const u = clamp01((t - FT.entryStart) / (FT.descentStart - FT.entryStart))
  return out.set(-28 + 52 * u, 20 - 14 * Math.pow(u, 1.3), 0)
}

// ----- Descenso, airbags y rebotes (sobre el cráter Eagle) --------------------
export const BALL_R = 1.7
const ALT: [number, number][] = [
  [FT.descentStart, 420],
  [FT.retro, 100],
  [FT.airbags, 12],
  [FT.impact, BALL_R],
]
const BOUNCES = [
  { d: 1.6, H: 6, dx: 2.8 },
  { d: 1.3, H: 3.6, dx: 2.4 },
  { d: 1.0, H: 2.1, dx: 1.6 },
  { d: 0.8, H: 1.1, dx: 0.9 },
  { d: 0.5, H: 0.5, dx: 0.5 },
]
const X_IMPACT = -9
const ROLL_START = FT.impact + BOUNCES.reduce((a, b) => a + b.d, 0) // 70,2

export interface LandingState {
  x: number
  /** Altura del centro sobre el suelo (m). */
  alt: number
  /** Giro por rodar (rad). */
  spin: number
  /** 0 = en el aire con paracaídas · 1 = rebotando / quieto. */
  onGround: boolean
}

export function landingState(t: number): LandingState {
  if (t < FT.impact) {
    let alt = ALT[0][1]
    for (let i = 1; i < ALT.length; i++) {
      if (t <= ALT[i][0]) {
        const [t0, a0] = ALT[i - 1]
        const [t1, a1] = ALT[i]
        alt = lerp(a0, a1, sm((t - t0) / (t1 - t0)) * 0.55 + clamp01((t - t0) / (t1 - t0)) * 0.45)
        break
      }
      alt = ALT[i][1]
    }
    const u = clamp01((t - FT.descentStart) / (FT.impact - FT.descentStart))
    return { x: lerp(-26, X_IMPACT, u), alt, spin: 0, onGround: false }
  }
  let x = X_IMPACT
  let tt = t - FT.impact
  for (const b of BOUNCES) {
    if (tt < b.d) {
      const u = tt / b.d
      x += b.dx * u
      const alt = BALL_R + b.H * 4 * u * (1 - u)
      return { x, alt, spin: -x / BALL_R, onGround: true }
    }
    x += b.dx
    tt -= b.d
  }
  const roll = clamp01((t - ROLL_START) / (FT.rest - ROLL_START))
  x += (0 - x) * (1 - Math.pow(1 - roll, 2))
  return { x, alt: BALL_R, spin: -x / BALL_R, onGround: true }
}

// ----- Cámaras del viaje -------------------------------------------------------
const tmpV = new THREE.Vector3()

/** Cámara cinematográfica del viaje. `gh(x)` = altura del suelo (mundo) en x, para las etapas sobre Marte. */
export function flightShot(place: PlaceId, t: number, gh: (x: number) => number): Shot {
  if (place === 'launch') {
    const y = rocketY(t)
    const u = Math.max(0, t - FT.liftoff)
    shot.pos.set(46 - u * 0.4, 8 + y * 0.55, 62 + u * 0.3)
    shot.look.set(0, 20 + y * 0.98, 0)
    shot.fov = lerp(44, 58, sm(u / 16))
    return shot
  }
  if (place === 'cruise') {
    const sway = Math.sin(t * 0.5) * 0.12
    if (t < FT.cruiseCut) {
      shot.pos.set(3.2 + sway, 1.0, -7)
      shot.look.set(-6, 2.2, 40)
    } else {
      shot.pos.set(-2.2, 1.3 + sway, 8)
      shot.look.set(0.6, 0.2, -30)
    }
    shot.fov = 50
    return shot
  }
  if (place === 'entry') {
    entryPos(t, tmpV)
    shot.pos.set(tmpV.x * 0.5, 5 + tmpV.y * 0.1, 27)
    shot.look.set(tmpV.x * 0.9, tmpV.y * 0.9, 0)
    shot.fov = 48
    return shot
  }
  // Sobre Marte (cráter Eagle): descenso y rebotes
  const s = landingState(t)
  const y = gh(s.x) + s.alt
  if (t < FT.impact) {
    shot.pos.set(8, gh(8) + 2.2 + Math.max(0, y * 0.12), 15)
    shot.look.set(s.x, y, 0)
    shot.fov = lerp(50, 44, clamp01((t - FT.descentStart) / 16))
  } else if (t < FT.rest) {
    shot.pos.set(s.x - 4.5, gh(s.x - 4.5) + 3.2, 12)
    shot.look.set(s.x + 0.5, y, 0)
    shot.fov = 48
  } else {
    shot.pos.set(7.5, gh(7.5) + 2.4, 6.5)
    shot.look.set(0, gh(0) + 0.9, 0)
    shot.fov = 48
  }
  return shot
}
