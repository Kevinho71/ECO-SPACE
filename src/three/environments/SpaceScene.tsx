import { Environment, Lightformer, Sparkles } from '@react-three/drei'

/** Espacio profundo: vacío, estrellas, polvo estelar y una luz solar lejana. */
export function SpaceScene() {
  return (
    <>
      <color attach="background" args={['#04050a']} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[10, 6, 8]} intensity={2.5} color="#ffffff" castShadow />

      <Sparkles count={220} scale={[30, 30, 30]} size={1.6} speed={0.2} opacity={0.5} color="#9ab0ff" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 8, -10]} scale={[30, 30, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.6} position={[-10, -2, 6]} rotation-y={Math.PI / 2} scale={[20, 5, 1]} color="#4455aa" />
      </Environment>
    </>
  )
}
