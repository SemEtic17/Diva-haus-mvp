import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { normalizeModel } from './normalizeModel';
import { sceneStore, bagPositions } from './sceneStore';


const BAG_PATHS = Array.from({ length: 10 }, (_, i) => `/models/bag-${i + 1}.glb`);
const SIZES = [0.5, 0.62, 0.72, 0.68, 0.48, 0.6, 0.55, 0.7, 0.58, 0.64];

// 5 bags per edge, y positions expressed as fraction of viewport height (-0.5..0.5)
const LEFT_SLOTS = [0.34, 0.16, -0.05, -0.24, -0.4];
const RIGHT_SLOTS = [0.38, 0.2, -0.02, -0.22, -0.42];

function BagModel({ index, side, slot }) {
  const { scene } = useGLTF(BAG_PATHS[index]);
  const groupRef = useRef();
  const spinRef = useRef();
  const { camera, size, viewport } = useThree();

  const normalized = useMemo(() => normalizeModel(scene, SIZES[index]), [scene, index]);

  const register = (el) => {
    groupRef.current = el;
  };

  const tmpVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    // Bags are pinned to the screen edges: measure which world-X lands at
    // ~88% of the screen width for the CURRENT camera (z=0 plane), so the
    // bags track the viewport as the camera orbits/zooms through the journey.
    const vh = viewport.height;
    const homeZ = -0.25 - index * 0.05;
    tmpVec.set(1, 0, homeZ).project(camera);
    const edgeX = 0.88 / Math.max(Math.abs(tmpVec.x), 1e-5);
    const homeX = side === 'left' ? -edgeX : edgeX;
    const homeY = slot * vh * 0.9;

    // transition override: while this bag is being zoomed, skip idle animation
    const store = sceneStore.get();
    const isTransitioning = store.transition?.bagIndex === index;

    if (!isTransitioning) {
      // gentle sine/cosine float + hover rotation in 3D space
      const fx = Math.sin(t * 0.7 + index * 1.7) * 0.14;
      const fy = Math.cos(t * 0.5 + index * 2.3) * 0.14;
      const fz = Math.sin(t * 0.4 + index * 0.9) * 0.06;
      group.position.set(homeX + fx, homeY + fy, homeZ + fz);

      if (spinRef.current) {
        spinRef.current.rotation.y += delta * (0.25 + (index % 3) * 0.12);
        spinRef.current.rotation.z = Math.sin(t * 0.6 + index) * 0.06;
        spinRef.current.rotation.x = Math.cos(t * 0.5 + index * 1.3) * 0.08;
      }
    }

    // project to screen space for the DOM hotspot overlay
    const v = new THREE.Vector3();
    group.getWorldPosition(v);
    v.project(camera);
    const px = ((v.x + 1) / 2) * size.width;
    const py = ((1 - v.y) / 2) * size.height;
    bagPositions[index] = { x: px, y: py, visible: v.z < 1 && px > -80 && px < size.width + 80 };
  });

  return (
    <group ref={register}>
      <group ref={spinRef}>
        <primitive object={normalized} />
      </group>
      {/* soft glow halo around each bag */}
      <mesh position={[0, 0, -0.15]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial
          color="#E5C158"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FallbackBag() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshBasicMaterial color="#E5C158" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

export default function FloatingEdgeBags() {
  // preload small bags eagerly; heavy ones stream through their own Suspense
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const side = i < 5 ? 'left' : 'right';
        const slot = (i < 5 ? LEFT_SLOTS : RIGHT_SLOTS)[i % 5];
        return (
          <Suspense key={i} fallback={<FallbackBag />}>
            <BagModel index={i} side={side} slot={slot} />
          </Suspense>
        );
      })}
    </>
  );
}
