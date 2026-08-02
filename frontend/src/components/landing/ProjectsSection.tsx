'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiveProjectButton } from './LiveProjectButton';
import { Terminal } from 'lucide-react';


interface VisualBlock {
  label: string;
  lines: string[];
}

interface ScenarioCardData {
  number: string;
  category: string;
  title: string;
  description: string;
  href: string;
  badgeText: string;
  metrics: { label: string; value: string }[];
  codeSnippet?: string;
  visual: VisualBlock[];
}

const SCENARIOS: ScenarioCardData[] = [
  {
    number: '01',
    category: 'DEVOPS & BACKEND',
    title: 'Penanganan Incident High-Concurrency System',
    description:
      'Simulasi penanganan lonjakan trafik 5,000 req/sec pada arsitektur microservices yang terdistribusi. AI menguji ketahanan kueri database dan kepatuhan arsitektur kandidat secara real-time.',
    href: '/signup',
    badgeText: 'CRISIS SIMULATION',
    metrics: [
      { label: 'THROUGHPUT', value: '5,000 req/s' },
      { label: 'LATENCY CAP', value: '< 45ms' },
      { label: 'AI DETECTION', value: '< 0.3s' },
    ],
    codeSnippet: `// Live Telemetry Event Stream
[SYS_ALERT] CPU Spiked to 98% on Node-04
[PROBE_AI] Candidate executed DB connection pooling fix
[STATUS] Latency stabilized to 32ms. Score: 98/100`,
    visual: [
      { label: 'NODE STATUS', lines: ['Node-01  ██████████  12ms OK', 'Node-02  ████████░░  28ms OK', 'Node-03  ██████████  15ms OK', 'Node-04  ██████████  98% !! ALERT'] },
      { label: 'PROBE ACTIVE', lines: ['AI monitoring 4 decision points', 'Pattern: Connection Pool Strategy', 'Risk flags: 0 detected'] },
    ],
  },
  {
    number: '02',
    category: 'PRODUCT ANALYTICS',
    title: 'Strategi Optimasi Conversion Rate E-Commerce',
    description:
      'Mengevaluasi kemampuan analisis data produk, hipotesis A/B testing, dan perancangan funnel kandidat dalam studi kasus pertumbuhan produk yang kompleks.',
    href: '/signup',
    badgeText: 'FUNNEL OPTIMIZATION',
    metrics: [
      { label: 'FUNNEL DROPOFF', value: '-34%' },
      { label: 'A/B WIN RATE', value: '+18.4%' },
      { label: 'LOG INTEGRITY', value: 'VERIFIED' },
    ],
    codeSnippet: `// Adaptive Q&A Probe Log
[HRD_PROBE] "Mengapa memilih metode cohort analysis ini?"
[CANDIDATE] "Untuk memisahkan dampak seasonal dari UI drop."
[EVALUATION] High Strategic Depth Identified.`,
    visual: [
      { label: 'FUNNEL TRACE', lines: ['Visit    → 12,400  (100%)', 'PDP      →  8,100  (65.3%)', 'Cart     →  4,200  (33.9%)', 'Checkout →  1,890  (15.2%)', 'Purchase →    808   (6.5%)'] },
      { label: 'HYPOTHESIS', lines: ['H1: Checkout friction -34%', 'A/B: CTA placement test active', 'Confidence: 94.2%'] },
    ],
  },
  {
    number: '03',
    category: 'FRONTEND ENGINEERING',
    title: 'Refactoring Architecture & Rendering FPS',
    description:
      'Menguji pemahaman kandidat dalam menyelesaikan kebocoran memori, mengoptimalkan re-render komponen React, dan menyusun arsitektur state yang clean.',
    href: '/signup',
    badgeText: 'STATE MANAGEMENT',
    metrics: [
      { label: 'TARGET FPS', value: '60 FPS' },
      { label: 'MEMORY LEAK', value: '0 Bytes' },
      { label: 'PROBE SCORE', value: '99/100' },
    ],
    codeSnippet: `// Performance Profiler Log
[PROFILER] 120 Component Re-renders Detected
[CANDIDATE_FIX] Applied React.memo & Context Selector
[RESULT] Render Time Reduced from 140ms -> 8ms.`,
    visual: [
      { label: 'RENDER TRACE', lines: ['Before  140ms  ████████████████████░', 'After     8ms  █░░░░░░░░░░░░░░░░░░░', 'Saves  132ms  ████████████████████'] },
      { label: 'MEMORY', lines: ['Heap used: 24.1 MB → 19.4 MB', 'Leaks resolved: 3/3', 'GC pressure: LOW'] },
    ],
  },
];

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="bg-[#0B0F19] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 md:-mt-14 pt-20 sm:pt-24 md:pt-28 pb-32 px-4 sm:px-6 md:px-10 relative z-30 shadow-2xl border-t border-slate-800/80"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HEADING — no eyebrow, left-aligned */}
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-semibold tracking-[-0.03em] text-white leading-[1.06]">
            Lihat bagaimana evaluasi yang sesungguhnya bekerja.
          </h2>
        </div>

        {/* STICKY STACKING CARDS */}
        <div className="space-y-12">
          {SCENARIOS.map((card, index) => {
            const targetScale = 1 - (SCENARIOS.length - 1 - index) * 0.04;
            return (
              <StickyCard
                key={card.number}
                card={card}
                index={index}
                total={SCENARIOS.length}
                progress={scrollYProgress}
                targetScale={targetScale}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

interface StickyCardProps {
  card: ScenarioCardData;
  index: number;
  total: number;
  progress: any;
  targetScale: number;
}

function StickyCard({ card, index, total, progress, targetScale }: StickyCardProps) {
  const cardScale = useTransform(
    progress,
    [index / total, 1],
    [1, targetScale]
  );

  return (
    <div className="sticky top-24 md:top-32 h-[82vh] sm:h-[85vh] flex items-center justify-center">
      <motion.div
        style={{ scale: cardScale }}
        className="w-full bg-[#111827] border border-slate-800 shadow-2xl rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden relative"
      >
        
        {/* TOP ROW: Monospace Metadata & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-[#F26522]">
              {card.number}
            </span>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F26522]">
                  {card.category}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-xs border border-slate-700/50">
                  {card.badgeText}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 tracking-tight">
                {card.title}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Coba Skenario" href={card.href} />
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed my-4 max-w-3xl">
          {card.description}
        </p>

        {/* TELEMETRY INTERFACE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[240px] sm:h-[290px] md:h-[340px] overflow-hidden rounded-xl">
          
          {/* LEFT 5 COLUMNS: Live Telemetry Terminal & Metrics */}
          <div className="md:col-span-5 bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between font-mono text-xs text-slate-300">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#F26522]" />
                <span>TELEMETRY_LOG // LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] tracking-wider uppercase">ACTIVE</span>
              </div>
            </div>

            {/* Log Stream */}
            <div className="my-3 font-mono text-[11px] text-slate-300 space-y-1.5 bg-slate-900/60 p-3 rounded-md border border-slate-800/60 leading-relaxed overflow-hidden">
              <pre className="whitespace-pre-wrap font-mono text-slate-300">{card.codeSnippet}</pre>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              {card.metrics.map((m, i) => (
                <div key={i} className="bg-slate-900/80 border border-slate-800 px-2 py-1.5 rounded">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">{m.label}</div>
                  <div className="text-xs font-bold text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: Purpose-built telemetry visual — no stock photos */}
          <div className="md:col-span-7 h-full relative overflow-hidden rounded-xl bg-[#0A0E1A] border border-slate-800/90 p-4 flex flex-col gap-3 font-mono text-[11px]">
            {card.visual.map((block, i) => (
              <div key={i} className="flex-1 bg-slate-900/60 border border-slate-800/60 rounded-lg p-3">
                <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {block.label}
                </div>
                <div className="space-y-1">
                  {block.lines.map((line, j) => (
                    <div key={j} className="text-slate-300 leading-tight">{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </motion.div>
    </div>
  );
}
