import { fbm } from './noise'

export interface TerrainOpts {
  seed: number
  height: number
  flattenStart: number
  flattenEnd: number
}

function smoothstep(x: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Altura del terreno en un punto (x, z) del mundo.
 * Usa ruido fractal y aplana una zona alrededor del origen para que el robot
 * aterrice sobre una superficie despejada.
 */
export function terrainHeight(x: number, z: number, o: TerrainOpts): number {
  const n = fbm(x * 0.06 + o.seed, z * 0.06 + o.seed, o.seed * 0.7, 5)
  const n2 = fbm(x * 0.4 + o.seed * 2, z * 0.4 + o.seed * 2, o.seed * 1.3, 3)
  let h = (n - 0.5) * o.height + (n2 - 0.5) * o.height * 0.25
  const dist = Math.sqrt(x * x + z * z)
  const flat = smoothstep(dist, o.flattenStart, o.flattenEnd)
  return h * flat
}
