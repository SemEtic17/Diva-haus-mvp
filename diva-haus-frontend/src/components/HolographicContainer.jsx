import React from 'react';
import ThreeScene from '../three/ThreeScene';
import HoloPedestal from '../three/HoloPedestal';
import MannequinModel from '../three/MannequinModel';
import GlassCube from '../three/GlassCube';
import WireframeGrid from '../three/WireframeGrid';

const HolographicContainer = ({ children, product, comingSoon = true }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl">
      {/* Conditionally render the new Coming Soon Overlay */}
      {comingSoon && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-4"
             style={{ pointerEvents: 'none' }}> {/* IMPORTANT: Do not block orbit controls */}
          <h2 className="text-4xl font-bold mb-2">Coming Soon</h2>
          <p className="text-xl mb-4">3D Clothing Preview</p>
          <p className="text-center max-w-md">
            We are finalizing our advanced 3D clothing preview experience.
            Soon, you'll be able to see products in stunning detail on our virtual mannequin.
          </p>
        </div>
      )}

      {/* The 3D scene should still render underneath */}
      <ThreeScene>
        <HoloPedestal position={[0, 0, 0]} />
        {/* Use product ID as key to ensure component remounts on product change */}
        <MannequinModel key={product?._id} product={product} position={[0, 0.05, 0]} />
        {/* Restored holographic effects */}
        <GlassCube size={2.8} />
        <WireframeGrid position={[0, 0, 0]} />
      </ThreeScene>
      
      {/* FIX 5: Remove pointer events from overlay to allow 3D interaction. */}
      <div
        className="absolute inset-0 z-10 p-4 w-full h-full flex items-center justify-center text-center"
        style={{ pointerEvents: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default HolographicContainer;