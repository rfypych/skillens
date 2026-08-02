'use client';

import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

// Featured scenario — shown in the right tall card (reference: "Commerce" use case)
const FEATURED = {
  category: 'DEVOPS & BACKEND',
  title: 'Penanganan Incident\nHigh-Concurrency',
  description:
    'Kandidat menangani lonjakan trafik 5,000 req/sec pada microservices terdistribusi. AI menguji setiap keputusan arsitektur secara real-time sambil melacak pola ketergantungan terhadap alat AI.',
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
    <section id="scenarios" className="bg-[#EFEFEF] px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* ── LEFT COLUMN: Eyebrow + large heading + description */}
        <div className="md:pr-12 md:pt-2">
          {/* Eyebrow — "USD Halo in Practice" equivalent */}
          <p className="text-gray-900/60 text-sm mb-2">
            Skillens dalam Praktik
          </p>

          {/* Large heading — reference: text-5xl md:text-6xl font-medium leading-none ls -0.04em */}
          <h2
            className="text-gray-900 text-5xl md:text-6xl font-medium leading-none mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Skenario<br />Evaluasi
          </h2>

          <p className="text-gray-900/60 text-base leading-relaxed max-w-sm">
            Puluhan skenario untuk berbagai peran — engineering, product, analytics — yang menguji kemampuan nyata dalam konteks kerja otentik dan tidak bisa diakali AI.
          </p>

          {/* Additional scenario chips */}
          <div className="mt-10 flex flex-col gap-2">
            {['DevOps & Backend', 'Product Analytics', 'Frontend Engineering', 'System Design'].map((label) => (
              <div
                key={label}
                className="inline-flex items-center gap-3 text-sm text-gray-500 py-2 border-b border-gray-200/60 last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: tall dark card with terminal viz (reference: video card) */}
        <div className="relative rounded-3xl overflow-hidden min-h-[720px] bg-[#0B0F19] border border-slate-800/40 flex flex-col">

          {/* Top section: category + heading + description */}
          <div className="relative z-10 p-10 md:p-12 flex-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F26522]">
              {FEATURED.category}
            </span>
            <h3
              className="text-white text-4xl md:text-5xl font-medium leading-tight mt-2 mb-5 whitespace-pre-line"
              style={{ letterSpacing: '-0.03em' }}
            >
              {FEATURED.title}
            </h3>
            <p className="text-white/60 text-base max-w-md mb-8 leading-relaxed">
              {FEATURED.description}
            </p>

            {/* "Know more" link — reference: leading circle icon + text */}
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 group"
            >
              <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-[#F26522] transition-colors duration-200">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
              <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                Coba Skenario
              </span>
            </Link>
          </div>

          {/* Bottom section: terminal log + metrics */}
          <div className="p-6 md:p-10 border-t border-slate-800/60 font-mono text-xs space-y-3">
            {/* Terminal header */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest mb-3">
              <div className="flex items-center gap-2">
                <Terminal size={11} className="text-[#F26522]" />
                TELEMETRY_LOG // LIVE
              </div>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                ACTIVE
              </span>
            </div>

            {/* Log lines */}
            <div className="bg-slate-950/60 rounded-xl p-4 space-y-1.5 border border-slate-800/40">
              {FEATURED.log.map((line, i) => (
                <div key={i} className="text-slate-300">{line}</div>
              ))}
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {FEATURED.metrics.map((m) => (
                <div key={m.label} className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5">
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
