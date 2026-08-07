'use client';

export interface FingerprintValues {
  analytical_depth: number;
  communication_clarity: number;
  execution_velocity: number;
  integrity_index: number;
  creative_synthesis: number;
  pressure_resilience: number;
}

export const FINGERPRINT_LABELS: { key: keyof FingerprintValues; label: string; short: string }[] = [
  { key: 'analytical_depth', label: 'Kedalaman Analitik', short: 'Analitik' },
  { key: 'communication_clarity', label: 'Kejelasan Komunikasi', short: 'Komunikasi' },
  { key: 'execution_velocity', label: 'Kecepatan Eksekusi', short: 'Eksekusi' },
  { key: 'integrity_index', label: 'Indeks Integritas', short: 'Integritas' },
  { key: 'creative_synthesis', label: 'Sintesis Kreatif', short: 'Kreativitas' },
  { key: 'pressure_resilience', label: 'Ketahanan Tekanan', short: 'Resiliensi' },
];

export function fingerprintValue(fp: FingerprintValues | undefined | null, key: keyof FingerprintValues): number {
  const v = fp?.[key];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(100, v)) : 0;
}

interface RadarProps {
  fingerprint?: FingerprintValues | null;
  overlay?: FingerprintValues | null;
  overlayLabel?: string;
  size?: number;
}

export default function CognitiveFingerprintRadar({ fingerprint, overlay, overlayLabel = 'Rata-rata Tim', size = 320 }: RadarProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const rings = 5;

  const point = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const polygonPoints = (values: FingerprintValues | undefined | null, color: string) => {
    if (!values) return '';
    return FINGERPRINT_LABELS.map((dim, i) => {
      const p = point(fingerprintValue(values, dim.key), i, FINGERPRINT_LABELS.length);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  const gridRings = Array.from({ length: rings }, (_, ringIdx) => {
    const level = (ringIdx + 1) / rings;
    const points = FINGERPRINT_LABELS.map((_, i) => {
      const angle = (Math.PI * 2 * i) / FINGERPRINT_LABELS.length - Math.PI / 2;
      return { x: center + radius * level * Math.cos(angle), y: center + radius * level * Math.sin(angle) };
    });
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Cognitive Fingerprint Radar">
        {gridRings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke={i === rings - 1 ? '#E5E7EB' : '#F3F4F6'} strokeWidth={i === rings - 1 ? 1.5 : 1} />
        ))}
        {FINGERPRINT_LABELS.map((_, i) => {
          const angle = (Math.PI * 2 * i) / FINGERPRINT_LABELS.length - Math.PI / 2;
          return (
            <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="#F3F4F6" strokeWidth={1} />
          );
        })}

        {overlay && (
          <polygon
            points={polygonPoints(overlay, '#9CA3AF')}
            fill="rgba(107,114,128,0.08)"
            stroke="#9CA3AF"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            strokeLinejoin="round"
          />
        )}

        {fingerprint && (
          <polygon
            points={polygonPoints(fingerprint, '#F26522')}
            fill="rgba(242,101,34,0.18)"
            stroke="#F26522"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )}

        {fingerprint &&
          FINGERPRINT_LABELS.map((dim, i) => {
            const p = point(fingerprintValue(fingerprint, dim.key), i, FINGERPRINT_LABELS.length);
            return <circle key={dim.key} cx={p.x} cy={p.y} r={3.5} fill="#F26522" stroke="#fff" strokeWidth={1.5} />;
          })}
      </svg>

      <div className="grid grid-cols-3 gap-x-6 gap-y-2 mt-4 w-full max-w-[420px]">
        {FINGERPRINT_LABELS.map(dim => {
          const value = fingerprintValue(fingerprint, dim.key);
          return (
            <div key={dim.key} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-500 font-medium whitespace-nowrap">{dim.short}</span>
              <span className="font-bold text-gray-900 tabular-nums">{value.toFixed(0)}</span>
            </div>
          );
        })}
      </div>

      {overlay && (
        <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-gray-400" />
          {overlayLabel}
        </p>
      )}
    </div>
  );
}
