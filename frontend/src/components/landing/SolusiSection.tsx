'use client';

import Link from 'next/link';
import {
  RiArrowRightUpLine,
  RiFocus3Line,
  RiShieldCheckLine,
  RiSparklingLine,
} from '@remixicon/react';

const SOLUSI_ITEMS = [
  {
    icon: RiFocus3Line,
    tag: 'Evaluasi utama',
    title: 'Studi Kasus Real-time',
    description: 'Kandidat diuji langsung dalam lingkungan simulasi kerja nyata — menyelesaikan insiden, menganalisis data, dan merancang sistem.',
    stat: '100% praktis',
  },
  {
    icon: RiShieldCheckLine,
    tag: 'Keamanan dan integritas',
    title: 'Telemetri Perilaku AI',
    description: 'Mendeteksi kecenderungan penggunaan AI dan kecurangan dalam < 0.3 detik lewat analisis cara berpikir kandidat tanpa proctoring kamera.',
    stat: '< 0.3 dtk deteksi',
  },
  {
    icon: RiSparklingLine,
    tag: 'Efisiensi tim',
    title: 'Penilaian Otonom',
    description: 'Menghasilkan skor dan laporan analisis mendalam secara otomatis sehingga tim rekruiter dapat mengambil keputusan tanpa periksa manual.',
    stat: 'Otomatis 100%',
  },
];

export function SolusiSection() {
  return (
    <section id="about" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4 px-1">
        <div className="flex flex-col gap-1.5">
          <p className="text-caption-1-semibold text-text-tertiary">
            Solusi evaluasi
          </p>
          <h2 className="text-title-1-medium text-text-primary max-w-xl">
            Merekrut berdasarkan kemampuan nyata.
          </h2>
        </div>
        <p className="text-body-medium text-text-secondary max-w-md">
          Menghilangkan tebakan resume dengan evaluasi berbasis simulasi interaktif yang objektif dan transparan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SOLUSI_ITEMS.map((item) => (
          <section
            key={item.title}
            className="flex min-h-[280px] min-w-0 flex-col items-start justify-between gap-4 rounded-2xl bg-background-secondary-default p-4"
          >
            <span className="flex items-center rounded-md bg-stat-card-icon-background p-1.5">
              <item.icon className="size-5 shrink-0 text-foreground-icon-primary" aria-hidden />
            </span>
            <div className="flex w-full flex-col gap-1.5">
              <p className="text-caption-1-semibold text-text-tertiary">{item.tag}</p>
              <h3 className="text-title-3-semibold text-text-primary">{item.title}</h3>
              <p className="text-body-regular leading-relaxed text-text-secondary">
                {item.description}
              </p>
              <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-2">
                <span className="text-body-medium tabular-nums text-text-primary">{item.stat}</span>
                <Link
                  href="/signup"
                  aria-label={`Mulai ${item.title}`}
                  className="flex size-8 items-center justify-center rounded-full text-foreground-icon-tertiary outline-none transition-colors hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiArrowRightUpLine className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
