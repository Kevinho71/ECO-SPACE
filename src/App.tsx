import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from './store/useAppStore'
import { SolarMap } from './three/SolarMap'
import { PlanetMap } from './three/PlanetMap'
import { MissionScene } from './three/MissionScene'
import { Effects } from './three/Effects'
import { Overlay } from './ui/Overlay'
import { Splash } from './ui/Splash'

export default function App() {
  const stage = useAppStore((s) => s.stage)
  const veil = useAppStore((s) => s.veil)

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
      <Overlay />
      {/* Velo de fundido entre escenas: oculta los cortes de cámara */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-[420ms] ease-in-out ${veil ? 'opacity-100 !pointer-events-auto' : 'opacity-0'}`}
      />
      {stage === 'splash' && <Splash />}
    </div>
  )
}
