/* Hallmark · pre-emit critique: P5 H5 E5 S4 R5 V5 · genre: modern-minimal */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';
import { useState, useEffect } from 'react';
import {
  IconArrowUpRight,
  IconChevronRight,
  IconClock,
} from '@/components/icons/CustomIcons';

/* ────────────────────────────────────────
   NAVBAR (centered links, right CTA)
──────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const tick = () =>
      setTimeString(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="relative z-30 w-full flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
      {/* Logo */}
      <Link href="/">
        <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain" />
      </Link>

      {/* Desktop center links */}
      <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        <a href="#about" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Solusi</a>
        <a href="#metrics" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-1">
          Kapabilitas <IconChevronRight size={14} className="opacity-50" />
        </a>
        <Link href="/recruiter" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Rekruiter</Link>
      </div>

      {/* Desktop right: clock + CTA */}
      <div className="hidden md:flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium font-mono">
          <IconClock size={13} />{timeString || '08:00'} WIB
        </span>
        <Link href="/signup">
          <TextRollButton text="Mulai Gratis" variant="dark" size="sm" />
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center"
      >
        {open ? <X size={17} /> : <Menu size={17} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md rounded-2xl mx-3 mt-2 p-5 shadow-xl z-50 flex flex-col gap-3">
          <a href="#about" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1">Solusi</a>
          <a href="#metrics" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1">Kapabilitas</a>
          <Link href="/recruiter" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1">Rekruiter</Link>
          <Link href="/signup" className="mt-2 block">
            <TextRollButton text="Mulai Gratis" variant="orange" size="md" className="w-full justify-between" />
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ────────────────────────────────────────
   HERO SECTION (Hallmark Modern-Minimal)
──────────────────────────────────────── */
export function HeroSection() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-7 bg-[#f0f0f0]">
      <section className="relative w-full max-w-[1760px] h-full rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col items-center group">

        {/* Background Shader */}
        <div className="absolute inset-0 w-full h-full">
          <ShaderBackground variant="light" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* ── Main Headline + Subtitle (Pure Roman Typography — Hallmark Anti-Slop) ── */}
        <div className="relative z-30 flex flex-col items-center text-center px-5 mt-[5vh] sm:mt-[8vh] md:mt-[9vh]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-900 leading-[0.98] font-sans font-semibold tracking-[-0.04em] text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] max-w-5xl"
          >
            Merekrut berdasarkan <br className="hidden sm:inline" />
            <span className="text-[#F26522]">bukti kemampuan.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-center font-normal leading-relaxed mt-6 sm:mt-8"
          >
            Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 mt-8 sm:mt-10"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-base font-medium pl-7 pr-2.5 py-2.5 rounded-full hover:bg-[#F26522] transition-colors duration-200 shadow-md"
            >
              Coba Simulasi
              <span className="bg-white rounded-full p-2">
                <IconArrowUpRight size={14} className="text-gray-900" />
              </span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Sudah punya akun →
            </Link>
          </motion.div>
        </div>

        {/* ── Bottom-Left Paragraph Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden sm:block absolute bottom-10 sm:bottom-14 left-8 md:left-14 max-w-[280px] z-30"
        >
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Setiap tahapan simulasi mencatat kapabilitas nyata kandidat, dari kedalaman pemecahan masalah hingga penalaran keputusan.
          </p>
        </motion.div>

        {/* ── Bottom-Right Inverted Cut-Out Corner Widget (Reference Match) ── */}
        <div className="hidden sm:block absolute bottom-0 right-0 z-30 pointer-events-auto">
          <div className="relative bg-[#f0f0f0] px-7 py-5 rounded-tl-[2.5rem] flex items-center gap-3.5">
            {/* Inverted curve - Top edge junction */}
            <svg
              className="absolute -top-[2.5rem] right-0 w-[2.5rem] h-[2.5rem] text-[#f0f0f0] pointer-events-none"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z" fill="currentColor" />
            </svg>

            {/* Inverted curve - Left edge junction */}
            <svg
              className="absolute bottom-0 -left-[2.5rem] w-[2.5rem] h-[2.5rem] text-[#f0f0f0] pointer-events-none"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z" fill="currentColor" />
            </svg>

            {/* Content inside corner */}
            <Link href="/signup" className="flex items-center gap-3.5 group/corner">
              <div className="w-10 h-10 rounded-full bg-[#F26522] flex items-center justify-center flex-shrink-0 shadow-sm group-hover/corner:scale-105 transition-transform duration-200">
                <IconArrowUpRight size={18} className="text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-900 leading-tight">Dokumentasi</span>
                <span className="text-[11px] font-medium text-[#F26522] flex items-center gap-0.5">
                  Panduan &gt;
                </span>
              </div>
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
