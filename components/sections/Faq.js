"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassPanel from "../ui/GlassPanel";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Simple websites: 1–2 weeks. Web apps and automation builds: 3–6 weeks depending on scope, confirmed on the discovery call.",
  },
  {
    q: "Do you work with businesses outside your city?",
    a: "Yes — calls, design reviews and delivery all happen remotely over video call, WhatsApp and email.",
  },
  {
    q: "I don't have a design ready — do I need one?",
    a: "No. Most clients start with a rough idea. The discovery call turns that into a clear spec before any code is written.",
  },
  {
    q: "Who owns the code after the project?",
    a: "You do. Full source code and credentials are handed over once the final payment clears.",
  },
  {
    q: "What if something breaks after launch?",
    a: "Growth and Custom projects include a support window after launch. After that, fixes continue on a small monthly retainer or per-fix basis.",
  },
  {
    q: "How does payment work?",
    a: "Typically 50% upfront to start, 50% on delivery. Larger projects can be split into milestones.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq">
      <div className="mb-11 max-w-[640px]">
        <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">FAQ</div>
        <h2 className="text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em]">
          Before you reach out
        </h2>
      </div>
      <div className="flex max-w-[780px] flex-col gap-2.5">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <GlassPanel key={item.q} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-[17px] text-left text-[15px] font-medium"
              >
                {item.q}
                <span
                  className="flex-none text-fg-soft transition-transform duration-200 [transition-timing-function:var(--ease)]"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-[19px] text-sm text-fg-soft">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
