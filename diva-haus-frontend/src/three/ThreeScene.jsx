import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreeScene({ children }) {
  return (
    <div className="w-full h-full" style={{ minHeight: 300 }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.4, 3.2], fov: 45 }}
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          antialias: true,
        }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[5, 10, 7.5]}
          intensity={1.0}
        />
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.8}
          maxDistance={6}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  );
}