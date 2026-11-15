import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/** Portada inicial: las letras "ECOSPACE" aparecen y se desvanecen para dar paso al menú. */
export function Splash() {
  const setStage = useAppStore((s) => s.setStage)

  useEffect(() => {
    const t = setTimeout(() => setStage('solar-map'), 2600)
    return () => clearTimeout(t)
  }, [setStage])

  return (
    <div className="splash-fade pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#02040a]">
      <h1 className="splash-tracking text-5xl font-semibold text-white md:text-7xl">ECOSPACE</h1>
      <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-400">Abandoned but not Forgotten</p>
    </div>
  )
}
