'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';
import { ShieldAlert, Server, Sparkles, Terminal, Activity } from 'lucide-react';

interface ScenarioCardData {
  id: string;
  number: string;
  category: string;
  title: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  col1Title1: string;
  col1Title2: string;
  col2Title: string;
}

const SCENARIOS: ScenarioCardData[] = [
  {
    id: 'p1',
    number: '01',
    category: 'DevOps & Backend Architecture',
    title: 'Incident 404: Traffic Spike Failover',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    col1Title1: 'Simulasi Terminal Cloud',
    col1Title2: 'Grafik Telemetri Respons',
    col2Title: 'Hasil Evaluasi AI',
  },
  {
    id: 'p2',
    number: '02',
    category: 'Product Growth & Experimentation',
    title: 'Aura Retention Funnel Crisis',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    col1Title1: 'Dashboard Metric Analytics',
    col1Title2: 'A/B Testing Strategy',
    col2Title: 'Probing Follow-Up Chat',
  },
  {
    id: 'p3',
    number: '03',
    category: 'Frontend & Performance Architecture',
    title: 'Solaris Web Performance Optimization',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    col1Title1: 'Memory Profiler Tree',
    col1Title2: 'Bundle Analysis Workspace',
    col2Title: 'Rekruiter Briefing Report',
  },
];

function CardItem({
  scenario,
  index,
  total,
}: {
  scenario: ScenarioCardData;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[85vh] min-h-[600px] sticky top-24 md:top-32 flex items-center justify-center mb-10"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full rounded-[35px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/30 bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#F26522]/60 transition-colors"
      >
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-black text-3xl sm:text-5xl md:text-6xl text-[#F26522]">
              {scenario.number}
            </span>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                {scenario.category}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">
                {scenario.title}
              </h3>
            </div>
          </div>

          <div className="shrink-0">
            <LiveProjectButton label="Coba Skenario" href="/signup" />
          </div>
        </div>

        {/* BOTTOM ROW: TWO-COLUMN IMAGE GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6 overflow-hidden">
          
          {/* LEFT COLUMN (40% width / 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 h-full">
            
            {/* Left Top Card */}
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden bg-gray-900 border border-gray-800/80 h-[130px] sm:h-[160px] md:h-[200px] group/img">
              <img
                src={scenario.col1Image1}
                alt={scenario.col1Title1}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">
                  {scenario.col1Title1}
                </span>
              </div>
            </div>

            {/* Left Bottom Card */}
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden bg-gray-900 border border-gray-800/80 flex-1 min-h-[140px] group/img">
              <img
                src={scenario.col1Image2}
                alt={scenario.col1Title2}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">
                  {scenario.col1Title2}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (60% width / 7 cols) */}
          <div className="md:col-span-7 h-full">
            <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden bg-gray-900 border border-gray-800/80 h-full min-h-[220px] group/img">
              <img
                src={scenario.col2Image}
                alt={scenario.col2Title}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest block mb-1">
                    Live Preview
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-white">
                    {scenario.col2Title}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section className="bg-[#0C0C0C] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 sm:pt-24 md:pt-32 pb-32 px-5 sm:px-8 md:px-10 relative z-30 border-t border-gray-800/60">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADING */}
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,140px)]">
            Skenario
          </h2>
        </FadeIn>

        {/* STICKY STACKING CARDS */}
        <div className="relative flex flex-col">
          {SCENARIOS.map((scenario, index) => (
            <CardItem
              key={scenario.id}
              scenario={scenario}
              index={index}
              total={SCENARIOS.length}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
