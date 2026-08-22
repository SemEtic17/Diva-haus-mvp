import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Mannequin from './Mannequin';
import FloatingEdgeBags from './FloatingEdgeBags';

/**
 * MainScene — the persistent, fixed full-screen R3F Canvas.
 * Mounted once at the App root, stays mounted across all routes. The wrapper is
 * pointer-events-none so page content stays fully interactive; bag clicks are
 * handled by the DOM hotspot overlay (BagHotspots) that tracks bag positions.
 */
export default function MainScene() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ background: 'transparent' }}
    >
      <Canvas
        dpr={[1, 1.1]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ position: [0, 1, 3.4], fov: 42 }}
      >
        {/* Lighting rig — streamlined for performance */}
        <ambientLight intensity={0.4} />
        <hemisphereLight args={['#ffffff', '#0b0b0b', 0.3]} />
        <spotLight
          position={[4, 5, 3]}
          angle={0.35}
          penumbra={1}
          intensity={2.0}
          color="#E5C158"
        />
        <pointLight position={[-4, 2, -2]} intensity={0.7} color="#7C5CFF" />

        <Suspense fallback={null}>
          <Mannequin />
          <FloatingEdgeBags />
        </Suspense>
      </Canvas>
    </div>
  );
}
