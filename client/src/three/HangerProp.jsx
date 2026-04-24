import React from "react";

export default function HangerProp({ position = [0, 0.5, 0], color = "#FFD87A" }) {
  // very simple stylized hanger made of thin torus + plane
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 60]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.02]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}
