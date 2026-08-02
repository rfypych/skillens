'use client';

import { Clock, Menu, X, ArrowRight, ShieldCheck, Cpu, Target, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-[#F26522] selection:text-white overflow-x-hidden">
      
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
                <a href="#problems" className="hover:text-gray-500 transition-colors duration-300">Tantangan Rekrutmen</a>
                <a href="#solutions" className="hover:text-gray-500 transition-colors duration-300">Solusi Platform</a>
                <a href="#cases" className="hover:text-gray-500 transition-colors duration-300">Studi Kasus</a>
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
                <a href="#problems" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Tantangan Rekrutmen</a>
                <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Solusi Platform</a>
                <a href="#cases" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-gray-900 px-2 py-1">Studi Kasus</a>
                
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
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/80 w-fit mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F26522] animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">Evaluasi Bakat Berbasis Telemetri AI</span>
          </div>

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
      {/* SECTION 2: THE UNSPOKEN RECRUITMENT REALITY (Masalah Yang Diselesaikan) */}
      {/* ========================================================================= */}
      <section id="problems" className="bg-white pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 overflow-hidden border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          {/* SECTION HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 rounded-full px-4 py-1.5">
              Realita Rekrutmen Modern
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 max-w-4xl mb-14">
            Ketika resume yang sempurna dan tes hafalan tradisional tak lagi menjamin kompetensi kandidat.
          </h2>

          {/* PROBLEM CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: Resume Inflation */}
            <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Inflasi Resume & Generatif AI
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kandidat kini mudah mempercantik CV menggunakan LLM. Kata kunci dipoles sempurna, tetapi gagap saat dihadapkan pada skenario pemecahan masalah teknis di dunia nyata.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-medium text-red-600">
                <AlertTriangle size={14} />
                <span>Resiko: Wrong Hire Cost yang Tinggi</span>
              </div>
            </div>

            {/* CARD 2: Multiple Choice Obsolescence */}
            <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Ujian Teori Pilihan Ganda Usang
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tes hafalan teori mudah dikerjakan otomatis oleh AI atau dihafal dari internet. Nilai tinggi pada tes kuis konvensional tidak mencerminkan daya tanggap kandidat di lapangan.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-medium text-amber-600">
                <AlertTriangle size={14} />
                <span>Resiko: Skor Tinggi, Eksekusi Rendah</span>
              </div>
            </div>

            {/* CARD 3: Naive Anti-Cheat Bypass */}
            <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F26522]/10 text-[#F26522] flex items-center justify-center mb-6">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Pengawasan Kaku yang Mudah Di-bypass
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sistem anti-cheat lama sekadar memblokir klik kanan atau copy-paste—yang menyulitkan kandidat jujur tetapi mudah diakali extension browser. Perlu arsitektur telemetri yang cerdas.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-medium text-[#F26522]">
                <AlertTriangle size={14} />
                <span>Resiko: False Sense of Security</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE SKILLENS PARADIGM SHIFT (Solusi & Pendekatan Kita) */}
      {/* ========================================================================= */}
      <section id="solutions" className="bg-[#F5F5F5] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-24">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          {/* SECTION HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-300 rounded-full px-4 py-1.5">
              Pendekatan Skillens
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 max-w-4xl mb-16">
            Beralih dari prasangka resume ke bukti otentik melalui 3 pilar teknologi evaluasi cerdas.
          </h2>

          {/* 3 PILLARS ARCHITECTURE */}
          <div className="space-y-8">
            
            {/* PILAR 1: Interactive Scenario Simulation */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest">Pilar 01 — Simulasi Studi Kasus</span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  Simulasi Studi Kasus Interaktif Berbasis Skenario
                </h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Kandidat ditempatkan dalam ruang kerja simulasi nyata. AI Evaluator bertindak sebagai mitra atau klien yang mengajukan problem bisnis kontekstual, mengukur daya analisis, pengambilan keputusan, dan adaptabilitas candidates secara instan.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Real-world Problem Solving</span>
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Scenario-based Branching</span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <img 
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85" 
                  alt="Skillens Interactive Scenario Simulation" 
                  className="rounded-2xl object-cover w-full h-[240px] border border-gray-100 shadow-xs"
                />
              </div>
            </div>

            {/* PILAR 2: Behavioral Telemetry & Defense in Depth */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <img 
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85" 
                  alt="Skillens Telemetry & Defense in Depth" 
                  className="rounded-2xl object-cover w-full h-[240px] border border-gray-100 shadow-xs"
                />
              </div>
              <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest">Pilar 02 — Telemetri Perilaku & Integrity Score</span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  Arsitektur Keamanan Berlapis (Defense in Depth)
                </h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Sistem memasang proteksi awal (Barrier) sekaligus **Telemetry Trap** di latar belakang. Kecepatan ketikan, rasio backspace, pemicu tab-switch, dan event copy-paste dipantau secara ilmiah tanpa mengganggu UX kandidat jujur.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Keystroke Dynamics</span>
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Time-to-Response Matrix</span>
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Adaptive Probing</span>
                </div>
              </div>
            </div>

            {/* PILAR 3: Post-Test HRD Prompt Recommendation */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest">Pilar 03 — Panduan Wawancara HRD</span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  Rekomendasi Pertanyaan Wawancara Otomatis
                </h3>
                <p className="text-gray-600 text-base leading-relaxed font-normal">
                  Berdasarkan audit trail dan telemetri simulasi kandidat, Skillens secara otomatis menghasilkan *custom interview questions* untuk interviewer. HRD bisa memverifikasi langsung bagian-bagian penting saat sesi wawancara tatap muka.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Tailored Interview Prompts</span>
                  <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">Empirical Audit Log</span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-[#0F172A] rounded-2xl p-6 text-white border border-gray-800 space-y-3 font-mono text-xs shadow-md">
                  <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-gray-800">
                    <span>INTERVIEWER PROMPT GENERATOR</span>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-[#FF6B2B] font-semibold">Q1: "Jelaskan alasan arsitektur di Turn 3 saat menghadapi penderasan trafik."</p>
                  <p className="text-gray-400 leading-relaxed font-sans text-xs">
                    Rekomendasi diverifikasi karena kandidat menunjukkan jeda respons 12 detik pada penanganan studi kasus skala besar.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CASE STUDIES & PROVEN RESULTS */}
      {/* ========================================================================= */}
      <section id="cases" className="bg-white pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
        <div className="max-w-[1440px] mx-auto">
          
          {/* BADGE ROW */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 rounded-full px-4 py-1.5">
              Demo Skenario Platform
            </span>
          </div>

          {/* HEADING H2 */}
          <div className="px-5 sm:px-8 lg:px-12">
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-14">
              Seperti Apa Platform Ini Bekerja
            </h2>
          </div>

          {/* CARDS GRID */}
          <div className="px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
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

                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[148px] bg-white rounded-full flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden shadow-md">
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 pl-1">
                    Lihat Demo
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-gray-900 transform group-hover:rotate-0 -rotate-45 transition-transform duration-300">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
                Demonstrasi alur rekruiter — mulai dari buat lowongan, buat soal studi kasus, hingga baca laporan telemetri kandidat.
              </p>
              <h3 className="text-[16px] font-semibold text-gray-900 mt-1">
                Demo: Sisi Rekruiter
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

                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[148px] bg-gray-900 rounded-full flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden shadow-md">
                  <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 pl-1">
                    Lihat Demo
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-white transform group-hover:rotate-0 -rotate-45 transition-transform duration-300">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
                Demonstrasi alur kandidat — menerima undangan tes, membaca instruksi, mengerjakan studi kasus, lalu mengirim jawaban.
              </p>
              <h3 className="text-[16px] font-semibold text-gray-900 mt-1">
                Demo: Sisi Kandidat
              </h3>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FOOTER (Clean Anti-Slop Design) */}
      {/* ========================================================================= */}
      <footer className="bg-gray-900 text-white pt-16 sm:pt-20 pb-12 px-6 sm:px-12 font-sans border-t border-gray-800">
        <div className="max-w-[1440px] mx-auto space-y-12">
          
          {/* TOP STATEMENT ROW */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-gray-800/60">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold text-[#F26522] uppercase tracking-widest">
                Skillens Studio
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-[1.12]">
                Merekrut bakat tepat,<br />
                <span className="text-[#F26522]">dengan kepastian mutlak.</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/signup">
                <TextRollButton text="Mulai Simulasi Sekarang" variant="orange" size="md" />
              </Link>
            </div>
          </div>

          {/* MAIN 4-COLUMN ARCHITECTURAL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            
            {/* BRAND COLUMN */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
              </Link>

              <p className="text-sm text-gray-400 font-normal leading-relaxed max-w-sm">
                Platform penilai kemampuan kandidat interaktif berbasis telemetri AI cerdas untuk mengeliminasi manipulasi resume.
              </p>
            </div>

            {/* COLUMN 2: SOLUSI */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Solusi</p>
              <ul className="space-y-2 text-sm font-normal text-gray-300">
                <li>
                  <a href="#solutions" className="hover:text-[#F26522] transition-colors inline-block">
                    Simulasi Studi Kasus
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-[#F26522] transition-colors inline-block">
                    Telemetri Perilaku AI
                  </a>
                </li>
                <li>
                  <a href="#problems" className="hover:text-[#F26522] transition-colors inline-block">
                    Deteksi Kecurangan
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: PLATFORM */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Platform</p>
              <ul className="space-y-2 text-sm font-normal text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-[#F26522] transition-colors inline-block">
                    Portal Rekruter
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#F26522] transition-colors inline-block">
                    Portal Kandidat
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-[#F26522] transition-colors inline-block">
                    Registrasi Akun Baru
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: LEGAL */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Legal</p>
              <ul className="space-y-2 text-sm font-normal text-gray-300">
                <li>
                  <a href="#" className="hover:text-[#F26522] transition-colors inline-block">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F26522] transition-colors inline-block">
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* SPONSOR LOGOS FOOTER BAR */}
          <div className="pt-6 border-t border-gray-800/80">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-60 hover:opacity-100 transition-opacity">
              <img src="/sponsors/jhic.png" alt="JHIC" className="h-5 w-auto grayscale object-contain" />
              <img src="/sponsors/jagoanhosting.png" alt="Jagoan Hosting" className="h-5 w-auto grayscale object-contain" />
              <img src="/sponsors/komdigi.png" alt="Komdigi" className="h-5 w-auto grayscale object-contain" />
              <img src="/sponsors/garudaspark.png" alt="Garuda Spark" className="h-5 w-auto grayscale object-contain" />
              <img src="/sponsors/ngalup.png" alt="Ngalup" className="h-5 w-auto grayscale object-contain" />
            </div>
          </div>

          {/* BOTTOM COPYRIGHT BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium pt-2">
            <p>© {new Date().getFullYear()} Skillens Inc. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-4 text-gray-400 font-normal">
              <span>Platform Penilai Bakat AI Interaktif</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
