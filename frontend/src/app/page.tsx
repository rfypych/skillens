'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Menu, X } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import { InfoSection } from '@/components/landing/InfoSection';
import { BackedBySection } from '@/components/landing/BackedBySection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';

// Hero marquee — Skillens capability terms in varied typography (exact reference pattern)
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="flex flex-col bg-[#EFEFEF] selection:bg-[#F26522] selection:text-white overflow-x-clip"
      style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', ui-sans-serif, system-ui, sans-serif" }}
    >

      {/* ================================================================ */}
      {/* SCREEN 1 — h-screen wrapper: Navbar (absolute) + Hero Card       */}
      {/* ================================================================ */}
      <div className="h-screen flex flex-col overflow-hidden">

        {/* ── NAVBAR ── absolute, transparent, exact reference layout */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="flex items-center justify-between max-w-[88rem] mx-auto">

            {/* LEFT: Logo + wordmark */}
            <Link href="/" className="flex items-center gap-3 text-2xl font-medium tracking-tight text-gray-900">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain" />
            </Link>

            {/* CENTER: Nav links — hidden below md */}
            <div className="hidden md:flex items-center gap-8 text-base text-gray-700 font-medium">
              <a href="#about" className="hover:text-gray-900 transition-colors duration-200">Solusi</a>
              <a href="#scenarios" className="hover:text-gray-900 transition-colors duration-200">Skenario</a>
              <Link href="/recruiter" className="hover:text-gray-900 transition-colors duration-200">Rekruiter</Link>
              <Link href="/login" className="hover:text-gray-900 transition-colors duration-200">Masuk</Link>
            </div>

            {/* RIGHT: CTA pill — reference style: bg-black text-white rounded-full */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/signup"
                className="bg-gray-900 text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-[#F26522] transition-colors duration-200"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile overlay menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm">
            <div className="bg-[#EFEFEF] rounded-t-3xl mx-0 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300/60">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-7 w-auto object-contain" />
                <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                {['Solusi', 'Skenario', 'Rekruiter', 'Masuk'].map((item) => (
                  <a
                    key={item}
                    href={item === 'Solusi' ? '#about' : item === 'Skenario' ? '#scenarios' : item === 'Masuk' ? '/login' : '/recruiter'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-medium tracking-tight text-gray-900"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {item}
                  </a>
                ))}
              </div>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-gray-900 text-white text-base font-medium px-7 py-3.5 rounded-full hover:bg-[#F26522] transition-colors duration-200"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>
        )}

        {/* ── HERO CARD ── flex-1 with padded card, content items-start justify-start */}
        <div className="flex-1 px-6 pt-20 pb-6 flex items-end">
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ height: 'calc(100vh - 96px)' }}
          >
            {/* Shader background — replaces the reference video */}
            <ShaderBackground variant="light" />

            {/* Content overlay: items-start justify-start h-full p-12 pt-36 */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36">

              <h1
                className="text-gray-900 text-5xl md:text-6xl font-medium leading-tight max-w-xl mb-4"
                style={{ letterSpacing: '-0.04em' }}
              >
                Merekrut tanpa<br />tebakan.
              </h1>

              <p
                className="text-gray-900/70 text-base md:text-lg max-w-md mb-8 leading-relaxed"
                style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
              >
                Evaluasi keahlian nyata kandidat lewat simulasi studi kasus interaktif yang tidak bisa diakali AI.
              </p>

              {/* CTA — pill + trailing arrow circle (exact reference pattern) */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-3 bg-gray-900 text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#F26522] transition-colors duration-200"
                >
                  Coba Simulasi
                  <span className="bg-white rounded-full p-2">
                    <ArrowRight className="w-5 h-5 text-gray-900" />
                  </span>
                </Link>

                {/* Trust badge */}
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                  <ShieldCheck className="w-4 h-4 text-[#F26522]" />
                  <span className="text-[13px] font-medium text-gray-800">Anti-AI Telemetry</span>
                  <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">ISO 27001</span>
                </div>
              </div>

              {/* Brand marquee — mt-24 below CTA (reference exact) */}
              <div className="mt-24 w-full max-w-md overflow-hidden">
                <style>{`
                  @keyframes hero-scroll {
                    0%   { transform: translateX(0); }
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
                      className="mx-7 shrink-0 text-gray-900/60 whitespace-nowrap"
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
      {/* SECTION 2 — Info ("Meet Skillens") — ref: InfoSection            */}
      {/* ================================================================ */}
      <InfoSection />

      {/* ================================================================ */}
      {/* SECTION 3 — Backed By — ref: 4-col marquee                       */}
      {/* ================================================================ */}
      <BackedBySection />

      {/* ================================================================ */}
      {/* SECTION 4 — Use Cases — ref: 2-col left+right tall card          */}
      {/* ================================================================ */}
      <UseCasesSection />

      {/* ================================================================ */}
      {/* FOOTER — Ft5 statement close                                     */}
      {/* ================================================================ */}
      <footer className="bg-gray-900 text-white px-6 pt-24 pb-12">
        <div className="max-w-[88rem] mx-auto">
          <div className="border-b border-white/10 pb-16 mb-12">
            <h2
              className="text-white font-medium leading-[1.02] max-w-4xl"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}
            >
              Rekrut berdasarkan<br />bukti, bukan asumsi.
            </h2>
            <div className="mt-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 bg-[#F26522] text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
              >
                Mulai Gratis
                <span className="bg-white rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <Link href="/">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto brightness-0 invert object-contain" />
            </Link>
            <div className="flex flex-wrap items-center gap-6 opacity-25">
              {['jhic', 'jagoanhosting', 'komdigi', 'garudaspark', 'ngalup'].map((s) => (
                <img key={s} src={`/sponsors/${s}.png`} alt={s} className="h-4 w-auto grayscale object-contain" />
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
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
