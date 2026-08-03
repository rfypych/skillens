'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons/CustomIcons';

const SCENARIOS = [
  {
    id: 'backend',
    role: 'Backend Engineering',
    title: 'Concurrency & Connection Leak',
    description: 'Diagnosa lonjakan latensi 5,000 req/s, isolasi database connection leak, dan terapkan circuit-breaker pattern.',
    output: 'Diagram Arsitektur & Profil Latensi',
    duration: '25 Min',
  },
  {
    id: 'analytics',
    role: 'Product Analytics',
    title: 'User Retention Drop Analysis',
    description: 'Analisis penurunan retensi H+7 sebesar 14% pasca rilis, isolasi segmen terdampak, dan susun hipotesis perbaikan.',
    output: 'Laporan Atribusi & Rekomendasi',
    duration: '20 Min',
  },
  {
    id: 'frontend',
    role: 'Frontend Performance',
    title: 'Virtual DOM & Memory Optimization',
    description: 'Atasi frame-drop pada render 10,000 item berkecepatan tinggi dengan DOM windowing dan perbaikan listener leak.',
    output: 'Benchmark FPS & Profil Memori',
    duration: '30 Min',
  },
  {
    id: 'sysdesign',
    role: 'System Architecture',
    title: 'Distributed Rate Limiter',
    description: 'Rancang algoritma Token Bucket terdistribusi menggunakan Redis untuk menahan burst traffic fault-tolerant.',
    output: 'Dokumen Spesifikasi Arsitektur',
    duration: '35 Min',
  },
];

export function SkenarioSection() {
  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10">
      <div className="bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-gray-100 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-2 block">
              Skenario Otentik
            </span>
            <h2
              className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              Simulasi kerja nyata per peran.
            </h2>
          </div>
          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
            Kandidat diuji dengan studi kasus industri aktual yang relevan dan tidak dapat diakali AI.
          </p>
        </div>

        {/* 4 Clean Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCENARIOS.map((sc, idx) => (
            <motion.div
              key={sc.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="bg-[#F9FAFB] border border-gray-200/60 rounded-[1.5rem] p-7 md:p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 min-h-[260px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#F26522] bg-[#F26522]/10 px-3 py-1 rounded-full">
                    {sc.role}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {sc.duration}
                  </span>
                </div>

                <h3 className="text-gray-900 text-xl sm:text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em' }}>
                  {sc.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {sc.description}
                </p>
              </div>

              <div className="pt-5 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block">
                    Output Evaluasi
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    {sc.output}
                  </span>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#F26522] transition-colors"
                >
                  Uji Skenario
                  <IconArrowUpRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
