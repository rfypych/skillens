'use client';

const METRICS = [
  { value: '3,400+', label: 'Simulasi selesai' },
  { value: '98.4%', label: 'Akurasi deteksi AI' },
  { value: '< 0.3s', label: 'Kecepatan deteksi' },
  { value: '50+', label: 'Skenario tersedia' },
  { value: '12 min', label: 'Rata-rata durasi tes' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '5 peran', label: 'Domain evaluasi' },
  { value: 'ISO 27001', label: 'Keamanan data' },
];

export function MetricsSection() {
  return (
    <section id="metrics" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="border border-border-button-default bg-background-primary-default rounded-3xl p-8 md:p-14 shadow-card">
        <p className="text-caption-1-semibold text-text-tertiary mb-10">
          Platform dalam angka
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-separator-border border border-separator-border rounded-2xl overflow-hidden">
          {METRICS.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 bg-background-primary-default p-6 md:p-8"
            >
              <span className="text-title-1-medium text-text-primary tabular-nums leading-none">
                {m.value}
              </span>
              <span className="text-body-regular text-text-secondary mt-1">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
