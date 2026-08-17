import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneStore } from './sceneStore';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * ScrollJourney — drives the persistent 3D scene from the landing page scroll.
 * Mounted inside LandingPage only; all triggers are scoped to that subtree and
 * are reverted when the user navigates away.
 */
export default function ScrollJourney() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      // 1) master progress across the whole landing page
      gsap.to(sceneStore.get(), {
        scrollProgress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            sceneStore.set({ scrollProgress: self.progress });
          },
        },
      });

      // 2) section tracking
      const sections = [
        { id: 'hero', name: 'hero' },
        { id: 'how-it-works', name: 'how' },
        { id: 'featured', name: 'featured' },
      ];

      sections.forEach(({ id, name }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) sceneStore.set({ section: name });
          },
        });
      });

      // 3) step tracking inside "how it works"
      document.querySelectorAll('[data-scene-step]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) {
              sceneStore.set({ step: Number(el.dataset.sceneStep) });
            }
          },
        });
      });

      // 4) featured card hover → spring rotation (set by ProductCard)
      // (state is written by ProductCard directly; nothing to do here)

      return () => {
        sceneStore.set({ section: 'hero', step: -1, scrollProgress: 0 });
      };
    },
    { scope: rootRef }
  );

  return <div ref={rootRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
