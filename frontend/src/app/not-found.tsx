import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white px-8 py-12 sm:px-12 rounded-2xl border border-gray-200/60 shadow-sm max-w-lg w-full text-center">
        <div className="text-[96px] sm:text-[120px] leading-none font-semibold tracking-tight text-gray-900 select-none">
          404
        </div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-2">
          Halaman tidak ditemukan
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mt-3">
          Tautan ini tidak tersedia.
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Halaman yang kamu cari sudah dipindah atau tidak pernah ada. Kembali ke beranda untuk melanjutkan.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#e05a1a] text-white text-sm font-semibold rounded-full pl-6 pr-2 py-2 transition-colors"
          >
            Kembali ke Beranda
            <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
