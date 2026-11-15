import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getStory } from '../../story/StoryDirector'
import { sampleStep } from '../../data/story'
import { storyRuntime } from '../../story/runtime'

/**
 * Registro de vuelo (cap. 2): durante el viaje el rover iba plegado y no veía nada, así que en vez de una
 * imagen mostramos su telemetría: la línea del viaje con los hitos documentados por la NASA.
 * Es un panel opaco; al llegar a la superficie se desvanece y la imagen "vuelve" entre la estática.
 */
export function FlightLog() {
  const missionId = useAppStore((s) => s.selectedMissionId)
  const chapterIdx = useAppStore((s) => s.currentChapterIndex)
  const scene = useAppStore((s) => s.storyScene)
  const started = useAppStore((s) => s.storyStarted)
  const [, force] = useState(0)

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 100)
    return () => clearInterval(id)
  }, [])

  const ch = getStory(missionId)?.chapters[chapterIdx]
  const events = ch?.flightEvents
  if (!ch || !events) return null

  const t = storyRuntime.t
  const first = events[0].t
  const lastT = events[events.length - 1].t
  const pct = (x: number) => `${Math.min(100, Math.max(0, ((x - first) / (lastT - first)) * 100))}%`
  const hud = sampleStep(ch.hud, t, ch.hud[0].v)
  const reached = events.filter((e) => e.t <= t)
  const current = reached[reached.length - 1]
  const visible = started && scene === 'flight'

  return (
    <div
      className={`absolute inset-0 z-[11] flex flex-col items-center justify-center bg-[#02040a] px-6 transition-opacity duration-[1400ms] ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,160,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <p className="relative font-mono text-xs uppercase tracking-[0.4em] text-slate-400">Registro de vuelo</p>
      <p className="relative mt-3 min-h-[2.5rem] text-center font-mono text-2xl tracking-widest text-amber-200 md:text-4xl">
        {current ? current.label : 'Preparando lanzamiento'}
      </p>
      <p className="relative mt-2 font-mono text-sm tracking-widest text-white/60">{hud.date}</p>

      {/* Línea del viaje Tierra → Marte */}
      <div className="relative mt-16 w-full max-w-3xl">
        <div className="absolute -top-8 left-0 font-mono text-[11px] tracking-widest text-sky-300">TIERRA</div>
        <div className="absolute -top-8 right-0 font-mono text-[11px] tracking-widest text-orange-300">MARTE</div>
        <div className="h-[2px] w-full bg-white/15" />
        <div className="absolute left-0 top-0 h-[2px] bg-amber-300" style={{ width: pct(t) }} />
        {events.map((e) => (
          <div key={e.t} className="absolute top-0 -translate-x-1/2" style={{ left: pct(e.t) }}>
            <span className={`block h-3 w-3 -translate-y-[5px] rounded-full border ${e.t <= t ? 'border-amber-200 bg-amber-300' : 'border-white/30 bg-[#02040a]'}`} />
          </div>
        ))}
        <span
          className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-[7px] rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,220,150,0.8)]"
          style={{ left: pct(t) }}
        />
      </div>

      <ul className="relative mt-10 grid max-w-3xl grid-cols-1 gap-1 font-mono text-[11px] tracking-wider text-white/45 sm:grid-cols-2">
        {events.map((e) => (
          <li key={e.t} className={e.t <= t ? 'text-white/80' : ''}>
            {e.t <= t ? '▣' : '▢'} {e.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
