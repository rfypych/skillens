'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flash, Renew, WarningAlt, CheckmarkOutline, Target, Light } from '@carbon/icons-react';
import { api } from '@/lib/api';
import CognitiveFingerprintRadar, { type FingerprintValues, fingerprintValue } from '@/components/CognitiveFingerprintRadar';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';

interface SimulationData {
  prediction_30_days?: string;
  prediction_90_days?: string;
  prediction_180_days?: string;
  team_compatibility_score?: number;
  success_probability?: number;
  cognitive_archetype?: string;
  archetype_description?: string;
  risk_factors?: string[];
  strength_signals?: string[];
  recruiter_recommendation?: string;
  counter_measure?: string;
}

interface Props {
  appId: string;
  fingerprint: FingerprintValues | null;
  teamAverage?: FingerprintValues | null;
}

const TimelineCard = ({ label, text, icon }: { label: string; text?: string; icon: React.ReactNode }) => (
  <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60">
    <p className="text-xs font-bold text-[#F26522] uppercase tracking-wider flex items-center gap-1.5 mb-2">{icon}{label}</p>
    <p className="text-sm leading-relaxed text-gray-700 font-normal">{text || 'Belum tersedia.'}</p>
  </div>
);

const PillList = ({ title, items, danger }: { title: string; items?: string[]; danger?: boolean }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
    {items && items.length > 0 ? (
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${danger ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="font-normal">{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-400 italic">Tidak ada data.</p>
    )}
  </div>
);

export default function BiosphereSimulationPanel({ appId, fingerprint, teamAverage }: Props) {
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ranOnce, setRanOnce] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post(`/biosphere/simulate/${appId}`);
      setSimulation(data.simulation ?? data);
      setRanOnce(true);
    } catch (e: any) {
      setError(e.message || 'Simulasi gagal dijalankan.');
    } finally {
      setLoading(false);
    }
  };

  const sim = simulation;
  const compat = typeof sim?.team_compatibility_score === 'number' ? sim.team_compatibility_score : null;
  const success = typeof sim?.success_probability === 'number' ? sim.success_probability : null;

  return (
    <div className="space-y-6">
      {/* Fingerprint */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Target className="w-5 h-5 text-[#F26522]" />
          Cognitive Fingerprint
        </h3>
        <CognitiveFingerprintRadar fingerprint={fingerprint} overlay={teamAverage} />
      </div>

      {/* Trigger */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Flash className="w-5 h-5 text-[#F26522]" />
          Simulasi Digital Twin (Oracle Report)
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Biosphere menempatkan digital twin kandidat ke dalam ekosistem organisasi dan mensimulasikan
          10.000 jam interaksi kerja untuk memprediksi performa, konflik tim, burnout, hingga risiko resign.
        </p>
        <button
          onClick={runSimulation}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <ThinkingIndicator className="text-xs" /> : <Flash className="w-4 h-4" />}
          {loading ? 'Menjalankan simulasi…' : sim ? 'Jalankan Ulang Simulasi' : 'Jalankan Simulasi'}
        </button>
        {error && <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5"><WarningAlt className="w-4 h-4" />{error}</p>}
      </div>

      {/* Report */}
      <AnimatePresence mode="wait">
        {(loading && !ranOnce) && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white p-10 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col items-center gap-4">
            <ThinkingIndicator />
            <p className="text-sm text-gray-500 font-medium">Biosphere sedang mensimulasikan 10.000 jam kerja…</p>
          </motion.div>
        )}

        {!loading && sim && (
          <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Archetype + Scores */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#F26522]/10 text-[#F26522] flex items-center justify-center">
                    <Light className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Arketipe Kognitif</p>
                    <p className="text-xl font-bold text-gray-900">{sim.cognitive_archetype || 'Unknown'}</p>
                    <p className="text-sm text-gray-500 font-normal">{sim.archetype_description}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {[
                    { label: 'Kecocokan Tim', value: compat, color: compat !== null && compat < 60 ? 'text-red-600' : 'text-gray-900' },
                    { label: 'Probabilitas Sukses', value: success, color: success !== null && success < 60 ? 'text-red-600' : 'text-gray-900' },
                  ].map(m => (
                    <div key={m.label} className="text-center bg-gray-50 rounded-2xl px-5 py-3">
                      <p className={`text-2xl font-bold tabular-nums ${m.color}`}>{m.value !== null ? m.value : '-'}<span className="text-sm text-gray-400">/100</span></p>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TimelineCard label="30 Hari Pertama" text={sim.prediction_30_days} icon={<Renew className="w-3.5 h-3.5" />} />
              <TimelineCard label="90 Hari" text={sim.prediction_90_days} icon={<Renew className="w-3.5 h-3.5" />} />
              <TimelineCard label="180 Hari" text={sim.prediction_180_days} icon={<Renew className="w-3.5 h-3.5" />} />
            </div>

            {/* Strength & Risk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                <PillList title="Sinyal Kekuatan" items={sim.strength_signals} />
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                <PillList title="Faktor Risiko" items={sim.risk_factors} danger />
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rekomendasi Rekruter</p>
              <p className="text-sm text-gray-800 leading-relaxed font-normal">{sim.recruiter_recommendation}</p>
              {sim.counter_measure && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckmarkOutline className="w-4 h-4 text-emerald-600" />Strategi Mitigasi</p>
                  <p className="text-sm text-gray-800 leading-relaxed font-normal">{sim.counter_measure}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
