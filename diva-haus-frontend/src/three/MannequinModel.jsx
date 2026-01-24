import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/mannequin_cloth_ready.glb');

export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');

  // useMemo with just [scene] is correct. A new clone is created when the
  // component remounts due to its `key` prop changing.
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // --- One-time model setup effect ---
  useEffect(() => {
    // This guard prevents re-running setup on the same clone instance.
    if (clonedScene.userData.isSetup) return;

    console.log('--- A. ON MODEL LOAD ---');
    console.log('Full scene object:', scene);
    console.log('scene.children:', scene.children);
    const meshNames = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshNames.push(child.name);
      }
    });
    console.log('scene.traverse mesh names:', meshNames);
    console.log('------------------------');

    // Auto-scaling and centering logic
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetHeight / size.y;
    clonedScene.scale.set(scale, scale, scale);

    const postScaleBox = new THREE.Box3().setFromObject(clonedScene);
    const center = postScaleBox.getCenter(new THREE.Vector3());
    clonedScene.position.x -= center.x;
    clonedScene.position.y -= postScaleBox.min.y; // Place on the ground
    clonedScene.position.z -= center.z;
    
    console.log('--- C. BOUNDING INFO ---');
    console.log('Box3 size:', size);
    console.log('Box3 center:', center);
    console.log('------------------------');

    // Set up shadows and default material states.
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        console.log('--- B. PER MESH ---');
        console.log('name:', child.name);
        console.log('uuid:', child.uuid);
        console.log('geometry.uuid:', child.geometry.uuid);
        console.log('isSkinnedMesh:', child.isSkinnedMesh);
        console.log('geometry.attributes:', child.geometry.attributes);

        // Ensure we have a unique material instance
        child.material = child.material.clone();
        
        if (child.name === 'Body_Cloth') {
            child.material.color.set('#ff0000'); // Pure red
        } else {
            child.material.color.set('#0000ff'); // Pure blue
        }

        child.material.side = THREE.DoubleSide;
        child.material.map = null; // Ensure no texture map is used
        child.material.needsUpdate = true;
        
        console.log('material type:', child.material.type);
        console.log('material.uuid:', child.material.uuid);
        console.log('material.side:', child.material.side);
        console.log('material.map:', child.material.map);
        console.log('material.color (RGB):', child.material.color);
        console.log('material.color (HEX):', `#${child.material.color.getHexString()}`);
        console.log('material.metalness:', child.material.metalness);
        console.log('material.roughness:', child.material.roughness);
        console.log('--------------------');
      }
    });

    // Mark this clone as configured.
    clonedScene.userData.isSetup = true;

}, [clonedScene, scene, targetHeight]); // Dependencies are correct.

  return (
    <primitive object={clonedScene} {...props}>
      {/* All texture application logic has been removed */}
    </primitive>
  );
}
