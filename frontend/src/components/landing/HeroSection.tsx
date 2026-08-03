'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';
import { useState, useEffect } from 'react';
import {
  IconSparkle,
  IconArrowUpRight,
  IconTelemetrySignal,
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
    <nav className="relative z-20 w-full flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
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
        <a href="#features" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Skenario</a>
        <Link href="/recruiter" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Rekruiter</Link>
      </div>

      {/* Desktop right: clock + CTA */}
      <div className="hidden md:flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
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
          <a href="#features" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1">Skenario</a>
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
   HERO BADGE
──────────────────────────────────────── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 shadow-sm"
    >
      <IconSparkle size={14} className="text-[#F26522]" />
      <span className="text-[13px] font-medium text-gray-800">Evaluasi Presisi</span>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   BOTTOM-LEFT GLASS CARD
──────────────────────────────────────── */
function BottomLeftCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="absolute bottom-6 left-6 z-20 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <IconTelemetrySignal size={14} className="text-[#F26522]" />
        <span className="text-sm font-semibold text-gray-900">1,200+ Evaluasi Selesai</span>
      </div>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#F26522] hover:text-white transition-colors duration-200"
      >
        Coba Gratis
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   BOTTOM-RIGHT CUT-OUT CORNER (SVG trick)
──────────────────────────────────────── */
function BottomRightCorner() {
  return (
    <div className="hidden sm:block absolute bottom-0 right-0 z-20">
      <div
        className="relative bg-[#f0f0f0] p-6 pt-8 pl-14 rounded-tl-[3.5rem]"
        style={{ minWidth: '14rem' }}
      >
        {/* SVG inverted corner — top edge */}
        <svg
          className="absolute top-0 right-0 h-14"
          style={{ top: 0, left: 'calc(3.5rem - 0.5px)', width: '3.5rem', transform: 'translateX(-100%)' }}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f0f0f0" />
        </svg>
        {/* SVG inverted corner — left edge */}
        <svg
          className="absolute left-0"
          style={{ bottom: 'calc(3.5rem - 0.5px)', top: 'auto', height: '3.5rem', width: '3.5rem', transform: 'translateY(100%)' }}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f0f0f0" />
        </svg>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconArrowUpRight size={14} className="text-gray-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-snug">Dokumentasi</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-snug">/ Panduan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   HERO SECTION (main export)
──────────────────────────────────────── */
export function HeroSection() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-7 bg-[#f0f0f0]">
      <section className="relative w-full max-w-[1760px] h-full rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col items-center group">

        {/* Background — Shader replaces video */}
        <div className="absolute inset-0 w-full h-full">
          <ShaderBackground variant="light" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 gap-6 pb-32">
          <HeroBadge />

          <motion.h1
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight max-w-3xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Merekrut tanpa<br />tebakan.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-700 text-base md:text-lg max-w-md leading-relaxed"
          >
            Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-gray-900 text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
            >
              Coba Simulasi
              <span className="bg-white rounded-full p-2">
                <IconArrowUpRight size={14} className="text-gray-900" />
              </span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Sudah punya akun →
            </Link>
          </motion.div>
        </div>

        {/* Bottom elements */}
        <BottomLeftCard />
        <BottomRightCorner />
      </section>
    </div>
  );
}
