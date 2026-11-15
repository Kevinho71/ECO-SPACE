import { useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type Expression = 'Sad' | 'Surprised' | 'Sleep' | null

interface RobotProps {
  path: string
  /** Expresión facial (morph target de la malla `face`). */
  expression?: Expression
  /** Clip a reproducir en bucle tras despertar (p. ej. 'Idle', 'Drive', 'Fly', 'Dig'). */
  clip?: string
}

/**
 * Carga el GLB de una misión (estilo "Robot Expressive") y le da vida:
 *  - clip `Wake` al aparecer y luego el clip en bucle (`Idle` por defecto),
 *  - parpadeo aleatorio y expresiones con los morph targets de `face`,
 *  - pulso de la luz de estado (`status_light`, material emisivo).
 */
export function Robot({ path, expression = null, clip = 'Idle' }: RobotProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(path)
  const { actions, mixer } = useAnimations(animations, group)

  const status = useMemo(() => (scene.getObjectByName('status_light') as THREE.Mesh | undefined) ?? null, [scene])

  // Malla de la cara (la que tiene los morph targets Sad / Surprised / Sleep).
  const face = useMemo(() => {
    let found: THREE.Mesh | null = null
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh && m.morphTargetDictionary && 'Sleep' in m.morphTargetDictionary) found = m
    })
    return found as THREE.Mesh | null
  }, [scene])

  // Sombras en todas las mallas.
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
  }, [scene])

  // Despertar -> bucle.
  useEffect(() => {
    const loop = actions[clip] ?? actions['Idle']
    const wake = actions['Wake'] ?? actions['Open'] // Pathfinder despierta abriendo sus pétalos
    if (wake && loop && wake !== loop) {
      wake.reset().setLoop(THREE.LoopOnce, 1)
      wake.clampWhenFinished = true
      wake.play()
      const onDone = (e: { action?: THREE.AnimationAction }) => {
        if (e.action === wake) {
          loop.reset().setLoop(THREE.LoopRepeat, Infinity).play()
          loop.crossFadeFrom(wake, 0.4, false)
        }
      }
      mixer.addEventListener('finished', onDone as never)
      return () => {
        mixer.removeEventListener('finished', onDone as never)
        mixer.stopAllAction()
      }
    }
    loop?.reset().play()
    return () => {
      mixer.stopAllAction()
    }
  }, [actions, mixer, clip])

  const blink = useRef({ next: 2.5, t: -1 })

  useFrame(({ clock }, dt) => {
    // Luz de estado
    if (status) {
      const mat = status.material as THREE.MeshStandardMaterial | undefined
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = 0.6 + 0.9 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5))
      }
    }
    // Cara: expresión + parpadeo
    if (face?.morphTargetInfluences && face.morphTargetDictionary) {
      const d = face.morphTargetDictionary
      const inf = face.morphTargetInfluences
      const k = Math.min(1, dt * 6)
      for (const name of ['Sad', 'Surprised', 'Sleep']) {
        const i = d[name]
        const target = expression === name ? 1 : 0
        if (name === 'Sleep') continue
        inf[i] = THREE.MathUtils.lerp(inf[i], target, k)
      }
      const b = blink.current
      const t = clock.elapsedTime
      if (t > b.next && b.t < 0) b.t = t
      let sleep = expression === 'Sleep' ? 1 : 0
      if (b.t >= 0) {
        const p = (t - b.t) / 0.18
        if (p >= 1) {
          b.t = -1
          b.next = t + 2.5 + Math.random() * 3.5
        } else sleep = Math.max(sleep, Math.sin(p * Math.PI))
      }
      inf[d['Sleep']] = THREE.MathUtils.lerp(inf[d['Sleep']], sleep, Math.min(1, dt * 18))
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}
