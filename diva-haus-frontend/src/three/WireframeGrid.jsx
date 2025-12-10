import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WireframeGrid({
  size = 20,
  divisions = 40,
  color = "#00FFF6",
  position = [0, -1.0, 0],
}) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.01;
  });

  // procedural grid lines using BufferGeometry
  const lines = [];
  for (let i = 0; i <= divisions; i++) {
    const k = (i / divisions - 0.5) * size;
    lines.push([-size / 2, 0, k, size / 2, 0, k]); // horizontal
    lines.push([k, 0, -size / 2, k, 0, size / 2]); // vertical
  }
  const positions = new Float32Array(lines.flat());
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return (
    <group position={position}>
      <lineSegments ref={ref} geometry={geometry}>
        <lineBasicMaterial attach="material" color={color} toneMapped={false} transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}
