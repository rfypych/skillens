'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons/CustomIcons';

const SKENARIO_DATA = [
  {
    id: 'backend',
    role: 'Backend Engineering',
    title: 'Penanganan Concurrency Spike & Connection Pool Leak',
    scenario: 'Sistem checkout microservices mengalami lonjakan trafik 5,000 req/sec dengan lonjakan latency.',
    challenge: 'Kandidat mendiagnosa bottleneck database pool, mengatasi memory leak, dan menerapkan pattern circuit-breaker.',
    output: 'Diagram keputusan arsitektur & grafik penurunan latensi',
    duration: '25 Menit',
  },
  {
    id: 'analytics',
    role: 'Product Analytics',
    title: 'Analisis Anomali Penurunan Retensi Pengguna',
    challenge: 'Terjadi penurunan retensi H+7 sebesar 14% secara tiba-tiba pasca perilisan update aplikasi.',
    scenario: 'Kandidat mengkueri dataset kohort pengguna, memisahkan segmen yang terdampak, dan menyusun hipotesis perbaikan.',
    output: 'Laporan atribusi statistik & dokumen rekomendasi strategi',
    duration: '20 Menit',
  },
  {
    id: 'frontend',
    role: 'Frontend Performance',
    title: 'Optimasi Virtual DOM & Memory Leak Render',
    challenge: 'Web app mengalami frame drop parah saat melakukan render list 10,000 item berkecepatan tinggi.',
    scenario: 'Kandidat mengimplementasikan windowing DOM virtualization serta memperbaiki unhandled listener leak.',
    output: 'Hasil benchmark FPS & profil penggunaan memori kandidat',
    duration: '30 Menit',
  },
  {
    id: 'sysdesign',
    role: 'System Architecture',
    title: 'Perancangan Distributed Rate Limiter',
    challenge: 'API Gateway kebobolan akibat serangan burst traffic yang mengganggu ketersediaan layanan.',
    scenario: 'Kandidat merancang algoritma Token Bucket terdistribusi menggunakan Redis berarsitektur fault-tolerant.',
    output: 'Dokumen arsitektur teknis & skema struktur data',
    duration: '35 Menit',
  },
];

export function SkenarioSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const selected = SKENARIO_DATA[activeIdx];

  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10">
      <div
        className="border rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-10 md:p-14"
        style={{
          backgroundColor: 'rgba(30,50,90,0.02)',
          borderColor: 'rgba(30,50,90,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200/50 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-2 block">
              Skenario Otentik
            </span>
            <h2
              className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              Uji kandidat dalam konteks kerja nyata.
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base max-w-xs leading-relaxed">
            Pilih skenario per peran teknis untuk melihat tantangan nyata yang diuji oleh platform.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Role Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {SKENARIO_DATA.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`text-left p-5 rounded-[1.25rem] transition-all duration-200 border ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                      : 'bg-white text-gray-900 border-gray-200/60 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-[#F26522]' : 'text-gray-400'}`}>
                      {item.role}
                    </span>
                    <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                      {item.duration}
                    </span>
                  </div>
                  <h4 className="font-semibold text-base md:text-lg line-clamp-1">
                    {item.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Right Active Card Display */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-7 bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 flex flex-col justify-between min-h-[380px] shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#F26522] bg-[#F26522]/10 px-3 py-1 rounded-full">
                  {selected.role}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Estimasi Durasi: {selected.duration}
                </span>
              </div>

              <h3 className="text-gray-900 text-2xl md:text-3xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>
                {selected.title}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-xl p-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Tantangan Studi Kasus
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selected.challenge}
                  </p>
                </div>

                <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-xl p-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Simulasi & Tugas Kandidat
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selected.scenario}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
                  Output Hasil Evaluasi
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {selected.output}
                </span>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#F26522] transition-colors"
              >
                Coba Skenario
                <IconArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
