'use client';

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
        <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/60 shadow-sm max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">Terjadi kesalahan.</h2>
            <p className="text-gray-500 mb-6 text-sm break-words leading-relaxed">
              {error.message || 'Kesalahan tak terduga. Coba muat ulang halaman ini.'}
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-3 px-4 bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full text-sm font-semibold transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
