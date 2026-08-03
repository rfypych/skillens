'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconArrowUpRight, IconAuditShield, IconTelemetrySignal } from '@/components/icons/CustomIcons';

const SOLUTIONS = [
  {
    code: 'SOL-01',
    title: 'Evaluasi Studi Kasus Real-time',
    subtitle: 'Bukan kuis pilihan ganda atau resume',
    description:
      'Kandidat ditempatkan langsung dalam lingkungan kerja simulasi — menyelesaikan insiden nyata, menganalisis data, atau merancang arsitektur.',
    metrics: '100% Menguji Praktek',
    bg: 'bg-white',
    border: 'border-brand-gray-light',
  },
  {
    code: 'SOL-02',
    title: 'Telemetri Perilaku & AI-Detection',
    subtitle: 'Bukan proctoring yang mengganggu kandidat',
    description:
      'Memantau kestabilan cara berpikir dan keotentikan jawaban kandidat dalam hitungan milidetik tanpa memata-matai kamera atau layar.',
    metrics: '< 0.3s Deteksi Otomatis',
    bg: 'bg-white',
    border: 'border-brand-gray-light',
  },
  {
    code: 'SOL-03',
    title: 'Laporan Otonom untuk Rekruiter',
    subtitle: 'Tanpa perlu periksa manual satu per satu',
    description:
      'Sistem mengkalkulasi skor teknis, keputusan analitis, serta kedalaman pemecahan masalah kandidat secara otomatis dan obyektif.',
    metrics: 'Zero Manual Scoring',
    bg: 'bg-[#012631]',
    textColor: 'text-brand-white',
    subtitleColor: 'text-brand-gray-light',
    descColor: 'text-brand-gray-light',
    border: 'border-brand-secondary',
  },
];

export function InfoSection() {
  return (
    <section id="about" className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-8 border-b border-brand-gray-light">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-primary mb-2 block">
            [ SOLUSI UTAMA ]
          </span>
          <h2
            className="text-brand-dark text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Mengapa Skillens Berbeda?
          </h2>
        </div>
        <p className="text-brand-gray-dark text-base md:text-lg max-w-md leading-relaxed">
          Mengubah proses rekrutmen tradisional yang lambat dan penuh tebakan menjadi standar evaluasi teknis yang presisi.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SOLUTIONS.map((sol, index) => (
          <motion.div
            key={sol.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`border ${sol.border} ${sol.bg || 'bg-brand-white'} p-8 rounded-none flex flex-col justify-between min-h-[360px]`}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className={`font-mono text-xs ${sol.textColor ? 'text-brand-accent' : 'text-brand-primary'}`}>
                  {sol.code}
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${sol.textColor || 'text-brand-dark'}`}>
                {sol.title}
              </h3>
              <p className={`text-xs font-mono mb-4 ${sol.subtitleColor || 'text-brand-gray-dark'}`}>
                // {sol.subtitle}
              </p>
              <p className={`text-sm leading-relaxed ${sol.descColor || 'text-brand-gray-dark'}`}>
                {sol.description}
              </p>
            </div>

            <div className="pt-6 border-t border-brand-gray-light/30 flex justify-between items-center mt-6">
              <span className={`text-xs font-semibold ${sol.textColor || 'text-brand-dark'}`}>
                {sol.metrics}
              </span>
              <IconArrowUpRight size={16} className={sol.textColor || 'text-brand-dark'} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
