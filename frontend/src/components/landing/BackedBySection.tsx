'use client';

const SPONSORS = [
  { name: 'JHIC', style: { fontFamily: "'Times New Roman', serif", fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' } },
  { name: 'Jagoan Hosting', style: { fontFamily: "'Arial Black', 'Arial Bold', sans-serif", fontWeight: 900, letterSpacing: '0.08em', fontSize: '13px', textTransform: 'uppercase' as const } },
  { name: 'Komdigi', style: { fontFamily: 'Impact, sans-serif', fontWeight: 700, letterSpacing: '0.05em', fontSize: '16px' } },
  { name: 'Garuda Spark', style: { fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '15px' } },
  { name: 'Ngalup', style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.01em', fontSize: '14px' } },
  { name: 'NxGen', style: { fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: '0.12em', fontSize: '13px', textTransform: 'uppercase' as const } },
];

export function BackedBySection() {
  return (
    <section className="bg-[#EFEFEF] px-4 sm:px-6 py-10 border-t border-gray-200/70">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

        {/* LEFT */}
        <div className="md:col-span-1">
          <p className="text-gray-400 text-sm leading-relaxed">
            Didukung mitra terpercaya<br />dan pemimpin inovatif.
          </p>
        </div>

        {/* RIGHT: Marquee */}
        <div className="md:col-span-3 overflow-hidden">
          <style>{`
            @keyframes backers-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .backers-track {
              display: flex;
              width: max-content;
              animation: backers-scroll 30s linear infinite;
            }
          `}</style>
          <div className="backers-track">
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <span
                key={i}
                className="mx-10 shrink-0 text-gray-400 whitespace-nowrap"
                style={s.style}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
