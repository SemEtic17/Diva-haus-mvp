import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const TorsoGarment = ({ imageUrl, mannequin, target }) => {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  texture.flipY = false;

  useEffect(() => {
    if (!mannequin) return;

    const torso = mannequin.getObjectByName(target);
    if (!torso) {
      console.warn("⚠️ Torso mesh not found:", target);
      return;
    }

    console.log("👕 Attaching clothing to:", torso);

    // 📍 Position clothing relative to torso
    torso.add(ref.current);

   ref.current.position.set(0, 0.28, 0.23); // ⬅️ Increased Z from 0.15 → 0.23

  // 🎯 Slight angle to match chest slope
  ref.current.rotation.set(0, Math.PI, -Math.PI / 20);

  // 🔥 Slightly bigger to cover upper body
  ref.current.scale.set(0.55, 0.65, 0.55);
  }, [mannequin, target]);

  return (
    <mesh ref={ref} renderOrder={999}>
      <planeGeometry args={[1, 1.3]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default TorsoGarment;
