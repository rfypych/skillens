'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/landing/HeroSection';
import { PreviewSection } from '@/components/landing/PreviewSection';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

// Below-fold sections split out so heavy motion weight never
// blocks first paint. Placeholders keep viewport layout stable (CLS 0).
const LogoCloudSection = dynamic(() => import('@/components/landing/LogoCloudSection').then(m => m.LogoCloudSection), { loading: () => <div className="min-h-[40vh]" /> });
const SolusiSection = dynamic(() => import('@/components/landing/SolusiSection').then(m => m.SolusiSection), { loading: () => <div className="min-h-[40vh]" /> });
const MetricsSection = dynamic(() => import('@/components/landing/MetricsSection').then(m => m.MetricsSection), { loading: () => <div className="min-h-[40vh]" /> });
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection').then(m => m.FeaturesSection), { loading: () => <div className="min-h-[40vh]" /> });
const SpotlightSection = dynamic(() => import('@/components/landing/SpotlightSection').then(m => m.SpotlightSection), { loading: () => <div className="min-h-[40vh]" /> });
const PortalsSection = dynamic(() => import('@/components/landing/PortalsSection').then(m => m.PortalsSection), { loading: () => <div className="min-h-[40vh]" /> });
const DemoAccessSection = dynamic(() => import('@/components/landing/DemoAccessSection').then(m => m.DemoAccessSection), { loading: () => <div className="min-h-[40vh]" /> });
const FaqSection = dynamic(() => import('@/components/landing/FaqSection').then(m => m.FaqSection), { loading: () => <div className="min-h-[40vh]" /> });
const CTASection = dynamic(() => import('@/components/landing/CTASection').then(m => m.CTASection), { loading: () => <div className="min-h-[40vh]" /> });

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
        <footer className="w-full max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16 border-t border-separator-border font-app">
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
