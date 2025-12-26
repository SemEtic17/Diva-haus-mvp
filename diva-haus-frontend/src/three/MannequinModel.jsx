// src/three/MannequinModel.jsx
import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';
import TorsoGarment from './TorsoGarment';

const MannequinModel = ({ product, position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/mannequin_female.glb', true);

  useEffect(() => {
    if (!scene) return;

    console.log("🧍 Mannequin GLTF Loaded:", scene);

   console.log("📌 Searching for torso mesh groups:");
scene.traverse((child) => {
  if (child.isMesh) {
    console.log(`🧊 Mesh found: "${child.name}"`, child);
  }
});


    // 📏 Auto scale to target height
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);

    // 🔁 Recenter on ground
    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    // 💡 Shadows + preserve existing material (don't override!)
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material && !child.material.map) {
        child.material.skinning = true;
      }
    });

  }, [scene, targetHeight]);

  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

      {/* 🎯 Debug coordinate reference */}
      <axesHelper args={[0.4]} />

      {/* 👕 If NO product selected, show placeholders */}
      {!product?.image && (
        <>
          <GarmentPlaceholder
            position={[0, 1.25, 0.02]}
            size={[0.6, 0.7, 0.5]}
            label="Torso"
          />
          <GarmentPlaceholder
            position={[0, 0.7, 0]}
            size={[0.55, 0.8, 0.55]}
            label="Legs"
            color="#40E0D0"
          />
        </>
      )}

      {/* 👗 If product selected, show clothing */}
      {product?.image && (
        <TorsoGarment
          imageUrl={product.image}
          attachTo={scene.getObjectByName("Object_2") || null} // will update when we know bone name
          offset={[0, 0.12, 0.12]}
          scale={[1.2, 1.2, 1]}
           mannequin={scene}
    target="Object_2"
        />
      )}
    </group>
  );
};

export default MannequinModel;
