// Tipos de las historias por capítulos (ver HISTORIA_OPPORTUNITY.md).
// Todos los tiempos están en SEGUNDOS desde el inicio del capítulo.
// Las voces (AWS Polly) están pendientes: por ahora la narración es solo subtítulos.

export type Expression = 'Sad' | 'Surprised' | 'Sleep' | null

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
  /** Cámara: 'pov' (ojo del robot) o 'wide' (vista exterior). */
  camera: Keyframe<'pov' | 'wide'>[]
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
  /** Posición del robot a lo largo de +X (m), para escenas de avance (interpolada). */
  robotX?: Keyframe<number>[]
  battery: Keyframe<number>[]
  signal: Keyframe<number>[]
  clips: Keyframe<string>[]
  expressions: Keyframe<Expression>[]
  hud: Keyframe<HudState>[]
  sfx?: Keyframe<SfxKind>[]
  cards?: StoryCard[]
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
