'use client';

import { useEffect, useRef, useState } from 'react';
import { Add, Close, TrashCan } from '@carbon/icons-react';
import type { CognitiveDimensions } from './CognitiveFingerprintRadar';

export interface CompareCandidate {
  id: number;
  name: string;
  fingerprint: CognitiveDimensions;
  color: string;
}

const COLORS = ['#F26522', '#8B5CF6', '#06B6D4', '#10B981'];

const DIMENSIONS: { key: keyof CognitiveDimensions; label: string }[] = [
  { key: 'analytical_depth',      label: 'Analytical\nDepth' },
  { key: 'creative_synthesis',    label: 'Creative\nSynthesis' },
  { key: 'communication_clarity', label: 'Communication\nClarity' },
  { key: 'pressure_resilience',   label: 'Pressure\nResilience' },
  { key: 'execution_velocity',    label: 'Execution\nVelocity' },
  { key: 'integrity_index',       label: 'Integrity\nIndex' },
];

interface Props {
  candidates: CompareCandidate[];
  size?: number;
}

function OverlayRadar({ candidates, size = 340 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const R  = size * 0.35;
    const n  = DIMENSIONS.length;
    const startAngle = -Math.PI / 2;
    const angleStep = (Math.PI * 2) / n;

    const getPoint = (i: number, r: number) => ({
      x: cx + Math.cos(startAngle + i * angleStep) * r,
      y: cy + Math.sin(startAngle + i * angleStep) * r,
    });

    ctx.clearRect(0, 0, size, size);

    // Background rings
    for (let ring = 1; ring <= 5; ring++) {
      const rr = (R * ring) / 5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = getPoint(i, rr);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 5 ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = ring === 5 ? 1 : 0.5;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw each candidate polygon
    candidates.forEach((cand) => {
      const values = DIMENSIONS.map(d => (cand.fingerprint[d.key] as number) / 100);

      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = getPoint(i, R * values[i]);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();

      // Parse hex color to add alpha
      const hex = cand.color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      ctx.fillStyle = `rgba(${r},${g},${b},0.10)`;
      ctx.fill();
      ctx.strokeStyle = cand.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertex dots
      for (let i = 0; i < n; i++) {
        const p = getPoint(i, R * values[i]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = cand.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Labels
    for (let i = 0; i < n; i++) {
      const labelR = R + size * 0.09;
      const p = getPoint(i, labelR);
      const lines = DIMENSIONS[i].label.split('\n');

      ctx.font = `600 ${size * 0.032}px Inter, sans-serif`;
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      const lineH = size * 0.036;
      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        ctx.fillText(line, p.x, p.y - totalH / 2 + li * lineH + 4);
      });
    }
  }, [candidates, size]);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
}

// ── Score comparison table ───────────────────────────────────────────────────

function ScoreTable({ candidates }: { candidates: CompareCandidate[] }) {
  if (candidates.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 pr-4 text-gray-400 font-semibold uppercase tracking-wider text-[10px] w-36">Dimensi</th>
            {candidates.map(c => (
              <th key={c.id} className="py-2 px-3 text-center">
                <span className="font-bold text-[10px]" style={{ color: c.color }}>
                  {c.name.split(' ')[0]}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DIMENSIONS.map(dim => {
            const vals = candidates.map(c => c.fingerprint[dim.key] as number);
            const maxVal = Math.max(...vals);

            return (
              <tr key={dim.key} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-2 pr-4 text-gray-600 font-medium text-[10px]">
                  {dim.label.replace('\n', ' ')}
                </td>
                {candidates.map(c => {
                  const val = c.fingerprint[dim.key] as number;
                  const isBest = val === maxVal && candidates.length > 1;
                  return (
                    <td key={c.id} className="py-2 px-3 text-center">
                      <span
                        className={`font-bold text-xs ${isBest ? 'text-gray-900' : 'text-gray-400'}`}
                        style={isBest ? { color: c.color } : {}}
                      >
                        {val.toFixed(0)}
                      </span>
                      {isBest && candidates.length > 1 && (
                        <span className="ml-1 text-[8px] font-bold">▲</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Overall row */}
          <tr className="border-t border-gray-200">
            <td className="py-2.5 pr-4 font-bold text-gray-900 text-[10px] uppercase tracking-wider">Overall</td>
            {candidates.map(c => {
              const allVals = candidates.map(x => x.fingerprint.overall);
              const isBest = c.fingerprint.overall === Math.max(...allVals) && candidates.length > 1;
              return (
                <td key={c.id} className="py-2.5 px-3 text-center">
                  <span className="font-bold text-sm" style={{ color: c.color }}>
                    {c.fingerprint.overall.toFixed(0)}
                  </span>
                  {isBest && candidates.length > 1 && (
                    <span className="ml-1 text-[9px]" style={{ color: c.color }}>★</span>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

interface PanelProps {
  allCandidates: { id: number; name: string; fingerprint: CognitiveDimensions }[];
}

export default function ComparativeFingerprintView({ allCandidates }: PanelProps) {
  const [selected, setSelected] = useState<number[]>(
    allCandidates.slice(0, 2).map(c => c.id)
  );

  const compared: CompareCandidate[] = selected
    .map((id, i) => {
      const found = allCandidates.find(c => c.id === id);
      if (!found) return null;
      return { ...found, color: COLORS[i % COLORS.length] };
    })
    .filter(Boolean) as CompareCandidate[];

  const toggle = (id: number) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, id];
    });
  };

  if (allCandidates.length < 2) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">Minimal 2 kandidat diperlukan untuk perbandingan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Comparative Fingerprint View</h3>
        <p className="text-[11px] text-gray-500 font-normal mt-0.5">
          Overlay radar sidik jari kognitif — bandingkan hingga 4 kandidat sekaligus
        </p>
      </div>

      {/* Candidate selector */}
      <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
        {allCandidates.map((c, i) => {
          const isSelected = selected.includes(c.id);
          const colorIdx   = selected.indexOf(c.id);
          const color      = isSelected ? COLORS[colorIdx % COLORS.length] : undefined;
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isSelected
                  ? 'border-current text-white shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
              style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
            >
              {c.name.split(' ')[0]}
              {isSelected && <Close className="w-3 h-3 opacity-70" />}
            </button>
          );
        })}
      </div>

      {/* Radar overlay */}
      <div className="px-4 pt-2 pb-4">
        {compared.length >= 2 ? (
          <OverlayRadar candidates={compared} size={320} />
        ) : (
          <div className="h-40 flex items-center justify-center text-xs text-gray-400">
            Pilih minimal 2 kandidat untuk membandingkan
          </div>
        )}
      </div>

      {/* Score table */}
      {compared.length >= 1 && (
        <div className="px-6 pb-6 border-t border-gray-50 pt-4">
          <ScoreTable candidates={compared} />
        </div>
      )}
    </div>
  );
}
