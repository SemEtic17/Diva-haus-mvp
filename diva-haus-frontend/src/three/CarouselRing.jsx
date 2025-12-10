import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 CarouselRing: simple ring that holds N child placeholders (you can attach small planes or product thumbnails).
 Use as:
 <CarouselRing count={6} radius={1.8} children={(i) => <mesh .../>} />
*/
export default function CarouselRing({ count = 6, radius = 1.8, height = 0.6, speed = 0.35, children }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  const items = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height;
    items.push({ x, y, z, angle });
  }

  return (
    <group ref={ref}>
      {/* ring base */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.06, 16, 200]} />
        <meshStandardMaterial color={"#ffffff"} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* items */}
      {items.map((p, idx) => (
        <group key={idx} position={[p.x, p.y, p.z]} rotation={[0, -p.angle, 0]}>
          {/* placeholder plane for thumbnail */}
          {children ? (
            children(idx)
          ) : (
            <mesh>
              <planeGeometry args={[0.5, 0.6]} />
              <meshStandardMaterial color={"#222"} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
