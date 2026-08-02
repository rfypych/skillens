'use client';

import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

// ---- DATA ----
const SCENARIOS = [
  {
    number: '01',
    category: 'DEVOPS & BACKEND',
    title: 'Incident High-Concurrency\nSystem',
    description:
      'Kandidat menangani lonjakan trafik 5,000 req/sec pada microservices terdistribusi. AI menguji setiap keputusan arsitektur secara real-time.',
    log: [
      '[SYS_ALERT]  CPU Spiked to 98% on Node-04',
      '[PROBE_AI]   Analyzing connection pool exhaustion',
      '[DECISION]   Circuit breaker pattern applied',
      '[STATUS]     Latency stabilized: 140ms → 32ms',
      '[SCORE]      Architecture Score: 98/100',
    ],
    metrics: [
      { label: 'THROUGHPUT', value: '5,000 req/s' },
      { label: 'LATENCY', value: '< 45ms' },
      { label: 'AI DETECT', value: '< 0.3s' },
    ],
  },
  {
    number: '02',
    category: 'PRODUCT ANALYTICS',
    title: 'Optimasi Conversion\nRate E-Commerce',
    description:
      'Mengukur kemampuan analisis data, hipotesis A/B, dan desain funnel dalam studi kasus pertumbuhan produk yang nyata.',
    log: [
      '[FUNNEL]     Drop detected at Checkout step',
      '[PROBE_AI]   "Mengapa memilih cohort analysis?"',
      '[CANDIDATE]  "Isolasi dampak seasonal dari UI drop"',
      '[EVALUATION] High Strategic Depth Detected',
      '[SCORE]      Product Thinking: 94/100',
    ],
    metrics: [
      { label: 'DROPOFF', value: '-34%' },
      { label: 'A/B WIN', value: '+18.4%' },
      { label: 'INTEGRITY', value: 'VERIFIED' },
    ],
  },
  {
    number: '03',
    category: 'FRONTEND ENGINEERING',
    title: 'Refactoring Architecture\n& Rendering FPS',
    description:
      'Menguji pemahaman kandidat soal memory leak, optimasi re-render React, dan arsitektur state yang bersih.',
    log: [
      '[PROFILER]   120 Component Re-renders Detected',
      '[CANDIDATE]  Applied React.memo & Context Selector',
      '[RESULT]     Render: 140ms → 8ms',
      '[MEMORY]     Heap: 24.1MB → 19.4MB',
      '[SCORE]      Probe Score: 99/100',
    ],
    metrics: [
      { label: 'TARGET FPS', value: '60 FPS' },
      { label: 'MEM LEAK', value: '0 Bytes' },
      { label: 'SCORE', value: '99/100' },
    ],
  },
];

export function UseCasesSection() {
  return (
    <section id="scenarios" className="bg-[#EFEFEF] px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-[88rem] mx-auto">

        {/* HEADING ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          <div className="md:pr-12">
            <p className="text-gray-400 text-sm mb-2 font-mono uppercase tracking-wider">
              Skillens dalam Praktik
            </p>
            <h2
              className="text-gray-900 text-5xl md:text-6xl font-semibold leading-none mb-6"
              style={{ letterSpacing: '-0.04em' }}
            >
              Skenario<br />Evaluasi
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Puluhan skenario untuk berbagai peran — engineering, product, analytics — yang menguji kemampuan nyata dalam konteks kerja otentik.
            </p>
          </div>
          <div className="hidden md:block" />
        </div>

        {/* SCENARIO CARDS - stacked vertically */}
        <div className="space-y-4">
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.number}
              className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-[#0B0F19] border border-slate-800/60"
            >
              {/* LEFT: Description */}
              <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/60">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-mono font-bold text-[#F26522]">{scenario.number}</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#F26522]/80">
                      {scenario.category}
                    </span>
                  </div>
                  <h3
                    className="text-white text-2xl sm:text-3xl font-semibold leading-tight mb-4 whitespace-pre-line"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {scenario.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed max-w-sm">
                    {scenario.description}
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-3 group"
                  >
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F26522] transition-colors duration-200">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                      Coba Skenario
                    </span>
                  </Link>
                </div>
              </div>

              {/* RIGHT: Terminal */}
              <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-4 font-mono text-[12px]">
                {/* Terminal header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-[10px] text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-[#F26522]" />
                    TELEMETRY_LOG // LIVE
                  </div>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    ACTIVE
                  </span>
                </div>

                {/* Log lines */}
                <div className="flex-1 bg-slate-950/50 rounded-xl p-4 space-y-2 border border-slate-800/40">
                  {scenario.log.map((line, i) => (
                    <div key={i} className="text-slate-300 leading-tight">
                      {line}
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {scenario.metrics.map((m, i) => (
                    <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2.5">
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{m.label}</div>
                      <div className="text-sm font-bold text-white tabular-nums">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
