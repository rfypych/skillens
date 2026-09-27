'use client';

import {
  RiCheckDoubleLine,
  RiFlashlightLine,
  RiShapesLine,
  RiTimerLine,
} from '@remixicon/react';
import { StatCards } from '@/components/application/dashboard/stat-cards';

export function MetricsSection() {
  return (
    <section id="metrics" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-boardui">
      <div className="flex flex-col gap-1.5 mb-4 px-1">
        <p className="text-caption-1-semibold text-text-tertiary">
          Platform dalam angka
        </p>
        <h2 className="text-title-1-medium text-text-primary">
          Bukti dalam angka.
        </h2>
      </div>

      <StatCards
        variant="footer"
        stats={[
          {
            icon: RiCheckDoubleLine,
            label: 'Simulasi selesai',
            value: '3,400+',
            delta: '12%',
            deltaColor: 'lime',
            tone: 'blue',
            caption: 'Dari total periode berjalan',
            hint: 'Simulasi studi kasus yang diselesaikan kandidat dari semua posisi aktif. Perbandingan terhadap periode sebelumnya.',
          },
          {
            icon: RiFlashlightLine,
            label: 'Akurasi deteksi AI',
            value: '98.4%',
            delta: '1.1%',
            deltaColor: 'lime',
            tone: 'orange',
            caption: 'Dari total periode berjalan',
            hint: 'Proporsi sinyal kecurangan yang terkonfirmasi benar dari seluruh telemetri yang ditandai sistem.',
          },
          {
            icon: RiTimerLine,
            label: 'Kecepatan deteksi',
            value: '< 0.3s',
            delta: 'tetap',
            deltaColor: 'neutral',
            tone: 'purple',
            caption: 'Dari total periode berjalan',
            hint: 'Waktu yang dibutuhkan sistem untuk menandai aktivitas mencurigakan sejak terjadi.',
          },
          {
            icon: RiShapesLine,
            label: 'Skenario tersedia',
            value: '50+',
            delta: '8 baru',
            deltaColor: 'lime',
            tone: 'emerald',
            caption: 'Dari total periode berjalan',
            hint: 'Jumlah skenario studi kasus lintas peran dan arketipe yang siap dipakai kapan saja.',
          },
        ]}
      />
    </section>
  );
}
