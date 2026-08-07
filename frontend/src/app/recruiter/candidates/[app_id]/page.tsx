'use client';

import { Archive, ArrowLeft, ChartBar, CheckmarkOutline, Document, Idea, Pause, Play, Security, SkipBack, SkipForward, Time, Video, Warning } from '@carbon/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import clsx from 'clsx';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';
import BiosphereSimulationPanel from '@/components/BiosphereSimulationPanel';
import ComparativeFingerprintView from '@/components/ComparativeFingerprintView';
import TeamDNAGraph, { type TeamMember } from '@/components/TeamDNAGraph';
import type { FingerprintValues } from '@/components/CognitiveFingerprintRadar';

type Tab = 'analysis' | 'replay' | 'transcript' | 'biosphere';
const SPEED_OPTIONS = [0.5, 1, 2, 5];

export default function CandidateForensicReport() {
  const params = useParams();
  const router = useRouter();
  const appId = params.app_id as string;

  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [fingerprint, setFingerprint] = useState<FingerprintValues | null>(null);
  const [teamAverage, setTeamAverage] = useState<FingerprintValues | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<any>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/applications/${appId}`, { status: newStatus });
      setApp((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status kandidat diperbarui ke ${newStatus}`);
    } catch {
      toast.error('Gagal memperbarui status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Apakah Anda yakin ingin mengarsipkan kandidat ini?')) return;
    setUpdatingStatus(true);
    try {
      await api.delete(`/applications/${appId}`);
      toast.success('Kandidat berhasil diarsipkan');
      router.push('/recruiter/candidates');
    } catch {
      toast.error('Gagal mengarsipkan kandidat');
      setUpdatingStatus(false);
    }
  };

  const handleAnalyzeCV = async () => {
    setCvLoading(true);
    setCvError(null);
    try {
      const data = await api.post(`/biosphere/analyze-cv/${appId}`);
      setCvAnalysis(data.cv_analysis ?? data);
    } catch (e: any) {
      setCvError(e.message || 'Analisis CV gagal.');
    } finally {
      setCvLoading(false);
    }
  };

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const data = await api.get(`/applications/${appId}`);
        setApp(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };

    fetchApp();
    const interval = setInterval(() => {
      setApp((prev: any) => {
        if (prev?.assessment_results?.length > 0) {
          const latest = prev.assessment_results[prev.assessment_results.length - 1];
          if (latest.claim_vs_evidence_label === 'Pending AI Evaluation') fetchApp();
        }
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [appId, router]);

  let replayHistory: { time: number; chat: any[]; input: string }[] = [];
  const result = app?.assessment_results?.[app.assessment_results.length - 1] ?? null;
  if (result?.replay_history) {
    try { replayHistory = JSON.parse(result.replay_history); } catch { }
  }

  useEffect(() => {
    const jobId = app?.job?.id;
    if (!jobId) return;

    api.get(`/biosphere/fingerprint/${appId}`)
      .then((data) => setFingerprint(data.fingerprint ?? null))
      .catch(() => setFingerprint(null));

    api.get(`/biosphere/team/${jobId}`)
      .then((data) => {
        const team: any[] = data.team ?? [];
        if (team.length === 0) return;
        const keys = ['analytical_depth', 'communication_clarity', 'execution_velocity', 'integrity_index', 'creative_synthesis', 'pressure_resilience'] as const;
        const avg: any = {};
        keys.forEach(k => {
          const sum = team.reduce((acc, m) => acc + (m.fingerprint?.[k] ?? 0), 0);
          avg[k] = Math.round((sum / team.length) * 10) / 10;
        });
        setTeamAverage(avg);
      })
      .catch(() => setTeamAverage(null));
  }, [appId, app?.job?.id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [replayIndex]);

  useEffect(() => {
    if (isPlaying && replayHistory.length > 0) {
      if (replayIndex >= replayHistory.length - 1) {
        setIsPlaying(false);
        return;
      }
      const rawDelta = replayHistory[replayIndex + 1].time - replayHistory[replayIndex].time;
      const cappedDelta = Math.min(rawDelta, 1500);
      const delay = Math.max(cappedDelta / playbackSpeed, 1);
      const timer = setTimeout(() => {
        setReplayIndex(r => r + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, replayIndex, replayHistory.length, playbackSpeed]);

  let chatTranscript: any[] = [];
  if (result?.candidate_answer) {
    try { chatTranscript = JSON.parse(result.candidate_answer); }
    catch { chatTranscript = [{ role: 'user', content: result.candidate_answer }]; }
  }

  let keystrokeMetrics = { total_chars: 0, backspace_count: 0, backspace_ratio: 0.05 };
  if (result?.keystroke_metrics) {
    try { keystrokeMetrics = JSON.parse(result.keystroke_metrics); } catch { }
  }

  const getLabelStyle = (label: string | null, isCheat: boolean) => {
    if (isCheat || label?.includes('Fabricated')) return 'bg-red-50 text-red-700 border-red-200';
    if (label?.includes('Hidden Gem')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label?.includes('Highly Validated')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    return 'bg-amber-50 text-amber-800 border-amber-300';
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'analysis', label: 'Analisis AI', icon: ChartBar },
    { key: 'biosphere', label: 'Biosphere', icon: Idea },
    { key: 'replay', label: 'Pemutaran Ulang', icon: Video },
    { key: 'transcript', label: 'Transkrip Jawaban', icon: Document },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <ThinkingIndicator />
    </div>
  );

  if (!app) return (
    <div className="p-10 text-center text-red-600 font-bold">Lamaran tidak ditemukan.</div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-10 font-sans">
      <Toaster position="top-right" />
      <Link href="/recruiter/candidates" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Kandidat
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold text-gray-900">{app.user?.full_name}</h1>
            {result && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getLabelStyle(result.claim_vs_evidence_label, result.ai_cheating_detected)}`}>
                {result.ai_cheating_detected ? <Security className="w-4 h-4" /> : <CheckmarkOutline className="w-4 h-4" />}
                {result.ai_cheating_detected ? 'Terindikasi Palsu' : result.claim_vs_evidence_label ?? 'Menunggu'}
              </span>
            )}
          </div>
          <p className="text-gray-500 font-medium text-sm">{app.user?.email} • APP-{appId}</p>
        </div>

        {result && (
          <div className="flex flex-col sm:flex-row items-end gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Kandidat</label>
              <select
                value={app?.status || 'applied'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-[#F26522] block w-full p-2.5 font-semibold appearance-none cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <option value="applied">Terdaftar</option>
                <option value="testing">Mengikuti Ujian</option>
                <option value="evaluated">Dalam Peninjauan</option>
                <option value="interview">Wawancara</option>
                <option value="hired">Diterima</option>
                <option value="rejected">Tidak Terpilih</option>
              </select>
            </div>
            
            {app?.resume_url && (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}${app.resume_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 sm:mt-0"
              >
                <TextRollButton text="Lihat CV" variant="white" size="sm" />
              </a>
            )}

            <button
              onClick={handleArchive}
              disabled={updatingStatus}
              className="mt-5 sm:mt-0 px-4 h-[40px] bg-red-50 text-red-600 rounded-full border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50"
            >
              <Archive className="w-4 h-4" />
              Arsipkan
            </button>

            <div className="hidden sm:block w-px h-10 bg-gray-200 mx-2" />

            <div className="text-right w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-gray-100 pt-3 sm:pt-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Skor Bukti</p>
              <p className={`text-3xl font-bold ${result.overall_score < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                {result.overall_score?.toFixed(0) ?? '-'}<span className="text-lg text-gray-400">/100</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {!result ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <p className="text-gray-500 font-medium">Kandidat belum menyelesaikan tes evaluasi.</p>
        </div>
      ) : (
        <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Executive Summary */}
                  <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Idea className="w-5 h-5 text-[#F26522]" />
                      Ringkasan Evaluasi AI
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result.evaluation_feedback || 'Tidak ada ringkasan tersedia.'}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Telemetry Integrity Cards */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Security className="w-5 h-5 text-[#F26522]" />
                      Integritas Ujian & Perilaku
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600 font-medium">Perpindahan Tab</span>
                        <span className={`font-bold ${result.tab_switches > 3 ? 'text-red-600' : 'text-gray-900'}`}>{result.tab_switches}x</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600 font-medium">Peristiwa Copy-Paste</span>
                        <span className={`font-bold ${result.copy_paste_attempts > 0 ? 'text-red-600' : 'text-emerald-700'}`}>{result.copy_paste_attempts}x</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Deteksi Kode AI</span>
                        <span className={`font-bold ${result.ai_cheating_detected ? 'text-red-600' : 'text-emerald-700'}`}>
                          {result.ai_cheating_detected ? 'Terdeteksi' : 'Bersih'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <ChartBar className="w-5 h-5 text-[#F26522]" />
                      Rincian Skor Performa
                    </h3>
                    <div className="space-y-4 text-sm">
                      {[
                        { label: 'Pemahaman Masalah', value: result.score_problem_understanding, color: '#F26522' },
                        { label: 'Pendekatan Solusi', value: result.score_solution_approach, color: '#8B5CF6' },
                        { label: 'Logika & Eksekusi', value: result.score_logic_execution, color: '#06B6D4' },
                        { label: 'Komunikasi', value: result.score_communication, color: '#10B981' },
                        { label: 'Kualitas Respons', value: result.score_response_quality, color: '#6366F1' },
                      ].map(s => {
                        const v = s.value ?? null;
                        return (
                          <div key={s.label}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-gray-600">{s.label}</span>
                              <span className="text-gray-900">{v !== null ? v.toFixed(0) : '-'}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${v ?? 0}%`, background: s.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'biosphere' && (
                <motion.div
                  key="biosphere"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* CV Analysis */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Document className="w-5 h-5 text-[#F26522]" />
                      Analisis CV (AI)
                    </h3>

                    {!cvAnalysis && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-sm text-gray-600 font-normal">
                          Ekstrak skill, klaim pengalaman, tanda bahaya, dan area fokus wawancara dari CV kandidat secara otomatis.
                        </p>
                        <button
                          onClick={handleAnalyzeCV}
                          disabled={cvLoading}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
                        >
                          {cvLoading ? <ThinkingIndicator className="text-xs" /> : <Idea className="w-4 h-4" />}
                          {cvLoading ? 'Menganalisis…' : 'Analisis CV'}
                        </button>
                      </div>
                    )}
                    {cvError && <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5"><Warning className="w-4 h-4" />{cvError}</p>}

                    {cvAnalysis && (
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-center bg-gray-50 rounded-2xl px-5 py-3">
                            <p className="text-2xl font-bold tabular-nums">{cvAnalysis.cv_quality_score ?? '-'}<span className="text-sm text-gray-400">/100</span></p>
                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kualitas CV</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimasi Pengalaman</p>
                            <p className="text-xl font-bold text-gray-900">{cvAnalysis.years_experience_estimate ?? '-'} tahun</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-800 leading-relaxed font-normal">{cvAnalysis.summary}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skill Terverifikasi</p>
                            <div className="flex flex-wrap gap-2">
                              {(cvAnalysis.extracted_skills ?? []).map((s: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kekuatan Menonjol</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.notable_strengths ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Klaim Tanpa Bukti</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.missing_evidence ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanda Bahaya</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.red_flags ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Area Fokus Wawancara</p>
                          <div className="flex flex-wrap gap-2">
                            {(cvAnalysis.interview_focus_areas ?? []).map((s: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fingerprint + Simulation */}
                  <BiosphereSimulationPanel appId={appId} fingerprint={fingerprint} teamAverage={teamAverage} />

                  {/* Comparative */}
                  <ComparativeFingerprintView
                    appId={appId}
                    currentName={app.user?.full_name || 'Kandidat Saat Ini'}
                    currentFingerprint={fingerprint}
                    getFingerprint={async () => {
                      const jobId = app?.job?.id;
                      if (!jobId) return [];
                      const data = await api.get(`/biosphere/team/${jobId}`);
                      return (data.team ?? []).map((m: any) => ({ application_id: m.application_id, candidate_name: m.candidate_name, fingerprint: m.fingerprint }));
                    }}
                  />

                  {/* Team DNA */}
                  <TeamDNAGraph
                    appId={appId}
                    getTeam={async () => {
                      const jobId = app?.job?.id;
                      if (!jobId) return [];
                      const data = await api.get(`/biosphere/team/${jobId}`);
                      return (data.team ?? []).map((m: any) => ({ name: m.candidate_name, role: m.role, fingerprint: m.fingerprint }));
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'replay' && (
                <motion.div
                  key="replay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-0">Pemutaran Ulang Proses</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-full px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      >
                        {SPEED_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}x</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (replayHistory.length === 0) return;
                          if (isPlaying) { setIsPlaying(false); return; }
                          if (replayIndex >= replayHistory.length - 1) setReplayIndex(0);
                          setIsPlaying(true);
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40"
                        disabled={replayHistory.length === 0}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlaying ? 'Jeda' : 'Putar'}
                      </button>
                    </div>
                  </div>

                  {replayHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 font-normal py-8 text-center">
                      Tidak ada riwayat pemutaran yang tersedia untuk kandidat ini.
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 py-2">
                        <button
                          onClick={() => { setReplayIndex(0); setIsPlaying(false); }}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Ke awal"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#F26522] transition-all duration-200"
                            style={{ width: `${((replayIndex + 1) / replayHistory.length) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setReplayIndex(prev => Math.max(0, prev - 1));
                          }}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                          title="Mundur"
                        >
                          <SkipBack className="w-4 h-4 rotate-180" />
                        </button>
                        <span className="text-xs font-mono text-gray-500 font-semibold w-16 text-right">
                          {Math.round((replayIndex / Math.max(replayHistory.length - 1, 1)) * 100)}%
                        </span>
                      </div>

                      <div className="max-h-[520px] overflow-y-auto pr-2 space-y-4 border-t border-gray-100 pt-4" ref={chatEndRef}>
                        {replayHistory[replayIndex]?.chat?.map((msg: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 text-white ml-8' : 'bg-gray-100 text-gray-900 mr-8'}`}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{msg.role === 'user' ? 'Kandidat' : 'Penguji AI'}</p>
                            <p className="text-sm leading-relaxed font-normal">{msg.content}</p>
                          </div>
                        ))}
                        {replayHistory[replayIndex]?.input && (
                          <p className="text-xs text-gray-400 italic px-1">Draft input saat itu: "{replayHistory[replayIndex].input}"</p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'transcript' && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Transkrip Lengkap Wawancara AI</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {chatTranscript.map((msg: any, idx: number) => (
                      <div key={idx} className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 text-white ml-8' : 'bg-gray-100 text-gray-900 mr-8'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{msg.role === 'user' ? 'Kandidat' : 'Penguji AI'}</p>
                        <p className="text-sm leading-relaxed font-normal">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Navigation Controls */}
          <div className="w-full md:w-64 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Navigasi Laporan</p>
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    isActive ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
