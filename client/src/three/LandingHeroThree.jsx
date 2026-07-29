import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, Sparkles, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import HoloPedestal from './HoloPedestal';

const ScanLine = ({ color = '#00ffff' }) => {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 1.2;
    }
  });

  return (
    <group ref={lineRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.72, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const InteractiveMannequin = ({ scrollProgress }) => {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
  const groupRef = useRef();
  const mannequinRef = useRef();
  const { mouse, viewport } = useThree();
  const [setupDone, setSetupDone] = useState(false);

  const TARGET_HEIGHT = 1.6;

  const clonedScene = useMemo(() => {
    const s = scene.clone();

    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const scale = TARGET_HEIGHT / size.y;
    s.scale.set(scale, scale, scale);

    const postBox = new THREE.Box3().setFromObject(s);
    const center = postBox.getCenter(new THREE.Vector3());
    s.position.x -= center.x;
    s.position.y -= postBox.min.y;
    s.position.z -= center.z;

    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.2,
          roughness: 0.1,
          transmission: 0.95,
          thickness: 1.5,
          ior: 1.45,
          specularIntensity: 1,
          specularColor: new THREE.Color('#ffffff'),
          envMapIntensity: 2.0,
          transparent: true,
          opacity: 0.8,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        });
      }
    });

    return s;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetRotationY = (mouse.x * viewport.width) / 12;
    const targetRotationX = (mouse.y * viewport.height) / 60;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.03
    );

    const scrollAngle = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.y += scrollAngle * 0.1;

    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={clonedScene} ref={mannequinRef} position={[0, 0.12, 0]} />
      </Float>

      <HoloPedestal position={[0, -0.02, 0]} radius={0.6} color="#7C5CFF" />

      <ScanLine color="#00ffff" />

      <Sparkles
        count={60}
        scale={[1.2, 2.5, 1.2]}
        size={3}
        speed={0.4}
        opacity={0.3}
        color="#7C5CFF"
      />
      <Sparkles
        count={40}
        scale={[1, 1.8, 1]}
        size={2}
        speed={0.8}
        opacity={0.5}
        color="#00ffff"
      />
    </group>
  );
};

export default function LandingHeroThree() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = 1200;
      setScrollProgress(Math.min(scrolled / maxScroll, 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.8, 2.5]} fov={40} />

      <ambientLight intensity={0.2} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#7C5CFF" />
      <pointLight position={[3, -2, 2]} intensity={2} color="#00ffff" />
      <pointLight position={[0, 4, -2]} intensity={1} color="#ff00ff" />

      <InteractiveMannequin scrollProgress={scrollProgress} />
    </>
  );
}
