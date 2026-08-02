'use client';

import { ShieldCheck, Cpu, Target, Layers } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export function AboutSection() {
  const aboutParagraph =
    "Dengan mengombinasikan simulasi studi kasus interaktif dan telemetri perilaku AI, Skillens mentransformasi alur saringan kandidat menjadi pengalaman evaluasi otomatis yang transparan, presisi, dan bebas dari rekayasa generatif AI. Mari bangun standar perekrutan terbaik bersama kami!";

  return (
    <section className="bg-[#F8F9FA] min-h-screen relative flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden text-gray-900 z-10 border-b border-gray-200/80">
      
      {/* 4 CORNER DECORATIVE BADGES (MATCHING SKILLENS LIGHT BRAND STYLE) */}

      {/* Top-Left Corner Badge */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[6%] left-[1%] sm:left-[2%] md:left-[5%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative rounded-2xl bg-white border border-gray-200/80 p-5 flex flex-col justify-between shadow-sm transform -rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-[#F26522] flex items-center justify-center mb-3">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#F26522] uppercase">Layer 01 Shield</div>
            <div className="text-xs font-semibold text-gray-900 mt-0.5">ISO 27001 Certified</div>
          </div>
        </div>
      </FadeIn>

      {/* Bottom-Left Corner Badge */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[2%] sm:left-[4%] md:left-[8%] w-[120px] sm:w-[150px] md:w-[190px] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative rounded-2xl bg-white border border-gray-200/80 p-4 flex flex-col justify-between shadow-sm transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center mb-2">
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Behavior Core</div>
            <div className="text-xs font-semibold text-gray-900 mt-0.5">Keystroke Log</div>
          </div>
        </div>
      </FadeIn>

      {/* Top-Right Corner Badge */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[6%] right-[1%] sm:right-[2%] md:right-[5%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative rounded-2xl bg-white border border-gray-200/80 p-5 flex flex-col justify-between shadow-sm transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-[#F26522] flex items-center justify-center mb-3">
            <Target size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#F26522] uppercase">Interactive Probe</div>
            <div className="text-xs font-semibold text-gray-900 mt-0.5">Adaptive Q&A</div>
          </div>
        </div>
      </FadeIn>

      {/* Bottom-Right Corner Badge */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[2%] sm:right-[4%] md:right-[8%] w-[130px] sm:w-[160px] md:w-[200px] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative rounded-2xl bg-white border border-gray-200/80 p-5 flex flex-col justify-between shadow-sm transform -rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center mb-2">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">HRD Briefing</div>
            <div className="text-xs font-semibold text-gray-900 mt-0.5">Smart Analytics</div>
          </div>
        </div>
      </FadeIn>

      {/* CENTER CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-8 sm:gap-12 md:gap-14">
        
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#F26522]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">Solusi & Misi Platform</span>
        </div>

        {/* SECTION HEADING */}
        <FadeIn delay={0} y={40}>
          <h2 className="text-[clamp(2.2rem,7vw,4.5rem)] font-bold text-gray-900 leading-[1.08] tracking-tight">
            Mentransformasi Rekrutmen dengan <span className="text-[#F26522]">Kepastian Mutlak.</span>
          </h2>
        </FadeIn>

        {/* SCROLL-ANIMATED CHARACTER-BY-CHARACTER TEXT */}
        <div className="max-w-[720px] text-gray-900 font-medium leading-relaxed text-[clamp(1.1rem,2.2vw,1.4rem)]">
          <AnimatedText text={aboutParagraph} />
        </div>

        {/* CONTACT / CTA BUTTON */}
        <FadeIn delay={0.3} y={20} className="mt-4 sm:mt-6">
          <ContactButton label="Mulai Evaluasi Sekarang" href="/signup" />
        </FadeIn>

      </div>
    </section>
  );
}
