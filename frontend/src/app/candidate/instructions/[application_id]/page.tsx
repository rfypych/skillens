'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Info,
  X,
  FileCheck,
  Lock,
} from 'lucide-react';
import { IconArrowUpRight } from '@/components/icons/CustomIcons';

function CandidateOnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState(0);

  if (!isOpen) return null;

  const guides = [
    {
      title: 'Tahap 1: Konsep Simulasi AI',
      icon: Sparkles,
      color: 'text-[#F26522]',
      bullets: [
        'Ujian ini berbasis **skenario studi kasus nyata** industri, bukan soal hafalan atau pilihan ganda.',
        'AI bertindak sebagai penguji teknis yang mengukur alur kerja, arsitektur, dan keputusan teknis Anda.',
        'Jawablah secara jujur dan spesifik berdasarkan pengalaman langsung Anda.'
      ]
    },
    {
      title: 'Tahap 2: Aturan & Integritas',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bullets: [
        'Durasi total adalah **15 menit** dan penghitung waktu tidak dapat dihentikan.',
        'Dilarang **pindah tab** atau **copy-paste** teks. Sistem telemetri akan menandai aktivitas mencurigakan.',
        'Pastikan koneksi internet Anda stabil sebelum menekan tombol Mulai Assessment.'
      ]
    },
    {
      title: 'Tahap 3: Tips Penilaian Maksimal',
      icon: ShieldCheck,
      color: 'text-[#F26522]',
      bullets: [
        'Gunakan metode terstruktur saat menjawab (masalah → solusi → dampak).',
        'Jelaskan **mengapa** Anda mengambil keputusan tersebut, bukan hanya apa yang dilakukan.',
        'Skor evaluasi dikalkulasi secara otomatis dan dapat langsung dilihat oleh tim recruiter.'
      ]
    }
  ];

  const current = guides[currentTab];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-[2rem] border border-gray-200/80 shadow-2xl overflow-hidden p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#F26522]/10 flex items-center justify-center text-[#F26522]">
              <Info size={16} />
            </span>
            <span className="font-semibold text-gray-900 text-sm">Panduan Assessment Candidate</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 my-5 bg-[#F9FAFB] p-1.5 rounded-full border border-gray-200/60">
          {guides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTab(idx)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                currentTab === idx
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tahap {idx + 1}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="py-2 space-y-3">
          <h4 className="font-semibold text-gray-900 text-base flex items-center gap-2">
            <IconComponent size={18} className={current.color} />
            {current.title}
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-600 leading-relaxed">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/40">
                <span className="text-[#F26522] font-bold mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Footer buttons */}
        <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            disabled={currentTab === 0}
            onClick={() => setCurrentTab(t => t - 1)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-30 px-3 py-2"
          >
            Sebelumnya
          </button>
          <span className="text-xs font-medium text-gray-400">
            {currentTab + 1} / {guides.length}
          </span>
          {currentTab < guides.length - 1 ? (
            <button
              onClick={() => setCurrentTab(t => t + 1)}
              className="bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#F26522] transition-colors"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-[#F26522] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#d95316] transition-colors"
            >
              Paham & Tutup
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AssessmentInstructions() {
  const router = useRouter();
  const params = useParams();
  const application_id = params.application_id;

  const [agreed, setAgreed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenCandidateTour');
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenCandidateTour', 'true');
  };

  const handleStart = () => {
    if (agreed) {
      router.push(`/candidate/test/${application_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-10 px-4 sm:px-6 md:px-8 font-sans flex items-center justify-center relative">
      <CandidateOnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />

      {/* Floating Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-6 right-6 px-4 py-2 bg-white border border-gray-200/80 rounded-full text-gray-700 hover:text-gray-900 shadow-sm transition-all z-40 flex items-center gap-2 text-xs font-semibold"
      >
        <Info size={14} className="text-[#F26522]" />
        Panduan Assessment
      </button>

      <div className="max-w-3xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto object-contain mx-auto" />
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-200/60 shadow-lg overflow-hidden p-8 sm:p-10 md:p-12"
        >
          {/* Header */}
          <div className="text-center pb-8 border-b border-gray-100 mb-8">
            <span className="inline-flex items-center gap-2 bg-[#F26522]/10 text-[#F26522] border border-[#F26522]/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} /> Assessment Briefing
            </span>
            <h1 className="text-gray-900 text-3xl sm:text-4xl font-semibold leading-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
              Petunjuk Pengerjaan Tes
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Anda akan memulai simulasi teknis berbasis AI. Harap pahami aturan lingkungan tes sebelum menekan tombol mulai.
            </p>
          </div>

          {/* 4 Rules Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-[1.25rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center flex-shrink-0 text-gray-900 shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                  Durasi 15 Menit
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Waktu berjalan otomatis begitu tombol ditekan dan tidak dapat dihentikan.
                </p>
              </div>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-[1.25rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center flex-shrink-0 text-[#F26522] shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                  Simulasi Skenario Industri
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fokus pada pemecahan masalah praktis dan penjelasan logika keputusan Anda.
                </p>
              </div>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-[1.25rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 shadow-sm">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                  Deteksi Anti-Cheat
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sistem otomatis mencatat perpindahan tab dan aktivitas copy-paste ke laporan.
                </p>
              </div>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-[1.25rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center flex-shrink-0 text-gray-900 shadow-sm">
                <FileCheck size={18} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                  Laporan Evaluasi AI
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Kedalaman jawaban Anda akan dianalisis secara objektif untuk recruiter.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox agreement */}
          <div className="mb-8">
            <label className="flex items-start gap-3 bg-[#F9FAFB] border border-gray-200/80 p-4 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-[#F26522] focus:ring-0 cursor-pointer mt-0.5"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="text-xs text-gray-700 leading-relaxed font-medium">
                Saya memahami seluruh aturan tes, dan bersedia pengerjaan saya dipantau secara otomatis tanpa berpindah tab selama 15 menit.
              </span>
            </label>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <Lock size={13} /> Sesi ini terenkripsi & aman
            </span>
            <button
              onClick={handleStart}
              disabled={!agreed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gray-900 text-white text-sm font-semibold pl-7 pr-3 py-3 rounded-full hover:bg-[#F26522] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Mulai Tes Simulasi AI
              <span className="bg-white/20 rounded-full p-1.5">
                <ArrowRight size={14} className="text-white" />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
