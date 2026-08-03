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

/* Card 1 — Tall left (row-span-2) */
function CardUnlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-10 md:row-span-2 min-h-[24rem] sm:min-h-[28rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300"
    >
      {/* Watermark icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <WatermarkArchitecture
          size={320}
          className="text-gray-900 opacity-[0.03] group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Evaluasi Adaptif</span>
        <h3
          className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-semibold leading-snug mt-3 max-w-xs"
          style={{ letterSpacing: '-0.03em' }}
        >
          Ungkap kemampuan nyata tanpa bisa dimanipulasi.
        </h3>
      </div>

      <p className="relative z-10 text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-xs mt-6 md:mt-0">
        Setiap studi kasus dikalibrasi secara dinamis — kandidat tidak bisa menghafalkan jawaban atau memanfaatkan AI.
      </p>
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
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-10 md:col-span-2 min-h-[12rem] sm:min-h-[14rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300"
    >
      {/* Watermark */}
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none">
        <WatermarkTelemetryPulse
          size={280}
          className="text-gray-900 opacity-[0.035] group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Telemetri Real-time</span>
        <h3
          className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-3"
          style={{ letterSpacing: '-0.03em' }}
        >
          Penilaian Instan.
        </h3>
      </div>

      <p className="relative z-10 text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-sm mt-4 md:mt-0">
        Hasil evaluasi tersedia dalam hitungan menit — bukan hari. AI menilai kedalaman berpikir, bukan hafalan.
      </p>
    </motion.div>
  );
}

/* Card 3 — Bottom middle */
function CardAudit() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-10 min-h-[12rem] sm:min-h-[14rem] flex flex-col justify-between overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300"
    >
      <div className="relative z-10">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Keamanan</span>
        <h3
          className="text-gray-900 text-xl sm:text-2xl font-semibold mt-2 sm:mt-3 leading-snug"
          style={{ letterSpacing: '-0.02em' }}
        >
          Keamanan<br />Tingkat Enterprise.
        </h3>
        <p className="text-gray-500 text-sm sm:text-[15px] mt-2 sm:mt-3 leading-relaxed">
          Smart contracts diaudit. Data terenkripsi. Infrastruktur ISO 27001.
        </p>
      </div>
      <Link
        href="/signup"
        className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all duration-200 w-fit"
      >
        <IconAuditShield size={14} className="text-[#F26522]" />
        Lihat Kebijakan
      </Link>
    </motion.div>
  );
}

/* Card 4 — Bottom right */
function CardCrossRole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-10 min-h-[12rem] sm:min-h-[14rem] flex flex-col items-center justify-center overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 text-center gap-4"
    >
      <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Multi-Peran</span>
      <h3
        className="text-gray-900 text-xl sm:text-2xl font-semibold leading-tight"
        style={{ letterSpacing: '-0.02em' }}
      >
        Engineering,<br />Product & Analytics.
      </h3>
      <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300 group-hover:scale-110 transform">
        <IconNodeMesh size={18} className="text-gray-600 group-hover:text-white transition-colors duration-300" />
      </button>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full px-3 md:px-5 py-6 md:py-10">
      {/* Header row */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-semibold max-w-md leading-snug"
          style={{ letterSpacing: '-0.03em' }}
        >
          Dirancang untuk evaluasi berkinerja tinggi.
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

      {/* Card grid — 1-col mobile, 3-col md */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
        <CardUnlock />
        <CardRealtime />
        <CardAudit />
        <CardCrossRole />
      </div>
    </section>
  );
}
