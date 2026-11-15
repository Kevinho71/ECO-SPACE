import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getStory, storyControls } from '../../story/StoryDirector'
import { storyRuntime } from '../../story/runtime'
import { HOTSPOTS } from '../../data/hotspots'
import type { Story } from '../../data/story'

const GLASS = 'bg-slate-950/70 backdrop-blur-md border border-white/15'

function IconBtn({ label, onClick, children, active = false }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`pointer-events-auto grid h-9 min-w-9 place-items-center rounded-full border px-2 text-sm transition ${
        active ? 'border-white/60 bg-white/20 text-white' : 'border-white/20 text-slate-300 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}

/** Pantalla inicial: el feed está apagado hasta que el usuario "despierta" a Oppy (también activa el audio). */
function StartScreen({ story }: { story: Story }) {
  const soundOn = useAppStore((s) => s.soundOn)
  const reduce = useAppStore((s) => s.reduceEffects)
  const patch = useAppStore((s) => s.patchStory)
  return (
    <div className="pointer-events-auto absolute inset-0 z-[16] flex flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-500">Mars Exploration Rover · MER-B</p>
      <h2 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Opportunity</h2>
      <p className="mt-3 max-w-md text-slate-300">
        Vas a vivir su historia <em>desde dentro</em>: tus ojos serán los suyos. Mira alrededor arrastrando.
      </p>
      <button
        onClick={() => storyControls.start()}
        className="mt-8 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-lg text-white transition hover:bg-white/25"
      >
        ▶ Despertar a Oppy
      </button>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={soundOn} onChange={(e) => patch({ soundOn: e.target.checked })} /> Sonido
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={reduce} onChange={(e) => patch({ reduceEffects: e.target.checked })} /> Reducir estática y vibración
        </label>
      </div>
      <p className="mt-6 max-w-md text-xs text-slate-500">
        Duración aproximada: {Math.round(story.chapters.reduce((a, c) => a + c.duration, 0) / 60)} minutos · 5 capítulos · La narración
        es por ahora solo en subtítulos (las voces llegarán después).
      </p>
    </div>
  )
}

/** Título del capítulo al empezar. */
function ChapterBanner({ story }: { story: Story }) {
  const idx = useAppStore((s) => s.currentChapterIndex)
  const banner = useAppStore((s) => s.chapterBanner)
  const started = useAppStore((s) => s.storyStarted)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!started) return
    setVisible(true)
    const id = setTimeout(() => setVisible(false), 3400)
    return () => clearTimeout(id)
  }, [banner, started])

  const ch = story.chapters[idx]
  if (!ch) return null
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-[17%] z-[14] text-center transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <p className="font-mono text-sm uppercase tracking-[0.35em] text-amber-200">{ch.title}</p>
      <p className="mt-2 text-slate-200/80">{ch.subtitle}</p>
    </div>
  )
}

function Subtitles({ story }: { story: Story }) {
  const idx = useAppStore((s) => s.currentChapterIndex)
  const cue = useAppStore((s) => s.cueIndex)
  const on = useAppStore((s) => s.subtitlesOn)
  const started = useAppStore((s) => s.storyStarted)
  const c = story.chapters[idx]?.cues[cue]
  if (!on || !started || !c) return null
  const narrator = c.voice === 'narrator'
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 z-[14] flex justify-center px-6">
      <p
        key={`${idx}-${cue}`}
        className={`subtitle-in max-w-3xl rounded-lg bg-black/55 px-5 py-3 text-center text-lg leading-snug text-white md:text-xl ${
          narrator ? 'font-serif italic text-amber-50' : ''
        }`}
      >
        {c.text}
      </p>
    </div>
  )
}

/** Rótulo de la pieza que la cámara está enseñando (capítulo 1). */
function PartCallout({ missionId }: { missionId: string }) {
  const id = useAppStore((s) => s.storyPart)
  const view = useAppStore((s) => s.storyView)
  const h = view === 'part' ? HOTSPOTS[missionId]?.find((x) => x.id === id) : null
  if (!h) return null
  return (
    <div className="pointer-events-none absolute right-5 top-1/2 z-[14] w-72 -translate-y-1/2">
      <div key={h.id} className={`subtitle-in ${GLASS} rounded-xl border-l-2 border-l-cyan-300 p-4`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-200">Mis piezas</p>
        <h3 className="mt-1 text-base font-semibold text-white">{h.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-100/80">{h.fact}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{h.explain}</p>
      </div>
    </div>
  )
}

function Card() {
  const card = useAppStore((s) => s.activeCard)
  if (!card) return null
  return (
    <div className="pointer-events-none absolute left-5 top-1/2 z-[14] max-w-sm -translate-y-1/2">
      <div key={card.at} className={`subtitle-in ${GLASS} rounded-xl p-4`}>
        {card.kind === 'quote' ? (
          <>
            <p className="text-base italic leading-snug text-white">{card.text}</p>
            <p className="mt-2 text-xs text-slate-300">— {card.author}</p>
            {card.source && <p className="text-[11px] uppercase tracking-widest text-slate-500">{card.source}</p>}
          </>
        ) : (
          <p className="font-mono text-sm tracking-widest text-amber-200">{card.text}</p>
        )}
      </div>
    </div>
  )
}

/** Línea de tiempo por capítulos (con marcas de sub-escenas) y controles. */
function Timeline({ story }: { story: Story }) {
  const idx = useAppStore((s) => s.currentChapterIndex)
  const playing = useAppStore((s) => s.isPlaying)
  const subs = useAppStore((s) => s.subtitlesOn)
  const sound = useAppStore((s) => s.soundOn)
  const reduce = useAppStore((s) => s.reduceEffects)
  const mode = useAppStore((s) => s.cameraMode)
  const setMode = useAppStore((s) => s.setCameraMode)
  const patch = useAppStore((s) => s.patchStory)
  const [t, setT] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setT(storyRuntime.t), 100)
    return () => clearInterval(id)
  }, [])

  const total = story.chapters.reduce((a, c) => a + c.duration, 0)
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[15] px-4 pb-4">
      <div className={`${GLASS} mx-auto max-w-5xl rounded-2xl px-4 py-3`}>
        <div className="flex gap-1">
          {story.chapters.map((c, i) => {
            const frac = i < idx ? 1 : i === idx ? Math.min(1, t / c.duration) : 0
            return (
              <button
                key={c.id}
                onClick={() => storyControls.seekChapter(i)}
                title={c.title}
                className="group relative text-left"
                style={{ width: `${(c.duration / total) * 100}%` }}
              >
                <div className="relative h-2 overflow-hidden rounded-full bg-white/15 group-hover:bg-white/25">
                  <div className="absolute inset-y-0 left-0 bg-amber-300" style={{ width: `${frac * 100}%` }} />
                </div>
                {c.marks?.map((m) => (
                  <span
                    key={m.t}
                    title={m.label}
                    className="absolute top-0 h-2 w-[2px] bg-slate-950/80"
                    style={{ left: `${(m.t / c.duration) * 100}%` }}
                  />
                ))}
                <span className={`mt-1 block truncate text-[11px] ${i === idx ? 'text-white' : 'text-slate-400'}`}>
                  {i + 1} · {c.title.replace(/^Capítulo \d+ · /, '')}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconBtn label="Capítulo anterior" onClick={() => storyControls.prev()}>⏮</IconBtn>
            <IconBtn label={playing ? 'Pausar' : 'Reproducir'} onClick={() => storyControls.togglePlay()}>{playing ? '⏸' : '▶'}</IconBtn>
            <IconBtn label="Capítulo siguiente" onClick={() => storyControls.next()}>⏭</IconBtn>
            <IconBtn label="Empezar de nuevo" onClick={() => storyControls.restart()}>↺</IconBtn>
          </div>
          <div className="flex items-center gap-2">
            <IconBtn label="Subtítulos" active={subs} onClick={() => patch({ subtitlesOn: !subs })}>CC</IconBtn>
            <IconBtn label="Sonido" active={sound} onClick={() => patch({ soundOn: !sound })}>{sound ? '🔊' : '🔇'}</IconBtn>
            <IconBtn label="Reducir estática y vibración" active={reduce} onClick={() => patch({ reduceEffects: !reduce })}>≋</IconBtn>
            <button
              onClick={() => setMode(mode === 'guided' ? 'free' : 'guided')}
              className="pointer-events-auto rounded-full border border-white/25 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {mode === 'guided' ? 'Explorar el rover' : 'Volver a la historia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Inspector técnico (panel lateral) al pulsar un hotspot en modo exploración. */
function Inspector({ missionId }: { missionId: string }) {
  const id = useAppStore((s) => s.activeHotspotId)
  const select = useAppStore((s) => s.selectHotspot)
  const mode = useAppStore((s) => s.cameraMode)
  const h = HOTSPOTS[missionId]?.find((x) => x.id === id)
  if (!h || mode !== 'free') return null
  return (
    <aside className={`pointer-events-auto absolute right-5 top-24 z-[15] w-72 ${GLASS} rounded-2xl p-5`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{h.title}</h3>
        <button aria-label="Cerrar" onClick={() => select(null)} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-200">{h.fact}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{h.explain}</p>
      <p className="mt-3 text-[11px] text-slate-500">Datos: NASA / NSSDC</p>
    </aside>
  )
}

function ExploreHint() {
  const mode = useAppStore((s) => s.cameraMode)
  if (mode !== 'free') return null
  return (
    <p className="pointer-events-none absolute inset-x-0 top-24 z-[14] text-center text-sm text-slate-300/80">
      Arrastra para girar alrededor de Oppy · pulsa los puntos brillantes para ver sus partes
    </p>
  )
}

/** Cierre: tarjeta de transparencia + repetir / volver. */
function EndScreen({ story }: { story: Story }) {
  const backToPlanet = useAppStore((s) => s.backToPlanet)
  const t = story.transparency
  return (
    <div className="pointer-events-auto absolute inset-0 z-[17] flex items-center justify-center bg-black/85 px-6">
      <div className={`${GLASS} max-w-xl rounded-2xl p-7`}>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-200">¿Qué dijo de verdad?</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{t.title}</h3>
        <p className="mt-3 leading-relaxed text-slate-200">{t.body}</p>
        <ul className="mt-4 space-y-1 text-xs text-slate-400">
          {t.sources.map((s) => (
            <li key={s.url}>
              <a className="underline hover:text-white" href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => storyControls.restart()} className="rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:bg-white/10">
            ↺ Volver a vivirla
          </button>
          <button onClick={backToPlanet} className="rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:bg-white/10">
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  )
}

export function StoryOverlay({ missionId }: { missionId: string }) {
  const story = getStory(missionId)
  const started = useAppStore((s) => s.storyStarted)
  const ended = useAppStore((s) => s.storyEnded)
  if (!story) return null
  return (
    <>
      {!started && <StartScreen story={story} />}
      {started && (
        <>
          <ChapterBanner story={story} />
          <Subtitles story={story} />
          <Card />
          <PartCallout missionId={missionId} />
          <ExploreHint />
          <Inspector missionId={missionId} />
          <Timeline story={story} />
        </>
      )}
      {ended && <EndScreen story={story} />}
    </>
  )
}
