'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Cpu, Terminal, Sparkles, BarChart3, Activity, Lock, BrainCircuit } from 'lucide-react';

interface MarqueeCard {
  id: string;
  title: string;
  category: string;
  tag: string;
  icon: any;
  metric: string;
}

const ROW_1_CARDS: MarqueeCard[] = [
  {
    id: 'r1-1',
    title: 'Ruang Kerja Studi Kasus Interaktif',
    category: 'Assessment Engine',
    tag: 'Live Environment',
    icon: Terminal,
    metric: 'Real-time Execution',
  },
  {
    id: 'r1-2',
    title: 'Telemetri Perilaku Anti-Cheat',
    category: 'Security Shield',
    tag: 'Layer 2 Defense',
    icon: ShieldCheck,
    metric: 'Keystroke & Focus Track',
  },
  {
    id: 'r1-[#F26522]',
    title: 'Probing AI Dinamis & Adaptif',
    category: 'AI Evaluator',
    tag: 'Dynamic Follow-Up',
    icon: BrainCircuit,
    metric: 'Architecture Probe',
  },
  {
    id: 'r1-4',
    title: 'Panduan Wawancara Otomatis HRD',
    category: 'Recruiter Tools',
    tag: 'Smart Briefing',
    icon: Sparkles,
    metric: 'Verified Insights',
  },
  {
    id: 'r1-5',
    title: 'Simulasi Backend Incident & Scale',
    category: 'DevOps Assessment',
    tag: 'High Traffic Scenario',
    icon: Cpu,
    metric: '5,000 req/sec Spike',
  },
];

const ROW_2_CARDS: MarqueeCard[] = [
  {
    id: 'r2-1',
    title: 'Analisis Kecepatan & Jeda Ketikan',
    category: 'Behavioral Metrics',
    tag: 'Telemetry Log',
    icon: Activity,
    metric: 'Backtrack Ratio 4.2%',
  },
  {
    id: 'r2-2',
    title: 'Perlindungan Multi-Lapis ISO 27001',
    category: 'Enterprise Protection',
    tag: 'Layer 1 & 2 Shield',
    icon: Lock,
    metric: 'Zero-Bypass Architecture',
  },
  {
    id: 'r2-3',
    title: 'Dasbor Analitik Rekruiter Siap Pakai',
    category: 'Analytics Dashboard',
    tag: 'Instant Export',
    icon: BarChart3,
    metric: 'Multi-Axis Scorecard',
  },
  {
    id: 'r2-4',
    title: 'Studi Kasus Frontend & Web Performance',
    category: 'Web Assessment',
    tag: 'State Machine Crisis',
    icon: Terminal,
    metric: '60 FPS Target',
  },
  {
    id: 'r2-5',
    title: 'Simulasi Product Strategy & Funnel',
    category: 'Strategy Assessment',
    tag: 'Experiment Design',
    icon: Cpu,
    metric: 'Funnel Optimization',
  },
];

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = (window.scrollY - rect.top + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1Items = [...ROW_1_CARDS, ...ROW_1_CARDS, ...ROW_1_CARDS];
  const row2Items = [...ROW_2_CARDS, ...ROW_2_CARDS, ...ROW_2_CARDS];

  return (
    <section
      ref={sectionRef}
      className="bg-[#FFFFFF] pt-20 sm:pt-28 pb-16 overflow-hidden relative z-10 border-b border-gray-100"
    >
      <div className="flex flex-col gap-5 sm:gap-6">
        
        {/* ROW 1: Moves RIGHT on scroll */}
        <div className="w-full overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollOffset - 400}px)`,
              willChange: 'transform',
            }}
          >
            {row1Items.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={`${card.id}-${idx}`}
                  className="w-[320px] sm:w-[400px] h-[200px] sm:h-[240px] shrink-0 rounded-2xl bg-[#F9FAFB] border border-gray-200/80 p-6 flex flex-col justify-between group hover:border-[#F26522] hover:shadow-md hover:bg-white transition-all shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F26522] bg-[#F26522]/10 border border-[#F26522]/20 px-3 py-1 rounded-full">
                      {card.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {card.tag}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#F26522] flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 relative z-10">
                    <span className="text-xs font-mono text-gray-600 font-medium">
                      {card.metric}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      SKILLENS CORE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Moves LEFT on scroll */}
        <div className="w-full overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${-(scrollOffset - 400)}px)`,
              willChange: 'transform',
            }}
          >
            {row2Items.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={`${card.id}-${idx}`}
                  className="w-[320px] sm:w-[400px] h-[200px] sm:h-[240px] shrink-0 rounded-2xl bg-[#F9FAFB] border border-gray-200/80 p-6 flex flex-col justify-between group hover:border-[#F26522] hover:shadow-md hover:bg-white transition-all shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-800 bg-gray-200/80 border border-gray-300 px-3 py-1 rounded-full">
                      {card.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {card.tag}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-900 flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 group-hover:text-[#F26522] transition-all">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 relative z-10">
                    <span className="text-xs font-mono text-gray-600 font-medium">
                      {card.metric}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      LIVE PLATFORM
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
