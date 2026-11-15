import { useAppStore, type LocationId } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { TOUR_STOPS } from '../three/SolarMap'
import { TOUR_SEEN_KEY, writeFlag } from '../lib/prefs'

/** Datos de cada destino para la barra y el recorrido. */
const DESTINATIONS: { id: LocationId; name: string; blurb: string; swatch: string }[] = [
  {
    id: 'moon',
    name: 'Luna',
    blurb: 'Donde pisamos otro mundo por primera vez',
    swatch: 'radial-gradient(circle at 35% 35%, #f2f2f2, #9a9a9a 60%, #5c5c5c)',
  },
  {
    id: 'mars',
    name: 'Marte',
    blurb: 'Rovers, un sismógrafo y un helicóptero',
    swatch: 'radial-gradient(circle at 35% 35%, #ffb27a, #c8501f 60%, #6e2410)',
  },
  {
    id: 'beyond',
    name: 'Más allá',
    blurb: 'Una sonda que sigue viajando',
    swatch: 'radial-gradient(circle at 35% 35%, #c7d6ff, #5b7fe6 60%, #22337a)',
  },
]

function robotsOf(id: LocationId) {
  return MISSIONS.filter((m) => m.location === id).map((m) => m.nickname ?? m.name)
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`
}

/** Texto del recorrido guiado para cada parada. */
const TOUR_CAPTIONS: Record<LocationId, string> = {
  moon: `La Luna. Aquí esperan ${joinNames(robotsOf('moon'))}.`,
  mars: `Marte. Aquí descansan ${joinNames(robotsOf('mars'))}.`,
  beyond: `Más allá de los planetas, ${joinNames(robotsOf('beyond'))} sigue viajando hacia las estrellas.`,
}

function TourCaption({ step }: { step: number }) {
  const setTourStep = useAppStore((s) => s.setTourStep)
  const atStop = step < TOUR_STOPS.length
  const text = atStop ? TOUR_CAPTIONS[TOUR_STOPS[step]] : 'Ahora te toca a ti: elige un destino.'

  return (
    <div className="flex flex-col items-center gap-3 px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Recorrido · {atStop ? `${step + 1} de ${TOUR_STOPS.length}` : 'listo'}
      </p>
      <p key={step} className="subtitle-in max-w-xl text-lg text-white md:text-xl" aria-live="polite">
        {text}
      </p>
      {atStop && (
        <button
          onClick={() => {
            writeFlag(TOUR_SEEN_KEY)
            setTourStep(TOUR_STOPS.length)
          }}
          className="pointer-events-auto rounded-full border border-white/20 px-4 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Saltar recorrido
        </button>
      )}
    </div>
  )
}

function Header() {
  const setTourStep = useAppStore((s) => s.setTourStep)
  return (
    <div className="flex flex-col items-center gap-2 px-4 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">EcoSpace</p>
      <h1 className="text-2xl font-semibold text-white md:text-3xl">El cementerio de las estrellas</h1>
      <p className="max-w-lg text-sm text-slate-300">
        Elige un destino abajo o haz clic en un punto brillante. Arrastra para girar el sistema solar.
      </p>
      <button
        onClick={() => setTourStep(0)}
        className="pointer-events-auto mt-1 text-xs text-cyan-300/80 underline-offset-4 transition hover:text-cyan-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        ↺ Ver el recorrido otra vez
      </button>
    </div>
  )
}

/** Barra fija con los tres destinos: alternativa clara al clic en 3D (teclado, móvil, accesibilidad). */
function DestinationBar() {
  const hovered = useAppStore((s) => s.hoveredLocation)
  const tourStep = useAppStore((s) => s.tourStep)
  const setHovered = useAppStore((s) => s.setHoveredLocation)
  const requestLocation = useAppStore((s) => s.requestLocation)
  const tourTarget = tourStep !== null && tourStep < TOUR_STOPS.length ? TOUR_STOPS[tourStep] : null

  return (
    <nav aria-label="Destinos" className="w-full max-w-3xl px-4">
      <ul className="grid grid-cols-3 gap-2 md:gap-3">
        {DESTINATIONS.map((d) => {
          const robots = robotsOf(d.id)
          const lit = hovered === d.id || tourTarget === d.id
          return (
            <li key={d.id}>
              <button
                onClick={() => requestLocation(d.id)}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.id)}
                onBlur={() => setHovered(null)}
                aria-label={`Visitar ${d.name}: ${robots.length} ${robots.length === 1 ? 'robot' : 'robots'}, ${joinNames(robots)}`}
                className={`pointer-events-auto flex h-full w-full flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center backdrop-blur-md transition md:flex-row md:items-start md:gap-3 md:px-4 md:text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  lit
                    ? 'border-amber-200/60 bg-slate-900/80 shadow-[0_0_24px_rgba(255,214,130,0.22)]'
                    : 'border-white/15 bg-slate-950/60 hover:bg-slate-900/70'
                }`}
              >
                <span
                  aria-hidden
                  className="mt-0.5 h-8 w-8 shrink-0 rounded-full md:h-10 md:w-10"
                  style={{ background: d.swatch }}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-white md:text-base">{d.name}</span>
                  <span className="text-xs text-amber-200/90">
                    {robots.length} {robots.length === 1 ? 'robot' : 'robots'}
                  </span>
                  <span className="mt-1 hidden text-xs text-slate-400 md:block">{joinNames(robots)}</span>
                  <span className="hidden text-[11px] italic text-slate-500 lg:block">{d.blurb}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Interfaz del menú principal (sistema solar). */
export function SolarMenu() {
  const tourStep = useAppStore((s) => s.tourStep)
  return (
    <div className="flex h-full flex-col items-center justify-between pb-5 pt-6 md:pb-8">
      {tourStep !== null ? <TourCaption step={tourStep} /> : <Header />}
      <DestinationBar />
    </div>
  )
}
