'use client';

import Link from 'next/link';
import {
  RiArrowRightUpLine,
  RiShieldCheckLine,
  RiNodeTree,
} from '@remixicon/react';

function CardMicroSim() {
  return (
    <div className="group relative bg-background-secondary-default border border-separator-border rounded-2xl p-8 md:p-10 md:row-span-2 min-h-[28rem] flex flex-col justify-between overflow-hidden">
      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-caption-1-semibold text-accent-600">
          Lapisan 1
        </p>
        <h3 className="text-title-1-medium text-text-primary max-w-[260px]">
          Micro-Simulation Assessment
        </h3>
        <p className="text-body-regular leading-relaxed text-text-secondary max-w-[240px]">
          Kandidat menghadapi studi kasus nyata sesuai posisi. AI mewawancarai multi-putaran dan menilai 5 dimensi kompetensi.
        </p>
      </div>

      <div className="relative z-10">
        <div className="border-t border-separator-border pt-5 space-y-2.5 mb-5">
          {[
            'Pemahaman Masalah',
            'Pendekatan Solusi',
            'Eksekusi Logis',
            'Komunikasi',
            'Label Integritas',
          ].map((f, i) => (
            <div key={f} className="flex items-center justify-between">
              <span className="text-body-regular text-text-secondary">{f}</span>
              <span className="text-caption-1-semibold tabular-nums text-text-tertiary">D{i + 1}</span>
            </div>
          ))}
        </div>
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Lihat Demo
          <RiArrowRightUpLine className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function CardTelemetry() {
  return (
    <div className="group relative bg-background-primary-default border border-border-button-default rounded-2xl p-8 md:p-10 md:col-span-2 min-h-[14rem] flex flex-col justify-between gap-4 overflow-hidden shadow-card">
      <div className="relative z-10 flex flex-col gap-3">
        <p className="text-caption-1-semibold text-text-tertiary">
          Lapisan 2
        </p>
        <h3 className="text-title-1-medium text-text-primary">
          Deteksi kecurangan. Tanpa kamera.
        </h3>
      </div>
      <p className="relative z-10 text-body-regular leading-relaxed text-text-secondary max-w-sm">
        Keystroke forensics menganalisis 13 sinyal perilaku secara real-time. Kecepatan, jeda, copy-paste, pola mengetik. Tidak ada proctoring invasif.
      </p>
    </div>
  );
}

function CardTalentIntel() {
  return (
    <div className="group relative bg-background-primary-default border border-border-button-default rounded-2xl p-8 md:p-10 min-h-[14rem] flex flex-col justify-between gap-3 overflow-hidden shadow-card">
      <div className="relative z-10 flex flex-col gap-3">
        <p className="text-caption-1-semibold text-text-tertiary">
          Lapisan 3
        </p>
        <h3 className="text-title-2-medium text-text-primary">
          Cognitive<br />Fingerprint.
        </h3>
        <p className="text-body-regular leading-relaxed text-text-secondary">
          Profil multi-dimensi dari jawaban dan perilaku nyata. Bukan skor angka semata.
        </p>
      </div>
      <Link
        href="/signup"
        className="mt-1 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiShieldCheckLine className="size-3.5 text-accent-600" aria-hidden />
        Coba Sekarang
      </Link>
    </div>
  );
}

function CardComparative() {
  return (
    <div className="group relative bg-background-primary-default border border-border-button-default rounded-2xl p-8 md:p-10 min-h-[14rem] flex flex-col items-center justify-center overflow-hidden text-center gap-4 shadow-card">
      <p className="text-caption-1-semibold text-text-tertiary">
        Perbandingan
      </p>
      <h3 className="text-title-2-medium text-text-primary">
        Bandingkan<br />hingga 4 kandidat.
      </h3>
      <span className="flex size-12 items-center justify-center rounded-full bg-background-secondary-default transition-colors duration-300 group-hover:bg-background-tertiary-default">
        <RiNodeTree className="size-[18px] text-foreground-icon-secondary group-hover:text-foreground-icon-primary transition-colors duration-300" aria-hidden />
      </span>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="flex items-end justify-between mb-6 gap-4">
        <h2 className="text-title-1-medium text-text-primary max-w-md">
          Tiga lapisan bukti.<br className="hidden md:block" /> Satu keputusan tepat.
        </h2>
        <Link
          href="/signup"
          className="hidden md:inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring whitespace-nowrap"
        >
          Mulai Evaluasi
          <RiArrowRightUpLine className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
        <CardMicroSim />
        <CardTelemetry />
        <CardTalentIntel />
        <CardComparative />
      </div>
    </section>
  );
}
