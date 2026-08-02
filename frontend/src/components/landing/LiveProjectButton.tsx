'use client';

import TextRollButton from '@/components/TextRollButton';
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
    <Link href={href} className={`inline-block ${className}`}>
      <TextRollButton text={label} variant="orange" size="sm" />
    </Link>
  );
}
