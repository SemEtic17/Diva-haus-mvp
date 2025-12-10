import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function HoloPedestal({
  position = [0, -0.8, 0],
  radius = 1.0,
  height = 0.25,
  color = "#7C5CFF", // hero accent (muted violet)
}) {
  const topRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (topRef.current) topRef.current.rotation.y += delta * 0.2;
    if (ringRef.current) ringRef.current.rotation.y -= delta * 0.15;
  });

  return (
    <group position={position}>
      {/* pedestal base */}
      <mesh receiveShadow castShadow position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius, height, 36]} />
        <meshPhysicalMaterial
          color={"#0b0b0b"}
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.5}
        />
      </mesh>

      {/* top disc with emissive rim */}
      <mesh ref={topRef} position={[0, height * 0.4, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.9, 0.08, 48]} />
        {/* subtle holographic shimmer using MeshWobbleMaterial (drei) */}
        <MeshWobbleMaterial
          factor={0.2}
          speed={0.4}
          envMapIntensity={0.6}
          metalness={0.6}
          roughness={0.1}
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* thin emissive ring around top */}
      <mesh ref={ringRef} position={[0, height * 0.45, 0]}>
        <torusGeometry args={[radius * 0.98, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.6} />
      </mesh>

      {/* subtle vertical volumetric glow (plane with additive material) */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 1.3, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
