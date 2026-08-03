'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconArrowUpRight, IconTelemetrySignal } from '@/components/icons/CustomIcons';

const SCENARIO_TYPES = [
  { title: 'DevOps & Backend', desc: 'High-concurrency incident & distributed systems scaling' },
  { title: 'Product Analytics', desc: 'Funnel drop-off diagnosis & A/B test statistical analysis' },
  { title: 'Frontend Engineering', desc: 'State management, WebGL shader & render performance' },
  { title: 'System Architecture', desc: 'Microservices fault tolerance & DB sharding design' },
];

const FEATURED = {
  category: 'DEVOPS & BACKEND',
  title: 'Incident Handling\nHigh-Concurrency Stream',
  description:
    'Kandidat menangani lonjakan trafik 5,000 req/sec pada microservices terdistribusi. AI menguji setiap keputusan arsitektur secara real-time sambil melacak pola ketergantungan terhadap AI.',
  log: [
    '[SYS_ALERT]  CPU Spiked to 98% on Node-04',
    '[PROBE_AI]   Analyzing connection pool exhaustion...',
    '[DECISION]   Circuit breaker pattern applied',
    '[STATUS]     Latency stabilized: 140ms → 32ms',
    '[SCORE]      Architecture Score: 98/100',
  ],
  metrics: [
    { label: 'THROUGHPUT', value: '5,000 req/s' },
    { label: 'LATENCY CAP', value: '< 45ms' },
    { label: 'AI DETECTION', value: '< 0.3s' },
  ],
};

export function UseCasesSection() {
  return (
    <section id="scenarios" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* ── LEFT COLUMN: Eyebrow + Heading + Scenario Chips */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 bg-white border border-gray-200/80 rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3 block">
              Skillens dalam Praktik
            </span>
            <h2
              className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6"
              style={{ letterSpacing: '-0.04em' }}
            >
              Skenario<br />Evaluasi Otentik.
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Puluhan skenario studi kasus terkalibrasi untuk berbagai peran — engineering, product, analytics — yang menguji kemampuan nyata dalam konteks kerja otentik.
            </p>

            {/* Scenario chips */}
            <div className="space-y-3">
              {SCENARIO_TYPES.map((st, i) => (
                <div
                  key={st.title}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-900 font-mono uppercase tracking-wider">{st.title}</span>
                    <span className="text-[10px] font-mono text-[#F26522] bg-[#F26522]/10 px-2 py-0.5 rounded">MODUL 0{i + 1}</span>
                  </div>
                  <p className="text-xs text-gray-500">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-sm font-medium pl-6 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
            >
              Jelajahi Semua Skenario
              <span className="bg-white rounded-full p-1.5">
                <IconArrowUpRight size={14} className="text-gray-900" />
              </span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Featured Scenario Card with Terminal Viz */}
        <div className="lg:col-span-7 relative rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-[#0B0F19] border border-slate-800 flex flex-col justify-between p-6 sm:p-10 md:p-12">

          {/* Top section: category + title + description */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F26522] font-semibold">
                {FEATURED.category}
              </span>
              <span className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SIMULASI_AKTIF
              </span>
            </div>

            <h3
              className="text-white text-3xl sm:text-4xl font-semibold leading-tight mb-4 whitespace-pre-line"
              style={{ letterSpacing: '-0.03em' }}
            >
              {FEATURED.title}
            </h3>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              {FEATURED.description}
            </p>
          </div>

          {/* Bottom section: Terminal Log + Metrics */}
          <div className="space-y-4 font-mono text-xs">
            {/* Terminal log container */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-900 pb-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <IconTelemetrySignal size={12} className="text-[#F26522]" />
                  TELEMETRY_ENGINE // LIVE_FEED
                </span>
                <span>ISO_TIMESTAMP</span>
              </div>
              {FEATURED.log.map((line, idx) => (
                <div key={idx} className="text-slate-300 font-mono text-[11px]">
                  {line}
                </div>
              ))}
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-3">
              {FEATURED.metrics.map((m) => (
                <div key={m.label} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-3 text-center">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{m.label}</div>
                  <div className="text-sm font-bold text-white tabular-nums">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
