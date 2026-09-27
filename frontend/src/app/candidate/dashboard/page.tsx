'use client';

import {
  RiArrowRightLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiCodeLine,
  RiDownloadLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiRefreshLine,
  RiTimeLine,
  RiUserLine,
} from '@remixicon/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { cx } from '@/utils/cx';

const STATUS_CHIP: Record<string, 'orange' | 'blue' | 'purple' | 'lime' | 'rose'> = {
  testing: 'orange',
  evaluated: 'blue',
  interview: 'purple',
  hired: 'lime',
  rejected: 'rose',
};

export default function CandidateDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'positions'>('applications');

  const loadDashboard = () => {
    setLoading(true);
    Promise.all([
      api.get('/jobs'),
      api.get('/applications')
    ]).then(([jobsData, appsData]) => {
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, [router]);

  const handleDownloadReport = async (appId: number) => {
    try {
      const [fp, app] = await Promise.all([
        api.get(`/biosphere/fingerprint/${appId}`).catch(() => null),
        api.get(`/applications/${appId}`).catch(() => null),
      ]);
      const blob = new Blob([JSON.stringify({ application_id: appId, fingerprint: fp, application: app, exported_at: new Date().toISOString() }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillens-report-${appId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Report belum tersedia.');
    }
  };

  const handleApply = (jobId: number) => {
    router.push(`/candidate/apply/${jobId}`);
  };

  const myAppIds = applications.map(a => a.job_id);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Greeting panel */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-secondary-default p-6 shadow-card sm:p-8">
        <div>
          <h1 className="text-title-2-medium text-text-primary">
            Pusat Penilaian Kandidat
          </h1>
          <p className="mt-1 text-body-regular text-text-secondary">
            Pantau evaluasi aktif, kirimkan tanggapan simulasi, dan jelajahi posisi terbuka.
          </p>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="flex gap-1 rounded-full border border-border-button-default bg-background-secondary-default p-1.5 lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={cx(
            'flex-1 rounded-full py-2 text-body-medium transition-colors',
            activeTab === 'applications' ? 'bg-accent-500 text-white shadow-xs' : 'text-text-secondary',
          )}
        >
          Lamaran Saya
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('positions')}
          className={cx(
            'flex-1 rounded-full py-2 text-body-medium transition-colors',
            activeTab === 'positions' ? 'bg-accent-500 text-white shadow-xs' : 'text-text-secondary',
          )}
        >
          Posisi Terbuka
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">

        {/* My Applications */}
        <div className={cx('space-y-6', activeTab === 'applications' ? 'block' : 'hidden lg:block')}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-title-3-semibold text-text-primary">Lamaran Saya</h2>
              <p className="mt-0.5 text-caption-1-medium text-text-secondary">Pantau evaluasi aktif dan laporan Anda.</p>
            </div>
            <Button
              variant="secondary"
              size="small"
              leadingIcon={RiRefreshLine}
              onClick={loadDashboard}
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </Button>
          </div>

          {applications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-button-default bg-background-primary-default px-6 py-16 text-center">
              <RiBriefcaseLine className="mb-3 size-10 text-foreground-icon-tertiary" aria-hidden />
              <p className="text-body-medium text-text-secondary">Belum ada lamaran aktif. Pilih posisi di bawah untuk melamar.</p>
            </div>
          )}

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cx(
                      'flex size-12 shrink-0 items-center justify-center rounded-full',
                      app.status === 'testing' ? 'bg-accent-50 text-accent-600' : 'bg-background-tertiary-default text-foreground-icon-secondary',
                    )}>
                      {app.status === 'testing'
                        ? <RiCodeLine className="size-6" aria-hidden />
                        : <RiCheckLine className="size-6" aria-hidden />}
                    </div>
                    <div>
                      <h3 className="mb-1 text-title-3-semibold text-text-primary">{app.job?.title ?? 'Evaluasi AI'}</h3>
                      <div className="flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
                        <RiTimeLine className="size-3.5 text-accent-500" aria-hidden />
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row sm:items-center">
                    {app.status === 'testing' ? (
                      <Link href={`/candidate/test/${app.id}`} className={cx('contents')}>
                        <Button variant="primary" size="small" trailingIcon={RiArrowRightLine}>
                          Mulai Tes AI
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex w-full flex-wrap gap-2 sm:flex-col sm:items-end">
                        {app.status === 'evaluated' && (
                          <Chip variant="bold" color="blue">
                            <span className="inline-flex items-center gap-1.5">
                              <RiTimeLine className="size-3.5" aria-hidden /> Dalam Peninjauan
                            </span>
                          </Chip>
                        )}
                        {app.status === 'interview' && (
                          <Chip variant="bold" color="purple">
                            <span className="inline-flex items-center gap-1.5">
                              <RiUserLine className="size-3.5" aria-hidden /> Wawancara
                            </span>
                          </Chip>
                        )}
                        {app.status === 'hired' && (
                          <Chip variant="bold" color="lime">
                            <span className="inline-flex items-center gap-1.5">
                              <RiCheckLine className="size-3.5" aria-hidden /> Diterima
                            </span>
                          </Chip>
                        )}
                        {app.status === 'rejected' && (
                          <Chip variant="bold" color="rose">
                            <span className="inline-flex items-center gap-1.5">
                              <RiCheckLine className="size-3.5" aria-hidden /> Tidak Terpilih
                            </span>
                          </Chip>
                        )}
                        {app.status !== 'testing' && !['evaluated', 'interview', 'hired', 'rejected'].includes(app.status) && (
                          <Chip variant="bold" color={STATUS_CHIP[app.status] ?? 'neutral'}>{app.status}</Chip>
                        )}
                        {app.status !== 'testing' && (
                          <Button
                            variant="secondary"
                            size="small"
                            leadingIcon={RiDownloadLine}
                            onClick={() => handleDownloadReport(app.id)}
                          >
                            Unduh Report
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className={cx('space-y-6', activeTab === 'positions' ? 'block' : 'hidden lg:block')}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-title-3-semibold text-text-primary">Posisi Terbuka</h2>
              <p className="mt-0.5 text-caption-1-medium text-text-secondary">Peran dengan evaluasi studi kasus interaktif.</p>
            </div>
          </div>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-button-default bg-background-primary-default px-6 py-16 text-center">
              <p className="text-body-medium text-text-secondary">Tidak ada posisi terbuka saat ini.</p>
            </div>
          )}

          <div className="space-y-4">
            {jobs.map((job) => {
              const hasApplied = myAppIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-title-3-semibold text-text-primary">{job.title}</h3>
                    <Chip variant="caption" color="soft">{job.id}</Chip>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-caption-1-medium text-text-secondary">
                        <RiMapPinLine className="size-3.5 text-accent-500" aria-hidden />
                        {job.location}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="inline-flex items-center gap-1 text-caption-1-medium text-text-secondary">
                        <RiMoneyDollarCircleLine className="size-3.5 text-accent-500" aria-hidden />
                        {job.salary_range}
                      </span>
                    )}
                  </div>

                  <p className="mb-4 line-clamp-2 text-body-regular leading-relaxed text-text-secondary">{job.expected_outcomes}</p>

                  <div className="flex items-center justify-between border-t border-separator-border pt-4">
                    <p className="text-caption-1-medium text-text-secondary">
                      <span className="text-body-medium text-text-primary">{job.candidate_count ?? 0}</span> pelamar
                    </p>
                    {hasApplied ? (
                      <Button variant="secondary" size="small" disabled>
                        Sudah Melamar
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="small"
                        trailingIcon={RiArrowRightLine}
                        onClick={() => handleApply(job.id)}
                        disabled={applyingTo === job.id}
                      >
                        {applyingTo === job.id ? 'Memuat...' : 'Lamar'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
