import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { exploreControls } from '../../story/explore'
import type { Story, WhatIfCard } from '../../data/story'
import { HOTSPOTS } from '../../data/hotspots'

const GLASS = 'bg-slate-950/70 backdrop-blur-md border border-white/15'

/** Botones con las acciones que puede hacer el robot (clips del GLB y movimientos por código). */
function ActionBar({ story }: { story: Story }) {
  const running = useAppStore((s) => s.exploreAction)
  const actions = story.explore?.actions ?? []
  if (!actions.length) return null
  return (
    <section aria-label="Acciones del robot">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-200">Hazlo moverse</h3>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {actions.map((a) => {
          const on = running === a.id
          return (
            <li key={a.id}>
              <button
                onClick={() => (on ? exploreControls.stop() : exploreControls.run(a))}
                aria-pressed={on}
                title={a.hint}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  on ? 'border-cyan-300/70 bg-cyan-400/15 text-white' : 'border-white/20 text-slate-200 hover:bg-white/10'
                }`}
              >
                <span className="mr-1 text-cyan-200">{on ? '■' : '▶'}</span>
                {a.label}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Una tarjeta "¿Qué pasaría si…?": cerrada muestra la pregunta; abierta, el escenario, lo real y la ciencia. */
function WhatIfItem({ card, story, open, onToggle }: { card: WhatIfCard; story: Story; open: boolean; onToggle: () => void }) {
  const select = useAppStore((s) => s.selectHotspot)
  const hotspot = card.focus ? HOTSPOTS[story.missionId]?.find((h) => h.id === card.focus) : null
  const action = card.action ? story.explore?.actions.find((a) => a.id === card.action) : null
  const panelId = `whatif-${card.id}`
  return (
    <li className="rounded-xl border border-violet-300/30 bg-violet-950/30">
      <button
        onClick={() => {
          onToggle()
          // Al abrir, se enseña la pieza relacionada.
          if (!open && card.focus) select(card.focus)
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-3 px-3 py-3 text-left"
      >
        <span className={`mt-1 text-violet-200 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden>▸</span>
        <span className="flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-violet-300">Hipotético</span>
          <span className="mt-0.5 block text-sm leading-snug text-white">¿Qué pasaría si {card.question}?</span>
        </span>
      </button>
      {open && (
        <div id={panelId} className="subtitle-in space-y-3 border-t border-violet-300/20 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-200">
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-violet-300">Imagina</h4>
            <p className="mt-1">{card.imagine}</p>
          </div>
          <div className="rounded-lg border-l-2 border-l-amber-300 bg-black/25 px-3 py-2">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-amber-200">Lo que sí pasó</h4>
            <p className="mt-1">{card.reality}</p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-cyan-200">La ciencia detrás</h4>
            <p className="mt-1">{card.science}</p>
          </div>
          {(hotspot || action) && (
            <div className="flex flex-wrap gap-2">
              {hotspot && (
                <button onClick={() => select(hotspot.id)} className="rounded-full border border-white/25 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">
                  Ver: {hotspot.title}
                </button>
              )}
              {action && (
                <button onClick={() => exploreControls.run(action)} className="rounded-full border border-cyan-300/50 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-400/10">
                  ▶ {action.label}
                </button>
              )}
            </div>
          )}
          <ul className="space-y-1 text-[11px] text-slate-400">
            {card.sources.map((s) => (
              <li key={s.url}>
                <a className="underline hover:text-white" href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="text-[11px] italic text-violet-200/70">Ejercicio hipotético basado en hechos documentados: esto no ocurrió.</p>
        </div>
      )}
    </li>
  )
}

function WhatIfCards({ story }: { story: Story }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const cards = story.whatIfs ?? []
  if (!cards.length) return null
  return (
    <section aria-label="¿Qué pasaría si…?">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet-300">¿Qué pasaría si…?</h3>
      <ul className="mt-2 space-y-2">
        {cards.map((c) => (
          <WhatIfItem key={c.id} card={c} story={story} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
        ))}
      </ul>
    </section>
  )
}

/** Panel lateral izquierdo del modo Explorar: acciones del robot + tarjetas hipotéticas. */
export function ExplorePanel({ story }: { story: Story }) {
  const mode = useAppStore((s) => s.cameraMode)
  if (mode !== 'free') return null
  if (!story.explore?.actions.length && !story.whatIfs?.length) return null
  return (
    <aside className={`pointer-events-auto absolute bottom-40 left-5 top-24 z-[15] w-80 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl p-4 ${GLASS}`}>
      <div className="space-y-5">
        <ActionBar story={story} />
        <WhatIfCards story={story} />
      </div>
    </aside>
  )
}
