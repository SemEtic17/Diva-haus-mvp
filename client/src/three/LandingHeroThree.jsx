import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, Sparkles, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import HoloPedestal from './HoloPedestal';

// High-tech scanning effect component
const ScanLine = ({ color = '#00ffff' }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      // Moves up and down
      lineRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 1.5;
    }
  });

  return (
    <group ref={lineRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.15, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 64]} />
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

  // Premium "Glass Skin" Material with Gold/Cyan highlights
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Differentiate between "skin" and "cloth" if possible, 
        // but for hero, a unified "digital couture" look is often better.
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.2,
          roughness: 0.1,
          transmission: 0.95, // High transmission for glass look
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

    // 1. Mouse Follow (Subtle & Luxurious)
    const targetRotationY = (mouse.x * viewport.width) / 12;
    const targetRotationX = (mouse.y * viewport.height) / 60;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.03 // Slower for premium feel
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.03
    );

    // 2. Scroll Response
    const scrollAngle = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.y += scrollAngle * 0.1;
    
    // Float movement
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={clonedScene} ref={mannequinRef} scale={0.7} position={[0, -1.2, 0]} />
      </Float>

      {/* Pedestal to ground the model */}
      <HoloPedestal position={[0, -1.25, 0]} radius={1.2} color="#7C5CFF" />

      {/* High-tech HUD lines */}
      <ScanLine color="#00ffff" />
      
      {/* Data stream particles */}
      <Sparkles 
        count={60} 
        scale={[2.5, 4, 2.5]} 
        size={3} 
        speed={0.4} 
        opacity={0.3} 
        color="#7C5CFF" 
      />
      <Sparkles 
        count={40} 
        scale={[2, 3, 2]} 
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
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={40} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#7C5CFF" />
      <pointLight position={[3, -2, 2]} intensity={2} color="#00ffff" />
      <pointLight position={[0, 4, -2]} intensity={1} color="#ff00ff" />

      <InteractiveMannequin scrollProgress={scrollProgress} />
    </>
  );
}

