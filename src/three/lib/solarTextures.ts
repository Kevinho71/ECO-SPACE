import * as THREE from 'three'
import { makeRockyTexture, makeGasTexture } from './planetTextures'

// Texturas del sistema solar. Usan mapas REALES de la NASA (public/textures,
// ver referencias_nasa/ y blender/prep_textures.py); Mercurio y Urano no
// tienen mapa en el repositorio NASA-3D-Resources, así que quedan procedurales.
// Se comparten entre el mapa estelar y el globo planetario.

export interface SolarTextures {
  mercury: THREE.Texture
  venus: THREE.Texture
  earth: THREE.Texture
  moon: THREE.Texture
  mars: THREE.Texture
  jupiter: THREE.Texture
  saturn: THREE.Texture
  uranus: THREE.Texture
  neptune: THREE.Texture
  stars: THREE.Texture
  sun: THREE.Texture
}

let cache: SolarTextures | null = null

function nasa(file: string): THREE.Texture {
  const tex = new THREE.TextureLoader().load(`/textures/${file}.jpg`)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function getSolarTextures(): SolarTextures {
  if (!cache) {
    cache = {
      mercury: makeRockyTexture('#8a8a8f', '#5a5a5f', '#c8c8cc', 11, true),
      venus: nasa('venus'),
      earth: nasa('earth'),
      moon: nasa('moon'),
      mars: nasa('mars'),
      jupiter: nasa('jupiter'),
      saturn: nasa('saturn'),
      uranus: makeGasTexture(['#9ad0d8', '#c0e8e8', '#78b8c8'], 88),
      neptune: nasa('neptune'),
      stars: nasa('stars_hipparcos'),
      sun: nasa('sun'),
    }
  }
  return cache
}
