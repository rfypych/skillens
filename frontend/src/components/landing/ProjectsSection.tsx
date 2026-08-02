'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiveProjectButton } from './LiveProjectButton';

interface ScenarioCardData {
  number: string;
  category: string;
  title: string;
  description: string;
  href: string;
  badgeText: string;
  imageLeft1: string;
  imageLeft2: string;
  imageRight: string;
}

const SCENARIOS: ScenarioCardData[] = [
  {
    number: '01',
    category: 'Backend Architecture & Crisis Simulation',
    title: 'Penanganan Incident High-Concurrency System',
    description:
      'Simulasi penanganan lonjakan trafik 5,000 req/sec pada arsitektur microservices yang terdistribusi dan kueri database yang bottleneck.',
    href: '/signup',
    badgeText: 'DevOps & Backend',
    imageLeft1: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    imageLeft2: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    imageRight: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
  },
  {
    number: '02',
    category: 'Product Growth & Funnel Optimization',
    title: 'Strategi Optimasi Conversion Rate E-Commerce',
    description:
      'Mengevaluasi kemampuan analisis data produk, hipotesis A/B testing, dan perancangan funnel kandidat dalam studi kasus pertumbuhan produk.',
    href: '/signup',
    badgeText: 'Product Analytics',
    imageLeft1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    imageLeft2: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    imageRight: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
  },
  {
    number: '03',
    category: 'Frontend Engineering & State Management',
    title: 'Refactoring Architecture & Rendering FPS',
    description:
      'Menguji pemahaman kandidat dalam menyelesaikan kebocoran memori, mengoptimalkan re-render komponen React, dan arsitektur state.',
    href: '/signup',
    badgeText: 'Frontend Engineering',
    imageLeft1: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    imageLeft2: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    imageRight: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
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
      className="bg-[#0F172A] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 md:-mt-14 pt-20 sm:pt-24 md:pt-28 pb-32 px-4 sm:px-6 md:px-10 relative z-30 shadow-2xl border-t border-gray-800"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HEADING */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F26522] border border-[#F26522]/30 bg-[#F26522]/10 rounded-full px-4 py-1.5 inline-block">
            Skenario Evaluasi
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold tracking-tight text-white leading-tight">
            Demontrasi Studi Kasus Interaktif
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
    <div className="sticky top-24 md:top-32 h-[80vh] sm:h-[85vh] flex items-center justify-center">
      <motion.div
        style={{ scale: cardScale }}
        className="w-full bg-[#1E293B] border border-gray-700/60 shadow-2xl rounded-[28px] sm:rounded-[36px] md:rounded-[44px] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden relative"
      >
        
        {/* TOP ROW: Metadata & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-700/60">
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F26522]">
              {card.number}
            </span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F26522] bg-[#F26522]/10 border border-[#F26522]/30 px-3 py-1 rounded-full">
                {card.badgeText}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mt-1">
                {card.title}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Coba Skenario Ini" href={card.href} />
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed my-4 max-w-3xl">
          {card.description}
        </p>

        {/* BOTTOM MEDIA GRID (40% Left, 60% Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[220px] sm:h-[280px] md:h-[340px] overflow-hidden rounded-2xl">
          
          {/* LEFT 4 COLUMNS: 2 Stacked Images */}
          <div className="md:col-span-5 grid grid-rows-2 gap-4 h-full">
            <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-700/40 group">
              <img
                src={card.imageLeft1}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
            </div>
            <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-700/40 group">
              <img
                src={card.imageLeft2}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: 1 Tall Featured Image */}
          <div className="md:col-span-7 h-full relative overflow-hidden rounded-xl bg-gray-900 border border-gray-700/40 group">
            <img
              src={card.imageRight}
              alt={card.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
          </div>

        </div>

      </motion.div>
    </div>
  );
}
