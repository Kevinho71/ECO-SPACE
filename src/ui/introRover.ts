import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Opportunity real (el mismo GLB del catálogo) para la intro 2D: se renderiza en un WebGL
 * fuera de pantalla con luz solar y reflejos de entorno, y se dibuja sobre el canvas.
 * El polvo se pinta en el shader del propio material: se asienta más en las superficies que miran
 * hacia arriba y el viento lo barre de izquierda a derecha según `front`.
 */

const W = 960
const H = 720
const FOV = 30
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
/** Vista 3/4 un poco elevada: se ven los paneles y el costado del rover. */
const VIEW_DIR = new THREE.Vector3(0.95, 0.38, 1.0).normalize()

export interface RoverSprite {
  ready(): boolean
  failed(): boolean
  /**
   * Dibuja el rover con las ruedas apoyadas en `groundY`, centrado en `cx`, con `height` px de alto de sprite.
   * `front` (≈ -0.25…1.25) es el frente de limpieza; `wake` 0…1 enciende el brillo de los paneles.
   */
  draw(ctx: CanvasRenderingContext2D, cx: number, groundY: number, height: number, front: number, wake: number, time: number, yaw: number): boolean
  dispose(): void
}

const NOISE = `
float h31(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}`

export function createRoverSprite(path: string): RoverSprite | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(1)
  renderer.setSize(W, H, false)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight(0xffe2c8, 0x3a2016, 0.9))
  const key = new THREE.DirectionalLight(0xfff0d8, 3.2) // el sol, a la derecha como en la escena
  key.position.set(4, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffb07a, 1.0)
  rim.position.set(-5, 3, -4)
  scene.add(rim)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.environmentIntensity = 0.45

  const uniforms = {
    uFront: { value: -0.25 },
    uWake: { value: 0 },
    uTime: { value: 0 },
    uRadius: { value: 1 },
  }

  const patched = new Set<THREE.Material>()
  const patch = (m: THREE.Material) => {
    if (patched.has(m) || !(m as THREE.MeshStandardMaterial).isMeshStandardMaterial) return
    patched.add(m)
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vVP;\nvarying vec3 vWN;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvVP = mvPosition.xyz;\nvWN = normalize(mat3(modelMatrix) * objectNormal);')
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vVP; varying vec3 vWN;
uniform float uFront; uniform float uWake; uniform float uTime; uniform float uRadius;
${NOISE}`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
float up = clamp(vWN.y * 0.5 + 0.5, 0.0, 1.0);
float sx = vVP.x / uRadius * 0.5 + 0.5;
float nz = vn(vVP * 7.0) * 0.6 + vn(vVP * 23.0) * 0.4;
float dustMask = smoothstep(uFront - 0.10 + nz * 0.10, uFront + 0.10 + nz * 0.10, sx);
float dustAmt = clamp(dustMask * mix(0.5, 1.0, pow(up, 0.7)) * (0.72 + 0.28 * nz) * 0.96, 0.0, 0.96);
vec3 dustCol = vec3(0.40, 0.14, 0.06) * (0.85 + 0.3 * nz);
diffuseColor.rgb = mix(diffuseColor.rgb, dustCol, dustAmt);`,
        )
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 1.0, dustAmt);')
        .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor *= (1.0 - dustAmt);')
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.02, 0.16, 0.2) * uWake * pow(up, 4.0) * (0.55 + 0.45 * sin(uTime * 4.0)) * (1.0 - dustAmt);',
        )
    }
    m.customProgramCacheKey = () => 'introRoverDust'
    m.needsUpdate = true
  }

  const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.01, 1000)
  const pivot = new THREE.Group()
  scene.add(pivot)

  let isReady = false
  let isFailed = false
  let groundV = 0.8
  let disposed = false

  const draco = new DRACOLoader()
  draco.setDecoderPath(DRACO_DECODER_PATH)
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  loader
    .loadAsync(path)
    .then((gltf) => {
      if (disposed) return
      const model = gltf.scene
      model.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (!mesh.isMesh) return
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach(patch)
      })
      // El centro del modelo pasa al origen, para poder girarlo (yaw) sobre sí mismo.
      model.updateMatrixWorld(true)
      const c = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
      model.position.sub(c)
      pivot.add(model)
      pivot.updateMatrixWorld(true)

      const box = new THREE.Box3().setFromObject(pivot)
      const sphere = box.getBoundingSphere(new THREE.Sphere())
      uniforms.uRadius.value = sphere.radius
      const dist = (sphere.radius / Math.sin(THREE.MathUtils.degToRad(FOV) / 2)) * 0.92
      camera.position.copy(sphere.center).addScaledVector(VIEW_DIR, dist)
      camera.lookAt(sphere.center)
      camera.near = Math.max(0.01, dist - sphere.radius * 2)
      camera.far = dist + sphere.radius * 2
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld(true)

      // Dónde cae en el sprite el punto de apoyo (centro de la base) para alinearlo con el suelo.
      const foot = new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y, (box.min.z + box.max.z) / 2).project(camera)
      groundV = (1 - foot.y) / 2
      isReady = true
    })
    .catch(() => {
      isFailed = true
    })

  return {
    ready: () => isReady,
    failed: () => isFailed,
    draw(ctx, cx, groundY, height, front, wake, time, yaw) {
      if (!isReady) return false
      uniforms.uFront.value = front
      uniforms.uWake.value = wake
      uniforms.uTime.value = time
      pivot.rotation.y = yaw
      renderer.render(scene, camera)
      const w = height * (W / H)
      ctx.drawImage(renderer.domElement, cx - w / 2, groundY - groundV * height, w, height)
      return true
    },
    dispose() {
      disposed = true
      pivot.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.geometry?.dispose()
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const m of mats) {
          if (!m) continue
          for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose()
          m.dispose()
        }
      })
      envTex.dispose()
      pmrem.dispose()
      draco.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
