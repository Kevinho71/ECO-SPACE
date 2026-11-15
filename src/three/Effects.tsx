import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

/**
 * Grado cinematográfico global: bloom (para las luces de estado), grano de
 * película, viñeta y tone mapping ACES.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.3} mipmapBlur />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.12} />
      <Vignette eskil={false} offset={0.28} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
