'use client';

import Link from 'next/link';

interface ContactButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function ContactButton({
  label = 'Mulai Evaluasi',
  href = '/signup',
  className = '',
}: ContactButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full text-white font-medium uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer shadow-lg hover:shadow-orange-500/25 ${className}`}
      style={{
        background: 'linear-gradient(123deg, #0F172A 7%, #F26522 37%, #FF6B2B 72%, #0F172A 100%)',
        boxShadow: '0px 4px 4px rgba(242, 101, 34, 0.25), inset 4px 4px 12px #F26522',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </Link>
  );
}
