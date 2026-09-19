import { useId } from 'react';

/** The BizUp "sunrise over code" mark. Same drawing as brand/bizup-mark-dark-bg.svg. */
export function LogoMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const sun = `sun-${id}`;
  const lines = `lines-${id}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={sun} gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="100" y2="0">
          <stop offset="0" stopColor="#45CCFF" />
          <stop offset="0.5" stopColor="#5C8CFF" />
          <stop offset="1" stopColor="#9B5CF6" />
        </linearGradient>
        <linearGradient id={lines} gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="100">
          <stop offset="0" stopColor="#F1F5F8" />
          <stop offset="1" stopColor="#9AA6B0" />
        </linearGradient>
      </defs>
      <path d="M20 60 A30 30 0 0 1 80 60 Z" fill={`url(#${sun})`} />
      <g stroke={`url(#${sun})`} strokeWidth="4.5" strokeLinecap="round" opacity="0.85">
        <path d="M50 13 V22 M23.5 23.5 L29.5 29.5 M76.5 23.5 L70.5 29.5 M9 44 L18 46.5 M91 44 L82 46.5" />
      </g>
      <g stroke={`url(#${lines})`} strokeWidth="7" strokeLinecap="round">
        <path d="M10 70 H90" />
        <path d="M22 81 H56 M66 81 H78" />
        <path d="M34 92 H66" />
      </g>
    </svg>
  );
}

/** Mark + "BizUp" wordmark, for the nav and footer. */
export default function Logo({ size = 'md', withTagline = false }: { size?: 'md' | 'lg'; withTagline?: boolean }) {
  const lg = size === 'lg';
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={lg ? 'h-14 w-14' : 'h-9 w-9'} />
      <span className="flex flex-col leading-none">
        <span className={`hero-heading font-extrabold tracking-tight ${lg ? 'text-4xl sm:text-5xl' : 'text-xl'}`}>BizUp</span>
        {withTagline && (
          <span className={`mt-1.5 font-medium uppercase text-[#D7E2EA]/80 ${lg ? 'text-[11px] tracking-[0.42em]' : 'text-[8px] tracking-[0.4em]'}`}>
            Technologies
          </span>
        )}
      </span>
    </span>
  );
}
