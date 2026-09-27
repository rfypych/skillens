'use client';

import {
  RiAddFill,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBriefcaseLine,
  RiLightbulbLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiFlashlightLine,
  RiFocus3Line,
  RiQuestionLine,
  RiShieldCheckLine,
} from '@remixicon/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { cx } from '@/utils/cx';

const nativeFieldClass =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring';

function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState(0);

  if (!isOpen) return null;

  const guides = [
    {
      title: 'Langkah 1: Ringkasan dan Spesifikasi Peran',
      icon: RiBriefcaseLine,
      bullets: [
        'Isi **Nama posisi**, **Lokasi kerja**, **Rentang gaji**, dan **Tipe pekerjaan**.',
        'Pilih **Bahasa wawancara AI** (English / Indonesian) dan **Batas waktu ujian**.',
        'Aktifkan **Buat deskripsi otomatis** atau tulis deskripsi manual.'
      ]
    },
    {
      title: 'Langkah 2: Parameter Evaluator AI dan KKM',
      icon: RiFocus3Line,
      bullets: [
        '**Batas pertanyaan**: Jumlah pertanyaan pendalaman AI (1-15, default: 5).',
        '**Nilai KKM**: Skor minimum kelulusan (0-100, default: 70).',
        '**Target dan keahlian**: Kriteria target yang akan diuji simulasi AI.'
      ]
    },
    {
      title: 'Langkah 3: Tinjau dan Rilis',
      icon: RiLightbulbLine,
      bullets: [
        'Periksa kembali seluruh parameter peran dan kriteria AI.',
        'Klik **Rilis Ujian** untuk membuat tautan evaluasi publik.'
      ]
    }
  ];

  return (
    <div className="fixed right-6 bottom-6 z-50 w-full max-w-md overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-dropdown">
      <div className="flex items-center justify-between bg-background-tertiary-default p-4 text-text-primary">
        <div className="flex items-center gap-2.5">
          <RiLightbulbLine className="size-5 text-accent-600" aria-hidden />
          <span className="text-body-medium">Panduan posisi</span>
        </div>
        <IconButton icon={RiCloseLine} size="small" aria-label="Tutup panduan" onClick={onClose} />
      </div>

      <div className="flex border-b border-separator-border bg-background-secondary-default">
        {guides.map((g, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentTab(idx)}
            className={cx(
              'flex-1 cursor-pointer border-b-2 py-2.5 text-caption-1-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring',
              currentTab === idx
                ? 'border-accent-500 bg-background-primary-default text-accent-600'
                : 'border-transparent text-text-tertiary hover:text-text-primary'
            )}
          >
            Tahap {idx + 1}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-5">
        {(() => {
          const current = guides[currentTab];
          const Icon = current.icon;
          return (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-body-medium text-text-primary">
                <Icon className="size-5 text-accent-600" aria-hidden />
                {current.title}
              </h4>
              <ul className="space-y-2 text-body-regular leading-relaxed text-text-secondary">
                {current.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 font-bold text-accent-600">-</span>
                    <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      <div className="flex items-center justify-between border-t border-separator-border bg-background-secondary-default p-3">
        <Button variant="secondary" size="small" disabled={currentTab === 0} onClick={() => setCurrentTab(t => t - 1)}>
          Sebelumnya
        </Button>
        <span className="text-caption-1-medium tabular-nums text-text-tertiary">
          {currentTab + 1} / {guides.length}
        </span>
        {currentTab < guides.length - 1 ? (
          <Button variant="secondary" size="small" onClick={() => setCurrentTab(t => t + 1)}>
            Lanjut
          </Button>
        ) : (
          <Button variant="primary" size="small" onClick={onClose}>
            Paham, Tutup
          </Button>
        )}
      </div>
    </div>
  );
}

export default function NewJobWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenNewJobTour');
    if (!hasSeenTour) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenNewJobTour', 'true');
  };

  const ARCHETYPES = [
    { value: 'teknis', label: 'Teknis / Analitis', desc: 'Simulasi studi kasus + forensik ketikan. Untuk engineer, analis, staf kantor.', icon: RiFocus3Line },
    { value: 'lapangan', label: 'Lapangan / Operasional', desc: 'Situational judgment + identifikasi bahaya K3 + telemetri keputusan. Untuk teknisi, sales, kurir.', icon: RiShieldCheckLine },
    { value: 'kreatif', label: 'Kreatif / Portofolio', desc: 'Interogasi portofolio + uji rasa. Untuk desainer, konten kreator, marketing.', icon: RiLightbulbLine },
  ];

  const [formData, setFormData] = useState({
    title: '',
    language: 'English',
    location: '',
    salary_range: '',
    job_type: 'Full-time',
    description: '',
    max_questions: 5,
    archetype: 'teknis',
    kkm_score: 70,
    deadline: '',
  });

  const [autoGenerateDescription, setAutoGenerateDescription] = useState(true);
  const [expectedOutcomes, setExpectedOutcomes] = useState<string[]>(['Mampu merancang arsitektur terdistribusi dengan toleransi kegagalan tinggi']);
  const [specificSkills, setSpecificSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL', 'Docker']);
  const [complianceCriteria, setComplianceCriteria] = useState<string[]>(['Kode bersih', 'Dokumentasi rapi', 'Bebas kerentanan OWASP']);
  const [debiasLoading, setDebiasLoading] = useState(false);
  const [debiasResult, setDebiasResult] = useState<any>(null);

  const handleDebiasCheck = async () => {
    setDebiasLoading(true);
    setDebiasResult(null);
    try {
      const res = await api.post('/jobs/debias-check', {
        title: formData.title,
        description: formData.description,
        expected_outcomes: expectedOutcomes.join('\n'),
        specific_skills: specificSkills.join(', '),
      });
      setDebiasResult(res);
    } catch (e: any) {
      setDebiasResult({ bias_score: 0, label: 'Gagal', issues: [], suggestions: [e.message || 'Gagal memeriksa bias'] });
    } finally {
      setDebiasLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleListAdd = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const handleListChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleListRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.title.trim() || !formData.location.trim() || !formData.salary_range.trim()) {
        setError('Harap isi semua kolom wajib: Nama Posisi, Lokasi Kerja, dan Rentang Gaji.');
        return;
      }
      if (!autoGenerateDescription && !formData.description.trim()) {
        setError('Tuliskan deskripsi pekerjaan atau aktifkan buat deskripsi otomatis.');
        return;
      }
    }
    if (step === 2) {
      if (!expectedOutcomes.some(i => i.trim()) || !specificSkills.some(i => i.trim()) || !complianceCriteria.some(i => i.trim())) {
        setError('Harap isi minimal satu item untuk Target Hasil, Keahlian Spesifik, dan Kriteria Kelulusan.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        description: autoGenerateDescription ? 'AUTO_GENERATE' : formData.description,
        expected_outcomes: expectedOutcomes.filter(i => i.trim()).join('\n'),
        specific_skills: specificSkills.filter(i => i.trim()).join('\n'),
        compliance_criteria: complianceCriteria.filter(i => i.trim()).join('\n')
      };
      const newJob = await api.post('/jobs', payload);
      router.push(`/recruiter/jobs/${newJob.id}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan posisi pekerjaan baru');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Detail dan Spesifikasi Peran' },
    { num: 2, title: 'Parameter AI dan KKM' },
    { num: 3, title: 'Tinjau dan Rilis' }
  ];

  const listRow = (
    items: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    placeholderFn: (idx: number) => string,
  ) => (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            aria-label={`${placeholderFn(idx)}`}
            placeholder={placeholderFn(idx)}
            value={item}
            onChange={(v) => handleListChange(setter, idx, v)}
            className="flex-1"
          />
          {items.length > 1 && (
            <IconButton
              icon={RiDeleteBinLine}
              size="small"
              aria-label="Hapus baris"
              onClick={() => handleListRemove(setter, idx)}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex w-full flex-col gap-4">
      <OnboardingModal isOpen={showGuide} onClose={handleCloseGuide} />

      <div className="absolute top-0 right-0 z-10">
        <Button variant="secondary" size="small" leadingIcon={RiQuestionLine} onClick={() => setShowGuide(true)}>
          Panduan Wizard
        </Button>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Link href="/recruiter/jobs" className="inline-flex items-center gap-1.5 text-body-medium text-text-tertiary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke Posisi Aktif
        </Link>
        
        <p className="text-body-medium text-text-secondary">Konfigurasikan simulasi studi kasus AI untuk kandidat secara otomatis.</p>
      </div>

      <div className="flex items-center rounded-2xl border border-border-button-default bg-background-primary-default p-3 shadow-card">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className="flex items-center gap-2.5">
              <span className={cx(
                'flex size-8 items-center justify-center rounded-full text-caption-1-semibold',
                step === s.num
                  ? 'bg-accent-500 text-white'
                  : step > s.num
                    ? 'bg-background-tertiary-default text-text-primary'
                    : 'bg-background-secondary-default text-text-tertiary'
              )}>
                {step > s.num ? <RiCheckLine className="size-4" aria-hidden /> : s.num}
              </span>
              <span className={cx(
                'hidden text-body-medium sm:block',
                step === s.num ? 'text-accent-600' : step > s.num ? 'text-text-primary' : 'text-text-tertiary'
              )}>
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cx('mx-3 h-0.5 flex-1 rounded-full', step > s.num ? 'bg-accent-500' : 'bg-background-tertiary-default')} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-status-rose-background bg-status-rose-background p-4 text-body-medium text-status-rose-text">
          {error}
        </div>
      )}

      {step === 1 && (
        <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-between border-b border-separator-border pb-4">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-title-3-semibold text-text-primary">1. Detail dan Spesifikasi Peran</h3>
              <p className="text-body-regular text-text-secondary">Tentukan nama posisi, lokasi, gaji, dan metode evaluasi.</p>
            </div>
            <Chip variant="caption" color="neutral">Tahap 1 dari 3</Chip>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Nama posisi *" placeholder="Contoh: Senior Fullstack Engineer" value={formData.title} onChange={(v) => setFormData(p => ({ ...p, title: v }))} />
            <div className="flex flex-col gap-1.5">
              <span className="text-body-medium text-text-primary">Tipe pekerjaan *</span>
              <Select aria-label="Tipe pekerjaan" selectedKey={formData.job_type} onSelectionChange={(k) => setFormData(p => ({ ...p, job_type: String(k) }))}>
                <SelectItem id="Full-time">Full-time (Penuh Waktu)</SelectItem>
                <SelectItem id="Part-time">Part-time (Paruh Waktu)</SelectItem>
                <SelectItem id="Contract">Kontrak / Freelance</SelectItem>
                <SelectItem id="Internship">Magang / Internship</SelectItem>
                <SelectItem id="Remote">Remote (Kerja Jarak Jauh)</SelectItem>
              </Select>
            </div>
            <Input label="Lokasi kerja *" placeholder="Contoh: Jakarta (Hybrid / Remote)" value={formData.location} onChange={(v) => setFormData(p => ({ ...p, location: v }))} />
            <Input label="Rentang gaji *" placeholder="Contoh: Rp 18.000.000 - 25.000.000" value={formData.salary_range} onChange={(v) => setFormData(p => ({ ...p, salary_range: v }))} />
            <div className="flex flex-col gap-1.5">
              <span className="text-body-medium text-text-primary">Bahasa wawancara AI *</span>
              <Select aria-label="Bahasa wawancara AI" selectedKey={formData.language} onSelectionChange={(k) => setFormData(p => ({ ...p, language: String(k) }))}>
                <SelectItem id="English">English</SelectItem>
                <SelectItem id="Indonesian">Bahasa Indonesia</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="job-deadline" className="text-body-medium text-text-primary">Batas waktu ujian</label>
              <input
                id="job-deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={nativeFieldClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-separator-border pt-4">
            <span className="text-body-medium text-text-primary">Arketipe pekerjaan *</span>
            <p className="text-body-regular text-text-secondary">Menentukan format simulasi AI dan jenis bukti yang dinilai. Inti penilaian tetap sama: bukti, bukan klaim.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ARCHETYPES.map((a) => {
                const Icon = a.icon;
                const active = formData.archetype === a.value;
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, archetype: a.value }))}
                    aria-pressed={active}
                    className={cx(
                      'cursor-pointer rounded-2xl border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                      active
                        ? 'border-accent-500 bg-accent-50'
                        : 'border-border-button-default bg-background-primary-default hover:border-border-button-hover'
                    )}
                  >
                    <span className={cx(
                      'mb-2 inline-flex size-9 items-center justify-center rounded-full',
                      active ? 'bg-accent-500 text-white' : 'bg-background-secondary-default text-foreground-icon-secondary'
                    )}>
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="block text-body-medium text-text-primary">{a.label}</span>
                    <span className="mt-1 block text-body-regular leading-relaxed text-text-secondary">{a.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-separator-border pt-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-background-secondary-default p-4">
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-2 text-body-medium text-text-primary">
                  <RiFlashlightLine className="size-4 text-accent-600" aria-hidden />
                  Buat deskripsi otomatis dengan AI
                </span>
                <p className="text-body-regular text-text-secondary">AI akan menyusun deskripsi posisi secara cerdas berdasarkan kriteria yang diisi.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoGenerateDescription}
                aria-label="Auto-generate deskripsi dengan AI"
                onClick={() => setAutoGenerateDescription(v => !v)}
                className={cx(
                  'relative h-6 w-11 shrink-0 cursor-pointer rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                  autoGenerateDescription ? 'bg-accent-500' : 'bg-background-tertiary-default'
                )}
              >
                <span className={cx(
                  'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform',
                  autoGenerateDescription && 'translate-x-5'
                )} />
              </button>
            </div>

            {!autoGenerateDescription && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="job-desc" className="text-body-medium text-text-primary">Deskripsi manual *</label>
                <textarea
                  id="job-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tuliskan penjelasan tanggung jawab dan kualifikasi posisi…"
                  className="w-full rounded-xl border border-border-button-default bg-background-primary-default p-3 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-2xl border border-border-button-default bg-background-secondary-default p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 text-body-medium text-text-primary">
                    <RiShieldCheckLine className="size-4 text-accent-600" aria-hidden /> Pemeriksaan bias
                  </p>
                  <p className="text-body-regular text-text-secondary">Skor bias + saran kalimat inklusif sebelum publikasi.</p>
                </div>
                <Button variant="secondary" size="small" onClick={handleDebiasCheck} disabled={debiasLoading}>
                  {debiasLoading ? 'Memeriksa…' : 'Cek Bias'}
                </Button>
              </div>
              {debiasResult && (
                <div className="flex flex-col gap-2 rounded-xl border border-border-button-default bg-background-primary-default p-3 text-body-regular">
                  <p className="text-body-medium text-text-primary">
                    Skor bias: <span className="tabular-nums text-accent-600">{debiasResult.bias_score}</span>
                    <Chip variant="caption" color="neutral" className="ml-2">{debiasResult.label}</Chip>
                  </p>
                  {debiasResult.issues?.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5 text-text-primary">
                      {debiasResult.issues.map((it: any, i: number) => (
                        <li key={i}><strong>{it.match}</strong> - {it.suggestion}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-status-lime-text">Tidak ada pola bias terdeteksi.</p>
                  )}
                  <ul className="list-disc pl-5 text-text-secondary">
                    {debiasResult.suggestions?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="medium" trailingIcon={RiArrowRightLine} onClick={nextStep}>
              Lanjut Ke Parameter AI
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-between border-b border-separator-border pb-4">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-title-3-semibold text-text-primary">2. Parameter Simulasi dan Evaluator AI</h3>
              <p className="text-body-regular text-text-secondary">Atur intensitas pertanyaan AI, nilai passing score (KKM), dan kriteria penilaian.</p>
            </div>
            <Chip variant="caption" color="neutral">Tahap 2 dari 3</Chip>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border-button-default bg-background-secondary-default p-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="job-maxq" className="flex items-center justify-between text-caption-1-semibold text-text-primary">
                <span>Batas pertanyaan AI</span>
                <span className="tabular-nums text-accent-600">{formData.max_questions} Soal</span>
              </label>
              <input
                id="job-maxq"
                type="range"
                name="max_questions"
                min={1}
                max={15}
                value={formData.max_questions}
                onChange={handleChange}
                className="w-full cursor-pointer accent-accent-500"
              />
              <p className="text-body-regular text-text-secondary">Jumlah maksimum pertanyaan studi kasus interaktif yang diajukan AI kepada kandidat.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="job-kkm" className="flex items-center justify-between text-caption-1-semibold text-text-primary">
                <span>Nilai KKM kelulusan</span>
                <span className="tabular-nums text-accent-600">{formData.kkm_score} / 100</span>
              </label>
              <input
                id="job-kkm"
                type="range"
                name="kkm_score"
                min={0}
                max={100}
                step={5}
                value={formData.kkm_score}
                onChange={handleChange}
                className="w-full cursor-pointer accent-accent-500"
              />
              <p className="text-body-regular text-text-secondary">Kandidat dengan skor di bawah KKM ini akan ditandai perlu pertimbangan ulang.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-caption-1-semibold text-text-primary">Target hasil studi kasus *</span>
                <Button variant="secondary" size="xs" leadingIcon={RiAddFill} onClick={() => handleListAdd(setExpectedOutcomes)}>
                  Tambah Kriteria
                </Button>
              </div>
              {listRow(expectedOutcomes, setExpectedOutcomes, (idx) => `Target ${idx + 1}: Contoh merancang arsitektur microservices`)}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-caption-1-semibold text-text-primary">Keahlian yang dievaluasi *</span>
                <Button variant="secondary" size="xs" leadingIcon={RiAddFill} onClick={() => handleListAdd(setSpecificSkills)}>
                  Tambah Skill
                </Button>
              </div>
              {listRow(specificSkills, setSpecificSkills, (idx) => `Skill ${idx + 1}: Contoh React, Node.js, PostgreSQL`)}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-caption-1-semibold text-text-primary">Kriteria kelulusan *</span>
                <Button variant="secondary" size="xs" leadingIcon={RiAddFill} onClick={() => handleListAdd(setComplianceCriteria)}>
                  Tambah Kriteria
                </Button>
              </div>
              {listRow(complianceCriteria, setComplianceCriteria, (idx) => `Kriteria ${idx + 1}: Contoh kode bersih, bebas bug OWASP`)}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="secondary" size="medium" leadingIcon={RiArrowLeftLine} onClick={prevStep}>
              Kembali
            </Button>
            <Button variant="primary" size="medium" trailingIcon={RiArrowRightLine} onClick={nextStep}>
              Lanjut ke Tinjauan dan Rilis
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-between border-b border-separator-border pb-4">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-title-3-semibold text-text-primary">3. Tinjau Ringkasan dan Rilis Ujian AI</h3>
              <p className="text-body-regular text-text-secondary">Konfirmasi seluruh parameter sebelum merilis simulasi ujian AI secara publik.</p>
            </div>
            <Chip variant="caption" color="neutral">Tahap 3 dari 3</Chip>
          </div>

          <div className="flex flex-col gap-6 rounded-2xl bg-background-secondary-default p-5">
            <div className="grid grid-cols-2 gap-5 border-b border-separator-border pb-5 sm:grid-cols-3">
              {[
                ['Nama Posisi', formData.title],
                ['Tipe Pekerjaan', formData.job_type],
                ['Bahasa AI', formData.language],
                ['Lokasi', formData.location],
                ['Rentang Gaji', formData.salary_range],
                ['Batas Deadline', formData.deadline || 'Tanpa Batas'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-body-regular text-text-secondary">{k}:</span>
                  <span className="text-body-medium text-text-primary">{v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-5 border-b border-separator-border pb-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-body-regular text-text-secondary">Interaction Limit:</span>
                <span className="text-body-medium tabular-nums text-accent-600">{formData.max_questions} Pertanyaan AI</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-regular text-text-secondary">Nilai Minimum KKM:</span>
                <span className="text-body-medium tabular-nums text-accent-600">{formData.kkm_score} / 100</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-caption-1-semibold text-text-secondary">Target Hasil dan Skenario:</span>
                <ul className="list-disc space-y-1 pl-5 text-body-regular text-text-primary">
                  {expectedOutcomes.filter(i => i.trim()).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption-1-semibold text-text-secondary">Keahlian Spesifik:</span>
                <div className="flex flex-wrap gap-1.5">
                  {specificSkills.filter(i => i.trim()).map((skill, i) => (
                    <Chip key={i} variant="caption" color="neutral">{skill}</Chip>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-caption-1-semibold text-text-secondary">Kriteria Kepatuhan:</span>
                <ul className="list-disc space-y-1 pl-5 text-body-regular text-text-primary">
                  {complianceCriteria.filter(i => i.trim()).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {isSubmitting && <ThinkingIndicator statusText="Membuat ujian AI…" />}

          <div className="flex justify-between">
            <Button variant="secondary" size="medium" leadingIcon={RiArrowLeftLine} onClick={prevStep} disabled={isSubmitting}>
              Kembali
            </Button>
            <Button variant="primary" size="medium" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Membuat Ujian…' : 'Rilis Ujian'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
