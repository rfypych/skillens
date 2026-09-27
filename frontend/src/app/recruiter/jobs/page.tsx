'use client';

import {
  RiAddFill,
  RiArrowRightLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiMore2Fill,
  RiSparklingLine,
  RiTimeLine,
  RiUserLine,
} from '@remixicon/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { cx } from '@/utils/cx';
import type { Job } from '@/types/api';

export default function ActiveRolesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  const loadJobs = () => {
    setLoading(true);
    api.get('/jobs/my-jobs')
      .then(data => {
        if (Array.isArray(data)) setJobs(data.filter((j: Job) => j.status === 'open'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const loadDemo = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    try {
      const res = await api.post('/seed/demo');
      const count = Array.isArray(res?.candidates) ? res.candidates.length : 0;
      toast.success(`Data demo dimuat: ${res?.job_title ?? 'posisi demo'} + ${count} kandidat ternilai.`);
      setTimeout(() => {
        setDemoLoading(false);
        loadJobs();
        if (res?.job_id) router.push(`/recruiter/jobs/${res.job_id}`);
      }, 1200);
    } catch (err: unknown) {
      setDemoLoading(false);
      toast.error(err instanceof Error ? err.message : 'Gagal memuat data demo.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === 'function') {
        if (!target.closest('.action-menu-trigger')) {
          setOpenMenuId(null);
        }
      } else {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleArchive = async (jobId: number) => {
    if (!confirm('Apakah Anda yakin ingin menutup dan mengarsipkan posisi ini? Kandidat tidak akan dapat melihat posisi ini lagi.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success('Posisi berhasil ditutup dan diarsipkan.');
    } catch {
      toast.error('Terjadi kesalahan.');
    }
  };

  const copyMagicLink = (job: Job) => {
    const url = `${window.location.origin}/candidate/apply/${job.magic_link_token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(job.id);
    toast.success('Tautan evaluasi berhasil disalin');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (deadline: string | null | undefined) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Toaster position="top-right" />

      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1 px-1">
          
          <p className="text-body-medium text-text-secondary">Kelola posisi terbuka dan atur evaluasi simulasi AI kandidat.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="medium" leadingIcon={RiSparklingLine} onClick={loadDemo} disabled={demoLoading}>
            {demoLoading ? 'Memuat Data Demo…' : 'Muat Data Demo'}
          </Button>
        </div>
      </div>

      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border-button-default bg-background-primary-default px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-background-secondary-default">
            <RiBriefcaseLine className="size-6 text-foreground-icon-secondary" aria-hidden />
          </span>
          <h3 className="text-title-3-semibold text-text-primary">Belum Ada Posisi Aktif</h3>
          <p className="max-w-sm text-body-medium text-text-secondary">Buat posisi pertama Anda untuk mulai mengevaluasi kandidat dengan penilaian berbasis AI.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
            <Button variant="secondary" size="medium" leadingIcon={RiSparklingLine} onClick={loadDemo} disabled={demoLoading}>
              {demoLoading ? 'Memuat Data Demo…' : 'Muat Data Demo'}
            </Button>
            <Link href="/recruiter/jobs/new">
              <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
                Buat Posisi Baru
              </Button>
            </Link>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 animate-pulse rounded-3xl bg-background-secondary-default" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <section
            key={job.id}
            className="flex h-full flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card"
          >
            <div className="flex items-start justify-between">
              <Chip variant="bold" color={isExpired(job.deadline) ? 'rose' : 'lime'}>
                {isExpired(job.deadline) ? 'Kadaluarsa' : 'Aktif'}
              </Chip>
              <div className="relative action-menu-trigger" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                  aria-label="Menu opsi posisi"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-primary-hover hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiMore2Fill className="size-5" aria-hidden />
                </button>
                {openMenuId === job.id && (
                  <div className="absolute right-0 z-50 mt-1 w-48 rounded-2xl border border-border-button-default bg-background-primary-default p-1.5 shadow-dropdown">
                    <Link
                      href={`/recruiter/jobs/${job.id}`}
                      onClick={() => setOpenMenuId(null)}
                      className="flex w-full items-center gap-2 rounded-xl p-2 text-body-medium text-text-primary outline-none transition-colors hover:bg-background-primary-hover"
                    >
                      <RiBriefcaseLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                      Buka / Edit Posisi
                    </Link>
                    <button
                      type="button"
                      onClick={() => { handleArchive(job.id); setOpenMenuId(null); }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl p-2 text-body-medium text-text-error-primary outline-none transition-colors hover:bg-background-primary-hover"
                    >
                      <RiCloseLine className="size-5 shrink-0" aria-hidden />
                      Tutup Posisi
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Link href={`/recruiter/jobs/${job.id}`} className="text-title-3-semibold text-text-primary outline-none transition-colors hover:text-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                {job.title}
              </Link>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-body-regular text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <RiBriefcaseLine className="size-4" aria-hidden />{job.department || 'Teknik dan Produk'}
                </span>
                {job.location && <span>{job.location}</span>}
                {job.salary_range && <span className="text-body-medium text-text-primary">{job.salary_range}</span>}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 rounded-2xl bg-background-secondary-default p-3">
                <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
                  <RiUserLine className="size-4" aria-hidden />Kandidat
                </span>
                <span className="text-title-1-medium tabular-nums text-text-primary">{job.candidate_count ?? 0}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl bg-background-secondary-default p-3">
                <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
                  <RiTimeLine className="size-4" aria-hidden />Dibuat
                </span>
                <span className="text-body-medium text-text-primary">
                  {new Date(job.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-separator-border pt-3">
              <Button
                variant="secondary"
                size="small"
                leadingIcon={copiedId === job.id ? RiCheckLine : RiFileCopyLine}
                onClick={() => copyMagicLink(job)}
                disabled={isExpired(job.deadline)}
                className="flex-1"
              >
                {copiedId === job.id ? 'Tersalin' : 'Salin Tautan'}
              </Button>
              <Link href={`/recruiter/jobs/${job.id}`} className={cx('flex-1')}>
                <Button variant="primary" size="small" trailingIcon={RiArrowRightLine} className="w-full">
                  Buka Posisi
                </Button>
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
