import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { normalizeModel } from './normalizeModel';
import { sceneStore } from './sceneStore';
import HoloPedestal from './HoloPedestal';

useGLTF.preload('/models/female-mannequin.glb');

/* ------------------------------------------------------------------ */
/* Laser Scan Ring — custom shader pass ("Neural Mesh v2.0.4-DIVA")    */
/* ------------------------------------------------------------------ */
const scanVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const scanFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // radial falloff so the ring reads as a crisp laser edge
    float dist = abs(vUv.x - 0.5) * 2.0;
    float edge = smoothstep(1.0, 0.82, dist);
    float pulse = 0.65 + 0.35 * sin(uTime * 4.0);
    float alpha = edge * uIntensity * pulse;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function ScanRing({ radius = 0.42, color = '#E5C158', speed = 0.55, heightRange = 1.5, baseY = 0.78 }) {
  const meshRef = useRef();
  const matRef = useRef();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uIntensity: { value: 1 }, uColor: { value: new THREE.Color(color) } }),
    [color]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const store = sceneStore.get();
    // sweep vertically up and down the mannequin body
    const sweep = Math.sin(t * speed) * heightRange * 0.5;
    if (meshRef.current) meshRef.current.position.y = baseY + sweep;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      const target = store.section === 'how' ? 1.6 + store.step * 0.7 : 1.0;
      matRef.current.uniforms.uIntensity.value = THREE.MathUtils.damp(
        matRef.current.uniforms.uIntensity.value,
        target,
        3,
        0.016
      );
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.012, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={scanVertex}
        fragmentShader={scanFragment}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Step highlight lights — Upload / Curate / Transformation            */
/* ------------------------------------------------------------------ */
const STEP_COLORS = ['#00d9ff', '#E5C158', '#ff4ecd'];

function StepHighlights() {
  const lights = useRef([]);
  useFrame((_, delta) => {
    const store = sceneStore.get();
    lights.current.forEach((light, i) => {
      if (!light) return;
      const active = store.section === 'how' && store.step === i;
      const target = active ? 14 : 0;
      light.intensity = THREE.MathUtils.damp(light.intensity, target, 5, delta);
    });
  });

  const positions = [
    [-1.4, 0.6, 0.8],
    [1.4, 0.4, 0.6],
    [0, 1.1, -1.4],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <pointLight
          key={i}
          ref={(el) => (lights.current[i] = el)}
          position={pos}
          intensity={0}
          distance={4}
          color={STEP_COLORS[i]}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Podium — glass glowing platform under the avatar                    */
/* ------------------------------------------------------------------ */
function Podium() {
  const { scene } = useGLTF('/models/podium.glb');
  const normalized = useMemo(() => {
    const s = normalizeModel(scene, 0.09); // podium is a ~0.1 unit flat disc
    // re-center horizontally but keep flat top at y=0
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    s.position.x -= center.x;
    s.position.z -= center.z;
    s.position.y = -size.y / 2; // sit its center so top touches y=0
    return s;
  }, [scene]);

  return (
    <group position={[0, 0, 0]}>
      <primitive object={normalized} />
      {/* glow disc under the platform */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 48]} />
        <meshBasicMaterial
          color="#E5C158"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Mannequin — avatar + podium + scan + scroll-driven camera journey   */
/* ------------------------------------------------------------------ */
export default function Mannequin() {
  const { scene } = useGLTF('/models/female-mannequin.glb');
  const groupRef = useRef();
  const innerRef = useRef();
  const camera = useThree((s) => s.camera);
  const { viewport, mouse } = useThree();

  const normalized = useMemo(() => {
    const s = normalizeModel(scene, 1.55);
    // luxury neural material treatment
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.85,
          roughness: 0.25,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
          envMapIntensity: 1.4,
          emissive: new THREE.Color('#E5C158'),
          emissiveIntensity: 0.04,
        });
      }
    });
    return s;
  }, [scene]);

  // smoothed world-space anchor: where the avatar stands (fixed point the
  // camera orbits around — maps to the right half of the hero screen)
  const anchor = useRef(new THREE.Vector3(0.9, 0, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const camPos = useRef(new THREE.Vector3(0, 0.55, 3.0));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const store = sceneStore.get();
    const { section, scrollProgress, cardHover } = store;

    // ---- anchor: right of center for hero; orbit center for how/featured ----
    const aspect = viewport.width / viewport.height;
    let fracX = 0.2;
    if (section === 'how') fracX = 0.08;
    else if (section === 'featured') fracX = 0.12;
    if (aspect < 0.9) fracX = 0.0; // phones: center stage

    const targetX = viewport.width * fracX;
    anchor.current.x = THREE.MathUtils.damp(anchor.current.x, targetX, 2.5, delta);
    anchor.current.y = 0;
    anchor.current.z = 0;

    // float physics on the whole group
    const floatY = Math.sin(t * 0.9) * 0.035;
    if (groupRef.current) {
      groupRef.current.position.set(anchor.current.x, anchor.current.y + floatY, anchor.current.z);
    }

    // ---- camera journey ----
    let camTarget = new THREE.Vector3(0, 0.55, 3.0);
    let look = new THREE.Vector3(0, 0.72, 0);

    if (section === 'how') {
      // orbit ~180 degrees around the avatar as the section scrolls
      const p = Math.min(Math.max(scrollProgress, 0), 1);
      const orbitStart = 0.18;
      const orbitEnd = 0.62;
      const orbitP = THREE.MathUtils.clamp((p - orbitStart) / (orbitEnd - orbitStart), 0, 1);
      const angle = Math.PI * orbitP;
      const radius = 2.7;
      camTarget.set(
        anchor.current.x + Math.sin(angle) * radius,
        1.1,
        Math.cos(angle) * radius
      );
      look = new THREE.Vector3(anchor.current.x, 0.8, 0);
    } else if (section === 'featured') {
      // close-up pull-in (slightly right of center, eye level)
      camTarget.set(anchor.current.x + 0.25, 0.8, 1.95);
      look = new THREE.Vector3(anchor.current.x, 0.85, 0);
    }

    camPos.current.x = THREE.MathUtils.damp(camPos.current.x, camTarget.x, 1.8, delta);
    camPos.current.y = THREE.MathUtils.damp(camPos.current.y, camTarget.y, 1.8, delta);
    camPos.current.z = THREE.MathUtils.damp(camPos.current.z, camTarget.z, 1.8, delta);
    camera.position.copy(camPos.current);

    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, look.x, 2, delta);
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, look.y, 2, delta);
    lookTarget.current.z = THREE.MathUtils.damp(lookTarget.current.z, look.z, 2, delta);
    camera.lookAt(lookTarget.current);

    // ---- cursor parallax + card-hover spring rotation ----
    if (innerRef.current) {
      const hover = cardHover ? 1 : 0;
      const targetRotY = THREE.MathUtils.damp(
        innerRef.current.rotation.y,
        mouse.x * 0.5 * (1 + hover * 1.4) + (section === 'featured' ? 0.35 : 0),
        3 + hover * 4,
        delta
      );
      const targetRotX = THREE.MathUtils.damp(
        innerRef.current.rotation.x,
        -mouse.y * 0.12,
        3,
        delta
      );
      innerRef.current.rotation.y = targetRotY;
      innerRef.current.rotation.x = targetRotX;
    }

    // subtle vertical breathing on inner group
    if (innerRef.current) {
      innerRef.current.position.y = Math.sin(t * 0.6) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        <Float speed={2} rotationIntensity={0.12} floatIntensity={0.35}>
          <primitive object={normalized} position={[0, 0, 0]} />
        </Float>

        <Suspense fallback={<HoloPedestal position={[0, 0, 0]} radius={0.55} color="#E5C158" />}>
          <Podium />
        </Suspense>

        <ScanRing radius={0.46} color="#E5C158" speed={0.5} heightRange={1.5} baseY={0.85} />
        <ScanRing radius={0.5} color="#7C5CFF" speed={0.35} heightRange={1.2} baseY={0.85} />

        <StepHighlights />

        {/* gold ambient particles (intensify during featured) */}
        <Sparkles count={70} scale={[1.6, 2.6, 1.6]} size={2.6} speed={0.4} opacity={0.55} color="#E5C158" />
      </group>
    </group>
  );
}
