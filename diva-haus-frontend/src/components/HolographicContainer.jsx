import React from 'react';

import ThreeScene from '../three/ThreeScene';
import HoloPedestal from '../three/HoloPedestal';
import GlassCube from '../three/GlassCube';
import WireframeGrid from '../three/WireframeGrid';
import MannequinModel from '../three/MannequinModel';

const HolographicContainer = ({ children, product }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl">
      <ThreeScene className="pointer-events-none">
        {/* The ThreeScene component provides its own lights, camera, and controls. */}
        
        {/* We just need to provide the 3D objects to render. */}
        <HoloPedestal position={[0, -0.7, 0]} />

        {/* Female mannequin placed above the pedestal. */}
        <MannequinModel product={product} position={[0, -0.2, 0]} />
        
        {/* Corrected: GlassCube uses 'size' prop, not 'args'. */}
        <GlassCube size={1.5} />
        
        {/* Corrected: WireframeGrid color is more subtle to reduce visual noise. */}
        <WireframeGrid position={[0, -1, 0]} color="#222222" />
      </ThreeScene>
      
      {/* UI overlays are placed here, outside the Canvas, with pointer events enabled. */}
      <div className="relative z-10 p-4 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default HolographicContainer;