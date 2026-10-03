import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import FadeIn from '../components/FadeIn';
import PanelBody from '../components/PanelBody';
import { FAQS } from '../data';

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <FadeIn as="li" delay={index * 0.06} y={20} className="border-b border-ink/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 sm:py-6 text-left transition-colors duration-200 hover:text-cobalt"
        >
          <span className="font-medium tracking-tight" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)' }}>
            {q}
          </span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-cobalt group-hover:text-cobalt">
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
              className="max-w-3xl pb-6 sm:pb-8 pr-14 leading-relaxed text-ink/65"
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
    <PanelBody>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <FadeIn y={16}>
            <span className="label">
              <b>(07)</b> FAQ
            </span>
          </FadeIn>
          <FadeIn y={30} delay={0.05}>
            <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}>
              Before you <em>reach out</em>.
            </h2>
          </FadeIn>
        </div>
        <ul className="border-t border-ink/15">
          {FAQS.map(({ q, a }, i) => (
            <FaqItem key={q} q={q} a={a} index={i} />
          ))}
        </ul>
      </div>
    </PanelBody>
  );
}
