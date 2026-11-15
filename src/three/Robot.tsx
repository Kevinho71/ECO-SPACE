import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Carga el GLB de una misión y da una señal de "vida": pulsa la luz de estado
 * (nodo `status_light`, material emisivo) para demostrar la conexión
 * nodos-con-nombre <-> Three.js.
 */
export function Robot({ path }: { path: string }) {
  const { scene } = useGLTF(path)

  const status = useMemo(() => {
    const o = scene.getObjectByName('status_light')
    return (o as THREE.Mesh | undefined) ?? null
  }, [scene])

  // Activar sombras (proyección y recepción) en todas las mallas del modelo.
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (status) {
      const mat = status.material as THREE.MeshStandardMaterial | undefined
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5))
      }
    }
  })

  return <primitive object={scene} />
}
