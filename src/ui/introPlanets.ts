import * as THREE from 'three'
import { fbm } from '../three/lib/noise'
import { getSolarTextures } from '../three/lib/solarTextures'

/**
 * Planetas realistas para la intro 2D: esferas con los mismos mapas NASA del sistema solar,
 * iluminadas y con atmósfera, renderizadas en un WebGL fuera de pantalla y dibujadas en el canvas.
 */

const SIZE = 768
const EXT = 1.15 // semilado de la vista ortográfica (la esfera mide 1)

export interface PlanetSprites {
  /** true cuando ambos mapas NASA ya están cargados. */
  ready(): boolean
  /** Dibuja el planeta centrado en (cx, cy) con radio R px. Devuelve false si aún no hay textura. */
  draw(ctx: CanvasRenderingContext2D, kind: 'earth' | 'mars', cx: number, cy: number, R: number, spin: number): boolean
  dispose(): void
}

function atmosphere(color: THREE.ColorRepresentation, strength: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } },
    vertexShader: `varying vec3 vN;
      void main() {
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying vec3 vN;
      void main() {
        float d = clamp(-vN.z, 0.0, 1.0);
        float a = clamp(pow(d, 1.5) * uStrength, 0.0, 1.0);
        gl_FragColor = vec4(uColor, a);
      }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  })
}

/** Nubes procedurales (mismo ruido que el resto de texturas del proyecto). */
function makeClouds(): THREE.CanvasTexture {
  const w = 256
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)
  for (let y = 0; y < h; y++) {
    const phi = (y / h) * Math.PI
    for (let x = 0; x < w; x++) {
      const theta = (x / w) * Math.PI * 2
      const n = fbm(Math.sin(phi) * Math.cos(theta) * 4 + 9, Math.sin(phi) * Math.sin(theta) * 4, Math.cos(phi) * 4, 5)
      const k = Math.min(1, Math.max(0, (n - 0.5) / 0.22))
      const i = (y * w + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255
      img.data[i + 3] = k * k * 215
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

interface Body {
  scene: THREE.Scene
  mesh: THREE.Mesh
  clouds?: THREE.Mesh
  tex: THREE.Texture
}

export function createPlanetSprites(): PlanetSprites | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  } catch {
    return null // sin WebGL: la intro usa su dibujo 2D de reserva
  }
  renderer.setPixelRatio(1)
  renderer.setSize(SIZE, SIZE, false)
  renderer.setClearColor(0x000000, 0)

  const camera = new THREE.OrthographicCamera(-EXT, EXT, EXT, -EXT, 0.1, 10)
  camera.position.z = 5

  const disposables: { dispose(): void }[] = []
  const sphere = new THREE.SphereGeometry(1, 96, 64)
  disposables.push(sphere)

  const build = (map: THREE.Texture, tilt: number, glow: THREE.ColorRepresentation, glowStrength: number, withClouds: boolean): Body => {
    const scene = new THREE.Scene()
    const sun = new THREE.DirectionalLight(0xfff3e0, Math.PI * 1.15)
    sun.position.set(-3, 1.2, 2.6)
    scene.add(sun, new THREE.AmbientLight(0x6a7a99, 0.5))

    const group = new THREE.Group()
    group.rotation.z = tilt
    scene.add(group)

    const mat = new THREE.MeshLambertMaterial({ map })
    const mesh = new THREE.Mesh(sphere, mat)
    group.add(mesh)
    disposables.push(mat)

    let clouds: THREE.Mesh | undefined
    if (withClouds) {
      const ctex = makeClouds()
      const cmat = new THREE.MeshLambertMaterial({ map: ctex, transparent: true, depthWrite: false })
      clouds = new THREE.Mesh(sphere, cmat)
      clouds.scale.setScalar(1.012)
      group.add(clouds)
      disposables.push(ctex, cmat)
    }

    const amat = atmosphere(glow, glowStrength)
    const shell = new THREE.Mesh(sphere, amat)
    shell.scale.setScalar(1.12)
    scene.add(shell)
    disposables.push(amat)

    return { scene, mesh, clouds, tex: map }
  }

  // Mismos mapas NASA (y misma caché) que el mapa del sistema solar. Esas texturas se comparten con
  // el renderer principal, así que aquí NO se liberan.
  const tex = getSolarTextures()
  const earth = build(tex.earth, 0.41, 0x5aa6ff, 2.6, true)
  const mars = build(tex.mars, 0.44, 0xf2a070, 1.3, false)

  return {
    ready: () => !!earth.tex.image && !!mars.tex.image,
    draw(ctx, kind, cx, cy, R, spin) {
      const b = kind === 'earth' ? earth : mars
      if (!b.tex.image) return false
      b.mesh.rotation.y = spin
      if (b.clouds) b.clouds.rotation.y = spin * 1.12
      renderer.render(b.scene, camera)
      const half = R * EXT
      ctx.drawImage(renderer.domElement, cx - half, cy - half, half * 2, half * 2)
      return true
    },
    dispose() {
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
