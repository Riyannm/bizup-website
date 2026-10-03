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
  'group inline-flex items-center justify-center gap-3 rounded-full font-medium ' +
  'pl-6 pr-2 py-2 text-[15px] sm:text-base min-h-[48px] whitespace-nowrap ' +
  'cursor-pointer transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60';

const TONES = {
  // primary call to action on the paper background
  ink: 'bg-ink text-white hover:bg-cobalt',
  // on dark backgrounds
  light: 'bg-white text-ink hover:bg-cobalt hover:text-white',
};

type ContactButtonProps = (AnchorProps | NativeButtonProps) & { tone?: keyof typeof TONES; arrow?: boolean };

export function ContactButton({ children = 'Get a free quote', tone = 'ink', arrow = true, className = '', ...props }: ContactButtonProps) {
  return (
    <Pill base={`${contactBase} ${TONES[tone]} ${arrow ? '' : '!pr-6'}`} className={className} {...props}>
      {children}
      {arrow && (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </Pill>
  );
}

const ghostBase =
  'inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 text-ink font-medium ' +
  'px-6 py-3 text-[15px] sm:text-base min-h-[48px] whitespace-nowrap cursor-pointer ' +
  'transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white';

export function GhostButton({ children, ...props }: AnchorProps | NativeButtonProps) {
  return (
    <Pill base={ghostBase} {...props}>
      {children}
    </Pill>
  );
}
