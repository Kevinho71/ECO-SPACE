import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

// El Sol usa una imagen REAL del Solar Dynamics Observatory (NASA/SDO): luz visible (HMI)
// combinada con la estructura magnética de AIA 193 (ver blender/prep_sun.py).
// Es un disco que siempre mira a la cámara (en una esfera luminosa el efecto es idéntico
// desde cualquier ángulo) con una esfera negra detrás para ocultar lo que pase por detrás,
// y una corona con resplandor.

/** El disco ocupa este radio (fracción del ancho) dentro de sun.jpg. */
const DISC_FRACTION = 0.468

function makeCoronaTexture(): THREE.CanvasTexture {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  // El borde del disco queda en ~0.40 del radio de la textura (plano = 2.5x el diámetro del disco).
  // Transparente dentro del disco; la corona nace en el limbo (0.40) y se desvanece hacia fuera.
  g.addColorStop(0, 'rgba(255,170,80,0)')
  g.addColorStop(0.36, 'rgba(255,170,80,0)')
  g.addColorStop(0.4, 'rgba(255,165,70,0.55)')
  g.addColorStop(0.5, 'rgba(255,125,35,0.24)')
  g.addColorStop(0.7, 'rgba(255,95,25,0.07)')
  g.addColorStop(1, 'rgba(255,90,20,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function SunBody({ radius = 1.4, position = [0, 0, 0] as [number, number, number] }) {
  // Carga directa (suspende hasta estar lista): así nunca se queda sin textura.
  const sun = useTexture('/textures/sun.jpg')
  sun.colorSpace = THREE.SRGBColorSpace
  sun.anisotropy = 8
  const corona = useMemo(makeCoronaTexture, [])
  const billboard = useRef<THREE.Group>(null)
  const coronaMesh = useRef<THREE.Mesh>(null)
  const bright = useMemo(() => new THREE.Color().setScalar(1.15), [])

  useFrame(({ camera, clock }) => {
    billboard.current?.quaternion.copy(camera.quaternion)
    if (coronaMesh.current) coronaMesh.current.scale.setScalar(1 + 0.03 * Math.sin(clock.elapsedTime * 1.3))
  })

  const discSize = radius / DISC_FRACTION // ancho del plano para que el disco mida `radius`
  const coronaSize = radius * 5          // el borde del disco queda en 0.4 del radio de la corona

  return (
    <group position={position}>
      {/* Oculta lo que quede detrás del Sol */}
      <mesh>
        <sphereGeometry args={[radius * 0.995, 32, 32]} />
        <meshBasicMaterial color="#7a2f0a" />
      </mesh>
      <group ref={billboard}>
        <mesh ref={coronaMesh} position={[0, 0, radius * 0.9]} renderOrder={1}>
          <planeGeometry args={[coronaSize, coronaSize]} />
          <meshBasicMaterial map={corona} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} fog={false} />
        </mesh>
        <mesh position={[0, 0, radius * 1.02]} renderOrder={2}>
          <planeGeometry args={[discSize, discSize]} />
          <meshBasicMaterial
            map={sun}
            color={bright}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      </group>
    </group>
  )
}
