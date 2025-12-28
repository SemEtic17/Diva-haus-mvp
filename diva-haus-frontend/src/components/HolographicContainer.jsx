import React, { useRef, useState, useLayoutEffect } from 'react';
import * as THREE from 'three';
import ThreeScene from '../three/ThreeScene';
import HoloPedestal from '../three/HoloPedestal';
import GlassCube from '../three/GlassCube';
import WireframeGrid from '../three/WireframeGrid';
import MannequinModel from '../three/MannequinModel';

const HolographicContainer = ({ children, product }) => {
  const pedestalRef = useRef();
  const [pedestalTopY, setPedestalTopY] = useState(null);

  useLayoutEffect(() => {
    if (pedestalRef.current) {
      const timeoutId = setTimeout(() => {
        const box = new THREE.Box3().setFromObject(pedestalRef.current);
        const height = box.getSize(new THREE.Vector3()).y;
        console.log("📏 Pedestal Height:", height);
        setPedestalTopY(box.max.y);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl">
      <ThreeScene className="pointer-events-none">
        <HoloPedestal ref={pedestalRef} position={[0, -0.7, 0]} />

        {pedestalTopY !== null && (
          <MannequinModel product={product} pedestalTopY={pedestalTopY} />
        )}
        
        <GlassCube size={1.5} />
        <WireframeGrid position={[0, -1, 0]} color="#222222" />
      </ThreeScene>
      
      <div className="relative z-10 p-4 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default HolographicContainer;