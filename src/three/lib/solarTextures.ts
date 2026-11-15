import * as THREE from 'three'
import { makeRockyTexture, makeEarthTexture, makeGasTexture } from './planetTextures'

// Singleton de texturas del sistema solar (se comparte entre el mapa estelar y
// el globo planetario para no regenerarlas).

export interface SolarTextures {
  mercury: THREE.CanvasTexture
  venus: THREE.CanvasTexture
  earth: THREE.CanvasTexture
  moon: THREE.CanvasTexture
  mars: THREE.CanvasTexture
  jupiter: THREE.CanvasTexture
  saturn: THREE.CanvasTexture
  uranus: THREE.CanvasTexture
  neptune: THREE.CanvasTexture
}

let cache: SolarTextures | null = null

export function getSolarTextures(): SolarTextures {
  if (!cache) {
    cache = {
      mercury: makeRockyTexture('#8a8a8f', '#5a5a5f', '#c8c8cc', 11, true),
      venus: makeRockyTexture('#d8b878', '#a8844a', '#f0d8a0', 22, false),
      earth: makeEarthTexture(33),
      moon: makeRockyTexture('#8a8a8f', '#4a4a4f', '#c8c8cc', 44, true),
      mars: makeRockyTexture('#c05a2a', '#7a3018', '#e0885a', 55, true),
      jupiter: makeGasTexture(['#c8a878', '#e8d0a8', '#a87858', '#c8a878', '#e0c898'], 66),
      saturn: makeGasTexture(['#d8c090', '#e8d8b0', '#b89870', '#d8c090'], 77),
      uranus: makeGasTexture(['#9ad0d8', '#c0e8e8', '#78b8c8'], 88),
      neptune: makeGasTexture(['#5068c8', '#7890e0', '#3850a8'], 99),
    }
  }
  return cache
}
