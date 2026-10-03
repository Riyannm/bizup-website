/**
 * The BizUp logo. Source files live in brand/ — dark-background versions by default, plus a
 * light-background horizontal version, vectorised from the supplied artwork so they stay sharp at any size.
 */
export default function Logo({
  variant = 'horizontal',
  onLight = false,
  className = '',
}: {
  variant?: 'horizontal' | 'stacked';
  /** Use the version drawn for light backgrounds. */
  onLight?: boolean;
  className?: string;
}) {
  const src = variant === 'stacked' ? '/logo-stacked.svg' : onLight ? '/logo-horizontal-light.svg' : '/logo-horizontal.svg';
  const fallback = variant === 'stacked' ? 'h-28 w-auto' : 'h-12 w-auto sm:h-14';
  return <img src={src} alt="BizUp Technologies" className={className || fallback} width={variant === 'stacked' ? 320 : 220} height={variant === 'stacked' ? 420 : 40} />;
}
