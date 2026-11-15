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
 */
export function FlyTo({
  target,
  approachDistance = 1.2,
  duration = 1.6,
  onArrive,
}: {
  target: THREE.Vector3
  approachDistance?: number
  duration?: number
  onArrive: () => void
}) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const state = useRef<{ start: number; cam: THREE.Vector3; tgt: THREE.Vector3; dir: THREE.Vector3 } | null>(null)
  const done = useRef(false)
  const dest = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (controls) controls.enabled = false
    return () => {
      if (controls) controls.enabled = true
    }
  }, [controls])

  useFrame(({ clock }) => {
    if (done.current) return

    if (!state.current) {
      const dir = new THREE.Vector3().subVectors(camera.position, target).normalize()
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1)
      state.current = {
        start: clock.elapsedTime,
        cam: camera.position.clone(),
        tgt: controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0),
        dir,
      }
    }

    const { start, cam, tgt, dir } = state.current
    dest.copy(target).addScaledVector(dir, approachDistance)
    const t = Math.min(1, (clock.elapsedTime - start) / duration)
    const e = 1 - Math.pow(1 - t, 3) // easeOutCubic

    camera.position.lerpVectors(cam, dest, e)
    if (controls) {
      controls.target.lerpVectors(tgt, target, e)
      controls.update()
    }

    if (t >= 1) {
      done.current = true
      onArrive()
    }
  })

  return null
}
