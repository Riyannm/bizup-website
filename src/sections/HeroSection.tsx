import { motion } from 'framer-motion';
import { ContactButton, GhostButton } from '../components/Buttons';
import DaytimeToggle from '../components/DaytimeToggle';
import { useRevealed } from '../loader';

const ease = [0.22, 1, 0.36, 1] as const;

// Waits for the loader to open, then slides up from behind a mask.
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const revealed = useRevealed();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={revealed ? { y: '0%' } : undefined}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Fade({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const revealed = useRevealed();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Sits over the live scene (see LiveScene), so the type is white with a soft shade behind it.
export default function HeroSection() {
  return (
    <div className="relative min-h-[100svh]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-8 pt-24 text-white sm:px-8 sm:pb-12 md:px-10">
        <div id="intro" className="[text-shadow:0_2px_24px_rgba(0,0,0,0.25)]">
          <Fade delay={0.35}>
            <span className="label !text-white/80 [&>b]:!text-white">
              <b>(01)</b> BizUp Technologies
            </span>
          </Fade>
          <h1 className="headline mt-5 max-w-4xl [&_em]:!text-white" style={{ fontSize: 'clamp(2.75rem, 7.6vw, 7.6rem)' }}>
            <Line delay={0.4}>Software that</Line>
            <Line delay={0.5}>
              <em>runs</em> your
            </Line>
            <Line delay={0.6}>business.</Line>
          </h1>
          <div className="mt-6 flex flex-col gap-5 border-t border-white/25 pt-5 sm:mt-10 sm:gap-8 sm:pt-6 lg:flex-row lg:items-center lg:justify-between">
            <Fade delay={0.85}>
              <p className="max-w-md text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
                Websites, apps and automation for small and growing businesses. You work directly with the person
                building it.
              </p>
            </Fade>
            <Fade delay={0.95} className="flex flex-wrap items-center gap-3">
              <ContactButton href="#enquiry" tone="light">
                Get a free quote
              </ContactButton>
              <GhostButton href="#work" className="!border-white/40 !text-white hover:!bg-white hover:!text-ink">
                See our work
              </GhostButton>
            </Fade>
          </div>
          <Fade delay={1.1} className="mt-6 flex justify-start lg:justify-end">
            <DaytimeToggle />
          </Fade>
        </div>
      </div>
    </div>
  );
}
