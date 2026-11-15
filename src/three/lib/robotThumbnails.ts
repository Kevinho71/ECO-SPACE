import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ---------------------------------------------------------------------------
// Miniaturas de los robots para el catálogo, generadas en el navegador a partir
// de los mismos GLB que se ven en 3D (así la imagen siempre coincide con el diseño).
//
// - Un único renderizador fuera de pantalla, creado al pedir la primera miniatura
//   y liberado (contexto WebGL incluido) en cuanto no quedan miniaturas pendientes.
// - Cada GLB se renderiza una sola vez por sesión: el resultado (data URL PNG) queda en caché.
// - La cámara mira al robot desde el mismo ángulo 3/4 que `blender/render_previews.py`.
// ---------------------------------------------------------------------------

const WIDTH = 480
const HEIGHT = 360
const FOV = 32
/** Mismo decodificador Draco que usa `useGLTF` de drei por defecto. */
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
/** Dirección de la cámara (glTF, Y arriba): equivale a (0.95, -1, 0.55) en Blender. */
const VIEW_DIR = new THREE.Vector3(0.95, 0.55, 1.0).normalize()

const cache = new Map<string, Promise<string>>()

let renderer: THREE.WebGLRenderer | null = null
let loader: GLTFLoader | null = null
let draco: DRACOLoader | null = null
let pending = 0
let releaseTimer: ReturnType<typeof setTimeout> | null = null

function acquire() {
  if (releaseTimer) {
    clearTimeout(releaseTimer)
    releaseTimer = null
  }
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(1)
    renderer.setSize(WIDTH, HEIGHT, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
  }
  if (!loader) {
    draco = new DRACOLoader()
    draco.setDecoderPath(DRACO_DECODER_PATH)
    loader = new GLTFLoader()
    loader.setDRACOLoader(draco)
  }
  return { renderer, loader }
}

/** Libera el contexto WebGL y los workers de Draco poco después de la última miniatura. */
function scheduleRelease() {
  if (pending > 0) return
  releaseTimer = setTimeout(() => {
    renderer?.dispose()
    renderer?.forceContextLoss()
    renderer = null
    draco?.dispose()
    draco = null
    loader = null
    releaseTimer = null
  }, 1500)
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry?.dispose()
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const m of mats) {
      if (!m) continue
      for (const value of Object.values(m)) {
        if (value instanceof THREE.Texture) value.dispose()
      }
      m.dispose()
    }
  })
}

async function render(path: string): Promise<string> {
  const { renderer: r, loader: l } = acquire()
  const gltf = await l.loadAsync(path)
  const model = gltf.scene

  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a2a20, 1.4))
  const key = new THREE.DirectionalLight(0xfff2dd, 2.6)
  key.position.set(4, 6, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x9fc4ff, 1.2)
  rim.position.set(-5, 3, -4)
  scene.add(rim)
  scene.add(model)

  // Encuadre: esfera envolvente del modelo vista desde la dirección 3/4.
  model.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(model)
  const sphere = box.getBoundingSphere(new THREE.Sphere())
  const camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, 0.01, 1000)
  const dist = (sphere.radius / Math.sin(THREE.MathUtils.degToRad(FOV) / 2)) * 0.92
  camera.position.copy(sphere.center).addScaledVector(VIEW_DIR, dist)
  camera.lookAt(sphere.center)
  camera.near = Math.max(0.01, dist - sphere.radius * 2)
  camera.far = dist + sphere.radius * 2
  camera.updateProjectionMatrix()

  r.render(scene, camera)
  const url = r.domElement.toDataURL('image/png')
  disposeObject(model)
  return url
}

/** Devuelve (y cachea) la miniatura PNG de un robot a partir de su GLB. */
export function getRobotThumbnail(path: string): Promise<string> {
  const hit = cache.get(path)
  if (hit) return hit
  pending++
  const job = render(path).finally(() => {
    pending--
    scheduleRelease()
  })
  cache.set(path, job)
  job.catch(() => cache.delete(path)) // si falla, se reintentará la próxima vez
  return job
}
