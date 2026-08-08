'use client';

import { Add, CheckmarkOutline, CloseOutline, Copy, Edit, Group, OverflowMenuVertical, Portfolio, Time, ArrowRight, MagicWand } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import TextRollButton from '@/components/TextRollButton';

export default function ActiveRolesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  const loadJobs = () => {
    setLoading(true);
    api.get('/jobs/my-jobs')
      .then(data => {
        if (Array.isArray(data)) setJobs(data.filter((j: any) => j.status === 'open'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const loadDemo = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    try {
      const res = await api.post('/seed/demo');
      const count = Array.isArray(res?.candidates) ? res.candidates.length : 0;
      toast.success(`Data demo dimuat: ${res?.job_title ?? 'posisi demo'} + ${count} kandidat ternilai.`);
      setTimeout(() => {
        setDemoLoading(false);
        loadJobs();
        if (res?.job_id) router.push(`/recruiter/jobs/${res.job_id}`);
      }, 1200);
    } catch (err: any) {
      setDemoLoading(false);
      toast.error(err?.message || 'Gagal memuat data demo.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (e.target && typeof e.target.closest === 'function') {
        if (!e.target.closest('.action-menu-trigger')) {
          setOpenMenuId(null);
        }
      } else {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    api.get('/jobs/my-jobs')
      .then(data => {
        if (Array.isArray(data)) setJobs(data.filter((j: any) => j.status === 'open'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleArchive = async (jobId: number) => {
    if (!confirm('Apakah Anda yakin ingin menutup dan mengarsipkan posisi ini? Kandidat tidak akan dapat melihat posisi ini lagi.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success('Posisi berhasil ditutup dan diarsipkan.');
    } catch {
      toast.error('Terjadi kesalahan.');
    }
  };

  const copyMagicLink = (job: any) => {
    const url = `${window.location.origin}/candidate/apply/${job.magic_link_token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(job.id);
    toast.success('Tautan evaluasi berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (deadline: string) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  return (
    <div className="w-full space-y-8 font-sans">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">Posisi Aktif</h1>
          <p className="text-gray-600 text-base font-normal">Kelola posisi terbuka dan atur evaluasi simulasi AI kandidat.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={loadDemo}
            disabled={demoLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#F26522] to-[#FF8A4C] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-wait"
          >
            <MagicWand className={`w-4 h-4 ${demoLoading ? 'animate-spin' : ''}`} />
            {demoLoading ? 'Memuat Data Demo...' : 'Muat Data Demo'}
          </button>
          <Link href="/recruiter/jobs/new" className="w-full sm:w-auto">
            <TextRollButton text="Buat Posisi Baru" variant="orange" size="md" />
          </Link>
        </div>
      </div>

      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-xs">
          <Portfolio className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-1">Belum Ada Posisi Aktif</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6 font-normal">Buat posisi pertama Anda untuk mulai mengevaluasi kandidat dengan penilaian berbasis AI.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={loadDemo}
              disabled={demoLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F26522] to-[#FF8A4C] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              <MagicWand className={`w-4 h-4 ${demoLoading ? 'animate-spin' : ''}`} />
              {demoLoading ? 'Memuat Data Demo...' : 'Muat Data Demo (1 Klik)'}
            </button>
            <Link href="/recruiter/jobs/new">
              <TextRollButton text="Buat Posisi Baru" variant="dark" size="md" />
            </Link>
          </div>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className={`group bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full relative ${openMenuId === job.id ? 'z-50' : 'z-10'}`}
          >
            {/* Top Status & Context Menu */}
            <div className="flex justify-between items-start mb-4 relative z-20">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${isExpired(job.deadline) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {isExpired(job.deadline) ? 'Kadaluarsa' : 'Aktif'}
              </span>
              
              <div className="relative action-menu-trigger" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                  className={`p-2 rounded-full transition-colors ${openMenuId === job.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                  title="Menu Opsi"
                >
                  <OverflowMenuVertical className="w-5 h-5" />
                </button>
                
                {openMenuId === job.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden py-1 z-50"
                  >
                    <Link href={`/recruiter/jobs/${job.id}`} onClick={() => setOpenMenuId(null)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                      <Edit className="w-4 h-4 text-[#F26522]" /> Buka / Edit Posisi
                    </Link>
                    <button onClick={() => { handleArchive(job.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2">
                      <CloseOutline className="w-4 h-4" /> Tutup Posisi
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Title & Info */}
            <div className="relative z-10 mb-4">
              <Link href={`/recruiter/jobs/${job.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#F26522] transition-colors">{job.title}</h3>
              </Link>
              <div className="flex flex-wrap items-center gap-2 text-xs font-normal text-gray-500">
                <span className="flex items-center gap-1">
                  <Portfolio className="w-3.5 h-3.5 text-[#F26522]" />{job.department || 'Teknik & Produk'}
                </span>
                {job.location && <span>· {job.location}</span>}
                {job.salary_range && <span className="text-gray-900 font-semibold">· {job.salary_range}</span>}
              </div>
            </div>

            {/* Metric Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1 relative z-10">
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Group className="w-3.5 h-3.5 text-[#F26522]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Kandidat</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{job.candidate_count ?? 0}</p>
              </div>
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Time className="w-3.5 h-3.5 text-[#F26522]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Dibuat</span>
                </div>
                <p className="text-xs font-semibold text-gray-900 mt-1">
                  {new Date(job.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* TWO BOTTOM BUTTONS (Salin & Buka Posisi) */}
            <div className="mt-auto relative z-10 pt-2 border-t border-gray-100">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Aksi Posisi</div>
              <div className="grid grid-cols-2 gap-2">
                {/* Button 1: Salin Tautan */}
                <button
                  onClick={() => copyMagicLink(job)}
                  disabled={isExpired(job.deadline)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-semibold text-xs transition-all border shadow-xs ${
                    copiedId === job.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isExpired(job.deadline)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200'
                  }`}
                  title="Salin Tautan Evaluasi AI"
                >
                  {copiedId === job.id ? (
                    <><CheckmarkOutline className="w-4 h-4 text-emerald-600" />Tersalin</>
                  ) : (
                    <><Copy className="w-4 h-4 text-gray-600" />Salin Tautan</>
                  )}
                </button>

                {/* Button 2: Buka Posisi */}
                <Link
                  href={`/recruiter/jobs/${job.id}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-semibold text-xs transition-all bg-gray-900 hover:bg-[#F26522] text-white border border-transparent shadow-xs"
                >
                  <span>Buka Posisi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
