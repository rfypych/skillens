'use client';

import { Aperture, ArrowUpRight, ChevronRight, Group, Idea, Security, MagicWand } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import clsx from 'clsx';
import TextRollButton from '@/components/TextRollButton';
import ShaderBackground from '@/components/ShaderBackground';

interface AssessmentResult {
  overall_score: number | null;
  ai_cheating_detected: boolean;
  tab_switches: number;
  copy_paste_attempts: number;
  claim_vs_evidence_label: string | null;
  created_at: string;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  job?: { title: string };
  user: { full_name: string; email: string };
  assessment_results: AssessmentResult[];
}

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  const loadApplications = () => {
    setLoading(true);
    api.get('/applications')
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadApplications(); }, []);

  const loadDemo = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    try {
      const res = await api.post('/seed/demo');
      const count = Array.isArray(res?.candidates) ? res.candidates.length : 0;
      toast.success(`Data demo dimuat: ${res?.job_title ?? 'posisi demo'} + ${count} kandidat ternilai.`);
      setTimeout(() => {
        setDemoLoading(false);
        loadApplications();
        if (res?.job_id) router.push(`/recruiter/jobs/${res.job_id}`);
      }, 1200);
    } catch (err: any) {
      setDemoLoading(false);
      toast.error(err?.message || 'Gagal memuat data demo.');
    }
  };

  const totalEvaluated = applications.filter(a => a.status === 'evaluated' || a.status === 'hired' || a.status === 'interview').length;
  let hiddenGemsCount = 0;
  let fraudPreventedCount = 0;

  applications.forEach(a => {
    const latest = a.assessment_results?.[a.assessment_results.length - 1];
    if (latest) {
      if (latest.claim_vs_evidence_label === 'Hidden Gem') hiddenGemsCount++;
      if (latest.ai_cheating_detected) fraudPreventedCount++;
    }
  });

  const stats = [
    {
      name: 'TOTAL EVALUASI',
      value: loading ? '...' : totalEvaluated.toString(),
      icon: Group,
      bg: 'bg-orange-50 text-[#F26522]',
    },
    {
      name: 'KANDIDAT TERSEMBUNYI (GEM)',
      value: loading ? '...' : hiddenGemsCount.toString(),
      icon: Idea,
      bg: 'bg-emerald-50 text-emerald-700',
    },
    {
      name: 'KECURANGAN DICEGAH',
      value: loading ? '...' : fraudPreventedCount.toString(),
      icon: Security,
      bg: 'bg-red-50 text-red-700',
    },
  ];

  const getLabelStyle = (label: string | null, isCheat: boolean) => {
    if (isCheat || label === 'Likely Fabricated' || label === 'Fabricated' || label === 'Mismatch')
      return 'bg-red-50 text-red-700 border-red-200';
    if (label === 'Hidden Gem')
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label === 'Highly Validated')
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label === 'Solid Match' || label === 'Validated')
      return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
    return 'bg-amber-50 text-amber-800 border-amber-300';
  };

  return (
    <div className="w-full space-y-8 font-sans">
      <Toaster position="top-right" />

      {/* Hero Banner Section with WebGL Shader Overlay */}
      <div className="bg-[#0F172A] text-white p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-sm min-h-[260px] flex flex-col justify-center">
        {/* Animated WebGL Shader Background Overlay */}
        <ShaderBackground variant="dark" />
        
        <div className="relative z-20 space-y-4 max-w-3xl">
          <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
            Skillens Studio Command Center
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.08]">
            Evaluasi kandidat berbasis bukti nyata <span className="text-[#F26522]">& AI interaktif.</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-300 font-normal leading-relaxed max-w-2xl pt-1">
            Eliminasi klaim palsu resume dengan simulasi studi kasus interaktif dan analisis perilaku otomatis.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={loadDemo}
              disabled={demoLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F26522] to-[#FF8A4C] text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              <MagicWand className={`w-4 h-4 ${demoLoading ? 'animate-spin' : ''}`} />
              {demoLoading ? 'Memuat Data Demo...' : 'Muat Data Demo (1 Klik)'}
            </button>
            <Link href="/recruiter/jobs/new">
              <TextRollButton text="Program Posisi Baru" variant="white" size="md" />
            </Link>
            <Link href="/recruiter/candidates">
              <TextRollButton text="Lihat Daftar Kandidat" variant="white" size="md" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid - Stretches Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {stat.name}
                </p>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={clsx("p-3 rounded-full", stat.bg)}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Evaluations Table - Stretches Full Width */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Evaluasi Terbaru</h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">Hasil simulasi tes AI kandidat terbaru</p>
          </div>
          <Link href="/recruiter/candidates">
            <TextRollButton text="Lihat Semua" variant="dark" size="sm" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium text-sm">
            Belum ada evaluasi kandidat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Kandidat</th>
                  <th className="pb-3 px-3">Posisi</th>
                  <th className="pb-3 px-3">Skor Bukti</th>
                  <th className="pb-3 px-3">Label AI</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {applications.slice(0, 5).map(app => {
                  const result = app.assessment_results?.[app.assessment_results.length - 1];
                  const initials = app.user?.full_name
                    ? app.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'CD';
                  
                  return (
                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-[#F26522] transition-colors">
                              {app.user?.full_name || 'Kandidat'}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">APP-{app.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 font-medium text-gray-700">
                        {app.job?.title || 'Peran Umum'}
                      </td>
                      <td className="py-4 px-3 font-semibold">
                        {result?.overall_score !== null && result?.overall_score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">{result.overall_score}</span>
                            <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#F26522] h-full rounded-full"
                                style={{ width: `${Math.min(result.overall_score, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-normal text-xs">-</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        {result ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getLabelStyle(result.claim_vs_evidence_label, result.ai_cheating_detected)}`}>
                            {result.ai_cheating_detected ? 'Terindikasi Kecurangan' : result.claim_vs_evidence_label ?? 'Pending AI Evaluation'}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            Belum Mengikuti Tes
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link href={`/recruiter/candidates/${app.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-[#F26522] transition-colors">
                          Detail <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
