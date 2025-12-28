import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({ product, position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/wearingcloth.glb', true);

  useEffect(() => {
    if (!scene) return;

    // --- Scene setup (scaling, positioning) ---
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);
    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // --- 🎯 FIND TORSO MESH ---
    const torsoMesh = scene.getObjectByName("Object_2");

    if (!torsoMesh) {
      console.error('❌ Critical: Torso mesh "Object_2" not found in the model.');
      console.log("📌 Available meshes in scene:");
      scene.traverse(child => {
        if (child.isMesh) console.log(`  - "${child.name}"`);
      });
      return;
    }

    // --- 🔍 UV CHECK ---
    const uvAttr = torsoMesh.geometry.getAttribute("uv");
    console.log("👉 UV attribute of Object_2:", uvAttr);

    if (!uvAttr) {
      console.warn("⚠️ This mesh has NO UVs. Textures cannot map correctly.");
    } else {
      console.log("✅ UVs detected! This mesh supports textures.");
    }

    // --- 🧥 APPLY TEXTURE IF PRODUCT IMAGE EXISTS ---
    if (product?.image) {
      console.log(`👕 Applying texture: ${product.image}`);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(product.image, (texture) => {
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        torsoMesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          color: "white",
          roughness: 0.6,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });

        console.log("✅ Texture applied successfully to Object_2.");
        console.log("🔍 Final torso material:", torsoMesh.material);
      });
    } else {
      console.log("🚫 No product image. Using default material for torso.");
      torsoMesh.material = new THREE.MeshStandardMaterial({
        color: 'grey',
        roughness: 0.8,
        metalness: 0.2,
      });
    }

  }, [scene, targetHeight, product]);

  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

      <axesHelper args={[0.4]} />

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
