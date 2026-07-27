'use client';

import React, { useEffect, useState, useRef } from 'react';

type TextScrambleProps = {
  text: string;
  className?: string;
  speed?: number;
};

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/░▒▓█';

export default function TextScramble({ text, className, speed = 30 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);

  useEffect(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    let frame = 0;
    const totalFrames = text.length * 3;

    const interval = setInterval(() => {
      frame++;
      
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(progress * text.length);

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n') return char;
          if (index < revealedLength) return text[index];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
        isScrambling.current = false;
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
}
