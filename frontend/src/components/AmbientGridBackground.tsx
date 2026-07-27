'use client';

export default function AmbientGridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Radial ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-40 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(75, 123, 81, 0.18) 0%, rgba(1, 38, 49, 0.08) 50%, transparent 80%)'
        }}
      />

      {/* SVG Dot Grid Matrix */}
      <svg className="w-full h-full opacity-[0.22]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ambient-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="0.85" fill="#012631" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-grid-pattern)" />
      </svg>
    </div>
  );
}
