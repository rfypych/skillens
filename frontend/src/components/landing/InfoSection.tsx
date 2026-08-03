'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconArrowUpRight, IconTelemetrySignal, IconAuditShield } from '@/components/icons/CustomIcons';

// Mini candidate evaluation card — shown inside wide Card 1
function EvalScoreCard() {
  const skills = [
    { label: 'Kompetensi Teknis', score: 88, color: '#F26522' },
    { label: 'Kedalaman Analitis', score: 94, color: '#F26522' },
    { label: 'Keputusan Strategis', score: 96, color: '#F26522' },
  ];

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-900/10 p-5 w-full max-w-sm shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500 font-semibold">Laporan Telemetri</span>
        </div>
        <span className="text-[10px] font-mono bg-gray-900 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">Terverifikasi</span>
      </div>
      <div className="space-y-3.5 mb-4">
        {skills.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-700 font-medium">{s.label}</span>
              <span className="text-xs font-mono font-bold text-gray-900">{s.score}%</span>
            </div>
            <div className="h-1.5 bg-gray-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${s.score}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-3.5 border-t border-gray-200/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">Skor Keseluruhan</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">96</span>
          <span className="text-xs text-gray-400 font-mono">/100</span>
        </div>
      </div>
    </div>
  );
}

// Feature cards data — matches reference 4-col layout with first spanning 2
const CARDS = [
  {
    id: 'fact',
    title: 'Evaluasi berbasis\nfakta, bukan asumsi.',
    body: 'Kandidat diuji dalam simulasi langsung. Setiap keputusan terekam dan dinilai secara objektif.',
    bg: '#E5DFCE',   // warm parchment
    textColor: 'text-gray-900',
    bodyColor: 'text-gray-700',
    colSpan: 'lg:col-span-2',
    hasVisual: true,
  },
  {
    id: 'proof',
    title: 'Tidak bisa\ndiakali AI.',
    body: 'Telemetri perilaku mendeteksi pola copy-paste AI dalam < 0.3 detik tanpa mengganggu kandidat.',
    bg: '#0B0F19',
    textColor: 'text-white',
    bodyColor: 'text-white/60',
    colSpan: '',
    hasVisual: false,
  },
  {
    id: 'auto',
    title: 'Sepenuhnya\notomatis.',
    body: 'Rekruiter tidak perlu intervensi manual. Skillens menilai dan menghasilkan laporan komprehensif instan.',
    bg: '#0B0F19',
    textColor: 'text-white',
    bodyColor: 'text-white/60',
    colSpan: '',
    hasVisual: false,
  },
];

export function InfoSection() {
  return (
    <section id="about" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-12 md:py-20">
      <div className="bg-white border rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 border-gray-200/80">

        {/* ROW 1: 2-col — heading+CTA left | large paragraph right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 items-start">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3 block">
              Solusi Evaluasi
            </span>
            <h2
              className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6"
              style={{ letterSpacing: '-0.03em' }}
            >
              Kenali Solusi Skillens.
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-sm font-medium pl-6 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
            >
              Pelajari Selengkapnya
              <span className="bg-white rounded-full p-1.5">
                <IconArrowUpRight size={14} className="text-gray-900" />
              </span>
            </Link>
          </div>
          <div>
            <p className="text-gray-600 text-lg sm:text-xl md:text-2xl leading-relaxed">
              Platform evaluasi kandidat generasi baru yang mengukur kemampuan nyata — bukan performa resume yang dipoles — lewat simulasi studi kasus interaktif bertenaga AI.
            </p>
          </div>
        </div>

        {/* ROW 2: 4-col card grid (first spans 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-[1.5rem] md:rounded-[2rem] p-7 md:p-8 min-h-[22rem] flex flex-col justify-between ${card.colSpan}`}
              style={{ backgroundColor: card.bg }}
            >
              <h3
                className={`${card.textColor} text-2xl font-semibold leading-snug whitespace-pre-line`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {card.title}
              </h3>

              {card.hasVisual && (
                <div className="flex-1 flex items-center justify-center py-6">
                  <EvalScoreCard />
                </div>
              )}

              <p className={`${card.bodyColor} text-sm sm:text-[15px] max-w-xs leading-relaxed`}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
