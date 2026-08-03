'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';

export function CTASection() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 pb-0 bg-[#EFEFEF]">
      <section
        className="relative w-full max-w-[1720px] rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[540px] px-4 sm:px-8 py-12 md:py-16"
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
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 gap-5 sm:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-[13px] uppercase tracking-widest text-white/40 font-medium"
          >
            Siap mulai?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-2xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Rekrut berdasarkan bukti, bukan asumsi.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2"
          >
            {/* Launch App — solid white */}
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 text-sm sm:text-base font-semibold pl-6 sm:pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] hover:text-white transition-colors duration-200 w-full sm:w-auto"
            >
              Mulai Gratis
              <span className="bg-gray-900 rounded-full p-2 group-hover:bg-white transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </span>
            </Link>

            {/* Read Docs — blur pill */}
            <Link
              href="/recruiter"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base font-medium px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border border-white/10 hover:bg-white/20 transition-colors duration-200 w-full sm:w-auto"
            >
              Lihat Demo
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
