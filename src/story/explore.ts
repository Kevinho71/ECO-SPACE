// Acciones del robot en el modo Explorar. El estado visible (acción en curso) va al store;
// el movimiento por código usa un objeto mutable que lee `Robot.tsx` en cada fotograma.
import { useAppStore } from '../store/useAppStore'
import type { ExploreAction } from '../data/story'

export const exploreRuntime = {
  /** Clave de `EXPLORE_MOTIONS` en curso (null = ninguna). */
  motion: null as string | null,
  /** Instante (s del reloj de three) en que empezó; lo fija `Robot.tsx` en su primer fotograma. */
  t0: -1,
  /** Duración (s) de la acción en curso. */
  duration: 1,
  /** Daño de palas 0–1 que un movimiento puede pedir (Ingenuity); lo aplica `Robot.tsx`. */
  damage: 0,
}

let timer: ReturnType<typeof setTimeout> | undefined

export const exploreControls = {
  /** Ejecuta una acción: clip y/o movimiento; al acabar el robot vuelve a Idle. */
  run(a: ExploreAction) {
    clearTimeout(timer)
    const s = useAppStore.getState()
    exploreRuntime.motion = a.motion ?? null
    exploreRuntime.t0 = -1
    exploreRuntime.duration = a.duration
    exploreRuntime.damage = 0
    s.patchStory({
      exploreAction: a.id,
      exploreNonce: s.exploreNonce + 1,
      storyClip: a.clip ?? 'Idle',
      ...(a.focus ? { activeHotspotId: a.focus } : {}),
    })
    timer = setTimeout(() => exploreControls.stop(), a.duration * 1000)
  },
  /** Detiene la acción en curso y devuelve al robot a Idle. */
  stop() {
    clearTimeout(timer)
    exploreRuntime.motion = null
    exploreRuntime.damage = 0
    const s = useAppStore.getState()
    if (s.exploreAction === null) return
    s.patchStory({ exploreAction: null, exploreNonce: s.exploreNonce + 1, storyClip: 'Idle' })
  },
}
