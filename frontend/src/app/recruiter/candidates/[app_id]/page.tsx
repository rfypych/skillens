'use client';

import {
  RiArchiveLine,
  RiArrowLeftLine,
  RiBarChartLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiImageLine,
  RiLightbulbLine,
  RiPauseLine,
  RiPlayLine,
  RiShieldCheckLine,
  RiSkipBackLine,
  RiSkipForwardLine,
  RiVideoLine,
} from '@remixicon/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import { cx } from '@/utils/cx';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Chip } from '@/components/base/badges/chip';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import BiosphereSimulationPanel from '@/components/BiosphereSimulationPanel';
import ComparativeFingerprintView from '@/components/ComparativeFingerprintView';
import TeamDNAGraph, { type TeamMember } from '@/components/TeamDNAGraph';
import type { FingerprintValues } from '@/components/CognitiveFingerprintRadar';
import type {
  ApplicationDetail,
  ChatMessage,
  CvAnalysis,
  IconComponent,
  ReplayEntry,
  TeamApiItem,
} from '@/types/api';

type Tab = 'analysis' | 'replay' | 'transcript' | 'biosphere';
const SPEED_OPTIONS = [0.5, 1, 2, 5];

const NATIVE_SELECT_CLASSES =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-50';

export default function CandidateForensicReport() {
  const params = useParams();
  const router = useRouter();
  const _rawAppId = params.app_id as string | string[];
  const appId = Array.isArray(_rawAppId) ? _rawAppId[0] : _rawAppId;

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [fingerprint, setFingerprint] = useState<FingerprintValues | null>(null);
  const [teamAverage, setTeamAverage] = useState<FingerprintValues | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/applications/${appId}`, { status: newStatus });
      setApp((prev: ApplicationDetail | null) => ({ ...prev, status: newStatus } as ApplicationDetail));
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
    } catch (e: unknown) {
      setCvError(e instanceof Error ? e.message : 'Analisis CV gagal.');
    } finally {
      setCvLoading(false);
    }
  };

  const [visualAnalysis, setVisualAnalysis] = useState<any>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);

  const refreshVisual = async () => {
    try {
      const data = await api.get(`/applications/${appId}`);
      if (data?.resume_visual_analysis) {
        setVisualAnalysis(JSON.parse(data.resume_visual_analysis));
        setApp(data);
        return true;
      }
    } catch { /* ignore */ }
    return false;
  };

  const handleAnalyzePhotos = async () => {
    setVisualLoading(true);
    setVisualError(null);
    try {
      const res = await api.post(`/biosphere/analyze-photos/${appId}`);
      if (res?.status === 'ready') {
        setVisualAnalysis(res.visual_analysis);
        setVisualLoading(false);
        return;
      }
      // Background job (±1-3 mnt/foto, CPU lokal): poll sampai hasil tersimpan.
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 15000));
        if (await refreshVisual()) break;
      }
      if (!visualAnalysis) {
        const done = await refreshVisual();
        if (!done) setVisualError('Analisis masih berjalan — muat ulang halaman ini sebentar lagi.');
      }
    } catch (e: unknown) {
      setVisualError(e instanceof Error ? e.message : 'Analisis visual gagal.');
    } finally {
      setVisualLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (app?.resume_visual_analysis) setVisualAnalysis(JSON.parse(app.resume_visual_analysis));
    } catch { /* ignore */ }
  }, [app?.resume_visual_analysis]);

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
      setApp((prev: ApplicationDetail | null) => {
        const results = prev?.assessment_results;
        if (results && results.length > 0) {
          const latest = results[results.length - 1];
          if (latest.claim_vs_evidence_label === 'Pending AI Evaluation') fetchApp();
        }
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [appId, router]);

  let replayHistory: ReplayEntry[] = [];
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
        const team: TeamApiItem[] = data.team ?? [];
        if (team.length === 0) return;
        const keys = ['analytical_depth', 'communication_clarity', 'execution_velocity', 'integrity_index', 'creative_synthesis', 'pressure_resilience'] as const;
        const avg: Record<string, number> = {};
        keys.forEach(k => {
          const sum = team.reduce((acc, m) => acc + (m.fingerprint?.[k] ?? 0), 0);
          avg[k] = Math.round((sum / team.length) * 10) / 10;
        });
        setTeamAverage(avg as unknown as FingerprintValues);
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

  let chatTranscript: ChatMessage[] = [];
  if (result?.candidate_answer) {
    try { chatTranscript = JSON.parse(result.candidate_answer); }
    catch { chatTranscript = [{ role: 'user', content: result.candidate_answer }]; }
  }

  let keystrokeMetrics = { total_chars: 0, backspace_count: 0, backspace_ratio: 0.05 };
  if (result?.keystroke_metrics) {
    try { keystrokeMetrics = JSON.parse(result.keystroke_metrics); } catch { }
  }

  const getLabelChipColor = (label: string | null | undefined, isCheat: boolean | undefined): 'rose' | 'lime' | 'yellow' => {
    if (isCheat || label?.includes('Fabricated')) return 'rose';
    if (label?.includes('Hidden Gem')) return 'lime';
    if (label?.includes('Highly Validated')) return 'lime';
    return 'yellow';
  };

  const tabs: { key: Tab; label: string; icon: IconComponent }[] = [
    { key: 'analysis', label: 'Analisis AI', icon: RiBarChartLine },
    { key: 'biosphere', label: 'Biosphere', icon: RiLightbulbLine },
    { key: 'replay', label: 'Pemutaran Ulang', icon: RiVideoLine },
    { key: 'transcript', label: 'Transkrip Jawaban', icon: RiFileTextLine },
  ];

  if (loading) return (
    <div className="min-h-screen bg-background-full flex items-center justify-center">
      <ThinkingIndicator />
    </div>
  );

  if (!app) return (
    <div className="min-h-screen bg-background-full p-10 text-center text-body-medium text-text-error-primary">Lamaran tidak ditemukan.</div>
  );

  return (
    <div className="min-h-screen bg-background-full">
      <div className="max-w-7xl mx-auto pb-10 px-4 sm:px-6">
        <Toaster position="top-right" />
        <Link href="/recruiter/candidates" className="inline-flex items-center gap-2 text-body-medium text-text-secondary hover:text-text-primary transition-colors mb-6 pt-6">
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke Daftar Kandidat
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-title-1-medium text-text-primary">{app.user?.full_name}</h1>
              {result && (
                <span className="inline-flex items-center gap-1.5">
                  {result.ai_cheating_detected
                    ? <RiShieldCheckLine className="size-4 text-text-error-primary" aria-hidden />
                    : <RiCheckLine className="size-4 text-foreground-icon-primary" aria-hidden />}
                  <Chip variant="bold" color={getLabelChipColor(result.claim_vs_evidence_label, result.ai_cheating_detected)}>
                    {result.ai_cheating_detected ? 'Terindikasi Palsu' : result.claim_vs_evidence_label ?? 'Menunggu'}
                  </Chip>
                </span>
              )}
            </div>
            <p className="text-body-regular text-text-secondary">{app.user?.email} / APP-{appId}</p>
          </div>

          {result && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 bg-background-primary-default p-4 rounded-2xl border border-border-button-default shadow-card">
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-caption-1-medium text-text-tertiary uppercase">Status Kandidat</label>
                <select
                  value={app?.status || 'applied'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className={NATIVE_SELECT_CLASSES}
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
                <ButtonLink
                  href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}${app.resume_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="small"
                  leadingIcon={RiFileTextLine}
                >
                  Lihat CV
                </ButtonLink>
              )}

              <Button
                onClick={handleArchive}
                disabled={updatingStatus}
                variant="danger"
                size="small"
                leadingIcon={RiArchiveLine}
              >
                Arsipkan
              </Button>

              <div className="hidden sm:block w-px h-10 bg-separator-border mx-2" />

              <div className="text-right w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-separator-border pt-3 sm:pt-0">
                <p className="text-caption-1-medium text-text-tertiary uppercase mb-1">Skor Bukti</p>
                <p className={cx('text-title-1-medium tabular-nums', (result.overall_score ?? 0) < 60 ? 'text-text-error-primary' : 'text-text-primary')}>
                  {result.overall_score?.toFixed(0) ?? '-'}<span className="text-title-3-semibold text-text-tertiary">/100</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {(() => {
          let photos: string[] = [];
          try {
            photos = app?.resume_images ? JSON.parse(app.resume_images) : [];
            if (!Array.isArray(photos)) photos = [];
          } catch { photos = []; }
          if (photos.length === 0) return null;
          const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
          return (
            <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card">
              <h3 className="text-title-3-semibold text-text-primary mb-1 flex items-center gap-2">
                <RiImageLine className="size-5 text-accent-600" aria-hidden />
                Dokumentasi Visual Portofolio
              </h3>
              <p className="text-body-small text-text-tertiary mb-4">
                {photos.length} foto bukti kerja terlampir di CV — klik untuk melihat penuh,
                atau jalankan analisis visual AI (butuh kunci API Gemini gratis di server).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {photos.map((src, i) => (
                  <a key={i} href={`${apiBase}${src}`} target="_blank" rel="noopener noreferrer"
                    className="block rounded-2xl overflow-hidden border border-border-button-default hover:border-accent-500 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${apiBase}${src}`} alt={`Dokumentasi kerja ${i + 1}`}
                      className="w-full h-32 object-cover" loading="lazy" />
                  </a>
                ))}
              </div>
              {!visualAnalysis ? (
                <div>
                  <button onClick={handleAnalyzePhotos} disabled={visualLoading}
                    className="px-4 py-2 bg-gray-900 hover:bg-[#F26522] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-60">
                    {visualLoading ? 'Menganalisis foto…' : 'Analisis Visual AI'}
                  </button>
                  {visualError && <p className="text-xs text-red-600 mt-2">{visualError}</p>}
                  {visualLoading && (
                    <p className="text-xs text-gray-500 mt-2">AI membaca foto (±1 menit/foto). Boleh tinggalkan halaman ini.</p>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Hasil analisis visual · {visualAnalysis.engine || 'local'} · {visualAnalysis.analyzed_at?.slice(0, 10) || ''}
                  </p>
                  {(visualAnalysis.findings || []).map((f: any, i: number) => (
                    <div key={i} className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-mono text-xs text-gray-500">Foto {i + 1}: </span>
                      {f.analysis}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {!result ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border-button-default rounded-2xl bg-background-primary-default">
            <p className="text-body-regular text-text-secondary">Kandidat belum menyelesaikan tes evaluasi.</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 w-full">
              {activeTab === 'analysis' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Executive Summary */}
                  <div className="md:col-span-2 bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card">
                    <h3 className="text-title-3-semibold text-text-primary mb-4 flex items-center gap-2 border-b border-separator-border pb-3">
                      <RiLightbulbLine className="size-5 text-accent-600" aria-hidden />
                      Ringkasan Evaluasi AI
                    </h3>
                    <div className="prose prose-sm max-w-none text-body-regular text-text-secondary leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result.evaluation_feedback || 'Tidak ada ringkasan tersedia.'}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Telemetry Integrity Cards */}
                  <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card space-y-4">
                    <h3 className="text-title-3-semibold text-text-primary flex items-center gap-2 border-b border-separator-border pb-3">
                      <RiShieldCheckLine className="size-5 text-accent-600" aria-hidden />
                      Integritas Ujian dan Perilaku
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-separator-border">
                        <span className="text-body-regular text-text-secondary">Perpindahan Tab</span>
                        <span className={cx('text-body-medium tabular-nums', (result.tab_switches ?? 0) > 3 ? 'text-text-error-primary' : 'text-text-primary')}>{result.tab_switches}x</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-separator-border">
                        <span className="text-body-regular text-text-secondary">Peristiwa Copy-Paste</span>
                        <span className={cx('text-body-medium tabular-nums', (result.copy_paste_attempts ?? 0) > 0 ? 'text-text-error-primary' : 'text-text-primary')}>{result.copy_paste_attempts}x</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-body-regular text-text-secondary">Deteksi Kode AI</span>
                        <span className={cx('text-body-medium', result.ai_cheating_detected ? 'text-text-error-primary' : 'text-text-primary')}>
                          {result.ai_cheating_detected ? 'Terdeteksi' : 'Bersih'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card space-y-4">
                    <h3 className="text-title-3-semibold text-text-primary flex items-center gap-2 border-b border-separator-border pb-3">
                      <RiBarChartLine className="size-5 text-accent-600" aria-hidden />
                      Rincian Skor Performa
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Pemahaman Masalah', value: result.score_problem_understanding, bar: 'bg-accent-500' },
                        { label: 'Pendekatan Solusi', value: result.score_solution_approach, bar: 'bg-accent-600' },
                        { label: 'Logika dan Eksekusi', value: result.score_logic_execution, bar: 'bg-accent-700' },
                        { label: 'Komunikasi', value: result.score_communication, bar: 'bg-accent-400' },
                        { label: 'Kualitas Respons', value: result.score_response_quality, bar: 'bg-accent-800' },
                      ].map(s => {
                        const v = s.value ?? null;
                        return (
                          <div key={s.label}>
                            <div className="flex justify-between text-caption-1-medium mb-1">
                              <span className="text-text-secondary">{s.label}</span>
                              <span className="text-text-primary tabular-nums">{v !== null ? v.toFixed(0) : '-'}</span>
                            </div>
                            <div className="w-full bg-background-secondary-default rounded-full h-2 overflow-hidden">
                              <div className={cx('h-full rounded-full', s.bar)} style={{ width: `${v ?? 0}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'biosphere' && (
                <div className="space-y-6">
                  {/* CV Analysis */}
                  <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card">
                    <h3 className="text-title-3-semibold text-text-primary mb-4 flex items-center gap-2 border-b border-separator-border pb-3">
                      <RiFileTextLine className="size-5 text-accent-600" aria-hidden />
                      Analisis CV (AI)
                    </h3>

                    {!cvAnalysis && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-body-regular text-text-secondary">
                          Ekstrak skill, klaim pengalaman, tanda bahaya, dan area fokus wawancara dari CV kandidat secara otomatis.
                        </p>
                        <Button
                          onClick={handleAnalyzeCV}
                          disabled={cvLoading}
                          variant="primary"
                          size="small"
                          leadingIcon={RiLightbulbLine}
                        >
                          {cvLoading ? 'Menganalisis…' : 'Analisis CV'}
                        </Button>
                      </div>
                    )}
                    {cvLoading && !cvAnalysis && (
                      <div className="mt-4 flex justify-start">
                        <ThinkingIndicator />
                      </div>
                    )}
                    {cvError && <p className="mt-3 text-body-regular text-text-error-primary flex items-center gap-1.5"><RiErrorWarningLine className="size-4 shrink-0" aria-hidden />{cvError}</p>}

                    {cvAnalysis && (
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-center bg-background-secondary-default rounded-2xl px-5 py-3">
                            <p className="text-title-2-medium text-text-primary tabular-nums">{cvAnalysis.cv_quality_score ?? '-'}<span className="text-body-regular text-text-tertiary">/100</span></p>
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Kualitas CV</p>
                          </div>
                          <div>
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Estimasi Pengalaman</p>
                            <p className="text-title-2-medium text-text-primary">{cvAnalysis.years_experience_estimate ?? '-'} tahun</p>
                          </div>
                        </div>

                        <p className="text-body-regular text-text-primary leading-relaxed">{cvAnalysis.summary}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Skill Terverifikasi</p>
                            <div className="flex flex-wrap gap-2">
                              {(cvAnalysis.extracted_skills ?? []).map((s: string, i: number) => (
                                <Chip key={i} variant="caption" color="lime">{s}</Chip>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Kekuatan Menonjol</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.notable_strengths ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-body-regular text-text-secondary"><span className="mt-1.5 size-1.5 rounded-full bg-status-lime-text shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Klaim Tanpa Bukti</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.missing_evidence ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-body-regular text-text-secondary"><span className="mt-1.5 size-1.5 rounded-full bg-status-yellow-text shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <p className="text-caption-1-medium text-text-tertiary uppercase">Tanda Bahaya</p>
                            <ul className="space-y-1.5">
                              {(cvAnalysis.red_flags ?? []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-body-regular text-text-secondary"><span className="mt-1.5 size-1.5 rounded-full bg-status-rose-text shrink-0" />{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-separator-border pt-4">
                          <p className="text-caption-1-medium text-text-tertiary uppercase mb-2">Area Fokus Wawancara</p>
                          <div className="flex flex-wrap gap-2">
                            {(cvAnalysis.interview_focus_areas ?? []).map((s: string, i: number) => (
                              <Chip key={i} variant="caption" color="neutral">{s}</Chip>
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
                      return (data.team ?? []).map((m: TeamApiItem) => ({ application_id: m.application_id, candidate_name: m.candidate_name, fingerprint: m.fingerprint }));
                    }}
                  />

                  {/* Team DNA */}
                  <TeamDNAGraph
                    appId={appId}
                    getTeam={async () => {
                      const jobId = app?.job?.id;
                      if (!jobId) return [];
                      const data = await api.get(`/biosphere/team/${jobId}`);
                      return (data.team ?? []).map((m: TeamApiItem) => ({ name: m.candidate_name, role: m.role, fingerprint: m.fingerprint }));
                    }}
                  />
                </div>
              )}

              {activeTab === 'replay' && (
                <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-title-3-semibold text-text-primary">Pemutaran Ulang Proses</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className={cx(NATIVE_SELECT_CLASSES, 'w-auto rounded-full px-3 py-1.5 text-caption-1-medium')}
                        aria-label="Kecepatan pemutaran"
                      >
                        {SPEED_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}x</option>
                        ))}
                      </select>
                      <Button
                        onClick={() => {
                          if (replayHistory.length === 0) return;
                          if (isPlaying) { setIsPlaying(false); return; }
                          if (replayIndex >= replayHistory.length - 1) setReplayIndex(0);
                          setIsPlaying(true);
                        }}
                        variant="primary"
                        size="xs"
                        leadingIcon={isPlaying ? RiPauseLine : RiPlayLine}
                        disabled={replayHistory.length === 0}
                      >
                        {isPlaying ? 'Jeda' : 'Putar'}
                      </Button>
                    </div>
                  </div>

                  {replayHistory.length === 0 ? (
                    <p className="text-body-regular text-text-secondary py-8 text-center">
                      Tidak ada riwayat pemutaran yang tersedia untuk kandidat ini.
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 py-2">
                        <IconButton
                          icon={RiSkipBackLine}
                          size="small"
                          aria-label="Ke awal"
                          onClick={() => { setReplayIndex(0); setIsPlaying(false); }}
                          title="Ke awal"
                        />
                        <div className="flex-1 h-1.5 bg-background-secondary-default rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-500 transition-all duration-200"
                            style={{ width: `${((replayIndex + 1) / replayHistory.length) * 100}%` }}
                          />
                        </div>
                        <IconButton
                          icon={RiSkipForwardLine}
                          size="small"
                          aria-label="Mundur"
                          onClick={() => {
                            setIsPlaying(false);
                            setReplayIndex(prev => Math.max(0, prev - 1));
                          }}
                          title="Mundur"
                        />
                        <span className="text-caption-1-medium text-text-tertiary tabular-nums w-16 text-right">
                          {Math.round((replayIndex / Math.max(replayHistory.length - 1, 1)) * 100)}%
                        </span>
                      </div>

                      <div className="max-h-[520px] overflow-y-auto pr-2 space-y-4 border-t border-separator-border pt-4" ref={chatEndRef}>
                        {replayHistory[replayIndex]?.chat?.map((msg: ChatMessage, idx: number) => (
                          <div key={idx} className={cx('p-4 rounded-2xl', msg.role === 'user' ? 'bg-background-tertiary-default text-text-primary ml-8' : 'bg-background-secondary-default text-text-primary border border-separator-border mr-8')}>
                            <p className="text-caption-1-medium uppercase mb-1 opacity-70">{msg.role === 'user' ? 'Kandidat' : 'Penguji AI'}</p>
                            <p className="text-body-regular leading-relaxed">{msg.content}</p>
                          </div>
                        ))}
                        {replayHistory[replayIndex]?.input && (
                          <p className="text-caption-1-medium text-text-tertiary italic px-1">Draft input saat itu: &ldquo;{replayHistory[replayIndex].input}&rdquo;</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="bg-background-primary-default p-6 rounded-3xl border border-border-button-default shadow-card space-y-4">
                  <h3 className="text-title-3-semibold text-text-primary border-b border-separator-border pb-3">Transkrip Lengkap Wawancara AI</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {chatTranscript.map((msg: ChatMessage, idx: number) => (
                      <div key={idx} className={cx('p-4 rounded-2xl', msg.role === 'user' ? 'bg-background-tertiary-default text-text-primary ml-8' : 'bg-background-secondary-default text-text-primary border border-separator-border mr-8')}>
                        <p className="text-caption-1-medium uppercase mb-1 opacity-70">{msg.role === 'user' ? 'Kandidat' : 'Penguji AI'}</p>
                        <p className="text-body-regular leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Navigation Controls */}
            <div className="w-full md:w-64 bg-background-primary-default p-4 rounded-2xl border border-border-button-default shadow-card space-y-2">
              <p className="text-caption-1-medium text-text-tertiary uppercase px-3 mb-2">Navigasi Laporan</p>
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cx(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-body-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                      isActive ? 'bg-accent-500 text-text-white shadow-xs' : 'text-text-secondary hover:bg-background-secondary-default',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
