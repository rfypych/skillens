'use client';

import { useEffect, useRef } from 'react';

export interface CognitiveDimensions {
  analytical_depth: number;
  communication_clarity: number;
  execution_velocity: number;
  integrity_index: number;
  creative_synthesis: number;
  pressure_resilience: number;
  overall: number;
}

const DIMENSIONS = [
  { key: 'analytical_depth',      label: 'Analytical\nDepth',      color: '#F26522' },
  { key: 'creative_synthesis',    label: 'Creative\nSynthesis',    color: '#8B5CF6' },
  { key: 'communication_clarity', label: 'Communication\nClarity', color: '#06B6D4' },
  { key: 'pressure_resilience',   label: 'Pressure\nResilience',   color: '#10B981' },
  { key: 'execution_velocity',    label: 'Execution\nVelocity',    color: '#F59E0B' },
  { key: 'integrity_index',       label: 'Integrity\nIndex',       color: '#EF4444' },
] as const;

interface Props {
  data: CognitiveDimensions;
  size?: number;
  animate?: boolean;
}

export default function CognitiveFingerprintRadar({ data, size = 320, animate = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R  = size * 0.36;         // outer radius of the chart
    const n  = DIMENSIONS.length;

    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2; // start at top

    const getPoint = (i: number, r: number) => ({
      x: cx + Math.cos(startAngle + i * angleStep) * r,
      y: cy + Math.sin(startAngle + i * angleStep) * r,
    });

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, size, size);

      // ── Background rings ─────────────────────────────────────────
      const ringCount = 5;
      for (let ring = 1; ring <= ringCount; ring++) {
        const rr = (R * ring) / ringCount;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const p = getPoint(i, rr);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = ring === ringCount ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)';
        ctx.lineWidth = ring === ringCount ? 1.5 : 0.8;
        ctx.stroke();

        // Ring labels (20, 40, 60, 80, 100)
        if (ring > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.font = `${size * 0.028}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(`${ring * 20}`, cx, cy - rr - 3);
        }
      }

      // ── Axis lines ───────────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const p = getPoint(i, R);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(0,0,0,0.10)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ── Data polygon (animated) ───────────────────────────────────
      const values = DIMENSIONS.map(d => (data[d.key as keyof CognitiveDimensions] as number) / 100);

      // Filled gradient polygon
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const v = values[i] * progress;
        const p = getPoint(i, R * v);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grad.addColorStop(0, 'rgba(242, 101, 34, 0.35)');
      grad.addColorStop(0.6, 'rgba(242, 101, 34, 0.18)');
      grad.addColorStop(1, 'rgba(242, 101, 34, 0.04)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#F26522';
      ctx.lineWidth = 2;
      ctx.stroke();

      // ── Dots on each vertex ───────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const v = values[i] * progress;
        const p = getPoint(i, R * v);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = DIMENSIONS[i].color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Axis labels ───────────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const labelR = R + size * 0.09;
        const p = getPoint(i, labelR);
        const dim = DIMENSIONS[i];
        const score = (data[dim.key as keyof CognitiveDimensions] as number).toFixed(0);
        const lines = dim.label.split('\n');

        ctx.font = `600 ${size * 0.033}px Inter, sans-serif`;
        ctx.fillStyle = '#111';
        ctx.textAlign = 'center';

        const lineH = size * 0.038;
        const totalH = lines.length * lineH;
        lines.forEach((line, li) => {
          ctx.fillText(line, p.x, p.y - totalH / 2 + li * lineH + 4);
        });

        // Score badge
        ctx.font = `700 ${size * 0.036}px Inter, sans-serif`;
        ctx.fillStyle = dim.color;
        ctx.fillText(score, p.x, p.y + totalH / 2 + 4);
      }

      // ── Center overall score ──────────────────────────────────────
      ctx.font = `700 ${size * 0.08}px Inter, sans-serif`;
      ctx.fillStyle = '#111';
      ctx.textAlign = 'center';
      ctx.fillText(data.overall.toFixed(0), cx, cy + size * 0.03);

      ctx.font = `400 ${size * 0.03}px Inter, sans-serif`;
      ctx.fillStyle = '#888';
      ctx.fillText('Overall', cx, cy + size * 0.065);
    };

    if (animate) {
      const duration = 900; // ms
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        progressRef.current = Math.min(elapsed / duration, 1);
        // ease out cubic
        const t = progressRef.current;
        const eased = 1 - Math.pow(1 - t, 3);
        draw(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(1);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [data, size, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
}
