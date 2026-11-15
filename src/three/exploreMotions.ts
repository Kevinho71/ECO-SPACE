// Movimientos por código para el modo Explorar (sin tocar los GLB). Cada uno recibe el avance `u` (0–1 de la acción),
// una función para buscar nodos por nombre y las poses de reposo capturadas al empezar.
// Ejes de three (Y arriba): Blender Z → Y, Blender Y → -Z, Blender X → X.
import type * as THREE from 'three'
import { exploreRuntime } from '../story/explore'

export interface RestPose {
  rx: number
  ry: number
  rz: number
  px: number
  py: number
  pz: number
  sx: number
  sy: number
  sz: number
}

export interface MotionCtx {
  /** Avance de la acción, 0–1. */
  u: number
  /** Segundos desde que empezó. */
  t: number
  /** Nodo del GLB por nombre. */
  node: (name: string) => THREE.Object3D | undefined
  /** Pose de reposo de un nodo (capturada al empezar la acción). */
  rest: (o: THREE.Object3D) => RestPose
}

export interface ExploreMotion {
  /** Nodos que toca (se restauran al terminar). */
  nodes: string[]
  apply: (c: MotionCtx) => void
}

/** Sube de 0 a 1, se mantiene y baja a 0 (para ir y volver a la pose de reposo). */
export const pulse = (u: number, rise = 0.25, fall = 0.25) => {
  const a = Math.min(1, u / rise)
  const b = Math.min(1, (1 - u) / fall)
  const k = Math.max(0, Math.min(a, b))
  return k * k * (3 - 2 * k)
}

/** Barrido de lado a lado de un nodo alrededor del eje vertical (cámara, plato, cabeza de mástil). */
const sweepY = (name: string, amp: number): ExploreMotion => ({
  nodes: [name],
  apply: ({ u, node, rest }) => {
    const o = node(name)
    if (o) o.rotation.y = rest(o).ry + amp * Math.sin(u * Math.PI * 2) * pulse(u, 0.1, 0.1)
  },
})

export const EXPLORE_MOTIONS: Record<string, ExploreMotion> = {
  // Opportunity: el brazo se levanta y se abre hacia un lado, como al acercar un instrumento a una roca.
  'opportunity-arm': {
    nodes: ['arm'],
    apply: ({ u, node, rest }) => {
      const arm = node('arm')
      if (!arm) return
      const r = rest(arm)
      const k = pulse(u, 0.3, 0.3)
      arm.rotation.z = r.rz + 0.55 * k
      arm.rotation.y = r.ry + 0.45 * k * Math.sin(u * Math.PI * 2)
    },
  },
  // Opportunity: la cabeza del mástil (Pancam) barre el horizonte.
  'opportunity-look': sweepY('mast_head', 1.0),
  // Eagle: el plato de la antena se orienta hacia un lado y otro.
  'eagle-dish': sweepY('dish', 0.9),
  // Surveyor 3: la cámara de TV mira a su alrededor.
  'surveyor3-tv': sweepY('tv_camera', 1.3),
  // Pathfinder: la cabeza del mástil (cámara IMP) gira buscando el rover.
  'pathfinder-camera': sweepY('mast_head', 1.2),
  // Pathfinder: los airbags se hinchan y se vuelven a plegar.
  'pathfinder-airbags': {
    nodes: ['airbag_0', 'airbag_1', 'airbag_2'],
    apply: ({ u, node, rest }) => {
      const k = pulse(u, 0.25, 0.3)
      for (const n of ['airbag_0', 'airbag_1', 'airbag_2']) {
        const o = node(n)
        if (!o) continue
        const r = rest(o)
        o.scale.set(r.sx * (1 + 0.9 * k), r.sy * (1 + 0.9 * k), r.sz * (1 + 0.9 * k))
      }
    },
  },
  // InSight: el topo martillea y se hunde unos centímetros (en la realidad apenas pudo bajar).
  'insight-mole': {
    nodes: ['hp3_mole'],
    apply: ({ u, t, node, rest }) => {
      const m = node('hp3_mole')
      if (!m) return
      const r = rest(m)
      const k = pulse(u, 0.15, 0.2)
      m.position.y = r.py - 0.12 * k + Math.sin(t * 38) * 0.008 * k
    },
  },
  // Ingenuity: muestra cómo quedaron las palas tras el vuelo 72 (morph `rotor_damage`).
  'ingenuity-damage': {
    nodes: [],
    apply: ({ u }) => {
      exploreRuntime.damage = pulse(u, 0.25, 0.2)
    },
  },
  // Pioneer 10: el brazo del magnetómetro se despliega hacia fuera.
  'pioneer10-boom': {
    nodes: ['mag_boom'],
    apply: ({ u, node, rest }) => {
      const b = node('mag_boom')
      if (!b) return
      b.rotation.x = rest(b).rx + 0.8 * pulse(u, 0.3, 0.3)
    },
  },
}
