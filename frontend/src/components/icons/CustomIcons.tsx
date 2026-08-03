'use client';

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 1. Precision Sparkle / Crosshair (Anti-slop indicator)
export function IconSparkle({ size = 16, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6" opacity="0.3" />
      <path d="M12 5v14M5 12h14" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 2. Sharp Arrow Up Right
export function IconArrowUpRight({ size = 16, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// 3. Telemetry Signal / Active Users Icon
export function IconTelemetrySignal({ size = 16, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M7 17a5 5 0 0 1 10 0" />
      <circle cx="12" cy="19" r="1.25" fill="currentColor" />
    </svg>
  );
}

// 4. Chevron Right Micro
export function IconChevronRight({ size = 14, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// 5. Clock Minimal
export function IconClock({ size = 14, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// 6. Minimal Lock / Enterprise Audit Seal
export function IconAuditShield({ size = 16, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// 7. Multi-Role Network Node Graph
export function IconNodeMesh({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <line x1="12" y1="7.5" x2="6.5" y2="16" />
      <line x1="12" y1="7.5" x2="17.5" y2="16" />
      <line x1="7.5" y1="18" x2="16.5" y2="18" />
    </svg>
  );
}

// 8. Watermark 1 — Sleek Architecture Matrix Blueprint
export function WatermarkArchitecture({ size = 320, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      {...props}
    >
      <rect x="20" y="20" width="160" height="160" rx="16" strokeDasharray="4 4" />
      <rect x="40" y="40" width="120" height="120" rx="12" />
      <rect x="65" y="65" width="70" height="70" rx="8" />
      <circle cx="100" cy="100" r="16" />
      <line x1="100" y1="20" x2="100" y2="180" />
      <line x1="20" y1="100" x2="180" y2="100" />
    </svg>
  );
}

// 9. Watermark 2 — Real-time Telemetry Pulse Matrix
export function WatermarkTelemetryPulse({ size = 280, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <path d="M10 100h40l20-40 30 80 25-60 15 20h50" />
      <circle cx="100" cy="100" r="80" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="50" />
      <circle cx="100" cy="100" r="20" />
    </svg>
  );
}
