'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { MetricsSection } from '@/components/landing/MetricsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-[#f0f0f0]">

        {/* 1. Hero — full-screen centered rounded card with shader + bottom elements */}
        <HeroSection />

        {/* 2. Metrics — 2×4 grid with Skillens platform numbers */}
        <MetricsSection />

        {/* 3. Features — 3-col × 2-row white card grid */}
        <FeaturesSection />

        {/* 4. CTA — dark centered rounded card */}
        <CTASection />

        {/* 5. Footer */}
        <footer className="w-full max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16 border-t border-gray-200/60 mt-5">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">

            {/* Left: Logo + tagline */}
            <div className="max-w-xs">
              <Link href="/">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain mb-4" />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                Platform evaluasi kandidat berbasis AI. Merekrut berdasarkan kemampuan nyata, bukan asumsi.
              </p>
            </div>

            {/* Right: 3-col link grid */}
            <div className="grid grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-4">Protocol</p>
                <ul className="space-y-3">
                  {['Solusi', 'Skenario', 'Kapabilitas', 'Harga'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-4">Developers</p>
                <ul className="space-y-3">
                  {['Dokumentasi', 'API', 'SDK', 'Status'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-4">Community</p>
                <ul className="space-y-3">
                  {['Discord', 'GitHub', 'Blog', 'Tentang'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} Skillens. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-gray-700 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Syarat Penggunaan</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Keamanan</a>
            </div>
          </div>
        </footer>

      </main>
    </SmoothScrollProvider>
  );
}
