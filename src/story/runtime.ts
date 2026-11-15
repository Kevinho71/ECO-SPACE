// Valores continuos de la historia, leídos cada fotograma por el Canvas y el DOM.
// Es un objeto mutable (no estado de React) para no re-renderizar 60 veces por segundo.

export const storyRuntime = {
  /** ¿Hay una historia en reproducción en esta escena? */
  active: false,
  /** Tiempo (s) dentro del capítulo actual. */
  t: 0,
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
  /** Relieve bajo el robot (calculado por el escenario). */
  groundY: 0,
  pitch: 0,
  roll: 0,
}

export function resetRuntime() {
  Object.assign(storyRuntime, {
    active: false,
    t: 0,
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
    groundY: 0,
    pitch: 0,
    roll: 0,
  })
}
