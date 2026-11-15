import { useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { storyRuntime } from '../story/runtime'

export type Expression = 'Sad' | 'Surprised' | 'Sleep' | null

interface RobotProps {
  path: string
  /** Expresión facial (morph target de la malla `face`). */
  expression?: Expression
  /**
   * Clip dirigido por la historia. Si es `undefined`, el robot actúa solo (Wake → Idle).
   * Si es `null`, queda quieto en su pose de reposo.
   */
  clip?: string | null
  /** Pausa las animaciones (pausa de la historia). */
  paused?: boolean
  /** Si es true, la posición X del robot sigue a `storyRuntime.robotX`. */
  followRuntime?: boolean
}

/** Clips que se reproducen una vez y se quedan en su última pose. */
const ONCE = new Set(['Wake', 'Death', 'Open', 'Land'])
/** Velocidad de reproducción por clip (la muerte va en cámara lenta; el giro de una sonda, pausado). */
const SPEED: Record<string, number> = { Death: 0.4, Spin: 0.3 }

/**
 * Carga el GLB de una misión (estilo "Robot Expressive") y le da vida:
 *  - clips de animación (`Wake`, `Idle`, `Drive`, `Death`…) con fundido entre ellos,
 *  - parpadeo aleatorio y expresiones con los morph targets de `face`,
 *  - pulso de la luz de estado (`status_light`, material emisivo).
 */
export function Robot({ path, expression = null, clip, paused = false, followRuntime = false }: RobotProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(path)
  const { actions, mixer } = useAnimations(animations, group)
  const current = useRef<THREE.AnimationAction | null>(null)
  const driveAction = useRef<THREE.AnimationAction | null>(null)

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

  // --- Modo autónomo (sin historia): despertar -> bucle ---
  useEffect(() => {
    if (clip !== undefined) return
    const loop = actions['Idle']
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

  // --- Modo dirigido (historia): clip actual con fundido ---
  useEffect(() => {
    if (clip === undefined) return
    if (clip === null) {
      mixer.stopAllAction()
      current.current = null
      driveAction.current = null
      return
    }
    const next = actions[clip]
    if (!next) return
    const prev = current.current
    const once = ONCE.has(clip)
    next.reset()
    next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity)
    next.clampWhenFinished = once
    next.timeScale = SPEED[clip] ?? 1
    driveAction.current = clip === 'Drive' ? next : null
    next.play()
    if (prev && prev !== next) prev.crossFadeTo(next, 0.35, false)
    else next.fadeIn(0.2)
    current.current = next
  }, [clip, actions, mixer])

  useEffect(
    () => () => {
      mixer.stopAllAction()
    },
    [mixer],
  )

  const blink = useRef({ next: 2.5, t: -1 })

  useFrame(({ clock }, dt) => {
    mixer.timeScale = paused ? 0 : 1
    if (followRuntime && group.current) {
      // El robot no se desplaza: el suelo pasa por debajo. Sigue el relieve (cabeceo, alabeo), se hunde en la arena
      // y tiembla cuando las ruedas patinan.
      const g = group.current
      const slip = storyRuntime.slip
      const t = clock.elapsedTime
      g.visible = storyRuntime.robotVisible
      // Pistas opcionales de la historia: `lift` (m), `tilt` y `bank` (rad), p. ej. una nave apoyada en una ladera.
      const tr = storyRuntime.tracks
      g.position.set(0, -storyRuntime.sink + (tr.lift ?? 0) + Math.sin(t * 31) * 0.012 * slip, 0)
      g.rotation.z = storyRuntime.pitch + (tr.tilt ?? 0) + Math.sin(t * 17) * 0.012 * slip
      g.rotation.x = storyRuntime.roll + (tr.bank ?? 0) + Math.sin(t * 23 + 1) * 0.02 * slip
      // Las ruedas giran según la velocidad (o patinan).
      if (driveAction.current) {
        const sp = storyRuntime.speed
        driveAction.current.timeScale = sp > 0.03 ? THREE.MathUtils.clamp(sp / 0.45, 0.35, 2.2) : slip > 0.1 ? 1.4 : 0.6
      }
    }

    // Luz de estado: late; se apaga con la batería y con el corte eléctrico.
    if (status) {
      const mat = status.material as THREE.MeshStandardMaterial | undefined
      if (mat && 'emissiveIntensity' in mat) {
        const alive = followRuntime ? Math.max(0, storyRuntime.battery * 6) * (1 - storyRuntime.powerOff) : 1
        const power = Math.min(1, alive)
        mat.emissiveIntensity = power * (0.6 + 0.9 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5)))
      }
    }
    // Cara: expresión + parpadeo
    if (face?.morphTargetInfluences && face.morphTargetDictionary) {
      const d = face.morphTargetDictionary
      const inf = face.morphTargetInfluences
      const k = Math.min(1, dt * 6)
      for (const name of ['Sad', 'Surprised']) {
        const i = d[name]
        inf[i] = THREE.MathUtils.lerp(inf[i], expression === name ? 1 : 0, k)
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
