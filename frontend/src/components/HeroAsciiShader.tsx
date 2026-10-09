'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroAsciiShader — kembaran ASCII dari shader hero landing.
 * Port langsung medan Swirl shaders/react (domain-warped triple sine,
 * detail=1.2, konstanta waktu identik) + aproksimasi FlutedGlass
 * (distorsi sampling frekuensi 5) + FilmGrain (noise 0.04).
 * Dipetakan ke karakter di atas terang agar identik secara gerak.
 *
 * Referensi: node_modules/shaders/dist/core/Swirl-*.js (swirlField),
 * FlutedGlass (frequency/speed), FilmGrain (strength).
 */

const CHARS = ' .·:;+';

export default function HeroAsciiShader({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DETAIL = 0.7;
    let animId = 0;
    let inView = true;
    let disposed = false;
    let W = 0;
    let H = 0;
    let time = 0;
    let last = 0;
    const frameInterval = 1000 / 20;

    const parent = canvas.parentElement;
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
    resize();
    window.addEventListener('resize', resize);

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    // === Port verbatim swirlField (uv dalam ruang aspek) ===
    const swirl = (ux: number, uy: number, t: number) => {
      const freq1 = DETAIL;
      const d1x =
        ux +
        Math.sin(uy * freq1 * 1.7 + t * 0.8) * 0.12 +
        Math.cos(ux * freq1 * 0.9 - t * 0.5) * 0.05;
      const d1y =
        uy +
        Math.cos(ux * freq1 * 1.3 - t * 0.6) * 0.12 +
        Math.sin(uy * freq1 * 1.1 + t * 0.7) * 0.05;
      const pattern1 = Math.sin(d1x * freq1 * 2.1 + d1y * freq1 * 1.8 + t * 0.4);
      const freq2 = DETAIL * 2.1;
      const d2x =
        d1x +
        Math.cos(d1y * freq2 * 2.7 - t * 0.45) * 0.07 +
        Math.sin(d1x * freq2 * 1.9 + t * 0.6) * 0.04;
      const d2y =
        d1y +
        Math.sin(d1x * freq2 * 2.3 + t * 0.65) * 0.07 +
        Math.cos(d1y * freq2 * 1.6 - t * 0.4) * 0.04;
      const pattern2 = Math.cos(d2x * freq2 * 1.4 - d2y * freq2 * 1.9 + t * 0.35);
      const freq3 = DETAIL * 3.7;
      const d3x =
        d2x +
        Math.sin(d2y * freq3 * 1.8 + t * 0.85) * 0.04 +
        Math.cos(d2x * freq3 * 1.3 - t * 0.55) * 0.025 +
        Math.sin((d2x + d2y) * freq3 * 0.7 + t * 0.9) * 0.02;
      const d3y =
        d2y +
        Math.cos(d2x * freq3 * 1.6 - t * 0.75) * 0.04 +
        Math.sin(d2y * freq3 * 1.1 + t * 0.5) * 0.025 +
        Math.cos((d2x + d2y) * freq3 * 0.8 - t * 0.95) * 0.02;
      const pattern3 = Math.sin(d3x * freq3 * 1.1 + d3y * freq3 * 1.5 - t * 0.55);
      const combined = pattern1 * 0.45 + pattern2 * 0.35 + pattern3 * 0.2;
      const shimmer = Math.sin(t * 2.5 + combined * 8) * 0.015 + 1;
      return { f: smoothstep(0.3, 0.7, combined * 0.5 + 0.5), shimmer };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '13px "JetBrains Mono", ui-monospace, monospace';

      const cell = 34;
      const aspect = W / Math.max(1, H);
      // Zona tenang di tengah (belakang headline hero).
      const calmX = W * 0.5;
      const calmY = H * 0.46;
      const calmR = Math.min(W, H) * 0.4;

      for (let gy = cell / 2; gy < H; gy += cell) {
        for (let gx = cell / 2; gx < W; gx += cell) {
          // FlutedGlass: geser sampling horizontal (5 alur, hanyut lambat).
          const flute = Math.sin((gx / W) * 5 * Math.PI * 2 + t * 0.75) * 0.006;
          const ux = (gx / W) * aspect + flute;
          const uy = 1 - gy / H;
          const { f, shimmer } = swirl(ux, uy, t);
          // FilmGrain 0.04.
          const g = (Math.random() - 0.5) * 0.08;
          const v = Math.max(0, Math.min(1, f * shimmer + g));
          if (v < 0.5) continue;
          const ch = CHARS[Math.min(CHARS.length - 1, Math.floor(v * CHARS.length))];
          if (ch === ' ') continue;
          const calmD = Math.hypot(gx - calmX, gy - calmY);
          const calm = Math.max(0.08, Math.min(1, (calmD - calmR * 0.45) / (calmR * 0.9)));
          const alpha = Math.min(0.45, ((v - 0.5) / 0.5) * 0.45 * calm);
          if (alpha < 0.04) continue;
          ctx.globalAlpha = alpha;
          // Peta warna hero: abu netral → oranye pada aliran.
          ctx.fillStyle = v > 0.72 ? '#F26522' : '#b9bec4';
          ctx.fillText(ch, gx, gy);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      const delta = now - last;
      if (delta < frameInterval) return;
      last = now - (delta % frameInterval);
      if (!reduced) time += delta / 1000;
      draw(time);
    };

    const start = () => {
      if (animId || disposed || !inView) return;
      last = performance.now();
      animId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(animId);
      animId = 0;
    };

    resize();
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

    draw(1.2);
    if (!reduced) start();

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
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
