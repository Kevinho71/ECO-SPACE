import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Terrain, Rocks } from './Terrain'
import { FarMountains, SunDisc } from './Backdrop'

const SEED = 13
const HEIGHT = 1.8
const CRATERS = 9

/**
 * Superficie marciana estilizada: cielo butterscotch con niebla de polvo, sol
 * pequeño y pálido, terreno low-poly cobrizo con cráteres y mesetas lejanas.
 */
export function MarsScene() {
  return (
    <>
      <color attach="background" args={['#d98f62']} />
      <fog attach="fog" args={['#d98f62', 22, 95]} />
      <hemisphereLight args={['#ffcfa0', '#6a2f1b', 0.7]} />
      <directionalLight
        position={[20, 25, 12]}
        intensity={2.6}
        color="#ffe2bf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={120}
        shadow-bias={-0.0002}
      />

      <SunDisc position={[100, 80, -120]} color="#fff0d0" size={3.5} />
      <FarMountains color="#a85a35" seed={SEED} radius={85} maxHeight={16} />

      <Terrain
        seed={SEED}
        height={HEIGHT}
        flattenStart={3}
        flattenEnd={8}
        craters={CRATERS}
        lowColor="#8c3f22"
        midColor="#c4683a"
        highColor="#eca777"
      />
      <Rocks seed={SEED} height={HEIGHT} flattenStart={3} flattenEnd={8} craters={CRATERS} color="#9a4a28" count={28} />
      <Sparkles count={90} scale={[40, 6, 40]} position={[0, 3, 0]} size={3} speed={0.35} opacity={0.35} color="#ffd9b0" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 10, -12]} scale={[30, 30, 1]} color="#ffd9b0" />
        <Lightformer form="rect" intensity={0.6} position={[8, 1, 3]} rotation-y={-Math.PI / 3} scale={[20, 5, 1]} color="#d9784a" />
      </Environment>
    </>
  )
}
