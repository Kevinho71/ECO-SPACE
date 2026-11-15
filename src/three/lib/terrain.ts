import { fbm } from './noise'

export interface TerrainOpts {
  seed: number
  height: number
  flattenStart: number
  flattenEnd: number
  /** Cantidad de cráteres suaves (0 = sin cráteres). */
  craters?: number
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
  let h = (n - 0.5) * o.height + (n2 - 0.5) * o.height * 0.25
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
  const dist = Math.sqrt(x * x + z * z)
  const flat = smoothstep(dist, o.flattenStart, o.flattenEnd)
  return h * flat
}
