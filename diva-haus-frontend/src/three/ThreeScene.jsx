import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import MannequinModel from './MannequinModel';
import WireframeGrid from './WireframeGrid';

const ThreeScene = ({ product }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.6, 3], fov: 50 }}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      {/* 💡 Essential: Add HDR environment lighting for PBR materials to look correct */}
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <MannequinModel product={product} />
      </Suspense>

      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
  enablePan={true}
  minDistance={0.5}
  maxDistance={10}
  target={[0, 0.9, 0]}

      />

      <WireframeGrid />
    </Canvas>
  );
};

export default ThreeScene;