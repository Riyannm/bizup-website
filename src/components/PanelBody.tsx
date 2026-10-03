import type { ReactNode } from 'react';

/** Standard section layout: at least one screen tall, clear of the fixed header. */
export default function PanelBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-24 sm:px-8 sm:pb-24 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
