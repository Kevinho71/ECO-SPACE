import { Suspense, useEffect } from 'react'
import { setSoundEnabled, startMenuMusic, userHasInteracted } from './story/audio'
import { SOUND_OFF_KEY, clearFlag, writeFlag } from './lib/prefs'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from './store/useAppStore'
import { SolarMap } from './three/SolarMap'
import { PlanetMap } from './three/PlanetMap'
import { MissionScene } from './three/MissionScene'
import { Effects } from './three/Effects'
import { Overlay } from './ui/Overlay'
import { Splash } from './ui/Splash'
import { StoryDirector, getStory } from './story/StoryDirector'
import { StaticOverlay } from './ui/story/StaticOverlay'
import { BlinkOverlay } from './ui/story/BlinkOverlay'
import { Hud } from './ui/story/Hud'
import { StoryOverlay } from './ui/story/StoryOverlay'

export default function App() {
  const stage = useAppStore((s) => s.stage)
  const veil = useAppStore((s) => s.veil)
  const missionId = useAppStore((s) => s.selectedMissionId)
  const started = useAppStore((s) => s.storyStarted)
  const hasStory = stage === 'mission-scene' && !!getStory(missionId)

  // Música del menú: suena en el sistema solar y el catálogo (la portada la arranca con su botón). El primer gesto
  // del visitante la desbloquea si llegó sin pulsar nada (visita que avanza sola); al volver de una misión se retoma.
  useEffect(() => {
    const menuStage = stage === 'solar-map' || stage === 'planet-map'
    if (menuStage && userHasInteracted()) startMenuMusic(useAppStore.getState().soundOn)
    if (!menuStage) return
    const unlock = () => startMenuMusic(useAppStore.getState().soundOn)
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [stage])

  // El sonido (música y voces) se recuerda entre visitas y se aplica allí donde se cambie.
  useEffect(
    () =>
      useAppStore.subscribe((s, prev) => {
        if (s.soundOn === prev.soundOn) return
        setSoundEnabled(s.soundOn)
        if (s.soundOn) clearFlag(SOUND_OFF_KEY)
        else writeFlag(SOUND_OFF_KEY)
      }),
    [],
  )

  return (
    <div className="relative h-full w-full">
      <Canvas shadows="soft" dpr={[1, 2]} camera={{ position: [0, 1.5, 9], fov: 45 }}>
        <Suspense fallback={null}>
          {stage === 'mission-scene' ? (
            <MissionScene />
          ) : stage === 'planet-map' ? (
            <PlanetMap />
          ) : (
            <SolarMap />
          )}
        </Suspense>
        <Effects />
      </Canvas>
      {hasStory && missionId && (
        <>
          <StoryDirector />
          <StaticOverlay />
          <BlinkOverlay />
          {started && <Hud />}
          <div className="pointer-events-none absolute inset-0 z-[14]">
            <StoryOverlay missionId={missionId} />
          </div>
        </>
      )}
      <Overlay />
      {/* Velo de fundido entre escenas: oculta los cortes de cámara */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-[420ms] ease-in-out ${veil ? 'opacity-100 !pointer-events-auto' : 'opacity-0'}`}
      />
      {stage === 'splash' && <Splash />}
    </div>
  )
}
