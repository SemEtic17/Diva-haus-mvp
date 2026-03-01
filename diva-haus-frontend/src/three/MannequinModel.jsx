import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/mannequin_cloth_ready.glb');

function ApplyTexture({ clonedScene, clothNames = [], imageUrl }) {
  // note: useTexture caches and is safe to use here
  const texture = useTexture(imageUrl);

  useEffect(() => {
    if (!texture || !clonedScene) return;
    // PBR-safe texture settings
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;

    const appliedMeshNames = [];

    clonedScene.traverse((m) => {
      if (!m.isMesh) return;
      // Only apply to the meshes we classified as cloth
      if (clothNames.includes(m.name)) {
        // Use a cloned material instance so we don't mutate the GLTF cache
        m.material = m.material ? m.material.clone() : new THREE.MeshStandardMaterial();
        // Ensure texture shows as-is: white base color
        if (m.material.color) m.material.color.set('white');
        m.material.map = texture;
        m.material.side = THREE.DoubleSide;
        m.material.needsUpdate = true;
        appliedMeshNames.push(m.name);
      }
    });

    // console.log('%c[ApplyTexture] applied texture to cloth meshes:', 'color: lime; font-weight:bold', appliedMeshNames);
    // console.log('%c[ApplyTexture] texture.src (if available):', 'color: cyan', texture.image?.src || imageUrl);

    // No disposal of `texture` here because useTexture caches the object.
  }, [clonedScene, texture, clothNames, imageUrl]);

  return null;
}

export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const clothNamesRef = useRef([]);

  useEffect(() => {
    if (clonedScene.userData.isSetup) return;

    // console.clear();
    // console.log('%c--- MannequinModel: initial analysis ---', 'color: yellow; font-weight:bold');

    // Build model bounds (used by heuristics)
    const modelBox = new THREE.Box3().setFromObject(clonedScene);
    const modelSize = modelBox.getSize(new THREE.Vector3());

    // classifier heuristics (same approach you were using)
    const CLOTH_MATERIAL_KEYWORDS = ['cloth', 'dress', 'fabric', 'body_cloth', 'garment', 'outfit', 'clothe'];
    const CLOTH_MESH_KEYWORDS = ['cloth', 'dress', 'garment', 'top', 'skirt', 'pants', 'jacket', 'shirt'];

    const classified = {
      CLOTH: [],
      SKIN: [],
      EYE_NAIL: [],
      OTHER: []
    };

    clonedScene.traverse((mesh) => {
      if (!mesh.isMesh) return;

      const mat = mesh.material || {};
      const lowerMat = (mat.name || '').toLowerCase();
      const lowerMesh = (mesh.name || '').toLowerCase();

      // bounding-based heuristics
      const meshBox = new THREE.Box3().setFromObject(mesh);
      const meshSize = meshBox.getSize(new THREE.Vector3());
      const meshCenter = meshBox.getCenter(new THREE.Vector3());
      const meshAreaScore = meshSize.x * meshSize.z;
      const normalizedY = modelSize.y > 0 ? (meshCenter.y - modelBox.min.y) / modelSize.y : 0;

      let classification = 'OTHER';
      // material name hints
      if (CLOTH_MATERIAL_KEYWORDS.some(k => lowerMat.includes(k)) || CLOTH_MESH_KEYWORDS.some(k => lowerMesh.includes(k))) {
        classification = 'CLOTH';
      } else if (lowerMat.includes('skin') || lowerMat.includes('std_skin')) {
        classification = 'SKIN';
      } else if (lowerMat.includes('eye') || lowerMat.includes('nail') || lowerMat.includes('teeth') || lowerMat.includes('tongue')) {
        classification = 'EYE_NAIL';
      } else if (normalizedY >= 0.25 && normalizedY <= 0.7 && meshAreaScore >= 0.05 * (modelSize.x * modelSize.z)) {
        // likely torso cloth piece
        classification = 'CLOTH';
      }

      classified[classification].push(mesh.name);

      // Ensure a unique material instance per mesh so future ops are safe
      if (mesh.material) mesh.material = mesh.material.clone();

      // Make sure cloth/backfaces render
      mesh.material.side = THREE.DoubleSide;
      mesh.material.needsUpdate = true;
    });

    // store cloth names for runtime use
    clothNamesRef.current = Array.from(new Set(classified.CLOTH));
    // console.log('%c--- Classification result ---', 'color: lime; font-weight:bold');
    // console.log('CLOTH meshes:', clothNamesRef.current);
    // console.log('SKIN meshes:', classified.SKIN);
    // console.log('EYE_NAIL meshes:', classified.EYE_NAIL);
    // console.log('OTHER meshes:', classified.OTHER);
    // console.log('%c------------------------------------', 'color: yellow');

    // Standard scale/center logic
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetHeight / size.y;
    clonedScene.scale.set(scale, scale, scale);

    const postScaleBox = new THREE.Box3().setFromObject(clonedScene);
    const center = postScaleBox.getCenter(new THREE.Vector3());
    clonedScene.position.x -= center.x;
    clonedScene.position.y -= postScaleBox.min.y;
    clonedScene.position.z -= center.z;

    // shadows
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    clonedScene.userData.isSetup = true;
  }, [clonedScene, scene, targetHeight]);

  return (
    <primitive object={clonedScene} {...props}>
      {/* Only render the ApplyTexture helper when product.image exists */}
      {product?.image && (
        <ApplyTexture clonedScene={clonedScene} clothNames={clothNamesRef.current} imageUrl={product.image} />
      )}
    </primitive>
  );
}