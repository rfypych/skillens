'use client';

import { useState, useEffect } from 'react';
import { Network_2 } from '@carbon/icons-react';
import type { FingerprintValues } from '@/components/CognitiveFingerprintRadar';

export interface TeamMember {
  name: string;
  role: string;
  fingerprint: FingerprintValues;
}

interface Props {
  appId: string;
  getTeam: (appId: string) => Promise<TeamMember[]>;
}

const COLORS = ['#F26522', '#8B5CF6', '#06B6D4', '#10B981', '#6366F1', '#EC4899', '#F59E0B'];

function cellColor(value: number) {
  if (value >= 70) return 'bg-emerald-100 text-emerald-800';
  if (value >= 50) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

export default function TeamDNAGraph({ appId, getTeam }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeam(appId);
        setMembers(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || 'Gagal memuat DNA tim.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const avg = (key: keyof FingerprintValues) => {
    if (members.length === 0) return 0;
    const total = members.reduce((sum, m) => sum + (typeof m.fingerprint?.[key] === 'number' ? m.fingerprint[key] as number : 0), 0);
    return Math.round(total / members.length);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        <Network_2 className="w-5 h-5 text-[#F26522]" />
        DNA Tim (Team Network)
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Memuat komposisi tim…</p>
      ) : error ? (
        <p className="text-sm text-red-600 py-8 text-center">{error}</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">Belum ada data tim untuk divisualisasikan.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-full pl-1.5 pr-3 py-1.5">
                <span
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                  style={{ background: COLORS[i % COLORS.length] }}
                >
                  {(m.name.split(' ').map(n => n[0]).join('') || '?').slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-gray-800">{m.name}</span>
                <span className="text-[10px] text-gray-400">{m.role}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {([
              { key: 'analytical_depth', label: 'Kedalaman Analitik' },
              { key: 'communication_clarity', label: 'Kejelasan Komunikasi' },
              { key: 'execution_velocity', label: 'Kecepatan Eksekusi' },
              { key: 'integrity_index', label: 'Indeks Integritas' },
              { key: 'creative_synthesis', label: 'Sintesis Kreatif' },
              { key: 'pressure_resilience', label: 'Ketahanan Tekanan' },
            ] as { key: keyof FingerprintValues; label: string }[]).map(dim => {
              const v = avg(dim.key);
              return (
                <div key={dim.key} className="border border-gray-100 rounded-2xl p-3">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2">{dim.label}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="h-full rounded-full bg-[#F26522]" style={{ width: `${v}%` }} />
                  </div>
                  <p className={`text-xs font-bold inline-block px-2 py-0.5 rounded-full ${cellColor(v)}`}>{v}/100 rata-rata tim</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
