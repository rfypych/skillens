'use client';

import HeroAsciiShader from '@/components/HeroAsciiShader';

interface ShaderBackgroundProps {
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Lightweight hero backdrop: pure-CSS radial glow + ASCII canvas shader.
 * Deliberately dependency-free (no WebGL lib) so it never lands in the
 * initial bundle — the old `shaders/react` import cost ~2.6MB.
 */
export default function ShaderBackground({ variant = 'light', className = '' }: ShaderBackgroundProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden transform-gpu ${isDark ? 'bg-[#0B0F19]' : 'bg-[#EFEFEF]'} ${className}`}>
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(242, 101, 34, 0.25) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(11, 15, 25, 1) 100%)'
            : 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(242, 101, 34, 0.15) 0%, rgba(255, 212, 194, 0.25) 45%, rgba(239, 239, 239, 1) 100%)',
        }}
      />
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-90">
        <HeroAsciiShader className="w-full h-full" />
      </div>
    </div>
  );
}
