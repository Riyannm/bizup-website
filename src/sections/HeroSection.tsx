import { motion } from 'framer-motion';
import { ContactButton, GhostButton } from '../components/Buttons';
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

// The 3D blocks sit to the right (see the panel's data-stage).
export default function HeroSection() {
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 md:px-10">
      <div id="intro">
        <Fade delay={0.35}>
          <span className="label">
            <b>(01)</b> BizUp Technologies
          </span>
        </Fade>
        <h1 className="headline mt-5 max-w-4xl" style={{ fontSize: 'clamp(3rem, 7.6vw, 7.6rem)' }}>
          <Line delay={0.4}>Software that</Line>
          <Line delay={0.5}>
            <em>runs</em> your
          </Line>
          <Line delay={0.6}>business.</Line>
        </h1>
        <div className="mt-10 flex flex-col gap-8 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Fade delay={0.85}>
            <p className="max-w-md text-[17px] leading-relaxed text-ink/65">
              Websites, apps and automation for small and growing businesses. You work directly with the person
              building it.
            </p>
          </Fade>
          <Fade delay={0.95} className="flex flex-wrap gap-3">
            <ContactButton href="#enquiry">Get a free quote</ContactButton>
            <GhostButton href="#work">See our work</GhostButton>
          </Fade>
        </div>
      </div>
    </div>
  );
}
