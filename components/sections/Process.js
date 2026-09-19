const STEPS = [
  {
    num: 1,
    title: "Understand the business",
    body: "A short call to map what's slow or manual today, and what a working version 1 needs to do.",
  },
  {
    num: 2,
    title: "Design & build in the open",
    body: "You see working screens early and often — no black-box month before the first demo.",
  },
  {
    num: 3,
    title: "Ship it, then support it",
    body: "Launch, train your team on it, and stay on for fixes and the next round of features.",
  },
];

export default function Process() {
  return (
    <section id="process">
      <div className="mb-14 max-w-[640px]">
        <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">How we work</div>
        <h2 className="text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em]">
          From first call to launch, in three stages
        </h2>
      </div>
      <div className="relative max-w-[640px] pl-2">
        <div
          className="absolute left-[19px] top-2 bottom-2 w-px"
          style={{ background: "linear-gradient(to bottom, var(--glass-border-soft), transparent)" }}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-10">
          {STEPS.map((s) => (
            <div key={s.num} className="relative flex gap-6">
              <div
                className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-glass-border-soft text-[13px] text-fg backdrop-blur-md"
                style={{ background: "var(--glass-bg-strong)" }}
              >
                {s.num}
              </div>
              <div className="pt-1.5">
                <h3 className="text-[19px] font-heading font-light tracking-[-0.01em] sm:text-[21px]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[50ch] text-sm text-fg-soft">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
