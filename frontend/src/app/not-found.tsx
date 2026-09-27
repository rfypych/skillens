import Link from 'next/link';
import { RiArrowRightLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background-full p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border-button-default bg-background-primary-default px-8 py-12 text-center shadow-card sm:px-12">
        <div className="text-display-1-medium leading-none text-text-primary tabular-nums select-none">
          404
        </div>
        <p className="mt-2 text-caption-1-semibold text-text-tertiary">
          Halaman tidak ditemukan
        </p>
        <h2 className="mt-3 text-title-2-medium text-text-primary">
          Tautan ini tidak tersedia.
        </h2>
        <p className="mt-2 text-body-medium leading-relaxed text-text-secondary">
          Halaman yang kamu cari sudah dipindah atau tidak pernah ada. Kembali ke beranda untuk melanjutkan.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
