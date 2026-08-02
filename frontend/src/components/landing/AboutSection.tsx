'use client';

import { ContactButton } from './ContactButton';

// Hallmark · redesign · no eyebrow, left-biased layout, no centred-everything
export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#F5F4F0] border-b border-gray-200/60 relative z-10 overflow-hidden"
    >
      {/* Two-column asymmetric layout */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] min-h-[480px]">

        {/* LEFT — thin column, label + thin rule */}
        <div className="hidden md:flex flex-col justify-between px-10 lg:px-14 py-20 border-r border-gray-200/60">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-6">
              Rekrutmen Era Baru
            </div>
            <div className="w-8 h-px bg-[#F26522]" />
          </div>

          <div className="text-[11px] font-mono text-gray-400 tabular-nums tracking-wider">
            Skillens<br />2025
          </div>
        </div>

        {/* RIGHT — main content, left-aligned */}
        <div className="flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-20 md:py-24 gap-8 max-w-3xl">

          <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-semibold text-gray-900 leading-[1.06] tracking-[-0.03em]">
            Kandidat terbaik kalah bukan karena kemampuan —<br className="hidden sm:block" />
            <span className="text-[#F26522]"> tapi karena cara rekrutmen yang salah.</span>
          </h2>

          <div className="space-y-4 text-[clamp(1rem,1.6vw,1.2rem)] text-gray-600 font-normal leading-relaxed max-w-2xl">
            <p>
              CV yang memoles bisa dibuat AI dalam hitungan detik. Wawancara berbasis hafalan tidak membedakan kandidat yang benar-benar kompeten. Rekruiter menghabiskan waktu mengevaluasi orang yang salah.
            </p>
            <p>
              Skillens mengganti semua itu dengan simulasi studi kasus interaktif yang mengukur eksekusi nyata — bukan performa di atas kertas — dilengkapi telemetri perilaku yang mendeteksi ketergantungan AI secara diam-diam.
            </p>
          </div>

          <div className="pt-2">
            <ContactButton label="Mulai Evaluasi Sekarang" href="/signup" />
          </div>

        </div>
      </div>
    </section>
  );
}
