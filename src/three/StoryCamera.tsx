import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { storyRuntime } from '../story/runtime'
import { getStory } from '../story/StoryDirector'
import { sampleStep } from '../data/story'
import { flightShot } from './environments/flightPath'
import { placeHeight, surfaceDef } from './environments/places'

const POV_FOV = 62
const WIDE_FOV = 40
const PART_FOV = 38
const MAX_YAW = (75 * Math.PI) / 180
const MAX_PITCH = (35 * Math.PI) / 180
const BASE_PITCH = -0.2
const EAGLE = surfaceDef('eagle')

/**
 * Cámara de la historia.
 *  - 'pov': se pega al "ojo" del robot (mástil/Pancam) y hereda su movimiento (inclinación del terreno, balanceo
 *    de las ruedas); el usuario puede mirar alrededor arrastrando, con límites, sin trasladarse.
 *  - 'wide': vista exterior suave que orbita al robot.
 *  - 'part': primer plano orbitando una pieza del robot (demostración del capítulo 1).
 *  - 'flight': cámara cinematográfica del viaje (lanzamiento, crucero, entrada, descenso y rebotes).
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
  const partTarget = useMemo(() => new THREE.Vector3(), [])
  const partNode = useRef<THREE.Object3D | null>(null)
  const partName = useRef('')
  const sway = useRef(0)
  const partAz = useRef(0)

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

  const setFov = (cam: THREE.PerspectiveCamera, target: number, rate: number, dt: number) => {
    const f = THREE.MathUtils.lerp(cam.fov, target, 1 - Math.exp(-dt * rate))
    if (Math.abs(f - cam.fov) > 0.01) {
      cam.fov = f
      cam.updateProjectionMatrix()
    }
  }

  useFrame((state, dt) => {
    if (cameraMode !== 'guided') return
    const cam = camera as THREE.PerspectiveCamera
    const s = useAppStore.getState()
    const view = s.storyView
    const reduce = s.reduceEffects
    const gait = reduce ? 0.3 : 1

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
        // Mirada del usuario (relativa a la cámara de la historia) + panorámica automática.
        // Arrastrar mueve "el mundo" con el dedo: derecha → giro a la izquierda; abajo → mira arriba.
        // Base: mirada ligeramente hacia abajo para que se vea parte de la cubierta del rover.
        euler.set(BASE_PITCH + storyRuntime.lookPitch, storyRuntime.lookYaw + storyRuntime.pan, 0)
        look.setFromEuler(euler)
        q.multiply(look)
        // Balanceo de la suspensión mientras rueda: sube y baja con la distancia recorrida, y se inclina un poco.
        const sp = storyRuntime.speed
        if (sp > 0.03 || storyRuntime.slip > 0.1) {
          const ph = storyRuntime.robotX * 6.3
          const amp = Math.min(1, sp / 0.35 + storyRuntime.slip) * gait
          pos.y += Math.sin(ph) * 0.014 * amp + Math.sin(ph * 2.3 + 1) * 0.006 * amp
          euler.set(Math.sin(ph * 1.6) * 0.004 * amp, 0, Math.sin(ph * 0.5) * 0.009 * amp)
          q.multiply(look.setFromEuler(euler))
        }
        // Vibración de pantalla (aterrizaje)
        if (storyRuntime.shake > 0.01) {
          const sh = storyRuntime.shake * 0.05
          pos.x += (Math.random() - 0.5) * sh
          pos.y += (Math.random() - 0.5) * sh
        }
        const k = 1 - Math.exp(-dt * 14)
        camera.position.lerp(pos, k)
        camera.quaternion.slerp(q, k)
      }
      setFov(cam, POV_FOV + Math.min(5, storyRuntime.speed * 6) * gait, 4, dt)
    } else if (view === 'part') {
      // Primer plano orbitando una pieza del robot.
      const ch = getStory(s.selectedMissionId)?.chapters[storyRuntime.chapter]
      const focus = ch ? sampleStep(ch.partFocus, storyRuntime.t, null) : null
      // Segundos desde que empezó esta pieza (el giro orbital parte de cero en cada una).
      let since = 0
      for (const k of ch?.partFocus ?? []) if (k.t <= storyRuntime.t) since = storyRuntime.t - k.t
      if (focus) {
        if (partName.current !== focus.node || !partNode.current?.parent) {
          partNode.current = scene.getObjectByName(focus.node) ?? null
          partName.current = focus.node
        }
        partNode.current?.getWorldPosition(partTarget)
        partAz.current = focus.az + since * 0.09
        const ce = Math.cos(focus.el)
        pos.set(Math.cos(partAz.current) * ce, Math.sin(focus.el), Math.sin(partAz.current) * ce).multiplyScalar(focus.dist).add(partTarget)
        m4.lookAt(pos, partTarget, camera.up)
        wideQuat.setFromRotationMatrix(m4)
        const k = 1 - Math.exp(-dt * 2.6)
        camera.position.lerp(pos, k)
        camera.quaternion.slerp(wideQuat, k)
      }
      setFov(cam, PART_FOV, 3, dt)
    } else if (view === 'flight') {
      const gh = (x: number) => placeHeight(EAGLE, x, 0) - storyRuntime.groundY
      const shot = flightShot(s.storyPlace, storyRuntime.t, gh)
      pos.copy(shot.pos)
      if (storyRuntime.shake > 0.01) {
        const sh = storyRuntime.shake * 0.35
        pos.x += (Math.random() - 0.5) * sh
        pos.y += (Math.random() - 0.5) * sh
      }
      m4.lookAt(pos, shot.look, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      // Directa (sin retardo): los cortes entre escenas ocurren con los párpados cerrados.
      camera.position.copy(pos)
      camera.quaternion.copy(wideQuat)
      if (Math.abs(cam.fov - shot.fov) > 0.01) {
        cam.fov = shot.fov
        cam.updateProjectionMatrix()
      }
    } else {
      // Vista exterior: órbita lenta alrededor del rover.
      sway.current += dt * 0.04
      const a = 0.9 + Math.sin(sway.current) * 0.35
      const r = 7.5
      pos.set(Math.cos(a) * r, 2.3, Math.sin(a) * r)
      m4.lookAt(pos, wideTarget, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      const k = 1 - Math.exp(-dt * 2.2)
      camera.position.lerp(pos, k)
      camera.quaternion.slerp(wideQuat, k)
      setFov(cam, WIDE_FOV, 3, dt)
    }
    void state
  })

  return null
}
