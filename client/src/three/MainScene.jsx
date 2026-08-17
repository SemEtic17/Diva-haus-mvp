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
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 1, 3.4], fov: 42 }}
      >
        {/* Lighting rig */}
        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#ffffff', '#0b0b0b', 0.4]} />

        {/* Gold key light (rim) */}
        <spotLight
          position={[4, 5, 3]}
          angle={0.35}
          penumbra={1}
          intensity={2.4}
          color="#E5C158"
        />
        {/* Rim / fill accents */}
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#7C5CFF" />
        <pointLight position={[3, -1, 3]} intensity={0.5} color="#00d9ff" />
        <pointLight position={[0, 3, -4]} intensity={0.6} color="#E5C158" />

        <Suspense fallback={null}>
          <Mannequin />
          <FloatingEdgeBags />
        </Suspense>
      </Canvas>
    </div>
  );
}
