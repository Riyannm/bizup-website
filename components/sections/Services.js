"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassPanel from "../ui/GlassPanel";

const FEATURES = [
  {
    num: "01",
    title: "Web development",
    body: "Marketing sites, booking pages, and full web apps that load fast and are easy for you to update.",
    tags: ["Business & landing sites", "Customer-facing web apps", "E-commerce & booking"],
    span: "md:col-span-7",
    icon: (
      <svg viewBox="0 0 40 40" className="h-9 w-9">
        <rect x="6" y="9" width="28" height="22" rx="3" fill="none" stroke="var(--ok)" strokeWidth="1.6" />
        <path d="M6 15h28" stroke="var(--ok)" strokeWidth="1.6" />
        <circle cx="10.5" cy="12" r="1" fill="var(--ok)" />
        <circle cx="14" cy="12" r="1" fill="var(--ok)" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Mobile & software apps",
    body: "Custom tools built around how your team actually works — not a generic template.",
    tags: ["Staff & ops apps", "Customer mobile apps", "Internal software tools"],
    span: "md:col-span-5",
    icon: (
      <svg viewBox="0 0 40 40" className="h-9 w-9">
        <rect x="12" y="6" width="16" height="28" rx="3" fill="none" stroke="var(--warn)" strokeWidth="1.6" />
        <path d="M18 29h4" stroke="var(--warn)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Business automation",
    body: "Dashboards, alerts, and workflows that replace manual tracking with something that runs itself.",
    tags: [
      "Inventory & low-stock alerts",
      "Reporting dashboards",
      "Vending & delivery route tracking",
      "Workflow automation",
    ],
    span: "md:col-span-12",
    icon: (
      <svg viewBox="0 0 40 40" className="h-9 w-9">
        <circle cx="12" cy="20" r="5" fill="none" stroke="var(--fg)" strokeWidth="1.6" />
        <circle cx="28" cy="12" r="4" fill="none" stroke="var(--fg)" strokeWidth="1.6" />
        <circle cx="28" cy="28" r="4" fill="none" stroke="var(--fg)" strokeWidth="1.6" />
        <path d="M16.5 18l7.5-4.5M16.5 22l7.5 4.5" stroke="var(--fg)" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section id="services">
      <div className="mb-12 max-w-[640px]">
        <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">What we build</div>
        <h2 className="text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em]">
          From one idea to three ways of running your business
        </h2>
        <p className="mt-3.5 text-[15.5px] text-fg-soft">
          Most clients start with one of these and grow into the others as the business
          scales. Tap a tile to see what&apos;s included.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {FEATURES.map((f, i) => {
          const isOpen = open === i;
          return (
            <GlassPanel
              key={f.num}
              className={`cursor-pointer overflow-hidden p-7 transition-colors sm:p-9 ${f.span}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/40">
                  {f.icon}
                </div>
                <span className="text-[13px] text-fg-faint">{f.num}</span>
              </div>
              <h3 className="mt-6 text-[22px] font-heading font-light tracking-[-0.01em] sm:text-[26px]">
                {f.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-[14.5px] text-fg-soft">{f.body}</p>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-glass-border-soft pt-5 text-[12.5px] text-fg-soft">
                      {f.tags.map((tag) => (
                        <span key={tag} className="before:mr-2 before:text-fg-faint before:content-['·']">
                          {tag}
                        </span>
                      ))}
                    </div>
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
