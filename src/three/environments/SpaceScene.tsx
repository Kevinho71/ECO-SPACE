import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { CelestialBody, FloatingRocks, StarDome, SunDisc } from './Backdrop'
import { getSolarTextures } from '../lib/solarTextures'

/**
 * Espacio profundo estilizado: cúpula estelar NASA, Júpiter con textura real a lo
 * lejos (Pioneer 10 fue el primero en visitarlo), Sol pequeño y asteroides flotando.
 */
export function SpaceScene() {
  const tex = getSolarTextures()
  return (
    <>
      <color attach="background" args={['#04050c']} />
      <hemisphereLight args={['#8fa4ff', '#1a1a30', 0.5]} />
      <directionalLight position={[10, 6, 8]} intensity={2.6} color="#fff6e6" castShadow />

      <StarDome opacity={0.85} />
      <SunDisc position={[160, 70, 120]} size={4} />
      <CelestialBody texture={tex.jupiter} position={[-60, -10, -110]} radius={22} halo="#ffcf9a" spin={0.05} tilt={0.1} />
      <FloatingRocks count={16} />
      <Sparkles count={260} scale={[40, 30, 40]} size={1.8} speed={0.2} opacity={0.5} color="#9ab0ff" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 8, -10]} scale={[30, 30, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.7} position={[-10, -2, 6]} rotation-y={Math.PI / 2} scale={[20, 5, 1]} color="#5566bb" />
      </Environment>
    </>
  )
}
