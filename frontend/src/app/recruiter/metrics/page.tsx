'use client';

import {
  RiCalendarLine,
  RiFocus3Line,
  RiGroupLine,
  RiLineChartLine,
  RiPulseLine,
  RiSendPlaneLine,
  RiShieldCheckLine,
  RiSparklingLine,
} from '@remixicon/react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { StatCards } from '@/components/application/dashboard/stat-cards';

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(true);
  type Delta = { text: string; color: 'lime' | 'rose' | 'neutral' };
  const [metrics, setMetrics] = useState({
    totalProcessed: 0,
    fraudCount: 0,
    hiddenGems: 0,
    hiredCount: 0,
    averageScore: 0,
    deltas: {
      total: { text: '—', color: 'neutral' } as Delta,
      fraud: { text: '—', color: 'neutral' } as Delta,
      gems: { text: '—', color: 'neutral' } as Delta,
      hired: { text: '—', color: 'neutral' } as Delta,
      avg: { text: '—', color: 'neutral' } as Delta,
    },
    labels: {
      'Sangat Valid': 0,
      'Cocok Solid': 0,
      'Ketidakcocokan': 0,
      'Terindikasi Palsu': 0,
      'Menunggu': 0,
    },
    trendData: [] as { dateStr: string, label: string, count: number }[]
  });

  useEffect(() => {
    api.get('/applications')
      .then((data: any[]) => {
        let total = 0;
        let fraud = 0;
        let gems = 0;
        let hired = 0;
        let scoreSum = 0;
        let labels = {
          'Sangat Valid': 0,
          'Cocok Solid': 0,
          'Ketidakcocokan': 0,
          'Terindikasi Palsu': 0,
          'Menunggu': 0,
        };

        const toLocalDateKey = (d: Date) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        };

        const trendMap = new Map();
        const trendArray: { dateStr: string, label: string, count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = toLocalDateKey(d);
          const label = d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
          trendMap.set(dateStr, { dateStr, label, count: 0 });
          trendArray.push(trendMap.get(dateStr));
        }

        let scoredCount = 0;
        if (Array.isArray(data)) {
          data.forEach(app => {
            const results = app.assessment_results || [];
            if (results.length > 0) {
              const latest = results[results.length - 1];
              total++;

              const isCheat = latest.ai_cheating_detected;
              const label = latest.claim_vs_evidence_label;
              const score = latest.overall_score || 0;

              if (isCheat) fraud++;
              if (label === 'Hidden Gem') gems++;
              if (app.status === 'hired') hired++;
              if (!isCheat && score > 0) {
                scoreSum += score;
                scoredCount++;
              }

              const displayLabel = isCheat ? 'Terindikasi Palsu' : (label === 'Highly Validated' ? 'Sangat Valid' : label === 'Solid Match' || label === 'Validated' ? 'Cocok Solid' : 'Menunggu');
              if (labels[displayLabel as keyof typeof labels] !== undefined) {
                labels[displayLabel as keyof typeof labels]++;
              } else if (label === 'Hidden Gem') {
                labels['Sangat Valid']++;
              } else {
                labels['Menunggu']++;
              }
            }

            if (app.created_at) {
              const appDateStr = toLocalDateKey(new Date(app.created_at));
              if (trendMap.has(appDateStr)) {
                trendMap.get(appDateStr).count++;
              }
            }
          });
        }

        const now = Date.now();
        const inWeek = (iso: string, back: number) => {
          const t = new Date(iso).getTime();
          return t >= now - back * 86400000 && t < now - (back - 7) * 86400000;
        };
        const week = { total: 0, fraud: 0, gems: 0, hired: 0, sum: 0, n: 0 };
        const prev = { total: 0, fraud: 0, gems: 0, hired: 0, sum: 0, n: 0 };
        if (Array.isArray(data)) {
          data.forEach(app => {
            const latest = (app.assessment_results || [])[(app.assessment_results || []).length - 1];
            if (!latest || !app.created_at) return;
            const bucket = inWeek(app.created_at, 7) ? week : inWeek(app.created_at, 14) ? prev : null;
            if (!bucket) return;
            bucket.total++;
            if (latest.ai_cheating_detected) bucket.fraud++;
            if (latest.claim_vs_evidence_label === 'Hidden Gem') bucket.gems++;
            if (app.status === 'hired') bucket.hired++;
            if (!latest.ai_cheating_detected && (latest.overall_score || 0) > 0) {
              bucket.sum += latest.overall_score;
              bucket.n++;
            }
          });
        }
        const pct = (c: number, p: number): Delta => {
          if (p <= 0) return { text: c > 0 ? 'minggu ini' : '—', color: 'neutral' };
          const d = Math.round(((c - p) / p) * 100);
          if (d === 0) return { text: 'stabil', color: 'neutral' };
          return { text: `${d > 0 ? '+' : ''}${d}%`, color: 'lime' };
        };
        const fraudDelta = ((): Delta => {
          if (prev.fraud <= 0) return { text: week.fraud > 0 ? 'minggu ini' : '—', color: 'neutral' };
          const d = week.fraud - prev.fraud;
          if (d === 0) return { text: 'stabil', color: 'neutral' };
          return { text: `${d > 0 ? '+' : ''}${d}`, color: d < 0 ? 'lime' : 'rose' };
        })();
        const avgDelta = ((): Delta => {
          const a = week.n > 0 ? week.sum / week.n : 0;
          const b = prev.n > 0 ? prev.sum / prev.n : 0;
          if (b <= 0) return { text: a > 0 ? 'minggu ini' : '—', color: 'neutral' };
          const d = Math.round(a - b);
          if (d === 0) return { text: 'stabil', color: 'neutral' };
          return { text: `${d > 0 ? '+' : ''}${d} pts`, color: d > 0 ? 'lime' : 'rose' };
        })();

        setMetrics({
          totalProcessed: total,
          fraudCount: fraud,
          hiddenGems: gems,
          hiredCount: hired,
          averageScore: scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0,
          deltas: { total: pct(week.total, prev.total), fraud: fraudDelta, gems: pct(week.gems, prev.gems), hired: pct(week.hired, prev.hired), avg: avgDelta },
          labels,
          trendData: trendArray
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fraudRate = metrics.totalProcessed > 0
    ? Math.round((metrics.fraudCount / metrics.totalProcessed) * 100)
    : 0;

  const stats = [
    { icon: RiGroupLine, label: 'Total Evaluasi', value: loading ? '…' : String(metrics.totalProcessed), delta: loading ? '—' : metrics.deltas.total.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.total.color },
    { icon: RiFocus3Line, label: 'Rata-rata Skor Bukti', value: loading ? '…' : String(metrics.averageScore), delta: loading ? '—' : metrics.deltas.avg.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.avg.color },
    { icon: RiShieldCheckLine, label: 'Tingkat Pencegahan Kecurangan', value: loading ? '…' : `${fraudRate}%`, delta: loading ? '—' : metrics.deltas.fraud.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.fraud.color },
    { icon: RiSparklingLine, label: 'Kandidat Tersembunyi (Gem)', value: loading ? '…' : String(metrics.hiddenGems), delta: loading ? '—' : metrics.deltas.gems.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.gems.color },
    { icon: RiSendPlaneLine, label: 'Penawaran Diterima (Offer)', value: loading ? '…' : String(metrics.hiredCount), delta: loading ? '—' : metrics.deltas.hired.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.hired.color },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-title-1-medium text-text-primary">Ringkasan performa</h2>
        <p className="text-body-medium text-text-secondary">Telemetri alur kerja perekrutan dan performa evaluasi AI.</p>
      </div>

      <StatCards variant="plain" stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card lg:col-span-2">
          <h3 className="inline-flex items-center gap-2 text-body-1-medium text-text-primary">
            <RiPulseLine className="size-5 text-accent-600" aria-hidden />
            Distribusi Keselarasan Kandidat
          </h3>

          <div className="flex flex-col gap-5">
            {Object.entries(metrics.labels).map(([label, count], idx) => {
              if (label === 'Menunggu') return null;
              const total = metrics.totalProcessed || 1;
              const percentage = Math.round((count / total) * 100);

              let barColor = 'bg-accent-500';
              if (label === 'Terindikasi Palsu') barColor = 'bg-status-rose-text';
              if (label === 'Ketidakcocokan') barColor = 'bg-status-yellow-text';
              if (label === 'Cocok Solid') barColor = 'bg-status-blue-text';

              return (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-body-medium text-text-primary">
                    <span>{label}</span>
                    <span className="tabular-nums">{percentage}% ({count})</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-background-secondary-default">
                    <div
                      className={`h-full rounded-full ${barColor} transition-[width] duration-700`}
                      style={{ width: `${percentage}%`, transitionDelay: `${idx * 100}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-3xl bg-background-tertiary-default p-5 text-text-primary">
          <div className="flex flex-col gap-4">
            <span className="flex size-12 items-center justify-center rounded-full border border-separator-border bg-background-primary-default">
              <RiLineChartLine className="size-6 text-accent-600" aria-hidden />
            </span>
            <h3 className="text-body-1-medium">Nilai Efisiensi Skillens AI</h3>
            <p className="text-body-regular leading-relaxed text-text-secondary">
              Dengan menyaring <strong className="text-text-primary">{metrics.fraudCount} kandidat</strong> terindikasi palsu secara otomatis, Skillens AI telah menghemat waktu tim Anda sekitar <strong className="text-text-primary">{metrics.fraudCount * 1.5} jam</strong> sesi wawancara teknis.
            </p>
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card">
        <h3 className="inline-flex items-center gap-2 text-body-1-medium text-text-primary">
          <RiCalendarLine className="size-5 text-accent-600" aria-hidden />
          Volume Evaluasi (7 Hari Terakhir)
        </h3>

        <div className="flex h-48 w-full items-end gap-3">
          {metrics.trendData.map((day, idx) => {
            const maxCount = Math.max(...metrics.trendData.map(d => d.count), 1);
            const heightPercentage = (day.count / maxCount) * 100;
            return (
              <div key={day.dateStr} className="group flex h-full flex-1 cursor-pointer flex-col items-center justify-end">
                <div className="relative flex h-full w-full max-w-[40px] items-end justify-center rounded-t-xl bg-background-secondary-default transition-colors group-hover:bg-background-tertiary-default">
                  <div className="absolute -top-8 rounded-full bg-background-tertiary-default px-2.5 py-1 text-caption-1-semibold tabular-nums text-text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {day.count}
                  </div>
                  <div
                    className="w-full rounded-t-xl bg-text-primary transition-colors group-hover:bg-accent-500"
                    style={{ height: day.count === 0 ? '6px' : `${heightPercentage}%`, transition: `height 0.8s ease ${idx * 100}ms` }}
                  />
                </div>
                <span className="mt-3 text-caption-1-semibold text-text-secondary">{day.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
