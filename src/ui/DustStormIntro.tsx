import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefs'

/**
 * Intro "Tormenta de polvo": la tormenta global de Marte de junio de 2018.
 * El polvo crece hacia el espectador, el cielo se oscurece y el panel solar de Opportunity deja de cargar.
 * El usuario puede "enviar comandos" que suben un poco la batería, pero no bastan.
 * Llama a onDone cuando la batería llega a 0.
 */

type RGB = [number, number, number]
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const mix = (a: RGB, b: RGB, k: number) => `rgb(${lerp(a[0], b[0], k) | 0},${lerp(a[1], b[1], k) | 0},${lerp(a[2], b[2], k) | 0})`
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const SKY_TOP: [RGB, RGB] = [[196, 120, 80], [48, 24, 18]]
const SKY_LOW: [RGB, RGB] = [[236, 176, 126], [92, 52, 36]]
const GROUND: [RGB, RGB] = [[142, 72, 46], [44, 22, 17]]

const STORM_SECONDS = 8 // lo que tarda el cielo en quedar casi opaco
const BATTERY_BOOST = 6 // % que da cada comando
const COOLDOWN_MS = 700
const PARTICLES = 280

type Dust = { x: number; y: number; z: number }
const newDust = (z = Math.random()): Dust => ({ x: Math.random(), y: Math.random(), z: 0.08 + z * 0.92 })

const MESSAGES = [
  'Comando enviado… +6 % de batería. Pero la luz sigue cayendo.',
  'Otro intento. Cada comando gasta casi lo que ahorra.',
  'El panel apenas recibe luz. No es suficiente.',
]

export function drawRover(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, sun: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.shadowBlur = 0
  // ruedas
  ctx.fillStyle = '#17110f'
  ctx.strokeStyle = '#3a2d28'
  ctx.lineWidth = 2
  for (const wx of [-26, 0, 26]) {
    ctx.beginPath()
    ctx.arc(wx, -7, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  // cuerpo
  ctx.fillStyle = '#2c2420'
  ctx.fillRect(-32, -30, 64, 18)
  // mástil y cámara
  ctx.strokeStyle = '#4a3b34'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(20, -42)
  ctx.lineTo(20, -62)
  ctx.stroke()
  ctx.fillStyle = '#3a2d28'
  ctx.fillRect(14, -68, 14, 8)
  // antena
  ctx.beginPath()
  ctx.moveTo(-22, -42)
  ctx.lineTo(-22, -54)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(-22, -56, 8, 3, -0.4, 0, Math.PI * 2)
  ctx.fill()
  // panel solar: brilla según la luz que recibe
  ctx.fillStyle = `rgba(40, 90, 130, ${0.55 + 0.25 * sun})`
  ctx.fillRect(-40, -42, 80, 12)
  ctx.shadowColor = '#6ef7ff'
  ctx.shadowBlur = 16 * sun
  ctx.strokeStyle = `rgba(110, 247, 255, ${0.15 + 0.85 * sun})`
  ctx.lineWidth = 2
  ctx.strokeRect(-40, -42, 80, 12)
  ctx.restore()
}

export function DustStormIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  const cmdRef = useRef(0)
  const lastCmdRef = useRef(0)
  const endedRef = useRef(false)
  const [hud, setHud] = useState({ sun: 100, bat: 100, ended: false })
  const [msg, setMsg] = useState('Una tormenta global de polvo cubre Marte. Mantén viva a Opportunity.')
  const [cmds, setCmds] = useState(0)

  const sendCommand = useCallback(() => {
    const now = performance.now()
    if (endedRef.current || now - lastCmdRef.current < COOLDOWN_MS) return
    lastCmdRef.current = now
    cmdRef.current++
    setCmds((c) => {
      setMsg(MESSAGES[Math.min(c, MESSAGES.length - 1)])
      return c + 1
    })
  }, [])

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
    }
    resize()
    window.addEventListener('resize', resize)

    const dust: Dust[] = Array.from({ length: PARTICLES }, () => newDust())
    const rocks = Array.from({ length: 9 }, () => ({ x: Math.random(), y: Math.random(), r: 3 + Math.random() * 7 }))

    const render = (t: number, sun: number, pingT: number) => {
      const s = 1 - sun // intensidad de la tormenta
      const horizon = H * 0.68

      // cielo
      const sky = ctx.createLinearGradient(0, 0, 0, horizon)
      sky.addColorStop(0, mix(SKY_TOP[0], SKY_TOP[1], s))
      sky.addColorStop(1, mix(SKY_LOW[0], SKY_LOW[1], s))
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, horizon)

      // sol
      const sx = W * 0.78
      const sy = H * 0.27
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.5)
      glow.addColorStop(0, `rgba(255, 236, 200, ${0.75 * sun})`)
      glow.addColorStop(1, 'rgba(255, 236, 200, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, horizon)
      ctx.fillStyle = `rgba(255, 246, 225, ${0.2 + 0.8 * sun})`
      ctx.beginPath()
      ctx.arc(sx, sy, 8 + 14 * sun, 0, Math.PI * 2)
      ctx.fill()

      // suelo
      ctx.fillStyle = mix(GROUND[0], GROUND[1], s)
      ctx.fillRect(0, horizon, W, H - horizon)
      ctx.fillStyle = `rgba(0, 0, 0, ${0.25 + 0.2 * s})`
      for (const r of rocks) {
        ctx.beginPath()
        ctx.ellipse(r.x * W, horizon + 10 + r.y * (H - horizon - 20), r.r * 1.6, r.r, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // rover
      const rs = H / 300
      drawRover(ctx, W * 0.3, horizon + (H - horizon) * 0.55, rs, sun)

      // pulso de "comando" desde la antena
      if (pingT >= 0 && pingT < 1) {
        ctx.strokeStyle = `rgba(110, 247, 255, ${1 - pingT})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(W * 0.3 - 22 * rs, horizon + (H - horizon) * 0.55 - 56 * rs, 8 + pingT * W * 0.45, 0, Math.PI * 2)
        ctx.stroke()
      }

      // muro de polvo que crece desde el horizonte
      const wallR = H * (0.2 + 1.5 * s)
      for (let i = 0; i < 6; i++) {
        const bx = W * (i / 5) + Math.sin(t * 0.5 + i * 2) * W * 0.04
        const g = ctx.createRadialGradient(bx, horizon, 0, bx, horizon, wallR)
        g.addColorStop(0, `rgba(120, 66, 42, ${0.75 * s})`)
        g.addColorStop(1, 'rgba(120, 66, 42, 0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }

      // partículas de polvo en 3D: se acercan al espectador y crecen
      const visible = Math.floor(PARTICLES * (0.1 + 0.9 * s))
      for (let i = 0; i < visible; i++) {
        const p = dust[i]
        const px = ((p.x - 0.5) / p.z + 0.5) * W
        const py = ((p.y - 0.5) * 0.9 / p.z + 0.62) * H
        if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue
        const size = clamp(2.2 / p.z, 1, 70)
        ctx.fillStyle = `rgba(176, 108, 72, ${clamp((1.1 - p.z) * (0.15 + 0.5 * s), 0, 0.55)})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // oscuridad general
      ctx.fillStyle = `rgba(22, 8, 5, ${0.82 * s * s})`
      ctx.fillRect(0, 0, W, H)
    }

    // Movimiento reducido: solo el estado final.
    if (prefersReducedMotion()) {
      render(0, 0.02, -1)
      endedRef.current = true
      setHud({ sun: 2, bat: 0, ended: true })
      setMsg('Último contacto: 10 de junio de 2018.')
      doneRef.current()
      return () => window.removeEventListener('resize', resize)
    }

    let raf = 0
    let prev = performance.now()
    let t = 0
    let bat = 100
    let pingAt = -10
    let endAt = 0
    let doneSent = false
    let lastHud = 0

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - prev) / 1000)
      prev = now
      t += dt
      const sun = endedRef.current ? 0.02 : clamp(1 - t / STORM_SECONDS, 0.02, 1)

      if (!endedRef.current) {
        // La carga depende de la luz; el consumo es constante.
        bat = Math.min(100, bat + (14 * sun - 12) * dt)
        while (cmdRef.current > 0) {
          cmdRef.current--
          bat = Math.min(100, bat + BATTERY_BOOST)
          pingAt = t
        }
        if (bat <= 0) {
          bat = 0
          endedRef.current = true
          endAt = t + 1.4
          setHud({ sun: 2, bat: 0, ended: true })
          setMsg('Sin señal. Último contacto: 10 de junio de 2018.')
        }
      } else if (!doneSent && t >= endAt) {
        doneSent = true
        doneRef.current()
      }

      // El polvo avanza hacia la cámara con el viento.
      const wind = 0.05 + 0.25 * (1 - sun)
      for (const p of dust) {
        p.z -= dt * (0.05 + 0.2 * (1 - sun))
        p.x -= dt * wind * 0.4
        if (p.z < 0.08 || p.x < -0.5) Object.assign(p, newDust(1), { x: Math.random() + 0.3 })
      }

      render(t, sun, t - pingAt)

      if (!endedRef.current && now - lastHud > 90) {
        lastHud = now
        setHud({ sun: Math.round(sun * 100), bat: Math.round(bat), ended: false })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const batColor = hud.bat > 50 ? '#6ef7a8' : hud.bat > 20 ? '#ffd166' : '#ff6b6b'
  const phase = hud.ended
    ? 'SIN SEÑAL'
    : hud.sun > 70
      ? 'CIELO DESPEJADO'
      : hud.sun > 30
        ? 'POLVO EN SUSPENSIÓN'
        : 'OSCURIDAD CASI TOTAL'

  return (
    <div className="w-full max-w-3xl px-4">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/60 text-left font-mono shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Opportunity · Marte · junio 2018</p>
            <p className="mt-1 text-xs" style={{ color: hud.ended ? '#ff6b6b' : '#ffd166' }}>
              {phase}
            </p>
          </div>
          <div className="w-44 md:w-56">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <span>Batería</span>
              <span className="tabular-nums" style={{ color: batColor }}>
                {hud.bat} %
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{ width: `${hud.bat}%`, background: batColor }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <span>Luz solar</span>
              <span className="tabular-nums">{hud.sun} %</span>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="block h-56 w-full md:h-72" />

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="min-h-[2.5rem] flex-1 text-xs leading-snug text-slate-300" aria-live="polite">
            {msg}
          </p>
          <button
            onClick={sendCommand}
            disabled={hud.ended}
            className="shrink-0 rounded border border-cyan-300/60 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Enviar comando{cmds > 0 ? ` (${cmds})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
