'use client';

import { RiErrorWarningLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background-full p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-button-default bg-background-primary-default p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-status-rose-background">
              <RiErrorWarningLine className="size-7 text-status-rose-text" aria-hidden />
            </div>
            <h2 className="mb-2 text-title-3-semibold text-text-primary">Terjadi kesalahan.</h2>
            <p className="mb-6 text-body-medium leading-relaxed break-words text-text-secondary">
              {error.message || 'Kesalahan tak terduga. Coba muat ulang halaman ini.'}
            </p>
            <Button variant="primary" size="medium" onClick={() => reset()} className="w-full">
              Coba Lagi
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
