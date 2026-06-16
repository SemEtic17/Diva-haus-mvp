import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, MeshDistortMaterial, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A custom component that reacts to mouse and scroll
const InteractiveMannequin = ({ scrollProgress }) => {
  const { scene } = useGLTF('/models/mannequin_cloth_ready.glb');
  const groupRef = useRef();
  const mannequinRef = useRef();
  const { mouse, viewport } = useThree();

  // Clone scene to avoid shared state if multiple instances
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Add a subtle holographic/digital feel to the material
        if (child.material) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#ffffff',
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.5,
            thickness: 0.5,
            transparent: true,
            opacity: 0.8,
            envMapIntensity: 1.5,
          });
        }
      }
    });
    return s;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Mouse Follow (Lerped for smoothness)
    const targetRotationX = (mouse.y * viewport.height) / 50;
    const targetRotationY = (mouse.x * viewport.width) / 10;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );

    // 2. Scroll Response
    // Rotate faster or tilt as user scrolls
    const scrollTilt = scrollProgress * Math.PI * 0.5;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      scrollTilt * 0.2,
      0.1
    );

    // Subtle floating height based on scroll
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + (scrollProgress * -2);
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} ref={mannequinRef} scale={0.7} position={[0, -1.2, 0]} />
      
      {/* Dynamic digital particles that follow the mannequin */}
      <Sparkles 
        count={100} 
        scale={2} 
        size={2} 
        speed={0.5} 
        opacity={0.5} 
        color="#7C5CFF" 
      />
      
      {/* Decorative digital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <torusGeometry args={[1.2, 0.01, 16, 100]} />
        <MeshDistortMaterial 
          color="#00ffff" 
          speed={2} 
          distort={0.3} 
          emissive="#00ffff" 
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default function LandingHeroThree() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = 1000; // Define sensitivity
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00ffff" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff00ff" />
      <pointLight position={[0, -2, 2]} intensity={1} color="#7C5CFF" />

      <InteractiveMannequin scrollProgress={scrollProgress} />
      
      {/* Background Grid - reactive to scroll */}
      <gridHelper 
        args={[20, 20, '#7C5CFF', '#1a1a1a']} 
        position={[0, -2, 0]} 
        rotation={[0, scrollProgress * Math.PI, 0]} 
      />
    </>
  );
}
