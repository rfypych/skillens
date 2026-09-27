'use client';

import {
  RiBold,
  RiBriefcaseLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeLine,
  RiEyeLine,
  RiFileCopyLine,
  RiGroupLine,
  RiItalic,
  RiLightbulbLine,
  RiListUnordered,
  RiLockLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiPencilLine,
  RiSendPlaneLine,
  RiSettings3Line,
  RiSparklingLine,
  RiStarFill,
  RiTimeLine,
  RiUserFollowLine,
} from '@remixicon/react';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RankingTable from '@/components/RankingTable';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import type { ApplicationSummary } from '@/types/api';
import toast, { Toaster } from 'react-hot-toast';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { cx } from '@/utils/cx';

const nativeFieldClass =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring';

const labelClass = 'text-body-medium text-text-primary';
const hintClass = 'mt-1 text-caption-1-medium text-text-tertiary';

type TabKey = 'applicants' | 'interview_ai' | 'kkm_setup' | 'details';

const TABS: { key: TabKey; label: (counts: { apps: number; recs: number }) => string; icon: typeof RiGroupLine }[] = [
  { key: 'applicants', label: ({ apps }) => `Pelamar (${apps})`, icon: RiGroupLine },
  { key: 'interview_ai', label: ({ recs }) => `Rekomendasi AI (${recs})`, icon: RiSparklingLine },
  { key: 'kkm_setup', label: () => 'Simulasi dan KKM', icon: RiSettings3Line },
  { key: 'details', label: () => 'Rincian', icon: RiBriefcaseLine },
];

export default function JobAssessmentReview() {
  const params = useParams();
  const router = useRouter();
  const _rawJobId = params.id as string | string[];
  const jobId = Array.isArray(_rawJobId) ? _rawJobId[0] : _rawJobId;

  const [job, setJob] = useState<any>(null);
  const [assessment, setAssessment] = useState<{scenario_prompt: string, hidden_prompt: string} | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeTab, setActiveTab] = useState<TabKey>('applicants');

  // Job Details & KKM Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary_range: '',
    description: '',
    expected_outcomes: '',
    specific_skills: '',
    kkm_score: 70,
    max_questions: 4,
    status: 'open',
    deadline: ''
  });
  const [trapWord, setTrapWord] = useState('');

  // Interview Schedule State
  const [schedulingAppId, setSchedulingAppId] = useState<number | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduled_at: '',
    location: 'Google Meet / Online',
    notes: 'Sesi wawancara berbasis pembahasan hasil micro-simulation'
  });

  // Post-Interview Score State
  const [scoringInterviewId, setScoringInterviewId] = useState<number | null>(null);
  const [scoreForm, setScoreForm] = useState({
    interview_score: 85,
    score_notes: ''
  });

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('scenario-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = promptValue;
    const selectedText = text.substring(start, end);

    const leadingSpaces = selectedText.match(/^\s*/)?.[0] || '';
    const trailingSpaces = selectedText.match(/\s*$/)?.[0] || '';
    const trimmedSelectedText = selectedText.substring(leadingSpaces.length, selectedText.length - trailingSpaces.length);

    const textToInsert = leadingSpaces + prefix + trimmedSelectedText + suffix + trailingSpaces;

    textarea.focus();
    textarea.setSelectionRange(start, end);

    let success = false;
    try {
      success = document.execCommand('insertText', false, textToInsert);
    } catch (e) {}

    if (!success) {
      const newText = text.substring(0, start) + textToInsert + text.substring(end);
      setPromptValue(newText);
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + leadingSpaces.length + prefix.length,
        end - trailingSpaces.length + prefix.length
      );
    }, 0);
  };

  const fetchJobData = async () => {
    try {
      const jobRes = await api.get(`/jobs/${jobId}`);
      setJob(jobRes);

      let deadlineFormatted = '';
      if (jobRes.deadline) {
        const d = new Date(jobRes.deadline);
        deadlineFormatted = d.toISOString().slice(0, 16);
      }

      setJobForm({
        title: jobRes.title || '',
        location: jobRes.location || '',
        salary_range: jobRes.salary_range || '',
        description: jobRes.description || '',
        expected_outcomes: jobRes.expected_outcomes || '',
        specific_skills: jobRes.specific_skills || '',
        kkm_score: jobRes.kkm_score ?? 70,
        max_questions: jobRes.max_questions ?? 4,
        status: jobRes.status || 'open',
        deadline: deadlineFormatted
      });

      const allApps = await api.get('/applications');
      if (Array.isArray(allApps)) {
        const jobApps = allApps.filter((a: ApplicationSummary) => a.job_id === Number(jobId));
        setApplications(jobApps);
      }

      try {
        const recs = await api.get(`/interviews/recommend/${jobId}`);
        if (Array.isArray(recs)) setRecommendations(recs);
      } catch {
      }

      try {
        const intvs = await api.get('/interviews/recruiter');
        if (Array.isArray(intvs)) {
          setInterviews(intvs);
        }
      } catch {
      }

    } catch (err: any) {
      if (err.message && err.message.includes('403')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [jobId, router]);

  useEffect(() => {
    let isMounted = true;
    const fetchAssessment = async () => {
      try {
        const assessmentRes = await api.get(`/assessment/job/${jobId}`);
        if (isMounted) {
          setAssessment(assessmentRes);
          setPromptValue((prev) => prev || assessmentRes.scenario_prompt);
          setTrapWord(assessmentRes.hidden_prompt || '');
        }
      } catch {
        // Assessment belum siap — panel tampil setelah generate selesai
      }
    };
    fetchAssessment();
    return () => { isMounted = false; };
  }, [jobId]);

  const handleSaveAssessment = async () => {
    setSaving(true);
    try {
      await api.put(`/assessment/job/${jobId}`, { scenario_prompt: promptValue, hidden_prompt: trapWord || undefined });
      // Sinkronkan turn/durasi per-job via max_questions
      if (jobForm.max_questions) {
        await api.put(`/jobs/${jobId}`, { max_questions: Number(jobForm.max_questions) });
      }
      toast.success("Penilaian simulasi berhasil disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan perubahan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveJobDetails = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...jobForm };
      if (jobForm.deadline) {
        payload.deadline = new Date(jobForm.deadline).toISOString();
      } else {
        payload.deadline = null;
      }

      await api.put(`/jobs/${jobId}`, payload);
      setJob({ ...job, ...payload });
      toast.success("Data lowongan & KKM berhasil diperbarui!");
      fetchJobData();
    } catch (err) {
      toast.error("Gagal memperbarui detail lowongan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!job?.magic_link_token) return;
    const link = `${window.location.origin}/candidate/apply/${job.magic_link_token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Tautan evaluasi berhasil disalin');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleInterview = async (appId: number) => {
    if (!scheduleForm.scheduled_at) {
      toast.error("Harap pilih tanggal dan waktu wawancara");
      return;
    }

    const scheduledDate = new Date(scheduleForm.scheduled_at);
    const minNotice = new Date();
    minNotice.setDate(minNotice.getDate() + 1);

    if (scheduledDate < minNotice) {
      toast.error("Sesuai aturan, jadwal wawancara minimal 1-2 hari dari sekarang untuk persiapan kandidat.");
      return;
    }

    setSaving(true);
    try {
      await api.post('/interviews/', {
        application_id: appId,
        scheduled_at: scheduledDate.toISOString(),
        location: scheduleForm.location,
        notes: scheduleForm.notes
      });

      toast.success("Undangan wawancara berhasil dikirim ke kandidat!");
      setSchedulingAppId(null);
      fetchJobData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Gagal menjadwalkan wawancara";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitInterviewScore = async (interviewId: number) => {
    setSaving(true);
    try {
      await api.put(`/interviews/${interviewId}/score`, {
        interview_score: scoreForm.interview_score,
        score_notes: scoreForm.score_notes
      });

      toast.success("Nilai wawancara berhasil diberikan!");
      setScoringInterviewId(null);
      fetchJobData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Gagal memberi nilai");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ThinkingIndicator />
    </div>
  );

  const kkmScore = job?.kkm_score ?? 70;
  const archetypeLabel = job?.archetype === 'lapangan' ? 'Lapangan' : job?.archetype === 'kreatif' ? 'Kreatif' : 'Teknis';

  return (
    <div className="flex w-full flex-col gap-4">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <section className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-title-1-medium text-text-primary">
              {job?.title || 'Detail Lowongan Pekerjaan'}
            </h1>
            <Chip variant="bold" color={job?.status === 'closed' ? 'rose' : 'lime'}>
              {job?.status === 'closed' ? 'Tutup' : 'Aktif'}
            </Chip>
            <Chip variant="caption" color="neutral">{archetypeLabel}</Chip>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-regular text-text-secondary">
            <span className="inline-flex items-center gap-1.5"><RiMapPinLine className="size-4 text-accent-600" aria-hidden />{job?.location || 'Remote'}</span>
            <span className="inline-flex items-center gap-1.5"><RiMoneyDollarCircleLine className="size-4 text-accent-600" aria-hidden />{job?.salary_range || 'N/A'}</span>
            <span className="inline-flex items-center gap-1.5"><RiStarFill className="size-4 text-accent-600" aria-hidden />Batasan KKM: <strong className="font-medium text-text-primary">{kkmScore} / 100</strong></span>
            {job?.deadline && (
              <span className="inline-flex items-center gap-1.5 text-text-error-primary">
                <RiTimeLine className="size-4" aria-hidden />Deadline: {new Date(job.deadline).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            )}
          </div>
        </div>

        {job?.magic_link_token && (
          <Button
            variant="primary"
            size="medium"
            leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
            onClick={handleCopyLink}
            className="w-full lg:w-auto"
          >
            {copied ? 'Tersalin ke Papan Klip' : 'Salin Tautan Evaluasi AI'}
          </Button>
        )}
        <Button
          variant="secondary"
          size="medium"
          leadingIcon={RiPencilLine}
          onClick={() => router.push(`/recruiter/jobs/edit/${jobId}`)}
          className="w-full lg:w-auto"
        >
          Edit Parameter & KKM
        </Button>
      </section>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <Button
              key={t.key}
              variant={isActive ? 'primary' : 'secondary'}
              size="small"
              leadingIcon={Icon}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label({ apps: applications.length, recs: recommendations.length })}
            </Button>
          );
        })}
      </div>

      <div>
        {/* TAB 1: APPLICANTS & REAL-TIME LEADERBOARD */}
        {activeTab === 'applicants' && (
          <div key="applicants" className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:flex-row sm:items-center sm:justify-between md:p-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-title-3-semibold text-text-primary">Hasil Pemeringkatan Real-Time Kandidat</h3>
                <p className="text-body-regular text-text-secondary">Pemeringkatan otomatis berdasarkan total skor micro-simulation vs nilai KKM ({kkmScore}).</p>
              </div>
              <Chip variant="caption" color="neutral">Format: Anonim untuk Pelamar</Chip>
            </div>

            {applications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border-button-default bg-background-primary-default px-6 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-background-secondary-default">
                  <RiUserFollowLine className="size-6 text-foreground-icon-secondary" aria-hidden />
                </span>
                <h3 className="text-title-3-semibold text-text-primary">Belum Ada Pelamar</h3>
                <p className="max-w-md text-body-medium text-text-secondary">Bagikan Tautan Evaluasi AI kepada kandidat untuk mulai menerima pendaftaran dan hasil tes simulasi secara otomatis.</p>
                <Button variant="primary" size="medium" leadingIcon={RiFileCopyLine} onClick={handleCopyLink} className="mt-2">
                  Salin Tautan Evaluasi Lowongan
                </Button>
              </div>
            ) : (
              <RankingTable apps={applications} kkmScore={kkmScore} onInvite={(id) => setSchedulingAppId(id)} />
            )}
          </div>
        )}

        {/* TAB 2: AI RECOMMENDATION & INTERVIEWS */}
        {activeTab === 'interview_ai' && (
          <div key="interview_ai" className="flex flex-col gap-4">
            {/* AI Recommendation Section */}
            <section className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50">
                  <RiSparklingLine className="size-6 text-accent-600" aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-title-2-medium text-text-primary">Rekomendasi Otomatis AI (Kandidat Teratas Lulus KKM)</h2>
                  <p className="text-body-regular text-text-secondary">AI merekomendasikan kandidat terbaik berdasarkan kelulusan KKM ({kkmScore}) dan kualitas jawaban studi kasus.</p>
                </div>
              </div>

              {recommendations.length === 0 ? (
                <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-6 text-center text-body-regular text-text-secondary">
                  Belum ada rekomendasi kandidat yang lulus KKM ({kkmScore}). Pastikan kandidat sudah menyelesaikan tes simulasi.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, i) => {
                    const score = rec.assessment_results?.[0]?.overall_score;
                    const evalResult = rec.assessment_results?.[0];

                    return (
                      <div key={rec.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-border-button-default bg-background-secondary-default p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <Chip variant="caption" color="orange">
                              Rekomendasi #{i + 1}
                            </Chip>
                            <span className="text-title-2-medium tabular-nums text-accent-600">
                              {score} / 100
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-body-medium text-text-primary">{rec.user?.full_name || 'Pelamar Lulus KKM'}</h4>
                            <p className="text-body-regular text-text-secondary">{rec.user?.email}</p>
                          </div>

                          {evalResult?.interview_questions && (
                            <div className="flex flex-col gap-1 rounded-xl border border-separator-border bg-background-tertiary-default p-3.5">
                              <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-accent-600">
                                <RiLightbulbLine className="size-4" aria-hidden />
                                Pertanyaan Rekomendasi AI saat Interview:
                              </span>
                              <p className="text-body-regular italic leading-relaxed text-text-secondary">&ldquo;{evalResult.interview_questions}&rdquo;</p>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="small"
                          leadingIcon={RiCalendarLine}
                          onClick={() => setSchedulingAppId(rec.id)}
                          className="w-full"
                        >
                          Atur Jadwal Wawancara
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* List of Scheduled Interviews */}
            <section className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6">
              <h3 className="inline-flex items-center gap-2 text-title-3-semibold text-text-primary">
                <RiTimeLine className="size-5 text-accent-600" aria-hidden /> Sesi Wawancara Lowongan Ini
              </h3>

              {interviews.length === 0 ? (
                <p className="text-body-regular italic text-text-secondary">Belum ada sesi wawancara yang dijadwalkan.</p>
              ) : (
                <div className="flex flex-col divide-y divide-separator-border">
                  {interviews.map((inv) => (
                    <div key={inv.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip
                            variant="caption"
                            color={
                              inv.status === 'accepted' ? 'lime' :
                              inv.status === 'rejected' ? 'rose' :
                              inv.status === 'completed' ? 'blue' : 'yellow'
                            }
                          >
                            Status: {inv.status}
                          </Chip>
                          <span className="text-body-medium tabular-nums text-text-primary">
                            Jadwal: {new Date(inv.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-body-regular text-text-secondary">Lokasi: {inv.location || 'Online'}</p>
                        {inv.score_notes && (
                          <p className="rounded-xl border border-border-button-default bg-background-secondary-default p-2.5 text-body-regular text-text-primary">
                            Skor Wawancara HRD: {inv.interview_score}/100 - Catatan: {inv.score_notes}
                          </p>
                        )}
                      </div>

                      {inv.status !== 'completed' && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => setScoringInterviewId(inv.id)}
                        >
                          Beri Poin Pemeringkatan
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        {/* Modal Scheduling Interview — root-level agar bisa dibuka dari tab mana pun */}
        {schedulingAppId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="flex w-full max-w-lg flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-dropdown md:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-separator-border pb-3">
                <h3 className="inline-flex items-center gap-2 text-title-3-semibold text-text-primary">
                  <RiCalendarLine className="size-5 text-accent-600" aria-hidden /> Jadwalkan Wawancara Kandidat
                </h3>
                <IconButton icon={RiCloseLine} size="small" aria-label="Tutup dialog jadwal wawancara" onClick={() => setSchedulingAppId(null)} />
              </div>

              <p className="text-body-regular leading-relaxed text-text-secondary">
                Sesuai aturan platform, undangan wawancara wajib diset dengan <strong className="font-medium text-text-primary">jarak minimal 1-2 hari</strong> dari hari ini agar kandidat memiliki waktu konfirmasi (Terima / Tolak).
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="schedule-at" className={labelClass}>Tanggal dan Waktu Wawancara</label>
                  <input
                    id="schedule-at"
                    type="datetime-local"
                    value={scheduleForm.scheduled_at}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_at: e.target.value })}
                    className={nativeFieldClass}
                  />
                </div>

                <Input
                  label="Lokasi / Tautan Sesi (Zoom / Google Meet)"
                  value={scheduleForm.location}
                  onChange={(v) => setScheduleForm({ ...scheduleForm, location: v })}
                  placeholder="https://meet.google.com/xyz..."
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="schedule-notes" className={labelClass}>Catatan Tambahan untuk Kandidat</label>
                  <textarea
                    id="schedule-notes"
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    rows={3}
                    className={cx(nativeFieldClass, 'resize-none')}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <Button variant="secondary" size="small" onClick={() => setSchedulingAppId(null)}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  leadingIcon={RiSendPlaneLine}
                  onClick={() => handleScheduleInterview(schedulingAppId)}
                  disabled={saving}
                >
                  {saving ? 'Mengirim...' : 'Kirim Undangan Wawancara'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Post-Interview Scoring — root-level agar bisa dibuka dari tab mana pun */}
        {scoringInterviewId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-dropdown">
              <h3 className="text-title-3-semibold text-text-primary">Penilaian Poin Sesi Wawancara</h3>
              <p className="text-body-regular text-text-secondary">Berikan nilai wawancara (0 - 100) untuk dikombinasikan dalam hasil pemeringkatan akhir kandidat.</p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="interview-score" className={labelClass}>Skor Wawancara (0-100)</label>
                <input
                  id="interview-score"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreForm.interview_score}
                  onChange={(e) => setScoreForm({ ...scoreForm, interview_score: Number(e.target.value) })}
                  className={cx(nativeFieldClass, 'font-mono tabular-nums')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="interview-score-notes" className={labelClass}>Catatan Evaluasi HRD</label>
                <textarea
                  id="interview-score-notes"
                  value={scoreForm.score_notes}
                  onChange={(e) => setScoreForm({ ...scoreForm, score_notes: e.target.value })}
                  rows={3}
                  className={cx(nativeFieldClass, 'resize-none')}
                  placeholder="Catatan kelebihan / kekurangan jawaban kandidat..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="small" onClick={() => setScoringInterviewId(null)}>Batal</Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleSubmitInterviewScore(scoringInterviewId)}
                  disabled={saving}
                >
                  Simpan Poin
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSESSMENT SIMULATION PROMPT & KKM SETUP */}
        {activeTab === 'kkm_setup' && (
          <div key="kkm_setup" className="flex flex-col gap-4">
            {/* KKM & Status Settings Card */}
            <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6">
              <h3 className="inline-flex items-center gap-2 border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">
                <RiSettings3Line className="size-5 text-accent-600" aria-hidden /> Pengaturan KKM dan Batasan Waktu Lowongan
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-kkm" className={labelClass}>Nilai KKM (Passing Grade 0-100)</label>
                  <input
                    id="job-kkm"
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.kkm_score}
                    onChange={(e) => setJobForm({ ...jobForm, kkm_score: Number(e.target.value) })}
                    className={cx(nativeFieldClass, 'font-mono tabular-nums')}
                  />
                  <p className={hintClass}>Kandidat dengan skor di atas atau sama dengan nilai KKM akan otomatis masuk rekomendasi wawancara.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className={labelClass}>Status Pembukaan Lowongan</span>
                  <Select
                    aria-label="Status pembukaan lowongan"
                    selectedKey={jobForm.status}
                    onSelectionChange={(k) => setJobForm({ ...jobForm, status: String(k) })}
                  >
                    <SelectItem id="open">Aktif (Open)</SelectItem>
                    <SelectItem id="closed">Ditutup (Closed)</SelectItem>
                  </Select>
                  <p className={hintClass}>Status ditutup menghalangi pelamar baru mengakses lowongan ini.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-deadline" className={labelClass}>Waktu Tenggat Lowongan (Deadline)</label>
                  <input
                    id="job-deadline"
                    type="datetime-local"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className={nativeFieldClass}
                  />
                  <p className={hintClass}>Batasan waktu agar lowongan otomatis kadaluarsa setelah tanggal ini.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveJobDetails}
                  disabled={saving}
                >
                  Simpan Pengaturan KKM dan Deadline
                </Button>
              </div>
            </section>

            {/* AI Micro-Simulation Prompt Editor */}
            <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6">
              <div className="flex flex-col gap-4 border-b border-separator-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="inline-flex items-center gap-2 text-title-3-semibold text-text-primary">
                    <RiSparklingLine className="size-5 text-accent-600" aria-hidden /> Skenario Micro-Simulation AI
                  </h3>
                  <p className="text-body-regular text-text-secondary">Skenario studi kasus nyata yang akan diberikan kepada kandidat saat mengerjakan tes.</p>
                </div>

                <div className="flex rounded-full border border-border-button-default bg-background-secondary-default p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className={cx(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-caption-1-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                      viewMode === 'edit' ? 'bg-background-primary-default text-text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <RiPencilLine className="size-3.5" aria-hidden /> Ubah Prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={cx(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-caption-1-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                      viewMode === 'preview' ? 'bg-background-primary-default text-text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <RiEyeLine className="size-3.5" aria-hidden /> Preview Kandidat
                  </button>
                </div>
              </div>

              {viewMode === 'edit' ? (
                <div className="overflow-hidden rounded-2xl border border-border-button-default transition-colors focus-within:border-border-button-hover">
                  <div className="flex items-center gap-1 border-b border-separator-border bg-background-secondary-default px-3 py-1.5">
                    <IconButton icon={RiBold} size="small" aria-label="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('**', '**')} />
                    <IconButton icon={RiItalic} size="small" aria-label="Italic" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('*', '*')} />
                    <div className="mx-1 h-5 w-px bg-background-tertiary-default" />
                    <IconButton icon={RiListUnordered} size="small" aria-label="Bullet list" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('- ')} />
                    <IconButton icon={RiCodeLine} size="small" aria-label="Code block" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('```\n', '\n```')} />
                  </div>
                  <textarea
                    id="scenario-editor"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    rows={14}
                    className="w-full resize-y bg-background-primary-default p-5 font-mono text-body-regular leading-relaxed text-text-primary outline-none placeholder:text-text-placeholder"
                    placeholder="Tuliskan skenario studi kasus dalam format Markdown..."
                  />
                </div>
              ) : (
                <div className="h-[350px] overflow-y-auto rounded-2xl border border-border-button-default bg-background-primary-default p-6 md:h-[450px]">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {promptValue || '*Belum ada konten skenario.*'}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-2xl border border-border-error-default p-4">
                <RiLockLine className="mt-0.5 size-5 shrink-0 text-text-error-primary" aria-hidden />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-caption-1-medium text-text-error-primary">Perangkap Anti-Cheat Scooby-Doo AI</h4>
                    <p className="text-body-regular text-text-secondary">
                      Kata kunci rahasia tersembunyi. Jika kandidat menyalin soal ke AI, kata ini akan terpicu untuk mendeteksi kecurangan.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-end gap-4">
                    <Input
                      label="Trap word (editable)"
                      value={trapWord}
                      onChange={(v) => setTrapWord(v)}
                      placeholder="mis. mentimun"
                      className="min-w-44"
                    />
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="max-questions" className={labelClass}>Turn / durasi per-job (max turn)</label>
                      <input
                        id="max-questions"
                        type="number"
                        min={1}
                        max={15}
                        value={jobForm.max_questions}
                        onChange={(e) => setJobForm({ ...jobForm, max_questions: Number(e.target.value) })}
                        className={cx(nativeFieldClass, 'w-24 font-mono tabular-nums')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="medium"
                  leadingIcon={RiCheckLine}
                  onClick={handleSaveAssessment}
                  disabled={saving}
                >
                  Simpan Skenario Simulasi AI
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: JOB DETAILS & METADATA */}
        {activeTab === 'details' && (
          <div key="details" className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card md:p-6">
            <h3 className="border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">Informasi dan Kriteria Posisi</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Judul Posisi Lowongan"
                value={jobForm.title}
                onChange={(v) => setJobForm({ ...jobForm, title: v })}
              />

              <Input
                label="Lokasi Kerja"
                value={jobForm.location}
                onChange={(v) => setJobForm({ ...jobForm, location: v })}
              />

              <Input
                label="Rentang Gaji"
                value={jobForm.salary_range}
                onChange={(v) => setJobForm({ ...jobForm, salary_range: v })}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="job-description" className={labelClass}>Deskripsi Pekerjaan</label>
                <textarea
                  id="job-description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={5}
                  className={cx(nativeFieldClass, 'resize-y')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="job-outcomes" className={labelClass}>Hasil dan KPI yang Diharapkan (Expected Outcomes)</label>
                <textarea
                  id="job-outcomes"
                  value={jobForm.expected_outcomes}
                  onChange={(e) => setJobForm({ ...jobForm, expected_outcomes: e.target.value })}
                  rows={4}
                  className={cx(nativeFieldClass, 'resize-y')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="job-skills" className={labelClass}>Keahlian Khusus (Specific Skills)</label>
                <textarea
                  id="job-skills"
                  value={jobForm.specific_skills}
                  onChange={(e) => setJobForm({ ...jobForm, specific_skills: e.target.value })}
                  rows={3}
                  className={cx(nativeFieldClass, 'resize-y')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-separator-border pt-4">
              <Button
                variant="primary"
                size="medium"
                onClick={handleSaveJobDetails}
                disabled={saving}
              >
                Simpan Perubahan Lowongan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
