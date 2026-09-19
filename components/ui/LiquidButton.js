"use client";

const BASE_STYLE = {
  background: "linear-gradient(160deg, var(--metal-mid) 0%, var(--metal-base) 55%, var(--metal-mid) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 4px rgba(0,0,0,.4), 0 10px 24px -10px rgba(0,0,0,.5)",
};

const SIZE_CLASSES = {
  md: "h-10 px-5 text-[14.5px] sm:h-11 sm:px-6",
  lg: "h-12 px-6 text-[15px] sm:h-[52px] sm:px-8 sm:text-base",
};

export default function LiquidButton({
  href,
  type = "button",
  size = "md",
  disabled,
  onClick,
  className = "",
  children,
}) {
  const classes = `group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.008em] text-white transition-transform duration-300 [transition-timing-function:var(--ease)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${SIZE_CLASSES[size]} ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-[1.5px] z-0 h-px rounded-full bg-white/40"
      />
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} style={BASE_STYLE}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes} style={BASE_STYLE}>
      {content}
    </button>
  );
}
