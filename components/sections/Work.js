import GlassPanel from "../ui/GlassPanel";

const PROJECTS = [
  {
    title: "Multi-location inventory system",
    body: "Low-stock alerts and reorder points across several store locations, replacing manual counts.",
    icon: (
      <svg viewBox="0 0 100 60" className="h-[46%] w-[46%]">
        <rect x="8" y="30" width="12" height="22" fill="var(--fg)" opacity=".7" />
        <rect x="26" y="18" width="12" height="34" fill="var(--fg)" opacity=".55" />
        <rect x="44" y="8" width="12" height="44" fill="var(--fg)" opacity=".85" />
        <rect x="62" y="24" width="12" height="28" fill="var(--fg)" opacity=".55" />
        <rect x="80" y="36" width="12" height="16" fill="var(--fg)" opacity=".7" />
      </svg>
    ),
  },
  {
    title: "Daily & monthly store reporting",
    body: "Automated daily, weekly, monthly and yearly reports pulled together across ten locations.",
    icon: (
      <svg viewBox="0 0 100 60" className="h-[46%] w-[46%]">
        <circle cx="50" cy="30" r="20" fill="none" stroke="var(--fg)" strokeWidth="3" opacity=".8" />
        <path d="M50 16v14l10 6" fill="none" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      </svg>
    ),
  },
  {
    title: "Staff login & access control",
    body: "Role-based logins with single-device sessions, so staff accounts can't be shared or leaked.",
    icon: (
      <svg viewBox="0 0 100 60" className="h-[46%] w-[46%]">
        <rect x="20" y="12" width="60" height="36" rx="4" fill="none" stroke="var(--fg)" strokeWidth="3" opacity=".8" />
        <path d="M30 24h20M30 34h30" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      </svg>
    ),
  },
  {
    title: "Vending & skill-game route tracking",
    body: "Machine-location and revenue tracking for a network of skill-game and vending machines, plus delivery/service scheduling across sites.",
    icon: (
      <svg viewBox="0 0 100 60" className="h-[46%] w-[46%]">
        <circle cx="30" cy="42" r="7" fill="none" stroke="var(--fg)" strokeWidth="3" opacity=".8" />
        <circle cx="72" cy="42" r="7" fill="none" stroke="var(--fg)" strokeWidth="3" opacity=".8" />
        <path
          d="M14 42V18h44l14 14v10"
          fill="none"
          stroke="var(--fg)"
          strokeWidth="3"
          strokeLinejoin="round"
          opacity=".8"
        />
      </svg>
    ),
  },
];

export default function Work() {
  return (
    <section id="work">
      <div className="mb-12 max-w-[640px]">
        <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">
          Client feedback &amp; example builds
        </div>
        <h2 className="text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em]">
          Real systems we&apos;ve shipped
        </h2>
        <p className="mt-3.5 text-[15.5px] text-fg-soft">
          Client names are kept private, but every build below is real, working
          software — not a mockup.
        </p>
      </div>

      <GlassPanel strong className="mb-10 max-w-[780px] px-8 py-8 sm:px-10 sm:py-9">
        <span className="mb-3 inline-block rounded-full border border-glass-border-soft px-2.5 py-1 text-[11px] tracking-[.02em] text-fg-soft">
          Placeholder — swap for a real quote
        </span>
        <p className="mb-4.5 text-[19px] font-medium leading-[1.5]">
          &#8220;Working with BizUp felt like having an in-house developer who
          actually cared about the outcome, not just ticking off a scope of
          work.&#8221;
        </p>
        <p className="text-[13.5px] text-fg-soft">
          <strong className="text-fg">Client name</strong> — Business name
        </p>
      </GlassPanel>

      <div className="flex flex-col gap-5">
        {PROJECTS.map((p, i) => (
          <GlassPanel
            key={p.title}
            className={`flex flex-col items-stretch gap-0 overflow-hidden md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex min-h-[160px] flex-1 items-center justify-center bg-white/30 md:min-h-[220px]">
              {p.icon}
            </div>
            <div className="flex flex-1 flex-col justify-center px-7 py-7 sm:px-9 sm:py-9">
              <span className="mb-2 inline-block w-fit rounded-full border border-glass-border-soft px-2.5 py-1 text-[11px] tracking-[.02em] text-fg-soft">
                Real project
              </span>
              <h3 className="mb-2 text-[20px] font-heading font-light tracking-[-0.01em] sm:text-[24px]">
                {p.title}
              </h3>
              <p className="max-w-[46ch] text-[14.5px] text-fg-soft">{p.body}</p>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
