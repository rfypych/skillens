'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';
import { InfoSection } from '@/components/landing/InfoSection';
import { BackedBySection } from '@/components/landing/BackedBySection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';

// Hero marquee — Skillens capability terms in varied typography
const HERO_TERMS = [
  { text: 'Studi Kasus', style: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '15px' } },
  { text: 'Telemetri AI', style: { fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: '0.08em', fontSize: '13px', textTransform: 'uppercase' as const } },
  { text: 'Anti-Cheat', style: { fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: '0.12em', fontSize: '13px', textTransform: 'uppercase' as const } },
  { text: 'Probing Dinamis', style: { fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 600, letterSpacing: '0.01em', fontSize: '15px', fontStyle: 'italic' as const } },
  { text: 'Laporan Presisi', style: { fontFamily: "'Palatino Linotype', Palatino, serif", fontWeight: 400, letterSpacing: '-0.01em', fontSize: '16px' } },
  { text: 'Simulasi Nyata', style: { fontFamily: "Impact, 'Arial Narrow', sans-serif", fontWeight: 400, letterSpacing: '0.04em', fontSize: '14px' } },
  { text: 'Deteksi Cepat', style: { fontFamily: 'Verdana, sans-serif', fontWeight: 700, letterSpacing: '-0.03em', fontSize: '13px' } },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-[#EFEFEF] font-sans selection:bg-[#F26522] selection:text-white overflow-x-clip">

      {/* ================================================================ */}
      {/* SCREEN 1 — Navbar (absolute) + Hero Card                         */}
      {/* ================================================================ */}
      <div className="h-screen flex flex-col overflow-hidden relative">

        {/* NAVBAR — absolute, floats over hero */}
        <header className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-4 sm:py-5">
          <nav className="bg-white/85 backdrop-blur-md rounded-full px-2 py-1.5 shadow-sm border border-gray-200/60 flex items-center justify-between max-w-[88rem] mx-auto">

            {/* LEFT: Logo + Links */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center pl-2">
                <img
                  src="/skillens-logo-text.png"
                  alt="Skillens"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#about" className="hover:text-gray-900 transition-colors duration-200">Solusi</a>
                <a href="#scenarios" className="hover:text-gray-900 transition-colors duration-200">Skenario</a>
                <Link href="/login" className="hover:text-gray-900 transition-colors duration-200">Masuk</Link>
              </div>
            </div>

            {/* RIGHT: Clock + CTA */}
            <div className="hidden md:flex items-center gap-4 pr-1">
              <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
                <Clock size={13} />
                <span>{timeString || '08:00'} WIB</span>
              </div>
              <Link href="/signup">
                <TextRollButton text="Mulai Evaluasi" variant="dark" size="sm" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center mr-1 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </header>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl mx-3 mb-3 p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={13} />{timeString} WIB
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-3.5 mb-6">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Solusi</a>
                <a href="#scenarios" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Skenario</a>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Masuk</Link>
              </div>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <TextRollButton text="Mulai Evaluasi" variant="orange" size="lg" className="w-full justify-between" />
              </Link>
            </div>
          </div>
        )}

        {/* HERO CARD WRAPPER */}
        <div className="flex-1 px-3 sm:px-5 pt-4 pb-4 sm:pb-5">
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            {/* Shader replaces video */}
            <ShaderBackground variant="light" />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-8 sm:p-12 pt-24 sm:pt-36">

              <h1
                className="text-gray-900 text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[1.04] max-w-xl mb-4"
                style={{ letterSpacing: '-0.04em' }}
              >
                Merekrut tanpa<br />tebakan.
              </h1>

              <p className="text-gray-700 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-3 bg-gray-900 text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
                >
                  Coba Simulasi Sekarang
                  <span className="bg-white rounded-full p-2">
                    <ArrowRight className="w-5 h-5 text-gray-900" />
                  </span>
                </Link>

                <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm px-3.5 py-2 rounded-full border border-gray-200/60 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#F26522]" />
                  <span className="text-[13px] font-medium text-gray-800">Anti-AI Telemetry</span>
                  <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
                    ISO 27001
                  </span>
                </div>
              </div>

              {/* HERO MARQUEE */}
              <div className="mt-14 sm:mt-20 w-full max-w-lg overflow-hidden">
                <style>{`
                  @keyframes hero-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .hero-marquee-track {
                    display: flex;
                    width: max-content;
                    animation: hero-scroll 22s linear infinite;
                  }
                `}</style>
                <div className="hero-marquee-track">
                  {[...HERO_TERMS, ...HERO_TERMS].map((item, i) => (
                    <span
                      key={i}
                      className="mx-7 shrink-0 text-gray-500 whitespace-nowrap"
                      style={item.style}
                    >
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECTION 2 — Info / Features                                      */}
      {/* ================================================================ */}
      <InfoSection />

      {/* ================================================================ */}
      {/* SECTION 3 — Backed By (sponsor marquee)                          */}
      {/* ================================================================ */}
      <BackedBySection />

      {/* ================================================================ */}
      {/* SECTION 4 — Use Cases / Scenarios                                */}
      {/* ================================================================ */}
      <UseCasesSection />

      {/* ================================================================ */}
      {/* FOOTER — Ft5 Statement close                                      */}
      {/* ================================================================ */}
      <footer className="bg-gray-900 text-white px-6 sm:px-12 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-[88rem] mx-auto">

          {/* Statement */}
          <div className="border-b border-gray-800 pb-16 mb-10">
            <h2
              className="text-white font-semibold leading-[1.02] max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}
            >
              Rekrut berdasarkan bukti,<br />bukan asumsi.
            </h2>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 bg-[#F26522] text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
              >
                Mulai Gratis
                <span className="bg-white rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link href="/">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto brightness-0 invert object-contain" />
            </Link>
            <div className="flex flex-wrap items-center gap-5 opacity-30">
              <img src="/sponsors/jhic.png" alt="JHIC" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/jagoanhosting.png" alt="Jagoan Hosting" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/komdigi.png" alt="Komdigi" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/garudaspark.png" alt="Garuda Spark" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/ngalup.png" alt="Ngalup" className="h-4 w-auto grayscale object-contain" />
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/login" className="hover:text-gray-300 transition-colors">Masuk</Link>
              <Link href="/signup" className="hover:text-gray-300 transition-colors">Daftar</Link>
              <span>© {new Date().getFullYear()} Skillens</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
