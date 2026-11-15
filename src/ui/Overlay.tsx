import { useAppStore, type LocationId } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { getStory } from '../story/StoryDirector'

const LOCATION_LABEL: Record<LocationId, string> = {
  moon: 'Luna',
  mars: 'Marte',
  beyond: 'Más allá',
}

export function Overlay() {
  const stage = useAppStore((s) => s.stage)
  const selectedLocation = useAppStore((s) => s.selectedLocation)
  const selectedMissionId = useAppStore((s) => s.selectedMissionId)
  const transitionTo = useAppStore((s) => s.transitionTo)
  const backToPlanet = useAppStore((s) => s.backToPlanet)
  const setStage = useAppStore((s) => s.setStage)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const setCameraMode = useAppStore((s) => s.setCameraMode)

  const mission = MISSIONS.find((m) => m.id === selectedMissionId)
  const hasStory = !!getStory(selectedMissionId)

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {stage === 'planet-map' && selectedLocation && (
        <div className="flex h-full flex-col items-center justify-between py-6">
          <div className="flex flex-col items-center px-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              {LOCATION_LABEL[selectedLocation]}
            </p>
            <p className="mt-2 text-lg text-slate-200">
              Gira el planeta y haz clic en un punto brillante para encontrar los robots abandonados
            </p>
          </div>
          <button
            onClick={() => transitionTo(() => setStage('solar-map'))}
            className="pointer-events-auto rounded-full border border-white/20 px-6 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            Volver al mapa
          </button>
        </div>
      )}

      {stage === 'mission-scene' && mission && (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={backToPlanet}
              className="pointer-events-auto rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Volver
            </button>
            <p className="text-sm text-slate-300">{mission.name}</p>
            {hasStory ? (
              <span className="w-16" />
            ) : (
              <button
                onClick={() => setCameraMode(cameraMode === 'free' ? 'guided' : 'free')}
                className="pointer-events-auto rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                {cameraMode === 'free' ? 'Modo Guiado' : 'Modo Libre'}
              </button>
            )}
          </div>

          {!hasStory && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8">
            <p className="max-w-xl px-6 text-center text-lg text-white/90">
              “Hola. Soy {mission.nickname ?? mission.name}.”
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span>Reproducir</span>
              <span>Cap 1 · Cap 2 · Cap 3 · Cap 4 · ¿Qué pasaría si?</span>
            </div>
          </div>
          )}
        </>
      )}
    </div>
  )
}
