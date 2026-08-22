import React, { useEffect, useRef } from 'react';

/**
 * CursorParticles — very light luxury spark tail that only runs on powerful,
 * motion-enabled desktop devices. This is intentionally limited to keep the page
 * responsive on lower-end machines.
 */
export default function CursorParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4);

    if (!isFine || reduced || lowPower) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let w, h, raf;
    const particles = [];
    let mouse = { x: -100, y: -100 };

    const resize = () => {
      w = canvas.width = window.innerWidth * pixelRatio;
      h = canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e) => {
      mouse.x = e.clientX * pixelRatio;
      mouse.y = e.clientY * pixelRatio;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const spawn = () => {
      for (let i = 0; i < 2; i++) {
        if (particles.length > 60) particles.shift();
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 4,
          y: mouse.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.15,
          life: 1,
          decay: 0.035 + Math.random() * 0.035,
          size: (0.7 + Math.random() * 1.2) * pixelRatio,
        });
      }
    };

    let lastSpawn = 0;
    const tick = (now) => {
      ctx.clearRect(0, 0, w, h);

      if (now - lastSpawn > 30) {
        spawn();
        lastSpawn = now;
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.003;
        p.vx *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(229, 193, 88, ${p.life * 0.9})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
        ctx.shadowBlur = 6 * p.life;
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none hidden md:block"
      aria-hidden="true"
    />
  );
}
