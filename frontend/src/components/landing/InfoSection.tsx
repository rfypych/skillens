'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Mini eval report shown inside Card 1
function EvalReport() {
  const rows = [
    { label: 'Kompetensi Teknis', score: 84 },
    { label: 'Kedalaman Analitis', score: 92 },
    { label: 'Keputusan Strategis', score: 97 },
  ];
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 font-mono text-xs">
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Laporan Evaluasi</div>
      <div className="space-y-2.5 mb-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between mb-0.5">
              <span className="text-gray-600">{r.label}</span>
              <span className="text-gray-900 font-bold">{r.score}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F26522]"
                style={{ width: `${r.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2.5 border-t border-gray-200/60 flex justify-between items-center">
        <span className="text-gray-400 text-[10px]">SCORE AKHIR</span>
        <span className="text-gray-900 font-bold text-sm">96/100</span>
      </div>
    </div>
  );
}

const CARDS = [
  {
    id: 'fact',
    title: 'Evaluasi berbasis\nfakta, bukan asumsi.',
    body: 'Kandidat diuji dalam simulasi langsung — bukan kuis hafalan. Setiap keputusan terekam dan dinilai secara objektif.',
    bg: '#E8E3D8',
    textColor: 'text-gray-900',
    bodyColor: 'text-gray-600',
    colSpan: 'lg:col-span-2',
    hasVisual: true,
  },
  {
    id: 'proof',
    title: 'Tidak bisa\ndiakali.',
    body: 'Telemetri perilaku mendeteksi pola AI dalam < 0.3 detik tanpa mengganggu alur kerja kandidat.',
    bg: '#111827',
    textColor: 'text-white',
    bodyColor: 'text-white/50',
    colSpan: '',
    hasVisual: false,
  },
  {
    id: 'auto',
    title: 'Sepenuhnya\notomatis.',
    body: 'Rekruiter tidak perlu intervensi manual. Skillens menganalisis, menilai, dan menghasilkan laporan sendiri.',
    bg: '#111827',
    textColor: 'text-white',
    bodyColor: 'text-white/50',
    colSpan: '',
    hasVisual: false,
  },
];

export function InfoSection() {
  return (
    <section id="about" className="bg-[#EFEFEF] px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-[88rem] mx-auto">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 sm:mb-16 items-start">
          <div>
            <h2
              className="text-gray-900 text-4xl md:text-5xl font-semibold leading-tight mb-8"
              style={{ letterSpacing: '-0.03em' }}
            >
              Kenali Skillens.
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
            >
              Mulai Evaluasi
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-gray-900" />
              </span>
            </Link>
          </div>
          <div>
            <p className="text-gray-500 text-2xl md:text-3xl leading-relaxed">
              Platform evaluasi kandidat yang mengukur kemampuan nyata — bukan performa resume — lewat simulasi studi kasus interaktif bertenaga AI.
            </p>
          </div>
        </div>

        {/* ROW 2: Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl p-7 min-h-80 flex flex-col justify-between ${card.colSpan}`}
              style={{ backgroundColor: card.bg }}
            >
              <h3
                className={`${card.textColor} text-2xl font-semibold leading-snug whitespace-pre-line`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {card.title}
              </h3>
              {card.hasVisual && (
                <div className="my-4">
                  <EvalReport />
                </div>
              )}
              <p className={`${card.bodyColor} text-[15px] leading-relaxed`}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
