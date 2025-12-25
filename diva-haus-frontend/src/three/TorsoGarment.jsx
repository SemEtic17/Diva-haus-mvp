import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const TorsoGarment = ({
  imageUrl,
  size = [1.1, 1.4], // bigger so it's visible
  position = [0, 1.35, 0.2], // pushed forward so it's clearly visible
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.flipY = false;

  return (
    <mesh 
      position={position} 
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissiveIntensity={0.4}
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};

export default TorsoGarment;
