'use client';

import { Add, Aperture, ArrowLeft, ArrowRight, Calendar, CheckmarkOutline, Close, EarthAmericas, Help, Idea, Lightning, Location, Money, Portfolio, Renew, Security, Target, TrashCan, UserFollow } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';

function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState(0);

  if (!isOpen) return null;

  const guides = [
    {
      title: 'Langkah 1: Overview & Spesifikasi Peran',
      icon: Portfolio,
      color: 'text-[#F26522]',
      bullets: [
        'Isi **Nama Posisi**, **Lokasi**, **Rentang Gaji**, dan **Tipe Pekerjaan**.',
        'Pilih **Bahasa Wawancara AI** (English / Indonesian) & **Deadline Ujian**.',
        'Aktifkan **Auto-Generate AI** untuk deskripsi otomatis atau tulis deskripsi manual.'
      ]
    },
    {
      title: 'Langkah 2: Parameter Evaluator AI & KKM',
      icon: Aperture,
      color: 'text-[#F26522]',
      bullets: [
        '**Interaction Limit**: Jumlah pertanyaan pendalaman AI (1–15, Default: 5).',
        '**Nilai KKM**: Skor minimum kelulusan (0–100, Default: 70).',
        '**Expected Outcomes & Skills**: Target kriteria yang akan diuji simulasi AI.'
      ]
    },
    {
      title: 'Langkah 3: Tinjau & Deploy',
      icon: Idea,
      color: 'text-[#F26522]',
      bullets: [
        'Periksa kembali seluruh parameter peran & kriteria AI.',
        'Klik **Rilis Ujian AI Sekarang** untuk membuat link evaluasi publik!'
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header Window */}
      <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Idea className="w-5 h-5 text-[#F26522]" />
          <span className="font-semibold text-sm tracking-wide">Panduan Pembuatan Posisi</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-white/80 hover:text-white hover:bg-red-500/20 transition-colors rounded-full"
          title="Tutup"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {guides.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTab(idx)}
            className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              currentTab === idx
                ? 'border-[#F26522] text-[#F26522] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Tahap {idx + 1}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4">
        {(() => {
          const current = guides[currentTab];
          const Icon = current.icon;
          return (
            <div>
              <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${current.color}`} />
                {current.title}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
                {current.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F26522] font-bold mt-0.5">•</span>
                    <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          disabled={currentTab === 0}
          onClick={() => setCurrentTab(t => t - 1)}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30"
        >
          Sebelumnya
        </button>
        <div className="text-[10px] font-semibold text-gray-500">
          {currentTab + 1} / {guides.length}
        </div>
        {currentTab < guides.length - 1 ? (
          <button
            onClick={() => setCurrentTab(t => t + 1)}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F26522] text-white rounded-full hover:bg-[#e05a1a]"
          >
            Paham, Tutup
          </button>
        )}
      </div>
    </div>
  );
}

export default function NewJobWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenNewJobTour');
    if (!hasSeenTour) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenNewJobTour', 'true');
  };

  const ARCHETYPES = [
    { value: 'teknis', label: 'Teknis / Analitis', desc: 'Simulasi studi kasus + forensik ketikan. Untuk engineer, analis, staf kantor.', icon: Target },
    { value: 'lapangan', label: 'Lapangan / Operasional', desc: 'Situational judgment + identifikasi bahaya K3 + telemetri keputusan. Untuk teknisi, sales, kurir.', icon: Security },
    { value: 'kreatif', label: 'Kreatif / Portofolio', desc: 'Interogasi portofolio + uji rasa. Untuk desainer, konten kreator, marketing.', icon: Idea },
  ];

  const [formData, setFormData] = useState({
    title: '',
    language: 'English',
    location: '',
    salary_range: '',
    job_type: 'Full-time',
    description: '',
    max_questions: 5,
    archetype: 'teknis',
    kkm_score: 70,
    deadline: '',
  });

  const [autoGenerateDescription, setAutoGenerateDescription] = useState(true);
  const [expectedOutcomes, setExpectedOutcomes] = useState<string[]>(['Mampu merancang arsitektur terdistribusi dengan toleransi kegagalan tinggi']);
  const [specificSkills, setSpecificSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL', 'Docker']);
  const [complianceCriteria, setComplianceCriteria] = useState<string[]>(['Kode bersih', 'Dokumentasi rapi', 'Bebas kerentanan OWASP']);
  const [debiasLoading, setDebiasLoading] = useState(false);
  const [debiasResult, setDebiasResult] = useState<any>(null);

  const handleDebiasCheck = async () => {
    setDebiasLoading(true);
    setDebiasResult(null);
    try {
      const res = await api.post('/jobs/debias-check', {
        title: formData.title,
        description: formData.description,
        expected_outcomes: expectedOutcomes.join('\n'),
        specific_skills: specificSkills.join(', '),
      });
      setDebiasResult(res);
    } catch (e: any) {
      setDebiasResult({ bias_score: 0, label: 'Gagal', issues: [], suggestions: [e.message || 'Gagal memeriksa bias'] });
    } finally {
      setDebiasLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Helper handlers for dynamic lists
  const handleListAdd = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const handleListChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleListRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.title.trim() || !formData.location.trim() || !formData.salary_range.trim()) {
        setError('Harap isi semua kolom wajib: Nama Posisi, Lokasi Kerja, dan Rentang Gaji.');
        return;
      }
      if (!autoGenerateDescription && !formData.description.trim()) {
        setError('Tuliskan deskripsi pekerjaan atau aktifkan Auto-Generate AI.');
        return;
      }
    }
    if (step === 2) {
      if (!expectedOutcomes.some(i => i.trim()) || !specificSkills.some(i => i.trim()) || !complianceCriteria.some(i => i.trim())) {
        setError('Harap isi minimal satu item untuk Target Hasil, Keahlian Spesifik, dan Kriteria Kelulusan.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        description: autoGenerateDescription ? 'AUTO_GENERATE' : formData.description,
        expected_outcomes: expectedOutcomes.filter(i => i.trim()).join('\n'),
        specific_skills: specificSkills.filter(i => i.trim()).join('\n'),
        compliance_criteria: complianceCriteria.filter(i => i.trim()).join('\n')
      };
      const newJob = await api.post('/jobs', payload);
      router.push(`/recruiter/jobs/${newJob.id}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan posisi pekerjaan baru');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Detail & Spesifikasi Peran' },
    { num: 2, title: 'Parameter AI & KKM' },
    { num: 3, title: 'Tinjau & Deploy' }
  ];

  return (
    <div className="w-full space-y-8 relative font-sans">
      <OnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />
      
      {/* Help Button */}
      <button 
        onClick={() => setShowGuide(true)}
        className="absolute top-0 right-0 p-2.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-200/80 rounded-full shadow-xs transition-colors z-10 flex items-center gap-2"
        title="Buka Panduan"
      >
        <Help className="w-5 h-5 text-[#F26522]" />
        <span className="text-xs font-semibold hidden md:block">Panduan Wizard</span>
      </button>

      {/* Header */}
      <div>
        <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Posisi Aktif
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
          Buat Posisi Evaluasi Baru
        </h1>
        <p className="text-gray-600 text-sm mt-1">Konfigurasikan simulasi studi kasus AI untuk kandidat secara otomatis.</p>
      </div>

      {/* Wizard Steps Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className={`flex items-center gap-3 ${step === s.num ? 'text-[#F26522]' : step > s.num ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num ? 'bg-[#F26522] text-white' : step > s.num ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s.num ? <CheckmarkOutline className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-xs sm:text-sm font-semibold hidden sm:block">{s.title}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-gray-900' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* STEP 1: ROLE OVERVIEW */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">1. Detail & Spesifikasi Peran</h2>
              <p className="text-xs text-gray-500 mt-0.5">Tentukan nama posisi, lokasi, gaji, dan metode evaluasi.</p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Tahap 1 dari 3</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Nama Posisi / Pekerjaan *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Senior Fullstack Engineer"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Tipe Pekerjaan *</label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              >
                <option value="Full-time">Full-time (Penuh Waktu)</option>
                <option value="Part-time">Part-time (Paruh Waktu)</option>
                <option value="Contract">Kontrak / Freelance</option>
                <option value="Internship">Magang / Internship</option>
                <option value="Remote">Remote (Kerja Jarak Jauh)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Lokasi Kerja *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Contoh: Jakarta (Hybrid / Remote)"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Rentang Gaji *</label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="Contoh: Rp 18.000.000 - 25.000.000"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Bahasa Wawancara AI *</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              >
                <option value="English">English</option>
                <option value="Indonesian">Bahasa Indonesia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Batas Waktu Ujian (Deadline)</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              />
            </div>
          </div>

          {/* Archetype Picker */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Arketipe Pekerjaan *</label>
            <p className="text-xs text-gray-500 mb-3">Menentukan format simulasi AI dan jenis bukti yang dinilai. Inti penilaian tetap sama: bukti, bukan klaim.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ARCHETYPES.map((a) => {
                const Icon = a.icon;
                const active = formData.archetype === a.value;
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, archetype: a.value }))}
                    className={`text-left p-4 rounded-2xl border transition-colors ${active ? 'border-[#F26522] bg-[#F26522]/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <span className={`inline-flex w-9 h-9 rounded-full items-center justify-center mb-2 ${active ? 'bg-[#F26522] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className={`block text-sm font-semibold ${active ? 'text-gray-900' : 'text-gray-700'}`}>{a.label}</span>
                    <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{a.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Description Option */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200/60">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Lightning className="w-4 h-4 text-[#F26522]" />
                  Auto-Generate Deskripsi Pekerjaan dengan AI
                </span>
                <p className="text-xs text-gray-500">AI akan menyusun deskripsi posisi secara cerdas berdasarkan kriteria yang diisi.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoGenerateDescription} 
                  onChange={e => setAutoGenerateDescription(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26522]"></div>
              </label>
            </div>

            {!autoGenerateDescription && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Deskripsi Pekerjaan Manual *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tuliskan penjelasan tanggung jawab dan kualifikasi posisi..."
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                />
              </div>
            )}

            {/* JD Debiasing Check */}
            <div className="bg-orange-50/60 border border-orange-200/70 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Security className="w-4 h-4 text-[#F26522]" /> JD Debiasing Check
                  </p>
                  <p className="text-[11px] text-gray-500">Skor bias + saran kalimat inklusif sebelum publikasi.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDebiasCheck}
                  disabled={debiasLoading}
                  className="px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#F26522] disabled:opacity-60"
                >
                  {debiasLoading ? 'Memeriksa...' : 'Cek Bias'}
                </button>
              </div>
              {debiasResult && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 text-xs space-y-2">
                  <p className="font-bold text-gray-900">
                    Skor bias: <span className="text-[#F26522]">{debiasResult.bias_score}</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{debiasResult.label}</span>
                  </p>
                  {debiasResult.issues?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {debiasResult.issues.map((it: any, i: number) => (
                        <li key={i}><b>{it.match}</b> — {it.suggestion}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-emerald-700 font-semibold">Tidak ada pola bias terdeteksi.</p>
                  )}
                  <ul className="list-disc pl-5 text-gray-500">
                    {debiasResult.suggestions?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={nextStep}>
              <TextRollButton text="Lanjut Ke Parameter AI" variant="orange" size="md" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI SIMULATOR PARAMETERS */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">2. Parameter Simulasi & Evaluator AI</h2>
              <p className="text-xs text-gray-500 mt-0.5">Atur intensitas pertanyaan AI, nilai passing score (KKM), dan kriteria penilaian.</p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Tahap 2 dari 3</span>
          </div>

          {/* AI Settings Controls: Max Questions & KKM Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/60">
            <div>
              <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Batas Pertanyaan Pendalaman AI (Interaction Limit)</span>
                <span className="text-[#F26522] font-bold text-sm">{formData.max_questions} Soal</span>
              </label>
              <input
                type="range"
                name="max_questions"
                min={1}
                max={15}
                value={formData.max_questions}
                onChange={handleChange}
                className="w-full accent-[#F26522] cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">Jumlah maksimum pertanyaan studi kasus interaktif yang diajukan AI kepada kandidat.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Nilai KKM Minimum Kelulusan (Passing Score)</span>
                <span className="text-[#F26522] font-bold text-sm">{formData.kkm_score} / 100</span>
              </label>
              <input
                type="range"
                name="kkm_score"
                min={0}
                max={100}
                step={5}
                value={formData.kkm_score}
                onChange={handleChange}
                className="w-full accent-[#F26522] cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">Kandidat dengan skor di bawah KKM ini akan ditandai perlu pertimbangan ulang.</p>
            </div>
          </div>

          {/* Dynamic List Builders */}
          <div className="space-y-6">
            
            {/* Expected Outcomes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Target Hasil & Skenario Studi Kasus *</label>
                <button
                  type="button"
                  onClick={() => handleListAdd(setExpectedOutcomes)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#F26522] hover:text-[#e05a1a]"
                >
                  <Add className="w-4 h-4" />
                  Tambah Kriteria
                </button>
              </div>
              <div className="space-y-3">
                {expectedOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleListChange(setExpectedOutcomes, idx, e.target.value)}
                      placeholder={`Target ${idx + 1}: Contoh Mampu merancang arsitektur microservices terdistribusi`}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                    />
                    {expectedOutcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleListRemove(setExpectedOutcomes, idx)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Hapus"
                      >
                        <TrashCan className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specific Skills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Keahlian Spesifik Yang Dievaluasi *</label>
                <button
                  type="button"
                  onClick={() => handleListAdd(setSpecificSkills)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#F26522] hover:text-[#e05a1a]"
                >
                  <Add className="w-4 h-4" />
                  Tambah Skill
                </button>
              </div>
              <div className="space-y-3">
                {specificSkills.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleListChange(setSpecificSkills, idx, e.target.value)}
                      placeholder={`Skill ${idx + 1}: Contoh React, Node.js, PostgreSQL`}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                    />
                    {specificSkills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleListRemove(setSpecificSkills, idx)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Hapus"
                      >
                        <TrashCan className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Criteria */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Kriteria Kelulusan & Kepatuhan *</label>
                <button
                  type="button"
                  onClick={() => handleListAdd(setComplianceCriteria)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#F26522] hover:text-[#e05a1a]"
                >
                  <Add className="w-4 h-4" />
                  Tambah Kriteria Kepatuhan
                </button>
              </div>
              <div className="space-y-3">
                {complianceCriteria.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleListChange(setComplianceCriteria, idx, e.target.value)}
                      placeholder={`Kriteria ${idx + 1}: Contoh Kode bersih, bebas bug OWASP`}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                    />
                    {complianceCriteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleListRemove(setComplianceCriteria, idx)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Hapus"
                      >
                        <TrashCan className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-between pt-4">
            <button onClick={prevStep} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 text-sm">
              Kembali
            </button>
            <button onClick={nextStep}>
              <TextRollButton text="Lanjut Ke Tinjauan & Deploy" variant="orange" size="md" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & DEPLOY */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">3. Tinjau Ringkasan & Rilis Ujian AI</h2>
              <p className="text-xs text-gray-500 mt-0.5">Konfirmasi seluruh parameter sebelum merilis simulasi ujian AI secara publik.</p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Tahap 3 dari 3</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl space-y-6 text-sm text-gray-900 border border-gray-200/60">
            {/* Grid Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-b border-gray-200/60 pb-6">
              <div>
                <span className="text-xs text-gray-500 font-medium">Nama Posisi:</span>
                <p className="font-bold text-gray-900 text-base">{formData.title}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Tipe Pekerjaan:</span>
                <p className="font-bold text-gray-900">{formData.job_type}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Bahasa AI:</span>
                <p className="font-bold text-gray-900">{formData.language}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Lokasi:</span>
                <p className="font-bold text-gray-900">{formData.location}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Rentang Gaji:</span>
                <p className="font-bold text-gray-900">{formData.salary_range}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Batas Deadline:</span>
                <p className="font-bold text-gray-900">{formData.deadline || 'Tanpa Batas'}</p>
              </div>
            </div>

            {/* AI Evaluator Specs */}
            <div className="grid grid-cols-2 gap-6 border-b border-gray-200/60 pb-6">
              <div>
                <span className="text-xs text-gray-500 font-medium">Interaction Limit (Maks Pertanyaan):</span>
                <p className="font-bold text-[#F26522]">{formData.max_questions} Pertanyaan AI</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Nilai Minimum KKM Kelulusan:</span>
                <p className="font-bold text-[#F26522]">{formData.kkm_score} / 100</p>
              </div>
            </div>

            {/* Outcomes & Skills Lists */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Target Hasil & Skenario:</span>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {expectedOutcomes.filter(i => i.trim()).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Keahlian Spesifik Yang Dievaluasi:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {specificSkills.filter(i => i.trim()).map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Kriteria Kepatuhan & Kelulusan:</span>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {complianceCriteria.filter(i => i.trim()).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {isSubmitting && <ThinkingIndicator statusText="Membuat ujian AI dan tautan evaluasi sakti..." />}

          <div className="flex justify-between pt-4">
            <button onClick={prevStep} disabled={isSubmitting} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 text-sm disabled:opacity-50">
              Kembali
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}>
              <TextRollButton text={isSubmitting ? 'Membuat Ujian...' : 'Rilis Ujian AI Sekarang'} variant="orange" size="md" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
