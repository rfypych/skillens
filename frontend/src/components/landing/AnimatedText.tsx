'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

function Character({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const start = index / total;
  const end = Math.min(1, start + 2 / total);
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block ${char === ' ' ? 'w-[0.25em]' : ''}`}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const characters = text.split('');

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap justify-center text-center ${className}`}
    >
      {characters.map((char, index) => (
        <Character
          key={index}
          char={char}
          index={index}
          total={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}
