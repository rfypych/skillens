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
   HERO BADGE
──────────────────────────────────────── */
function HeroBadge() {
  const [stageIdx, setStageIdx] = useState(0);

  const STAGES = [
    { text: 'analyzing...', cssClass: 'ascii-anim-rain', color: 'text-[#F26522]' },
    { text: 'evaluating...', cssClass: 'ascii-anim-wave', color: 'text-[#F26522]' },
    { text: 'synthesizing...', cssClass: 'ascii-anim-fill', color: 'text-[#F26522]' },
    { text: 'verified.', cssClass: 'ascii-anim-done', color: 'text-emerald-600' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIdx((prev) => (prev + 1) % STAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const current = STAGES[stageIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="inline-flex items-center justify-center gap-3 px-5 h-[38px] w-[240px] rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-sm font-mono text-xs select-none whitespace-nowrap overflow-hidden mb-4 sm:mb-6"
    >
      <span className={`${current.cssClass} ${current.color} font-bold flex-shrink-0`} />
      <span className="text-gray-900 font-medium tracking-wide w-[110px] text-left truncate flex-shrink-0">
        {current.text}
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   HERO SECTION (main export)
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

        {/* ── Heading (centered) ── */}
        <div className="relative z-30 flex flex-col items-center text-center px-5 mt-[3vh] sm:mt-[5vh] md:mt-[6vh]">
          <HeroBadge />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-900 leading-[0.95]"
          >
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem]"
              style={{ letterSpacing: '-0.05em' }}
            >
              Merekrut tanpa
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] -mt-1 sm:-mt-3 md:-mt-5"
              style={{ letterSpacing: '-0.08em' }}
            >
              tebakan.
            </span>
          </motion.h1>
        </div>

        {/* ── Bottom-Left Paragraph Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden sm:block absolute bottom-10 sm:bottom-14 left-8 md:left-14 max-w-[260px] z-30"
        >
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Every layer of assessment records a candidate&apos;s true capability, from problem-solving depth to decision reasoning.
          </p>
        </motion.div>

        {/* ── Bottom-Right Action Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="absolute bottom-8 sm:bottom-12 right-6 md:right-14 max-w-full sm:max-w-[280px] flex flex-col items-start sm:items-end gap-3 sm:gap-4 z-30"
        >
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-left sm:text-right">
            Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
          </p>
          <Link
            href="/signup"
            className="bg-[#F26522] hover:bg-[#d85415] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#F26522]/20 inline-flex items-center gap-2"
          >
            Mulai Simulasi
            <IconArrowUpRight size={14} />
          </Link>
        </motion.div>

      </section>
    </div>
  );
}
