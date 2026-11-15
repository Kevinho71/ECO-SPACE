import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Posiciona la cámara al montar una escena. Se renderiza ANTES de <OrbitControls>
 * para que este herede la posición inicial correcta.
 */
export function SceneCamera({
  position,
  target,
}: {
  position: [number, number, number]
  target: [number, number, number]
}) {
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    camera.position.set(position[0], position[1], position[2])
    camera.lookAt(target[0], target[1], target[2])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  return null
}
