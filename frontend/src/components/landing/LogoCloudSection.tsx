'use client';

import SponsorLogos from '@/components/SponsorLogos';

export function LogoCloudSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 font-app">
      <div className="rounded-3xl bg-background-secondary-default px-6 py-6">
        <SponsorLogos />
      </div>
    </section>
  );
}
