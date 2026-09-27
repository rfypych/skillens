'use client';

import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { Chip } from '@/components/base/badges/chip';

export function SpotlightSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-boardui">
      <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-2xl bg-[#0B0B0C] p-6 md:p-10 overflow-hidden relative">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 12% 50%, rgba(242, 101, 34, 0.22) 0%, rgba(11, 11, 12, 0) 60%)',
          }}
        />
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-caption-1-semibold text-white/40">
            Sorotan
          </p>
          <h2 className="text-title-1-medium text-white max-w-md">
            Telemetri yang layak ditatap.
          </h2>
          <p className="text-body-medium text-white/60 max-w-md">
            Setiap ketikan diukur: kecepatan, jeda, revisi, dan tempelan. Yang jujur lolos, yang curang tertanda — otomatis.
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Chip variant="caption" color="neutral">13 sinyal</Chip>
            <Chip variant="caption" color="neutral">Real-time</Chip>
            <Chip variant="caption" color="neutral">Tanpa kamera</Chip>
          </div>
        </div>
        <div className="relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-12">
          <ThinkingIndicator statusText="Menganalisis ketikan…" />
        </div>
      </div>
    </section>
  );
}
