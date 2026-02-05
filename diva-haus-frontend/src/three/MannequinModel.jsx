import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/mannequin_cloth_ready.glb');

// --- Classifier Keywords ---
const CLOTH_MATERIAL_KEYWORDS = ['cloth', 'dress', 'fabric', 'body_cloth', 'garment', 'outfit', 'clothe'];
const CLOTH_MESH_KEYWORDS = ['cloth', 'dress', 'garment', 'top', 'skirt', 'pants', 'jacket', 'shirt'];
const SKIN_MATERIAL_KEYWORDS = ['std_skin_head', 'std_skin_body', 'std_skin_arm', 'std_skin_leg', 'skin'];
const EYE_NAIL_MATERIAL_KEYWORDS = ['std_eyelash', 'std_eye', 'eye', 'teeth', 'tongue', 'nail'];

export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (clonedScene.userData.isSetup) return;

    console.clear();
    console.log('%c--- SMART CLASSIFIER ANALYSIS ---', 'color: yellow; font-weight: bold; font-size: 14px;');

    // 2) Compute full model bounding box once
    const modelBox = new THREE.Box3().setFromObject(clonedScene);
    const modelSize = modelBox.getSize(new THREE.Vector3());
    console.log('MODEL GLOBAL BOUNDS:', { min: modelBox.min, max: modelBox.max, size: modelSize });
    console.log('-------------------------------------------');

    const classifiedMeshes = {
      CLOTH: [],
      SKIN: [],
      EYE_NAIL: [],
      OTHER: [],
    };

    // 3) For each mesh...
    clonedScene.traverse((mesh) => {
      if (!mesh.isMesh) return;

      const originalMaterial = mesh.material;

      const meshBox = new THREE.Box3().setFromObject(mesh);
      const meshSize = meshBox.getSize(new THREE.Vector3());
      const meshCenter = meshBox.getCenter(new THREE.Vector3());
      const meshAreaScore = meshSize.x * meshSize.z;
      const normalizedY = modelSize.y > 0 ? (meshCenter.y - modelBox.min.y) / modelSize.y : 0;

      let classification = 'OTHER';
      let reason = 'fallback';

      const lowerMatName = originalMaterial.name.toLowerCase();
      const lowerMeshName = mesh.name.toLowerCase();

      // 4) Classification logic
      // A) Material name check
      if (CLOTH_MATERIAL_KEYWORDS.some(kw => lowerMatName.includes(kw))) {
        classification = 'CLOTH';
        reason = `material name match ('${originalMaterial.name}')`;
      }
      // B) Mesh name check
      else if (CLOTH_MESH_KEYWORDS.some(kw => lowerMeshName.includes(kw))) {
        classification = 'CLOTH';
        reason = `mesh name match ('${mesh.name}')`;
      }
      // C) Heuristic bounding-box
      else if (normalizedY >= 0.25 && normalizedY <= 0.7 && meshAreaScore >= 0.05 * (modelSize.x * modelSize.z)) {
        classification = 'CLOTH';
        reason = `bbox torso heuristic (y: ${normalizedY.toFixed(2)}, area: ${meshAreaScore.toFixed(4)})`;
      }
      // D) Skin material check
      else if (SKIN_MATERIAL_KEYWORDS.some(kw => lowerMatName.includes(kw))) {
        classification = 'SKIN';
        reason = `material name skin ('${originalMaterial.name}')`;
      }
      // E) Eye/nail material check
      else if (EYE_NAIL_MATERIAL_KEYWORDS.some(kw => lowerMatName.includes(kw))) {
        classification = 'EYE_NAIL';
        reason = `eye/nail material ('${originalMaterial.name}')`;
      }
      
      classifiedMeshes[classification].push({ name: mesh.name, reason });
      
      // 5) For every mesh
      mesh.material = originalMaterial.clone();
      mesh.material.map = null;
      mesh.material.side = THREE.DoubleSide;
      mesh.material.transparent = false;
      mesh.material.depthWrite = true;
      mesh.material.depthTest = true;

      switch (classification) {
        case 'CLOTH':
          mesh.material.color.set('#ff0000'); // red
          break;
        case 'SKIN':
          mesh.material.color.set('#00ff00'); // green
          break;
        case 'EYE_NAIL':
          mesh.material.color.set('#0000ff'); // blue
          if (lowerMatName.includes('nail')) {
            mesh.material.color.set('#ffff00'); // yellow for nails
          }
          break;
        case 'OTHER':
        default:
          mesh.material.color.set('#cccccc'); // neutral grey
          break;
      }
      mesh.material.needsUpdate = true;
      
      // 6) Logging
      console.log(`%c[Mesh] ${mesh.name}`, 'color: cyan; font-weight: bold;');
      console.log(`  - Classification: ${classification} (Reason: ${reason})`);
      console.log(`  - IDs: mesh=${mesh.uuid}, geom=${mesh.geometry.uuid}`);
      console.log(`  - Bounds: size=${JSON.stringify(meshSize)}, center=${JSON.stringify(meshCenter)}`);
      console.log(`  - Heuristics: normalizedY=${normalizedY.toFixed(3)}, meshAreaScore=${meshAreaScore.toFixed(4)} (threshold=${(0.05 * (modelSize.x * modelSize.z)).toFixed(4)})`);
      console.log(`  - Material: name='${originalMaterial.name}', uuid=${originalMaterial.uuid}`);
      console.log(`  - Cloned Mat UUID: ${mesh.material.uuid}`);
      console.log('---');
    });
    
    // 7) Final Summary Log
    console.log('%c--- CLASSIFICATION SUMMARY ---', 'color: lime; font-weight: bold; font-size: 14px;');
    console.log('CLOTH:', classifiedMeshes.CLOTH);
    console.log('SKIN:', classifiedMeshes.SKIN);
    console.log('EYE_NAIL:', classifiedMeshes.EYE_NAIL);
    console.log('OTHER:', classifiedMeshes.OTHER);
    console.log('%c------------------------------------', 'color: yellow; font-weight: bold;');

    // 8) Keep scaling/centering logic
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