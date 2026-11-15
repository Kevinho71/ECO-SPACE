import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Etiqueta HTML anclada a un punto 3D cuyo tamaño de letra se adapta a la distancia
 * de la cámara: crece al acercarse y se reduce al alejarse, pero siempre dentro de
 * [min, max] para que nunca quede ilegible ni gigantesca (a diferencia de
 * `distanceFactor`, que escala sin límites).
 *
 * `refDistance` es la distancia a la que la etiqueta se ve a su tamaño normal (escala 1).
 */
export function ScaledHtml({
  position = [0, 0, 0],
  refDistance,
  min = 0.75,
  max = 1.7,
  children,
}: {
  position?: [number, number, number]
  refDistance: number
  min?: number
  max?: number
  children: React.ReactNode
}) {
  const anchor = useRef<THREE.Group>(null)
  const box = useRef<HTMLDivElement>(null)
  const camera = useThree((s) => s.camera)
  const world = useMemo(() => new THREE.Vector3(), [])
  const last = useRef(-1)

  useFrame(() => {
    if (!anchor.current || !box.current) return
    anchor.current.getWorldPosition(world)
    const d = camera.position.distanceTo(world)
    const s = THREE.MathUtils.clamp(refDistance / Math.max(d, 1e-3), min, max)
    // Solo toca el DOM cuando el cambio es perceptible.
    if (Math.abs(s - last.current) > 0.01) {
      last.current = s
      box.current.style.transform = `scale(${s.toFixed(3)})`
    }
  })

  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={box} style={{ transformOrigin: 'center center', willChange: 'transform' }}>
          {children}
        </div>
      </Html>
    </group>
  )
}
