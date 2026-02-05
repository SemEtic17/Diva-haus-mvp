import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/mannequin_cloth_ready.glb');

// Helper to generate a random bright color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  // Simplified to generate brighter colors
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 6) + 10]; // Use brighter half
  }
  // Ensure it's a 6-digit hex
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
};


export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (clonedScene.userData.isSetup) return;

    console.log('%c--- MODEL DIAGNOSTICS INITIATED ---', 'color: yellow; font-weight: bold;');

    const materialColorMap = new Map();
    const materialSharingMap = new Map();
    const meshes = [];

    // 1. Traverse the scene to analyze and color meshes
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        meshes.push(node);

        // Ensure we have a unique material instance per mesh for individual coloring
        const originalMaterial = node.material;
        node.material = originalMaterial.clone();

        // Track material sharing based on the ORIGINAL material's UUID
        if (!materialSharingMap.has(originalMaterial.uuid)) {
          materialSharingMap.set(originalMaterial.uuid, []);
        }
        materialSharingMap.get(originalMaterial.uuid).push(node.name);

        // Assign a consistent color based on the ORIGINAL material's UUID
        if (!materialColorMap.has(originalMaterial.uuid)) {
          const newColor = new THREE.Color(getRandomColor());
          materialColorMap.set(originalMaterial.uuid, newColor);
        }
        
        const assignedColor = materialColorMap.get(originalMaterial.uuid);
        node.material.color = assignedColor;
        node.material.map = null; // Ensure no texture is used
        node.material.needsUpdate = true;
      }
    });

    console.log('%c--- MESH & MATERIAL DETAILS ---', 'color: cyan;');
    meshes.forEach((mesh, index) => {
      const originalMaterialUUID = mesh.material.uuid; // In this new logic, this is the CLONED uuid
      
      // Find the original UUID by looking at which group this mesh belongs to
      let foundOriginalUUID;
      for (const [uuid, meshNames] of materialSharingMap.entries()) {
          if (meshNames.includes(mesh.name)) {
              foundOriginalUUID = uuid;
              break;
          }
      }

      console.log(`%c[Mesh ${index + 1}/${meshes.length}]`, 'color: white; font-style: italic;');
      console.log(`  - mesh.name:`, mesh.name);
      console.log(`  - mesh.uuid:`, mesh.uuid);
      console.log(`  - geometry.uuid:`, mesh.geometry.uuid);
      console.log(`  - material.uuid (Cloned):`, mesh.material.uuid);
      console.log(`  - material.name:`, mesh.material.name);
      console.log(`  - material.uuid (Original):`, foundOriginalUUID);
      const color = mesh.material.color;
      console.log(`  - material.color (RGB):`, { r: color.r, g: color.g, b: color.b });
      console.log(`  - material.color (HEX):`, `#${color.getHexString()}`);
      
      const hasUVs = mesh.geometry.attributes.uv ? 'Yes' : 'No';
      console.log(`  - geometry has UVs:`, hasUVs);
      
      const isShared = materialSharingMap.get(foundOriginalUUID).length > 1;
      console.log(`  - material is shared:`, isShared ? `Yes (with ${materialSharingMap.get(foundOriginalUUID).length - 1} other mesh(es))` : 'No');
    });

    // 2. Final Summary
    console.log('%c--- FINAL SUMMARY ---', 'color: lime; font-weight: bold;');
    console.log(`- Total meshes found: ${meshes.length}`);
    console.log(`- Total unique materials found: ${materialColorMap.size}`);
    
    console.log('- Material Sharing Details:');
    for (const [uuid, meshNames] of materialSharingMap.entries()) {
      if (meshNames.length > 1) {
        console.log(`  - Material UUID ${uuid} is shared by:`);
        meshNames.forEach(name => console.log(`    - ${name}`));
      } else {
        console.log(`  - Material UUID ${uuid} is used by: ${meshNames[0]}`);
      }
    }
    console.log('%c------------------------------------', 'color: yellow; font-weight: bold;');


    // --- Original setup logic for scaling and positioning ---
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetHeight / size.y;
    clonedScene.scale.set(scale, scale, scale);

    const postScaleBox = new THREE.Box3().setFromObject(clonedScene);
    const center = postScaleBox.getCenter(new THREE.Vector3());
    clonedScene.position.x -= center.x;
    clonedScene.position.y -= postScaleBox.min.y;
    clonedScene.position.z -= center.z;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    clonedScene.userData.isSetup = true;

  }, [clonedScene, scene, targetHeight]);

  return (
    <primitive object={clonedScene} {...props} />
  );
}