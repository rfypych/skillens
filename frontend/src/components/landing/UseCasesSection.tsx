'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons/CustomIcons';

const SCENARIOS = [
  {
    id: 'backend',
    role: 'Backend Engineering',
    title: 'Incident Response: Concurrency & Connection Pool Exhaustion',
    challenge: 'Server mengalami spike latency akibat db connection leak pada mikroservis checkout.',
    task: 'Diagnosa log telemetri, identifikasi memory leak, dan terapkan circuit breaker pattern.',
    output: 'Arsitektur keputusan kandidat & grafik latensi akhir',
    duration: '25 Menit',
  },
  {
    id: 'analytics',
    role: 'Product Analytics',
    title: 'Root Cause Analysis: Sudden User Retention Drop',
    challenge: 'Terjadi penurunan retensi H+7 sebesar 14% setelah perilisan fitur baru.',
    task: 'Kueri data kohort, isolasi anomali segmen pengguna, dan susun rekomendasi hipotesis.',
    output: 'Laporan analisis statistik & sintesis tindakan',
    duration: '20 Menit',
  },
  {
    id: 'frontend',
    role: 'Frontend Engineering',
    title: 'State Hydration & Memory Leak Optimization',
    challenge: 'Aplikasi web mengalami frame drop parah saat melakukan render list 10,000 item.',
    task: 'Implementasi virtualisasi DOM dan perbaiki memory leak event listener.',
    output: 'Profile memori & benchmark FPS real-time',
    duration: '30 Menit',
  },
  {
    id: 'sysdesign',
    role: 'System Architecture',
    title: 'Distributed Rate Limiting & Quotas',
    challenge: 'Sistem API gateway kebobolan akibat serangan burst traffic berlebihan.',
    task: 'Rancang algoritma Token Bucket terdistribusi menggunakan Redis secara fault-tolerant.',
    output: 'Diagram keputusan teknis & dokumen arsitektur',
    duration: '35 Menit',
  },
];

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const selected = SCENARIOS[activeTab];

  return (
    <section id="scenarios" className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-brand-gray-light">
      <div className="mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-primary mb-2 block">
          [ SKENARIO EVALUASI ]
        </span>
        <h2
          className="text-brand-dark text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Studi Kasus Otentik Per Domain
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation List (Left) */}
        <div className="lg:col-span-4 flex flex-col border border-brand-gray-light bg-brand-white">
          {SCENARIOS.map((item, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`text-left p-5 border-b border-brand-gray-light last:border-b-0 transition-colors flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#012631] text-brand-white'
                    : 'bg-brand-white text-brand-dark hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-mono uppercase ${isActive ? 'text-brand-accent' : 'text-brand-primary'}`}>
                    0{idx + 1} // {item.role}
                  </span>
                  <span className="text-xs font-mono">{item.duration}</span>
                </div>
                <div className="font-bold text-base line-clamp-1">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel (Right) */}
        <div className="lg:col-span-8 border border-brand-gray-light bg-brand-white p-8 md:p-12 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-gray-light">
              <span className="text-xs font-mono text-brand-primary uppercase">
                // {selected.role}
              </span>
              <span className="text-xs font-mono bg-brand-primary text-brand-white px-3 py-1">
                Estimasi: {selected.duration}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">
              {selected.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border border-brand-gray-light bg-gray-50">
                <span className="text-xs font-bold text-brand-dark block mb-2 uppercase tracking-wide">
                  Tantangan Studi Kasus
                </span>
                <p className="text-xs text-brand-gray-dark leading-relaxed">
                  {selected.challenge}
                </p>
              </div>

              <div className="p-4 border border-brand-gray-light bg-gray-50">
                <span className="text-xs font-bold text-brand-dark block mb-2 uppercase tracking-wide">
                  Tugas Utama Kandidat
                </span>
                <p className="text-xs text-brand-gray-dark leading-relaxed">
                  {selected.task}
                </p>
              </div>
            </div>

            <div className="p-4 border-l-2 border-brand-primary bg-brand-white">
              <span className="text-xs font-mono text-brand-gray-dark block mb-1">
                Output Hasil Evaluasi Otomatis:
              </span>
              <span className="text-sm font-bold text-brand-dark">
                {selected.output}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-gray-light flex items-center justify-between">
            <span className="text-xs text-brand-gray-dark font-mono">
              [ Anti-AI Slop Guard Active ]
            </span>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-brand-primary text-brand-white text-xs font-bold px-6 py-3 hover:bg-brand-dark-teal transition-colors"
            >
              Uji Skenario Ini
              <IconArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
