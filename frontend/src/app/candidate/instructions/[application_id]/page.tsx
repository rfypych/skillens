'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RiAlertLine,
  RiArrowRightLine,
  RiCloseLine,
  RiFileCheckLine,
  RiInformationLine,
  RiLightbulbFlashLine,
  RiLockLine,
  RiShieldCheckLine,
  RiTimeLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { cx } from '@/utils/cx';

function CandidateOnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState(0);

  if (!isOpen) return null;

  const guides = [
    {
      title: 'Tahap 1: Konsep Simulasi AI',
      icon: RiLightbulbFlashLine,
      bullets: [
        'Ujian ini berbasis **skenario studi kasus nyata** industri, bukan soal hafalan atau pilihan ganda.',
        'AI bertindak sebagai penguji teknis yang mengukur alur kerja, arsitektur, dan keputusan teknis Anda.',
        'Jawablah secara jujur dan spesifik berdasarkan pengalaman langsung Anda.'
      ]
    },
    {
      title: 'Tahap 2: Aturan dan Integritas',
      icon: RiAlertLine,
      bullets: [
        'Durasi total adalah **15 menit** dan penghitung waktu tidak dapat dihentikan.',
        'Dilarang **pindah tab** atau **copy-paste** teks. Sistem telemetri akan menandai aktivitas mencurigakan.',
        'Pastikan koneksi internet Anda stabil sebelum menekan tombol Mulai Assessment.'
      ]
    },
    {
      title: 'Tahap 3: Tips Penilaian Maksimal',
      icon: RiShieldCheckLine,
      bullets: [
        'Gunakan metode terstruktur saat menjawab (masalah, solusi, dampak).',
        'Jelaskan **mengapa** Anda mengambil keputusan tersebut, bukan hanya apa yang dilakukan.',
        'Skor evaluasi dikalkulasi secara otomatis dan dapat langsung dilihat oleh tim recruiter.'
      ]
    }
  ];

  const current = guides[currentTab];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-dropdown md:p-7">
        <div className="flex items-center justify-between border-b border-separator-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-accent-50 text-accent-600">
              <RiInformationLine className="size-4" aria-hidden />
            </span>
            <span className="text-body-medium text-text-primary">Panduan Assessment Candidate</span>
          </div>
          <IconButton icon={RiCloseLine} size="small" aria-label="Tutup panduan" onClick={onClose} />
        </div>

        <div className="my-4 flex gap-1 rounded-full border border-separator-border bg-background-secondary-default p-1.5">
          {guides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentTab(idx)}
              className={cx(
                'flex-1 cursor-pointer rounded-full py-1.5 text-caption-1-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                currentTab === idx
                  ? 'bg-background-tertiary-default text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary'
              )}
            >
              Tahap {idx + 1}
            </button>
          ))}
        </div>

        <div className="space-y-3 py-2">
          <h4 className="flex items-center gap-2 text-body-medium text-text-primary">
            <IconComponent className="size-[18px] text-accent-600" aria-hidden />
            {current.title}
          </h4>
          <ul className="space-y-2.5 text-body-regular leading-relaxed text-text-secondary">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-separator-border bg-background-secondary-default p-3">
                <span className="mt-0.5 font-bold text-accent-600">-</span>
                <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-separator-border pt-4">
          <Button variant="secondary" size="small" disabled={currentTab === 0} onClick={() => setCurrentTab(t => t - 1)}>
            Sebelumnya
          </Button>
          <span className="text-body-regular tabular-nums text-text-tertiary">
            {currentTab + 1} / {guides.length}
          </span>
          {currentTab < guides.length - 1 ? (
            <Button variant="secondary" size="small" onClick={() => setCurrentTab(t => t + 1)}>
              Lanjut
            </Button>
          ) : (
            <Button variant="primary" size="small" onClick={onClose}>
              Paham dan Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentInstructions() {
  const router = useRouter();
  const params = useParams();
  const _rawApplicationId = params.application_id;
  const application_id = Array.isArray(_rawApplicationId) ? _rawApplicationId[0] : _rawApplicationId;

  const [agreed, setAgreed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenCandidateTour');
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenCandidateTour', 'true');
  };

  const handleStart = () => {
    if (agreed) {
      router.push(`/candidate/test/${application_id}`);
    }
  };

  const rules = [
    { icon: RiTimeLine, tint: 'text-text-primary', title: 'Durasi 15 Menit', desc: 'Waktu berjalan otomatis begitu tombol ditekan dan tidak dapat dihentikan.' },
    { icon: RiLightbulbFlashLine, tint: 'text-accent-600', title: 'Simulasi Skenario Industri', desc: 'Fokus pada pemecahan masalah praktis dan penjelasan logika keputusan Anda.' },
    { icon: RiAlertLine, tint: 'text-status-yellow-text', title: 'Deteksi Anti-Cheat', desc: 'Sistem otomatis mencatat perpindahan tab dan aktivitas copy-paste ke laporan.' },
    { icon: RiFileCheckLine, tint: 'text-text-primary', title: 'Laporan Evaluasi AI', desc: 'Kedalaman jawaban Anda akan dianalisis secara objektif untuk recruiter.' },
  ];

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background-full px-4 py-10 sm:px-6 md:px-8 font-boardui">
      <CandidateOnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />

      <div className="fixed top-6 right-6 z-40">
        <Button variant="secondary" size="small" leadingIcon={RiInformationLine} onClick={() => setShowGuide(true)}>
          Panduan Assessment
        </Button>
      </div>

      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <Link href="/">
            <img src="/skillens-logo-text.png" alt="Skillens" className="mx-auto h-9 w-auto object-contain" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-8 shadow-dropdown sm:p-10">
          <div className="mb-8 border-b border-separator-border pb-8 text-center">
            <Chip variant="subtle" color="orange" className="mb-4">
              <span className="inline-flex items-center gap-1.5">
                <RiShieldCheckLine className="size-3.5" aria-hidden />Assessment Briefing
              </span>
            </Chip>
            <h1 className="text-title-1-medium text-text-primary">
              Petunjuk Pengerjaan Tes
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-body-medium leading-relaxed text-text-secondary">
              Anda akan memulai simulasi teknis berbasis AI. Harap pahami aturan lingkungan tes sebelum menekan tombol mulai.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rules.map((r) => (
              <div key={r.title} className="flex items-start gap-3.5 rounded-2xl border border-separator-border bg-background-secondary-default p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default shadow-card">
                  <r.icon className={cx('size-[18px]', r.tint)} aria-hidden />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="text-caption-1-semibold text-text-primary">{r.title}</h3>
                  <p className="text-body-regular leading-relaxed text-text-secondary">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <Checkbox isSelected={agreed} onChange={setAgreed}>
              <span className="text-body-regular leading-relaxed text-text-primary">
                Saya memahami seluruh aturan tes, dan bersedia pengerjaan saya dipantau secara otomatis tanpa berpindah tab selama 15 menit.
              </span>
            </Checkbox>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-separator-border pt-4 sm:flex-row">
            <span className="inline-flex items-center gap-1.5 text-body-regular text-text-tertiary">
              <RiLockLine className="size-[13px]" aria-hidden />Sesi ini terenkripsi dan aman
            </span>
            <Button
              variant="primary"
              size="medium"
              trailingIcon={RiArrowRightLine}
              onClick={handleStart}
              disabled={!agreed}
            >
              Mulai Tes Simulasi AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
