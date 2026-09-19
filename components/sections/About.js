import GlassPanel from "../ui/GlassPanel";

const FACTS = [
  { k: "Based", v: "India · remote-first" },
  { k: "Response time", v: "Within 1 business day" },
  { k: "Focus", v: "Small & growing businesses" },
  { k: "Engagement", v: "Direct, no hand-offs" },
];

const DASH_ROWS = [
  { tone: "warn", text: "Low stock: reorder point reached", tag: "SKU-1042" },
  { tone: "ok", text: "Delivery route #4 completed", tag: "12:04 PM" },
  { tone: "ok", text: "Daily report generated", tag: "Auto" },
  { tone: "warn", text: "Vending unit 7 — revenue drop", tag: "Flagged" },
];

export default function About() {
  return (
    <section id="about">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
        <div>
          <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">About</div>
          <h2 className="text-[clamp(32px,4.6vw,48px)] leading-[1.08] tracking-[-0.01em]">
            Built around how your business actually works
          </h2>
          <p className="mt-6 max-w-[52ch] text-base text-fg-soft">
            BizUp Technologies isn&apos;t a call center with account managers standing
            between you and the work. Every project — from the first discovery call to
            the code that ships — gets direct attention and clear communication, with
            decisions made fast instead of stuck behind layers of hand-offs.
          </p>
          <div className="mt-8 flex flex-col">
            {FACTS.map((f) => (
              <div key={f.k} className="flex justify-between gap-4 border-t border-rule py-3 last:border-b">
                <span className="text-xs text-fg-soft">{f.k}</span>
                <span className="text-sm font-medium">{f.v}</span>
              </div>
            ))}
          </div>
        </div>
        <GlassPanel strong className="px-6 pb-7 pt-6 sm:px-[26px] sm:pb-8 sm:pt-7">
          <div className="mb-4 text-xs tracking-[.02em] text-fg-soft">
            BIZUP DASHBOARD — LIVE PREVIEW
          </div>
          {DASH_ROWS.map((row) => (
            <div
              key={row.text}
              className="mb-2 flex items-center justify-between rounded-[10px] bg-white/35 px-3.5 py-3 text-[13.5px]"
            >
              <span className="flex flex-1 items-center">
                <span
                  className="mr-2.5 h-1.5 w-1.5 flex-none rounded-full"
                  style={{ background: row.tone === "warn" ? "var(--warn)" : "var(--ok)" }}
                />
                {row.text}
              </span>
              <span className="text-[11px] text-fg-faint">{row.tag}</span>
            </div>
          ))}
        </GlassPanel>
      </div>
    </section>
  );
}
