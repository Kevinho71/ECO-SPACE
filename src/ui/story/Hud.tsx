import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getStory } from '../../story/StoryDirector'
import { sampleStep } from '../../data/story'
import { storyRuntime } from '../../story/runtime'

function Bars({ value, n = 4, label }: { value: number; n?: number; label: string }) {
  const on = Math.ceil(value * n - 1e-6)
  return (
    <span className="flex items-center gap-1" aria-label={`${label} ${Math.round(value * 100)}%`}>
      <span className="text-[10px] tracking-widest text-white/60">{label}</span>
      <span className="flex items-end gap-[2px]">
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className={`w-[5px] rounded-sm ${i < on ? (value < 0.3 ? 'bg-red-400' : 'bg-emerald-300') : 'bg-white/20'}`}
            style={{ height: 6 + i * 3 }}
          />
        ))}
      </span>
    </span>
  )
}

/** Telemetría del feed de cámara: REC, fecha/sol, lugar, batería, señal y temperatura. Se degrada con la historia. */
export function Hud() {
  const missionId = useAppStore((s) => s.selectedMissionId)
  const chapterIdx = useAppStore((s) => s.currentChapterIndex)
  const story = getStory(missionId)
  const [, force] = useState(0)

  // Refresco ~8 veces por segundo (la telemetría no necesita 60 fps).
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 120)
    return () => clearInterval(id)
  }, [])

  const ch = story?.chapters[chapterIdx]
  if (!ch) return null
  const hud = sampleStep(ch.hud, storyRuntime.t, ch.hud[0].v)
  if (hud.hidden) return null
  const glitch = storyRuntime.staticLevel > 0.5 && Math.random() < 0.15

  return (
    <div className={`pointer-events-none absolute left-5 top-16 z-[13] font-mono text-xs text-white/85 ${glitch ? 'translate-x-[2px] opacity-70' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="tracking-widest">REC</span>
        {hud.sol && <span className="tracking-widest">· SOL {hud.sol}</span>}
      </div>
      <div className="mt-1 tracking-widest">{hud.date}</div>
      {hud.phase && <div className="mt-1 max-w-[260px] tracking-widest text-amber-200">{hud.phase}</div>}
      <div className="mt-1 max-w-[260px] tracking-widest text-white/60">{hud.place}</div>
      <div className="mt-2 flex items-center gap-4">
        <Bars value={storyRuntime.battery} label="BAT" />
        <Bars value={storyRuntime.signal} label="SEÑAL" />
      </div>
      {hud.showAlt && <div className="mt-1 tracking-widest text-emerald-200">ALT {storyRuntime.alt.toFixed(1).replace('.', ',')} m</div>}
      {hud.temp && <div className="mt-1 tracking-widest text-sky-200">TEMP {hud.temp}</div>}
    </div>
  )
}
