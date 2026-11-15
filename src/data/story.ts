// Tipos de las historias por capítulos (ver HISTORIA_OPPORTUNITY.md).
// Todos los tiempos están en SEGUNDOS desde el inicio del capítulo.
// Las voces (AWS Polly) están pendientes: por ahora la narración es solo subtítulos.

export type Expression = 'Sad' | 'Surprised' | 'Sleep' | null

/** Escenarios del espacio profundo (sin suelo): el mundo pasa alrededor de la sonda. Ver `deepPlaces.ts`. */
export type DeepPlaceId =
  | 'leaving-earth'
  | 'inner'
  | 'belt'
  | 'outbound'
  | 'jupiter'
  | 'jupiter-moons'
  | 'jupiter-tail'
  | 'neptune'
  | 'interstellar'
  | 'aldebaran'
  // Apolo 11 (Eagle): del lanzamiento al descenso, en el espacio.
  | 'earth-orbit'
  | 'translunar'
  | 'lunar-orbit'
  | 'descent'
  // Surveyor 3: aproximación corta a la Luna antes de tocar el suelo.
  | 'moon-approach'

/** Lugares con superficie lunar (los dibuja LunarScene). */
export type LunarPlaceId = 'tranquility' | 'oceanus'

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
  | DeepPlaceId
  | LunarPlaceId

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

/**
 * Vista exterior ('wide'): órbita lenta alrededor de un punto del robot. Todo es opcional;
 * por defecto: dist 7,5 · altura 2,3 · az 0,9 · vaivén ±0,35 · objetivo (0; 0,85; 0).
 */
export interface WideShot {
  dist?: number
  /** Altura absoluta de la cámara (m). */
  height?: number
  /** Ángulo base (rad) medido desde +X (frente del robot) hacia +Z (derecha). */
  az?: number
  /** Amplitud del vaivén lento alrededor de `az` (rad). */
  swing?: number
  /** Punto al que mira [x, y, z]; la órbita se centra en su x/z. */
  target?: [number, number, number]
  fov?: number
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
  | 'alarm' // alarmas del ordenador (1202 / 1201)
  | 'thud' // golpe seco (contacto con el suelo)
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
  /** Vista exterior configurable (escalonada). Sin ella, la órbita por defecto de `WideShot`. */
  wide?: Keyframe<WideShot>[]
  /** Cuánto del giro/balanceo del robot hereda la cámara POV, 0–1 (1 = todo; 0 = horizonte fijo). Por defecto 1. */
  povRoll?: Keyframe<number>[]
  /**
   * Pistas numéricas con nombre (interpoladas) que leen las piezas propias de cada robot desde
   * `storyRuntime.tracks`: p. ej. 'ascent' (altura de la cabina de Eagle) y 'fire' (su motor encendido).
   */
  tracks?: Record<string, Keyframe<number>[]>
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

/** Textos de las pantallas que rodean a la historia (inicio, exploración, cierre). Lo que falte usa los de Opportunity. */
export interface StoryTexts {
  /** Línea pequeña sobre el nombre en la pantalla de inicio. */
  kicker: string
  /** Nombre del robot en la pantalla de inicio. */
  name: string
  /** Presentación bajo el nombre. */
  intro: string
  /** Botón de inicio. */
  startLabel: string
  /** Botón para pasar a explorar el modelo. */
  exploreLabel: string
  /** Pista mientras se explora. */
  exploreHint: string
  /** Línea pequeña sobre la tarjeta de aclaración del cierre. */
  endKicker: string
}

export const DEFAULT_STORY_TEXTS: StoryTexts = {
  kicker: 'Mars Exploration Rover · MER-B',
  name: 'Opportunity',
  intro: 'Vas a vivir su historia desde dentro: tus ojos serán los suyos. Mira alrededor arrastrando.',
  startLabel: '▶ Despertar a Oppy',
  exploreLabel: 'Explorar el rover',
  exploreHint: 'Arrastra para girar alrededor de Oppy · pulsa los puntos brillantes para ver sus partes',
  endKicker: '¿Qué dijo de verdad?',
}

/**
 * Tarjeta expandible "¿Qué pasaría si…?" del modo Explorar (contrafactual educativo).
 * Siempre se muestra como HIPOTÉTICA; debe nacer de un hecho documentado y citar fuentes.
 */
export interface WhatIfCard {
  id: string
  /** Completa "¿Qué pasaría si …?" (sin signos). */
  question: string
  /** El escenario imaginado (1–3 frases, en condicional). */
  imagine: string
  /** Lo que sí ocurrió (el "reality check"). */
  reality: string
  /** La ciencia o ingeniería que explica el contraste. */
  science: string
  sources: { label: string; url: string }[]
  /** Hotspot (id de `HOTSPOTS`) que se resalta al abrir la tarjeta. */
  focus?: string
  /** Acción del robot (`ExploreAction.id`) que ilustra la tarjeta. */
  action?: string
}

/**
 * Acción que el usuario puede lanzar en Explorar. Usa un clip del GLB (`clip`) o un movimiento por código
 * (`motion`, ver `src/three/exploreActions.ts`), o ambos a la vez.
 */
export interface ExploreAction {
  id: string
  label: string
  /** Frase corta bajo el botón. */
  hint: string
  /** Clip del GLB. Acabado en «!» = una sola vez y queda en su última pose hasta que acabe la acción. */
  clip?: string
  /** Movimiento procedural (clave de `EXPLORE_MOTIONS`). */
  motion?: string
  /** Segundos que dura antes de volver a Idle. */
  duration: number
  /** Hotspot que se enseña mientras dura. */
  focus?: string
}

/**
 * Conducción libre tras el final de la historia (solo robots que se mueven de verdad).
 *  - 'wheels': el robot rueda por la zona (el suelo se desplaza bajo él).
 *  - 'fly': vuela libremente sobre la zona (también sube y baja).
 *  - 'rover-node': el robot principal se queda quieto y se maneja un rover que lleva dentro del modelo (Sojourner).
 */
export interface DriveConfig {
  kind: 'wheels' | 'fly' | 'rover-node'
  /** Velocidad máxima (m/s). Más rápida que la real, para que explorar sea ágil. */
  maxSpeed: number
  /** Nodo del GLB que se maneja (solo 'rover-node'). */
  node?: string
  /** Radio máximo (m) alrededor del punto de partida (solo 'rover-node'). Por defecto 14. */
  radius?: number
  /** Altura máxima (m) (solo 'fly'). Por defecto 12. */
  maxAlt?: number
  /** Texto del botón de la pantalla final. */
  label: string
}

/** Modo Explorar: escenario base y acciones del robot. */
export interface ExploreConfig {
  /** Lugar en el que se explora el robot (superficie, sin depender del capítulo en curso). */
  place: PlaceId
  actions: ExploreAction[]
  /** Si el robot se mueve, permite recorrer la zona al terminar la historia. */
  drive?: DriveConfig
}

export interface Story {
  missionId: string
  /** Tarjetas "¿Qué pasaría si…?" que aparecen al explorar el robot. */
  whatIfs?: WhatIfCard[]
  /** Escenario y acciones del modo Explorar. */
  explore?: ExploreConfig
  /** Textos propios de las pantallas de esta historia (opcional). */
  texts?: Partial<StoryTexts>
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
