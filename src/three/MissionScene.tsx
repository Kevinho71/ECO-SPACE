import { Suspense, useEffect } from 'react'
import { OrbitControls, Stars } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useAppStore } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { getStory } from '../story/StoryDirector'
import { Robot } from './Robot'
import { SceneCamera } from './SceneCamera'
import { StoryCamera } from './StoryCamera'
import { Hotspots } from './Hotspots'
import { LunarScene } from './environments/LunarScene'
import { MarsScene } from './environments/MarsScene'
import { SpaceScene } from './environments/SpaceScene'
import { FlightScene } from './environments/FlightScene'
import { Landing } from './Spacecraft'

export function MissionScene() {
  const missionId = useAppStore((s) => s.selectedMissionId)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const storyClip = useAppStore((s) => s.storyClip)
  const storyExpression = useAppStore((s) => s.storyExpression)
  const started = useAppStore((s) => s.storyStarted)
  const playing = useAppStore((s) => s.isPlaying)
  const camera = useThree((s) => s.camera)
  const mission = MISSIONS.find((m) => m.id === missionId)
  const hasStory = !!getStory(missionId)
  const storyPlace = useAppStore((s) => s.storyPlace)
  const chapter = useAppStore((s) => s.currentChapterIndex)
  const inFlight = hasStory && (storyPlace === 'launch' || storyPlace === 'cruise' || storyPlace === 'entry')

  // Al pasar a exploración libre, la cámara vuelve a una órbita cómoda alrededor del robot.
  useEffect(() => {
    if (cameraMode === 'free') {
      camera.position.set(6, 3.5, 8)
      camera.lookAt(0, 0.7, 0)
      const cam = camera as import('three').PerspectiveCamera
      cam.fov = 45
      cam.updateProjectionMatrix()
    }
  }, [cameraMode, camera])

  if (!mission) return null

  const inSpace = mission.location === 'beyond'

  return (
    <>
      {mission.location !== 'mars' && !inFlight && (
        <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.4} />
      )}

      {mission.location === 'moon' && <LunarScene />}
      {mission.location === 'mars' && !inFlight && <MarsScene />}
      {inFlight && <FlightScene place={storyPlace as 'launch' | 'cruise' | 'entry'} />}
      {hasStory && chapter === 1 && storyPlace === 'eagle' && <Landing />}
      {inSpace && <SpaceScene />}

      <Suspense fallback={null}>
        {hasStory ? (
          <Robot
            path={mission.modelPath}
            clip={started ? storyClip : null}
            expression={storyExpression}
            paused={started && !playing}
            followRuntime
          />
        ) : (
          <Robot path={mission.modelPath} />
        )}
      </Suspense>

      {hasStory ? (
        <>
          <StoryCamera />
          {cameraMode === 'free' && <Hotspots missionId={mission.id} />}
        </>
      ) : (
        <SceneCamera position={[6, 4, 9]} target={[0, 0.6, 0]} />
      )}

      <OrbitControls
        makeDefault
        enabled={cameraMode === 'free'}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={35}
        maxPolarAngle={inSpace ? Math.PI : Math.PI / 2 + 0.15}
        target={[0, 0.7, 0]}
      />
    </>
  )
}
