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
    <section className="bg-white text-gray-900 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-12 py-20 sm:py-24 md:py-32 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] border-t border-gray-200/80">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADING */}
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F26522] border border-orange-200 bg-orange-50 rounded-full px-4 py-1.5 inline-block mb-4">
            Kapabilitas Utama Platform
          </span>
          <h2 className="text-[clamp(2.2rem,6vw,4rem)] font-bold text-gray-900 leading-[1.08] tracking-tight">
            Fitur Evaluasi Berstandar Industri
          </h2>
        </FadeIn>

        {/* LIST OF CAPABILITIES */}
        <div className="flex flex-col border-t border-gray-200/80">
          {CAPABILITIES.map((item, index) => (
            <FadeIn key={item.number} delay={index * 0.1} y={30}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12 py-8 sm:py-10 md:py-12 border-b border-gray-200/80 group hover:bg-[#F9FAFB] transition-colors px-4 sm:px-6 rounded-2xl">
                
                {/* NUMBER LEFT */}
                <div className="font-bold text-[#F26522] text-[clamp(2.5rem,6vw,5rem)] leading-none select-none group-hover:scale-105 transition-transform">
                  {item.number}
                </div>

                {/* CONTENT RIGHT */}
                <div className="flex flex-col gap-2 max-w-2xl">
                  <h3 className="font-semibold text-gray-900 text-[clamp(1.1rem,2vw,1.75rem)] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-normal text-gray-600 leading-relaxed text-[clamp(0.9rem,1.4vw,1.15rem)]">
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
