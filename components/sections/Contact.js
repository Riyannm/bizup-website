"use client";

import { useState } from "react";
import GlassPanel from "../ui/GlassPanel";
import LiquidButton from "../ui/LiquidButton";

const WHATSAPP_TEXT = encodeURIComponent(
  "Hi! I'd like to talk about a project for my business."
);
const WHATSAPP_URL = `https://wa.me/919182464926?text=${WHATSAPP_TEXT}`;
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

export default function Contact() {
  const [status, setStatus] = useState({ text: "", tone: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!WEB3FORMS_KEY) {
      setStatus({
        text: "Form not activated yet — add a free Web3Forms access key to go live.",
        tone: "err",
      });
      return;
    }
    setSubmitting(true);
    setStatus({ text: "Sending…", tone: "" });
    const form = e.currentTarget;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({
          text: "Thanks — message sent. We reply within one business day.",
          tone: "ok",
        });
        form.reset();
      } else {
        setStatus({
          text: "Something went wrong — please email or WhatsApp us directly.",
          tone: "err",
        });
      }
    } catch {
      setStatus({
        text: "Something went wrong — please email or WhatsApp us directly.",
        tone: "err",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact">
      <GlassPanel strong as="div" className="grid grid-cols-1 gap-9 p-7 md:grid-cols-[0.9fr_1.1fr] md:p-[46px]">
        <div>
          <div className="mb-3.5 text-[12.5px] tracking-[.045em] text-fg-soft">Get in touch</div>
          <h2 className="mb-3.5 text-[clamp(26px,3.2vw,32px)] leading-[1.1]">
            Tell us what&apos;s slow.
            <br />
            We&apos;ll tell you what it takes to fix it.
          </h2>
          <p className="mb-6 text-[15px] text-fg-soft">
            Free 20-minute call, no obligation. Replies within one business day.
          </p>

          <div className="mb-2.5 flex items-center gap-2.5 text-[14.5px]">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 flex-none stroke-fg">
              <path d="M4 6h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            <a href="mailto:hello@bizuptechnologies.com" className="border-b border-rule">
              hello@bizuptechnologies.com
            </a>
          </div>
          <div className="mb-2.5 flex items-center gap-2.5 text-[14.5px]">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 flex-none stroke-fg">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C10 21 3 14 3 6a2 2 0 012-2z" />
            </svg>
            <a href="tel:+919182464926" className="border-b border-rule">
              +91 91824 64926
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-[14.5px]">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 flex-none stroke-fg">
              <path d="M3 12a9 9 0 1 1 3.5 7.1L3 20l1-3.4A9 9 0 0 1 3 12z" />
              <path d="M8.5 8.8c.3-.6 1-.6 1.4 0l.6 1.1c.2.4.1.9-.2 1.2l-.4.4c.5 1.1 1.4 2 2.5 2.5l.4-.4c.3-.3.8-.4 1.2-.2l1.1.6c.6.4.6 1.1 0 1.4-1.6 1-3.7.5-5.3-1.1-1.6-1.6-2.1-3.7-1.3-5.5z" />
            </svg>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="border-b border-rule">
              WhatsApp: +91 91824 64926
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
          <input type="hidden" name="subject" value="New project inquiry — BizUp Technologies" />
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[11.5px] tracking-[.02em] text-fg-soft">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-[10px] border border-glass-border-soft bg-white/35 px-3.5 py-2.5 text-[14.5px] text-fg placeholder:text-fg-faint focus:outline focus:outline-2 focus:outline-fg"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11.5px] tracking-[.02em] text-fg-soft">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="w-full rounded-[10px] border border-glass-border-soft bg-white/35 px-3.5 py-2.5 text-[14.5px] text-fg placeholder:text-fg-faint focus:outline focus:outline-2 focus:outline-fg"
              />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="mb-1.5 block text-[11.5px] tracking-[.02em] text-fg-soft">
              Project type
            </label>
            <select
              id="type"
              name="type"
              className="w-full rounded-[10px] border border-rule bg-shade px-3.5 py-2.5 text-[14.5px] text-fg focus:outline focus:outline-2 focus:outline-fg"
            >
              <option>Website</option>
              <option>Mobile / software app</option>
              <option>Business automation</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-[11.5px] tracking-[.02em] text-fg-soft">
              What do you need?
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="A couple of lines about the business and what you're stuck on."
              className="min-h-[90px] w-full resize-y rounded-[10px] border border-glass-border-soft bg-white/35 px-3.5 py-2.5 text-[14.5px] text-fg placeholder:text-fg-faint focus:outline focus:outline-2 focus:outline-fg"
            />
          </div>
          <LiquidButton type="submit" disabled={submitting} size="lg" className="mt-1 w-full">
            Send message
          </LiquidButton>
          <div
            role="status"
            className="min-h-4 text-[13px]"
            style={{ color: status.tone === "ok" ? "var(--ok)" : status.tone === "err" ? "var(--warn)" : undefined }}
          >
            {status.text}
          </div>
          <div className="mt-0.5 text-xs text-fg-faint">
            Sent directly via{" "}
            <a href="https://web3forms.com" target="_blank" rel="noopener" className="border-b border-rule">
              Web3Forms
            </a>{" "}
            — no backend needed. Swap in your own free access key to activate it.
          </div>
        </form>
      </GlassPanel>
    </section>
  );
}
