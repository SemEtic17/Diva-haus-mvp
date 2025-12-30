import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({ product, position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/mannequin_uv.glb', true);

  useEffect(() => {
    if (!scene) return;

    /** 📏 1. Normalize model size */
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    scene.scale.setScalar(scale);

    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    /** 🎯 2. Define torso-related mesh names */
    const torsoNames = [
      "mesh_1","mesh_1_1","mesh_1_2","mesh_1_3","mesh_1_4","mesh_1_5",
      "mesh_2","mesh_2_1" // hips/pelvis
    ];

    /** 🔍 3. Collect torso meshes */
    const bodyParts = [];
    scene.traverse(child => {
      if (child.isMesh && torsoNames.includes(child.name)) {
        if (child.geometry?.getAttribute("uv")) {
          bodyParts.push(child);
        }
      }
    });

    console.log("👕 Detected torso parts:", bodyParts.map(p => p.name));

    /** 🎨 4. Apply product texture to torso only */
    if (product?.image) {
      const textureLoader = new THREE.TextureLoader();
      console.log("🖼 Loading texture:", product.image);

      textureLoader.load(
        product.image,
        texture => {
          texture.flipY = false;
          texture.encoding = THREE.sRGBEncoding;

          bodyParts.forEach(mesh => {
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              color: "white",
              roughness: 0.6,
              metalness: 0.1,
              side: THREE.DoubleSide
            });

            mesh.material.needsUpdate = true;
            mesh.castShadow = mesh.receiveShadow = true;
          });

          console.log("✨ Texture applied ONLY to:", bodyParts.map(p => p.name));
        },
        undefined,
        () => console.error("❌ Failed to load texture")
      );

    } else {
      /** ⚪ If no product image, default material */
      bodyParts.forEach(mesh => {
        mesh.material = new THREE.MeshStandardMaterial({
          color: "lightgray",
          roughness: 0.8
        });
      });
      console.log("⚪ No texture — defaulting to gray");
    }

  }, [scene, product, targetHeight]);


  /** 🧱 5. Render mannequin + placeholders */
  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

      {/* Debug Helper */}
      {/* <axesHelper args={[0.3]} /> */}

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
