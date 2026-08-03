'use client';

import { motion, type Variants } from 'framer-motion';

const METRICS = [
  { value: '3,400+', label: 'Simulasi Selesai' },
  { value: '98.4%', label: 'Akurasi Deteksi AI' },
  { value: '< 0.3s', label: 'Kecepatan Deteksi' },
  { value: '50+', label: 'Skenario Tersedia' },
  { value: '12 min', label: 'Rata-rata Durasi Test' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '5 peran', label: 'Domain Evaluasi' },
  { value: 'ISO 27001', label: 'Keamanan Data' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function MetricsSection() {
  return (
    <section id="metrics" className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-10">
      <div
        className="border rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] p-5 sm:p-8 md:p-14"
        style={{
          backgroundColor: 'rgba(30,50,90,0.02)',
          borderColor: 'rgba(30,50,90,0.06)',
        }}
      >
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-[13px] uppercase tracking-widest text-gray-400 font-medium mb-6 sm:mb-10"
        >
          Platform dalam angka
        </motion.p>

        {/* 2-col on mobile, 4-col on desktop */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex flex-col gap-1 p-4 sm:p-6 md:p-8 bg-white/50 backdrop-blur-xs rounded-xl sm:rounded-2xl border border-gray-200/40 shadow-2xs"
            >
              <span
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tabular-nums leading-none"
                style={{ letterSpacing: '-0.04em' }}
              >
                {m.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 font-medium">{m.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
