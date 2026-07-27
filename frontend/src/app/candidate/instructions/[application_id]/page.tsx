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
      color: 'text-red-500',
      bullets: [
        'Waktu total adalah **15 menit** dan tidak dapat di-pause.',
        'Dilarang **pindah tab** atau **copy-paste** teks. Sistem anti-cheat akan otomatis menandai aktivitas mencurigakan.',
        'Pastikan koneksi internet Anda stabil sebelum menekan tombol *Start Assessment*.'
      ]
    },
    {
      title: 'Tahap 3: Tips Skor Maksimal',
      icon: Security,
      color: 'text-brand-accent',
      bullets: [
        'Gunakan metode terstruktur saat menjawab (masalah -> solusi -> dampak).',
        'Jelaskan **mengapa** Anda mengambil keputusan tersebut, bukan hanya apa yang Anda lakukan.',
        'Skor kelulusan (KKM) ditentukan langsung oleh tim rekruter perusahaan target.'
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden border-t-4 border-t-[#183B2B] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
      {/* Header Window */}
      <div className="bg-[#183B2B] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Information className="w-5 h-5 text-emerald-300" />
          <span className="font-bold text-sm tracking-wide">Panduan Ujian AI Kandidat</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-white/80 hover:text-white hover:bg-red-500/20 transition-colors rounded-lg"
          title="Tutup"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-gray-light/30 bg-[#F7F9F9]">
        {guides.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTab(idx)}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
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
      <div className="p-5 space-y-4">
        {(() => {
          const current = guides[currentTab];
          const Icon = current.icon;
          return (
            <div>
              <h4 className="font-bold text-brand-secondary text-sm flex items-center gap-2 mb-3">
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
          className="px-3 py-1.5 text-xs font-bold text-brand-gray-dark hover:text-brand-secondary disabled:opacity-30"
        >
          Sebelumnya
        </button>
        <div className="text-[10px] font-bold text-brand-gray-dark">
          {currentTab + 1} / {guides.length}
        </div>
        {currentTab < guides.length - 1 ? (
          <button
            onClick={() => setCurrentTab(t => t + 1)}
            className="px-3 py-1.5 text-xs font-bold bg-brand-secondary text-brand-white hover:bg-brand-dark-teal"
          >
            Lanjut
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-brand-white hover:bg-brand-dark-teal"
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
    <div className="min-h-screen bg-[#F7F9F9] py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center relative overflow-hidden">
      <CandidateOnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />

      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-6 right-6 p-2 text-brand-white bg-brand-secondary border border-brand-primary/40 hover:bg-brand-dark-teal transition-colors z-40 flex items-center gap-2 shadow-xl"
        title="Buka Panduan Ujian"
      >
        <Information className="w-5 h-5 text-brand-accent" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Panduan Ujian</span>
      </button>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-brand-secondary skew-y-3 origin-top-left -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-dark-teal rounded-none  opacity-50  -z-10" />
      
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src="/logo.svg" alt="Skillens Logo" className="h-10 w-auto brightness-0 invert" />
            <span className="text-2xl font-display font-bold text-brand-white tracking-tight">Skillens</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-brand-white rounded-none shadow-none border border-brand-gray-light/30 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 md:px-12 py-10 relative overflow-hidden bg-brand-secondary text-brand-white border-b border-brand-gray-light/20">
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-brand-white/10 rounded-none flex items-center justify-center mx-auto mb-6 backdrop- border border-brand-white/20 shadow-none">
                <Security className="w-8 h-8 text-brand-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">Assessment Briefing</h1>
              <p className="text-brand-gray-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                You are about to begin an AI-proctored technical micro-simulation. Please review the environment rules carefully before proceeding.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {/* Rule 1 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-gray-light/10 flex items-center justify-center text-brand-secondary border border-brand-gray-light/20 shadow-none">
                  <Time className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-secondary mb-1.5 uppercase tracking-wider">15-Minute Timer</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Once you start, a strict 15-minute timer will begin. The assessment cannot be paused or restarted under any circumstances.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-none">
                  <MachineLearningModel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-secondary mb-1.5 uppercase tracking-wider">Scenario-Based</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    You will be presented with a technical scenario. We are evaluating your empirical approach and real-world problem-solving framework.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-none">
                  <Warning className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-secondary mb-1.5 uppercase tracking-wider">Anti-Cheat Monitoring</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    This platform tracks tab switching and copy-pasting. Navigating away from the assessment page will be flagged in your final report.
                  </p>
                </div>
              </div>
              
              {/* Rule 4 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-none bg-brand-dark-teal/10 flex items-center justify-center text-brand-dark-teal border border-brand-dark-teal/20 shadow-none">
                  <Locked className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-secondary mb-1.5 uppercase tracking-wider">AI Evaluation</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed">
                    Your answers will be forensically evaluated by an AI model to verify claims made in your resume against your actual response depth.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-gray-light/30">
              <label className="flex items-start gap-4 cursor-pointer group bg-[#F7F9F9] p-5 rounded-none border border-brand-gray-light/40 hover:border-brand-primary/50 transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-none border-brand-gray-light text-brand-primary focus:ring-brand-primary cursor-pointer transition-colors"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                </div>
                <span className="text-sm font-medium text-brand-gray-dark group-hover:text-brand-secondary transition-colors leading-relaxed">
                  I understand the rules and confirm that I will not switch tabs or use external unauthorized tools during this 15-minute assessment.
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
              <div className="flex items-center gap-2 text-brand-gray-medium text-xs font-bold uppercase tracking-widest">
                <Information className="w-4 h-4" /> Ensure a stable connection
              </div>
              <button
                onClick={handleStart}
                disabled={!agreed}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-brand-white font-bold rounded-none hover:bg-brand-dark-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-none hover:shadow-none-brand-primary/20 text-sm uppercase tracking-wider"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
