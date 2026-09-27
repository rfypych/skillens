'use client';

import SponsorLogos from '@/components/SponsorLogos';

export function LogoCloudSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-2 font-boardui">
      <div className="rounded-2xl border border-border-button-default bg-background-primary-default px-6 py-8 shadow-card">
        <SponsorLogos />
      </div>
    </section>
  );
}
