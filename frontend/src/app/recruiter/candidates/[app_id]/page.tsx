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


type Tab = 'analysis' | 'replay' | 'transcript';
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
  const isTranscribing = keystrokeMetrics.total_chars > 300 && keystrokeMetrics.backspace_ratio < 0.02;

  const getLabelStyle = (label: string | null, isCheat: boolean) => {
    if (isCheat || label?.includes('Fabricated')) return 'bg-red-50 text-red-700 border-red-200';
    if (label?.includes('Hidden Gem')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label?.includes('Highly Validated')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    return 'bg-amber-50 text-amber-800 border-amber-300';
  };

  const focusScore = Math.max(0, 100 - (result?.tab_switches ?? 0) * 10);
  const authenticityScore = result?.copy_paste_attempts > 0 ? 10 : 100;
  const paceScore = isTranscribing ? 40 : 80;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'analysis', label: 'Analisis AI', icon: ChartBar },
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
                        {result.executive_summary || 'Tidak ada ringkasan tersedia.'}
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
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-600">Fokus & Perhatian</span>
                          <span className="text-gray-900">{focusScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#F26522] h-full rounded-full" style={{ width: `${focusScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-600">Keaslian Penulisan</span>
                          <span className="text-gray-900">{authenticityScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${authenticityScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
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

            {/* ── Biosphere Simulation Panel (inside flex-1) ── */}
            <div className="mt-6">
              <BiosphereSimulationPanel appId={appId} />
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="w-full md:w-64 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2 shrink-0">
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
