'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from '@carbon/icons-react';
import CognitiveFingerprintRadar, { type FingerprintValues } from '@/components/CognitiveFingerprintRadar';

interface CandidateEntry {
  application_id: number;
  candidate_name: string;
  fingerprint: FingerprintValues;
}

interface Props {
  appId: string;
  currentName?: string;
  currentFingerprint?: FingerprintValues | null;
  getFingerprint: (appId: string) => Promise<CandidateEntry>;
}

export default function ComparativeFingerprintView({ appId, currentName = 'Kandidat Saat Ini', currentFingerprint, getFingerprint }: Props) {
  const [peers, setPeers] = useState<CandidateEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CandidateEntry | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFingerprint(appId);
        setPeers(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || 'Gagal memuat data perbandingan.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const peersList = peers.filter(p => String(p.application_id) !== String(appId));
  const display = selected ?? peersList[0] ?? null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        Perbandingan dengan Kandidat Lain
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Memuat data perbandingan…</p>
      ) : error ? (
        <p className="text-sm text-red-600 py-8 text-center">{error}</p>
      ) : peersList.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">Belum ada cukup data kandidat untuk dibandingkan.</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 mb-6">
            <select
              value={display?.application_id ?? ''}
              onChange={(e) => {
                const found = peersList.find(p => String(p.application_id) === e.target.value);
                setSelected(found ?? null);
              }}
              className="bg-gray-50 border border-gray-200 text-sm font-semibold rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            >
              {peersList.map(p => (
                <option key={p.application_id} value={p.application_id}>{p.candidate_name} (#{p.application_id})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900 mb-2">{currentName}</p>
              <CognitiveFingerprintRadar fingerprint={currentFingerprint} overlay={display?.fingerprint} overlayLabel={display?.candidate_name ?? ''} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900 mb-2">{display?.candidate_name}</p>
              <CognitiveFingerprintRadar fingerprint={display?.fingerprint} overlay={currentFingerprint} overlayLabel={currentName} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
