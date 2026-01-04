import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GarmentPlaceholder from './GarmentPlaceholder';

const MannequinModel = ({
  product,
  position = [0, 0, 0],
  targetHeight = 1.7,
}) => {
  const group = useRef();
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');

  useEffect(() => {
    if (!scene) return;

    /** 📏 Normalize scale & position */
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? targetHeight / size.y : 1;

    scene.scale.setScalar(scale);

    bbox.setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.set(-center.x, -bbox.min.y, -center.z);

    /** 🎯 Get meshes by NAME (clean & reliable) */
    const clothMesh = scene.getObjectByName('Body_Cloth');
    const skinMesh = scene.getObjectByName('Body_Skin');

    if (!clothMesh) {
      console.error('❌ Body_Cloth mesh NOT found. Check Blender export.');
      return;
    }

    if (!skinMesh) {
      console.error('❌ Body_Skin mesh NOT found. Check Blender export.');
      return;
    }

    console.log('👕 Clothing mesh:', clothMesh.name);
    console.log('🧍 Skin mesh:', skinMesh.name);

    /** 🎨 Skin material (never textured) */
    skinMesh.material = new THREE.MeshStandardMaterial({
      color: '#f5d6c8',
      roughness: 0.8,
      metalness: 0.05,
    });

    /** 🧥 Apply product texture ONLY to clothing */
    if (product?.image) {
      const loader = new THREE.TextureLoader();

      loader.load(
        product.image,
        (texture) => {
          texture.flipY = false;
          texture.encoding = THREE.sRGBEncoding;
          texture.anisotropy = 8;
          texture.needsUpdate = true;

          clothMesh.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.1,
            side: THREE.DoubleSide,
          });

          clothMesh.material.needsUpdate = true;

          console.log('✅ Texture applied ONLY to Body_Cloth');
        },
        undefined,
        (err) => {
          console.error('❌ Failed to load product texture', err);
        }
      );
    } else {
      // fallback if no product
      clothMesh.material = new THREE.MeshStandardMaterial({
        color: '#cccccc',
        roughness: 0.8,
      });
    }
  }, [scene, product, targetHeight]);

  return (
    <group ref={group} position={position} name="avatar-root">
      <primitive object={scene} />

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
