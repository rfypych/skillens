'use client';

import Link from 'next/link';
import { RiArrowRightUpLine } from '@remixicon/react';
import { Chip } from '@/components/base/badges/chip';

const SOLUSI_ITEMS = [
  {
    tag: 'Evaluasi utama',
    title: 'Studi Kasus Real-time',
    description: 'Kandidat diuji langsung dalam lingkungan simulasi kerja nyata — menyelesaikan insiden, menganalisis data, dan merancang sistem.',
    stat: '100% praktis',
  },
  {
    tag: 'Keamanan dan integritas',
    title: 'Telemetri Perilaku AI',
    description: 'Mendeteksi kecenderungan penggunaan AI dan kecurangan dalam < 0.3 detik lewat analisis cara berpikir kandidat tanpa proctoring kamera.',
    stat: '< 0.3 dtk deteksi',
  },
  {
    tag: 'Efisiensi tim',
    title: 'Penilaian Otonom',
    description: 'Menghasilkan skor dan laporan analisis mendalam secara otomatis sehingga tim rekruiter dapat mengambil keputusan tanpa periksa manual.',
    stat: 'Otomatis 100%',
  },
];

export function SolusiSection() {
  return (
    <section id="about" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="bg-background-primary-default border border-border-button-default rounded-3xl p-6 sm:p-10 md:p-14 shadow-card">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-separator-border gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-caption-1-semibold text-text-tertiary">
              Solusi evaluasi
            </p>
            <h2 className="text-title-1-medium text-text-primary max-w-xl">
              Merekrut berdasarkan kemampuan nyata.
            </h2>
          </div>
          <p className="text-body-1-medium text-text-secondary max-w-md">
            Menghilangkan tebakan resume dengan evaluasi berbasis simulasi interaktif yang objektif dan transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOLUSI_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-background-secondary-default border border-separator-border rounded-2xl p-6 flex flex-col justify-between gap-6 min-h-[300px]"
            >
              <div className="flex flex-col gap-3">
                <p className="text-caption-1-semibold text-text-tertiary">
                  {item.tag}
                </p>
                <h3 className="text-title-3-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-body-regular leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-separator-border flex items-center justify-between">
                <Chip variant="subtle" color="neutral">{item.stat}</Chip>
                <Link
                  href="/signup"
                  aria-label={`Mulai ${item.title}`}
                  className="flex size-8 items-center justify-center rounded-full text-foreground-icon-tertiary outline-none transition-colors hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiArrowRightUpLine className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
