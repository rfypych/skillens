'use client';

import Link from 'next/link';
import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react';
import ShaderBackground from '@/components/ShaderBackground';
import { Button } from '@/components/base/buttons/button';

export function CTASection() {
  return (
    <div className="w-full flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-7 pb-0 bg-background-full font-boardui">
      <section className="relative w-full max-w-[1760px] rounded-3xl overflow-hidden flex flex-col items-center justify-center min-h-[480px] md:min-h-[560px] bg-[#0B0B0C]">
        <div className="absolute inset-0">
          <ShaderBackground variant="dark" />
        </div>

        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          aria-hidden
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 80%, #F26522 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
          <p className="text-caption-1-semibold text-white/40">
            Siap mulai?
          </p>

          <h2 className="text-display-3-medium md:text-display-2-medium text-white max-w-2xl">
            Rekrut berdasarkan bukti, bukan asumsi.
          </h2>

          <div className="flex flex-row items-center gap-3 mt-2">
            <Link href="/signup">
              <Button variant="secondary" size="medium" trailingIcon={RiArrowRightUpLine}>
                Mulai Gratis
              </Button>
            </Link>

            <Link
              href="/recruiter"
              className="inline-flex items-center gap-1 text-body-medium text-white/50 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-border-focus-ring px-2"
            >
              Lihat Demo
              <RiArrowRightLine className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
