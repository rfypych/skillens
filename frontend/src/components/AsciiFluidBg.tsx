'use client';

import React, { useEffect, useRef } from 'react';

type AsciiFluidBgProps = {
  theme?: 'dark' | 'light';
  className?: string;
};

export default function AsciiFluidBg({ theme = 'dark', className }: AsciiFluidBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    
    const chars = ' .,-~:;=!*#$@';
    const charLen = chars.length;
    const gridSize = 60;
    let cols = 0, rows = 0;
    
    let scrollY = 0;
    let targetScrollY = 0;
    let lastDrawTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    
    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const parent = canvas.parentElement || document.body;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      cols = Math.floor(w / 26);
      rows = Math.floor(h / 26) + 8;
    };
    
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);

      const delta = now - lastDrawTime;
      if (delta < frameInterval) return;
      lastDrawTime = now - (delta % frameInterval);

      time += 0.02;
      scrollY += (targetScrollY - scrollY) * 0.08;
      
      const parent = canvas.parentElement || document.body;
      const width = parent.clientWidth || window.innerWidth;
      const height = parent.clientHeight || window.innerHeight;
      
      if (theme === 'light') {
        ctx.fillStyle = '#f3f6f2';
      } else {
        ctx.fillStyle = '#1f2a1d';
      }
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = '11px "Space Grotesk", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const pitch = 0.5 + (scrollY * 0.0004); 
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      
      const waveSpeed = time * 1.5;
      const xOffset = width / 2;
      const yOffset = height / 2;

      if (theme === 'light') {
        ctx.fillStyle = 'rgba(51, 100, 67, 0.25)';
      } else {
        ctx.fillStyle = 'rgba(133, 171, 139, 0.4)';
      }
      
      const startY = -Math.floor(rows / 2);
      const endY = Math.floor(rows / 2);
      const startX = -Math.floor(cols / 2);
      const endX = Math.floor(cols / 2);

      for (let y = startY; y < endY; y++) {
        const wz = y * gridSize;
        const sinWz = wz * sinPitch;
        const cosWz = wz * cosPitch;

        for (let x = startX; x < endX; x++) {
          const wx = x * gridSize;
          
          const distSq = wx * wx + wz * wz;
          const wy = Math.sin(distSq * 0.000005 - waveSpeed) * 120 
                   + Math.cos(wx * 0.01 + waveSpeed) * 60;
                   
          const rx = wx;
          const ry = wy * cosPitch - sinWz;
          const rz = wy * sinPitch + cosWz;
          
          const zDepth = rz + 750;
          if (zDepth < 10) continue;
          
          const scale = 380 / zDepth;
          const px = rx * scale + xOffset;
          const py = ry * scale + yOffset + (scrollY * 0.08);
          
          if (px < -10 || px > width + 10 || py < -10 || py > height + 10) continue;
          
          const intensity = Math.max(0, Math.min(1, (wy + 120) / 240));
          const charIndex = Math.floor(intensity * (charLen - 1));
          const char = chars[charIndex];
          
          if (char === ' ') continue;
          
          ctx.fillText(char, px, py);
        }
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
    />
  );
}
