import { useEffect, useRef } from 'react'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../../story/runtime'
import { useAppStore } from '../../store/useAppStore'
import { getStory } from '../../story/StoryDirector'
import { FarMountains, SunDisc } from './Backdrop'
import { Ground } from './Ground'
import { placeHeight, prewarmPlaces, surfaceDef } from './places'

const SEED = 13
const STORM_SKY = new THREE.Color('#2a1710')
const tmp = new THREE.Color()
const WHEEL_BASE = 0.58
const TRACK = 0.66

/**
 * Superficie marciana estilizada. Sin historia (otros robots) es el escenario de siempre; con la historia de
 * Opportunity cambia de lugar (Eagle, Purgatory Dune, Endurance, Victoria, Endeavour, Perseverance Valley…) y el
 * suelo se desplaza bajo el robot para dar sensación de avance.
 */
export function MarsScene() {
  const hemi = useRef<THREE.HemisphereLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  const ground = useRef<THREE.Group>(null)
  const missionId = useAppStore((s) => s.selectedMissionId)
  const storyPlace = useAppStore((s) => s.storyPlace)
  const hasStory = !!getStory(missionId)
  const place = hasStory ? storyPlace : 'generic'
  const def = surfaceDef(place)
  const sky = useRef(new THREE.Color(def.sky))

  // Construye los demás terrenos en segundo plano para que el parpadeo no tenga tirones.
  useEffect(() => {
    if (!hasStory) return
    return prewarmPlaces(['eagle', 'purgatory', 'plains', 'endurance', 'victoria', 'endeavour', 'perseverance'])
  }, [hasStory])

  useFrame(({ scene }, dt) => {
    const d = storyRuntime.active ? storyRuntime.dust : 0
    sky.current.set(def.sky)
    tmp.copy(sky.current).lerp(STORM_SKY, d)
    if (scene.background instanceof THREE.Color) scene.background.copy(tmp)
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(tmp)
      scene.fog.near = THREE.MathUtils.lerp(def.fogNear, 3, d)
      scene.fog.far = THREE.MathUtils.lerp(def.fogFar, 26, d)
    }
    if (hemi.current) {
      hemi.current.color.set(def.hemiSky)
      hemi.current.groundColor.set(def.hemiGround)
      hemi.current.intensity = 0.7 * (1 - 0.8 * d)
    }
    if (sun.current) sun.current.intensity = 2.6 * (1 - 0.82 * d)

    // El suelo se desplaza: el robot siempre está en x = 0 y el terreno pasa por debajo.
    const g = ground.current
    if (!g) return
    const xt = def.startX + (storyRuntime.active ? storyRuntime.robotX : 0)
    const hF = (z: number) => placeHeight(def, xt + WHEEL_BASE, z)
    const hR = (z: number) => placeHeight(def, xt - WHEEL_BASE, z)
    const fl = hF(-TRACK), fr = hF(TRACK), rl = hR(-TRACK), rr = hR(TRACK)
    const h0 = (fl + fr + rl + rr) / 4
    const pitch = Math.atan(((fl + fr) / 2 - (rl + rr) / 2) / (2 * WHEEL_BASE))
    const roll = Math.atan(((fl + rl) / 2 - (fr + rr) / 2) / (2 * TRACK))
    const k = 1 - Math.exp(-dt * 9)
    storyRuntime.groundY = THREE.MathUtils.lerp(storyRuntime.groundY, h0, k)
    storyRuntime.pitch = THREE.MathUtils.lerp(storyRuntime.pitch, pitch, k)
    storyRuntime.roll = THREE.MathUtils.lerp(storyRuntime.roll, roll, k)
    g.position.set(-xt, -storyRuntime.groundY, 0)
  })

  return (
    <>
      <color attach="background" args={[def.sky]} />
      <fog attach="fog" args={[def.sky, def.fogNear, def.fogFar]} />
      <hemisphereLight ref={hemi} args={[def.hemiSky, def.hemiGround, 0.7]} />
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
      <FarMountains color={def.mountains.color} seed={SEED + place.length} radius={85} maxHeight={def.mountains.height} />

      <group ref={ground}>
        <Ground place={place} />
      </group>
      <Sparkles count={90} scale={[40, 6, 40]} position={[0, 3, 0]} size={3} speed={0.35} opacity={0.35} color="#ffd9b0" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 10, -12]} scale={[30, 30, 1]} color="#ffd9b0" />
        <Lightformer form="rect" intensity={0.6} position={[8, 1, 3]} rotation-y={-Math.PI / 3} scale={[20, 5, 1]} color="#d9784a" />
      </Environment>
    </>
  )
}

