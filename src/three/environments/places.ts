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
  /** ¿Dibuja huellas de ruedas? (false para el helicóptero). */
  tracks?: boolean
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
  // --- Ingenuity (cráter Jezero) ---
  // Zona de despliegue: arena clara con guijarros; Perseverance se aleja.
  jezero: {
    sky: '#dca071', fogNear: 30, fogFar: 125, hemiSky: '#ffd9ae', hemiGround: '#6e4630',
    size: 160, segments: 250,
    terrain: { seed: 91, height: 0.3, ...base, craters: 3, ridge: { amp: 0.08, freq: 0.6, angle: 0.8 } },
    colors: { low: '#8a6244', mid: '#b98a62', high: '#d8b58c' },
    startX: -30, driveMax: 60, pebbles: 1700, pebbleColor: '#8e6446', boulders: 12, boulderColor: '#7d553b',
    mountains: { color: '#a0744f', height: 11 }, tracks: false,
  },
  // Aeródromo: llanura casi plana y despejada para despegar y aterrizar.
  airfield: {
    sky: '#dea577', fogNear: 34, fogFar: 135, hemiSky: '#ffdcb4', hemiGround: '#72492f',
    size: 160, segments: 250,
    terrain: { seed: 93, height: 0.18, ...base, ridge: { amp: 0.05, freq: 0.45, angle: 0.3 } },
    colors: { low: '#94694a', mid: '#c19468', high: '#dfbf94' },
    startX: -30, driveMax: 70, pebbles: 1100, pebbleColor: '#98704f', boulders: 7, boulderColor: '#84593c',
    mountains: { color: '#a67a54', height: 9 }, tracks: false,
  },
  // Afloramientos rocosos: el terreno que Ingenuity explora por delante del rover.
  outcrop: {
    sky: '#d99a68', fogNear: 30, fogFar: 125, hemiSky: '#ffd5a8', hemiGround: '#6a412b',
    size: 160, segments: 250,
    terrain: { seed: 97, height: 1.5, ...base, craters: 7, ridge: { amp: 0.15, freq: 0.35, angle: 1.0 } },
    colors: { low: '#7a533b', mid: '#ab7a55', high: '#d0a47a' },
    startX: -35, driveMax: 70, pebbles: 1000, pebbleColor: '#8a5e42', boulders: 46, boulderColor: '#74492f',
    mountains: { color: '#98684a', height: 15 }, tracks: false,
  },
  // Ondas de arena lisas, todas iguales: casi sin textura para la cámara de navegación (vuelo 72).
  sandwaves: {
    sky: '#dfa87a', fogNear: 36, fogFar: 140, hemiSky: '#ffdfb8', hemiGround: '#8a6244',
    size: 160, segments: 250,
    terrain: { seed: 99, height: 0.05, ...base, ridge: { amp: 0.55, freq: 0.5, angle: 0.9 } },
    colors: { low: '#c79a70', mid: '#cfa377', high: '#d6ac80' },
    startX: -30, driveMax: 70, pebbles: 0, pebbleColor: '#c79a70', boulders: 0, boulderColor: '#c79a70',
    mountains: { color: '#b98a62', height: 6 }, tracks: false,
  },
  // --- InSight (Elysium Planitia): llanura muy plana y lisa, casi sin rocas ---
  elysium: {
    sky: '#d8946a', fogNear: 32, fogFar: 130, hemiSky: '#ffd5a8', hemiGround: '#6e4128',
    size: 160, segments: 250,
    terrain: { seed: 105, height: 0.1, ...base, ridge: { amp: 0.04, freq: 0.5, angle: 0.6 } },
    colors: { low: '#8a5538', mid: '#b4764c', high: '#cf9a70' },
    startX: 0, driveMax: 10, pebbles: 450, pebbleColor: '#8a5a3e', boulders: 4, boulderColor: '#7a4a30',
    mountains: { color: '#9a5e3c', height: 5 }, tracks: false,
  },
  // --- Pathfinder (Ares Vallis): antigua llanura de inundación, llena de rocas de todos los tamaños ---
  aresvallis: {
    sky: '#d98a60', fogNear: 24, fogFar: 100, hemiSky: '#ffcb98', hemiGround: '#6a3320',
    size: 160, segments: 250,
    terrain: { seed: 111, height: 0.35, ...base, craters: 2, ridge: { amp: 0.1, freq: 0.7, angle: 0.5 } },
    colors: { low: '#7a4229', mid: '#b0623c', high: '#d49a72' },
    startX: -10, driveMax: 20, pebbles: 1500, pebbleColor: '#8a4a30', boulders: 60, boulderColor: '#7d3f27',
    mountains: { color: '#9a5636', height: 8 }, tracks: false,
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
