import { ArrowUpRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Common = { children?: ReactNode; className?: string };
type AnchorProps = Common & { href: string; target?: string; rel?: string };
type NativeButtonProps = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

function Pill({ base, children, className = '', ...props }: (AnchorProps | NativeButtonProps) & { base: string }) {
  const classes = `${base} ${className}`;
  if ('href' in props && props.href !== undefined) {
    return (
      <a className={classes} {...(props as AnchorProps)}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {children}
    </button>
  );
}

const contactBase =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-medium uppercase tracking-widest ' +
  'px-6 py-3 sm:px-9 sm:py-3.5 md:px-10 md:py-4 text-xs sm:text-sm md:text-base min-h-[44px] whitespace-nowrap ' +
  'cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const TONES = {
  // primary call to action
  brand:
    'bg-[#0047AB] text-white shadow-[0_0_40px_-10px_rgba(0,71,171,0.9)] hover:bg-[#0A58D0] hover:shadow-[0_0_56px_-8px_rgba(61,123,255,0.9)] transition-[background-color,box-shadow]',
  // on dark sections
  light: 'bg-[#FFFFFF] text-[#000000] hover:bg-white',
  // on white sections
  dark: 'bg-[#000000] text-white hover:bg-[#2a2a2e] focus-visible:outline-[#000000]',
};

type ContactButtonProps = (AnchorProps | NativeButtonProps) & { tone?: keyof typeof TONES; arrow?: boolean };

export function ContactButton({ children = 'Get a free quote', tone = 'brand', arrow = true, ...props }: ContactButtonProps) {
  return (
    <Pill base={`${contactBase} ${TONES[tone]}`} {...props}>
      {children}
      {arrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </Pill>
  );
}

const ghostBase =
  'inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-md text-[#FFFFFF] font-medium uppercase tracking-widest ' +
  'px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base min-h-[44px] whitespace-nowrap cursor-pointer ' +
  'transition-colors duration-200 hover:border-[#3D7BFF]/60 hover:bg-white/[0.06]';

export function GhostButton({ children, ...props }: AnchorProps | NativeButtonProps) {
  return (
    <Pill base={ghostBase} {...props}>
      {children}
    </Pill>
  );
}
