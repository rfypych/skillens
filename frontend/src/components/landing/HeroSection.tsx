'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  ArrowUpRight,
  Users,
  ChevronRight,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';
import { useState, useEffect } from 'react';

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
    <nav className="relative z-20 w-full flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img src="/skillens-logo-text.png" alt="Skillens" className="h-7 sm:h-9 w-auto object-contain" />
      </Link>

      {/* Desktop center links */}
      <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        <a href="#about" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Solusi</a>
        <a href="#metrics" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-1">
          Kapabilitas <ChevronRight size={14} className="opacity-50" />
        </a>
        <a href="#features" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Skenario</a>
        <Link href="/recruiter" className="text-gray-800 text-sm font-medium hover:text-gray-900 transition-colors">Rekruiter</Link>
      </div>

      {/* Desktop right: clock + CTA */}
      <div className="hidden sm:flex items-center gap-4">
        <span className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
          <Clock size={13} />{timeString || '08:00'} WIB
        </span>
        <Link href="/signup">
          <TextRollButton text="Mulai Gratis" variant="dark" size="sm" />
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center focus:outline-none"
        aria-label="Toggle menu"
      >
        {open ? <X size={17} /> : <Menu size={17} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute top-full left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl z-50 flex flex-col gap-3.5 border border-gray-200/80">
          <a href="#about" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1 border-b border-gray-100">Solusi</a>
          <a href="#metrics" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1 border-b border-gray-100">Kapabilitas</a>
          <a href="#features" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1 border-b border-gray-100">Skenario</a>
          <Link href="/recruiter" onClick={() => setOpen(false)} className="text-base font-medium text-gray-900 py-1 border-b border-gray-100">Rekruiter</Link>
          <div className="flex items-center justify-between pt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Clock size={12} />{timeString || '08:00'} WIB
            </span>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <TextRollButton text="Mulai Gratis" variant="orange" size="sm" />
            </Link>
          </div>
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
      className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/30 shadow-xs"
    >
      <Sparkles size={14} className="text-[#F26522]" />
      <span className="text-xs sm:text-[13px] font-medium text-gray-800">Evaluasi Presisi</span>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   BOTTOM-LEFT GLASS CARD (hidden on mobile to prevent overlap)
──────────────────────────────────────── */
function BottomLeftCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="hidden md:block absolute bottom-6 left-6 lg:left-8 z-20 bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <Users size={14} className="text-gray-700" />
        <span className="text-xs sm:text-sm font-semibold text-gray-900">1,200+ Evaluasi Selesai</span>
      </div>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#F26522] hover:text-white transition-colors duration-200"
      >
        Coba Gratis
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   BOTTOM-RIGHT CUT-OUT CORNER (hidden on small mobile screens)
──────────────────────────────────────── */
function BottomRightCorner() {
  return (
    <div className="hidden sm:block absolute bottom-0 right-0 z-20">
      <div
        className="relative bg-[#EFEFEF] p-4 sm:p-5 pt-6 pl-10 sm:pl-12 rounded-tl-[2.5rem] sm:rounded-tl-[3.5rem]"
        style={{ minWidth: '12rem' }}
      >
        {/* SVG inverted corner — top edge */}
        <svg
          className="absolute top-0 right-0 h-10 sm:h-14"
          style={{ top: 0, left: 'calc(2.5rem - 0.5px)', width: '2.5rem', transform: 'translateX(-100%)' }}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#EFEFEF" />
        </svg>
        {/* SVG inverted corner — left edge */}
        <svg
          className="absolute left-0"
          style={{ bottom: 'calc(2.5rem - 0.5px)', top: 'auto', height: '2.5rem', width: '2.5rem', transform: 'translateY(100%)' }}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#EFEFEF" />
        </svg>

        {/* Content */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ArrowUpRight size={13} className="text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest leading-snug">Dokumentasi</p>
            <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest leading-snug">/ Panduan</p>
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
    <div className="w-full min-h-[90vh] md:h-screen flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-[#EFEFEF]">
      <section className="relative w-full max-w-[1720px] h-full min-h-[580px] md:min-h-[680px] rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col items-center group">

        {/* Background — Shader replaces video */}
        <div className="absolute inset-0 w-full h-full">
          <ShaderBackground variant="light" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-4 sm:px-8 gap-5 sm:gap-6 py-12 md:pb-28">
          <HeroBadge />

          <motion.h1
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-900 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] sm:leading-tight max-w-3xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Merekrut tanpa<br />tebakan.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-700 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
          >
            Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-3 bg-gray-900 text-white text-sm sm:text-base font-medium pl-6 sm:pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200 w-full sm:w-auto"
            >
              Coba Simulasi
              <span className="bg-white rounded-full p-2">
                <ArrowUpRight className="w-4 h-4 text-gray-900" />
              </span>
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
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
