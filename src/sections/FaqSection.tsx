import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import FadeIn from '../components/FadeIn';
import { FAQS } from '../data';

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <FadeIn as="li" delay={index * 0.06} y={20} className="glass rounded-3xl px-5 sm:px-8">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 sm:py-6 text-left text-white transition-opacity duration-200 hover:opacity-80"
        >
          <span className="font-medium" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)' }}>
            {q}
          </span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-[#4FC3FF]">
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
              className="max-w-3xl pb-6 sm:pb-8 pr-14 font-light leading-relaxed text-[#E6EEF5]/70"
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
      data-stage="ring"
      data-spin="0.15"
      data-dim="0.35"
      data-mobile-dim="0.25"
      className="relative px-5 py-28 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn y={20}>
          <span className="eyebrow">FAQ</span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <h2 className="display mt-5 font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}>
            Before you reach out.
          </h2>
        </FadeIn>
      </div>
      <ul className="mx-auto mt-14 flex max-w-4xl flex-col gap-3">
        {FAQS.map(({ q, a }, i) => (
          <FaqItem key={q} q={q} a={a} index={i} />
        ))}
      </ul>
    </section>
  );
}
