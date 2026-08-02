'use client';

import { ArrowRight, Close, Information, Locked, MachineLearningModel, Security, Time, Warning } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

function CandidateOnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState(0);

  if (!isOpen) return null;

  const guides = [
    {
      title: 'Tahap 1: Konsep Ujian AI',
      icon: MachineLearningModel,
      color: 'text-brand-primary',
      bullets: [
        'Ujian ini berbasis **skenario studi kasus nyata** industri, bukan soal hafalan atau pilihan ganda.',
        'AI akan bertindak sebagai penguji teknis yang menanyakan alur kerja, arsitektur, dan keputusan teknis Anda.',
        'Jawablah secara jujur dan spesifik berdasarkan pengalaman nyata Anda.'
      ]
    },
    {
      title: 'Tahap 2: Aturan & Anti-Kecurangan',
      icon: Warning,
      color: 'text-red-600',
      bullets: [
        'Waktu total adalah **15 menit** dan tidak dapat di-pause.',
        'Dilarang **pindah tab** atau **copy-paste** teks. Sistem anti-cheat akan otomatis menandai aktivitas mencurigakan.',
        'Pastikan koneksi internet Anda stabil sebelum menekan tombol *Start Assessment*.'
      ]
    },
    {
      title: 'Tahap 3: Tips Skor Maksimal',
      icon: Security,
      color: 'text-brand-primary',
      bullets: [
        'Gunakan metode terstruktur saat menjawab (masalah -> solusi -> dampak).',
        'Jelaskan **mengapa** Anda mengambil keputusan tersebut, bukan hanya apa yang Anda lakukan.',
        'Skor kelulusan (KKM) ditentukan langsung oleh tim rekruter perusahaan target.'
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-brand-white border border-brand-secondary shadow-none border-t-4 border-t-brand-secondary transition-all font-sans rounded-none">
      {/* Header Window */}
      <div className="bg-brand-secondary p-4 text-brand-white flex items-center justify-between border-b border-brand-gray-light/20">
        <div className="flex items-center gap-2.5">
          <Information className="w-5 h-5 text-brand-accent" />
          <span className="font-bold text-sm tracking-wide uppercase font-display">Panduan Ujian AI Kandidat</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-brand-white/80 hover:text-brand-white hover:bg-red-600/30 transition-colors rounded-none"
          title="Tutup"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-gray-light/30 bg-brand-white">
        {guides.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTab(idx)}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 rounded-none ${
              currentTab === idx
                ? 'border-brand-primary text-brand-primary bg-brand-white'
                : 'border-transparent text-brand-gray-dark hover:text-brand-secondary'
            }`}
          >
            Tahap {idx + 1}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 bg-brand-white">
        {(() => {
          const current = guides[currentTab];
          const Icon = current.icon;
          return (
            <div>
              <h4 className="font-bold text-brand-secondary text-sm flex items-center gap-2 mb-3 font-display">
                <Icon className={`w-5 h-5 ${current.color}`} />
                {current.title}
              </h4>
              <ul className="space-y-2 text-xs text-brand-secondary/90 leading-relaxed">
                {current.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold mt-0.5">•</span>
                    <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 bg-brand-gray-light/10 border-t border-brand-gray-light/30 flex items-center justify-between">
        <button
          disabled={currentTab === 0}
          onClick={() => setCurrentTab(t => t - 1)}
          className="px-3 py-1.5 text-xs font-bold text-brand-gray-dark hover:text-brand-secondary disabled:opacity-30 rounded-none uppercase tracking-wider"
        >
          Sebelumnya
        </button>
        <div className="text-[10px] font-bold text-brand-gray-dark font-mono">
          {currentTab + 1} / {guides.length}
        </div>
        {currentTab < guides.length - 1 ? (
          <button
            onClick={() => setCurrentTab(t => t + 1)}
            className="px-4 py-1.5 text-xs font-bold bg-brand-secondary text-brand-white hover:bg-brand-dark-teal rounded-none uppercase tracking-wider"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-brand-primary text-brand-white hover:bg-brand-dark-teal rounded-none uppercase tracking-wider"
          >
            Paham, Tutup
          </button>
        )}
      </div>
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
    <div className="min-h-screen bg-brand-white py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center relative overflow-hidden">
      <CandidateOnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />

      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-6 right-6 p-2 text-brand-white bg-brand-secondary border border-brand-gray-light hover:bg-brand-dark-teal transition-colors z-40 flex items-center gap-2 shadow-none rounded-none"
        title="Buka Panduan Ujian"
      >
        <Information className="w-5 h-5 text-brand-accent" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Panduan Ujian</span>
      </button>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src="/skillens-logo-text.png" alt="Skillens" className="h-10 w-auto object-contain mx-auto" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-brand-white rounded-none shadow-none border border-brand-gray-light overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 md:px-12 py-10 relative overflow-hidden bg-brand-secondary text-brand-white border-b border-brand-gray-light/20">
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-brand-white/10 rounded-none flex items-center justify-center mx-auto mb-6 border border-brand-white/20 shadow-none">
                <Security className="w-8 h-8 text-brand-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 uppercase">Assessment Briefing</h1>
              <p className="text-brand-gray-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Anda akan memulai simulasi teknis berbasis AI. Harap baca dan pahami seluruh aturan lingkungan tes sebelum melanjutkan.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {/* Rule 1 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-gray-light/10 flex items-center justify-center text-brand-secondary border border-brand-gray-light/30 shadow-none">
                  <Time className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-brand-secondary mb-1.5 uppercase tracking-wider font-display">Batasan Waktu 15 Menit</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Setelah tombol dimulai, penghitung waktu 15 menit akan berjalan secara otomatis dan tidak dapat dihentikan.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-none">
                  <MachineLearningModel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-brand-secondary mb-1.5 uppercase tracking-wider font-display">Studi Kasus Skenario Industri</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Anda akan diberikan tantangan teknis nyata. Penilaian difokuskan pada logika pemecahan masalah dan kualitas eksekusi Anda.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-red-50 flex items-center justify-center text-red-600 border border-red-200 shadow-none">
                  <Warning className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-brand-secondary mb-1.5 uppercase tracking-wider font-display">Sistem Anti-Cheat Proctored</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Sistem mendeteksi aktivitas pindah tab dan copy-paste. Pelanggaran akan dicatat secara otomatis dalam laporan rekruter.
                  </p>
                </div>
              </div>
              
              {/* Rule 4 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-dark-teal/10 flex items-center justify-center text-brand-dark-teal border border-brand-dark-teal/20 shadow-none">
                  <Locked className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-brand-secondary mb-1.5 uppercase tracking-wider font-display">Evaluasi Forensik AI</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Jawaban Anda dianalisis oleh AI model untuk mencocokkan antara klaim CV/Pengalaman dengan kedalaman logika praktis Anda.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-gray-light/30">
              <label className="flex items-start gap-4 cursor-pointer group bg-brand-white p-5 rounded-none border border-brand-gray-light hover:border-brand-primary transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-none border-brand-gray-light text-brand-primary focus:ring-0 cursor-pointer transition-colors"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                </div>
                <span className="text-sm font-medium text-brand-gray-dark group-hover:text-brand-secondary transition-colors leading-relaxed">
                  Saya memahami aturan tes, dan bersedia pengerjaan saya dipantau oleh sistem anti-cheat tanpa berpindah tab selama 15 menit.
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
              <div className="flex items-center gap-2 text-brand-gray-dark text-xs font-bold uppercase tracking-widest">
                <Information className="w-4 h-4 text-brand-primary" /> Pastikan koneksi internet stabil
              </div>
              <button
                onClick={handleStart}
                disabled={!agreed}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-brand-white font-bold rounded-none hover:bg-brand-dark-teal transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-none text-xs uppercase tracking-wider"
              >
                Mulai Tes Simulasi AI
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
