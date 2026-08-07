'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Analytics,
  CheckmarkFilled,
  ChevronDown,
  ChevronUp,
  CircleDash,
  Flash,
  Idea,
  Time,
  Warning,
  WarningFilled,
} from '@carbon/icons-react';
import CognitiveFingerprintRadar, { CognitiveDimensions } from './CognitiveFingerprintRadar';
import TeamDNAGraph from './TeamDNAGraph';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';


interface SimulationData {
  prediction_30_days: string;
  prediction_90_days: string;
  prediction_180_days: string;
  team_compatibility_score: number;
  success_probability: number;
  cognitive_archetype: string;
  archetype_description: string;
  risk_factors: string[];
  strength_signals: string[];
  recruiter_recommendation: string;
  counter_measure: string;
}

interface BiosphereResult {
  application_id: number;
  candidate_name: string;
  job_title: string;
  fingerprint: CognitiveDimensions;
  simulation: SimulationData;
}

interface Props {
  appId: string | number;
}

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 28;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="5" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <span className="text-[11px] font-semibold text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

function TimelineCard({
  day, text, icon, color, borderColor,
}: {
  day: string; text: string; icon: React.ReactNode; color: string; borderColor: string;
}) {
  return (
    <div className={`rounded-2xl border ${borderColor} p-4 bg-white`}>
      <div className={`flex items-center gap-2 mb-2`}>
        <span className={`${color} [&>svg]:w-4 [&>svg]:h-4`}>{icon}</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{day}</span>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed font-normal">{text}</p>
    </div>
  );
}

export default function BiosphereSimulationPanel({ appId }: Props) {
  const [result, setResult]   = useState<BiosphereResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [open, setOpen]       = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.post(`/biosphere/simulate/${appId}`);
      setResult(data);
      setOpen(true);
    } catch (err: any) {
      setError(err.message || 'Gagal menjalankan simulasi Biosphere');
      toast.error('Gagal menjalankan simulasi');
    } finally {
      setLoading(false);
    }
  };

  const prob = result?.simulation.success_probability ?? 0;
  const comp = result?.simulation.team_compatibility_score ?? 0;

  const probColor  = prob >= 70 ? '#10B981' : prob >= 45 ? '#F59E0B' : '#EF4444';
  const compColor  = comp >= 70 ? '#06B6D4' : comp >= 45 ? '#F59E0B' : '#EF4444';

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 transition-colors"
        onClick={() => result && setOpen(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F26522] to-[#8B5CF6] flex items-center justify-center">
            <Analytics className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Biosphere Simulation
            </h3>
            <p className="text-[11px] text-gray-500 font-normal">
              {result
                ? `${result.simulation.cognitive_archetype} · ${prob}% Success Probability`
                : 'AI-powered predictive performance intelligence'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!result && (
            <button
              onClick={(e) => { e.stopPropagation(); runSimulation(); }}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#F26522] to-[#8B5CF6] text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating…
                </>
              ) : (
                <>
                  <Flash className="w-3.5 h-3.5" />
                  Run Simulation
                </>
              )}
            </button>
          )}
          {result && (open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
        </div>
      </div>

      {error && (
        <div className="px-6 pb-4">
          <p className="text-xs text-red-600 font-medium flex items-center gap-2">
            <Warning className="w-4 h-4" /> {error}
          </p>
        </div>
      )}

      <AnimatePresence>
        {result && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 border-t border-gray-100 pt-6 space-y-8">

              {/* ── Cognitive Fingerprint Radar ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5 text-center">
                  Cognitive Fingerprint — {result.candidate_name}
                </p>
                <CognitiveFingerprintRadar data={result.fingerprint} size={300} />
              </div>

              {/* ── Archetype + Score Rings ── */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Cognitive Archetype
                    </p>
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                      {result.simulation.cognitive_archetype}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 font-normal leading-relaxed">
                      {result.simulation.archetype_description}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <ScoreRing value={prob}  label="Success Probability"     color={probColor} />
                    <ScoreRing value={comp}  label="Team Compatibility"      color={compColor} />
                  </div>
                </div>
              </div>

              {/* ── Timeline Predictions ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Simulation Timeline
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <TimelineCard
                    day="Hari ke-30"
                    text={result.simulation.prediction_30_days}
                    icon={<CircleDash />}
                    color="text-blue-600"
                    borderColor="border-blue-100"
                  />
                  <TimelineCard
                    day="Hari ke-90"
                    text={result.simulation.prediction_90_days}
                    icon={<Time />}
                    color="text-amber-600"
                    borderColor="border-amber-100"
                  />
                  <TimelineCard
                    day="Hari ke-180"
                    text={result.simulation.prediction_180_days}
                    icon={<Idea />}
                    color="text-purple-600"
                    borderColor="border-purple-100"
                  />
                </div>
              </div>

              {/* ── Strengths & Risks ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-100 p-4 bg-emerald-50/40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-3">
                    Strength Signals
                  </p>
                  <ul className="space-y-2">
                    {result.simulation.strength_signals.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-emerald-900">
                        <CheckmarkFilled className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-red-100 p-4 bg-red-50/40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-3">
                    Risk Factors
                  </p>
                  <ul className="space-y-2">
                    {result.simulation.risk_factors.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-900">
                        <WarningFilled className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Recruiter Recommendation ── */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/60">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Recruiter Recommendation
                </p>
                <p className="text-sm text-gray-800 leading-relaxed font-normal">
                  {result.simulation.recruiter_recommendation}
                </p>
                {result.simulation.counter_measure && result.simulation.counter_measure !== '-' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">
                      Counter-Measure Strategy
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">
                      {result.simulation.counter_measure}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Team DNA Graph ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Team DNA Impact Simulation
                </p>
                <TeamDNAGraph
                  candidate={{
                    name: result.candidate_name,
                    archetype: result.simulation.cognitive_archetype,
                    fingerprint: result.fingerprint,
                  }}
                />
              </div>

              {/* Re-run button */}
              <div className="flex justify-end">
                <button
                  onClick={runSimulation}
                  disabled={loading}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                >
                  <Flash className="w-3.5 h-3.5" />
                  {loading ? 'Re-simulating…' : 'Re-run Simulation'}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
