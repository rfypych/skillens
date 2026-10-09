'use client';

import { DotPulse } from '@/components/landing/DotPulse';
import { Chip } from '@/components/base/badges/chip';

const BARS = [38, 62, 45, 80, 55, 70, 42, 66, 50, 74, 58, 64, 48, 72, 52, 60, 44, 68];

export function SpotlightSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-app">
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <p className="text-caption-1-semibold text-text-tertiary">
          Sorotan
        </p>
        <h2 className="text-display-3-medium text-text-primary max-w-xl">
          Telemetri yang layak ditatap.
        </h2>
        <p className="text-body-medium text-text-secondary max-w-lg">
          Setiap ketikan diukur: kecepatan, jeda, revisi, dan tempelan. Yang jujur lolos, yang curang tertanda — otomatis.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-5">
        <div className="flex flex-col justify-center gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-5 md:p-6 shadow-card md:col-span-3">
          <div className="flex items-end gap-1 h-24" aria-hidden>
            {BARS.map((h, i) => (
              <span key={i} className="w-full rounded-full bg-accent-500/70" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip variant="caption" color="neutral">WPM: 84</Chip>
            <Chip variant="caption" color="neutral">Backspace: 4.1%</Chip>
            <Chip variant="caption" color="lime">Paste: 0</Chip>
            <Chip variant="caption" color="neutral">13 sinyal</Chip>
            <Chip variant="caption" color="neutral">Tanpa kamera</Chip>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-background-secondary-default p-5 md:p-6 md:col-span-2">
          <DotPulse label="Menganalisis ketikan…" />
          <p className="text-center text-body-regular text-text-secondary">
            Fluks ketikan live dari sesi kandidat.
          </p>
        </div>
      </div>
    </section>
  );
}
