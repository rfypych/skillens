'use client';

import { ShieldCheck, Cpu, Target, Layers } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export function AboutSection() {
  const aboutParagraph =
    "Dengan mengombinasikan simulasi studi kasus interaktif dan telemetri perilaku AI, Skillens mentransformasi alur saringan kandidat menjadi pengalaman evaluasi otomatis yang transparan, presisi, dan bebas dari rekayasa generatif AI. Mari bangun standar perekrutan terbaik bersama kami!";

  return (
    <section className="bg-[#0C0C0C] min-h-screen relative flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden text-white z-10">
      
      {/* 4 DECORATIVE 3D CORNER ASSETS (SKILLENS ORANGE & DARK GLASS THEME - NO PURPLE) */}

      {/* Top-Left Corner Asset */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-0"
      >
        <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-[#F26522]/30 via-orange-950/20 to-black/80 border border-[#F26522]/40 backdrop-blur-md p-5 flex flex-col justify-between shadow-[0_0_40px_rgba(242,101,34,0.15)] transform -rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-10 h-10 rounded-2xl bg-[#F26522] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#FF6B2B] uppercase">Layer 01</div>
            <div className="text-xs font-semibold text-white mt-0.5">Security Shield</div>
          </div>
        </div>
      </FadeIn>

      {/* Bottom-Left Corner Asset */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none z-0"
      >
        <div className="relative aspect-square rounded-3xl bg-gradient-to-tr from-slate-900 via-gray-900 to-[#F26522]/20 border border-slate-700/60 backdrop-blur-md p-4 flex flex-col justify-between shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-700 text-[#FF6B2B] flex items-center justify-center">
            <Cpu size={20} />
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Telemetry</div>
            <div className="text-xs font-semibold text-white mt-0.5">Behavior Core</div>
          </div>
        </div>
      </FadeIn>

      {/* Top-Right Corner Asset */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-0"
      >
        <div className="relative aspect-square rounded-3xl bg-gradient-to-bl from-orange-500/20 via-zinc-900 to-black border border-orange-500/30 backdrop-blur-md p-5 flex flex-col justify-between shadow-[0_0_40px_rgba(255,107,43,0.12)] transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-[#F26522] text-white flex items-center justify-center shadow-lg">
            <Target size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#FF6B2B] uppercase">Precision</div>
            <div className="text-xs font-semibold text-white mt-0.5">Interactive Probe</div>
          </div>
        </div>
      </FadeIn>

      {/* Bottom-Right Corner Asset */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none z-0"
      >
        <div className="relative aspect-square rounded-3xl bg-gradient-to-tl from-black via-zinc-900 to-[#F26522]/25 border border-gray-800 backdrop-blur-md p-5 flex flex-col justify-between shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-10 h-10 rounded-2xl bg-gray-900 border border-gray-700 text-[#F26522] flex items-center justify-center">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">HRD Briefing</div>
            <div className="text-xs font-semibold text-white mt-0.5">Smart Analytics</div>
          </div>
        </div>
      </FadeIn>

      {/* CENTER CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-10 sm:gap-14 md:gap-16">
        
        {/* SECTION HEADING */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,120px)]">
            Solusi Kami
          </h2>
        </FadeIn>

        {/* SCROLL-ANIMATED CHARACTER-BY-CHARACTER TEXT */}
        <div className="max-w-[680px] text-[#D7E2EA] font-medium leading-relaxed text-[clamp(1rem,2vw,1.35rem)]">
          <AnimatedText text={aboutParagraph} />
        </div>

        {/* CONTACT BUTTON */}
        <FadeIn delay={0.3} y={20} className="mt-6 sm:mt-8">
          <ContactButton label="Mulai Evaluasi Sekarang" href="/signup" />
        </FadeIn>

      </div>
    </section>
  );
}
