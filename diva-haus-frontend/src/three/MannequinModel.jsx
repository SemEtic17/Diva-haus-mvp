import { useRef, useEffect } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

// Preload the GLB model for better performance
useGLTF.preload('/models/mannequin_cloth_ready.glb');

const MannequinModel = ({
  product,
  position = [0, 0, 0],
  targetHeight = 1.7,
}) => {
  const group = useRef();
  const { scene, materials } = useGLTF('/models/mannequin_cloth_ready.glb');

  // Use drei's hook for efficient texture loading.
  // It handles caching, suspense, and color space encoding (sRGB) automatically.
  const texture = useTexture(
    product?.image ? product.image : '/placeholder.png' // Provide a fallback path
  );

  // The texture's flipY must be false for GLB models.
  // useTexture sets it to true by default for standard web usage.
  texture.flipY = false;

  useEffect(() => {
    if (!scene || !materials) return;

    /** 📏 Normalize scale & position on first load */
    const bbox = new THREE.Box3().setFromObject(scene);
    if (bbox.isEmpty()) return; // Don't run if model not loaded yet

    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);

    const updatedBbox = new THREE.Box3().setFromObject(scene);
    const center = updatedBbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -updatedBbox.min.y, -center.z);

    /** 🎯 Get meshes by NAME (clean & reliable) */
    const clothMesh = scene.getObjectByName('Body_Cloth');
    const skinMesh = scene.getObjectByName('Body_Skin');

    if (!clothMesh || !skinMesh) {
      console.error('❌ One or more required meshes (Body_Cloth, Body_Skin) not found in GLB.');
      return;
    }

    // FIX: Ensure materials exist before trying to modify them.
    // This prevents errors if a mesh was exported without a material.
    if (!clothMesh.material) {
      clothMesh.material = new THREE.MeshStandardMaterial();
    }
    if (!skinMesh.material) {
      skinMesh.material = new THREE.MeshStandardMaterial();
    }
    
    /** 🎨 Skin material (never textured) */
    // Update the existing material instead of replacing it
    skinMesh.material.color.set('#f5d6c8');
    skinMesh.material.roughness = 0.8;
    skinMesh.material.metalness = 0.05;

    /** 🧥 Apply product texture ONLY to clothing */
    if (product?.image && texture) {
      console.log('✅ Applying texture to Body_Cloth');
      
      // IMPORTANT: Update the EXISTING material. Do not replace it.
      // This preserves original material properties from the GLB.
      clothMesh.material.map = texture;
      clothMesh.material.roughness = 0.6;
      clothMesh.material.metalness = 0.1;
      clothMesh.material.side = THREE.DoubleSide; // Render both sides
      
      // Tell Three.js the material has changed.
      clothMesh.material.needsUpdate = true;

    } else {
      // Fallback if no product image
      clothMesh.material.map = null; // Remove texture
      clothMesh.material.color.set('#cccccc');
      clothMesh.material.roughness = 0.8;
      clothMesh.material.needsUpdate = true;
    }
  }, [scene, materials, product, texture, targetHeight]);

  return (
    <group ref={group} position={position} name="avatar-root" dispose={null}>
      {/* SCENE LIGHTING: Added to make the model visible without an HDR environment */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5} 
        castShadow 
      />
      
      <primitive object={scene} />

      {/* Fallback placeholder visible only when there is no product image */}
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
    </group>
  );
};

export default MannequinModel;