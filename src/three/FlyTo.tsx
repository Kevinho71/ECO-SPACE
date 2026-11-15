import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ControlsLike {
  target: THREE.Vector3
  enabled: boolean
  update: () => void
}

/**
 * Anima la cámara (y el objetivo de OrbitControls) hacia un punto, con easing.
 * Desactiva los controles durante el vuelo y los reactiva al terminar.
 *
 * Con `follow`, el destino se recalcula en cada fotograma a partir de la posición
 * del objeto: así la cámara llega al planeta aunque siga moviéndose en su órbita.
 */
export function FlyTo({
  target,
  follow,
  approachDistance = 1.2,
  duration = 1.6,
  onNearEnd,
  onArrive,
}: {
  target?: THREE.Vector3
  follow?: THREE.Object3D | null
  approachDistance?: number
  duration?: number
  /** Se llama una vez al ~70 % del vuelo: ideal para empezar el fundido y que el corte quede oculto. */
  onNearEnd?: () => void
  onArrive?: () => void
}) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const state = useRef<{ start: number; cam: THREE.Vector3; tgt: THREE.Vector3; dir: THREE.Vector3 } | null>(null)
  const done = useRef(false)
  const nearFired = useRef(false)
  const dest = useMemo(() => new THREE.Vector3(), [])
  const live = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (controls) controls.enabled = false
    return () => {
      if (controls) controls.enabled = true
    }
  }, [controls])

  useFrame(({ clock }) => {
    if (done.current) return

    if (follow) follow.getWorldPosition(live)
    else if (target) live.copy(target)

    if (!state.current) {
      const dir = new THREE.Vector3().subVectors(camera.position, live).normalize()
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1)
      state.current = {
        start: clock.elapsedTime,
        cam: camera.position.clone(),
        tgt: controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0),
        dir,
      }
    }

    const { start, cam, tgt, dir } = state.current
    dest.copy(live).addScaledVector(dir, approachDistance)
    const t = Math.min(1, (clock.elapsedTime - start) / duration)
    const e = 1 - Math.pow(1 - t, 3) // easeOutCubic

    camera.position.lerpVectors(cam, dest, e)
    if (controls) {
      controls.target.lerpVectors(tgt, live, e)
      controls.update()
    } else {
      camera.lookAt(live)
    }

    if (t >= 0.7 && !nearFired.current) {
      nearFired.current = true
      onNearEnd?.()
    }
    if (t >= 1) {
      done.current = true
      onArrive?.()
    }
  })

  return null
}
