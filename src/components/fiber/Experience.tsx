import React from 'react'
import { MeshReflectorMaterial, ScrollControls } from '@react-three/drei'
import { Overlay } from './Overlay'
import { Model360 } from './Sculpt_360'

const Experience = () => {
    return (
        <>
            {/* <OrbitControls /> */}
            <directionalLight
                position={[-7.5, 1, -1]}

                intensity={2} />
            <ambientLight intensity={2} />

            <ScrollControls pages={7} damping={0.25}>
                <Model360 />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-2}>
                    <planeGeometry args={[170, 170]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={40}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#134345"
                        metalness={0.5}
                        mirror={0.5}

                    />
                </mesh>

                <Overlay />
            </ScrollControls>

        </>
    )
}

export default Experience
