import React, { useEffect, useRef } from 'react';

/**
 * CursorParticles — full-screen canvas that draws a gold particle tail following
 * the pointer. Only active on fine pointers (desktop). The native cursor stays
 * visible; this adds the luxury particle trail on top.
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
    if (!isFine || reduced) return;

    let w, h, raf;
    const particles = [];
    let mouse = { x: -100, y: -100, last: 0 };

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouse.x = e.clientX * devicePixelRatio;
      mouse.y = e.clientY * devicePixelRatio;
      mouse.last = performance.now();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const spawn = () => {
      // emit a short burst of gold sparks
      for (let i = 0; i < 3; i++) {
        if (particles.length > 140) particles.shift();
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          life: 1,
          decay: 0.02 + Math.random() * 0.03,
          size: (0.8 + Math.random() * 1.6) * devicePixelRatio,
        });
      }
    };

    let lastSpawn = 0;
    const tick = (now) => {
      ctx.clearRect(0, 0, w, h);

      if (now - lastSpawn > 24) {
        spawn();
        lastSpawn = now;
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.004; // gentle gravity
        p.vx *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(229, 193, 88, ${p.life * 0.9})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        ctx.shadowBlur = 8 * p.life;
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
