import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
    <group ref={group} position={position}>
      <primitive object={scene} />
    </group>
  );
};

export default MannequinModel;

// Optional preload for smoother UX
// useGLTF.preload('/models/mannequin_female.glb');
