"use client"
import Configurator from "@/components/fiber/Configurator";
import Experience from "@/components/fiber/Experience";
import { CustomizationProvider } from "@/contexts/Customization";
import { Canvas } from "@react-three/fiber";
// import * as THREE from 'three'

export default function Home() {
  return (
    <div className="flex justify-center items-center bg-gradient-to-r h-screen w-full  from-white to-teal-700" >

      <CustomizationProvider>

        <Canvas
        // onCreated={(state) => {
        //   state.scene.fog = new THREE.FogExp2("#ffffffc7", 0.02);
        // }}
        >
          <Experience />
        </Canvas>
        <Configurator />
      </CustomizationProvider>


    </div>
  );
}
