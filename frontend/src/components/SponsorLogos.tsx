'use client';

import { cx } from '@/utils/cx';

/**
 * Strip logo sponsor/partner Skillens (JHIC, Jagoan Hosting, Komdigi,
 * Garuda Spark, Ngalup). Tinggi visual seragam (h-6) dengan batas lebar
 * per logo agar proporsi aslinya tetap seimbang.
 */

const LOGOS = [
  { src: '/sponsors/jhic.png', alt: 'JHIC', className: 'max-w-[92px]' },
  { src: '/sponsors/jagoanhosting.png', alt: 'Jagoan Hosting', className: 'max-w-[150px]' },
  { src: '/sponsors/komdigi.png', alt: 'Komdigi', className: 'max-w-[76px]' },
  { src: '/sponsors/garudaspark.png', alt: 'Garuda Spark', className: 'max-w-[104px]' },
  { src: '/sponsors/ngalup.png', alt: 'Ngalup', className: 'max-w-[150px]' },
];

function LogoRow({ className }: { className?: string }) {
  return (
    <div className={cx('flex flex-wrap items-center justify-center gap-x-8 gap-y-4', className)}>
      {LOGOS.map((logo) => (
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          decoding="async"
          className={cx(
            'h-6 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0',
            logo.className,
          )}
        />
      ))}
    </div>
  );
}

export default function SponsorLogos({ variant = 'strip' }: { variant?: 'strip' | 'band' }) {
  if (variant === 'band') {
    return (
      <footer className="flex w-full flex-col items-center gap-3 border-t border-separator-border px-4 py-6">
        <p className="text-caption-1-semibold text-text-tertiary">Didukung oleh</p>
        <LogoRow />
      </footer>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-3 px-2 py-6">
      <p className="text-caption-1-semibold text-text-tertiary">Didukung oleh</p>
      <LogoRow />
    </div>
  );
}
