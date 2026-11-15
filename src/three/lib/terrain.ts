import { fbm } from './noise'

export interface TerrainOpts {
  seed: number
  height: number
  flattenStart: number
  flattenEnd: number
  /** Cantidad de cráteres suaves (0 = sin cráteres). */
  craters?: number
  /** Cráter principal (coordenadas del terreno: x, y local). */
  bowl?: { x: number; y: number; r: number; depth: number }
  /** Pendiente a lo largo de +X (m por m). Negativa = baja. */
  slope?: number
  /** Ondulaciones tipo dunas. `angle` = dirección de la onda. */
  ridge?: { amp: number; freq: number; angle: number }
  /** Borde de acantilado festoneado a partir de x0 (cae `drop` m). */
  cliff?: { x0: number; drop: number }
  /** Canal a lo largo de +X (y = 0) con bordes que suben. */
  channel?: { depth: number; width: number }
}

function smoothstep(x: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

interface Crater {
  x: number
  z: number
  r: number
  depth: number
}

const craterCache = new Map<string, Crater[]>()

/** Cráteres deterministas (posición/radio) por semilla, lejos de la zona plana del robot. */
function getCraters(seed: number, count: number, minDist: number): Crater[] {
  const key = `${seed}:${count}:${minDist}`
  let list = craterCache.get(key)
  if (!list) {
    let s = (seed * 48271 + 11) % 2147483647
    const rand = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    list = []
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const r = rand() * rand() * 3 + 2.5 // radio del cráter (muchos pequeños, pocos grandes)
      const d = minDist + r + rand() * (52 - minDist)
      list.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, r, depth: 0.28 + rand() * 0.35 })
    }
    craterCache.set(key, list)
  }
  return list
}

/**
 * Altura del terreno en un punto (x, z) del mundo.
 * Ruido fractal + cráteres (cuenco con borde elevado) y una zona plana
 * alrededor del origen donde se posa el robot.
 */
export function terrainHeight(x: number, z: number, o: TerrainOpts): number {
  const n = fbm(x * 0.06 + o.seed, z * 0.06 + o.seed, o.seed * 0.7, 5)
  const n2 = fbm(x * 0.4 + o.seed * 2, z * 0.4 + o.seed * 2, o.seed * 1.3, 3)
  const dist = Math.sqrt(x * x + z * z)
  const flat = smoothstep(dist, o.flattenStart, Math.max(o.flattenEnd, o.flattenStart + 0.001))
  let h = ((n - 0.5) * o.height + (n2 - 0.5) * o.height * 0.25) * flat
  if (o.craters) {
    for (const c of getCraters(o.seed, o.craters, o.flattenEnd)) {
      const d = Math.hypot(x - c.x, z - c.z) / c.r
      if (d < 1.35) {
        const bowl = d < 1 ? -c.depth * (1 - d * d) : 0
        const rim = c.depth * 0.45 * Math.exp(-Math.pow((d - 1.05) * 4, 2))
        h += bowl + rim
      }
    }
  }
  if (o.bowl) {
    const b = o.bowl
    const d = Math.hypot(x - b.x, z - b.y) / b.r
    if (d < 1) h -= b.depth * (1 - d * d)
    h += b.depth * 0.22 * Math.exp(-Math.pow((d - 1.06) * 3.5, 2))
  }
  if (o.slope) h += o.slope * x
  if (o.ridge) {
    const r = o.ridge
    const u = r.freq * (x * Math.cos(r.angle) + z * Math.sin(r.angle)) + 2.5 * n
    h += r.amp * (1 - 2 * Math.abs(Math.sin(u))) * (0.6 + 0.8 * n2)
  }
  if (o.cliff) {
    const edge = o.cliff.x0 + 5 * Math.sin(z * 0.11) + 3 * Math.sin(z * 0.27 + 1)
    h -= o.cliff.drop * smoothstep(x, edge, edge + 2.5)
  }
  if (o.channel) h += o.channel.depth * (1 - Math.exp(-Math.pow(z / o.channel.width, 2)))
  return h
}
