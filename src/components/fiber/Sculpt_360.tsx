import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGLTF, useScroll, useTexture } from '@react-three/drei'
import { BufferGeometry, Material, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCustomization } from '@/contexts/Customization'

interface ModelProps {
  [name: string]: unknown
}

interface GLTFTypes {
  nodes: { [name: string]: NodesProps }
  materials: { [name: string]: Material }
}

interface NodesProps {
  material?: Material
  geometry?: BufferGeometry
  position?: number[] | Vector3
}

export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const FLOOR_HEIGHT = 1
export const NB_FLOORS = 5

export function Model360(props: ModelProps) {
  const { nodes, materials } = useGLTF('/models/sculpt_360.glb') as GLTFTypes
  const { legs } = useCustomization()
  const wholeRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750)

  // Charge la texture 360° de l'image
  const texture = useTexture('/img/puresky.webp')
  const sphereRef = useRef<THREE.Mesh>(null) // Référence à la sphère

  useFrame(() => {
    if (tl.current) {
      tl.current.seek(scroll.offset * tl.current.duration())
    }
  })

  // Ajoute une rotation lente sur l'axe Y
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += -0.001 // Ajustez cette valeur pour la vitesse
    }
  })

  useLayoutEffect(() => {
    tl.current = gsap.timeline()
    if (wholeRef.current) {
      tl.current.to(
        wholeRef.current.rotation,
        {
          duration: 2,
          x: 0,
          z: 0,
          y: 2 * -FLOOR_HEIGHT * (NB_FLOORS - 1),
        },
        0
      )
    }
  }, [])

  // Update the position based on screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 750)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>


      <group
        {...props}
        dispose={null}
        ref={wholeRef}
        rotation={[0, degreesToRadians(-50), 0]}
        position={isMobile ? [0, 1, -5] : [4, 1, -5]}
      >

        {/* Ajoute la sphère pour l'image 360° */}
        <mesh ref={sphereRef} scale={[5, 5, 5]}>
          <sphereGeometry args={[100, 64, 64]} />
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
        {/* Sculpt  */}
        <mesh geometry={nodes.moi_IM.geometry} material={nodes.moi_IM.material} visible={legs === 1} />
        <mesh geometry={nodes.Cylinder.geometry} material={materials['Material.001']} scale={55.254} visible={legs === 2} />
      </group>
    </>
  )
}

useGLTF.preload('/models/sculpt_360.glb')
