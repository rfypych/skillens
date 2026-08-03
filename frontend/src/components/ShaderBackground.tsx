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
    // Detect WebGL support safely
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
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden transform-gpu ${isDark ? 'bg-[#0B0F19]' : 'bg-[#EFEFEF]'} ${className}`}>
      
      {/* 1. Pure CSS Hardware-Accelerated Radial Gradient Glow (Zero-lag, 0% CPU blur penalty) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(242, 101, 34, 0.25) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(11, 15, 25, 1) 100%)'
            : 'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(242, 101, 34, 0.15) 0%, rgba(255, 212, 194, 0.25) 45%, rgba(239, 239, 239, 1) 100%)',
        }}
      />

      {/* 2. Optimized WebGL Shader Overlay Layer */}
      {webglSupported && ShaderComponents && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-90">
          <ShaderComponents.Shader className="w-full h-full">
            <ShaderComponents.Swirl
              colorA={isDark ? '#0B0F19' : '#ffffff'}
              colorB={isDark ? '#1E293B' : '#f0f0f0'}
              detail={1.2}
            />
            <ShaderComponents.ChromaFlow
              baseColor={isDark ? '#0B0F19' : '#ffffff'}
              downColor="#F26522"
              leftColor="#F26522"
              rightColor="#F26522"
              upColor="#F26522"
              momentum={8}
              radius={2.4}
            />
            <ShaderComponents.FlutedGlass
              aberration={0.2}
              angle={31}
              frequency={5}
              highlight={isDark ? 0.2 : 0.08}
              highlightSoftness={0}
              lightAngle={-90}
              refraction={2}
              shape="rounded"
              softness={0.5}
              speed={0.12}
            />
            <ShaderComponents.FilmGrain strength={0.04} />
          </ShaderComponents.Shader>
        </div>
      )}
    </div>
  );
}
