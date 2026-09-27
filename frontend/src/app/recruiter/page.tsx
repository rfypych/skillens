'use client';

import {
  RiAddFill,
  RiGroupLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiSparklingLine,
} from '@remixicon/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { StatCards, type Stat } from '@/components/application/dashboard/stat-cards';
import { Avatar } from '@/components/base/avatar/avatar';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
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
  created_at: string;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  job?: { title: string };
  user: { full_name: string; email: string };
  assessment_results: AssessmentResult[];
}

function labelChip(label: string | null, isCheat: boolean): { color: 'lime' | 'rose' | 'blue' | 'yellow' | 'neutral'; text: string } {
  if (isCheat) return { color: 'rose', text: 'Terindikasi Kecurangan' };
  if (label === 'Hidden Gem' || label === 'Highly Validated') return { color: 'lime', text: label };
  if (label === 'Solid Match' || label === 'Validated') return { color: 'blue', text: label };
  if (label === 'Mismatch' || label === 'Likely Fabricated' || label === 'Fabricated') return { color: 'rose', text: label };
  if (!label) return { color: 'neutral', text: 'Menunggu' };
  return { color: 'yellow', text: label };
}

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  const loadApplications = () => {
    setLoading(true);
    api.get('/applications')
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadApplications(); }, []);

  const loadDemo = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    try {
      const res = await api.post('/seed/demo');
      const count = Array.isArray(res?.candidates) ? res.candidates.length : 0;
      toast.success(`Data demo dimuat: ${res?.job_title ?? 'posisi demo'} + ${count} kandidat ternilai.`);
      setTimeout(() => {
        setDemoLoading(false);
        loadApplications();
        if (res?.job_id) router.push(`/recruiter/jobs/${res.job_id}`);
      }, 1200);
    } catch (err: any) {
      setDemoLoading(false);
      toast.error(err?.message || 'Gagal memuat data demo.');
    }
  };

  const metrics = useMemo(() => {
    const evaluated = applications.filter(a => ['evaluated', 'hired', 'interview'].includes(a.status));
    let gems = 0;
    let fraud = 0;
    let sum = 0;
    let n = 0;
    applications.forEach(a => {
      const latest = a.assessment_results?.[a.assessment_results.length - 1];
      if (!latest) return;
      if (latest.claim_vs_evidence_label === 'Hidden Gem') gems++;
      if (latest.ai_cheating_detected) fraud++;
      if (!latest.ai_cheating_detected && typeof latest.overall_score === 'number') {
        sum += latest.overall_score;
        n++;
      }
    });
    return {
      total: evaluated.length,
      gems,
      fraud,
      avg: n > 0 ? Math.round(sum / n) : 0,
    };
  }, [applications]);

  const stats: Stat[] = [
    { icon: RiGroupLine, label: 'Total Evaluasi', value: loading ? '…' : String(metrics.total), delta: `${applications.length} lamaran`, deltaColor: 'neutral' },
    { icon: RiLineChartLine, label: 'Rata-rata Skor Bukti', value: loading ? '…' : String(metrics.avg), delta: 'skala 100', deltaColor: 'neutral' },
    { icon: RiShieldCheckLine, label: 'Kecurangan Dicegah', value: loading ? '…' : String(metrics.fraud), delta: metrics.fraud > 0 ? 'perlu tinjau' : 'bersih', deltaColor: metrics.fraud > 0 ? 'rose' : 'lime' },
    { icon: RiSparklingLine, label: 'Hidden Gems', value: loading ? '…' : String(metrics.gems), delta: 'kandidat unggul', deltaColor: metrics.gems > 0 ? 'lime' : 'neutral' },
  ];

  const recent = applications.slice(0, 6);
  const pipeline = useMemo(() => {
    const count = (s: string) => applications.filter(a => a.status === s).length;
    const stages = [
      { name: 'Lamaran masuk', value: applications.length },
      { name: 'Tes selesai', value: count('evaluated') + count('interview') + count('hired') },
      { name: 'Wawancara', value: count('interview') + count('hired') },
      { name: 'Diterima', value: count('hired') },
    ];
    const max = Math.max(...stages.map(s => s.value), 1);
    return stages.map(s => ({ ...s, share: Math.round((s.value / max) * 100) }));
  }, [applications]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Toaster position="top-right" />

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-wrap items-end justify-between gap-2">
          <h2 className="px-1 text-title-1-medium text-text-primary">
            Evaluasi kandidat berbasis bukti
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="secondary" size="medium" onClick={loadDemo} disabled={demoLoading}>
              {demoLoading ? 'Memuat Data Demo…' : 'Muat Data Demo'}
            </Button>
          </div>
        </div>
        <p className="px-1 text-body-medium text-text-secondary">
          Eliminasi klaim palsu resume dengan simulasi studi kasus interaktif dan analisis perilaku otomatis.
        </p>
      </div>

      <StatCards variant="plain" stats={stats} />

      <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-card">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-separator-border px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-body-1-medium text-text-primary">Evaluasi Terbaru</h3>
            <p className="text-body-regular text-text-secondary">Hasil simulasi tes AI kandidat terbaru</p>
          </div>
          <Link href="/recruiter/candidates">
            <Button variant="secondary" size="small">Lihat Semua</Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2 p-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-12 animate-pulse rounded-lg bg-background-secondary-default" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="px-4 py-10 text-center text-body-medium text-text-tertiary">
            Belum ada evaluasi. Hasil tes kandidat akan muncul di sini.
          </p>
        ) : (
          <Table aria-label="Evaluasi terbaru" size="sm" containerClassName="w-full">
            <TableHeader>
              <TableColumn id="name" isRowHeader>Kandidat</TableColumn>
              <TableColumn>Posisi</TableColumn>
              <TableColumn>Skor Bukti</TableColumn>
              <TableColumn>Label AI</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {recent.map(app => {
                const result = app.assessment_results?.[app.assessment_results.length - 1];
                const initials = app.user?.full_name
                  ? app.user.full_name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
                  : 'KD';
                const chip = labelChip(result?.claim_vs_evidence_label ?? null, !!result?.ai_cheating_detected);
                return (
                  <TableRow key={app.id} href={`/recruiter/candidates/${app.id}`}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Avatar size="sm" color="neutral" initials={initials} />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body-medium text-text-primary">{app.user?.full_name || 'Kandidat'}</span>
                          <span className="text-caption-1-medium tabular-nums text-text-tertiary">APP-{app.id}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-medium text-text-primary">{app.job?.title || 'Peran Umum'}</span>
                    </TableCell>
                    <TableCell>
                      {typeof result?.overall_score === 'number' ? (
                        <span className="flex items-center gap-2">
                          <span className="text-body-medium tabular-nums text-text-primary">{result.overall_score}</span>
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default">
                            <span className="block h-full rounded-full bg-accent-500" style={{ width: `${Math.min(result.overall_score, 100)}%` }} />
                          </span>
                        </span>
                      ) : (
                        <span className="text-body-regular text-text-tertiary">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip variant="bold" color={chip.color}>{chip.text}</Chip>
                    </TableCell>
                    <TableCell>
                      <Link href={`/recruiter/candidates/${app.id}`} className="text-body-medium text-accent-600 hover:text-accent-700">
                        Detail
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
          <h3 className="text-body-1-medium text-text-primary">Alur Seleksi</h3>
          <div className="flex flex-col gap-2.5">
            {pipeline.map(stage => (
              <div key={stage.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-body-medium">
                  <span className="text-text-primary">{stage.name}</span>
                  <span className="tabular-nums text-text-secondary">{stage.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary-default">
                  <div className="h-full rounded-full bg-accent-500 transition-[width] duration-500" style={{ width: `${stage.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col justify-between gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-body-1-medium text-text-primary">Integritas Seleksi</h3>
            <p className="text-body-regular text-text-secondary">
              {metrics.fraud} kandidat terindikasi kecurangan ditahan otomatis sebelum wawancara. Hemat sekitar {metrics.fraud * 1.5} jam sesi teknis.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-2lg bg-background-inner-default px-2.5 py-1.5 shadow-card">
            <span className="text-body-regular text-text-secondary">Dari bulan lalu</span>
            <Chip variant="bold" color={metrics.fraud > 0 ? 'rose' : 'lime'}>
              {metrics.fraud > 0 ? `${metrics.fraud} ditahan` : 'Bersih'}
            </Chip>
          </div>
        </section>
      </div>
    </div>
  );
}
