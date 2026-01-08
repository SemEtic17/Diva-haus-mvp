import { useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/mannequin_cloth_ready.glb');

// Helper component to safely load textures only when a URL is present.
function ApplyTexture({ clonedScene, product }) {
  // This hook is now only called when product.image is guaranteed to exist.
  const texture = useTexture(product.image);

  useEffect(() => {
    // FIX 3: Ensure correct color space for PBR workflow.
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;

    const clothMesh = clonedScene.getObjectByName('Body_Cloth');
    if (clothMesh && clothMesh.material) {
      // FIX 2: Force double-sided rendering to fix the white back.
      clothMesh.material.side = THREE.DoubleSide;
      
      // FIX 1: Do not replace material, only update its map property.
      clothMesh.material.map = texture;
      clothMesh.material.needsUpdate = true;
      
      // REQUIRED DEBUG OUTPUT:
      console.log('✅ TEXTURE APPLIED:', texture.image?.src);
    }
  }, [clonedScene, texture]);

  // This component does not render any visible elements itself.
  return null;
}

export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // --- One-time model setup ---
  useEffect(() => {
    if (clonedScene.userData.isSetup) return;

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
        // When no texture is applied, default to a neutral grey.
        if (child.name === 'Body_Cloth' && child.material) {
          child.material.map = null;
          child.material.color.set('grey');
        }
      }
    });
    clonedScene.userData.isSetup = true;
  }, [clonedScene, targetHeight]);

  return (
    <primitive object={clonedScene} {...props}>
      {/* FIX 4: Safely load texture only when product.image exists. */}
      {product?.image && <ApplyTexture clonedScene={clonedScene} product={product} />}
    </primitive>
  );
}
