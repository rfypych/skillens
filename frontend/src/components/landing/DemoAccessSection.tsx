'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RiCheckLine, RiFileCopyLine, RiLoginBoxLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';

const CREDS = [
  { label: 'Rekruter', email: 'recruiter@skillens.com', password: 'password123' },
  { label: 'Kandidat', email: 'kandidat@skillens.com', password: 'password123' },
];

export function DemoAccessSection() {
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    const text = CREDS.map((c) => `${c.label}: ${c.email} / ${c.password}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-boardui">
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <p className="text-caption-1-semibold text-text-tertiary">
          Coba langsung
        </p>
        <h2 className="text-display-3-medium text-text-primary max-w-xl">
          Masuk sebagai demo, tanpa daftar.
        </h2>
        <p className="text-body-medium text-text-secondary max-w-lg">
          Kredensial di bawah aktif di database demo. Salin, tempel di halaman masuk, selesai.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 md:p-5 shadow-card">
        {CREDS.map((c) => (
          <div
            key={c.label}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-background-secondary-default p-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 font-mono text-[13px] leading-relaxed">
              <span className="text-text-tertiary"># {c.label}</span>
              <span className="truncate text-text-primary">{c.email}</span>
              <span className="truncate text-accent-600">{c.password}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <IconButton
                icon={copied ? RiCheckLine : RiFileCopyLine}
                size="small"
                aria-label={`Salin kredensial ${c.label}`}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${c.email} / ${c.password}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch { /* abaikan */ }
                }}
              />
              <Link href="/login">
                <Button variant="primary" size="small" leadingIcon={RiLoginBoxLine}>
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button variant="secondary" size="small" leadingIcon={copied ? RiCheckLine : RiFileCopyLine} onClick={copyAll}>
            {copied ? 'Tersalin' : 'Salin semua'}
          </Button>
        </div>
      </div>
    </section>
  );
}
