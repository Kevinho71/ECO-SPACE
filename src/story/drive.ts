// Conducción libre al terminar la historia. Estado mutable (como `storyRuntime`) que leen el escenario, el robot y la
// cámara en cada fotograma; `stepDrive` lo integra a partir de la entrada del usuario (teclado o joystick).
//
// Coordenadas de terreno: el robot siempre está en el origen del mundo y es el suelo el que se mueve y gira bajo él
// (igual que durante la historia). `x`/`z` son su posición sobre el terreno y `heading` su rumbo (rad): el frente es
// (cos h, sin h) en (x, z) y girar a la derecha aumenta `h`.
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { storyRuntime } from './runtime'
import { placeHeight, surfaceDef } from '../three/environments/places'
import type { DriveConfig, PlaceId } from '../data/story'

/** Entrada del usuario, -1…1 (la escriben el teclado y el joystick). */
export const driveInput = { f: 0, t: 0, up: 0 }

export const driveRuntime = {
  active: false,
  cfg: null as DriveConfig | null,
  def: null as ReturnType<typeof surfaceDef> | null,
  /** true = el suelo se desplaza y gira bajo el robot ('wheels' y 'fly'). */
  moveWorld: false,
  x: 0,
  z: 0,
  heading: 0,
  v: 0,
  alt: 0,
  /** Rover del modelo (solo 'rover-node'): posición y rumbo locales, en ejes de three. */
  sx: 0,
  sy: 0,
  sz: 0,
  sa: 0,
  /** Se ha llegado al borde de la zona. */
  limit: false,
  /** Giro actual (-1…1), para inclinar la cámara. */
  steer: 0,
}

/** Sojourner termina su clip `Drive` en (1,05; 0; −1,82) mirando a 60° (ejes de three): de ahí parte la conducción. */
const SOJ_START = { x: 1.05, z: -1.82, a: Math.PI / 3 }

export const driveControls = {
  enter(cfg: DriveConfig, place: PlaceId) {
    const def = surfaceDef(place)
    Object.assign(driveRuntime, {
      active: true,
      cfg,
      def,
      moveWorld: cfg.kind !== 'rover-node',
      x: def.startX,
      z: 0,
      heading: 0,
      v: 0,
      alt: 0,
      sx: SOJ_START.x,
      sy: 0,
      sz: SOJ_START.z,
      sa: SOJ_START.a,
      limit: false,
      steer: 0,
    })
    driveInput.f = driveInput.t = driveInput.up = 0
  },
  exit() {
    driveRuntime.active = false
    driveRuntime.moveWorld = false
    driveRuntime.cfg = null
    driveInput.f = driveInput.t = driveInput.up = 0
  },
}

const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-dt * rate))

/** Avanza la conducción un fotograma y vuelca el resultado en `storyRuntime` (lo que ya leen Robot, cámara y escenario). */
export function stepDrive(dt: number) {
  const cfg = driveRuntime.cfg
  const def = driveRuntime.def
  if (!driveRuntime.active || !cfg || !def) return
  const r = driveRuntime
  const { f, t, up } = driveInput

  // Velocidad: acelera con suavidad y frena algo más rápido; marcha atrás a media velocidad.
  const target = f * (f < 0 ? 0.5 : 1) * cfg.maxSpeed
  r.v = damp(r.v, target, Math.abs(target) > Math.abs(r.v) ? 2.2 : 3.5, dt)
  if (Math.abs(r.v) < 0.005 && target === 0) r.v = 0
  r.steer = damp(r.steer, t, 6, dt)
  let clip: string = 'Idle'
  let tilt = 0
  let spin = 0

  if (cfg.kind === 'rover-node') {
    // Gira en el sitio (más despacio si está parado) y avanza hacia delante del rover.
    r.sa -= t * 1.5 * dt * (0.5 + 0.5 * Math.min(1, Math.abs(r.v) / cfg.maxSpeed))
    const nx = r.sx + Math.cos(r.sa) * r.v * dt
    const nz = r.sz - Math.sin(r.sa) * r.v * dt
    const rad = cfg.radius ?? 14
    const d = Math.hypot(nx - SOJ_START.x, nz - SOJ_START.z)
    r.limit = d > rad
    const k = r.limit ? rad / d : 1
    r.sx = SOJ_START.x + (nx - SOJ_START.x) * k
    r.sz = SOJ_START.z + (nz - SOJ_START.z) * k
    if (r.limit) r.v *= 0.3
    // Sigue el relieve respecto al punto donde está el módulo.
    r.sy = placeHeight(def, def.startX + r.sx, r.sz) - storyRuntime.groundY
    if (Math.abs(r.v) > 0.03) clip = 'Drive'
  } else {
    // Giro: en el suelo se puede girar casi en el sitio; en el aire, más ágil.
    const turn = cfg.kind === 'fly' ? 1.7 : 1.1
    r.heading += t * turn * dt * (cfg.kind === 'fly' ? 1 : 0.45 + 0.55 * Math.min(1, Math.abs(r.v) / cfg.maxSpeed))
    r.x += Math.cos(r.heading) * r.v * dt
    r.z += Math.sin(r.heading) * r.v * dt
    const half = def.size / 2 - 10
    const cx = THREE.MathUtils.clamp(r.x, -half, half)
    const cz = THREE.MathUtils.clamp(r.z, -half, half)
    r.limit = cx !== r.x || cz !== r.z
    r.x = cx
    r.z = cz
    if (r.limit) r.v *= 0.3
    if (cfg.kind === 'fly') {
      const maxAlt = cfg.maxAlt ?? 12
      r.alt = THREE.MathUtils.clamp(r.alt + up * 3.2 * dt, 0, maxAlt)
      tilt = THREE.MathUtils.clamp(r.v / cfg.maxSpeed, -1, 1) * 0.22
      if (r.alt > 0.15) {
        clip = 'Fly'
        spin = 1
      }
    } else if (Math.abs(r.v) > 0.05) clip = 'Drive'
  }

  storyRuntime.robotX += Math.abs(r.v) * dt // cuentakilómetros: fase del balanceo de la suspensión
  storyRuntime.speed = Math.abs(r.v)
  storyRuntime.alt = r.alt
  storyRuntime.tilt = tilt
  storyRuntime.spin = spin
  storyRuntime.slip = 0
  // Solo se toca el store cuando cambia el clip.
  const s = useAppStore.getState()
  if (s.storyClip !== clip) s.patchStory({ storyClip: clip })
}
