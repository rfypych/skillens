'use client';

import Link from 'next/link';
import { RiArrowRightUpLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

const STEPS = [
  {
    num: '01',
    title: 'Buat posisi',
    desc: 'Tentukan peran, KKM kelulusan, dan kriteria AI dalam 3 langkah wizard.',
  },
  {
    num: '02',
    title: 'Kandidat mengikuti tes',
    desc: 'Bagikan tautan evaluasi. Kandidat mengerjakan simulasi 15 menit terpantau telemetri.',
  },
  {
    num: '03',
    title: 'Terima bukti',
    desc: 'Skor, label validasi, dan laporan forensik siap. Undang yang lulus KKM.',
  },
];

export function StepsSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="bg-background-primary-default border border-border-button-default rounded-2xl p-6 sm:p-10 md:p-12 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div className="flex flex-col gap-2">
            <p className="text-caption-1-semibold text-text-tertiary">
              Mulai dalam 3 langkah
            </p>
            <h2 className="text-title-1-medium text-text-primary max-w-xl">
              Dari lowongan ke bukti dalam sehari.
            </h2>
          </div>
          <Link href="/signup">
            <Button variant="primary" size="medium" trailingIcon={RiArrowRightUpLine}>
              Mulai Gratis
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="flex flex-col gap-3 rounded-2xl bg-background-secondary-default p-6"
            >
              <span className="text-body-medium tabular-nums text-accent-600">{s.num}</span>
              <h3 className="text-title-3-semibold text-text-primary">{s.title}</h3>
              <p className="text-body-regular leading-relaxed text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
