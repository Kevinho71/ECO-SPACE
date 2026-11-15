import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { storyRuntime } from '../story/runtime'

const POV_FOV = 62
const WIDE_FOV = 40
const MAX_YAW = (75 * Math.PI) / 180
const MAX_PITCH = (35 * Math.PI) / 180
const BASE_PITCH = -0.2

/**
 * Cámara de la historia.
 *  - 'pov': se pega al "ojo" del robot (mástil/Pancam) y hereda su movimiento; el usuario puede mirar
 *    alrededor arrastrando (ratón o dedo), con límites, sin trasladarse (regla de PLAN.md §6).
 *  - 'wide': vista exterior suave para el cierre.
 * Solo actúa en modo 'guided'; en 'free' manda OrbitControls.
 */
export function StoryCamera() {
  const { camera, scene, gl } = useThree()
  const cameraMode = useAppStore((s) => s.cameraMode)
  const head = useRef<THREE.Object3D | null>(null)
  const eye = useRef<THREE.Object3D | null>(null)
  const pos = useMemo(() => new THREE.Vector3(), [])
  const fwd = useMemo(() => new THREE.Vector3(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const look = useMemo(() => new THREE.Quaternion(), [])
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), [])
  // La cabeza mira hacia +X local; la cámara mira hacia -Z local.
  const fix = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)), [])
  const m4 = useMemo(() => new THREE.Matrix4(), [])
  const wideTarget = useMemo(() => new THREE.Vector3(0, 0.85, 0), [])
  const wideQuat = useMemo(() => new THREE.Quaternion(), [])
  const sway = useRef(0)

  // Mirar alrededor arrastrando sobre el lienzo.
  useEffect(() => {
    const el = gl.domElement
    let dragging = false
    let lx = 0
    let ly = 0
    const down = (e: PointerEvent) => {
      if (useAppStore.getState().cameraMode !== 'guided') return
      dragging = true
      lx = e.clientX
      ly = e.clientY
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      storyRuntime.lookYaw = THREE.MathUtils.clamp(storyRuntime.lookYaw + dx * 0.004, -MAX_YAW, MAX_YAW)
      storyRuntime.lookPitch = THREE.MathUtils.clamp(storyRuntime.lookPitch + dy * 0.003, -MAX_PITCH, MAX_PITCH)
    }
    const up = () => (dragging = false)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useFrame((state, dt) => {
    if (cameraMode !== 'guided') return
    const cam = camera as THREE.PerspectiveCamera
    const view = useAppStore.getState().storyView

    if (view === 'pov') {
      if (!head.current || !head.current.parent) head.current = scene.getObjectByName('mast_head') ?? null
      if (!eye.current || !eye.current.parent) eye.current = scene.getObjectByName('pov_eye') ?? null
      if (head.current && eye.current) {
        head.current.getWorldQuaternion(q)
        q.multiply(fix)
        // Posición: el "ojo", un poco por delante de los ojos de la cara.
        eye.current.getWorldPosition(pos)
        fwd.set(0, 0, -1).applyQuaternion(q)
        pos.addScaledVector(fwd, 0.1)
        // Mirada del usuario (relativa a la cámara de la historia)
        // Arrastrar mueve "el mundo" con el dedo: derecha → giro a la izquierda; abajo → mira arriba.
        // Base: mirada ligeramente hacia abajo para que se vea parte de la cubierta del rover.
        euler.set(BASE_PITCH + storyRuntime.lookPitch, storyRuntime.lookYaw, 0)
        look.setFromEuler(euler)
        q.multiply(look)
        // Vibración de pantalla (aterrizaje)
        if (storyRuntime.shake > 0.01) {
          const s = storyRuntime.shake * 0.05
          pos.x += (Math.random() - 0.5) * s
          pos.y += (Math.random() - 0.5) * s
        }
        const k = 1 - Math.exp(-dt * 14)
        camera.position.lerp(pos, k)
        camera.quaternion.slerp(q, k)
      }
      const f = THREE.MathUtils.lerp(cam.fov, POV_FOV, 1 - Math.exp(-dt * 4))
      if (Math.abs(f - cam.fov) > 0.01) {
        cam.fov = f
        cam.updateProjectionMatrix()
      }
    } else {
      // Vista exterior: órbita lenta alrededor del rover en reposo.
      sway.current += dt * 0.04
      const a = 0.9 + Math.sin(sway.current) * 0.35
      const r = 7.5
      pos.set(Math.cos(a) * r, 2.3, Math.sin(a) * r)
      m4.lookAt(pos, wideTarget, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      const k = 1 - Math.exp(-dt * 2.2)
      camera.position.lerp(pos, k)
      camera.quaternion.slerp(wideQuat, k)
      const f = THREE.MathUtils.lerp(cam.fov, WIDE_FOV, 1 - Math.exp(-dt * 3))
      if (Math.abs(f - cam.fov) > 0.01) {
        cam.fov = f
        cam.updateProjectionMatrix()
      }
    }
    void state
  })

  return null
}
