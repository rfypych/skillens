'use client';

import { useEffect, useState } from 'react';

interface ShaderBackgroundProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function ShaderBackground({ variant = 'light', className = '' }: ShaderBackgroundProps) {
  const [ShaderComponents, setShaderComponents] = useState<any>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Detect WebGL hardware acceleration support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }

    // Dynamic import of shaders/react
    import('shaders/react')
      .then(mod => {
        setShaderComponents(mod);
      })
      .catch(err => {
        console.warn('Failed to load shaders/react:', err);
        setWebglSupported(false);
      });
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden ${isDark ? 'bg-[#0F172A]' : 'bg-[#EFEFEF]'} ${className}`}>
      
      {/* 1. Universal High-Definition Mesh & Radial Glow (100% Guaranteed on Redmi Note 9 & All Android/iOS GPUs) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* Primary Animated Radial Orange Glow */}
        <div 
          className={`absolute -top-24 -left-20 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full filter blur-2xl sm:blur-3xl opacity-80 animate-pulse transition-all duration-1000 ${
            isDark 
              ? 'bg-[#F26522]/30' 
              : 'bg-[#FF6B2B]/20'
          }`} 
        />
        
        {/* Secondary Warm Ambient Glow */}
        <div 
          className={`absolute top-1/3 -right-24 w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] rounded-full filter blur-2xl sm:blur-3xl opacity-70 transition-all duration-1000 ${
            isDark 
              ? 'bg-[#1E293B]' 
              : 'bg-[#FFE8DC]'
          }`} 
        />

        {/* SVG Radial Mesh Gradient for Native Mobile GPU Rendering */}
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`glow-${variant}`} cx="30%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#F26522" stopOpacity={isDark ? "0.35" : "0.22"} />
              <stop offset="50%" stopColor={isDark ? "#1E293B" : "#FFD4C2"} stopOpacity={isDark ? "0.15" : "0.12"} />
              <stop offset="100%" stopColor={isDark ? "#0F172A" : "#EFEFEF"} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#glow-${variant})`} />
        </svg>
      </div>

      {/* 2. WebGL Shader Overlay Layer (When WebGL hardware acceleration is active) */}
      {webglSupported && ShaderComponents && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
          <ShaderComponents.Shader className="w-full h-full">
            <ShaderComponents.Swirl
              colorA={isDark ? '#0F172A' : '#ffffff'}
              colorB={isDark ? '#1E293B' : '#f0f0f0'}
              detail={1.7}
            />
            <ShaderComponents.ChromaFlow
              baseColor={isDark ? '#0F172A' : '#ffffff'}
              downColor="#F26522"
              leftColor="#F26522"
              rightColor="#F26522"
              upColor="#F26522"
              momentum={12}
              radius={3.2}
            />
            <ShaderComponents.FlutedGlass
              aberration={0.55}
              angle={31}
              frequency={8}
              highlight={isDark ? 0.25 : 0.12}
              highlightSoftness={0}
              lightAngle={-90}
              refraction={4}
              shape="rounded"
              softness={1}
              speed={0.15}
            />
            <ShaderComponents.FilmGrain strength={0.06} />
          </ShaderComponents.Shader>
        </div>
      )}
    </div>
  );
}
