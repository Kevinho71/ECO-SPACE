import { useAppStore, type LocationId } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'

const LOCATION_LABEL: Record<LocationId, string> = {
  moon: 'Luna',
  mars: 'Marte',
  beyond: 'Más allá',
}

export function Overlay() {
  const stage = useAppStore((s) => s.stage)
  const selectedLocation = useAppStore((s) => s.selectedLocation)
  const selectedMissionId = useAppStore((s) => s.selectedMissionId)
  const setStage = useAppStore((s) => s.setStage)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const setCameraMode = useAppStore((s) => s.setCameraMode)

  const mission = MISSIONS.find((m) => m.id === selectedMissionId)

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {stage === 'cover' && (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">NASA Space Apps · 2026</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white md:text-6xl">EcoSpace</h1>
          <p className="mt-2 text-xl text-slate-300">Abandoned but not Forgotten</p>
          <p className="mt-4 max-w-md text-slate-400">
            Los robots que la NASA dejó en la Luna, Marte y el espacio profundo despiertan para contarte su
            historia en primera persona.
          </p>
          <button
            onClick={() => setStage('solar-map')}
            className="pointer-events-auto mt-8 rounded-full bg-white px-8 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Explorar el Cementerio de las Estrellas
          </button>
        </div>
      )}

      {stage === 'solar-map' && (
        <div className="flex flex-col items-center pt-10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Elige un destino</p>
          <p className="mt-1 text-slate-300">Haz clic en un cuerpo celeste</p>
        </div>
      )}

      {stage === 'planet-map' && selectedLocation && (
        <div className="flex h-full flex-col items-center justify-between py-6">
          <div className="flex flex-col items-center px-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              {LOCATION_LABEL[selectedLocation]}
            </p>
            <p className="mt-2 text-lg text-slate-200">
              🔍 Gira el planeta y haz clic en un punto brillante para encontrar los robots abandonados
            </p>
          </div>
          <button
            onClick={() => setStage('solar-map')}
            className="pointer-events-auto rounded-full border border-white/20 px-6 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            ← Volver al mapa
          </button>
        </div>
      )}

      {stage === 'mission-scene' && mission && (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setStage('planet-map')}
              className="pointer-events-auto rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              ← Volver
            </button>
            <p className="text-sm text-slate-300">{mission.name}</p>
            <button
              onClick={() => setCameraMode(cameraMode === 'free' ? 'guided' : 'free')}
              className="pointer-events-auto rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              {cameraMode === 'free' ? '🔒 Modo Guiado' : '🔄 Modo Libre'}
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8">
            <p className="max-w-xl px-6 text-center text-lg text-white/90">
              “Hola. Soy {mission.nickname ?? mission.name}.”
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span>▶</span>
              <span>Cap 1 —— Cap 2 —— Cap 3 —— Cap 4 ┄┄ ⚡¿Qué pasaría si?</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
