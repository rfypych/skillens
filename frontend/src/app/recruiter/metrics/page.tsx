'use client';

import { Activity, Calendar, ChartBar, ChartLineData, Group, Idea, Security, Target } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProcessed: 0,
    fraudCount: 0,
    hiddenGems: 0,
    averageScore: 0,
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

        const trendMap = new Map();
        const trendArray: { dateStr: string, label: string, count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const label = d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
          trendMap.set(dateStr, { dateStr, label, count: 0 });
          trendArray.push(trendMap.get(dateStr));
        }

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
              if (!isCheat && score > 0) scoreSum += score;

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
              const appDateStr = app.created_at.split('T')[0];
              if (trendMap.has(appDateStr)) {
                trendMap.get(appDateStr).count++;
              }
            }
          });
        }

        const validScoreCount = total - fraud - labels['Menunggu'];
        
        setMetrics({
          totalProcessed: total,
          fraudCount: fraud,
          hiddenGems: gems,
          averageScore: validScoreCount > 0 ? Math.round(scoreSum / validScoreCount) : 0,
          labels,
          trendData: trendArray
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fraudRate = metrics.totalProcessed > 0 
    ? Math.round((metrics.fraudCount / metrics.totalProcessed) * 100) 
    : 0;

  const kpis = [
    { name: 'Total Evaluasi', value: loading ? '...' : metrics.totalProcessed, icon: Group, color: 'text-[#F26522]', bg: 'bg-orange-50' },
    { name: 'Rata-rata Skor Bukti', value: loading ? '...' : metrics.averageScore, icon: Target, color: 'text-gray-900', bg: 'bg-gray-100' },
    { name: 'Tingkat Pencegahan Kecurangan', value: loading ? '...' : `${fraudRate}%`, icon: Security, color: 'text-red-700', bg: 'bg-red-50' },
    { name: 'Kandidat Tersembunyi (Gem)', value: loading ? '...' : metrics.hiddenGems, icon: Idea, color: 'text-emerald-700', bg: 'bg-emerald-50' },
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

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <h3 className="text-4xl font-semibold text-gray-900 mb-1 tracking-tight">{kpi.value}</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.name}</p>
          </motion.div>
        ))}
      </div>

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
