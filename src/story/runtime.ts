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
  })
}
