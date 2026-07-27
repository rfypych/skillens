'use client';

import { useEffect, useState } from 'react';

interface ShaderBackgroundProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function ShaderBackground({ variant = 'light', className = '' }: ShaderBackgroundProps) {
  const [ShaderComponents, setShaderComponents] = useState<any>(null);

  useEffect(() => {
    import('shaders/react')
      .then(mod => {
        setShaderComponents(mod);
      })
      .catch(err => {
        console.warn('Failed to load shaders/react:', err);
      });
  }, []);

  if (!ShaderComponents) {
    return (
      <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden ${variant === 'dark' ? 'bg-[#111827]' : 'bg-[#EFEFEF]'} ${className}`}>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${variant === 'dark' ? 'bg-[#F26522]/20' : 'bg-[#ff5f03]/10'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${variant === 'dark' ? 'bg-black/50' : 'bg-white/40'}`} />
      </div>
    );
  }

  const { Shader, ChromaFlow, FilmGrain, FlutedGlass, Swirl } = ShaderComponents;

  const isDark = variant === 'dark';

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden ${className}`}>
      <Shader className="w-full h-full">
        <Swirl
          colorA={isDark ? '#0F172A' : '#ffffff'}
          colorB={isDark ? '#1E293B' : '#f0f0f0'}
          detail={1.7}
        />
        <ChromaFlow
          baseColor={isDark ? '#0F172A' : '#ffffff'}
          downColor="#F26522"
          leftColor="#F26522"
          rightColor="#F26522"
          upColor="#F26522"
          momentum={12}
          radius={3.2}
        />
        <FlutedGlass
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
        <FilmGrain strength={0.06} />
      </Shader>
    </div>
  );
}
