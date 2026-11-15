import * as THREE from 'three'
import { fbm } from './noise'

// Texturas procedurales de planetas generadas en canvas (sin descargas externas).

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  return { canvas, ctx: canvas.getContext('2d')! }
}

function finish(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Planeta rocoso (Mercurio, Luna, Marte): color base + variación por ruido + cráteres. */
export function makeRockyTexture(
  base: string,
  dark: string,
  light: string,
  seed: number,
  crater = true,
): THREE.CanvasTexture {
  const w = 256
  const h = 128
  const { canvas, ctx } = makeCanvas(w, h)
  const img = ctx.createImageData(w, h)
  const b = new THREE.Color(base)
  const d = new THREE.Color(dark)
  const l = new THREE.Color(light)
  const t = new THREE.Color()

  for (let y = 0; y < h; y++) {
    const phi = (y / h) * Math.PI
    for (let x = 0; x < w; x++) {
      const theta = (x / w) * Math.PI * 2
      const nx = Math.sin(phi) * Math.cos(theta)
      const ny = Math.sin(phi) * Math.sin(theta)
      const nz = Math.cos(phi)
      const n = fbm(nx * 3 + seed, ny * 3, nz * 3, 4)
      t.copy(b).lerp(n > 0.5 ? l : d, Math.abs(n - 0.5) * 2)
      if (crater) {
        const c = fbm(nx * 9 + seed * 7, ny * 9, nz * 9, 3)
        if (c > 0.6) t.multiplyScalar(0.65)
      }
      const i = (y * w + x) * 4
      img.data[i] = Math.min(255, t.r * 255)
      img.data[i + 1] = Math.min(255, t.g * 255)
      img.data[i + 2] = Math.min(255, t.b * 255)
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return finish(canvas)
}

/** Tierra: océanos, continentes (por umbral de ruido) y casquetes polares. */
export function makeEarthTexture(seed: number): THREE.CanvasTexture {
  const w = 256
  const h = 128
  const { canvas, ctx } = makeCanvas(w, h)
  const img = ctx.createImageData(w, h)
  const ocean = new THREE.Color('#1a4d8f')
  const land = new THREE.Color('#3f7d3a')
  const sand = new THREE.Color('#c2b06a')
  const ice = new THREE.Color('#eef2f5')
  const t = new THREE.Color()

  for (let y = 0; y < h; y++) {
    const phi = (y / h) * Math.PI
    for (let x = 0; x < w; x++) {
      const theta = (x / w) * Math.PI * 2
      const nx = Math.sin(phi) * Math.cos(theta)
      const ny = Math.sin(phi) * Math.sin(theta)
      const nz = Math.cos(phi)
      const c = fbm(nx * 3 + seed, ny * 3, nz * 3, 4)
      t.copy(ocean)
      if (c > 0.55) t.copy(sand)
      if (c > 0.62) t.copy(land)
      if (Math.abs(nz) > 0.86) t.copy(ice)
      const i = (y * w + x) * 4
      img.data[i] = t.r * 255
      img.data[i + 1] = t.g * 255
      img.data[i + 2] = t.b * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return finish(canvas)
}

/** Gigante gaseoso (Júpiter, Saturno, Urano, Neptuno): bandas horizontales con turbulencia. */
export function makeGasTexture(colors: string[], seed: number): THREE.CanvasTexture {
  const w = 256
  const h = 128
  const { canvas, ctx } = makeCanvas(w, h)
  const img = ctx.createImageData(w, h)
  const cols = colors.map((c) => new THREE.Color(c))
  const white = new THREE.Color('#ffffff')
  const t = new THREE.Color()

  for (let y = 0; y < h; y++) {
    const v = y / h
    const warp = fbm(0, v * 6 + seed, seed, 3) * 0.15
    const band = Math.sin((v + warp) * Math.PI * 7 + seed) * 0.5 + 0.5
    const tt = band * (cols.length - 1)
    const i0 = Math.floor(tt)
    const i1 = Math.min(cols.length - 1, i0 + 1)
    const base = new THREE.Color().copy(cols[i0]).lerp(cols[i1], tt - i0)
    for (let x = 0; x < w; x++) {
      const u = x / w
      const turb = fbm(u * 6 + seed * 3, v * 6, seed, 3)
      t.copy(base).lerp(white, (turb - 0.5) * 0.25)
      const i = (y * w + x) * 4
      img.data[i] = t.r * 255
      img.data[i + 1] = t.g * 255
      img.data[i + 2] = t.b * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return finish(canvas)
}
