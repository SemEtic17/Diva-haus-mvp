// src/components/MannequinModel.jsx

import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({ product, position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/manniquen_uv.glb', true);

  useEffect(() => {
    if (!scene) return;

    /** 📏 1. NORMALIZE SIZE & POSITION **/
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);

    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    /** 🔍 2. FIND THE TORSO MESH (largest mesh) **/
    let torsoMesh = null;
    let maxHeight = 0;

    scene.traverse((child) => {
      if (child.isMesh) {
        const box = new THREE.Box3().setFromObject(child);
        const size = box.getSize(new THREE.Vector3());

        if (size.y > maxHeight) {
          maxHeight = size.y;
          torsoMesh = child;
        }
      }
    });

    if (!torsoMesh) {
      console.error("❌ No mesh found in model.");
      return;
    }

    console.log(`🧍 BEST torso candidate: "${torsoMesh.name}" with height ${maxHeight.toFixed(2)}`);


    /** 🧠 3. CHECK UV SUPPORT **/
    const uvAttr = torsoMesh.geometry.getAttribute("uv");
    if (!uvAttr) {
      console.warn(`⚠️ "${torsoMesh.name}" has NO UVs — textures might not work.`);
    } else {
      console.log(`🎉 "${torsoMesh.name}" supports UV textures.`);
    }


    /** 🖼 4. APPLY PRODUCT TEXTURE **/
    if (product?.image) {
      const loader = new THREE.TextureLoader();
      console.log("🖼 Loading texture:", product.image);

      loader.load(
        product.image,
        (texture) => {
          texture.flipY = false;

          // FORCE UV MATERIAL + REMOVE OLD NODES
torsoMesh.material = new THREE.MeshStandardMaterial({
  map: texture,
  color: new THREE.Color("white"),
  roughness: 0.6,
  metalness: 0.1,
  side: THREE.DoubleSide
});

// Ensure UVs are used
torsoMesh.material.needsUpdate = true;

// If model had multiple materials or shader nodes, clear them
if (torsoMesh.material.map) {
  torsoMesh.material.map.encoding = THREE.sRGBEncoding;
  torsoMesh.material.map.needsUpdate = true;
}

torsoMesh.castShadow = true;
torsoMesh.receiveShadow = true;


console.log("🧪 UV Test (first 5 UV pairs):", uvAttr.array.slice(0, 10));


          console.log(`✔️ Texture applied to "${torsoMesh.name}"`);
        },
        undefined,
        () => console.error("❌ Failed to load image texture")
      );
    } else {
      torsoMesh.material = new THREE.MeshStandardMaterial({
        color: "lightgray",
        roughness: 0.8,
      });
      console.log("⚪ No texture — using default material.");
    }

  }, [scene, product, targetHeight]);



  /** 🎨 5. RENDER **/
  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

      <axesHelper args={[0.3]} />

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
