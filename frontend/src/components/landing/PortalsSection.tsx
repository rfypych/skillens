'use client';

import Link from 'next/link';
import { RiArrowRightUpLine, RiBriefcaseLine, RiUserSmileLine } from '@remixicon/react';

const PORTALS = [
  {
    icon: RiBriefcaseLine,
    title: 'Portal Rekruiter',
    desc: 'Dasbor ATS: peringkat, audit forensik, penjadwalan, dan analitik.',
    rows: ['Peringkat + KKM otomatis', 'Audit telemetri per kandidat', 'Undang wawancara 1 klik'],
    href: '/recruiter',
    cta: 'Buka dasbor',
  },
  {
    icon: RiUserSmileLine,
    title: 'Portal Kandidat',
    desc: 'Tes simulasi 15 menit yang adil dan terpantau.',
    rows: ['Simulasi multi-putaran', 'Skor objektif real-time', 'Riwayat lamaran jelas'],
    href: '/candidate/dashboard',
    cta: 'Mulai tes',
  },
];

export function PortalsSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-boardui">
      <div className="flex flex-col gap-1.5 mb-4 px-1">
        <p className="text-caption-1-semibold text-text-tertiary">
          Template siap pakai
        </p>
        <h2 className="text-title-1-medium text-text-primary max-w-xl">
          Dua portal, satu bukti.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PORTALS.map((p) => (
          <div
            key={p.title}
            className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border-button-default bg-background-primary-default p-5 md:p-6 shadow-card"
          >
            <span className="flex size-10 items-center justify-center rounded-2lg bg-gradient-to-b from-accent-500 to-accent-600">
              <p.icon className="size-5 shrink-0 text-white" aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-title-3-semibold text-text-primary">{p.title}</h3>
              <p className="text-body-regular text-text-secondary">{p.desc}</p>
            </div>
            <ul className="flex flex-col gap-1.5 border-t border-separator-border pt-4">
              {p.rows.map((r) => (
                <li key={r} className="flex items-center gap-2 text-body-regular text-text-secondary">
                  <span className="size-1 rounded-full bg-accent-500" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
            <Link
              href={p.href}
              className="mt-auto inline-flex items-center gap-1.5 text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              {p.cta}
              <RiArrowRightUpLine className="size-3.5" aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
