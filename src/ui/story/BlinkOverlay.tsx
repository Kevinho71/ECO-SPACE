import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { storyRuntime } from '../../story/runtime'

/**
 * Párpados: el recurso para "aparecer" en otro lugar. Dos persianas con borde curvo y suave se cierran sobre la
 * imagen y se abren con el escenario nuevo (StoryDirector cambia el lugar en lo más oscuro).
 * Con "reducir efectos" es un simple fundido a negro.
 */
export function BlinkOverlay() {
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const fade = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const b = storyRuntime.blink
      const reduce = useAppStore.getState().reduceEffects
      if (fade.current) fade.current.style.opacity = reduce ? String(b) : '0'
      const h = reduce ? 0 : b * 53
      if (top.current) top.current.style.height = `${h}%`
      if (bottom.current) bottom.current.style.height = `${h}%`
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const lid = 'absolute left-0 right-0 bg-black'
  return (
    <div className="pointer-events-none absolute inset-0 z-[13] overflow-hidden">
      <div
        ref={top}
        className={`${lid} top-0`}
        style={{ height: 0, borderRadius: '0 0 50% 50% / 0 0 14vh 14vh', boxShadow: '0 10px 40px 18px rgba(0,0,0,0.85)' }}
      />
      <div
        ref={bottom}
        className={`${lid} bottom-0`}
        style={{ height: 0, borderRadius: '50% 50% 0 0 / 14vh 14vh 0 0', boxShadow: '0 -10px 40px 18px rgba(0,0,0,0.85)' }}
      />
      <div ref={fade} className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
    </div>
  )
}
