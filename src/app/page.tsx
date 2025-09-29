"use client"
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { CustomizationProvider } from "@/contexts/Customization";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";

const Experience = dynamic(() => import("@/components/fiber/Experience"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex justify-center items-center bg-gradient-to-r h-screen w-full  from-white to-teal-700">
      <CustomizationProvider>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
          shadows={false}
        >
          <Suspense
            fallback={
              <group>
                {/* Fallback léger pendant le chargement des assets */}
              </group>
            }
          >
            <AdaptiveDpr pixelated />
            <Experience />
            <Preload all />
          </Suspense>
        </Canvas>
      </CustomizationProvider>
    </div>
  );
}
