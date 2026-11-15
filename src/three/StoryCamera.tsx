import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { storyRuntime } from '../story/runtime'
import { getStory } from '../story/StoryDirector'
import { sampleLinear, sampleStep, type StoryView, type WideShot } from '../data/story'
import { driveRuntime } from '../story/drive'
import { flightShot } from './environments/flightPath'
import { placeHeight, surfaceDef } from './environments/places'

const POV_FOV = 62
const WIDE_FOV = 40
const PART_FOV = 38
const MAX_YAW = (75 * Math.PI) / 180
const MAX_PITCH = (35 * Math.PI) / 180
const BASE_PITCH = -0.2
const EAGLE = surfaceDef('eagle')
const ORIGIN = new THREE.Vector3()
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const DEFAULT_WIDE_TARGET: [number, number, number] = [0, 0.85, 0]

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
  const levelQ = useMemo(() => new THREE.Quaternion(), [])
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
      if (useAppStore.getState().cameraMode === 'free') return
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
    if (cameraMode === 'free') return
    const cam = camera as THREE.PerspectiveCamera
    const s = useAppStore.getState()
    // El usuario puede forzar 1.ª o 3.ª persona; los primeros planos de piezas y el viaje (cortes de narración) no se tocan.
    let view: StoryView | 'drivecam' = s.storyView
    if (cameraMode === 'drive') {
      // Conducción libre: 3.ª persona detrás del robot, o sus ojos (el rover del modelo no tiene).
      view = s.viewOverride === 'pov' && driveRuntime.cfg?.kind !== 'rover-node' ? 'pov' : 'drivecam'
    } else if (s.viewOverride !== 'auto' && view !== 'part' && view !== 'flight') {
      view = s.viewOverride === 'pov' ? 'pov' : storyRuntime.alt > 0.3 ? 'chase' : 'wide'
    }
    const reduce = s.reduceEffects
    const gait = reduce ? 0.3 : 1

    if (view === 'pov') {
      // La cabeza es el mástil (rovers) o el alimentador de la antena (sondas): el "ojo" cuelga de ella.
      if (!head.current || !head.current.parent)
        head.current =
          scene.getObjectByName('mast_head') ?? scene.getObjectByName('feed_head') ?? scene.getObjectByName('face_plate') ?? scene.getObjectByName('tv_head') ?? null
      if (!eye.current || !eye.current.parent) eye.current = scene.getObjectByName('pov_eye') ?? null
      // Orientación: el mástil (rovers) o, si no hay, el nodo padre del ojo (Ingenuity: su `pov_eye` apunta hacia abajo).
      if (!head.current || !head.current.parent) head.current = scene.getObjectByName('mast_head') ?? eye.current?.parent ?? null
      if (head.current && eye.current) {
        head.current.getWorldQuaternion(q)
        q.multiply(fix)
        // Posición: el "ojo", un poco por delante de los ojos de la cara.
        eye.current.getWorldPosition(pos)
        fwd.set(0, 0, -1).applyQuaternion(q)
        // Los rovers y sondas miran desde su cabeza (0,1 m); en Ingenuity el ojo está más adelante (0,45 m).
        const named = ['mast_head', 'feed_head', 'face_plate', 'tv_head'].includes(head.current?.name ?? '')
        pos.addScaledVector(fwd, named ? 0.1 : 0.45)
        // Horizonte estable (p. ej. una sonda que gira sobre sí misma): mezcla con una orientación sin alabeo.
        const keepRoll = sampleLinear(getStory(s.selectedMissionId)?.chapters[storyRuntime.chapter]?.povRoll, storyRuntime.t, 1)
        if (keepRoll < 0.999) {
          m4.lookAt(ORIGIN, fwd, WORLD_UP)
          levelQ.setFromRotationMatrix(m4)
          q.slerp(levelQ, 1 - keepRoll)
        }
        // Mirada del usuario (relativa a la cámara de la historia) + panorámica automática.
        // Arrastrar mueve "el mundo" con el dedo: derecha → giro a la izquierda; abajo → mira arriba.
        // Base: mirada ligeramente hacia abajo para que se vea parte de la cubierta del rover.
        euler.set(BASE_PITCH + storyRuntime.gaze + storyRuntime.lookPitch, storyRuntime.lookYaw + storyRuntime.pan, 0)
        look.setFromEuler(euler)
        q.multiply(look)
        // Balanceo de la suspensión mientras rueda: sube y baja con la distancia recorrida, y se inclina un poco.
        const sp = storyRuntime.speed
        if ((sp > 0.03 || storyRuntime.slip > 0.1) && storyRuntime.alt < 0.3) {
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
    } else if (view === 'drivecam') {
      const dr = driveRuntime
      if (dr.cfg?.kind === 'rover-node') {
        // Sigue a Sojourner desde detrás y un poco arriba.
        const fx = Math.cos(dr.sa)
        const fz = -Math.sin(dr.sa)
        pos.set(dr.sx - fx * 1.7, dr.sy + 0.85, dr.sz - fz * 1.7)
        wideTarget.set(dr.sx + fx * 0.8, dr.sy + 0.25, dr.sz + fz * 0.8)
      } else {
        // El robot mira siempre a +X (es el mundo el que gira): cámara fija detrás, con un leve giro al virar y altura al volar.
        const alt = storyRuntime.alt
        pos.set(-6.4, 1.9 + alt * 0.85, -dr.steer * 1.4)
        wideTarget.set(1.6, 0.9 + alt * 0.97, dr.steer * 0.6)
      }
      m4.lookAt(pos, wideTarget, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      const k = 1 - Math.exp(-dt * 4)
      camera.position.lerp(pos, k)
      camera.quaternion.slerp(wideQuat, k)
      setFov(cam, dr.cfg?.kind === 'rover-node' ? 55 : 50, 3, dt)
      wideTarget.set(0, 0.85, 0)
    } else if (view === 'chase') {
      // 3.ª persona en vuelo: cámara que acompaña al robot (detrás y arriba) y sube con él.
      sway.current += dt * 0.12
      const alt = storyRuntime.alt
      const a = Math.PI + 0.55 + Math.sin(sway.current) * 0.3
      const r = 6.2 + Math.min(4, alt * 0.18)
      pos.set(Math.cos(a) * r, 1.6 + alt * 0.85 + Math.min(2.5, alt * 0.12), Math.sin(a) * r)
      wideTarget.set(1.5, 0.9 + alt * 0.97, 0)
      m4.lookAt(pos, wideTarget, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      const k = 1 - Math.exp(-dt * 3.2)
      camera.position.lerp(pos, k)
      camera.quaternion.slerp(wideQuat, k)
      setFov(cam, 50, 3, dt)
      wideTarget.set(0, 0.85, 0)
    } else {
      // Vista exterior: órbita lenta alrededor del robot (y a su altura, si vuela). Cada capítulo puede fijarla con `wide`;
      // si no, usa `story.view` (distancia y altura del objetivo) o los valores por defecto.
      const st = getStory(s.selectedMissionId)
      const w = sampleStep<WideShot | null>(st?.chapters[storyRuntime.chapter]?.wide, storyRuntime.t, null)
      const vw = st?.view
      const ay = storyRuntime.alt * 0.9
      const ty = vw?.wideTarget ?? DEFAULT_WIDE_TARGET[1]
      const tg = w?.target ?? [DEFAULT_WIDE_TARGET[0], ty, DEFAULT_WIDE_TARGET[2]]
      wideTarget.set(tg[0], tg[1] + ay, tg[2])
      sway.current += dt * 0.04
      const a = (w?.az ?? 0.9) + Math.sin(sway.current) * (w?.swing ?? 0.35)
      const r = w?.dist ?? vw?.wideDist ?? 7.5
      pos.set(tg[0] + Math.cos(a) * r, w?.height ?? tg[1] + 1.45 * (r / 7.5) + ay, tg[2] + Math.sin(a) * r)
      m4.lookAt(pos, wideTarget, camera.up)
      wideQuat.setFromRotationMatrix(m4)
      const k = 1 - Math.exp(-dt * 2.2)
      camera.position.lerp(pos, k)
      camera.quaternion.slerp(wideQuat, k)
      setFov(cam, w?.fov ?? WIDE_FOV, 3, dt)
    }
    void state
  })

  return null
}
