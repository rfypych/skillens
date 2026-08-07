'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  WatermarkArchitecture,
  WatermarkTelemetryPulse,
  IconAuditShield,
  IconNodeMesh,
  IconArrowUpRight,
} from '@/components/icons/CustomIcons';

/* Card 1 — Tall left (row-span-2) — BIOSPHERE HERO */
function CardBiosphere() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0 }}
      className="group relative bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 md:row-span-2 min-h-[28rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-shadow duration-300"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Orange glow */}
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[#F26522] opacity-10 blur-3xl pointer-events-none" />

      {/* Top content */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F26522]/20 border border-[#F26522]/30 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F26522] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F26522]">Inovasi Utama</span>
        </div>
        <h3
          className="text-white text-2xl md:text-3xl font-semibold leading-snug mt-2 max-w-xs"
          style={{ letterSpacing: '-0.03em' }}
        >
          Biosphere Intelligence
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-[240px]">
          Simulasikan masa depan kandidat di dalam tim Anda — 30, 90, dan 180 hari ke depan — sebelum mereka bergabung.
        </p>
      </div>

      {/* Feature list + CTA */}
      <div className="relative z-10 space-y-3">
        {[
          { dot: '#F26522', text: 'Sidik Jari Kognitif 6 Dimensi' },
          { dot: '#8B5CF6', text: 'Team DNA Network Graph' },
          { dot: '#06B6D4', text: 'Prediksi Performa 180 Hari' },
          { dot: '#10B981', text: 'Blind Hiring Anti-Bias Mode' },
        ].map(f => (
          <div key={f.text} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.dot }} />
            <span className="text-gray-300 text-xs font-medium">{f.text}</span>
          </div>
        ))}
        <Link
          href="/recruiter"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/20 px-4 py-2 rounded-full hover:border-[#F26522] hover:text-[#F26522] transition-all duration-200"
        >
          Lihat Demo
          <IconArrowUpRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

/* Card 2 — Wide top-right (col-span-2) */
function CardRealtime() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 md:col-span-2 min-h-[14rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300"
    >
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none">
        <WatermarkTelemetryPulse
          size={280}
          className="text-gray-900 opacity-[0.02] group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Telemetri Real-time</span>
        <h3
          className="text-gray-900 text-2xl md:text-3xl font-semibold mt-3"
          style={{ letterSpacing: '-0.03em' }}
        >
          Evaluasi Instan. Tanpa Bias.
        </h3>
      </div>
      <p className="relative z-10 text-gray-500 text-[15px] leading-relaxed max-w-sm">
        Hasil sidik jari kognitif tersedia dalam hitungan menit. AI menilai kedalaman berpikir nyata — bukan sekadar hafalan atau copy-paste.
      </p>
    </motion.div>
  );
}

/* Card 3 — Bottom middle */
function CardUnlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 min-h-[14rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <WatermarkArchitecture
          size={260}
          className="text-gray-900 opacity-[0.02] group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Anti-Manipulasi</span>
        <h3
          className="text-gray-900 text-2xl font-semibold mt-3 leading-snug"
          style={{ letterSpacing: '-0.02em' }}
        >
          Tidak bisa<br />diakali AI.
        </h3>
        <p className="text-gray-500 text-[15px] mt-3 leading-relaxed">
          Studi kasus dikalibrasi dinamis. Setiap kandidat mendapat soal unik yang tidak bisa di-Google atau di-ChatGPT.
        </p>
      </div>
      <Link
        href="/signup"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all duration-200 w-fit"
      >
        <IconAuditShield size={14} className="text-[#F26522]" />
        Coba Sekarang
      </Link>
    </motion.div>
  );
}

/* Card 4 — Bottom right */
function CardComparative() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 min-h-[14rem] flex flex-col items-center justify-center overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300 text-center gap-4"
    >
      <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Multi-Kandidat</span>
      <h3
        className="text-gray-900 text-2xl font-semibold leading-tight"
        style={{ letterSpacing: '-0.02em' }}
      >
        Bandingkan<br />hingga 4 kandidat.
      </h3>
      <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300 group-hover:scale-110 transform">
        <IconNodeMesh size={18} className="text-gray-500 group-hover:text-white transition-colors duration-300" />
      </button>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10">
      {/* Header row */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-gray-900 text-3xl md:text-4xl font-semibold max-w-md leading-snug"
          style={{ letterSpacing: '-0.03em' }}
        >
          Platform HR yang berpikir satu langkah ke depan.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/signup"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-300 px-5 py-2.5 rounded-full hover:border-gray-900 hover:text-gray-900 transition-all duration-200 whitespace-nowrap"
          >
            Mulai Evaluasi
            <IconArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Card grid — 3 cols, 2 rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
        <CardBiosphere />
        <CardRealtime />
        <CardUnlock />
        <CardComparative />
      </div>
    </section>
  );
}
