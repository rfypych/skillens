'use client';

import { 
  Checkmark, 
  CheckmarkOutline, 
  Code, 
  CurrencyDollar, 
  Edit, 
  Group, 
  List, 
  Location, 
  Locked, 
  MagicWand, 
  Portfolio, 
  SettingsAdjust, 
  TextBold, 
  TextItalic, 
  Time, 
  UserFollow, 
  StarFilled, 
  Warning, 
  Calendar, 
  View, 
  ChevronRight,
  Copy,
  ArrowRight
} from '@carbon/icons-react';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';

export default function JobAssessmentReview() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
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
  const [activeTab, setActiveTab] = useState<'applicants' | 'interview_ai' | 'kkm_setup' | 'details'>('applicants');

  // Job Details & KKM Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary_range: '',
    description: '',
    expected_outcomes: '',
    specific_skills: '',
    kkm_score: 70,
    status: 'open',
    deadline: ''
  });

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
        status: jobRes.status || 'open',
        deadline: deadlineFormatted
      });

      const allApps = await api.get('/applications');
      if (Array.isArray(allApps)) {
        const jobApps = allApps.filter((a: any) => a.job_id === Number(jobId));
        setApplications(jobApps);
      }

      try {
        const recs = await api.get(`/interviews/recommend/${jobId}`);
        if (Array.isArray(recs)) setRecommendations(recs);
      } catch (e) {
        console.error('Recommendations error', e);
      }

      try {
        const intvs = await api.get('/interviews/recruiter');
        if (Array.isArray(intvs)) {
          setInterviews(intvs);
        }
      } catch (e) {
        console.error('Interviews error', e);
      }

    } catch (err: any) {
      if (err.message && err.message.includes('403')) {
        router.push('/login');
      }
      console.error(err);
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
        }
      } catch (err) {
        console.log("Assessment prompt pending...");
      }
    };
    fetchAssessment();
    return () => { isMounted = false; };
  }, [jobId]);

  const handleSaveAssessment = async () => {
    setSaving(true);
    try {
      await api.put(`/assessment/job/${jobId}`, { scenario_prompt: promptValue });
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
      const payload: any = { ...jobForm };
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
    toast.success('Tautan evaluasi berhasil disalin!');
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
    <div className="min-h-[60vh] flex items-center justify-center">
      <ThinkingIndicator />
    </div>
  );

  const kkmScore = job?.kkm_score ?? 70;
  
  const sortedApps = [...applications].sort((a, b) => {
    const scoreA = a.assessment_results?.[0]?.overall_score ?? 0;
    const scoreB = b.assessment_results?.[0]?.overall_score ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full space-y-8 pb-12 font-sans">
      <Toaster position="top-right" />
      
      {/* Header Banner - Matching Landing Page & App Theme */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {job?.title || 'Detail Lowongan Pekerjaan'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${job?.status === 'closed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {job?.status === 'closed' ? 'Tutup' : 'Aktif'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium pt-1">
            <span className="flex items-center gap-1.5"><Location className="w-4 h-4 text-[#F26522]" />{job?.location || 'Remote'}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><CurrencyDollar className="w-4 h-4 text-[#F26522]" />{job?.salary_range || 'N/A'}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><StarFilled className="w-4 h-4 text-amber-500" />Batasan KKM: <strong className="text-gray-900">{kkmScore} / 100</strong></span>
            {job?.deadline && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                  <Time className="w-4 h-4" />Deadline: {new Date(job.deadline).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                </span>
              </>
            )}
          </div>
        </div>
        
        {job?.magic_link_token && (
          <button 
            onClick={handleCopyLink}
            className="w-full lg:w-auto flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-gray-900 hover:bg-[#F26522] text-white px-5 py-3 rounded-full transition-colors shadow-xs"
          >
            {copied ? <CheckmarkOutline className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Tersalin ke Papan Klip' : 'Salin Tautan Evaluasi AI'}
          </button>
        )}
      </div>

      {/* Primary Navigation Pills */}
      <div className="bg-white p-1.5 rounded-full border border-gray-200/80 shadow-xs inline-flex flex-wrap gap-1 max-w-full">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'applicants' 
              ? 'bg-gray-900 text-white shadow-xs' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Group className="w-4 h-4" />
          Daftar Pelamar ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('interview_ai')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'interview_ai' 
              ? 'bg-gray-900 text-white shadow-xs' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <MagicWand className="w-4 h-4 text-[#F26522]" />
          Rekomendasi AI & Wawancara ({recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('kkm_setup')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'kkm_setup' 
              ? 'bg-gray-900 text-white shadow-xs' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <SettingsAdjust className="w-4 h-4" />
          Setup Simulasi AI & KKM
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'details' 
              ? 'bg-gray-900 text-white shadow-xs' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Portfolio className="w-4 h-4" />
          Rincian Lowongan
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: APPLICANTS & REAL-TIME LEADERBOARD */}
        {activeTab === 'applicants' && (
          <motion.div
            key="applicants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Hasil Pemeringkatan Real-Time Kandidat</h3>
                <p className="text-xs text-gray-500 font-normal">Pemeringkatan otomatis berdasarkan total skor micro-simulation vs nilai KKM ({kkmScore}).</p>
              </div>
              <span className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-1.5 rounded-full font-medium">Format: Anonim untuk Pelamar</span>
            </div>

            {sortedApps.length === 0 ? (
              <div className="bg-white p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center shadow-xs">
                <UserFollow className="w-12 h-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Pelamar</h3>
                <p className="text-sm text-gray-500 max-w-md mb-5 font-normal">Bagikan Tautan Evaluasi AI kepada kandidat untuk mulai menerima pendaftaran dan hasil tes simulasi secara otomatis.</p>
                <button onClick={handleCopyLink} className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#F26522] transition-colors shadow-xs">
                  Salin Tautan Evaluasi Lowongan
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-900">
                    <thead className="bg-gray-50/80 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-4 px-5">Peringkat</th>
                        <th className="py-4 px-5">Pelamar / Kandidat</th>
                        <th className="py-4 px-5">Status Pendaftaran</th>
                        <th className="py-4 px-5">Skor AI (KKM: {kkmScore})</th>
                        <th className="py-4 px-5">Status KKM</th>
                        <th className="py-4 px-5">Deteksi Kecurangan</th>
                        <th className="py-4 px-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sortedApps.map((app, idx) => {
                        const score = app.assessment_results?.[0]?.overall_score ?? null;
                        const passedKkm = score !== null && score >= kkmScore;
                        const result = app.assessment_results?.[0];
                        const cheating = result?.ai_cheating_detected || (result?.tab_switches > 3);
                        
                        return (
                          <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-4 px-5 font-bold font-mono text-gray-900">
                              #{idx + 1}
                            </td>
                            <td className="py-4 px-5">
                              <div className="font-bold text-gray-900">{app.user?.full_name || 'Kandidat (Pelamar)'}</div>
                              <div className="text-xs text-gray-500">{app.user?.email || 'email@kandidat.com'}</div>
                            </td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                                app.status === 'interview' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                app.status === 'hired' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                                app.status === 'evaluated' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {app.status === 'evaluated' ? 'Tes Selesai' : app.status}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              {score !== null ? (
                                <span className={`text-base font-bold font-mono ${passedKkm ? 'text-emerald-700' : 'text-red-600'}`}>
                                  {score} / 100
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400 font-normal">Belum Mengikuti Tes</span>
                              )}
                            </td>
                            <td className="py-4 px-5">
                              {score !== null ? (
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                  passedKkm ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                  {passedKkm ? <Checkmark className="w-3.5 h-3.5" /> : <Warning className="w-3.5 h-3.5" />}
                                  {passedKkm ? 'LULUS KKM' : 'DI BAWAH KKM'}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-4 px-5">
                              {cheating ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 border border-red-200 rounded-full">
                                  <Warning className="w-3.5 h-3.5" /> Terdeteksi ({result?.tab_switches} Pindah Tab)
                                </span>
                              ) : result ? (
                                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                  <Checkmark className="w-3.5 h-3.5 text-emerald-600" /> Bersih / Jujur
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {passedKkm && app.status !== 'interview' && (
                                  <button
                                    onClick={() => setSchedulingAppId(app.id)}
                                    className="px-4 py-2 bg-[#F26522] hover:bg-[#e05a1a] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs"
                                  >
                                    Undang Wawancara
                                  </button>
                                )}
                                <Link
                                  href={`/recruiter/candidates/${app.id}`}
                                  className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full hover:border-[#F26522] transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  Detail <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: AI RECOMMENDATION & INTERVIEWS */}
        {activeTab === 'interview_ai' && (
          <motion.div
            key="interview_ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* AI Recommendation Section */}
            <div className="bg-gray-900 p-6 md:p-8 text-white rounded-2xl border border-gray-800 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-white/10 border border-white/20 rounded-full">
                  <MagicWand className="w-6 h-6 text-[#F26522]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wide text-white">Rekomendasi Otomatis AI (Kandidat Teratas Lulus KKM)</h2>
                  <p className="text-xs text-gray-400">AI merekomendasikan kandidat terbaik berdasarkan kelulusan KKM ({kkmScore}) & kualitas jawaban studi kasus.</p>
                </div>
              </div>

              {recommendations.length === 0 ? (
                <div className="bg-white/5 p-6 border border-white/10 text-center text-xs text-gray-400 mt-4 rounded-xl">
                  Belum ada rekomendasi kandidat yang lulus KKM ({kkmScore}). Pastikan kandidat sudah menyelesaikan tes simulasi.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {recommendations.map((rec, i) => {
                    const score = rec.assessment_results?.[0]?.overall_score;
                    const evalResult = rec.assessment_results?.[0];

                    return (
                      <div key={rec.id} className="bg-white/10 p-5 border border-white/15 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#F26522] text-white rounded-full font-mono">
                              Rekomendasi #{i + 1}
                            </span>
                            <span className="text-lg font-bold font-mono text-[#F26522]">
                              {score} / 100
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-white">{rec.user?.full_name || 'Pelamar Lulus KKM'}</h4>
                          <p className="text-xs text-gray-400 mb-4">{rec.user?.email}</p>
                          
                          {evalResult?.interview_questions && (
                            <div className="bg-black/50 p-3.5 text-xs text-white mb-5 space-y-1 border border-white/10 rounded-xl">
                              <span className="font-bold text-[#F26522] block">💡 Pertanyaan Rekomendasi AI saat Interview:</span>
                              <p className="italic text-[11px] leading-relaxed text-gray-300">"{evalResult.interview_questions}"</p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSchedulingAppId(rec.id)}
                          className="w-full py-2.5 bg-[#F26522] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#e05a1a] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Calendar className="w-4 h-4" />
                          Atur Jadwal Wawancara
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Scheduling Interview */}
            {schedulingAppId && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 md:p-8 max-w-lg w-full space-y-5 rounded-2xl border border-gray-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#F26522]" /> Jadwalkan Wawancara Kandidat
                    </h3>
                    <button onClick={() => setSchedulingAppId(null)} className="text-gray-400 hover:text-gray-900 text-sm">✕</button>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Sesuai aturan platform, undangan wawancara wajib diset dengan <strong>jarak minimal 1-2 hari</strong> dari hari ini agar kandidat memiliki waktu konfirmasi (Terima / Tolak).
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tanggal & Waktu Wawancara</label>
                      <input
                        type="datetime-local"
                        value={scheduleForm.scheduled_at}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_at: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Lokasi / Tautan Sesi (Zoom / Google Meet)</label>
                      <input
                        type="text"
                        value={scheduleForm.location}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0"
                        placeholder="https://meet.google.com/xyz..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Catatan Tambahan untuk Kandidat</label>
                      <textarea
                        value={scheduleForm.notes}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0 h-20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button onClick={() => setSchedulingAppId(null)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 uppercase tracking-wider">
                      Batal
                    </button>
                    <button
                      onClick={() => handleScheduleInterview(schedulingAppId)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#F26522] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#e05a1a] disabled:opacity-50 shadow-xs"
                    >
                      {saving ? 'Mengirim...' : 'Kirim Undangan Wawancara'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of Scheduled Interviews */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                <Time className="w-5 h-5 text-[#F26522]" /> Sesi Wawancara Lowongan Ini
              </h3>

              {interviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Belum ada sesi wawancara yang dijadwalkan.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {interviews.map((inv) => (
                    <div key={inv.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                            inv.status === 'accepted' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            inv.status === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                            inv.status === 'completed' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            Status: {inv.status}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-mono">
                            Jadwal: {new Date(inv.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Lokasi: {inv.location || 'Online'}</p>
                        {inv.score_notes && (
                          <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 border border-emerald-200 rounded-xl mt-2 font-medium">
                            Skor Wawancara HRD: {inv.interview_score}/100 — Catatan: {inv.score_notes}
                          </p>
                        )}
                      </div>

                      {inv.status !== 'completed' && (
                        <button
                          onClick={() => setScoringInterviewId(inv.id)}
                          className="px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#F26522] transition-colors shadow-xs"
                        >
                          Beri Poin Pemeringkatan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Post-Interview Scoring */}
            {scoringInterviewId && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 max-w-md w-full space-y-4 rounded-2xl border border-gray-200 shadow-2xl">
                  <h3 className="text-base font-bold uppercase tracking-wide text-gray-900">Penilaian Poin Sesi Wawancara</h3>
                  <p className="text-xs text-gray-600">Berikan nilai wawancara (0 - 100) untuk dikombinasikan dalam hasil pemeringkatan akhir kandidat.</p>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Skor Wawancara (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scoreForm.interview_score}
                      onChange={(e) => setScoreForm({ ...scoreForm, interview_score: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold font-mono focus:border-[#F26522] focus:ring-0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Catatan Evaluasi HRD</label>
                    <textarea
                      value={scoreForm.score_notes}
                      onChange={(e) => setScoreForm({ ...scoreForm, score_notes: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm h-20 resize-none focus:border-[#F26522] focus:ring-0"
                      placeholder="Catatan kelebihan / kekurangan jawaban kandidat..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setScoringInterviewId(null)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600">Batal</button>
                    <button
                      onClick={() => handleSubmitInterviewScore(scoringInterviewId)}
                      disabled={saving}
                      className="px-5 py-2 bg-[#F26522] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#e05a1a] shadow-xs"
                    >
                      Simpan Poin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: ASSESSMENT SIMULATION PROMPT & KKM SETUP */}
        {activeTab === 'kkm_setup' && (
          <motion.div
            key="kkm_setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KKM & Status Settings Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
              <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
                <SettingsAdjust className="w-5 h-5 text-[#F26522]" /> Pengaturan KKM & Batasan Waktu Lowongan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Nilai KKM (Passing Grade 0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.kkm_score}
                    onChange={(e) => setJobForm({ ...jobForm, kkm_score: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-bold font-mono text-base focus:border-[#F26522] focus:ring-0"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Kandidat dengan skor ≥ nilai KKM akan otomatis masuk rekomendasi wawancara.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Status Pembukaan Lowongan</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-sm focus:border-[#F26522] focus:ring-0"
                  >
                    <option value="open">Aktif (Open)</option>
                    <option value="closed">Ditutup (Closed)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">Status ditutup menghalangi pelamar baru mengakses lowongan ini.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Waktu Tenggat Lowongan (Deadline)</label>
                  <input
                    type="datetime-local"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-sm focus:border-[#F26522] focus:ring-0"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Batasan waktu agar lowongan otomatis kadaluarsa setelah tanggal ini.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveJobDetails}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-[#F26522] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs"
                >
                  Simpan Pengaturan KKM & Deadline
                </button>
              </div>
            </div>

            {/* AI Micro-Simulation Prompt Editor */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide flex items-center gap-2">
                    <MagicWand className="w-5 h-5 text-[#F26522]" /> Skenario Micro-Simulation AI
                  </h3>
                  <p className="text-xs text-gray-500">Skenario studi kasus nyata yang akan diberikan kepada kandidat saat mengerjakan tes.</p>
                </div>

                <div className="flex bg-gray-100 p-1 border border-gray-200 rounded-full">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${viewMode === 'edit' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Prompt
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${viewMode === 'preview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <View className="w-3.5 h-3.5" /> Preview Kandidat
                  </button>
                </div>
              </div>

              {viewMode === 'edit' ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#F26522] transition-all">
                  <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('**', '**')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors" title="Bold">
                      <TextBold className="w-4 h-4" />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('*', '*')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors" title="Italic">
                      <TextItalic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-1" />
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('- ')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors" title="Bullet List">
                      <List className="w-4 h-4" />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('```\n', '\n```')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors" title="Code Block">
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    id="scenario-editor"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    className="w-full h-[300px] md:h-[400px] p-5 bg-white text-sm text-gray-900 font-mono leading-relaxed focus:outline-none resize-y"
                    placeholder="Tuliskan skenario studi kasus dalam format Markdown..."
                  />
                </div>
              ) : (
                <div className="w-full h-[350px] md:h-[450px] p-6 bg-white border border-gray-200 rounded-2xl overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {promptValue || '*Belum ada konten skenario.*'}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {assessment?.hidden_prompt && (
                <div className="bg-red-50 p-4 border border-red-200 flex items-start gap-3 rounded-xl">
                  <Locked className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">Perangkap Anti-Cheat Scooby-Doo AI</h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      Kata kunci rahasia: <code className="font-mono font-bold bg-white px-2 py-0.5 border border-red-300 text-red-900 rounded">{assessment.hidden_prompt}</code>. Jika kandidat menyalin soal ke AI (ChatGPT), kata ini akan diam-diam terpicu untuk mendeteksi kecurangan.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveAssessment}
                  disabled={saving}
                  className="px-6 py-3 bg-[#F26522] hover:bg-[#e05a1a] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-2 shadow-xs"
                >
                  <Checkmark className="w-4 h-4" />
                  Simpan Skenario Simulasi AI
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: JOB DETAILS & METADATA */}
        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6"
          >
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide border-b border-gray-100 pb-3">Informasi & Kriteria Posisi</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Judul Posisi Lowongan</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Lokasi Kerja</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Rentang Gaji</label>
                <input
                  type="text"
                  value={jobForm.salary_range}
                  onChange={(e) => setJobForm({...jobForm, salary_range: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Deskripsi Pekerjaan</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Hasil & KPI yang Diharapkan (Expected Outcomes)</label>
                <textarea
                  value={jobForm.expected_outcomes}
                  onChange={(e) => setJobForm({...jobForm, expected_outcomes: e.target.value})}
                  className="w-full h-28 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Keahlian Khusus (Specific Skills)</label>
                <textarea
                  value={jobForm.specific_skills}
                  onChange={(e) => setJobForm({...jobForm, specific_skills: e.target.value})}
                  className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#F26522] focus:ring-0 resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={handleSaveJobDetails}
                disabled={saving}
                className="px-6 py-3 bg-gray-900 hover:bg-[#F26522] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs"
              >
                Simpan Perubahan Lowongan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
