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
      
      {/* 1. Universal Ambient Mesh (Guaranteed 100% on every mobile device / Battery Saver Mode) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <div className={`absolute -top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-70 animate-pulse ${isDark ? 'bg-[#F26522]/25' : 'bg-[#ff5f03]/15'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-60 ${isDark ? 'bg-[#1E293B]' : 'bg-[#ffffff]'}`} />
      </div>

      {/* 2. Hardware-Accelerated WebGL Shader Layer (Renders when GPU acceleration is active) */}
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
