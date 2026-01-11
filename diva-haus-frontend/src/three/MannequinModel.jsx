import { useEffect, useMemo } from 'react';
     import { useGLTF, useTexture } from '@react-three/drei';
     import * as THREE from 'three';
     
     useGLTF.preload('/models/mannequin_cloth_ready.glb');
     
     // Helper component to safely load and apply textures.
     function ApplyTexture({ clonedScene, product }) {
       // This hook triggers a re-render once the texture is loaded.
      const texture = useTexture(product.image);
   
      useEffect(() => {
        // This effect runs whenever the texture object or scene clone changes.
        if (!texture) return;
    
        // Standard texture setup for PBR materials in a linear workflow.
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
    
        const clothMesh = clonedScene.getObjectByName('Body_Cloth');
        if (clothMesh && clothMesh.material) {
         // MANDATORY FIXES START
          // 1. Clone material to avoid mutating cached GLTF material and ensure
          //    our properties apply cleanly without side effects.
          clothMesh.material = clothMesh.material.clone();
    
          // 2. Set base color to white to ensure the texture's true colors
          //    are displayed accurately.
          clothMesh.material.color.set('white');
    
          // 3. Set render side to ensure both front and back faces are visible.
          clothMesh.material.side = THREE.DoubleSide;
   
          // 4. Apply the loaded texture map.
          clothMesh.material.map = texture;
    
          // 5. Notify Three.js that the material and texture have been updated.
          clothMesh.material.needsUpdate = true;
          texture.needsUpdate = true; // CRITICAL: Ensure texture update is propagated.
          // MANDATORY FIXES END
    
          console.log('✅ TEXTURE APPLIED:', texture.image?.src);
        }
     }, [clonedScene, texture]); // Effect dependencies are correct.
    
      // This component manages logic and does not render any of its own JSX.
      return null;
    }
    
    export default function MannequinModel({ product, targetHeight = 1.7, ...props }) {
      const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
      // useMemo with just [scene] is correct. A new clone is created when the
      // component remounts due to its `key` prop changing.
      const clonedScene = useMemo(() => scene.clone(), [scene]);
   
      // --- One-time model setup effect ---
      useEffect(() => {
        // This guard prevents re-running setup on the same clone instance.
        if (clonedScene.userData.isSetup) return;
    
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
    
        // Set up shadows and default material states.
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
           child.receiveShadow = true;
            // When no texture is applied, default the cloth to a neutral grey.
            // This is overridden by ApplyTexture when a product is available.
            if (child.name === 'Body_Cloth' && child.material) {
              child.material.map = null;
              child.material.color.set('grey');
            }
          }
        });
    
        // Mark this clone as configured.
       clonedScene.userData.isSetup = true;
    
   }, [clonedScene, targetHeight]); // Dependencies are correct.
 
   return (
     <primitive object={clonedScene} {...props}>
       {/* Conditionally mount the texture applicator only when we have a product image. */}
       {product?.image && <ApplyTexture clonedScene={clonedScene} product={product} />}
     </primitive>
   );
 }