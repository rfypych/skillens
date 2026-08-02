'use client';

import Link from 'next/link';

interface LiveProjectButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function LiveProjectButton({
  label = 'Coba Skenario',
  href = '/signup',
  className = '',
}: LiveProjectButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border-2 border-[#F26522] text-[#F26522] hover:bg-[#F26522]/15 font-medium uppercase tracking-widest transition-all duration-300 px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm ${className}`}
    >
      {label}
    </Link>
  );
}
