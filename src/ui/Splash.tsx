import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { INTRO_SEEN_KEY, TOUR_SEEN_KEY, prefersReducedMotion, readFlag, writeFlag } from '../lib/prefs'
import { HeartbeatIntro } from './HeartbeatIntro'
import { startMenuMusic, userHasInteracted } from '../story/audio'

const LEAVE_MS = 500
const RETURNING_AUTO_MS = 2600

/**
 * Portada.
 *  - Primera visita: frase gancho y botón "Explorar". No avanza sola. Al entrar empieza el recorrido guiado.
 *  - Visitas siguientes: solo el título, que se desvanece solo (o con un clic / tecla).
 * El sistema solar se ve detrás, a través de un velo translúcido.
 */
export function Splash() {
  const setStage = useAppStore((s) => s.setStage)
  const setTourStep = useAppStore((s) => s.setTourStep)
  const [returning] = useState(() => readFlag(INTRO_SEEN_KEY))
  const [leaving, setLeaving] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const left = useRef(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const enter = useCallback(() => {
    if (left.current) return
    left.current = true
    writeFlag(INTRO_SEEN_KEY)
    // Música del menú: el clic/tecla que entra es el gesto que el navegador exige (en el auto-avance, empezará con el primer clic).
    if (userHasInteracted()) startMenuMusic(useAppStore.getState().soundOn)
    setLeaving(true)
    setTimeout(() => {
      setStage('solar-map')
      if (!readFlag(TOUR_SEEN_KEY) && !prefersReducedMotion()) setTourStep(0)
    }, LEAVE_MS)
  }, [setStage, setTourStep])

  // Visitante que vuelve: avanza solo.
  useEffect(() => {
    if (!returning) return
    const t = setTimeout(enter, RETURNING_AUTO_MS)
    return () => clearTimeout(t)
  }, [returning, enter])

  // Teclado: Intro, Espacio o Escape para entrar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter])

  useEffect(() => {
    if (!returning && showCta) buttonRef.current?.focus({ preventScroll: true })
  }, [returning, showCta])

  const fade = `transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`

  if (returning) {
    return (
      <div
        onClick={enter}
        className={`absolute inset-0 z-40 flex cursor-pointer flex-col items-center justify-center bg-[#02040a]/80 ${fade}`}
      >
        <h1 className="splash-tracking text-5xl font-semibold text-white md:text-7xl">ECOSPACE</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-400">Abandoned but not Forgotten</p>
        <p className="mt-10 text-xs text-slate-500">Clic o Intro para continuar</p>
      </div>
    )
  }

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#02040a]/90 via-[#02040a]/70 to-[#02040a]/90 px-6 text-center ${fade}`}
    >
      <h1 className="splash-tracking text-3xl font-semibold text-white md:text-5xl">ECOSPACE</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.35em] text-slate-400 md:text-sm">Abandoned but not Forgotten</p>

      <div className="mt-8 flex w-full justify-center">
        <HeartbeatIntro onDone={() => setShowCta(true)} />
      </div>

      {showCta ? (
        <>
          <p className="subtitle-in mt-6 max-w-xl text-lg leading-relaxed text-slate-100 md:text-2xl">
            Hay robots que siguen ahí fuera, en la Luna, en Marte y más allá.
            <br />
            <span className="text-slate-300">Cada uno dejó de latir un día. Nadie te ha contado cómo.</span>
          </p>

          <button
            ref={buttonRef}
            onClick={enter}
            className="subtitle-in mt-8 rounded-full border border-cyan-300/60 bg-cyan-400/10 px-8 py-3 text-base font-medium text-cyan-100 shadow-[0_0_30px_rgba(110,247,255,0.2)] transition hover:bg-cyan-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:text-lg"
            style={{ animationDelay: '0.6s' }}
          >
            Explorar el cementerio de las estrellas
          </button>
        </>
      ) : (
        <button onClick={enter} className="mt-6 text-xs text-slate-600 hover:text-slate-400">
          Saltar intro
        </button>
      )}
    </div>
  )
}
