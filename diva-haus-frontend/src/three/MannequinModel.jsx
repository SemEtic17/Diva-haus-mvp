import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({ position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/mannequin_female.glb');

  useEffect(() => {
    if (!scene) return;

    // Compute bounding box
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());

    // Scale to human height
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);

    // Recompute bbox after scaling
    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());

    // Center model and place feet on ground
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    // Enable shadows
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, targetHeight]);

  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

      {/* Garment placeholders */}
      <GarmentPlaceholder
        position={[0, 1.25, 0.05]}
        size={[0.5, 0.6, 0.5]}
        label="Torso"
      />
      <GarmentPlaceholder
        position={[0, 0.7, 0]}
        size={[0.55, 0.8, 0.55]}
        label="Legs"
        color="#40E0D0"
      />
    </group>
  );
};

export default MannequinModel;

// Optional preload for smoother UX
// useGLTF.preload('/models/mannequin_female.glb');
