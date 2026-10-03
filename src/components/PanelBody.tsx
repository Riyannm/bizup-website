import type { ReactNode } from 'react';
import FadeIn from './FadeIn';

/**
 * A section floating over the live scene: one screen tall, with its content in a frosted-glass
 * panel. `side` puts a narrower panel on the left or right, leaving the other side open so the
 * camera can frame the monument there (see the section's shot in panels.tsx).
 */
export default function PanelBody({
  children,
  side = 'full',
  glass = true,
  className = '',
}: {
  children: ReactNode;
  side?: 'left' | 'right' | 'full';
  /** Off for sections whose content is already made of cards. */
  glass?: boolean;
  className?: string;
}) {
  const width = side === 'full' ? '' : `lg:w-[54%] ${side === 'right' ? 'lg:ml-auto' : ''}`;
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-3 py-24 sm:px-6 md:px-10">
      <FadeIn y={50} duration={1} className={`w-full ${width}`}>
        <div className={glass ? `card rounded-[28px] p-6 sm:rounded-[36px] sm:p-10 lg:p-12 ${className}` : className}>{children}</div>
      </FadeIn>
    </div>
  );
}
