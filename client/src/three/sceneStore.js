import { useSyncExternalStore } from 'react';

/**
 * sceneStore — tiny module-level store shared between the persistent 3D canvas,
 * the GSAP ScrollTrigger driver, the bag transition engine and DOM overlays.
 * Per-frame values (scrollProgress, section) are read directly inside useFrame
 * so they never trigger React re-renders; only components that call useSceneStore
 * re-render when the store changes.
 */
const state = {
  // Scroll journey (driven by ScrollJourney.jsx while the landing page is mounted)
  scrollProgress: 0, // 0..1 across the whole landing page
  section: 'hero', // 'hero' | 'how' | 'featured'
  step: -1, // 0..2 inside "how virtual try-on works"
  cardHover: false, // true while a featured product card is hovered

  // Bag transition state
  transition: null, // { bagIndex, path } while a zoom transition runs
  transitionReady: false, // true once the new DOM tree has mounted under the mask
};

const listeners = new Set();

export const sceneStore = {
  get: () => state,
  set: (patch) => {
    Object.assign(state, patch);
    listeners.forEach((l) => l());
  },
  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useSceneStore(selector) {
  return useSyncExternalStore(
    sceneStore.subscribe,
    () => selector(sceneStore.get()),
    () => selector(sceneStore.get())
  );
}

/**
 * Plain (non-reactive) per-frame output: projected screen positions of the 10
 * bags in pixels. Written by FloatingEdgeBags in useFrame, read by the DOM
 * hotspot overlay in its own rAF loop. Never triggers React re-renders.
 */
export const bagPositions = []; // [{ x, y, visible }] indices 0..9
