'use client';

import { useState } from 'react';
import { RiAddLine } from '@remixicon/react';
import { cx } from '@/utils/cx';

const FAQS = [
  {
    q: 'Apa itu Skillens?',
    a: 'Platform evaluasi kandidat berbasis bukti. Kandidat mengerjakan simulasi studi kasus interaktif, AI menilai 6 dimensi kompetensi dari jawaban nyata — bukan dari klaim resume.',
  },
  {
    q: 'Bagaimana tesnya berjalan?',
    a: 'Rekruiter membuat posisi dan membagikan tautan. Kandidat mengunggah CV lalu mengerjakan simulasi multi-putaran sekitar 15 menit. Skor dan label validasi keluar otomatis.',
  },
  {
    q: 'Bagaimana kecurangan dideteksi?',
    a: '13 sinyal perilaku (kecepatan ketik, backspace, tempelan, pindah tab, trap-word) dianalisis real-time tanpa webcam. Yang terindikasi ditandai di laporan.',
  },
  {
    q: 'Apa itu KKM dan Hidden Gem?',
    a: 'KKM adalah ambang skor kelulusan per posisi. Hidden Gem adalah kandidat yang skor buktinya jauh melampaui klaim CV-nya — sering terlewat di skrining biasa.',
  },
  {
    q: 'Apakah perlu daftar untuk mencoba?',
    a: 'Tidak. Pakai akun demo di atas untuk masuk langsung sebagai rekruiter atau kandidat dan menjelajahi seluruh alur.',
  },
];

function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-border-button-default bg-background-primary-default shadow-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 md:p-5 text-left outline-none transition-colors hover:bg-background-primary-hover active:bg-background-primary-active focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
      >
        <span className="text-body-1-medium text-text-primary">{q}</span>
        <span
          className={cx(
            'flex size-8 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary transition-transform duration-200',
            open && 'rotate-45',
          )}
        >
          <RiAddLine className="size-4" aria-hidden />
        </span>
      </button>
      {open && (
        <p className="px-4 md:px-5 pb-4 md:pb-5 text-body-regular leading-relaxed text-text-secondary">
          {a}
        </p>
      )}
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-app">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex flex-col gap-1.5 px-1 text-center items-center">
          <p className="text-caption-1-semibold text-text-tertiary">
            Tanya jawab
          </p>
          <h2 className="text-title-2-medium text-text-primary">
            Sering ditanyakan.
          </h2>
        </div>
        {FAQS.map((f, i) => (
          <FaqRow key={f.q} q={f.q} a={f.a} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}
