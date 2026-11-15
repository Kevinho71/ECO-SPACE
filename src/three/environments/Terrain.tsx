import { useMemo } from 'react'
import * as THREE from 'three'
import { fbm } from '../lib/noise'
import { terrainHeight, type TerrainOpts } from '../lib/terrain'

interface TerrainProps extends TerrainOpts {
  size?: number
  segments?: number
  lowColor: string
  midColor: string
  highColor: string
}

/** Terreno procedural desplazado por ruido fractal, con color por altura. */
export function Terrain({
  size = 150,
  segments = 150,
  height = 1.6,
  seed = 1,
  flattenStart = 3,
  flattenEnd = 8,
  lowColor,
  midColor,
  highColor,
}: TerrainProps) {
  const geometry = useMemo(() => {
    const opts = { seed, height, flattenStart, flattenEnd }
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const low = new THREE.Color(lowColor)
    const mid = new THREE.Color(midColor)
    const high = new THREE.Color(highColor)
    const tmp = new THREE.Color()

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const h = terrainHeight(x, y, opts)
      pos.setZ(i, h)

      const n = fbm(x * 0.06 + seed, y * 0.06 + seed, seed * 0.7, 5)
      const t = THREE.MathUtils.clamp((n - 0.32) / 0.55, 0, 1)
      tmp.copy(low).lerp(mid, t)
      if (n > 0.62) tmp.lerp(high, THREE.MathUtils.clamp((n - 0.62) / 0.3, 0, 1))
      colors[i * 3] = tmp.r
      colors[i * 3 + 1] = tmp.g
      colors[i * 3 + 2] = tmp.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [size, segments, height, seed, flattenStart, flattenEnd, lowColor, midColor, highColor])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.96} metalness={0.04} />
    </mesh>
  )
}

interface RocksProps extends TerrainOpts {
  count?: number
  color?: string
  minScale?: number
  maxScale?: number
}

/** Rocas dispersas deterministas, apoyadas sobre la superficie del terreno. */
export function Rocks({
  count = 16,
  seed = 1,
  height = 1.6,
  flattenStart = 3,
  flattenEnd = 8,
  color = '#77777c',
  minScale = 0.15,
  maxScale = 1.1,
}: RocksProps) {
  const rocks = useMemo(() => {
    const opts = { seed, height, flattenStart, flattenEnd }
    const arr: {
      position: [number, number, number]
      scale: number
      rotation: [number, number, number]
    }[] = []
    let s = (seed * 2654435761) % 2147483647
    const rand = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const r = 8 + rand() * 42
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const scale = minScale + rand() * (maxScale - minScale)
      const y = terrainHeight(x, z, opts) + scale * 0.35
      arr.push({
        position: [x, y, z],
        scale,
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      })
    }
    return arr
  }, [count, seed, height, flattenStart, flattenEnd, minScale, maxScale])

  return (
    <>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.position} scale={r.scale} rotation={r.rotation} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0.05} flatShading />
        </mesh>
      ))}
    </>
  )
}
