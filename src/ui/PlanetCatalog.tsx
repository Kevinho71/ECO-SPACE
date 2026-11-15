import { useEffect, useState } from 'react'
import { useAppStore, type LocationId } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { getStory } from '../story/StoryDirector'
import { getRobotThumbnail } from '../three/lib/robotThumbnails'

/** Imagen del diseño 3D del robot (generada a partir de su GLB), con estado de carga y respaldo. */
function RobotThumb({ modelPath, name, lit }: { modelPath: string; name: string; lit: boolean }) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    getRobotThumbnail(modelPath)
      .then((url) => alive && setSrc(url))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [modelPath])

  return (
    <div
      className={`relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg md:h-28 ${
        lit ? 'bg-[radial-gradient(circle_at_50%_60%,rgba(255,217,138,0.22),rgba(15,23,42,0.6)_70%)]' : 'bg-[radial-gradient(circle_at_50%_60%,rgba(148,163,184,0.16),rgba(15,23,42,0.6)_70%)]'
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={`Diseño 3D de ${name}`}
          draggable={false}
          className={`h-full w-full object-contain transition-transform duration-300 ${lit ? 'scale-105' : ''}`}
        />
      ) : failed ? (
        <span className="text-2xl font-semibold text-slate-500" aria-hidden>
          {name.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <span className="h-full w-full animate-pulse bg-white/5" aria-label={`Cargando imagen de ${name}`} />
      )}
    </div>
  )
}

const TITLE: Record<LocationId, string> = {
  moon: 'Robots en la Luna',
  mars: 'Robots en Marte',
  beyond: 'Más allá de los planetas',
}

/**
 * Catálogo lateral del mapa planetario: una tarjeta por robot.
 * Pasar el ratón (o el foco) por una tarjeta resalta su baliza en el globo; pulsarla
 * hace volar la cámara hasta el robot y entra en su escena.
 * En pantallas estrechas se muestra como una tira horizontal desplazable.
 */
export function PlanetCatalog({ location }: { location: LocationId }) {
  const hovered = useAppStore((s) => s.hoveredMission)
  const setHovered = useAppStore((s) => s.setHoveredMission)
  const requestMission = useAppStore((s) => s.requestMission)
  const missions = MISSIONS.filter((m) => m.location === location)

  return (
    <aside
      aria-label={TITLE[location]}
      className="pointer-events-auto flex w-full flex-col rounded-2xl border border-white/15 bg-slate-950/70 p-3 backdrop-blur-md md:max-h-full md:w-80 md:p-4"
    >
      <div className="mb-2 flex items-baseline justify-between gap-2 px-1 md:mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">{TITLE[location]}</h2>
        <span className="text-xs text-amber-200/90">
          {missions.length} {missions.length === 1 ? 'robot' : 'robots'}
        </span>
      </div>

      <ul className="flex snap-x gap-2 overflow-x-auto pb-1 md:min-h-0 md:flex-col md:gap-3 md:overflow-y-auto md:overflow-x-visible md:pb-0 md:pr-1">
        {missions.map((m) => {
          const lit = hovered === m.id
          const hasStory = !!getStory(m.id)
          return (
            <li key={m.id} className="w-60 shrink-0 snap-start md:w-auto">
              <button
                onClick={() => requestMission(m.id)}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
                className={`flex h-full w-full flex-col gap-1 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
                  lit
                    ? 'border-amber-200/60 bg-slate-900/90 shadow-[0_0_20px_rgba(255,214,130,0.18)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <RobotThumb modelPath={m.modelPath} name={m.nickname ?? m.name} lit={lit} />
                <div className="mt-1 flex items-start justify-between gap-2">
                  <span className="text-base font-semibold text-white">{m.nickname ?? m.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{m.launchYear}</span>
                </div>
                {m.nickname && m.nickname !== m.name && (
                  <span className="text-xs text-slate-400">{m.name}</span>
                )}
                <span className="text-xs text-amber-200/80">{m.celestialBody}</span>
                <p className="mt-1 line-clamp-3 text-sm leading-snug text-slate-300">{m.summary}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      hasStory ? 'bg-amber-300/15 text-amber-200' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {hasStory ? 'Historia narrada' : 'Historia en preparación'}
                  </span>
                  <span className={`text-sm font-medium ${lit ? 'text-amber-200' : 'text-slate-300'}`}>Explorar →</span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
