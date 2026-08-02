'use client';

// Hallmark · no eyebrow, no centered-everything, no hover-scale-animation on every row
// Layout: left-aligned heading + horizontal rule list (editorial list rhythm)

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
      'Melacak kecepatan ketikan, ritme jeda berpikir, dan pola aktivitas jendela tanpa mengganggu kenyamanan pengerjaan kandidat.',
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
      'Skor kompetensi multidimensi dan analisis indikator risiko kecurangan dalam satu dasbor rekruiter siap pakai.',
  },
];

export function ServicesSection() {
  return (
    <section
      id="capabilities"
      className="bg-white text-gray-900 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-12 py-20 sm:py-24 md:py-32 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] border-t border-gray-200/80"
    >
      <div className="max-w-5xl mx-auto">

        {/* LEFT-ALIGNED HEADING — no eyebrow, no centred */}
        <div className="mb-16 sm:mb-20 md:mb-24 max-w-2xl">
          <h2 className="text-[clamp(2rem,5.5vw,3.8rem)] font-semibold text-gray-900 leading-[1.06] tracking-[-0.03em]">
            Lima lapisan evaluasi yang tidak bisa diakali.
          </h2>
        </div>

        {/* HORIZONTAL RULE LIST */}
        <div className="flex flex-col border-t border-gray-200">
          {CAPABILITIES.map((item) => (
            <div
              key={item.number}
              className="flex flex-col md:flex-row items-start md:items-baseline gap-4 md:gap-12 py-8 sm:py-10 border-b border-gray-200"
            >
              {/* NUMBER */}
              <div className="font-mono text-sm text-gray-400 tabular-nums w-8 shrink-0 pt-0.5">
                {item.number}
              </div>

              {/* TITLE + DESCRIPTION */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8 flex-1">
                <h3 className="font-semibold text-gray-900 text-[clamp(1rem,1.8vw,1.4rem)] tracking-tight shrink-0 sm:min-w-[260px] md:min-w-[300px]">
                  {item.title}
                </h3>
                <p className="font-normal text-gray-500 leading-relaxed text-[clamp(0.9rem,1.3vw,1.05rem)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
