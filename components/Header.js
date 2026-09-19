import LiquidButton from "./ui/LiquidButton";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between gap-3"
      style={{
        padding:
          "max(14px, calc(env(safe-area-inset-top, 0px) + 12px)) clamp(16px, 3.4vw, 44px) 14px",
        background:
          "linear-gradient(to bottom, rgba(242,240,236,.94) 0%, rgba(242,240,236,.78) 72%, rgba(242,240,236,0) 100%)",
      }}
    >
      <div className="flex min-w-0 shrink items-center gap-2 text-[15px] tracking-[-0.012em] text-fg">
        <span className="opacity-85" aria-hidden="true">
          &#10037;
        </span>
        <span className="truncate font-heading font-normal">BizUp Technologies</span>
      </div>
      <nav className="flex shrink-0 items-center gap-[clamp(14px,2.4vw,32px)]">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hidden text-[14.5px] tracking-[-0.008em] text-fg opacity-88 transition-opacity duration-300 [transition-timing-function:var(--ease)] hover:opacity-100 sm:inline"
          >
            {link.label}
          </a>
        ))}
        <LiquidButton href="#contact">Start a project</LiquidButton>
      </nav>
    </header>
  );
}
