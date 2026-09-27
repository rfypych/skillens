'use client';

import {
  RiArchiveLine,
  RiCheckLine,
  RiFilter3Fill,
  RiRefreshLine,
  RiSearchLine,
  RiShieldCheckLine,
} from '@remixicon/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/base/table/table';

interface AssessmentResult {
  overall_score: number | null;
  ai_cheating_detected: boolean;
  tab_switches: number;
  copy_paste_attempts: number;
  claim_vs_evidence_label: string | null;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  job?: { title: string };
  user?: { full_name: string; email: string } | null;
  assessment_results: AssessmentResult[];
}

const candidateName = (app: Application): string => app.user?.full_name || 'Kandidat Tamu';
const candidateInitials = (app: Application): string =>
  (candidateName(app).split(' ').map(n => n[0]).join('') || 'GT').slice(0, 2).toUpperCase();

function labelChip(label: string | null, isCheat: boolean): { color: 'lime' | 'rose' | 'blue' | 'yellow' | 'neutral'; text: string } {
  if (isCheat) return { color: 'rose', text: 'Terindikasi Kecurangan' };
  if (label === 'Hidden Gem' || label === 'Highly Validated') return { color: 'lime', text: label };
  if (label === 'Solid Match' || label === 'Validated') return { color: 'blue', text: label };
  if (label === 'Mismatch' || label === 'Likely Fabricated' || label === 'Fabricated') return { color: 'rose', text: label };
  return { color: 'yellow', text: label ?? 'Menunggu' };
}

export default function CandidatesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCandidates = () => {
    setLoading(true);
    api.get('/applications')
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filtered = applications.filter(app =>
    candidateName(app).toLowerCase().includes(search.toLowerCase()) ||
    `APP-${app.id}`.toLowerCase().includes(search.toLowerCase()) ||
    (app.job?.title ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = async (id: number) => {
    if (!confirm('Arsipkan kandidat ini?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Gagal mengarsipkan');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1 px-1">
          
          <p className="text-body-medium text-text-secondary">Laporan bukti otentik dan evaluasi perilaku AI kandidat.</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <Input
          aria-label="Cari kandidat"
          placeholder="Cari kandidat…"
          value={search}
          onChange={setSearch}
          leadingIcon={RiSearchLine}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="medium" leadingIcon={RiRefreshLine} onClick={loadCandidates} disabled={loading}>
            {loading ? 'Memuat…' : 'Muat ulang'}
          </Button>
        </div>
      </div>

      <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-card">
        {loading ? (
          <div className="flex flex-col gap-2 p-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-12 animate-pulse rounded-lg bg-background-secondary-default" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-body-medium text-text-tertiary">
            Tidak ada kandidat ditemukan.
          </p>
        ) : (
          <Table aria-label="Daftar kandidat" size="sm" containerClassName="w-full">
            <TableHeader>
              <TableColumn id="name" isRowHeader>Kandidat</TableColumn>
              <TableColumn>Posisi dan Tanggal</TableColumn>
              <TableColumn>Label AI</TableColumn>
              <TableColumn>Skor Bukti</TableColumn>
              <TableColumn>Telemetri Peringatan</TableColumn>
              <TableColumn>Laporan</TableColumn>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => {
                const latest = app.assessment_results?.[app.assessment_results.length - 1];
                const score = latest?.overall_score ?? null;
                const isCheat = latest?.ai_cheating_detected ?? false;
                const tabSwitches = latest?.tab_switches ?? 0;
                const pastes = latest?.copy_paste_attempts ?? 0;
                const chip = labelChip(latest?.claim_vs_evidence_label ?? null, isCheat);
                const telemetryClean = !isCheat && tabSwitches <= 2 && pastes === 0;
                const telemetryText = isCheat
                  ? 'Kode hasil AI ditempel'
                  : tabSwitches > 5 ? `Perpindahan tab tinggi (${tabSwitches}x)` :
                    pastes > 0 ? `${pastes} peristiwa paste terdeteksi` : 'Bersih';
                return (
                  <TableRow key={app.id} href={`/recruiter/candidates/${app.id}`}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Avatar size="sm" color="neutral" initials={candidateInitials(app)} />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body-medium text-text-primary">{candidateName(app)}</span>
                          <span className="text-caption-1-medium tabular-nums text-text-tertiary">APP-{app.id}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-body-medium text-text-primary">{app.job?.title ?? 'N/A'}</span>
                        <span className="text-caption-1-medium tabular-nums text-text-tertiary">
                          {new Date(app.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip variant="bold" color={chip.color}>{chip.text}</Chip>
                    </TableCell>
                    <TableCell>
                      {score !== null ? (
                        <span className="flex items-center gap-2">
                          <span className="text-body-medium tabular-nums text-text-primary">{score.toFixed(0)}</span>
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default">
                            <span
                              className="block h-full rounded-full bg-accent-500"
                              style={{ width: `${Math.min(score, 100)}%` }}
                            />
                          </span>
                        </span>
                      ) : (
                        <span className="text-body-regular text-text-tertiary">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {telemetryClean ? (
                        <span className="inline-flex items-center gap-1 text-body-regular text-text-secondary">
                          <RiCheckLine className="size-4 text-status-lime-text" aria-hidden />
                          Bersih
                        </span>
                      ) : (
                        <span className="inline-flex items-start gap-1 text-body-medium text-status-rose-text">
                          <RiShieldCheckLine className="mt-0.5 size-4 shrink-0" aria-hidden />
                          {telemetryText}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center justify-end gap-1">
                        <IconButton
                          icon={RiArchiveLine}
                          size="small"
                          aria-label={`Arsipkan ${candidateName(app)}`}
                          onClick={() => handleArchive(app.id)}
                        />
                        <Link href={`/recruiter/candidates/${app.id}`} className="text-body-medium text-accent-600 hover:text-accent-700">
                          Laporan
                        </Link>
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t border-separator-border px-4 py-3">
          <p className="text-body-regular text-text-secondary">
            Menampilkan {filtered.length} dari {applications.length} kandidat
          </p>
        </div>
      </section>
    </div>
  );
}
