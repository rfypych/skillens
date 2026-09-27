'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiLockLine,
  RiMapPinLine,
  RiTimeLine,
} from '@remixicon/react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.job_id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const rawId = Array.isArray(jobId) ? jobId[0] : (jobId as string);
    const isMagicToken = typeof rawId === 'string' && rawId.includes('-') && rawId.length >= 20;
    const jobPath = isMagicToken ? `/jobs/by-magic/${rawId}` : `/jobs/${rawId}`;
    Promise.all([
      api.get(jobPath),
      api.get('/applications').catch(() => []),
      api.get('/auth/me').catch(() => null),
    ])
      .then(([jobData, appsData, meData]) => {
        setJob(jobData);
        const numericId = jobData?.id ?? rawId;
        if (Array.isArray(appsData)) {
          setAlreadyApplied(appsData.some((a: any) => String(a.job_id) === String(numericId)));
        }
        if (meData) {
          setUserProfile(meData);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [jobId, router]);


  const handleApply = async () => {
    setApplying(true);
    setError('');
    try {
      const numericId = job?.id ?? jobId;
      const formData = new FormData();
      const app = await api.post(`/assessment/${numericId}/apply`, formData);
      router.push(`/candidate/instructions/${app.id}`);
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan. Coba lagi.');
      setApplying(false);
    }
  };

  const skills: string[] = job?.required_skills
    ? typeof job.required_skills === 'string'
      ? job.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : job.required_skills
    : [];

  const outcomeLines: string[] = job?.expected_outcomes
    ? job.expected_outcomes.split('\n').filter((l: string) => l.trim())
    : [];

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background-full font-boardui">
        <ThinkingIndicator />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background-full font-boardui">
        <div className="text-center">
          <p className="mb-4 text-body-medium text-text-tertiary">Posisi tidak ditemukan.</p>
          <Link href="/candidate/dashboard" className="text-body-medium text-accent-600 hover:text-accent-700">
            Kembali ke daftar posisi
          </Link>
        </div>
      </div>
    );
  }

  const ctaLabel = applying ? 'Memproses…' : alreadyApplied ? 'Sudah Melamar' : 'Mulai Asesmen';

  return (
    <div className="min-h-dvh bg-background-full text-text-primary font-boardui">
      <header className="sticky top-0 z-40 border-b border-separator-border bg-background-primary-default">
        <div className="mx-auto flex h-12 max-w-5xl items-center gap-3 px-6">
          <Link
            href="/candidate/dashboard"
            className="inline-flex items-center gap-1.5 text-body-regular text-text-tertiary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiArrowLeftLine className="size-4" aria-hidden />
            Kembali ke daftar posisi
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">

          <div className="flex flex-col gap-8">
            <div>
              <Avatar size="lg" color="blue" initials={(job.title || 'S').slice(0, 1).toUpperCase()} className="mb-4" />
              <h1 className="mb-1 text-title-1-medium text-text-primary">
                {job.title}
              </h1>
              <p className="mb-4 text-body-regular text-text-secondary">Skillens Platform</p>

              <div className="mb-6 flex flex-wrap gap-2">
                {job.location && (
                  <Chip variant="subtle" color="neutral">
                    <span className="inline-flex items-center gap-1.5">
                      <RiMapPinLine className="size-3.5" aria-hidden />{job.location}
                    </span>
                  </Chip>
                )}
                {job.job_type && (
                  <Chip variant="subtle" color="neutral">
                    <span className="inline-flex items-center gap-1.5">
                      <RiBriefcaseLine className="size-3.5" aria-hidden />{job.job_type}
                    </span>
                  </Chip>
                )}
                {job.salary_range && (
                  <Chip variant="subtle" color="neutral">{job.salary_range}</Chip>
                )}
              </div>

              <div className="flex items-center gap-3 border-b border-separator-border pb-6 lg:hidden">
                <Button
                  variant="primary"
                  size="medium"
                  trailingIcon={alreadyApplied || applying ? undefined : RiArrowRightLine}
                  leadingIcon={alreadyApplied ? RiCheckLine : undefined}
                  onClick={!alreadyApplied ? handleApply : undefined}
                  disabled={applying || alreadyApplied}
                >
                  {ctaLabel}
                </Button>
              </div>

              {error && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-body-regular text-text-error-primary">
                  <RiErrorWarningLine className="size-4" aria-hidden />{error}
                </p>
              )}
            </div>

            {outcomeLines.length > 0 && (
              <div>
                <h2 className="mb-4 text-caption-1-semibold text-text-tertiary">
                  Tentang peran ini
                </h2>
                <div className="space-y-2 border-l-2 border-separator-border pl-4 text-body-regular leading-relaxed text-text-secondary">
                  {outcomeLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-4 text-caption-1-semibold text-text-tertiary">
                Yang dinilai dari Anda
              </h2>
              <ul className="space-y-3">
                {[
                  'Memahami dan mengurai masalah',
                  'Pendekatan solusi dan kualitas penalaran',
                  'Logika dan kejelasan eksekusi',
                  'Kualitas komunikasi tertulis',
                  'Kedalaman jawaban dan relevansi dengan peran',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-regular text-text-secondary">
                    <RiCheckLine className="mt-0.5 size-4 shrink-0 text-text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {skills.length > 0 && (
              <div>
                <h2 className="mb-4 text-caption-1-semibold text-text-tertiary">
                  Keahlian yang dibutuhkan
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <Chip key={i} variant="subtle" color="neutral">{skill}</Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-separator-border pt-8">
              <h2 className="mb-4 text-caption-1-semibold text-text-tertiary">
                Tentang Skillens
              </h2>
              <p className="text-body-regular leading-relaxed text-text-secondary">
                Skillens adalah platform rekrutmen berbasis bukti yang menggantikan
                skrining resume dengan micro-simulasi terpantau AI. Setiap kandidat dinilai
                dari kinerja nyata, bukan klaim pribadi.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card">

              {userProfile?.profile?.resume_url ? (
                <div className="flex items-center justify-between rounded-2xl bg-status-lime-background p-3.5">
                  <span className="inline-flex min-w-0 items-center gap-2.5 text-body-regular text-status-lime-text">
                    <RiCheckLine className="size-4 shrink-0" aria-hidden />
                    <span className="flex min-w-0 flex-col text-left">
                      <span className="text-body-medium">CV Otomatis Terpasang</span>
                      <span className="max-w-[140px] truncate text-body-regular">
                        {userProfile.profile.resume_url.split('/').pop()}
                      </span>
                    </span>
                  </span>
                  <Link href="/candidate/profile" className="shrink-0 text-body-regular text-text-secondary hover:text-text-primary">
                    Ubah di Pengaturan
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-status-yellow-background p-3.5">
                  <span className="inline-flex items-center gap-2.5 text-body-regular text-status-yellow-text">
                    <RiErrorWarningLine className="size-4 shrink-0" aria-hidden />
                    <span>Belum ada CV di profil</span>
                  </span>
                  <Link href="/candidate/profile" className="shrink-0 text-body-regular text-accent-600 hover:text-accent-700">
                    Upload di Pengaturan
                  </Link>
                </div>
              )}

              <Button
                variant="primary"
                size="medium"
                trailingIcon={alreadyApplied || applying ? undefined : RiArrowRightLine}
                leadingIcon={alreadyApplied ? RiCheckLine : undefined}
                onClick={!alreadyApplied ? handleApply : undefined}
                disabled={applying || alreadyApplied}
                className="w-full"
              >
                {applying ? (
                  <span className="inline-flex items-center gap-2">
                    <ThinkingIndicator />
                    Starting…
                  </span>
                ) : ctaLabel}
              </Button>

              {error && (
                <p className="inline-flex items-center gap-1.5 text-body-regular text-text-error-primary">
                  <RiErrorWarningLine className="size-4" aria-hidden />{error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-separator-border pt-5 text-body-regular text-text-secondary">
                <span className="inline-flex items-center gap-3">
                  <RiTimeLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  Sekitar 15 menit
                </span>
                <span className="inline-flex items-center gap-3">
                  <RiLockLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  Sesi terpantau AI
                </span>
                <span className="inline-flex items-center gap-3">
                  <RiFileTextLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  Tanpa perlu resume
                </span>
              </div>

              <div className="border-t border-separator-border pt-5">
                <p className="mb-4 text-caption-1-semibold text-text-primary">
                  Langkah berikutnya
                </p>
                <ol className="space-y-3">
                  {[
                    'Anda memulai asesmen AI 15 menit',
                    'AI kami menganalisis jawaban Anda',
                    'Rekruiter meninjau skor bukti Anda',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border-button-default text-caption-1-semibold text-text-tertiary">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-body-regular leading-snug text-text-secondary">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-separator-border pt-5">
                <p className="text-body-regular leading-relaxed text-text-tertiary">
                  Jawaban Anda bersifat rahasia dan hanya terlihat oleh tim rekrutmen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
