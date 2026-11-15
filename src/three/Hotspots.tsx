import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HOTSPOTS } from '../data/hotspots'
import { useAppStore } from '../store/useAppStore'

/** Puntos brillantes anclados a las partes del robot (solo en modo libre). Al pulsar, abre el Inspector Técnico. */
export function Hotspots({ missionId }: { missionId: string }) {
  const list = HOTSPOTS[missionId]
  const active = useAppStore((s) => s.activeHotspotId)
  const select = useAppStore((s) => s.selectHotspot)
  const { scene } = useThree()
  if (!list) return null

  return (
    <>
      {list.map((h) => (
        <Anchor key={h.id} node={h.node} offset={h.offset} scene={scene}>
          <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
            <button
              aria-label={h.title}
              onClick={() => select(active === h.id ? null : h.id)}
              className={`group relative grid h-6 w-6 place-items-center rounded-full border border-cyan-200/80 bg-cyan-300/25 backdrop-blur transition ${
                active === h.id ? 'scale-125 bg-cyan-300/60' : 'hover:scale-110'
              }`}
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/40" />
              <span className="h-2 w-2 rounded-full bg-cyan-100" />
            </button>
          </Html>
        </Anchor>
      ))}
    </>
  )
}

function Anchor({
  node,
  offset = [0, 0, 0],
  scene,
  children,
}: {
  node: string
  offset?: [number, number, number]
  scene: THREE.Scene
  children: React.ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const target = useRef<THREE.Object3D | null>(null)
  const v = useRef(new THREE.Vector3())
  useFrame(() => {
    if (!target.current || !target.current.parent) target.current = scene.getObjectByName(node) ?? null
    if (target.current && ref.current) {
      target.current.getWorldPosition(v.current)
      ref.current.position.copy(v.current).add(new THREE.Vector3(...offset))
    }
  })
  return <group ref={ref}>{children}</group>
}
