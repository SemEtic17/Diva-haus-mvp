import React, { useRef, useCallback } from 'react';

/**
 * Magnetic — wraps children (buttons, links) with a magnetic hover effect:
 * the element is pulled toward the cursor and springs back on leave.
 * Pure transform-based, GPU friendly, no layout thrash.
 */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block will-change-transform transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </span>
  );
}
