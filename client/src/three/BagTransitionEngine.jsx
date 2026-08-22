import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { normalizeModel } from './normalizeModel';
import { bagPositions, sceneStore } from './sceneStore';
import { TransitionContext, bagTransitionApi } from './bagTransitionContext';

// Kept only the 2 smallest bags for performance
const BAG_PATHS = ['/models/bag-7.glb', '/models/bag-10.glb'];
const SIZES = [0.55, 0.64];
const BAG_COUNT = BAG_PATHS.length;

/**
 * Overlay bag — rendered in its own full-screen canvas (z-index above all DOM)
 * so it can act as a 3D mask while the route swaps underneath.
 */
function OverlayBag({ index, screenX, screenY, path, onFinish }) {
  const { scene } = useGLTF(BAG_PATHS[index]);
  const { viewport, size, camera } = useThree();
  const navigate = useNavigate();
  const groupRef = useRef();
  const startedRef = useRef(false);
  const normalized = useMemo(() => normalizeModel(scene, SIZES[index]), [scene, index]);

  // keep everything the one-shot animation reads behind refs so the effect
  // never re-runs (R3F viewport/size identities can change across renders)
  const paramsRef = useRef({ screenX, screenY, path, onFinish, navigate, viewport, size });
  useEffect(() => {
    paramsRef.current = { screenX, screenY, path, onFinish, navigate, viewport, size };
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const group = groupRef.current;
    if (!group) return;
    const { screenX, screenY, path, onFinish, navigate, viewport, size } = paramsRef.current;

    // map the bag's current screen position (from the main canvas) into this
    // canvas's world space
    const wx = (screenX / size.width - 0.5) * viewport.width;
    const wy = -(screenY / size.height - 0.5) * viewport.height;
    group.position.set(wx, wy, 0);
    group.scale.setScalar(1);

    let cancelled = false;

    const zoomIn = gsap.to(group.scale, {
      x: 16,
      y: 16,
      z: 16,
      duration: 0.6,
      ease: 'power3.in',
    });

    const run = async () => {
      await new Promise((res) => zoomIn.eventCallback('onComplete', res));
      if (cancelled) return;

      // swap the route under the mask
      const doNavigate = () => navigate(path);

      if (typeof document.startViewTransition === 'function') {
        const vt = document.startViewTransition(doNavigate);
        // `ready` can hang (e.g. when the route immediately redirects), so
        // race it against a safety timeout before zooming back out.
        await Promise.race([
          vt.ready.catch(() => {}),
          new Promise((res) => setTimeout(res, 1200)),
        ]);
      } else {
        doNavigate();
        await new Promise((res) => setTimeout(res, 400));
      }

      if (cancelled) return;

      // new DOM is mounted — scale the bag back down / fade it out
      const zoomOut = gsap.to(group.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.75,
        ease: 'expo.inOut',
      });
      zoomOut.eventCallback('onComplete', () => {
        if (!cancelled) onFinish();
      });
    };

    run();

    // hard safety: never leave the overlay stuck over the page
    const failsafe = setTimeout(() => onFinish(), 5000);

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      zoomIn.kill();
      gsap.killTweensOf(group.scale);
    };
  }, []);

  // point the camera at the origin plane
  useEffect(() => {
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group ref={groupRef}>
      <primitive object={normalized} />
    </group>
  );
}

function TransitionOverlay({ bagIndex, screenX, screenY, path, onFinish }) {
  return (
    <div className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 3], fov: 45 }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} color="#E5C158" />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#ffffff" />
        <OverlayBag
          index={bagIndex}
          screenX={screenX}
          screenY={screenY}
          path={path}
          onFinish={onFinish}
        />
      </Canvas>
    </div>
  );
}

/**
 * Provider — mount once at the app root (inside Router).
 */
export function BagTransitionProvider({ children }) {
  const navigate = useNavigate();
  const [overlay, setOverlay] = useState(null);

  const navigateWithBag = useCallback(
    (path, bagIndex = 0) => {
      // guard against overlapping transitions
      if (sceneStore.get().transition) return;
      const idx = Math.max(0, Math.min(BAG_COUNT - 1, bagIndex));
      const pos = bagPositions[idx];
      if (!pos || !pos.visible) {
        navigate(path);
        return;
      }
      sceneStore.set({ transition: { bagIndex: idx, path } });
      setOverlay({ bagIndex: idx, screenX: pos.x, screenY: pos.y, path });
    },
    [navigate]
  );

  const handleFinish = useCallback(() => {
    setOverlay(null);
    sceneStore.set({ transition: null });
  }, []);

  const api = useMemo(() => ({ navigateWithBag }), [navigateWithBag]);

  // expose to non-React call sites (Navbar, etc.)
  useEffect(() => {
    bagTransitionApi.navigateWithBag = navigateWithBag;
    return () => {
      bagTransitionApi.navigateWithBag = () => {};
    };
  }, [navigateWithBag]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      {overlay && (
        <TransitionOverlay
          bagIndex={overlay.bagIndex}
          screenX={overlay.screenX}
          screenY={overlay.screenY}
          path={overlay.path}
          onFinish={handleFinish}
        />
      )}
    </TransitionContext.Provider>
  );
}
