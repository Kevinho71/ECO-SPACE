import { useRef } from 'react'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../../story/runtime'
import { Terrain, Rocks } from './Terrain'
import { FarMountains, SunDisc } from './Backdrop'

const SEED = 13
const HEIGHT = 1.8
const CRATERS = 9

/**
 * Superficie marciana estilizada: cielo butterscotch con niebla de polvo, sol
 * pequeño y pálido, terreno low-poly cobrizo con cráteres y mesetas lejanas.
 */
const SKY = new THREE.Color('#d98f62')
const STORM_SKY = new THREE.Color('#2a1710')
const tmp = new THREE.Color()

export function MarsScene() {
  const hemi = useRef<THREE.HemisphereLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)

  // La historia (cap. 4–5) oscurece el cielo y la luz con la tormenta de polvo de 2018.
  useFrame(({ scene }) => {
    const d = storyRuntime.active ? storyRuntime.dust : 0
    tmp.copy(SKY).lerp(STORM_SKY, d)
    if (scene.background instanceof THREE.Color) scene.background.copy(tmp)
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(tmp)
      scene.fog.near = THREE.MathUtils.lerp(22, 3, d)
      scene.fog.far = THREE.MathUtils.lerp(95, 26, d)
    }
    if (hemi.current) hemi.current.intensity = 0.7 * (1 - 0.8 * d)
    if (sun.current) sun.current.intensity = 2.6 * (1 - 0.82 * d)
  })

  return (
    <>
      <color attach="background" args={['#d98f62']} />
      <fog attach="fog" args={['#d98f62', 22, 95]} />
      <hemisphereLight ref={hemi} args={['#ffcfa0', '#6a2f1b', 0.7]} />
      <directionalLight
        ref={sun}
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
