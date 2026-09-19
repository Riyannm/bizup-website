import LiquidButton from "../ui/LiquidButton";

const PANELS = [
  {
    eyebrow: "Freelance software & automation studio",
    heading: (
      <>
        We build the software
        <br />
        your business runs on.
      </>
    ),
    sub: "BizUp Technologies is a tech studio for small and growing businesses — websites, apps, and the back-office automation that keeps them running without you babysitting spreadsheets.",
    cta: { href: "#contact", label: "Get a free quote" },
  },
  {
    eyebrow: "How it's built",
    heading: "Real software, built around your business — not a template.",
    sub: "Every project starts with how your team actually works, then gets built to fit that, instead of forcing you into someone else's workflow.",
    cta: { href: "#services", label: "See what we build" },
  },
  {
    eyebrow: "How we work together",
    heading: "Direct communication. Fast decisions. No account managers.",
    sub: "You talk straight to the person building it, from the first call to the day it ships and every fix after that.",
    cta: { href: "#contact", label: "Start a project" },
  },
];

export default function IntroPanels({ panelRefs }) {
  return (
    <main className="pointer-events-none fixed inset-0 z-20">
      {PANELS.map((panel, i) => (
        <section
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
          style={{
            padding:
              "max(104px, calc(env(safe-area-inset-top, 0px) + 88px)) clamp(20px, 5vw, 60px) max(96px, calc(env(safe-area-inset-bottom, 0px) + 80px))",
            willChange: "opacity, transform",
          }}
        >
          <div
            className="mb-[clamp(16px,2vw,22px)] flex max-w-[46ch] flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[12.5px] tracking-[.045em] text-fg-soft"
          >
            {panel.eyebrow}
          </div>
          <h1
            className="max-w-[18ch] text-[clamp(28px,7.8vw,44px)] leading-[1.08] tracking-[-0.01em] text-balance sm:max-w-[24ch] sm:text-[clamp(30px,5.6vw,70px)]"
          >
            {panel.heading}
          </h1>
          <div className="mt-[clamp(18px,2.2vw,28px)] max-w-[34ch] text-[15px] leading-[1.5] tracking-[-0.008em] text-pretty text-fg-soft sm:max-w-[46ch] sm:text-[clamp(15px,1.28vw,19px)]">
            {panel.sub}
          </div>
          <div className="pointer-events-auto mt-[clamp(28px,3.4vw,44px)] flex w-full justify-center">
            <LiquidButton href={panel.cta.href} size="lg" className="w-full max-w-[280px] sm:max-w-[320px]">
              {panel.cta.label}
            </LiquidButton>
          </div>
        </section>
      ))}
    </main>
  );
}
