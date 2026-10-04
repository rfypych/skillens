'use client';

import { useEffect, useRef } from 'react';

/**
 * OrangeFlowAscii — partikel ASCII mengalir di atas panel oranye.
 * Teknik riset (GodUI FlowField, glyphstream, fx-lab, canvas-ui):
 * partikel menyusuri medan noise yang berevolusi + segmen trail
 * (aman gradien, tanpa wipe-rect) + tolak kursor. Gerbang hemat:
 * IntersectionObserver, visibilitychange, prefers-reduced-motion
 * (bingkai beku), ResizeObserver.
 */

const GLYPHS = ['·', '·', '+', '+', '*', 'x', '#'];

export default function OrangeFlowAscii({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let inView = true;
    let disposed = false;
    let W = 0;
    let H = 0;
    let time = 0;
    let last = 0;
    const frameInterval = 1000 / 30;
    const mouse = { x: -9999, y: -9999 };

    const parent = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    parent?.addEventListener('pointermove', onMove);
    parent?.addEventListener('pointerleave', onLeave);

    const resize = () => {
      const w = Math.max(1, parent?.clientWidth || window.innerWidth);
      const h = Math.max(1, parent?.clientHeight || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = w;
      H = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const step = (now: number) => {
      const delta = now - last;
      if (delta < frameInterval) return;
      last = now - (delta % frameInterval);
      if (!reduced) time += 0.03;

      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';

      // Bilah kaca diagonal shader hero: garis-garis cahaya miring yang
      // hanyut perlahan sepanjang sumbunya, dengan garis halus di dalam.
      // Sumbu u tegak lurus bilah (miring turun-kanan seperti referensi).
      const cell = 14;
      const t = time;
      const drift = (t * 26) % 480;
      const hoverR = 180;
      // Zona tenang di belakang headline (kiri-tengah).
      const calmX = W * 0.32;
      const calmY = H * 0.52;
      const calmR = Math.min(W, H) * 0.42;

      for (let gy = cell / 2; gy < H; gy += cell) {
        for (let gx = cell / 2; gx < W; gx += cell) {
          const u = gx * 0.8 - gy * 0.6 + drift;
          const bandPos = ((u % 480) + 480) % 480;
          // Tiga bilah ramping per periode + garis-garis halus.
          let b =
            Math.exp(-Math.pow((bandPos - 120) / 42, 2)) * 0.75 +
            Math.exp(-Math.pow((bandPos - 300) / 34, 2)) * 0.55 +
            Math.exp(-Math.pow((bandPos - 420) / 52, 2)) * 0.4;
          b += 0.1 * Math.sin(u * 0.35 + t * 0.8);
          const v = Math.max(0, Math.min(1, b));

          let boost = 0;
          let ox = 0;
          let oy = 0;
          if (mouse.x > -9998) {
            const mdx = gx - mouse.x;
            const mdy = gy - mouse.y;
            const md = Math.hypot(mdx, mdy);
            if (md < hoverR) {
              const f = 1 - md / hoverR;
              boost = f * 0.7;
              ox = (mdx / (md || 1)) * f * 10;
              oy = (mdy / (md || 1)) * f * 10;
            }
          }

          if (v < 0.22 && boost <= 0) continue;
          const chars = '·:+*x';
          const ch = chars[Math.min(chars.length - 1, Math.floor(v * chars.length))];
          const calmD = Math.hypot(gx - calmX, gy - calmY);
          const calm = Math.max(0.12, Math.min(1, (calmD - calmR * 0.4) / (calmR * 0.9)));
          const alpha = Math.min(0.75, (v * 0.7 + boost) * calm);
          if (alpha < 0.05) continue;
          ctx.globalAlpha = alpha;
          // Gradien dua warna ala Framer: redup hangat, terang putih.
          ctx.fillStyle = v > 0.55 || boost > 0.25 ? '#ffffff' : '#ffd9b8';
          // Bloom halus ala Framer (glow).
          ctx.shadowColor = 'rgba(255, 240, 225, 0.9)';
          ctx.shadowBlur = 6;
          ctx.fillText(ch, gx + ox, gy + oy);
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Cahaya radial mengikuti kursor (ala Framer cursor light).
      if (mouse.x > -9998) {
        const glowR = 230;
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowR);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - glowR, mouse.y - glowR, glowR * 2, glowR * 2);
      }
    };

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      step(now);
    };

    const start = () => {
      if (animId || disposed || !inView) return;
      animId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(animId);
      animId = 0;
    };

    resize();
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[entries.length - 1]?.isIntersecting ?? true;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      step(performance.now());
    } else {
      start();
    }

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      parent?.removeEventListener('pointermove', onMove);
      parent?.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
