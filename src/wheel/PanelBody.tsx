import type { ReactNode } from 'react';

/** Standard panel layout: one screen tall, clear of the header above and the section bar below. */
export default function PanelBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-24 sm:px-8 sm:pb-28 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
