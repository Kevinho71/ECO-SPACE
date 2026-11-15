import { Environment, Lightformer } from '@react-three/drei'
import { Terrain, Rocks } from './Terrain'

const SEED = 13
const HEIGHT = 1.8

/** Superficie marciana: regolito rojizo, polvo en suspensión (niebla) y sol cálido. */
export function MarsScene() {
  return (
    <>
      <color attach="background" args={['#120a08']} />
      <fog attach="fog" args={['#c96a3f', 14, 55]} />
      <ambientLight intensity={0.5} color="#4a2415" />
      <directionalLight
        position={[20, 25, 12]}
        intensity={2.4}
        color="#ffd9b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={120}
        shadow-bias={-0.0002}
      />

      <Terrain
        seed={SEED}
        height={HEIGHT}
        flattenStart={3}
        flattenEnd={8}
        lowColor="#4a2114"
        midColor="#8a4a2a"
        highColor="#c9784a"
      />
      <Rocks seed={SEED} height={HEIGHT} flattenStart={3} flattenEnd={8} color="#7a3a1e" count={22} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 10, -12]} scale={[30, 30, 1]} color="#ffd9b0" />
        <Lightformer form="rect" intensity={0.5} position={[8, 1, 3]} rotation-y={-Math.PI / 3} scale={[20, 5, 1]} color="#c96a3f" />
      </Environment>
    </>
  )
}
