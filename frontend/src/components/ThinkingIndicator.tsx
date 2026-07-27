'use client';

import { useEffect, useRef, useState } from 'react';

export function ThinkingIndicator({ className, statusText }: { className?: string; statusText?: string }) {
  const [frame, setFrame] = useState('');
  
  useEffect(() => {
    let active = true;
    let raf: number;
    let effect: any = null;

    import('@zane-chen/agents-are-thinking').then((mod) => {
      if (!active) return;
      effect = new mod.BrailleRain();
      
      let last = 0;
      const tick = (t: number) => {
        if (!active) return;
        if (t - last >= 100) {
          setFrame(effect.step());
          last = t;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }).catch(err => {
      console.error("Failed to load thinking animation:", err);
      if (active) setFrame('...');
    });

    return () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      if (effect) effect.free();
    };
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 ${className || ''}`}>
      <span style={{
        fontFamily: "'Cascadia Code', monospace",
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
        lineHeight: '1',
        letterSpacing: '0px',
        minWidth: '9ch',
      }} className="font-bold">
        {frame}
      </span>
      {statusText && <span className="text-xs font-semibold tracking-wide uppercase">{statusText}</span>}
    </div>
  );
}
