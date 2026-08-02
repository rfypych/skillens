'use client';

import TextRollButton from '@/components/TextRollButton';
import Link from 'next/link';

interface ContactButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function ContactButton({
  label = 'Mulai Evaluasi Sekarang',
  href = '/signup',
  className = '',
}: ContactButtonProps) {
  return (
    <Link href={href} className={`inline-block ${className}`}>
      <TextRollButton text={label} variant="orange" size="lg" />
    </Link>
  );
}
