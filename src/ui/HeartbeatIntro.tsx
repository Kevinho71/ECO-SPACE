import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefs'

/**
 * Intro "Latido": un monitor cardíaco donde el paciente es Opportunity.
 * Late fuerte (misión activa), se debilita con la tormenta de polvo de 2018 y termina en línea plana.
 * Llama a onDone cuando la línea ya es plana (momento de mostrar el botón de entrada).
 */

// Instantes (s) y fuerza de cada latido.
const BEATS = [
  { t: 0.7, a: 1 },
  { t: 1.4, a: 1 },
  { t: 2.1, a: 1 },
  { t: 2.9, a: 0.85 },
  { t: 3.9, a: 0.65 },
  { t: 5.1, a: 0.5 },
  { t: 6.5, a: 0.3 },
  { t: 8.2, a: 0.18 },
]
const FLAT_AT = 8.9
const DONE_AT = 9.8
const CROSS_SECONDS = 4.5 // lo que tarda el trazo en cruzar la pantalla

const g = (x: number, mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s))

/** Forma de un latido (P, QRS, T) centrada en el pico R. */
function beatShape(x: number) {
  return (
    0.12 * g(x, -0.2, 0.04) -
    0.12 * g(x, -0.04, 0.012) +
    1.0 * g(x, 0, 0.014) -
    0.25 * g(x, 0.035, 0.014) +
    0.25 * g(x, 0.25, 0.06)
  )
}

function signal(t: number) {
  let v = 0
  for (const b of BEATS) {
    const d = t - b.t
    if (d > -0.4 && d < 0.6) v += b.a * beatShape(d)
  }
  return v + 0.004 * Math.sin(t * 40) // ruido mínimo
}

function status(t: number) {
  if (t < 2.9) return { label: 'MISIÓN ACTIVA', sub: 'Meridiani Planum, Marte', tone: 'ok' as const }
  if (t < 6.5) return { label: 'TORMENTA DE POLVO', sub: 'Los paneles solares se oscurecen', tone: 'warn' as const }
  if (t < FLAT_AT) return { label: 'ENERGÍA CRÍTICA', sub: 'Último intento de contacto…', tone: 'bad' as const }
  return { label: 'SIN SEÑAL', sub: 'Último contacto · 10 jun 2018', tone: 'bad' as const }
}

const TONE = { ok: '#6ef7a8', warn: '#ffd166', bad: '#ff6b6b' }

export function HeartbeatIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sound, setSound] = useState(false)
  const soundRef = useRef(false)
  const audioRef = useRef<AudioContext | null>(null)
  const [hud, setHud] = useState({ bpm: 85, st: status(0) })
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    soundRef.current = sound
    if (sound && !audioRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioRef.current = new AC()
    }
  }, [sound])

  useEffect(() => () => void audioRef.current?.close(), [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0
    const resize = () => {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineWidth = 2.5
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
    }
    resize()
    window.addEventListener('resize', resize)

    const beep = (freq: number, dur: number) => {
      const ac = audioRef.current
      if (!ac || !soundRef.current) return
      const o = ac.createOscillator()
      const gn = ac.createGain()
      o.frequency.value = freq
      gn.gain.setValueAtTime(0.0001, ac.currentTime)
      gn.gain.exponentialRampToValueAtTime(0.12, ac.currentTime + 0.01)
      gn.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
      o.connect(gn).connect(ac.destination)
      o.start()
      o.stop(ac.currentTime + dur + 0.05)
    }

    const yOf = (v: number) => H * 0.62 - v * H * 0.5

    // Movimiento reducido: sin animación, solo el estado final.
    if (prefersReducedMotion()) {
      ctx.strokeStyle = TONE.bad
      ctx.beginPath()
      ctx.moveTo(0, yOf(0))
      ctx.lineTo(W, yOf(0))
      ctx.stroke()
      setHud({ bpm: 0, st: status(FLAT_AT) })
      doneRef.current()
      return () => window.removeEventListener('resize', resize)
    }

    const SPEED = () => W / CROSS_SECONDS
    const start = performance.now()
    let raf = 0
    let prevT = 0
    let last: { x: number; y: number } | null = null
    let nextBeat = 0
    let lastLabel = ''
    let flatTone = false
    let finished = false

    const frame = (now: number) => {
      const t = (now - start) / 1000
      const speed = SPEED()
      const steps = Math.max(1, Math.ceil((t - prevT) * speed))
      for (let k = 1; k <= steps; k++) {
        const tt = prevT + ((t - prevT) * k) / steps
        const x = (tt * speed) % W
        const y = yOf(signal(tt))
        const st = status(tt)
        ctx.strokeStyle = TONE[st.tone]
        ctx.shadowColor = TONE[st.tone]
        ctx.shadowBlur = 8
        ctx.clearRect(x + 1, 0, 26, H) // borra por delante del trazo
        if (last && x > last.x) {
          ctx.beginPath()
          ctx.moveTo(last.x, last.y)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
        last = { x, y }
      }
      prevT = t

      while (nextBeat < BEATS.length && t >= BEATS[nextBeat].t) {
        beep(880, 0.09)
        const nxt = BEATS[nextBeat + 1]
        const bpm = nxt ? Math.round(60 / (nxt.t - BEATS[nextBeat].t)) : 0
        setHud({ bpm, st: status(t) })
        nextBeat++
      }
      const st = status(t)
      if (st.label !== lastLabel) {
        lastLabel = st.label
        setHud((h) => ({ ...h, bpm: t >= FLAT_AT ? 0 : h.bpm, st }))
      }
      if (t >= FLAT_AT && !flatTone) {
        flatTone = true
        beep(880, 2.4)
      }
      if (t >= DONE_AT && !finished) {
        finished = true
        doneRef.current()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const color = TONE[hud.st.tone]

  return (
    <div className="w-full max-w-3xl px-4">
      <div className="rounded-lg border border-white/10 bg-black/60 p-4 text-left font-mono shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Paciente</p>
            <p className="text-base text-white md:text-lg">Opportunity · MER-B</p>
            <p className="mt-1 text-xs" style={{ color }}>
              {hud.st.label} <span className="text-slate-500">— {hud.st.sub}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Pulso</p>
            <p className="text-3xl tabular-nums md:text-4xl" style={{ color }}>
              {hud.bpm > 0 ? hud.bpm : '--'}
            </p>
          </div>
        </div>
        <canvas ref={canvasRef} className="mt-3 block h-32 w-full md:h-40" />
      </div>
      <button
        onClick={() => setSound((s) => !s)}
        className="mt-3 text-xs text-slate-500 underline-offset-4 hover:text-slate-300 hover:underline"
      >
        {sound ? 'Silenciar' : 'Activar sonido'}
      </button>
    </div>
  )
}
