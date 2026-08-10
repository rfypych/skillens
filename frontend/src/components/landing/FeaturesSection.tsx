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

/* ── Card 1: tall left (row-span-2) ── */
function CardMicroSim() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0 }}
      className="group relative bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 md:row-span-2 min-h-[28rem] flex flex-col justify-between overflow-hidden"
    >
      {/* Nomor editorial besar di background */}
      <span
        className="absolute top-6 right-8 text-[9rem] md:text-[11rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none"
        aria-hidden
      >
        01
      </span>

      {/* Top content */}
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#F26522] font-semibold mb-6">
          Lapisan 1
        </p>
        <h3
          className="text-white text-2xl md:text-3xl font-semibold leading-snug max-w-[260px]"
          style={{ letterSpacing: '-0.03em' }}
        >
          Micro-Simulation Assessment
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-[240px]">
          Kandidat menghadapi studi kasus nyata sesuai posisi. AI mewawancarai multi-putaran dan menilai 5 dimensi kompetensi.
        </p>
      </div>

      {/* Feature list + CTA */}
      <div className="relative z-10">
        <div className="border-t border-white/10 pt-6 space-y-2.5 mb-6">
          {[
            'Pemahaman Masalah',
            'Pendekatan Solusi',
            'Eksekusi Logis',
            'Komunikasi',
            'Label Integritas',
          ].map((f, i) => (
            <div key={f} className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">{f}</span>
              <span className="text-[10px] text-gray-600 font-mono">D{i + 1}</span>
            </div>
          ))}
        </div>
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-150"
        >
          Lihat Demo
          <IconArrowUpRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Card 2: wide top-right (col-span-2) ── */
function CardTelemetry() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="group relative bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 md:col-span-2 min-h-[14rem] flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none">
        <WatermarkTelemetryPulse
          size={280}
          className="text-gray-900 opacity-[0.025] group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-4">
          Lapisan 2
        </p>
        <h3
          className="text-gray-900 text-2xl md:text-3xl font-semibold"
          style={{ letterSpacing: '-0.03em' }}
        >
          Deteksi kecurangan. Tanpa kamera.
        </h3>
      </div>
      <p className="relative z-10 text-gray-500 text-sm leading-relaxed max-w-sm">
        Keystroke forensics menganalisis 13 sinyal perilaku secara real-time. Kecepatan, jeda, copy-paste, pola mengetik. Tidak ada proctoring invasif.
      </p>
    </motion.div>
  );
}

/* ── Card 3: bottom middle ── */
function CardTalentIntel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="group relative bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 min-h-[14rem] flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <WatermarkArchitecture
          size={260}
          className="text-gray-900 opacity-[0.025] group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-4">
          Lapisan 3
        </p>
        <h3
          className="text-gray-900 text-2xl font-semibold leading-snug"
          style={{ letterSpacing: '-0.02em' }}
        >
          Cognitive<br />Fingerprint.
        </h3>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Profil multi-dimensi dari jawaban dan perilaku nyata. Bukan skor angka semata.
        </p>
      </div>
      <Link
        href="/signup"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 w-fit"
      >
        <IconAuditShield size={14} className="text-[#F26522]" />
        Coba Sekarang
      </Link>
    </motion.div>
  );
}

/* ── Card 4: bottom right ── */
function CardComparative() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="group relative bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 min-h-[14rem] flex flex-col items-center justify-center overflow-hidden text-center gap-4"
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
        Perbandingan
      </p>
      <h3
        className="text-gray-900 text-2xl font-semibold leading-tight"
        style={{ letterSpacing: '-0.02em' }}
      >
        Bandingkan<br />hingga 4 kandidat.
      </h3>
      <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
        <IconNodeMesh size={18} className="text-gray-500 group-hover:text-white transition-colors duration-300" />
      </button>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-gray-900 text-3xl md:text-4xl font-semibold max-w-md leading-snug"
          style={{ letterSpacing: '-0.03em' }}
        >
          Tiga lapisan bukti.<br className="hidden md:block" /> Satu keputusan tepat.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/signup"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 whitespace-nowrap"
          >
            Mulai Evaluasi
            <IconArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
        <CardMicroSim />
        <CardTelemetry />
        <CardTalentIntel />
        <CardComparative />
      </div>
    </section>
  );
}
