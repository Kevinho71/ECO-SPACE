import { useEffect, useRef } from 'react'
import { storyRuntime } from '../../story/runtime'

/**
 * Feed de cámara: estática procedural, líneas de escaneo, barras de glitch, viñeta y corte eléctrico
 * (la imagen se colapsa a una línea y se apaga). Intensidad = storyRuntime.staticLevel (0–1).
 */
export function StaticOverlay() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const bars = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const W = 192
    const H = 108
    c.width = W
    c.height = H
    const img = ctx.createImageData(W, H)
    let raf = 0
    let frame = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      frame++
      const lvl = storyRuntime.staticLevel
      const off = storyRuntime.powerOff
      if (root.current) {
        // El "shake" mueve todo el feed durante el aterrizaje.
        const sh = storyRuntime.shake
        root.current.style.transform = sh > 0.01 ? `translate(${(Math.random() - 0.5) * sh * 14}px, ${(Math.random() - 0.5) * sh * 14}px)` : ''
      }
      if (frame % 2 === 0 && lvl > 0.01) {
        const d = img.data
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255
          d[i] = d[i + 1] = d[i + 2] = v
          d[i + 3] = 255
        }
        ctx.putImageData(img, 0, 0)
      }
      if (canvas.current) canvas.current.style.opacity = String(Math.min(0.9, lvl * 0.45))
      if (bars.current) {
        // Barras horizontales de glitch que aparecen con la estática alta.
        const show = lvl > 0.3 && Math.random() < lvl * 0.35
        bars.current.style.opacity = show ? String(0.25 + lvl * 0.4) : '0'
        if (show) {
          bars.current.style.top = `${Math.random() * 90}%`
          bars.current.style.height = `${2 + Math.random() * 8}%`
          bars.current.style.transform = `translateX(${(Math.random() - 0.5) * 40}px)`
        }
      }
      // Apagado tipo CRT: dos persianas negras cierran la imagen y queda una línea que se apaga.
      const close = Math.min(1, off * 1.6)
      if (top.current) top.current.style.height = `${close * 50}%`
      if (bottom.current) bottom.current.style.height = `${close * 50}%`
      if (line.current) {
        const lineVis = off > 0.55 && off < 0.98 ? 1 : 0
        line.current.style.opacity = String(lineVis)
        line.current.style.transform = `scaleX(${1 - Math.max(0, (off - 0.6) / 0.4)})`
      }
      if (root.current) root.current.style.background = off >= 0.98 ? '#000' : 'transparent'
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[12] overflow-hidden">
      <canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full opacity-0 mix-blend-screen"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* líneas de escaneo + viñeta del visor */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />
      <div ref={bars} className="absolute left-0 right-0 bg-white/30 mix-blend-overlay" style={{ opacity: 0 }} />
      <div ref={top} className="absolute left-0 right-0 top-0 bg-black" style={{ height: 0 }} />
      <div ref={bottom} className="absolute bottom-0 left-0 right-0 bg-black" style={{ height: 0 }} />
      <div
        ref={line}
        className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.8)]"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
