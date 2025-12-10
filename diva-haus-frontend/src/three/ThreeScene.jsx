import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";

// A lightweight, reusable Canvas wrapper.
// children should be procedural objects (HoloPedestal, GlassCube, etc.)
// use frameloop="demand" for static scenes if you prefer one-off renders.
export default function ThreeScene({ children, className = "", cameraProps = { position: [0, 2, 6], fov: 50 } }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: 300 }}>
      <Canvas shadows camera={cameraProps} gl={{ antialias: true, toneMappingExposure: 1 }}>
        {/* Environment for subtle lighting - small sRGB HDRI from drei */}
        <ambientLight intensity={0.4} />
        <directionalLight castShadow position={[10, 10, 5]} intensity={0.8} />
        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <Environment preset="city" />
          {children}
        </Suspense>
        {/* Controls: disable rotate on mobile pinch? Keep basic orbit */}
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  );
}
