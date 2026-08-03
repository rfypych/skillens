'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';
import { IconArrowUpRight } from '@/components/icons/CustomIcons';

export function CTASection() {
  return (
    <div className="w-full flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-7 pb-0 bg-[#f0f0f0]">
      <section
        className="relative w-full max-w-[1760px] rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col items-center justify-center min-h-[480px] md:min-h-[560px]"
      >
        {/* Background — dark shader / solid */}
        <div className="absolute inset-0 bg-[#0B0F19]">
          <ShaderBackground variant="dark" />
        </div>

        {/* Subtle orange glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 80%, #F26522 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[13px] uppercase tracking-widest text-white/40 font-medium"
          >
            Siap mulai?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight max-w-2xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Rekrut berdasarkan bukti, bukan asumsi.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-row items-center gap-3 mt-2"
          >
            {/* Launch App — solid white */}
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-white text-gray-900 text-base font-semibold pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] hover:text-white transition-colors duration-200"
            >
              Mulai Gratis
              <span className="bg-gray-900 rounded-full p-2 group-hover:bg-white transition-colors">
                <IconArrowUpRight size={14} className="text-white group-hover:text-gray-900" />
              </span>
            </Link>

            {/* Read Docs — blur pill */}
            <Link
              href="/recruiter"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-base font-medium px-7 py-3 rounded-full border border-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              Lihat Demo
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
