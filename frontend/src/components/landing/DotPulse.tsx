'use client';

/** Titik-titik denyut halus pengganti glif braille — hanya opacity, dijaga reduced-motion. */
export function DotPulse({ label, labelClassName = 'text-text-secondary' }: { label: string; labelClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-accent-500 motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      <span className={`text-body-medium ${labelClassName}`}>{label}</span>
    </span>
  );
}
