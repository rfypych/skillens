'use client';

import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiFileTextLine,
  RiMapPinLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiTimeLine,
  RiUploadCloud2Line,
  RiErrorWarningLine,
} from '@remixicon/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { cx } from '@/utils/cx';
import Link from 'next/link';

export default function ApplyForJob() {
  const router = useRouter();
  const params = useParams();
  const job_id = params.job_id;

  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');

  const storedResumeUrl = user?.profile?.resume_url || null;
  const storedResumeFileName = storedResumeUrl ? storedResumeUrl.split('/').pop() : null;
  const hasValidCV = !!file || !!storedResumeUrl;
  const [resolvedJobId, setResolvedJobId] = useState<string | number | null>(null);

  const isMagicToken = (v: unknown) =>
    typeof v === 'string' && v.includes('-') && v.length >= 20;

  useEffect(() => {
    const init = async () => {
      try {
        const rawId = Array.isArray(job_id) ? job_id[0] : (job_id as string);
        const jobPath = isMagicToken(rawId) ? `/jobs/by-magic/${rawId}` : `/jobs/${rawId}`;
        const jobPromise = api.get(jobPath, { requireAuth: false });

        const token = localStorage.getItem('token');
        const userPromise = token
          ? api.get('/auth/me', { requireAuth: false }).catch(() => null)
          : Promise.resolve(null);

        const [jobData, userData] = await Promise.all([jobPromise, userPromise]);

        setJob(jobData);
        setResolvedJobId(jobData?.id ?? (Array.isArray(job_id) ? job_id[0] : job_id));

        if (userData) {
          setUser(userData);
          setFormData({ name: userData.full_name || '', email: userData.email || '' });
        }
      } catch (err) {
        setError('Gagal memuat detail pekerjaan. Tautan ini mungkin tidak valid.');
      }

      setInitLoading(false);
    };
    init();
  }, [job_id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataPayload = new FormData();
      if (formData.name) dataPayload.append('name', formData.name);
      if (formData.email) dataPayload.append('email', formData.email);

      if (file) {
        dataPayload.append('file', file);
      } else if (!storedResumeUrl) {
        throw new Error("Harap unggah resume PDF yang valid untuk melanjutkan.");
      }

      const data = await api.post(`/assessment/${resolvedJobId ?? job_id}/apply`, dataPayload, { requireAuth: false });
      router.push(`/candidate/instructions/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirimkan lamaran.');
    } finally {
      setLoading(false);
    }
  };

  const MAX_CV_BYTES = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) {
      setFile(null);
      return;
    }
    const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setFile(null);
      e.target.value = '';
      setError('Hanya file PDF yang didukung. Unggah resume dalam format .pdf.');
      return;
    }
    if (selected.size > MAX_CV_BYTES) {
      setFile(null);
      e.target.value = '';
      setError('File terlalu besar. Maksimum ukuran berkas 5MB.');
      return;
    }
    setError('');
    setFile(selected);
  };

  if (initLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background-full font-boardui">
        <ThinkingIndicator statusText="Memuat Detail Posisi…" />
      </div>
    );
  }

  let cleanDescription = job?.description || "Anda diundang untuk mengikuti evaluasi teknis.";
  cleanDescription = cleanDescription.replace(/Job Title:.*?\nJob Description:\s*/, '');

  return (
    <div className="min-h-dvh bg-background-full text-text-primary font-boardui">
      <nav className="flex h-16 items-center border-b border-separator-border bg-background-primary-default px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <IconButton icon={RiArrowLeftLine} size="medium" aria-label="Kembali" onClick={() => router.back()} />
            <Link href="/" className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              <Avatar size="md" color="blue" initials="SK" />
              <span className="text-body-1-medium text-text-primary">Skillens</span>
              <span className="border-l border-separator-border pl-3 text-caption-1-medium text-text-tertiary">Portal Evaluasi</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-start gap-4 lg:flex-row">

          <section className="w-full flex-1 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card md:p-8">
            <div className="mb-6">
              <p className="mb-3 inline-flex items-center gap-1.5 text-caption-1-medium text-accent-600">
                <RiBriefcaseLine className="size-4" aria-hidden />
                <span>{job?.company_name || "Perusahaan Target"}</span>
              </p>
              <h1 className="mb-5 text-title-1-medium text-text-primary">
                {job?.title || "Evaluasi Peran"}
              </h1>
              <div className="flex flex-wrap gap-2 border-b border-separator-border pb-5 text-body-regular text-text-secondary">
                <Chip variant="subtle" color="neutral">
                  <span className="inline-flex items-center gap-1.5">
                    <RiMapPinLine className="size-4 text-accent-600" aria-hidden />{job?.location || "Remote"}
                  </span>
                </Chip>
                <Chip variant="subtle" color="neutral">
                  <span className="inline-flex items-center gap-1.5">
                    <RiTimeLine className="size-4 text-accent-600" aria-hidden />Evaluasi Terbatas Waktu
                  </span>
                </Chip>
                <Chip variant="subtle" color="neutral">
                  <span className="inline-flex items-center gap-1.5">
                    <RiShieldCheckLine className="size-4 text-accent-600" aria-hidden />Telemetri AI aktif
                  </span>
                </Chip>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="inline-flex items-center gap-2 text-body-1-medium text-text-primary">
                <RiFileTextLine className="size-5 text-accent-600" aria-hidden />
                Deskripsi Peran dan Panduan
              </h3>
              <div className="rounded-2xl border border-separator-border bg-background-secondary-default p-5 text-body-regular leading-relaxed whitespace-pre-line text-text-primary">
                {cleanDescription}
              </div>
            </div>
          </section>

          <section className="w-full shrink-0 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card md:p-7 lg:sticky lg:top-24 lg:w-[420px]">
            <h2 className="text-title-2-medium text-text-primary">
              {user ? 'Siap untuk Mulai?' : 'Lengkapi Data'}
            </h2>
            <p className="mt-1 mb-5 text-body-regular text-text-secondary">
              {user
                ? 'Tinjau data Anda lalu mulai tes evaluasi.'
                : 'Unggah resume PDF untuk memulai tes simulasi AI.'}
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleApply}>
              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-status-rose-background bg-status-rose-background p-4 text-body-medium text-status-rose-text">
                  <RiErrorWarningLine className="mt-0.5 size-5 shrink-0" aria-hidden />
                  <p>{error}</p>
                </div>
              )}

              {user ? (
                <div className="flex items-center justify-between rounded-2xl bg-background-secondary-default p-4">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-caption-1-medium text-text-tertiary">Melamar sebagai</p>
                    <p className="truncate text-body-medium text-text-primary">{user.full_name}</p>
                    <p className="truncate text-body-regular tabular-nums text-text-secondary">{user.email}</p>
                  </div>
                  <Avatar size="md" color="neutral" initials={(user.full_name || 'CA').slice(0, 2).toUpperCase()} />
                </div>
              ) : (
                <>
                  <Input
                    label="Nama Lengkap"
                    placeholder="Alex Thompson"
                    value={formData.name}
                    onChange={(v) => setFormData(p => ({ ...p, name: v }))}
                    isRequired
                  />
                  <Input
                    label="Email Address"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(v) => setFormData(p => ({ ...p, email: v }))}
                    isRequired
                  />
                </>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-body-medium text-text-primary">
                  {storedResumeUrl ? 'CV / Resume' : 'Unggah Resume (PDF) *'}
                </span>

                {storedResumeUrl && !file && (
                  <div className="flex items-center justify-between rounded-2xl bg-status-lime-background p-3">
                    <span className="inline-flex min-w-0 items-center gap-2 text-body-regular text-status-lime-text">
                      <RiCheckLine className="size-4 shrink-0" aria-hidden />
                      <span className="truncate">{storedResumeFileName || 'CV Tersimpan'}</span>
                    </span>
                    <Chip variant="caption" color="lime">Otomatis</Chip>
                  </div>
                )}

                <div className="group relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    required={!storedResumeUrl}
                    onChange={handleFileChange}
                    aria-label="Unggah resume PDF"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className={cx(
                    'flex items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-4 transition-colors',
                    file ? 'border-accent-500 bg-accent-50' : 'border-border-button-default group-hover:border-border-button-hover group-hover:bg-background-secondary-default'
                  )}>
                    <span className={cx(
                      'flex shrink-0 items-center justify-center rounded-full p-2',
                      file ? 'bg-accent-500 text-white' : 'bg-background-secondary-default text-foreground-icon-secondary'
                    )}>
                      <RiUploadCloud2Line className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cx('truncate text-body-medium', file ? 'text-accent-600' : 'text-text-primary')}>
                        {file ? file.name : storedResumeUrl ? 'Unggah CV Baru (Opsional)' : 'Klik atau seret PDF ke sini'}
                      </p>
                      {!file && <p className="mt-0.5 text-body-regular text-text-tertiary">{storedResumeUrl ? 'Ganti CV yang tersimpan' : 'Maksimum ukuran berkas 5MB'}</p>}
                    </div>
                  </div>
                </div>

                {storedResumeUrl && (
                  <p className="inline-flex items-center gap-1 text-body-regular text-text-tertiary">
                    <RiSettings3Line className="size-3" aria-hidden />
                    Ubah CV permanen melalui{' '}
                    <Link href="/candidate/profile" className="text-accent-600 hover:text-accent-700">
                      Pengaturan Profil
                    </Link>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="medium"
                  trailingIcon={RiArrowRightLine}
                  type="submit"
                  disabled={loading || !job || !hasValidCV}
                  className="w-full"
                >
                  {loading ? 'Memproses…' : 'Lanjut Ke Petunjuk Ujian'}
                </Button>
              </div>
            </form>
          </section>
        </div>

        <div className="mt-12">
          <SponsorLogos />
        </div>
      </main>
    </div>
  );
}
