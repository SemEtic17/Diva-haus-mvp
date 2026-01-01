import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({ product, position = [0, 0, 0], targetHeight = 1.7 }) => {
  const group = useRef();
  const { scene } = useGLTF('/models/mannequin_uv.glb', true);

useEffect(() => {
  if (!scene) return;

  // Normalize scale & center
  const bbox = new THREE.Box3().setFromObject(scene);
  const size = bbox.getSize(new THREE.Vector3());
  const scale = size.y > 0 ? targetHeight / size.y : 1;
  scene.scale.setScalar(scale);

  bbox.setFromObject(scene);
  const center = bbox.getCenter(new THREE.Vector3());
  scene.position.set(-center.x, -bbox.min.y, -center.z);

  /** 🎯 SELECT ONLY BODY PARTS FOR CLOTHING */
  const torsoParts = [
    "mesh_1", "mesh_1_1", "mesh_1_2", "mesh_1_3", "mesh_1_4", "mesh_1_5", // torso
    "mesh_2", "mesh_2_1" // hips / waist
  ];

  const headParts = [
    "mesh_3", "mesh_3_1" // DON'T TOUCH THESE
  ];

  // Convert to mesh references
  const torsoMeshes = torsoParts
    .map((name) => scene.getObjectByName(name))
    .filter(Boolean);

  const headMeshes = headParts
    .map((name) => scene.getObjectByName(name))
    .filter(Boolean);

  console.log("🧍 Torso meshes to texture:", torsoMeshes.map(m => m.name));
  console.log("🚫 These will NOT get texture:", headMeshes.map(m => m.name));

  /** 🧥 APPLY CLOTHING TEXTURE */
  if (product?.image) {
    const loader = new THREE.TextureLoader();
    loader.load(
      product.image,
      (texture) => {
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;

        torsoMeshes.forEach(mesh => {
          mesh.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.1,
            side: THREE.DoubleSide,
          });
          mesh.material.needsUpdate = true;
        });

        // Make head default skin color
        headMeshes.forEach(mesh => {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#f5d6c8",
            roughness: 0.8,
            metalness: 0.1,
          });
        });

        console.log("🎉 Final texture applied (only torso & hips)");
      }
    );
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
