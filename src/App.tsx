import { Suspense } from 'react'
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
import { FlightLog } from './ui/story/FlightLog'
import { Hud } from './ui/story/Hud'
import { StoryOverlay } from './ui/story/StoryOverlay'

export default function App() {
  const stage = useAppStore((s) => s.stage)
  const veil = useAppStore((s) => s.veil)
  const missionId = useAppStore((s) => s.selectedMissionId)
  const started = useAppStore((s) => s.storyStarted)
  const hasStory = stage === 'mission-scene' && !!getStory(missionId)

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
          <FlightLog />
          <StaticOverlay />
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
