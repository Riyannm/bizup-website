import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ContactButton, GhostButton } from '../components/Buttons';

const ease = [0.25, 0.1, 0.25, 1] as const;

function Rise({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// The particles above the text form the word BIZUP (see data-stage).
export default function HeroSection() {
  return (
    <section
      id="top"
      data-stage="logo"
      data-y="0.17"
      data-mobile-y="0.2"
      data-mobile-dim="1"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 md:px-10"
    >
      <div id="intro" className="mx-auto w-full max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <Rise delay={1.4}>
              <span className="eyebrow">Websites · Apps · Automation</span>
            </Rise>
            <Rise delay={1.55}>
              <h1
                className="display mt-5 font-semibold leading-[1.02] tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 5.2vw, 5rem)' }}
              >
                Software that runs
                <br />
                your business.
              </h1>
            </Rise>
          </div>
          <Rise delay={1.75} className="flex flex-col gap-6 lg:pb-3">
            <p className="max-w-md font-light leading-relaxed text-[#E6EEF5]/70" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}>
              Smart digital solutions built for businesses ready to level up. You work directly with the person
              building it.
            </p>
            <div className="flex flex-wrap gap-3">
              <ContactButton href="#contact">Get a free quote</ContactButton>
              <GhostButton href="#work">See our work</GhostButton>
            </div>
          </Rise>
        </div>

        <Rise delay={2.1} className="mt-12 hidden items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#E6EEF5]/45 sm:flex">
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15"
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
          Scroll
        </Rise>
      </div>
    </section>
  );
}
