// Valores continuos de la historia, leídos cada fotograma por el Canvas y el DOM.
// Es un objeto mutable (no estado de React) para no re-renderizar 60 veces por segundo.

export const storyRuntime = {
  /** ¿Hay una historia en reproducción en esta escena? */
  active: false,
  /** Tiempo (s) dentro del capítulo actual. */
  t: 0,
  /** Segundos desde que empezó el lugar actual (los escenarios del espacio se animan con él). */
  placeT: 0,
  chapter: 0,
  staticLevel: 0,
  dust: 0,
  powerOff: 0,
  shake: 0,
  robotX: 0,
  battery: 1,
  signal: 1,
  /** Giro de la mirada del usuario respecto a la cámara de la historia (radianes). */
  lookYaw: 0,
  lookPitch: 0,
  /** Giro automático de la mirada (panorámica). */
  pan: 0,
  /** Párpado: 0 abierto, 1 cerrado. */
  blink: 0,
  /** Velocidad visual (m/s), hundimiento (m) y patinaje (0–1). */
  speed: 0,
  sink: 0,
  slip: 0,
  robotVisible: true,
  /** Altura (m), cabeceo (rad), sesgo de la mirada (rad), daño de palas (0–1) y rotores girando (0–1). */
  alt: 0,
  tilt: 0,
  gaze: 0,
  damage: 0,
  spin: 0,
  /** Posición de Perseverance (m); ≥ 900 = fuera de escena. */
  roverX: 999,
  /** Relieve bajo el robot (calculado por el escenario). */
  groundY: 0,
  pitch: 0,
  roll: 0,
  /** Pistas numéricas de la historia (ver `StoryChapter.tracks`). */
  tracks: {} as Record<string, number>,
}

export function resetRuntime() {
  Object.assign(storyRuntime, {
    active: false,
    t: 0,
    placeT: 0,
    chapter: 0,
    staticLevel: 0,
    dust: 0,
    powerOff: 0,
    shake: 0,
    robotX: 0,
    battery: 1,
    signal: 1,
    lookYaw: 0,
    lookPitch: 0,
    pan: 0,
    blink: 0,
    speed: 0,
    sink: 0,
    slip: 0,
    robotVisible: true,
    alt: 0,
    tilt: 0,
    gaze: 0,
    damage: 0,
    spin: 0,
    roverX: 999,
    groundY: 0,
    pitch: 0,
    roll: 0,
    tracks: {},
  })
}
