'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconArrowUpRight, IconAuditShield, IconTelemetrySignal } from '@/components/icons/CustomIcons';

const SOLUSI_ITEMS = [
  {
    tag: 'EVALUASI UTAMA',
    title: 'Studi Kasus Real-time',
    description: 'Kandidat diuji langsung dalam lingkungan simulasi kerja nyata — menyelesaikan insiden, menganalisis data, dan merancang sistem.',
    stat: '100% Praktis',
  },
  {
    tag: 'KEAMANAN & INTEGRITAS',
    title: 'Telemetri Perilaku AI',
    description: 'Mendeteksi kecenderungan penggunaan AI dan kecurangan dalam < 0.3 detik lewat analisis cara berpikir kandidat tanpa proctoring kamera.',
    stat: '< 0.3s Deteksi',
  },
  {
    tag: 'EFISIENSI TIM',
    title: 'Penilaian Otonom',
    description: 'Menghasilkan skor dan laporan analisis mendalam secara otomatis sehingga tim rekruiter dapat mengambil keputusan tanpa periksa manual.',
    stat: 'Otomatis 100%',
  },
];

export function SolusiSection() {
  return (
    <section id="about" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10">
      <div className="bg-white border border-gray-200/60 rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-gray-100 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-2 block">
              Solusi Evaluasi
            </span>
            <h2
              className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight max-w-xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              Merekrut berdasarkan kemampuan nyata.
            </h2>
          </div>
          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
            Menghilangkan tebakan resume dengan evaluasi berbasis simulasi interaktif yang objektif dan transparan.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SOLUSI_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F9FAFB] border border-gray-200/50 rounded-[1.25rem] md:rounded-[1.75rem] p-7 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 min-h-[300px]"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-4">
                  {item.tag}
                </span>
                <h3 className="text-gray-900 text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em' }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between mt-6">
                <span className="text-xs font-semibold text-gray-900 bg-white px-3 py-1.5 rounded-full border border-gray-200/80">
                  {item.stat}
                </span>
                <Link href="/signup" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <IconArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
