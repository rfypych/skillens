'use client';

import { ArrowRight, CheckmarkOutline, ChevronLeft, CloudUpload, Document, Email, Location, Portfolio, Time, User, Warning } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';
import Link from 'next/link';

export default function ApplyForJob() {
  const router = useRouter();
  const params = useParams();
  const job_id = params.job_id;
  
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume_url: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const jobPromise = api.get(`/jobs/${job_id}`, { requireAuth: false });
        
        const token = localStorage.getItem('token');
        const userPromise = token 
          ? api.get('/auth/me', { requireAuth: false }).catch(() => null)
          : Promise.resolve(null);

        const [jobData, userData] = await Promise.all([jobPromise, userPromise]);
        
        setJob(jobData);
        
        if (userData) {
          setUser(userData);
          setFormData({ name: userData.full_name || '', email: userData.email || '', resume_url: '' });
        }
      } catch (err) {
        setError('Gagal memuat detail pekerjaan. Tautan ini mungkin tidak valid.');
      }
      
      setInitLoading(false);
    };
    init();
  }, [job_id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const dataPayload = new FormData();
      if (formData.name) dataPayload.append('name', formData.name);
      if (formData.email) dataPayload.append('email', formData.email);
      if (!file) throw new Error("Harap unggah resume PDF yang valid.");
      dataPayload.append('file', file);

      const data = await api.post(`/assessment/${job_id}/apply`, dataPayload, { requireAuth: false });
      router.push(`/candidate/instructions/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengirimkan lamaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (initLoading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center gap-6 font-sans">
        <ThinkingIndicator statusText="Memuat Detail Posisi..." />
      </div>
    );
  }

  let cleanDescription = job?.description || "Anda diundang untuk mengikuti evaluasi teknis.";
  cleanDescription = cleanDescription.replace(/Job Title:.*?\nJob Description:\s*/, '');

  return (
    <div className="min-h-screen bg-[#EFEFEF] font-sans text-gray-900 selection:bg-[#F26522] selection:text-white">
      {/* Skillens Top Navigation */}
      <nav className="bg-white border-b border-gray-200/80 h-16 flex items-center px-6 md:px-8 shadow-xs">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                SK
              </div>
              <span className="font-bold text-gray-900 text-lg">Skillens</span>
              <span className="text-xs font-semibold text-gray-400 border-l border-gray-200 pl-3 uppercase">Portal Evaluasi</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          
          {/* Left Column: Job Details */}
          <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 md:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F26522] uppercase tracking-wider mb-3">
                <Portfolio className="w-4 h-4" />
                <span>{job?.company_name || "Perusahaan Target"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                {job?.title || "Evaluasi Peran"}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600 font-medium border-b border-gray-100 pb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Location className="w-4 h-4 text-[#F26522]" /> {job?.location || "Remote"}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Time className="w-4 h-4 text-[#F26522]" /> Evaluasi Terbatas Waktu
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <CheckmarkOutline className="w-4 h-4 text-[#F26522]" /> AI Telemetry Active
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <Document className="w-5 h-5 text-[#F26522]" />
                Deskripsi Peran & Panduan
              </h3>
              <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm font-normal">
                {cleanDescription}
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="w-full lg:w-[420px] bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 md:p-8 shrink-0 lg:sticky lg:top-24">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Lengkapi Data</h2>
            <p className="text-xs text-gray-500 mb-6 font-normal">Unggah resume PDF untuk memulai tes simulasi AI.</p>
            
            <form className="space-y-5" onSubmit={handleApply}>
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold mb-4"
                  >
                    <Warning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {user ? (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Melamar sebagai</p>
                    <p className="font-bold text-gray-900 text-sm">{user.full_name}</p>
                    <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.full_name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      placeholder="Alex Thompson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      placeholder="alex@example.com"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Unggah Resume (PDF)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`flex items-center gap-3 w-full px-4 py-4 bg-white border-2 border-dashed ${file ? 'border-[#F26522] bg-orange-50/50' : 'border-gray-200 group-hover:border-[#F26522]/50 group-hover:bg-gray-50'} rounded-2xl transition-all`}>
                    <div className={`p-2 rounded-full ${file ? 'bg-[#F26522] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className={`text-xs font-semibold truncate ${file ? 'text-[#F26522]' : 'text-gray-700'}`}>
                        {file ? file.name : "Klik atau seret PDF ke sini"}
                      </p>
                      {!file && <p className="text-[10px] text-gray-400 mt-0.5">Maksimum ukuran berkas 5MB</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading || !job} className="w-full">
                  <TextRollButton
                    text={loading ? 'Memproses...' : 'Lanjut Ke Petunjuk Ujian'}
                    variant="orange"
                    size="lg"
                    className="w-full justify-between"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <SponsorLogos />
        </div>
      </main>
    </div>
  );
}
