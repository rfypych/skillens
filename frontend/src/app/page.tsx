'use client';

import { Clock, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-[#F26522] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (Full viewport height) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#EFEFEF]">
        
        {/* Animated Shader Overlay */}
        <ShaderBackground />

        {/* --- NAVIGATION (z-20, relative) --- */}
        <header className="relative z-20 w-full max-w-[1440px] mx-auto p-3 sm:p-4 md:p-6">
          <nav className="bg-white rounded-full p-1.5 sm:p-2 shadow-sm border border-gray-200/60 flex items-center justify-between">
            
            {/* LEFT */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] sm:text-[11px] font-bold tracking-tight group-hover:bg-[#F26522] transition-colors duration-300">
                  SK
                </div>
                <span className="font-bold text-gray-900 text-lg tracking-tight">Skillens</span>
              </Link>

              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-900">
                <a href="#about" className="hover:text-gray-500 transition-colors duration-300">Platform</a>
                <a href="#cases" className="hover:text-gray-500 transition-colors duration-300">Studi Kasus</a>
                <Link href="/login" className="hover:text-gray-500 transition-colors duration-300">Masuk</Link>
                <Link href="/signup" className="hover:text-gray-500 transition-colors duration-300">Daftar</Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <span className="text-[13px] text-gray-600 hidden lg:inline font-medium">
                Menerima evaluasi kandidat Q1 2026
              </span>

              <div className="flex items-center gap-1.5 text-[13px] text-gray-600 font-medium">
                <Clock size={14} className="text-gray-500" />
                <span>{timeString || '14:30'} di Jakarta</span>
              </div>

              <Link href="/login">
                <TextRollButton
                  text="Jadwalkan Demo"
                  variant="dark"
                  size="sm"
                />
              </Link>
            </div>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </header>

        {/* MOBILE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl mx-3 mb-3 p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Clock size={14} />
                  <span>{timeString} di Jakarta</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-2xl font-medium text-gray-900 mb-8">
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>Platform</a>
                <a href="#cases" onClick={() => setMobileMenuOpen(false)}>Studi Kasus</a>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
              </div>

              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <TextRollButton
                  text="Mulai Evaluasi"
                  variant="orange"
                  size="lg"
                  className="w-full justify-between"
                />
              </Link>
            </div>
          </div>
        )}

        {/* HERO CONTENT (z-20) */}
        <div className="relative z-20 flex-1 flex flex-col justify-end w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          
          <p className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 font-medium uppercase">
            Skillens AI Studio
          </p>

          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-5xl">
            Kami membangun evaluasi bakat
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            berbasis bukti nyata untuk perusahaan
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            yang siap merekrut secara tepat.
          </h1>

          {/* CTA ROW */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <Link href="/signup">
              <TextRollButton
                text="Coba Simulasi Sekarang"
                variant="orange"
                size="lg"
              />
            </Link>

            {/* PARTNER BADGE */}
            <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-[4px] px-3.5 py-2.5 flex items-center gap-3 transition-shadow cursor-pointer group border border-gray-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E] flex-shrink-0" viewBox="0 0 100 100">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
              </svg>
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">Certified Partner</span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-2 py-0.5 rounded font-semibold tracking-wide">
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ABOUT (White background) */}
      {/* ========================================================================= */}
      <section id="about" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          
          {/* BADGE ROW */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              Mengenal Skillens
            </span>
          </div>

          {/* HEADING H2 */}
          <div className="px-5 sm:px-8 lg:px-12">
            <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28 max-w-5xl">
              Evaluasi berbasis simulasi cerdas, memberikan
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              hasil otentik di dunia perekrutan digital.
            </h2>
          </div>

          {/* CONTENT AREA */}
          <div className="px-5 sm:px-8 lg:px-12">
            
            {/* MOBILE / TABLET (lg:hidden) */}
            <div className="flex flex-col gap-8 lg:hidden">
              <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 max-w-xl">
                Melalui studi kasus nyata, evaluasi interaktif, dan telemetri otomatis, kami membantu perusahaan menemukan talenta terbaik tanpa risiko manipulasi resume.
              </p>
              <Link href="/signup" className="self-start">
                <TextRollButton text="Tentang Platform" variant="orange" size="md" />
              </Link>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-4">
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                  alt="Skillens Interface Preview 1"
                  className="sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover"
                />
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                  alt="Skillens Interface Preview 2"
                  className="sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover"
                />
              </div>
            </div>

            {/* DESKTOP (hidden lg:grid) */}
            <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
              {/* Left column */}
              <div className="self-end">
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                  alt="Skillens Studio 1"
                  className="w-full aspect-[438/346] rounded-2xl object-cover"
                />
              </div>

              {/* Center column */}
              <div className="self-start flex flex-col items-end justify-between h-full py-2">
                <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-normal xl:whitespace-nowrap">
                  Melalui studi kasus nyata,<br />
                  evaluasi interaktif, dan telemetri<br />
                  otomatis, kami membantu perusahaan<br />
                  menemukan talenta terbaik tanpa<br />
                  risiko manipulasi resume.
                </p>

                <div className="mt-8 self-start">
                  <Link href="/signup">
                    <TextRollButton text="Tentang Platform" variant="orange" size="md" />
                  </Link>
                </div>
              </div>

              {/* Right column */}
              <div className="self-end">
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                  alt="Skillens Studio 2"
                  className="w-full aspect-[3/2] rounded-2xl object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CASE STUDIES (Light gray background) */}
      {/* ========================================================================= */}
      <section id="cases" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          
          {/* BADGE ROW */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              2
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
              Studi Kasus & Proyek
            </span>
          </div>

          {/* HEADING H2 */}
          <div className="px-5 sm:px-8 lg:px-12">
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
              Hasil Evaluasi Kami
            </h2>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
            
            {/* CARD 1 (Narrativ) */}
            <div className="flex flex-col">
              <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] group cursor-pointer">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Hover Button */}
                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[148px] bg-white rounded-full flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden shadow-md">
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 pl-1">
                    Pelajari
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-gray-900 transform group-hover:rotate-0 -rotate-45 transition-transform duration-300">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
                Pemenang Platform Perekrutan Terbaik 2025 - simulasi interaktif mendeteksi 99% klaim palsu.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
                Narrativ AI Assessment
              </h3>
            </div>

            {/* CARD 2 (Luminar) */}
            <div className="flex flex-col">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] group cursor-pointer">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Hover Button */}
                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[168px] bg-gray-900 rounded-full flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden shadow-md">
                  <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 pl-1">
                    Lihat Studi Kasus
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-white transform group-hover:rotate-0 -rotate-45 transition-transform duration-300">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
                Mengubah alur saringan kandidat manual menjadi pengalaman evaluasi otomatis tanpa hambatan.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
                Luminar Talent Hub
              </h3>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-gray-900 text-white py-12 px-6 sm:px-12 border-t border-gray-800">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center text-[10px] font-bold">
              SK
            </div>
            <span className="font-bold text-lg text-white">Skillens</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} Skillens Inc. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

    </div>
  );
}
