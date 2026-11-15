import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { storyControls } from '../../story/StoryDirector'
import { driveInput, driveRuntime } from '../../story/drive'
import type { Story } from '../../data/story'
import { ViewToggle } from './ViewToggle'

const GLASS = 'bg-slate-950/70 backdrop-blur-md border border-white/15'

/** Teclado: WASD / flechas para moverse; en vuelo, Espacio sube y Mayús (o C) baja. */
function useDriveKeys() {
  useEffect(() => {
    const down = new Set<string>()
    const apply = () => {
      const k = (...codes: string[]) => (codes.some((c) => down.has(c)) ? 1 : 0)
      driveInput.f = k('KeyW', 'ArrowUp') - k('KeyS', 'ArrowDown')
      driveInput.t = k('KeyD', 'ArrowRight') - k('KeyA', 'ArrowLeft')
      driveInput.up = k('Space') - k('ShiftLeft', 'ShiftRight', 'KeyC')
    }
    const HANDLED = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyC']
    const onDown = (e: KeyboardEvent) => {
      if (!HANDLED.includes(e.code) || e.ctrlKey || e.metaKey || e.altKey) return
      e.preventDefault() // evita que Espacio «pulse» el botón enfocado o que las flechas desplacen la página
      down.add(e.code)
      apply()
    }
    const onUp = (e: KeyboardEvent) => {
      if (!HANDLED.includes(e.code)) return
      e.preventDefault()
      down.delete(e.code)
      apply()
    }
    const clear = () => {
      down.clear()
      apply()
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
      clear()
    }
  }, [])
}

/** Joystick táctil: arrastrar adelante/atrás para avanzar y a los lados para girar. */
function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const R = 44
  const set = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect()
    let dx = e.clientX - (r.left + r.width / 2)
    let dy = e.clientY - (r.top + r.height / 2)
    const d = Math.hypot(dx, dy)
    if (d > R) {
      dx = (dx / d) * R
      dy = (dy / d) * R
    }
    setKnob({ x: dx, y: dy })
    driveInput.t = dx / R
    driveInput.f = -dy / R
  }
  const release = () => {
    setKnob({ x: 0, y: 0 })
    driveInput.t = 0
    driveInput.f = 0
  }
  return (
    <div
      ref={base}
      role="application"
      aria-label="Joystick: arrastra para mover el robot"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        set(e)
      }}
      onPointerMove={(e) => {
        if (e.buttons & 1) set(e)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      className="pointer-events-auto relative grid h-28 w-28 touch-none place-items-center rounded-full border border-white/25 bg-slate-950/50 backdrop-blur-md"
    >
      <div className="h-11 w-11 rounded-full border border-white/50 bg-white/25" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}

/** Subir / bajar (solo robots que vuelan). */
function AltButtons() {
  const hold = (v: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      driveInput.up = v
    },
    onPointerUp: () => (driveInput.up = 0),
    onPointerCancel: () => (driveInput.up = 0),
  })
  const cls = 'pointer-events-auto grid h-12 w-12 touch-none place-items-center rounded-full border border-white/25 bg-slate-950/50 text-lg text-white backdrop-blur-md'
  return (
    <div className="flex flex-col gap-2">
      <button aria-label="Subir" className={cls} {...hold(1)}>▲</button>
      <button aria-label="Bajar" className={cls} {...hold(-1)}>▼</button>
    </div>
  )
}

/** Barra del modo conducción (tras el final): controles, cámara, sonido y salidas. */
export function DriveBar({ story }: { story: Story }) {
  const mode = useAppStore((s) => s.cameraMode)
  const soundOn = useAppStore((s) => s.soundOn)
  const patch = useAppStore((s) => s.patchStory)
  const backToPlanet = useAppStore((s) => s.backToPlanet)
  const [limit, setLimit] = useState(false)
  useDriveKeys()

  useEffect(() => {
    const id = setInterval(() => setLimit(driveRuntime.limit), 150)
    return () => clearInterval(id)
  }, [])

  const cfg = story.explore?.drive
  if (mode !== 'drive' || !cfg) return null
  const fly = cfg.kind === 'fly'
  return (
    <>
      {limit && (
        <p role="status" className="pointer-events-none absolute inset-x-0 top-24 z-[15] text-center font-mono text-xs uppercase tracking-[0.3em] text-amber-200">
          Límite de la zona
        </p>
      )}
      {/* Controles táctiles */}
      <div className="pointer-events-none absolute bottom-28 left-4 z-[15] flex items-end gap-3 md:hidden">
        <Joystick />
      </div>
      {fly && (
        <div className="pointer-events-none absolute bottom-28 right-4 z-[15] md:hidden">
          <AltButtons />
        </div>
      )}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[15] px-4 pb-4">
        <div className={`${GLASS} mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3`}>
          <p className="max-w-md text-xs leading-relaxed text-slate-300">
            <span className="font-mono uppercase tracking-widest text-cyan-200">{cfg.label}</span>
            <span className="mt-1 block text-slate-400">
              <span className="hidden md:inline">
                W A S D o flechas para moverte{fly ? ' · Espacio sube · Mayús baja' : ''} · V cambia de cámara
              </span>
              <span className="md:hidden">Usa el joystick{fly ? ' y los botones ▲ ▼' : ''} para moverte</span>
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ViewToggle />
            <button
              onClick={() => patch({ soundOn: !soundOn })}
              aria-label="Sonido"
              aria-pressed={soundOn}
              className="pointer-events-auto grid h-9 min-w-9 place-items-center rounded-full border border-white/20 px-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => storyControls.exitDrive()}
              className="pointer-events-auto rounded-full border border-white/25 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Volver al final
            </button>
            <button
              onClick={backToPlanet}
              className="pointer-events-auto rounded-full border border-white/25 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
