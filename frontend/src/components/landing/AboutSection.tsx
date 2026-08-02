'use client';

import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export function AboutSection() {
  const aboutParagraph =
    "Dengan mengombinasikan simulasi studi kasus interaktif dan telemetri perilaku AI, Skillens mentransformasi alur saringan kandidat menjadi pengalaman evaluasi otomatis yang transparan, presisi, dan bebas dari rekayasa generatif AI. Mari bangun standar perekrutan terbaik bersama kami!";

  return (
    <section className="bg-[#F8F9FA] min-h-[80vh] relative flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden text-gray-900 z-10 border-b border-gray-200/80">
      
      {/* CENTER CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-8 sm:gap-10">
        
        {/* EYEBROW TEXT */}
        <span className="text-xs font-mono uppercase tracking-widest text-[#F26522] font-semibold">
          SOLUSI & MISI
        </span>

        {/* SECTION HEADING */}
        <FadeIn delay={0} y={30}>
          <h2 className="text-[clamp(2.2rem,6vw,4.2rem)] font-bold text-gray-900 leading-[1.08] tracking-tight max-w-3xl">
            Mentransformasi Rekrutmen dengan <span className="text-[#F26522]">Kepastian Mutlak.</span>
          </h2>
        </FadeIn>

        {/* SCROLL-ANIMATED CHARACTER-BY-CHARACTER TEXT */}
        <div className="max-w-[720px] text-gray-800 font-medium leading-relaxed text-[clamp(1.1rem,2vw,1.35rem)]">
          <AnimatedText text={aboutParagraph} />
        </div>

        {/* CONTACT / CTA BUTTON */}
        <FadeIn delay={0.2} y={20} className="mt-4">
          <ContactButton label="Mulai Evaluasi Sekarang" href="/signup" />
        </FadeIn>

      </div>
    </section>
  );
}
