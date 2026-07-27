'use client';

import { motion } from 'framer-motion';
import {
  Portfolio as Briefcase, Code as Code2, CheckmarkOutline as CheckCircle2, Time as Clock, ArrowRight, Location as MapPin, Currency as CircleDollarSign, User
} from '@carbon/icons-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import TextRollButton from '@/components/TextRollButton';
import ShaderBackground from '@/components/ShaderBackground';

export default function CandidateDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'positions'>('applications');

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications')
    ]).then(([jobsData, appsData]) => {
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const handleApply = (jobId: number) => {
    router.push(`/candidate/apply/${jobId}`);
  };

  const myAppIds = applications.map(a => a.job_id);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full space-y-8 font-sans">

      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-[#0F172A] rounded-2xl p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shadow-sm"
      >
        {/* WebGL Shader Overlay */}
        <ShaderBackground variant="dark" />

        <div className="relative z-20">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white">
            Pusat Penilaian Kandidat
          </h1>
          <p className="text-gray-300 text-sm mt-1 font-normal">
            Pantau evaluasi aktif, kirimkan tanggapan simulasi, dan jelajahi posisi terbuka.
          </p>
        </div>
        <Link href="/candidate/profile" className="relative z-10 flex-shrink-0">
          <TextRollButton text="Edit Profil" variant="orange" size="sm" />
        </Link>
      </motion.div>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white p-1.5 rounded-full border border-gray-200 shadow-xs">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-colors ${activeTab === 'applications' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          Lamaran Saya
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-colors ${activeTab === 'positions' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          Posisi Terbuka
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

        {/* My Applications */}
        <div className={`space-y-6 ${activeTab === 'applications' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Lamaran Saya</h2>
              <p className="text-gray-500 mt-0.5 text-xs font-normal">Pantau evaluasi aktif dan laporan Anda.</p>
            </div>
          </div>

          {applications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <Briefcase className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">Belum ada lamaran aktif. Pilih posisi di bawah untuk melamar.</p>
            </div>
          )}

          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#F26522]/40 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      app.status === 'testing' ? 'bg-orange-50 text-[#F26522]' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {app.status === 'testing' ? <Code2 className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{app.job?.title ?? 'Evaluasi AI'}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-normal">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#F26522]" /> {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    {app.status === 'testing' ? (
                      <Link href={`/candidate/test/${app.id}`}>
                        <TextRollButton text="Mulai Tes AI" variant="orange" size="sm" />
                      </Link>
                    ) : (
                      <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 w-full">
                        {app.status === 'evaluated' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3.5 h-3.5" /> Dalam Peninjauan
                          </span>
                        )}
                        {app.status === 'interview' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            <User className="w-3.5 h-3.5" /> Wawancara
                          </span>
                        )}
                        {app.status === 'hired' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Diterima
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tidak Terpilih
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className={`space-y-6 ${activeTab === 'positions' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Posisi Terbuka</h2>
              <p className="text-gray-500 mt-0.5 text-xs font-normal">Peran dengan evaluasi studi kasus interaktif.</p>
            </div>
          </div>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <p className="text-gray-500 text-sm font-medium">Tidak ada posisi terbuka saat ini.</p>
            </div>
          )}

          <div className="space-y-4">
            {jobs.map((job, i) => {
              const hasApplied = myAppIds.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                  className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#F26522]/40 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 text-xs font-mono font-bold">
                      {job.id}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        <MapPin className="w-3.5 h-3.5 text-[#F26522]" />
                        {job.location}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        <CircleDollarSign className="w-3.5 h-3.5 text-[#F26522]" />
                        {job.salary_range}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed font-normal">{job.expected_outcomes}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-xs font-normal text-gray-500">
                      <span className="font-bold text-gray-900">{job.candidate_count ?? 0}</span> pelamar
                    </p>
                    {hasApplied ? (
                      <button disabled className="px-5 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-full cursor-not-allowed">
                        Sudah Melamar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={applyingTo === job.id}
                      >
                        <TextRollButton text={applyingTo === job.id ? 'Memuat...' : 'Lamar Sekarang'} variant="orange" size="sm" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
