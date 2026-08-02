'use client';

import { FadeIn } from './FadeIn';

interface CapabilityItem {
  number: string;
  title: string;
  description: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Simulasi Studi Kasus Interaktif',
    description:
      'Kandidat diuji langsung dalam ruang kerja skenario dinamis tempat AI bertindak sebagai partner bisnis, mengukur eksekusi nyata bukan sekadar kuis hafalan.',
  },
  {
    number: '02',
    title: 'Telemetri Perilaku Anti-Cheat',
    description:
      'Melacak kecepatan ketikan, ritme jeda berpikir, dan pola aktivitas jendela perbandingan tanpa mengganggu kenyamanan pengerjaan kandidat.',
  },
  {
    number: '03',
    title: 'Probing AI Dinamis',
    description:
      'Pertanyaan susulan otomatis yang menyesuaikan secara cerdas dengan alur keputusan kandidat untuk menguji kedalaman pemahaman masalah.',
  },
  {
    number: '04',
    title: 'Panduan Wawancara HRD',
    description:
      'Daftar pertanyaan terarah yang dihasilkan secara khusus bagi tim HRD untuk diverifikasi secara presisi pada sesi wawancara tatap muka.',
  },
  {
    number: '05',
    title: 'Laporan Analitik Presisi',
    description:
      'Skor kompetensi multidimensi dan analisis indikator risiko kecurangan yang komprehensif dalam satu dasbor rekruiter siap pakai.',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADING */}
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
          <h2 className="font-black uppercase text-[#0C0C0C] leading-none tracking-tight text-[clamp(2.5rem,10vw,140px)]">
            Kapabilitas
          </h2>
        </FadeIn>

        {/* LIST OF CAPABILITIES */}
        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {CAPABILITIES.map((item, index) => (
            <FadeIn key={item.number} delay={index * 0.1} y={30}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] group hover:bg-[#F9F9F9] transition-colors px-4 rounded-2xl">
                
                {/* NUMBER LEFT */}
                <div className="font-black text-[#0C0C0C] text-[clamp(2.5rem,8vw,120px)] leading-none select-none group-hover:text-[#F26522] transition-colors">
                  {item.number}
                </div>

                {/* CONTENT RIGHT */}
                <div className="flex flex-col gap-2 max-w-2xl">
                  <h3 className="font-semibold uppercase tracking-tight text-[#0C0C0C] text-[clamp(1.1rem,2.2vw,2rem)]">
                    {item.title}
                  </h3>
                  <p className="font-light leading-relaxed text-[#0C0C0C]/70 text-[clamp(0.875rem,1.5vw,1.2rem)]">
                    {item.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
