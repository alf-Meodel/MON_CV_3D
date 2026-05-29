"use client";

import React from 'react'
import { MeshReflectorMaterial, ScrollControls } from '@react-three/drei'
import { Overlay } from './Overlay'
// import { Model360 } from './Sculpt_360'
import { LightModel } from './Draco_sculpt_light'

const Experience = () => {
    return (
        <>
            {/* <OrbitControls /> */}
            <directionalLight
                position={[-7.5, 1, -1]}

                intensity={2} />
            <ambientLight intensity={1.2} />

            <ScrollControls pages={11} damping={0.25}>
                {/* <Model360 /> */}
                <LightModel />


                <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-2}>
                    <planeGeometry args={[170, 170]} />
                    <MeshReflectorMaterial
                        blur={[150, 50]}
                        resolution={1024}
                        mixBlur={0.6}
                        mixStrength={25}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#134345"
                        metalness={0.5}
                        mirror={0.35}

                    />
                </mesh>

                <Overlay />
            </ScrollControls>

        </>
    )
}

export default Experience
