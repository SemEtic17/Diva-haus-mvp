import React, { useEffect, useRef } from 'react';
import { bagPositions } from '../three/sceneStore';
import { useBagTransition } from '../three/bagTransitionContext';

/**
 * BagHotspots — invisible DOM hit-targets that track the 2 floating bags in the
 * persistent canvas. The canvas itself is pointer-events-none (so page content
 * stays interactive); these buttons provide the click surface for the
 * "wild" 3D zoom transition.
 */
const TARGETS = [
  '/profile',
  '/cart',
];

export default function BagHotspots() {
  const { navigateWithBag } = useBagTransition();
  const refs = useRef([]);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let raf;
    const loop = () => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const p = bagPositions[i];
        if (!p) return;
        const onScreen = p.visible && p.y > 60 && p.y < window.innerHeight - 60;
        if (onScreen) {
          el.style.opacity = '1';
          el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        } else {
          el.style.opacity = '0';
        }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none" aria-hidden="true">
      {Array.from({ length: TARGETS.length }, (_, i) => (
        <button
          key={i}
          ref={(el) => (refs.current[i] = el)}
          onClick={() => navigateWithBag(TARGETS[i], i)}
          aria-label={`Bag ${i + 1}`}
          tabIndex={-1}
          className="pointer-events-auto absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2
                     w-10 h-10 rounded-full opacity-0 transition-opacity duration-300
                     cursor-pointer group"
          style={{ willChange: 'transform' }}
        >
          {/* subtle gold ring + dot that reveals on hover */}
          <span className="absolute inset-0 rounded-full border border-gold/30
                           group-hover:border-gold/70 group-hover:scale-125
                           transition-all duration-300" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           w-1.5 h-1.5 rounded-full bg-gold/60
                           group-hover:bg-gold group-hover:shadow-[0_0_12px_rgba(229,193,88,0.9)]
                           transition-all duration-300" />
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2
                           px-2 py-0.5 rounded bg-black/80 border border-gold/30
                           text-[9px] font-bold tracking-[0.25em] uppercase text-gold
                           opacity-0 group-hover:opacity-100 whitespace-nowrap
                           transition-opacity duration-300">
            {TARGETS[i] === '/profile' ? 'Profile' : 'Cart'}
          </span>
        </button>
      ))}
    </div>
  );
}
