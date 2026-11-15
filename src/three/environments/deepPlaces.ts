import type { Vector3 } from 'three'
import type { DeepPlaceId, Keyframe } from '../../data/story'

// ---------------------------------------------------------------------------
// Escenarios del ESPACIO PROFUNDO (Pioneer 10). No hay suelo: la sonda se queda en el origen y
// el mundo pasa a su alrededor (misma idea que el suelo desplazable de Marte).
//
// Sistema de coordenadas (el modelo mira hacia +X):
//   +X = hacia la Tierra y el Sol (la antena de plato apunta allí)  → "detrás" de la sonda
//   −X = rumbo de viaje                                              → "delante"
//   −Z = izquierda, +Z = derecha mirando hacia +X
// Todo es función pura del tiempo desde que empezó el lugar (`storyRuntime.placeT`),
// así `seek`, pausa y retroceso funcionan sin lógica extra. Las escalas son de narración, no reales.
// ---------------------------------------------------------------------------

export type DeepTex = 'earth' | 'mars' | 'jupiter' | 'neptune' | 'moon'

export interface PathKey {
  /** Segundos desde que empezó el lugar. */
  t: number
  p: [number, number, number]
}

export interface DeepBody {
  id: string
  tex: DeepTex
  radius: number
  /** Posición a lo largo del lugar (interpolación lineal entre claves). */
  path: PathKey[]
  /** Color que se multiplica con la textura (p. ej. las lunas de Júpiter comparten la textura lunar). */
  tint?: string
  halo?: string
  spin?: number
  tilt?: number
  /** Desaparece a los `until` s, con parpadeos justo antes (la radiación de Júpiter apaga la imagen de Ío). */
  until?: number
}

export interface DeepGlow {
  pos: [number, number, number]
  size: number
  color: string
}

export interface DeepPlaceDef {
  /** Tamaño del Sol (lejanísimo: se ve cada vez más pequeño). */
  sunRadius: number
  bodies: DeepBody[]
  /** Campo de asteroides que pasa de largo, con densidad variable. */
  rocks?: { count: number; speed: number; density: Keyframe<number>[] }
  /** Velocidad (u/s) de las motas de polvo que dan sensación de avance; 0 = ninguna. */
  dust: number
  /** Cola magnética de Júpiter (se ancla al cuerpo 'jupiter'). */
  tail?: boolean
  /** Anillos de señal que salen hacia la Tierra; valor = vida de cada anillo (s). */
  pulses?: number
  /** Llama del motor de descenso bajo la sonda (el módulo lunar frenando). */
  flame?: boolean
  /** Altura (m) desde la que sale la llama; por defecto 0,3 (motor de Eagle). */
  flameY?: number
  glows?: DeepGlow[]
}

/** Posición del Sol (luz principal): detrás y a un lado, así los planetas se ven bien iluminados. */
export const SUN_POS: [number, number, number] = [190, 210, 310]

/** Lleva la posición de la trayectoria `path` en el instante `t` a `out`. */
export function samplePath(path: PathKey[], t: number, out: Vector3): Vector3 {
  const n = path.length
  if (t <= path[0].t) return out.set(...path[0].p)
  for (let i = 1; i < n; i++) {
    if (t <= path[i].t) {
      const a = path[i - 1]
      const b = path[i]
      const u = (t - a.t) / Math.max(1e-6, b.t - a.t)
      return out.set(a.p[0] + (b.p[0] - a.p[0]) * u, a.p[1] + (b.p[1] - a.p[1]) * u, a.p[2] + (b.p[2] - a.p[2]) * u)
    }
  }
  return out.set(...path[n - 1].p)
}

// --- Júpiter: el sobrevuelo se reparte en tres lugares (acercamiento · lunas · cola) y la trayectoria enlaza ---
const JUPITER_RADIUS = 20
const jupiter = (path: PathKey[]): DeepBody => ({
  id: 'jupiter',
  tex: 'jupiter',
  radius: JUPITER_RADIUS,
  path,
  halo: '#ffcf9a',
  spin: 0.05,
  tilt: 0.1,
})

// --- Apolo 11 (Eagle): el módulo lunar viaja con la Tierra detrás (+X) y la Luna delante (−X) ---
// En el descenso la Luna es una esfera enorme DEBAJO del módulo (el suelo sube hacia él): el último tramo,
// con la superficie de cerca, lo cubre el lugar 'tranquility' (LunarScene) tras un parpadeo.
const MOON_R = 700
const EARTH_IN_SKY: DeepBody = {
  id: 'earth',
  tex: 'earth',
  radius: 14,
  path: [{ t: 0, p: [260, 90, -300] }],
  halo: '#7fb8ff',
  spin: 0.03,
  tilt: 0.4,
}

export const DEEP_PLACES: Record<DeepPlaceId, DeepPlaceDef> = {
  // Apolo 11 · el cohete ya ha quedado atrás: la Tierra, enorme, debajo.
  'earth-orbit': {
    sunRadius: 14,
    dust: 0,
    bodies: [
      {
        id: 'earth',
        tex: 'earth',
        radius: 600,
        path: [
          { t: 0, p: [0, -655, 0] },
          { t: 12, p: [0, -668, 0] },
        ],
        halo: '#6aa8ff',
        spin: 0.01,
        tilt: 0.25,
      },
    ],
  },

  // Apolo 11 · tres días de viaje: la Tierra se encoge detrás y la Luna crece delante.
  translunar: {
    sunRadius: 12,
    dust: 8,
    bodies: [
      {
        id: 'moon',
        tex: 'moon',
        radius: 60,
        path: [
          { t: 0, p: [-520, 12, -110] },
          { t: 11, p: [-260, 12, -70] },
        ],
        spin: 0.01,
      },
      {
        id: 'earth',
        tex: 'earth',
        radius: 16,
        path: [
          { t: 0, p: [120, -6, -30] },
          { t: 11, p: [190, -8, -40] },
        ],
        halo: '#7fb8ff',
        spin: 0.04,
        tilt: 0.4,
      },
    ],
  },

  // Apolo 11 · órbita lunar: la superficie pasa debajo; separación del módulo.
  'lunar-orbit': {
    sunRadius: 12,
    dust: 0,
    bodies: [
      {
        id: 'moon',
        tex: 'moon',
        radius: MOON_R,
        path: [
          { t: 0, p: [-90, -1120, 0] },
          { t: 7, p: [90, -1120, 0] },
        ],
        spin: 0,
      },
      EARTH_IN_SKY,
    ],
  },

  // Apolo 11 · el descenso: la superficie sube hacia el módulo, que frena con su motor (llama).
  descent: {
    sunRadius: 12,
    dust: 0,
    flame: true,
    bodies: [
      {
        id: 'moon',
        tex: 'moon',
        radius: MOON_R,
        path: [
          { t: 0, p: [0, -1050, 0] },
          { t: 10, p: [0, -1000, 0] },
          { t: 22, p: [0, -900, 0] },
          { t: 30, p: [0, -820, 0] },
          { t: 36, p: [0, -760, 0] },
          { t: 39.65, p: [0, -712, 0] },
        ],
        spin: 0,
      },
      EARTH_IN_SKY,
    ],
  },

  // Surveyor 3 · aproximación a la Luna (corta): la superficie sube hasta casi tocar el suelo.
  'moon-approach': {
    sunRadius: 12,
    dust: 0,
    flame: true,
    flameY: 0.7,
    bodies: [
      {
        id: 'moon',
        tex: 'moon',
        radius: MOON_R,
        path: [
          { t: 0, p: [0, -860, 0] },
          { t: 4, p: [0, -830, 0] },
          { t: 8, p: [0, -790, 0] },
          { t: 11, p: [0, -713, 0] },
        ],
        spin: 0,
      },
      EARTH_IN_SKY,
    ],
  },

  // Cap. 1 · la Tierra queda atrás y se encoge.
  'leaving-earth': {
    sunRadius: 18,
    dust: 12,
    pulses: 5,
    bodies: [
      {
        id: 'earth',
        tex: 'earth',
        radius: 11,
        path: [
          { t: 0, p: [48, -3, -16] },
          { t: 52, p: [210, -10, -42] },
        ],
        halo: '#7fb8ff',
        spin: 0.05,
        tilt: 0.4,
      },
    ],
  },

  // Cap. 2 · cruzando la órbita de Marte, que pasa de largo.
  inner: {
    sunRadius: 14,
    dust: 16,
    bodies: [
      {
        id: 'mars',
        tex: 'mars',
        radius: 3.2,
        path: [
          { t: 0, p: [-150, 4, -40] },
          { t: 6, p: [-45, 4, -40] },
          { t: 9.5, p: [0, 4, -40] },
          { t: 13.65, p: [100, 4, -40] },
        ],
        halo: '#ff9a60',
        spin: 0.1,
        tilt: 0.3,
      },
    ],
  },

  // Cap. 2 · el cinturón de asteroides: entra, se espesa y se aclara.
  belt: {
    sunRadius: 11,
    dust: 18,
    bodies: [],
    rocks: {
      count: 70,
      speed: 11,
      density: [
        { t: 0, v: 0.25 },
        { t: 2, v: 1 },
        { t: 6, v: 1 },
        { t: 8, v: 0.55 },
      ],
    },
  },

  // Cap. 2 · fuera del cinturón: Júpiter, pequeño, al frente.
  outbound: {
    sunRadius: 9,
    dust: 16,
    bodies: [
      {
        id: 'jupiter',
        tex: 'jupiter',
        radius: 9,
        path: [
          { t: 0, p: [-430, 26, -190] },
          { t: 22.2, p: [-300, 26, -150] },
        ],
        halo: '#ffcf9a',
        spin: 0.06,
        tilt: 0.1,
      },
    ],
  },

  // Cap. 3 · Júpiter se acerca, pasa a la izquierda y llena la ventanilla.
  jupiter: {
    sunRadius: 6,
    dust: 14,
    bodies: [
      jupiter([
        { t: 0, p: [-260, 14, -95] },
        { t: 11, p: [-80, 12, -60] },
        { t: 19, p: [-20, 10, -46] },
        { t: 28, p: [-8, 10, -46] },
        { t: 36.7, p: [-2, 10, -46] },
      ]),
    ],
  },

  // Cap. 3 · las lunas cruzan delante de Júpiter; la de Ío se pierde por la radiación.
  'jupiter-moons': {
    sunRadius: 6,
    dust: 6,
    bodies: [
      jupiter([
        { t: 0, p: [0, 10, -46] },
        { t: 9, p: [10, 10, -46] },
      ]),
      {
        id: 'callisto',
        tex: 'moon',
        radius: 3.3,
        tint: '#8d7b6a',
        path: [
          { t: 0, p: [-18, 3, -16] },
          { t: 3.5, p: [18, 3, -16] },
          { t: 4.5, p: [60, 3, -16] },
        ],
        spin: 0.05,
      },
      {
        id: 'ganymede',
        tex: 'moon',
        radius: 3.8,
        tint: '#a29d95',
        path: [
          { t: 0, p: [-37, -1, -19] },
          { t: 1.8, p: [-18, -1, -19] },
          { t: 5.2, p: [18, -1, -19] },
          { t: 9, p: [58, -1, -19] },
        ],
        spin: 0.04,
      },
      {
        id: 'europa',
        tex: 'moon',
        radius: 2.7,
        tint: '#ece6d6',
        path: [
          { t: 0, p: [-54, 4, -17] },
          { t: 3.5, p: [-18, 4, -17] },
          { t: 7, p: [18, 4, -17] },
          { t: 9, p: [39, 4, -17] },
        ],
        spin: 0.06,
      },
      {
        id: 'io',
        tex: 'moon',
        radius: 2.9,
        tint: '#e8c64c',
        path: [
          { t: 0, p: [-54, 0, -14] },
          { t: 5.2, p: [-18, 0, -14] },
          { t: 7.2, p: [-4, 0, -14] },
          { t: 9, p: [9, 0, -14] },
        ],
        spin: 0.08,
        until: 7.2,
      },
    ],
  },

  // Cap. 3 · la cola magnética se extiende hacia delante; después Júpiter se aleja a toda velocidad.
  'jupiter-tail': {
    sunRadius: 6,
    dust: 14,
    tail: true,
    bodies: [
      jupiter([
        { t: 0, p: [12, 10, -46] },
        { t: 8.3, p: [30, 10, -46] },
        { t: 12, p: [60, 10, -46] },
        { t: 16, p: [140, 10, -46] },
        { t: 20.3, p: [330, 10, -46] },
      ]),
    ],
  },

  // Cap. 4 · la órbita de Neptuno: el Sol ya es una estrella más.
  neptune: {
    sunRadius: 2.6,
    dust: 12,
    bodies: [
      {
        id: 'neptune',
        tex: 'neptune',
        radius: 8,
        path: [
          { t: 0, p: [-120, 6, -60] },
          { t: 6, p: [-45, 6, -60] },
          { t: 17.4, p: [110, 6, -60] },
        ],
        halo: '#6aa0ff',
        spin: 0.08,
        tilt: 0.5,
      },
    ],
  },

  // Cap. 4–5 · espacio interestelar: casi nada, y la señal viajando hacia la Tierra.
  interstellar: {
    sunRadius: 1.2,
    dust: 8,
    pulses: 9,
    bodies: [],
  },

  // Cap. 5 · el legado: Aldebarán, roja, al frente.
  aldebaran: {
    sunRadius: 1.2,
    dust: 6,
    pulses: 12,
    bodies: [],
    glows: [{ pos: [-880, 70, -150], size: 150, color: '#ff7b4a' }],
  },
}

export function isDeepPlace(id: string): id is DeepPlaceId {
  return id in DEEP_PLACES
}
