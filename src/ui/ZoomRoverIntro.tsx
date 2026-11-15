import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefs'
import { drawRover } from './DustStormIntro'
import { createPlanetSprites } from './introPlanets'
import { createRoverSprite } from './introRover'

/**
 * Intro "Zoom al robot": vuelo continuo de la Tierra a Marte y descenso a Meridiani Planum,
 * donde Opportunity espera cubierta de polvo. Mantener pulsado (o hacer scroll) levanta el viento,
 * barre el polvo de sus paneles y la despierta. Llama a onDone cuando despierta.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (v: number) => {
  const x = clamp01(v)
  return x * x * (3 - 2 * x)
}
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

const FLIGHT = 7.0 // segundos de vuelo antes de poder interactuar
const SWEEP_SECONDS = 3.2 // pulsación continua necesaria para limpiar del todo
const START_KM = 225_000_000 // distancia media Tierra–Marte
const LAST_CONTACT = Date.UTC(2018, 5, 10) // 10 jun 2018

type Star = { x: number; y: number; z: number }
type Streak = { x: number; y: number; v: number }

function planet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  stops: [string, string, string],
  details: (k: number) => void,
) {
  const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R)
  g.addColorStop(0, stops[0])
  g.addColorStop(0.55, stops[1])
  g.addColorStop(1, stops[2])
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.clip()
  ctx.translate(cx, cy)
  details(R)
  // sombra del lado opuesto al sol
  const sh = ctx.createLinearGradient(-R, 0, R, 0)
  sh.addColorStop(0.3, 'rgba(0,0,10,0)')
  sh.addColorStop(1, 'rgba(0,0,10,0.6)')
  ctx.fillStyle = sh
  ctx.fillRect(-R, -R, R * 2, R * 2)
  ctx.restore()
}

const blob = (ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot: number) => {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  ctx.fill()
}

export function ZoomRoverIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  const holdRef = useRef(false)
  const wheelRef = useRef(0)
  const [hud, setHud] = useState<{ phase: 'flight' | 'surface' | 'awake'; label: string; name: string; value: string }>({
    phase: 'flight',
    label: 'SALIENDO DE LA TIERRA',
    name: 'Distancia a Marte',
    value: START_KM.toLocaleString('es-ES') + ' km',
  })
  const years = Math.floor((Date.now() - LAST_CONTACT) / (365.25 * 86400000))

  useEffect(() => {
    const up = () => (holdRef.current = false)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
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

    // Capa del rover (para poder cubrirlo de polvo solo donde hay rover).
    const off = document.createElement('canvas')
    off.width = 480
    off.height = 360
    const octx = off.getContext('2d')!

    // Planetas con los mapas NASA reales del sistema solar (null si no hay WebGL → dibujo 2D de reserva).
    const sprites = createPlanetSprites()
    // Opportunity real (GLB del catálogo) con polvo en el shader.
    const rover = createRoverSprite('/models/mars/opportunity.glb')
    // Los dibujos 2D de reserva solo se usan si no hay WebGL o los modelos tardan demasiado en cargar.
    // Mientras cargan, la intro espera (en vez de enseñar un diseño provisional).
    let gaveUp = false
    const planetFallbackOK = () => !sprites || gaveUp
    const roverFallbackOK = () => !rover || gaveUp

    const stars: Star[] = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), z: 0.1 + Math.random() * 0.9 }))
    const streaks: Streak[] = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), v: 0.6 + Math.random() * 0.9 }))
    const rocks = Array.from({ length: 10 }, () => ({ x: Math.random(), y: Math.random(), r: 3 + Math.random() * 7 }))

    // ---------- Espacio ----------
    const drawSpace = (t: number, dt: number) => {
      ctx.fillStyle = '#02040a'
      ctx.fillRect(0, 0, W, H)

      const warp = Math.exp(-((t - 3.4) ** 2) / (2 * 1.1 * 1.1))
      for (const s of stars) {
        s.z -= dt * (0.03 + 0.9 * warp)
        if (s.z < 0.04) {
          s.z = 1
          s.x = Math.random()
          s.y = Math.random()
        }
        const px = (z: number) => ((s.x - 0.5) / z) * W * 0.35 + W / 2
        const py = (z: number) => ((s.y - 0.5) / z) * H * 0.35 + H / 2
        const x1 = px(s.z)
        const y1 = py(s.z)
        if (x1 < 0 || x1 > W || y1 < 0 || y1 > H) continue
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, Math.max(0.15, 1.1 - s.z))})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(px(s.z + 0.02 + 0.25 * warp), py(s.z + 0.02 + 0.25 * warp))
        ctx.stroke()
      }

      // Tierra: grande al principio, se aleja y sale por la izquierda.
      const ek = smooth(t / 3.4)
      const eR = H * (0.42 - 0.36 * ek)
      const eX = W * 0.3 - W * 0.38 * ek
      if (eX + eR > 0) {
        ctx.globalAlpha = 1 - ek * 0.7
        if (!sprites?.draw(ctx, 'earth', eX, H * 0.5, eR, 4.2 + t * 0.3) && planetFallbackOK()) {
          planet(ctx, eX, H * 0.5, eR, ['#4a8be0', '#1b4a9c', '#06173d'], (R) => {
            ctx.fillStyle = 'rgba(80,150,90,0.9)'
            blob(ctx, -R * 0.2, -R * 0.1, R * 0.28, R * 0.18, -0.5)
            blob(ctx, R * 0.25, R * 0.2, R * 0.22, R * 0.3, 0.3)
            blob(ctx, -R * 0.5, R * 0.4, R * 0.15, R * 0.1, 0)
            ctx.fillStyle = 'rgba(255,255,255,0.35)'
            blob(ctx, R * 0.1, -R * 0.35, R * 0.4, R * 0.06, 0.2)
            blob(ctx, -R * 0.3, R * 0.15, R * 0.3, R * 0.05, -0.3)
          })
          ctx.strokeStyle = 'rgba(130,200,255,0.5)'
          ctx.lineWidth = Math.max(1, eR * 0.03)
          ctx.shadowColor = '#7cc4ff'
          ctx.shadowBlur = 14
          ctx.beginPath()
          ctx.arc(eX, H * 0.5, eR, 0, Math.PI * 2)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
        ctx.globalAlpha = 1
      }

      // Marte: un punto lejano que crece hasta llenar la pantalla.
      const tm = smooth(t / 4.6)
      const r1 = H * (0.015 + 0.14 * tm)
      const tz = clamp01((t - 4.6) / (FLIGHT - 4.6 + 0.2))
      const mR = r1 * Math.exp(3.7 * tz * tz)
      const mX = lerp(W * 0.78, W * 0.5, tm)
      if (!sprites?.draw(ctx, 'mars', mX, H * 0.5, mR, 1.0 + t * 0.08) && planetFallbackOK()) {
        planet(ctx, mX, H * 0.5, mR, ['#e8946a', '#b5502d', '#5a2314'], (R) => {
          ctx.fillStyle = 'rgba(80,35,22,0.55)'
          blob(ctx, -R * 0.2, R * 0.05, R * 0.35, R * 0.18, 0.4)
          blob(ctx, R * 0.35, -R * 0.2, R * 0.25, R * 0.12, -0.3)
          blob(ctx, -R * 0.45, R * 0.4, R * 0.2, R * 0.1, 0.1)
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          blob(ctx, 0, -R * 0.93, R * 0.3, R * 0.07, 0)
        })
        ctx.strokeStyle = 'rgba(255,170,120,0.35)'
        ctx.lineWidth = Math.max(1, mR * 0.015)
        ctx.beginPath()
        ctx.arc(mX, H * 0.5, mR, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // ---------- Superficie ----------
    const drawSurface = (t: number, cover: number, wi: number, awake: boolean, since: number) => {
      const horizon = H * 0.66
      const sz = 1 + 0.6 * (1 - smooth((t - 6.2) / 2.4))
      const shake = wi * 2.5
      ctx.save()
      ctx.translate(W / 2 + (Math.random() - 0.5) * shake, horizon + (Math.random() - 0.5) * shake)
      ctx.scale(sz, sz)
      ctx.translate(-W / 2, -horizon)

      const sky = ctx.createLinearGradient(0, 0, 0, horizon)
      sky.addColorStop(0, '#c47850')
      sky.addColorStop(1, '#ecb07e')
      ctx.fillStyle = sky
      ctx.fillRect(-W, -H, W * 3, horizon + H)

      const sx = W * 0.78
      const sy = H * 0.24
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.5)
      glow.addColorStop(0, `rgba(255,236,200,${awake ? 0.9 : 0.55})`)
      glow.addColorStop(1, 'rgba(255,236,200,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, horizon)
      ctx.fillStyle = 'rgba(255,246,225,0.95)'
      ctx.beginPath()
      ctx.arc(sx, sy, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#8e482e'
      ctx.fillRect(-W, horizon, W * 3, H)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      for (const r of rocks) {
        ctx.beginPath()
        ctx.ellipse(r.x * W, horizon + 10 + r.y * (H - horizon - 20), r.r * 1.6, r.r, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // rover (capa aparte) + polvo que se barre de izquierda a derecha
      const ks = H / 190
      const rx = W * 0.5
      const ry = horizon + (H - horizon) * 0.62
      const progress = 1 - cover
      const front = progress * 1.5 - 0.25 // frente de limpieza, de izquierda (-0.25) a derecha (1.25)

      // sombra de contacto bajo el rover
      const roverH = H * 0.82
      const roverW = roverH * 0.78
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.beginPath()
      ctx.ellipse(rx, ry + 2 * ks, roverW * 0.42, 7 * ks, 0, 0, Math.PI * 2)
      ctx.fill()

      const wake = awake ? smooth(since / 0.8) : 0
      const yaw = Math.sin(t * 0.5) * 0.05 + wi * Math.sin(t * 28) * 0.012
      const drawnGL = rover?.draw(ctx, rx, ry, roverH, front, wake, t, yaw)

      if (!drawnGL && roverFallbackOK()) {
        // Reserva 2D (sin WebGL o modelo que no carga).
        octx.clearRect(0, 0, 480, 360)
        octx.save()
        octx.scale(4, 4)
        drawRover(octx, 60, 80, 1, awake ? 1 : progress * 0.8)
        octx.restore()
        octx.globalCompositeOperation = 'source-atop'
        const f2 = front * 480
        const dg = octx.createLinearGradient(f2 - 70, 0, f2 + 70, 0)
        dg.addColorStop(0, 'rgba(172,104,66,0)')
        dg.addColorStop(1, 'rgba(172,104,66,0.93)')
        octx.fillStyle = dg
        octx.fillRect(0, 0, 480, 360)
        octx.globalCompositeOperation = 'source-over'
        ctx.drawImage(off, rx - 60 * ks, ry - 80 * ks, 120 * ks, 90 * ks)
      }

      // montículo de polvo a los pies del rover
      ctx.fillStyle = `rgba(172,104,66,${0.95 * cover})`
      ctx.beginPath()
      ctx.ellipse(rx, ry + 3 * ks, roverW * 0.4 * (0.35 + 0.65 * cover), 7 * ks * (0.3 + 0.7 * cover), 0, 0, Math.PI * 2)
      ctx.fill()

      // viento: rachas de polvo cruzando la pantalla
      if (wi > 0.02) {
        ctx.lineWidth = 1.5
        for (const s of streaks) {
          const x = (s.x * W * 1.4 - W * 0.2) % (W * 1.2)
          const y = horizon * 0.7 + s.y * (H - horizon * 0.7)
          ctx.strokeStyle = `rgba(210,140,100,${0.5 * wi})`
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + 30 + 60 * s.v * wi, y - 2)
          ctx.stroke()
        }
      }

      // onda de radio al despertar
      if (awake) {
        const k = since / 1.6
        if (k < 1) {
          ctx.strokeStyle = `rgba(110,247,255,${1 - k})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(rx - roverW * 0.18, ry - roverH * 0.42, 8 + k * W * 0.5, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    const render = (t: number, dt: number, cover: number, wi: number, awake: boolean, since: number) => {
      const sa = smooth((t - 6.2) / 1.0)
      if (sa < 1) drawSpace(t, dt)
      if (sa > 0) {
        ctx.globalAlpha = sa
        drawSurface(t, cover, wi, awake, since)
        ctx.globalAlpha = 1
      }
      // destello de entrada en la atmósfera
      const entry = smooth((t - 5.6) / 1.0) * (1 - smooth((t - 6.6) / 0.8)) * 0.65
      if (entry > 0) {
        ctx.fillStyle = `rgba(255,170,100,${entry})`
        ctx.fillRect(0, 0, W, H)
      }
    }

    // Movimiento reducido: solo la escena final, ya despierta.
    if (prefersReducedMotion()) {
      setHud({ phase: 'awake', label: 'MERIDIANI PLANUM', name: 'Polvo sobre los paneles', value: '0 %' })
      // Repinta la escena final hasta que el modelo 3D esté cargado (o se agote la espera).
      let rraf = 0
      const began = performance.now()
      const tick = () => {
        if (performance.now() - began > 5000 || rover?.failed()) gaveUp = true
        render(FLIGHT + 5, 0, 0, 0, true, 5)
        if (!gaveUp && rover && !rover.ready()) rraf = requestAnimationFrame(tick)
      }
      tick()
      doneRef.current()
      return () => {
        cancelAnimationFrame(rraf)
        window.removeEventListener('resize', resize)
        sprites?.dispose()
        rover?.dispose()
      }
    }

    let raf = 0
    let prev = performance.now()
    let t = 0
    let cover = 1
    let wi = 0
    let awake = false
    let wakeAt = 0
    let doneSent = false
    let lastHud = 0

    // La línea de tiempo se detiene mientras faltan los modelos 3D (los planetas al empezar, el rover
    // poco antes de aterrizar), con un máximo de espera total antes de recurrir a los dibujos 2D.
    const ROVER_NEEDED_AT = 5.6
    const MAX_WAIT = 5
    let waited = 0

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - prev) / 1000)
      prev = now

      const loading = (!!sprites && !sprites.ready()) || (!!rover && t >= ROVER_NEEDED_AT && !rover.ready())
      if (!gaveUp && (waited > MAX_WAIT || rover?.failed())) gaveUp = true
      if (loading && !gaveUp) {
        waited += dt
        render(t, 0, cover, wi, awake, t - wakeAt)
        raf = requestAnimationFrame(frame)
        return
      }
      t += dt

      if (t < FLIGHT) {
        wheelRef.current = 0
      } else if (!awake) {
        const holding = holdRef.current
        wi += ((holding ? 1 : 0) - wi) * Math.min(1, dt * 6)
        if (holding) cover -= dt / SWEEP_SECONDS
        else cover += dt * 0.05
        cover -= wheelRef.current
        wheelRef.current = 0
        if (t > FLIGHT + 6 && !holding) cover -= dt * 0.02 // una brisa que nunca deja el juego atascado
        cover = Math.min(1, Math.max(0, cover))
        if (cover <= 0.03) {
          awake = true
          wakeAt = t
          cover = 0
        }
      } else {
        wi += (0 - wi) * Math.min(1, dt * 4)
        if (!doneSent && t >= wakeAt + 1.8) {
          doneSent = true
          doneRef.current()
        }
      }

      for (const s of streaks) s.x = (s.x + dt * 0.5 * s.v * wi + 1) % 1

      render(t, dt, cover, wi, awake, t - wakeAt)

      if (now - lastHud > 90) {
        lastHud = now
        if (t < FLIGHT) {
          const label = t < 2.4 ? 'SALIENDO DE LA TIERRA' : t < 4.6 ? 'EN RUTA A MARTE' : 'ENTRANDO EN LA ATMÓSFERA'
          const km = Math.round(START_KM * (1 - smooth(t / FLIGHT)))
          setHud({ phase: 'flight', label, name: 'Distancia a Marte', value: km.toLocaleString('es-ES') + ' km' })
        } else {
          setHud({
            phase: awake ? 'awake' : 'surface',
            label: 'MERIDIANI PLANUM · 1,95° S · 354,47° E',
            name: 'Polvo sobre los paneles',
            value: Math.round(cover * 100) + ' %',
          })
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      sprites?.dispose()
      rover?.dispose()
    }
  }, [])

  const caption =
    hud.phase === 'flight'
      ? 'Un viaje de unos siete meses, comprimido en siete segundos.'
      : hud.phase === 'surface'
        ? `Opportunity lleva más de ${years} años en silencio, cubierta de polvo. El viento aún puede despertarla.`
        : 'Despierta. El viento limpió sus paneles muchas veces: pensada para 90 días, trabajó casi 15 años.'

  return (
    <div className="w-full max-w-3xl px-4">
      <div
        className="overflow-hidden rounded-lg border border-white/10 bg-[#02040a] text-left font-semibold tracking-wide shadow-[0_0_40px_rgba(0,0,0,0.6)]"
        onPointerDown={() => hud.phase === 'surface' && (holdRef.current = true)}
        onWheel={(e) => {
          if (hud.phase === 'surface') wheelRef.current += Math.min(0.2, Math.abs(e.deltaY) * 0.0008)
        }}
      >
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Opportunity · MER-B</p>
            <p className="mt-1 text-xs text-cyan-200">{hud.label}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{hud.name}</p>
            <p className="text-lg tabular-nums text-white md:text-xl">{hud.value}</p>
          </div>
        </div>

        <canvas ref={canvasRef} className="block h-56 w-full touch-none select-none md:h-72" />

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="min-h-[2.5rem] flex-1 text-xs leading-snug text-slate-300" aria-live="polite">
            {caption}
          </p>
          <button
            disabled={hud.phase !== 'surface'}
            onPointerDown={(e) => {
              e.stopPropagation()
              holdRef.current = true
            }}
            className="shrink-0 select-none rounded border border-cyan-300/60 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {hud.phase === 'awake' ? 'Despierta' : 'Mantén para soplar'}
          </button>
        </div>
      </div>
    </div>
  )
}
