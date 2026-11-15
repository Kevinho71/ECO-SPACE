import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { driveRuntime } from '../../story/drive'

const VIEW_LABEL = { auto: 'Auto', pov: '1.ª persona', wide: '3.ª persona' } as const

/** Cambia a voluntad entre la cámara de la historia (Auto), 1.ª persona (ojos del robot) y 3.ª persona (desde fuera). */
export function ViewToggle() {
  const override = useAppStore((s) => s.viewOverride)
  const view = useAppStore((s) => s.storyView)
  const mode = useAppStore((s) => s.cameraMode)
  const patch = useAppStore((s) => s.patchStory)
  const driving = mode === 'drive'
  // Los primeros planos de piezas y el viaje son cortes de la narración: no se pueden cambiar.
  const locked = !driving && (view === 'part' || view === 'flight')
  // Conduciendo solo hay 1.ª y 3.ª persona (no existe «Auto»); el rover del modelo (Sojourner) no tiene «ojos».
  const noPov = driving && driveRuntime.cfg?.kind === 'rover-node'

  const cycle = () => {
    const s = useAppStore.getState()
    if (s.cameraMode === 'free' || locked || noPov) return
    if (s.cameraMode === 'drive') patch({ viewOverride: s.viewOverride === 'pov' ? 'wide' : 'pov' })
    else patch({ viewOverride: ({ auto: 'pov', pov: 'wide', wide: 'auto' } as const)[s.viewOverride] })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (e.code !== 'KeyV' || e.ctrlKey || e.metaKey || e.altKey) return
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      cycle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (mode === 'free' || noPov) return null
  const label = driving && override === 'auto' ? VIEW_LABEL.wide : VIEW_LABEL[override]
  return (
    <button
      onClick={cycle}
      disabled={locked}
      aria-label={`Cambiar de cámara (ahora: ${label})`}
      title={locked ? 'Este plano forma parte de la narración' : 'Cambiar entre 1.ª y 3.ª persona (V)'}
      className={`pointer-events-auto flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition ${
        locked
          ? 'cursor-not-allowed border-white/10 text-slate-600'
          : override === 'auto' && !driving
            ? 'border-white/20 text-slate-300 hover:bg-white/10'
            : 'border-cyan-300/60 bg-cyan-400/10 text-cyan-100'
      }`}
    >
      <span aria-hidden>👁</span>
      {label}
    </button>
  )
}
