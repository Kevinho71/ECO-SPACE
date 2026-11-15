import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { INTRO_SEEN_KEY, TOUR_SEEN_KEY, prefersReducedMotion, readFlag, writeFlag } from '../lib/prefs'
import { ZoomRoverIntro } from './ZoomRoverIntro'
import { startMenuMusic, userHasInteracted } from '../story/audio'

const LEAVE_MS = 500

/**
 * Portada: intro interactiva (vuelo hasta Opportunity), frase gancho y botón "Explorar".
 * Se muestra en todas las visitas; se puede saltar con "Saltar intro" o con Intro.
 * Al entrar empieza el recorrido guiado si aún no se ha visto.
 */
export function Splash() {
  const setStage = useAppStore((s) => s.setStage)
  const setTourStep = useAppStore((s) => s.setTourStep)
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
    if (showCta) buttonRef.current?.focus({ preventScroll: true })
  }, [showCta])

  const fade = `transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#02040a]/90 via-[#02040a]/70 to-[#02040a]/90 px-6 text-center ${fade}`}
    >
      <h1 className="splash-tracking text-3xl font-semibold text-white md:text-5xl">ECOSPACE</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.35em] text-slate-400 md:text-sm">Abandoned but not Forgotten</p>

      {showCta ? (
        <>
          <p className="subtitle-in mt-10 max-w-2xl text-xl font-semibold leading-relaxed tracking-[0.08em] text-slate-100 md:text-3xl">
            Hace décadas dejamos robots en la Luna, en Marte y en el espacio profundo.
            <br />
            <span className="text-cyan-200">Ya no responden.</span>
          </p>

          <p className="subtitle-in mt-5 max-w-xl text-sm leading-relaxed tracking-[0.06em] text-slate-300 md:text-base" style={{ animationDelay: '0.5s' }}>
            EcoSpace te lleva hasta ellos para descubrir qué hicieron y qué le enseñaron a la humanidad.
          </p>

          <ol className="subtitle-in mt-8 grid w-full max-w-2xl gap-3 text-left text-xs tracking-[0.06em] text-slate-300 md:grid-cols-3 md:text-sm" style={{ animationDelay: '1s' }}>
            {[
              ['1', 'Elige un mundo', 'en el mapa del sistema solar.'],
              ['2', 'Visita su robot', 'y mira dónde quedó abandonado.'],
              ['3', 'Vive su historia', 'con datos reales de la NASA.'],
            ].map(([n, title, text]) => (
              <li key={n} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-cyan-300">{n}</span> <span className="font-semibold text-white">{title}</span>
                <br />
                {text}
              </li>
            ))}
          </ol>

          <button
            ref={buttonRef}
            onClick={enter}
            className="subtitle-in mt-8 rounded-full border border-cyan-300/60 bg-cyan-400/10 px-8 py-3 text-base font-medium text-cyan-100 shadow-[0_0_30px_rgba(110,247,255,0.2)] transition hover:bg-cyan-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:text-lg"
            style={{ animationDelay: '1.5s' }}
          >
            Explorar el cementerio de las estrellas
          </button>
        </>
      ) : (
        <>
          <div className="mt-8 flex w-full justify-center">
            <ZoomRoverIntro onDone={() => setShowCta(true)} />
          </div>
          <button onClick={enter} className="mt-6 text-xs text-slate-600 hover:text-slate-400">
            Saltar intro
          </button>
        </>
      )}
    </div>
  )
}
