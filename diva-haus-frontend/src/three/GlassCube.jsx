import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlassCube({
  size = 1.6,
  position = [0, 1.2, 0],
  color = "#8CE8FF",
}) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <group position={position}>
      {/* Outer glass cube */}
      <mesh ref={ref}>
        <boxGeometry args={[size, size * 0.8, size]} />
        <meshPhysicalMaterial
          color={color}
          opacity={0.12}
          transparent
          roughness={0.05}
          metalness={0.0}
          transmission={0.9}
          clearcoat={0.5}
          reflectivity={0.8}
        />
      </mesh>

      {/* inner holographic plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[size * 0.9, size * 0.5]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.14} />
      </mesh>

      {/* subtle neon edges using thin box outline */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(size, size * 0.8, size)]} />
        <lineBasicMaterial attach="material" color={color} linewidth={1} />
      </lineSegments>
    </group>
  );
}
