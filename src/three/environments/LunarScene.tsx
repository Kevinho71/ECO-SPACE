import { Environment, Lightformer } from '@react-three/drei'
import { Terrain, Rocks } from './Terrain'
import { CelestialBody, FarMountains, StarDome, SunDisc } from './Backdrop'
import { getSolarTextures } from '../lib/solarTextures'

const SEED = 7
const HEIGHT = 1.4
const CRATERS = 16

/**
 * Superficie lunar estilizada: cielo negro (sin atmósfera), sol duro,
 * terreno low-poly con cráteres, cordillera lejana y la Tierra (textura NASA) en el cielo.
 */
export function LunarScene() {
  const tex = getSolarTextures()
  return (
    <>
      <color attach="background" args={['#05060d']} />
      <fog attach="fog" args={['#05060d', 70, 140]} />
      <hemisphereLight args={['#aebcff', '#2b2b36', 0.4]} />
      <directionalLight
        position={[25, 35, 15]}
        intensity={2.1}
        color="#fff3e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={120}
        shadow-bias={-0.0002}
      />

      <StarDome opacity={0.5} />
      <SunDisc position={[120, 150, 60]} size={6} />
      <CelestialBody texture={tex.earth} position={[-70, 38, -95]} radius={9} halo="#6fb4ff" spin={0.03} />
      <FarMountains color="#42434f" seed={SEED} radius={100} maxHeight={13} />

      <Terrain
        seed={SEED}
        height={HEIGHT}
        flattenStart={3}
        flattenEnd={8}
        craters={CRATERS}
        lowColor="#33353f"
        midColor="#686a7b"
        highColor="#a2a3b4"
      />
      <Rocks seed={SEED} height={HEIGHT} flattenStart={3} flattenEnd={8} craters={CRATERS} color="#7d7e90" count={24} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={5} position={[0, 10, -12]} scale={[30, 30, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[-10, 2, 4]} rotation-y={Math.PI / 2} scale={[20, 5, 1]} color="#8899ff" />
      </Environment>
    </>
  )
}
