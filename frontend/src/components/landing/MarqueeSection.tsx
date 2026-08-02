'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Cpu, Terminal, Sparkles, BarChart3, Activity, Lock, BrainCircuit } from 'lucide-react';

interface MarqueeCard {
  id: string;
  title: string;
  category: string;
  tag: string;
  bgGradient: string;
  icon: any;
  metric: string;
}

const ROW_1_CARDS: MarqueeCard[] = [
  {
    id: 'r1-1',
    title: 'Interactive Case Study Sandbox',
    category: 'Assessment Engine',
    tag: 'Live Environment',
    bgGradient: 'from-orange-900/40 via-gray-900 to-black',
    icon: Terminal,
    metric: 'Real-time Execution',
  },
  {
    id: 'r1-2',
    title: 'Behavioral Anti-Cheat Telemetry',
    category: 'Security Shield',
    tag: 'Layer 2 Protection',
    bgGradient: 'from-slate-900 via-gray-900 to-orange-950/40',
    icon: ShieldCheck,
    metric: 'Keystroke & Focus Track',
  },
  {
    id: 'r1-3',
    title: 'Dynamic Probing Follow-Up AI',
    category: 'AI Evaluator',
    tag: 'Adaptive Questions',
    bgGradient: 'from-orange-950/50 via-zinc-900 to-black',
    icon: BrainCircuit,
    metric: 'Architecture Verification',
  },
  {
    id: 'r1-4',
    title: 'Tailored HRD Interview Briefing',
    category: 'Recruiter Tools',
    tag: 'Automated Questions',
    bgGradient: 'from-zinc-900 via-stone-900 to-orange-900/30',
    icon: Sparkles,
    metric: 'Verified Insights',
  },
  {
    id: 'r1-5',
    title: 'High-Traffic Scale Incident Demo',
    category: 'DevOps Scenario',
    tag: 'Kubernetes & Redis',
    bgGradient: 'from-slate-900 via-orange-950/30 to-black',
    icon: Cpu,
    metric: '5,000 req/sec Spike',
  },
];

const ROW_2_CARDS: MarqueeCard[] = [
  {
    id: 'r2-1',
    title: 'Candidate Keystroke Dynamics Log',
    category: 'Telemetry Analysis',
    tag: 'No-Spy Privacy',
    bgGradient: 'from-orange-950/40 via-zinc-900 to-black',
    icon: Activity,
    metric: 'Backtrack Ratio 4.2%',
  },
  {
    id: 'r2-2',
    title: 'ISO 27001 Defense-in-Depth Shield',
    category: 'Enterprise Protection',
    tag: 'Layer 1 & 2',
    bgGradient: 'from-stone-900 via-orange-900/30 to-black',
    icon: Lock,
    metric: 'Zero-Bypass Architecture',
  },
  {
    id: 'r2-3',
    title: 'Comprehensive Recruiter Scorecard',
    category: 'Analytics Dashboard',
    tag: 'Instant Export',
    bgGradient: 'from-slate-900 via-gray-900 to-orange-950/40',
    icon: BarChart3,
    metric: 'Multi-Axis Score',
  },
  {
    id: 'r2-4',
    title: 'Senior Frontend State Machine Crisis',
    category: 'Web Scenario',
    tag: 'React & Turbopack',
    bgGradient: 'from-zinc-900 via-orange-950/40 to-black',
    icon: Terminal,
    metric: '60 FPS Performance',
  },
  {
    id: 'r2-5',
    title: 'Product Growth Experiment Sandbox',
    category: 'Strategy Assessment',
    tag: 'A/B Test Design',
    bgGradient: 'from-orange-900/40 via-slate-900 to-black',
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

  // Triple items for seamless loop width
  const row1Items = [...ROW_1_CARDS, ...ROW_1_CARDS, ...ROW_1_CARDS];
  const row2Items = [...ROW_2_CARDS, ...ROW_2_CARDS, ...ROW_2_CARDS];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-16 overflow-hidden relative z-10"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        
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
                  className={`w-[320px] sm:w-[420px] h-[210px] sm:h-[270px] shrink-0 rounded-2xl bg-gradient-to-br ${card.bgGradient} border border-gray-800/80 p-6 flex flex-col justify-between group hover:border-[#F26522]/50 transition-colors shadow-2xl relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26522]/10 rounded-full blur-2xl group-hover:bg-[#F26522]/20 transition-all" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F26522] bg-[#F26522]/10 border border-[#F26522]/30 px-3 py-1 rounded-full">
                      {card.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {card.tag}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto">
                    <div className="w-10 h-10 rounded-xl bg-gray-900/90 border border-gray-700/60 flex items-center justify-center text-[#F26522] mb-3 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/60 relative z-10">
                    <span className="text-xs font-mono text-gray-400">
                      {card.metric}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
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
                  className={`w-[320px] sm:w-[420px] h-[210px] sm:h-[270px] shrink-0 rounded-2xl bg-gradient-to-br ${card.bgGradient} border border-gray-800/80 p-6 flex flex-col justify-between group hover:border-[#F26522]/50 transition-colors shadow-2xl relative overflow-hidden`}
                >
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF6B2B]/10 rounded-full blur-2xl group-hover:bg-[#FF6B2B]/20 transition-all" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6B2B] bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 px-3 py-1 rounded-full">
                      {card.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {card.tag}
                    </span>
                  </div>

                  <div className="relative z-10 my-auto">
                    <div className="w-10 h-10 rounded-xl bg-gray-900/90 border border-gray-700/60 flex items-center justify-center text-[#FF6B2B] mb-3 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/60 relative z-10">
                    <span className="text-xs font-mono text-gray-400">
                      {card.metric}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
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
