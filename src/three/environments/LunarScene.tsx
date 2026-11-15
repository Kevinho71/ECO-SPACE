import { Environment, Lightformer } from '@react-three/drei'
import { Terrain, Rocks } from './Terrain'

const SEED = 7
const HEIGHT = 1.6

/** Superficie lunar: cielo negro (sin atmósfera), sol duro y alto contraste. */
export function LunarScene() {
  return (
    <>
      <color attach="background" args={['#04050a']} />
      <ambientLight intensity={0.12} color="#8899cc" />
      <directionalLight
        position={[25, 35, 15]}
        intensity={3.2}
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

      <Terrain
        seed={SEED}
        height={HEIGHT}
        flattenStart={3}
        flattenEnd={8}
        lowColor="#232327"
        midColor="#6f6f74"
        highColor="#c3c3c8"
      />
      <Rocks seed={SEED} height={HEIGHT} flattenStart={3} flattenEnd={8} color="#8a8a90" count={18} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={5} position={[0, 10, -12]} scale={[30, 30, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.6} position={[-10, 2, 4]} rotation-y={Math.PI / 2} scale={[20, 5, 1]} color="#8899ff" />
      </Environment>
    </>
  )
}
