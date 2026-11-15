// Tipos de las historias por capítulos (ver HISTORIA_OPPORTUNITY.md).
// Todos los tiempos están en SEGUNDOS desde el inicio del capítulo.
// Las voces (AWS Polly) están pendientes: por ahora la narración es solo subtítulos.

export type Expression = 'Sad' | 'Surprised' | 'Sleep' | null

/** Lugares (escenarios) por los que pasa la historia. 'launch'/'cruise'/'entry' son escenas del viaje en el espacio. */
export type PlaceId =
  | 'generic'
  | 'launch'
  | 'cruise'
  | 'entry'
  | 'eagle'
  | 'plains'
  | 'purgatory'
  | 'endurance'
  | 'victoria'
  | 'endeavour'
  | 'perseverance'
  // Ingenuity (Jezero)
  | 'jezero'
  | 'airfield'
  | 'outcrop'
  | 'sandwaves'
  // InSight (Elysium Planitia)
  | 'elysium'
  // Pathfinder (Ares Vallis)
  | 'aresvallis'

/**
 * pov = ojo del robot (1.ª persona) · wide = vista exterior orbitando · chase = cámara que persigue al robot en vuelo
 * (3.ª persona) · part = primer plano de una pieza · flight = cámara cinematográfica del viaje
 */
export type StoryView = 'pov' | 'wide' | 'chase' | 'part' | 'flight'

/** Pieza del robot que se enseña con la cámara 'part'. */
export interface PartFocus {
  /** Nodo del GLB que se enfoca. */
  node: string
  /** Id de HOTSPOTS (rótulo con título y dato). */
  hotspot: string
  dist: number
  /** Ángulo horizontal (rad) medido desde +X (frente del robot) hacia +Z (derecha). */
  az: number
  /** Elevación (rad). */
  el: number
}

/** Valor que cambia a lo largo del capítulo (interpolación lineal o escalonada según el campo). */
export interface Keyframe<T> {
  t: number
  v: T
}

/** Línea de subtítulo: se muestra desde `t` hasta la siguiente. */
export interface Cue {
  t: number
  text: string
  /** 'oppy' = el robot (primera persona). 'narrator' = voz serena del cierre (tercera persona). */
  voice?: 'oppy' | 'narrator'
}

/** Estado de la telemetría (HUD). Los campos opcionales solo se muestran si hay un dato verificado. */
export interface HudState {
  date: string
  place: string
  sol?: string
  temp?: string
  /** Etiqueta de fase (p. ej. durante el registro de vuelo). */
  phase?: string
  hidden?: boolean
  /** Muestra la altitud en vivo (`storyRuntime.alt`) en la telemetría. */
  showAlt?: boolean
}

export type SfxKind =
  | 'boot'
  | 'rumble' // entrada atmosférica
  | 'chute'
  | 'retro'
  | 'airbag'
  | 'tumble'
  | 'unfold'
  | 'powerdown'
  | 'relay'
  | 'blink'
  | 'rotor' // rotores acelerando
  | 'thud' // golpe seco contra el suelo
  | 'quake' // martemoto
  | 'hammer' // golpecitos del topo

export interface StoryCard {
  at: number
  dur: number
  kind: 'quote' | 'note'
  text: string
  author?: string
  source?: string
}

export interface FlightEvent {
  t: number
  label: string
}

export interface StoryChapter {
  id: string
  /** Número y título mostrados al empezar el capítulo. */
  title: string
  subtitle: string
  duration: number
  cues: Cue[]
  /** Cámara de la historia (ver StoryView). */
  camera: Keyframe<StoryView>[]
  /** Lugar con el que empieza el capítulo. */
  place0: PlaceId
  /** "Parpadeos": a los `t` s los párpados se cierran y, en lo más oscuro (t+0,3 s), el escenario pasa a `to`. */
  jumps?: { t: number; to: PlaceId }[]
  /** Pieza enfocada (solo con la cámara 'part'). */
  partFocus?: Keyframe<PartFocus | null>[]
  /** Giro automático de la mirada (rad), para panorámicas. */
  pan?: Keyframe<number>[]
  /** Hundimiento de las ruedas en la arena (m) y patinaje (0–1). */
  sink?: Keyframe<number>[]
  slip?: Keyframe<number>[]
  /** ¿Se ve el robot? (durante el viaje va plegado dentro de la nave). Por defecto sí. */
  robot?: Keyframe<boolean>[]
  /** 'surface' = escena de Marte; 'flight' = registro de vuelo (solo telemetría). */
  scene: Keyframe<'surface' | 'flight'>[]
  /** Estática / glitch del feed de cámara, 0–1 (interpolada). */
  staticLevel: Keyframe<number>[]
  /** Polvo en suspensión / oscuridad de la tormenta, 0–1 (interpolada). */
  dust?: Keyframe<number>[]
  /** Apagado del feed (corte eléctrico), 0–1 (interpolada). */
  powerOff?: Keyframe<number>[]
  /** Vibración de pantalla durante el aterrizaje, 0–1 (interpolada). */
  shake?: Keyframe<number>[]
  /** Distancia recorrida por el robot en el lugar actual (m). El mundo se desplaza bajo él (interpolada). */
  robotX?: Keyframe<number>[]
  battery: Keyframe<number>[]
  signal: Keyframe<number>[]
  clips: Keyframe<string>[]
  /** Clip que se queda en su última pose durante el capítulo, mezclado con el clip actual (si no comparten huesos). */
  hold?: string
  expressions: Keyframe<Expression>[]
  hud: Keyframe<HudState>[]
  sfx?: Keyframe<SfxKind>[]
  cards?: StoryCard[]
  /** Altura sobre el suelo (m) del robot, si vuela (Ingenuity). Interpolada. */
  alt?: Keyframe<number>[]
  /** Cabeceo hacia delante al volar (rad; positivo = morro abajo). Interpolado. */
  tilt?: Keyframe<number>[]
  /** Inclinación extra de la mirada del POV (rad; negativo = mirar hacia abajo). Interpolada. */
  gaze?: Keyframe<number>[]
  /** Posición (m, mismo eje que `robotX`) de Perseverance en el lugar actual; ≥ 900 = fuera de escena. Interpolada. */
  rover?: Keyframe<number>[]
  /** Deterioro 0–1 (interpolado): palas rotas (Ingenuity) o polvo sobre los paneles solares (InSight). */
  damage?: Keyframe<number>[]
  /** Marcas de sub-escenas dentro del capítulo (se ven en la línea de tiempo). */
  marks?: { t: number; label: string }[]
  /** Hitos del registro de vuelo (solo capítulos con escena 'flight'). */
  flightEvents?: FlightEvent[]
  /** Instante (s) del corte eléctrico, si lo hay (para el sonido de apagado). */
  powerCutAt?: number
  /** Clave del audio narrado (pendiente: voces). */
  audioKey?: string
}

export interface Story {
  missionId: string
  chapters: StoryChapter[]
  /** Ajuste de la cámara 'wide' para robots pequeños: distancia de la órbita (m) y altura del punto que mira (m). */
  view?: { wideDist: number; wideTarget: number }
  /** Textos de la pantalla inicial. */
  intro?: { kicker: string; name: string; blurb: string; button: string; short: string }
  /** Tarjeta de transparencia mostrada al terminar. */
  transparency: { title: string; body: string; sources: { label: string; url: string }[] }
}

// ---------------------------------------------------------------------------
// Utilidades de muestreo de keyframes
// ---------------------------------------------------------------------------

/** Valor escalonado: el último keyframe con t <= tiempo. */
export function sampleStep<T>(kfs: Keyframe<T>[] | undefined, t: number, fallback: T): T {
  if (!kfs || kfs.length === 0) return fallback
  let out = kfs[0].v
  for (const k of kfs) {
    if (k.t <= t) out = k.v
    else break
  }
  return out
}

/** Interpolación lineal entre keyframes numéricos. */
export function sampleLinear(kfs: Keyframe<number>[] | undefined, t: number, fallback = 0): number {
  if (!kfs || kfs.length === 0) return fallback
  if (t <= kfs[0].t) return kfs[0].v
  for (let i = 1; i < kfs.length; i++) {
    if (t <= kfs[i].t) {
      const a = kfs[i - 1]
      const b = kfs[i]
      const u = (t - a.t) / Math.max(1e-6, b.t - a.t)
      return a.v + (b.v - a.v) * u
    }
  }
  return kfs[kfs.length - 1].v
}
