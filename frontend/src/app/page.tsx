'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { MetricsSection } from '@/components/landing/MetricsSection';
import { InfoSection } from '@/components/landing/InfoSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-[#f0f0f0]">

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Solusi (InfoSection) */}
        <InfoSection />

        {/* 3. Skenario (UseCasesSection) */}
        <UseCasesSection />

        {/* 4. Metrics */}
        <MetricsSection />

        {/* 5. Features */}
        <FeaturesSection />

        {/* 6. CTA */}
        <CTASection />

        {/* 7. Footer */}
        <footer className="w-full max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16 border-t border-brand-gray-light mt-5">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">

            {/* Left: Logo + tagline */}
            <div className="max-w-xs">
              <Link href="/">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain mb-4" />
              </Link>
              <p className="text-sm text-brand-gray-dark leading-relaxed">
                Platform evaluasi kandidat berbasis AI. Merekrut berdasarkan kemampuan nyata, bukan asumsi.
              </p>
            </div>

            {/* Right: 3-col link grid */}
            <div className="grid grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark font-medium mb-4">Platform</p>
                <ul className="space-y-3">
                  {['Solusi', 'Skenario', 'Kapabilitas', 'Harga'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-brand-gray-dark hover:text-brand-dark transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark font-medium mb-4">Pengembang</p>
                <ul className="space-y-3">
                  {['Dokumentasi', 'API', 'SDK', 'Status'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-brand-gray-dark hover:text-brand-dark transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark font-medium mb-4">Komunitas</p>
                <ul className="space-y-3">
                  {['Discord', 'GitHub', 'Blog', 'Tentang'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-brand-gray-dark hover:text-brand-dark transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-brand-gray-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-brand-gray-dark">
            <span>© {new Date().getFullYear()} Skillens. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-brand-dark transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-brand-dark transition-colors">Syarat Penggunaan</a>
              <a href="#" className="hover:text-brand-dark transition-colors">Keamanan</a>
            </div>
          </div>
        </footer>

      </main>
    </SmoothScrollProvider>
  );
}
