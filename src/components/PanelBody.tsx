import type { ReactNode } from 'react';
import StageSlot from './StageSlot';

/** Standard section layout: at least one screen tall, clear of the fixed header. */
export default function PanelBody({
  children,
  className = '',
  visual = false,
}: {
  children: ReactNode;
  className?: string;
  /** Reserve space above the content for the 3D blocks on phones. */
  visual?: boolean;
}) {
  return (
    <div className={`mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-24 sm:px-8 sm:pb-24 md:px-10 ${className}`}>
      {visual && <StageSlot />}
      {children}
    </div>
  );
}
