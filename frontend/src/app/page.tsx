'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { PreviewSection } from '@/components/landing/PreviewSection';
import { LogoCloudSection } from '@/components/landing/LogoCloudSection';
import { SolusiSection } from '@/components/landing/SolusiSection';
import { MetricsSection } from '@/components/landing/MetricsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SpotlightSection } from '@/components/landing/SpotlightSection';
import { PortalsSection } from '@/components/landing/PortalsSection';
import { DemoAccessSection } from '@/components/landing/DemoAccessSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CTASection } from '@/components/landing/CTASection';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-[#f0f0f0]">

        {/* 1. Hero */}
        <HeroSection />

        {/* Bawah hero: tanah putih persis bahasa aplikasi BoardUI */}
        <div className="bg-background-full">
        {/* 2. Pratinjau produk ala BoardUI */}
        <PreviewSection />

        {/* 3. Logo cloud */}
        <LogoCloudSection />

        {/* 4. Solusi Section */}
        <SolusiSection />

        {/* 5. Metrics Section */}
        <MetricsSection />

        {/* 6. Features Section */}
        <FeaturesSection />

        {/* 7. Sorotan telemetri */}
        <SpotlightSection />

        {/* 8. Portal siap pakai */}
        <PortalsSection />

        {/* 9. Akses demo */}
        <DemoAccessSection />

        {/* 10. FAQ */}
        <FaqSection />
        </div>

        {/* 8. CTA Section */}
        <CTASection />

        {/* 9. Footer */}
        <div className="bg-background-full">
        <footer className="w-full max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16 border-t border-separator-border font-boardui">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">

            {/* Left: Logo + tagline */}
            <div className="max-w-xs">
              <Link href="/">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain mb-4" />
              </Link>
              <p className="text-body-regular leading-relaxed text-text-secondary">
                Platform evaluasi kandidat berbasis AI. Merekrut berdasarkan kemampuan nyata, bukan asumsi.
              </p>
            </div>

            {/* Right: 3-col link grid */}
            <div className="grid grid-cols-3 gap-8 text-body-regular">
              <div>
                <p className="text-caption-1-semibold text-text-tertiary mb-4">Protocol</p>
                <ul className="space-y-3">
                  {['Solusi', 'Kapabilitas', 'Harga'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-text-tertiary outline-none transition-colors duration-200 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-caption-1-semibold text-text-tertiary mb-4">Developers</p>
                <ul className="space-y-3">
                  {['Dokumentasi', 'API', 'SDK', 'Status'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-text-tertiary outline-none transition-colors duration-200 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-caption-1-semibold text-text-tertiary mb-4">Community</p>
                <ul className="space-y-3">
                  {['Discord', 'GitHub', 'Blog', 'Tentang'].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-text-tertiary outline-none transition-colors duration-200 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-separator-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-body-regular text-text-tertiary">
            <span>© {new Date().getFullYear()} Skillens. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <a href="#" className="outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Kebijakan Privasi</a>
              <a href="#" className="outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Syarat Penggunaan</a>
              <a href="#" className="outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Keamanan</a>
            </div>
          </div>
        </footer>
        </div>

      </main>
    </SmoothScrollProvider>
  );
}
