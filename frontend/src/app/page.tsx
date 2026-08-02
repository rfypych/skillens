'use client';

import { Clock, Menu, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ShaderBackground from '@/components/ShaderBackground';
import TextRollButton from '@/components/TextRollButton';
import { AboutSection } from '@/components/landing/AboutSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { ProjectsSection } from '@/components/landing/ProjectsSection';

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
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-[#F26522] selection:text-white overflow-x-clip">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (Full viewport height - Light Gray #EFEFEF) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-screen min-h-[750px] flex flex-col justify-between overflow-hidden bg-[#EFEFEF] text-gray-900">
        
        {/* Animated Shader Overlay */}
        <ShaderBackground variant="light" />

        {/* --- NAVIGATION --- */}
        <header className="relative z-20 w-full max-w-[1440px] mx-auto p-3 sm:p-4 md:p-6">
          <nav className="bg-white rounded-full p-1.5 sm:p-2 shadow-sm border border-gray-200/60 flex items-center justify-between">
            
            {/* LEFT */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group pl-2">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 sm:h-9 w-auto object-contain" />
              </Link>

              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-900">
                <a href="#about" className="hover:text-gray-500 transition-colors duration-300">Solusi Kami</a>
                <a href="#capabilities" className="hover:text-gray-500 transition-colors duration-300">Kapabilitas</a>
                <a href="#scenarios" className="hover:text-gray-500 transition-colors duration-300">Skenario</a>
                <Link href="/login" className="hover:text-gray-500 transition-colors duration-300">Masuk</Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 pr-1">
              <div className="flex items-center gap-1.5 text-[13px] text-gray-600 font-medium">
                <Clock size={14} className="text-gray-500" />
                <span>{timeString || '14:30'} di Jakarta</span>
              </div>

              <Link href="/signup">
                <TextRollButton
                  text="Mulai Evaluasi"
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

              <div className="flex flex-col gap-3.5 mb-6">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Solusi Kami</a>
                <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Kapabilitas</a>
                <a href="#scenarios" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Skenario</a>
                
                <div className="bg-[#F5F5F5] rounded-full p-1 pl-4 pr-1 border border-gray-200/80 flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-gray-600">Belum punya akun?</span>
                  <Link 
                    href="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-white bg-gray-900 hover:bg-[#F26522] px-4 py-1.5 rounded-full transition-colors shadow-xs"
                  >
                    Daftar
                  </Link>
                </div>
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

        {/* HERO CONTENT */}
        <div className="relative z-20 flex-1 flex flex-col justify-end w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          
          <h1 className="text-[clamp(1.85rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-5xl">
            Merekrut tanpa tebakan.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Evaluasi keahlian nyata kandidat
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            lewat simulasi studi kasus interaktif.
          </h1>

          {/* CTA ROW */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <Link href="/signup">
              <TextRollButton
                text="Coba Simulasi Sekarang"
                variant="orange"
                size="lg"
              />
            </Link>

            {/* PARTNER BADGE */}
            <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-[4px] px-3.5 py-2.5 flex items-center gap-3 transition-shadow cursor-pointer group border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-[#F26522]" />
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">Anti-AI Cheat Telemetry</span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-2 py-0.5 rounded font-semibold tracking-wide">
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ABOUT / MISSION (3D Corner Assets & Scroll Animated Text) */}
      {/* ========================================================================= */}
      <div id="about">
        <AboutSection />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: SERVICES / CAPABILITIES (White BG, 01..05 Large Numbers) */}
      {/* ========================================================================= */}
      <div id="capabilities">
        <ServicesSection />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: PROJECTS / SCENARIOS (Sticky Stacking Cards Effect) */}
      {/* ========================================================================= */}
      <div id="scenarios">
        <ProjectsSection />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-gray-900 text-white px-6 sm:px-12 pt-20 pb-10 relative z-40 border-t border-gray-800">
        <div className="max-w-[1440px] mx-auto">

          {/* STATEMENT — Ft5: closes the page with intent */}
          <div className="border-b border-gray-800 pb-16 mb-10">
            <h2 className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-[-0.04em] text-white leading-[1.02] max-w-4xl">
              Rekrut berdasarkan bukti,<br />
              bukan asumsi.
            </h2>
            <div className="mt-8">
              <Link href="/signup">
                <TextRollButton text="Mulai Gratis" variant="orange" size="lg" />
              </Link>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* BRAND */}
            <Link href="/" className="inline-flex items-center">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto brightness-0 invert object-contain" />
            </Link>

            {/* SPONSOR LOGOS */}
            <div className="flex flex-wrap items-center gap-5 opacity-40">
              <img src="/sponsors/jhic.png" alt="JHIC" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/jagoanhosting.png" alt="Jagoan Hosting" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/komdigi.png" alt="Komdigi" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/garudaspark.png" alt="Garuda Spark" className="h-4 w-auto grayscale object-contain" />
              <img src="/sponsors/ngalup.png" alt="Ngalup" className="h-4 w-auto grayscale object-contain" />
            </div>

            {/* MINIMAL LINKS */}
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
