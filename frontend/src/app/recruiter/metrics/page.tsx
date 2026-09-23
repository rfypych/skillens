'use client';

import { Activity, Calendar, ChartBar, ChartLineData, Group, Idea, Security, Target } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { StatCards } from '@/components/application/dashboard/stat-cards';

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(true);
  type Delta = { text: string; color: 'lime' | 'rose' | 'neutral' };
  const [metrics, setMetrics] = useState({
    totalProcessed: 0,
    fraudCount: 0,
    hiddenGems: 0,
    averageScore: 0,
    deltas: {
      total: { text: '—', color: 'neutral' } as Delta,
      fraud: { text: '—', color: 'neutral' } as Delta,
      gems: { text: '—', color: 'neutral' } as Delta,
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

        // Honest week-over-week deltas from the same payload (no fabrication):
        // evaluated apps created in the last 7 days vs the 7 days before.
        const now = Date.now();
        const inWeek = (iso: string, back: number) => {
          const t = new Date(iso).getTime();
          return t >= now - back * 86400000 && t < now - (back - 7) * 86400000;
        };
        const week = { total: 0, fraud: 0, gems: 0, sum: 0, n: 0 };
        const prev = { total: 0, fraud: 0, gems: 0, sum: 0, n: 0 };
        if (Array.isArray(data)) {
          data.forEach(app => {
            const latest = (app.assessment_results || [])[(app.assessment_results || []).length - 1];
            if (!latest || !app.created_at) return;
            const bucket = inWeek(app.created_at, 7) ? week : inWeek(app.created_at, 14) ? prev : null;
            if (!bucket) return;
            bucket.total++;
            if (latest.ai_cheating_detected) bucket.fraud++;
            if (latest.claim_vs_evidence_label === 'Hidden Gem') bucket.gems++;
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
          // For fraud, DOWN is good (lime), UP is bad (rose).
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
          averageScore: scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0,
          deltas: { total: pct(week.total, prev.total), fraud: fraudDelta, gems: pct(week.gems, prev.gems), avg: avgDelta },
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
    { icon: Group, label: 'Total Evaluasi', value: loading ? '…' : String(metrics.totalProcessed), delta: loading ? '—' : metrics.deltas.total.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.total.color },
    { icon: Target, label: 'Rata-rata Skor Bukti', value: loading ? '…' : String(metrics.averageScore), delta: loading ? '—' : metrics.deltas.avg.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.avg.color },
    { icon: Security, label: 'Tingkat Pencegahan Kecurangan', value: loading ? '…' : `${fraudRate}%`, delta: loading ? '—' : metrics.deltas.fraud.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.fraud.color },
    { icon: Idea, label: 'Kandidat Tersembunyi (Gem)', value: loading ? '…' : String(metrics.hiddenGems), delta: loading ? '—' : metrics.deltas.gems.text, deltaColor: loading ? 'neutral' as const : metrics.deltas.gems.color },
  ];

  return (
    <div className="w-full space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-3 mb-1">
          <ChartBar className="w-8 h-8 text-[#F26522]" />
          Analitik & Laporan Performa
        </h1>
        <p className="text-gray-600 text-base font-normal">Telemetri alur kerja perekrutan dan performa evaluasi AI.</p>
      </div>

      {/* KPI Grid — BoardUI StatCards with honest week-over-week deltas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatCards variant="plain" stats={stats} />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#F26522]" />
            Distribusi Keselarasan Kandidat
          </h2>
          
          <div className="space-y-6">
            {Object.entries(metrics.labels).map(([label, count], idx) => {
              if (label === 'Menunggu') return null;
              const total = metrics.totalProcessed || 1;
              const percentage = Math.round((count / total) * 100);
              
              let barColor = 'bg-[#F26522]';
              if (label === 'Terindikasi Palsu') barColor = 'bg-red-500';
              if (label === 'Ketidakcocokan') barColor = 'bg-amber-500';
              if (label === 'Cocok Solid') barColor = 'bg-blue-600';

              return (
                <div key={label}>
                  <div className="flex justify-between text-sm font-semibold text-gray-900 mb-2">
                    <span>{label}</span>
                    <span>{percentage}% ({count})</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                      className={`h-full ${barColor} rounded-full`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 p-8 rounded-2xl text-white shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <ChartLineData className="w-6 h-6 text-[#F26522]" />
            </div>
            <h2 className="text-xl font-medium mb-3">Nilai Efisiensi Skillens AI</h2>
            <p className="text-gray-300 text-sm leading-relaxed font-normal">
              Dengan menyaring <strong className="text-white font-semibold">{metrics.fraudCount} kandidat</strong> terindikasi palsu secara otomatis, Skillens AI telah menghemat waktu tim Anda sekitar <strong className="text-white font-semibold">{metrics.fraudCount * 1.5} jam</strong> sesi wawancara teknis.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Trend Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs"
      >
        <h2 className="text-xl font-medium text-gray-900 mb-8 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#F26522]" />
          Volume Evaluasi (7 Hari Terakhir)
        </h2>
        
        <div className="flex items-end gap-3 h-48 w-full mt-4">
          {metrics.trendData.map((day, idx) => {
            const maxCount = Math.max(...metrics.trendData.map(d => d.count), 1);
            const heightPercentage = (day.count / maxCount) * 100;
            return (
              <div key={day.dateStr} className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer">
                <div className="w-full relative flex justify-center items-end h-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-xl max-w-[40px]">
                  <div className="absolute -top-8 bg-gray-900 text-white text-xs font-bold py-1 px-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: day.count === 0 ? '6px' : `${heightPercentage}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + (idx * 0.1) }}
                    className="w-full bg-gray-900 group-hover:bg-[#F26522] rounded-t-xl transition-colors"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 mt-3">{day.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
