'use client';

import Link from 'next/link';
import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

export function CTASection() {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 pb-6 md:pb-8 bg-background-full font-boardui">
      <section className="relative w-full max-w-[1760px] mx-auto rounded-3xl border border-border-button-default bg-background-primary-default overflow-hidden flex flex-col items-center justify-center px-6 py-16 md:py-24 shadow-card">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 40% 100% at 30% 0%, rgba(242, 101, 34, 0.14) 0%, rgba(255, 255, 255, 0) 70%), radial-gradient(ellipse 40% 100% at 70% 0%, rgba(242, 101, 34, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          }}
        />

        <div className="relative flex flex-col items-center text-center gap-4">
          <p className="text-caption-1-semibold text-text-tertiary">
            Siap mulai?
          </p>

          <h2 className="text-display-3-medium md:text-display-2-medium text-text-primary max-w-2xl">
            Rekrut berdasarkan bukti, bukan asumsi.
          </h2>

          <div className="flex flex-row flex-wrap items-center justify-center gap-2.5 mt-2">
            <Link href="/signup">
              <Button variant="primary" size="medium" trailingIcon={RiArrowRightUpLine}>
                Mulai Gratis
              </Button>
            </Link>

            <Link href="/recruiter">
              <Button variant="secondary" size="medium" trailingIcon={RiArrowRightLine}>
                Lihat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
