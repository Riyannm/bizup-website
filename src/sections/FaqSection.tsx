import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import FadeIn from '../components/FadeIn';
import { FAQS } from '../data';

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <FadeIn as="li" delay={index * 0.06} y={20} className="border-b border-[#D7E2EA]/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 sm:py-8 text-left text-[#D7E2EA] transition-opacity duration-200 hover:opacity-80"
        >
          <span className="font-medium" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.6rem)' }}>
            {q}
          </span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#D7E2EA]/60">
            <Plus
              className="h-5 w-5 transition-transform duration-300"
              style={{ transform: open ? 'rotate(45deg)' : 'none' }}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p
              className="max-w-3xl pb-7 sm:pb-9 pr-14 font-light leading-relaxed text-[#D7E2EA]/75"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)' }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  );
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative z-30 -mt-10 sm:-mt-12 md:-mt-14 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32 sm:pb-36 md:pb-44"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          FAQ
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mt-6 mb-12 sm:mb-16 max-w-xl text-center font-light leading-relaxed text-[#D7E2EA]/75"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
        >
          Before you reach out.
        </p>
      </FadeIn>
      <ul className="mx-auto max-w-4xl border-t border-[#D7E2EA]/15">
        {FAQS.map(({ q, a }, i) => (
          <FaqItem key={q} q={q} a={a} index={i} />
        ))}
      </ul>
    </section>
  );
}
