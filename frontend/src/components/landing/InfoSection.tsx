'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Mini candidate evaluation card — shown inside the wide Card 1
function EvalScoreCard() {
  const skills = [
    { label: 'Kompetensi Teknis', score: 84, color: '#F26522' },
    { label: 'Kedalaman Analitis', score: 92, color: '#F26522' },
    { label: 'Keputusan Strategis', score: 97, color: '#F26522' },
  ];
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-5 w-full max-w-xs shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Laporan Evaluasi</span>
        <span className="text-[10px] font-mono bg-gray-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Final</span>
      </div>
      <div className="space-y-4 mb-5">
        {skills.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[12px] text-gray-600 font-medium">{s.label}</span>
              <span className="text-[12px] font-mono font-bold text-gray-900">{s.score}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.score}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
        <span className="text-xs text-gray-400">Skor Keseluruhan</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900" style={{ letterSpacing: '-0.03em' }}>96</span>
          <span className="text-xs text-gray-400">/100</span>
          <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
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
    bg: '#E5DFCE',   // warm parchment — our version of the reference image card
    textColor: 'text-gray-900',
    bodyColor: 'text-gray-600',
    colSpan: 'lg:col-span-2',
    hasVisual: true,
  },
  {
    id: 'proof',
    title: 'Tidak bisa\ndiakali.',
    body: 'Telemetri perilaku mendeteksi pola AI dalam < 0.3 detik tanpa mengganggu kandidat.',
    bg: '#111827',
    textColor: 'text-white',
    bodyColor: 'text-white/50',
    colSpan: '',
    hasVisual: false,
  },
  {
    id: 'auto',
    title: 'Sepenuhnya\notomatis.',
    body: 'Rekruiter tidak perlu intervensi manual. Skillens menilai dan menghasilkan laporan sendiri.',
    bg: '#111827',
    textColor: 'text-white',
    bodyColor: 'text-white/50',
    colSpan: '',
    hasVisual: false,
  },
];

export function InfoSection() {
  return (
    <section id="about" className="bg-[#EFEFEF] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">

        {/* ROW 1: 2-col — heading+CTA left | large paragraph right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <h2
              className="text-gray-900 text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: '-0.03em' }}
            >
              Kenali Skillens.
            </h2>
            {/* "Discover it" style pill + arrow (reference exact) */}
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
            >
              Pelajari Lebih
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-gray-900" />
              </span>
            </Link>
          </div>
          <div>
            <p className="text-gray-900/70 text-2xl md:text-3xl leading-relaxed">
              Platform evaluasi kandidat yang mengukur kemampuan nyata — bukan performa resume — lewat simulasi studi kasus interaktif bertenaga AI.
            </p>
          </div>
        </div>

        {/* ROW 2: 4-col card grid (first spans 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl p-7 min-h-80 flex flex-col justify-between ${card.colSpan}`}
              style={{ backgroundColor: card.bg }}
            >
              <h3
                className={`${card.textColor} text-2xl font-medium leading-snug whitespace-pre-line`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {card.title}
              </h3>

              {card.hasVisual && (
                <div className="flex-1 flex items-center py-4">
                  <EvalScoreCard />
                </div>
              )}

              <p className={`${card.bodyColor} text-base max-w-xs leading-relaxed`}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
