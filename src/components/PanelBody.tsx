import type { ReactNode } from 'react';

/** Standard section layout on the content sheet. */
export default function PanelBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28 md:px-10 ${className}`}>{children}</div>;
}
