import type * as THREE from 'three'
import type { PlaceId } from '../../data/story'
import { terrainHeight, type TerrainOpts } from '../lib/terrain'
import { buildTerrainGeometry } from './Terrain'

/** Lugares con superficie de Marte. ('launch' / 'cruise' / 'entry' son escenas del espacio: ver FlightScene). */
export type SurfacePlace = Exclude<PlaceId, 'launch' | 'cruise' | 'entry'>

export interface PlaceDef {
  sky: string
  fogNear: number
  fogFar: number
  hemiSky: string
  hemiGround: string
  size: number
  segments: number
  terrain: TerrainOpts
  colors: { low: string; mid: string; high: string }
  /** Coordenada x del terreno donde empieza el robot (el mundo se desplaza según avanza). */
  startX: number
  /** Distancia máxima que se dibujan huellas (m). */
  driveMax: number
  pebbles: number
  pebbleColor: string
  boulders: number
  boulderColor: string
  mountains: { color: string; height: number }
  props?: 'eagle' | 'veins' | 'dunes'
}

const base = { flattenStart: 0, flattenEnd: 0.001 }

export const PLACES: Record<SurfacePlace, PlaceDef> = {
  // El aspecto original (otros robots de Marte y modo libre).
  generic: {
    sky: '#d98f62', fogNear: 22, fogFar: 95, hemiSky: '#ffcfa0', hemiGround: '#6a2f1b',
    size: 150, segments: 100,
    terrain: { seed: 13, height: 1.8, flattenStart: 3, flattenEnd: 8, craters: 9 },
    colors: { low: '#8c3f22', mid: '#c4683a', high: '#eca777' },
    startX: 0, driveMax: 0, pebbles: 0, pebbleColor: '#9a4a28', boulders: 28, boulderColor: '#9a4a28',
    mountains: { color: '#a85a35', height: 16 },
  },
  // Cráter Eagle: cuenco pequeño, afloramiento laminado, "blueberries".
  eagle: {
    sky: '#d6905f', fogNear: 24, fogFar: 100, hemiSky: '#ffd0a0', hemiGround: '#6a3320',
    size: 160, segments: 250,
    terrain: { seed: 7, height: 0.7, flattenStart: 0, flattenEnd: 3.5, bowl: { x: 0, y: 0, r: 12, depth: 1.6 } },
    colors: { low: '#6b3a28', mid: '#a65b39', high: '#c98d66' },
    startX: 0, driveMax: 12, pebbles: 1100, pebbleColor: '#7d4630', boulders: 10, boulderColor: '#85452c',
    mountains: { color: '#8a4d33', height: 5 },
    props: 'eagle',
  },
  // Llano de Meridiani: plano, con ondulaciones suaves.
  plains: {
    sky: '#d3875a', fogNear: 28, fogFar: 105, hemiSky: '#ffcb98', hemiGround: '#6a3320',
    size: 160, segments: 250,
    terrain: { seed: 21, height: 0.5, ...base, craters: 4, ridge: { amp: 0.1, freq: 0.5, angle: 1.2 } },
    colors: { low: '#7a4129', mid: '#b0623c', high: '#d49a72' },
    startX: -40, driveMax: 40, pebbles: 1500, pebbleColor: '#8a4a30', boulders: 14, boulderColor: '#7d3f27',
    mountains: { color: '#9a5636', height: 8 },
  },
  // Purgatory Dune: arena suelta en ondulaciones.
  purgatory: {
    sky: '#cf8a5e', fogNear: 20, fogFar: 90, hemiSky: '#ffd2a4', hemiGround: '#6a3a24',
    size: 160, segments: 250,
    terrain: { seed: 33, height: 0.4, ...base, ridge: { amp: 0.32, freq: 0.85, angle: 0.45 } },
    colors: { low: '#8a5a3f', mid: '#c28458', high: '#e0ab7d' },
    startX: -6, driveMax: 30, pebbles: 500, pebbleColor: '#9c6a48', boulders: 6, boulderColor: '#8a5a3f',
    mountains: { color: '#a06640', height: 6 },
    props: 'dunes',
  },
  // Cráter Endurance: pendiente hacia el interior.
  endurance: {
    sky: '#cf885d', fogNear: 26, fogFar: 100, hemiSky: '#ffc994', hemiGround: '#5e2f1f',
    size: 160, segments: 250,
    terrain: { seed: 41, height: 1.0, ...base, bowl: { x: 42, y: 0, r: 50, depth: 12 } },
    colors: { low: '#6d3a27', mid: '#a85b38', high: '#cf9068' },
    startX: -14, driveMax: 20, pebbles: 1300, pebbleColor: '#7d4630', boulders: 22, boulderColor: '#7a3e27',
    mountains: { color: '#8f4d31', height: 9 },
  },
  // Cráter Victoria: acantilados festoneados sobre una gran cuenca.
  victoria: {
    sky: '#d99a6c', fogNear: 30, fogFar: 130, hemiSky: '#ffd8aa', hemiGround: '#6e3a24',
    size: 160, segments: 250,
    terrain: { seed: 55, height: 0.6, ...base, cliff: { x0: 12, drop: 14 }, ridge: { amp: 0.22, freq: 0.4, angle: 0.3 } },
    colors: { low: '#7e4a31', mid: '#bb7347', high: '#e3b085' },
    startX: -20, driveMax: 20, pebbles: 800, pebbleColor: '#8d5436', boulders: 12, boulderColor: '#7a4429',
    mountains: { color: '#a8643d', height: 12 },
  },
  // Borde de Endeavour: colinas más claras con vetas de yeso.
  endeavour: {
    sky: '#d48c60', fogNear: 26, fogFar: 105, hemiSky: '#ffd0a0', hemiGround: '#6a3a28',
    size: 160, segments: 250,
    terrain: { seed: 67, height: 2.4, ...base, craters: 6 },
    colors: { low: '#8a5a42', mid: '#bd7a52', high: '#e3b48e' },
    startX: -35, driveMax: 45, pebbles: 1300, pebbleColor: '#a06a4a', boulders: 24, boulderColor: '#8c5438',
    mountains: { color: '#b0704a', height: 14 },
    props: 'veins',
  },
  // Perseverance Valley: canal en la ladera interior del borde, con la cuenca al fondo.
  perseverance: {
    sky: '#d98f62', fogNear: 22, fogFar: 100, hemiSky: '#ffcfa0', hemiGround: '#5e2f1f',
    size: 160, segments: 250,
    terrain: { seed: 79, height: 1.3, ...base, slope: -0.1, channel: { depth: 2.4, width: 3.2 } },
    colors: { low: '#6a3a2a', mid: '#9a5535', high: '#b57a58' },
    startX: -20, driveMax: 10, pebbles: 1400, pebbleColor: '#7a4228', boulders: 36, boulderColor: '#6f3a24',
    mountains: { color: '#8a4a30', height: 7 },
  },
}

export function surfaceDef(id: PlaceId): PlaceDef {
  return PLACES[(id in PLACES ? id : 'generic') as SurfacePlace]
}

/** Altura del terreno en coordenadas del terreno (xt) y del mundo (zw = z; el plano está girado: y_local = −z). */
export function placeHeight(def: PlaceDef, xt: number, zw: number): number {
  return terrainHeight(xt, -zw, def.terrain)
}

// --- Geometrías cacheadas (para que cambiar de lugar no provoque tirones) ---
const geoCache = new Map<string, THREE.BufferGeometry>()

export function getPlaceGeometry(id: PlaceId): THREE.BufferGeometry {
  const key = id in PLACES ? id : 'generic'
  let g = geoCache.get(key)
  if (!g) {
    const d = PLACES[key as SurfacePlace]
    g = buildTerrainGeometry({
      ...d.terrain,
      size: d.size,
      segments: d.segments,
      lowColor: d.colors.low,
      midColor: d.colors.mid,
      highColor: d.colors.high,
    })
    geoCache.set(key, g)
  }
  return g
}

/** Construye los terrenos de la historia en segundo plano (uno cada cierto tiempo). */
export function prewarmPlaces(ids: PlaceId[]): () => void {
  const timers: number[] = []
  ids.forEach((id, i) => {
    timers.push(window.setTimeout(() => getPlaceGeometry(id), 400 + i * 350))
  })
  return () => timers.forEach((t) => window.clearTimeout(t))
}
