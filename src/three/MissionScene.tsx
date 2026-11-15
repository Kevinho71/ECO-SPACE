import { Suspense } from 'react'
import { OrbitControls, Stars } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import { MISSIONS } from '../data/catalog'
import { Robot } from './Robot'
import { SceneCamera } from './SceneCamera'
import { LunarScene } from './environments/LunarScene'
import { MarsScene } from './environments/MarsScene'
import { SpaceScene } from './environments/SpaceScene'

export function MissionScene() {
  const missionId = useAppStore((s) => s.selectedMissionId)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const mission = MISSIONS.find((m) => m.id === missionId)

  if (!mission) return null

  const inSpace = mission.location === 'beyond'

  return (
    <>
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.4} />

      {mission.location === 'moon' && <LunarScene />}
      {mission.location === 'mars' && <MarsScene />}
      {inSpace && <SpaceScene />}

      <Suspense fallback={null}>
        <Robot path={mission.modelPath} />
      </Suspense>

      <SceneCamera position={[6, 4, 9]} target={[0, 0.6, 0]} />

      <OrbitControls
        makeDefault
        enabled={cameraMode === 'free'}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={35}
        maxPolarAngle={inSpace ? Math.PI : Math.PI / 2 + 0.15}
        target={[0, 0.6, 0]}
      />
    </>
  )
}
