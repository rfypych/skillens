'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RiCheckLine, RiFileCopyLine, RiLoginBoxLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';

const CREDS = [
  { label: 'Rekruter', email: 'recruiter@skillens.com', password: 'password123', href: '/recruiter' },
  { label: 'Kandidat', email: 'kandidat@skillens.com', password: 'password123', href: '/candidate/dashboard' },
];

export function DemoAccessSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAll = async () => {
    const text = CREDS.map((c) => `${c.label}: ${c.email} / ${c.password}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-boardui">
      <div className="flex flex-col gap-1.5 mb-4 px-1">
        <p className="text-caption-1-semibold text-text-tertiary">
          Coba langsung
        </p>
        <h2 className="text-title-1-medium text-text-primary max-w-xl">
          Masuk sebagai demo, tanpa daftar.
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#0B0B0C]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <IconButton
            icon={copied ? RiCheckLine : RiFileCopyLine}
            size="small"
            aria-label="Salin kredensial demo"
            onClick={copyAll}
          />
        </div>
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {CREDS.map((c) => (
            <div key={c.label} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1 font-mono text-[13px] leading-relaxed">
                <span className="text-white/40"># {c.label}</span>
                <span className="truncate text-white/90">{c.email}</span>
                <span className="truncate text-accent-500">{c.password}</span>
              </div>
              <Link href="/login" className="shrink-0">
                <Button variant="secondary" size="small" leadingIcon={RiLoginBoxLine}>
                  Masuk
                </Button>
              </Link>
            </div>
          ))}
          <p className="text-body-regular text-white/40">
            Kredensial di atas aktif di database demo. Salin, tempel di halaman masuk, selesai.
          </p>
        </div>
      </div>
    </section>
  );
}
