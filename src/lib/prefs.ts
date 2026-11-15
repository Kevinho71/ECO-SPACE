// Preferencias del visitante guardadas en el navegador. Todo va envuelto en try/catch:
// en modo privado o con el almacenamiento bloqueado, la app funciona igual (como primera visita).

export const INTRO_SEEN_KEY = 'ecospace.introSeen'
export const TOUR_SEEN_KEY = 'ecospace.tourSeen'

export function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function writeFlag(key: string): void {
  try {
    window.localStorage.setItem(key, '1')
  } catch {
    // sin almacenamiento: no pasa nada
  }
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}
