import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import PanelBody from '../components/PanelBody';
import { PROCESS } from '../data';

export default function ProcessSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.8', 'end 0.5'] });

  return (
    <PanelBody side="left">
      <span className="label">
        <b>(06)</b> Process
      </span>
      <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}>
        From first call to <em>launch</em>.
      </h2>

      <ol ref={listRef} className="relative mt-10 flex flex-col gap-8 pl-16">
        <span aria-hidden="true" className="absolute bottom-2 left-[21px] top-2 w-px bg-ink/15" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
          className="absolute bottom-2 left-[21px] top-2 w-[2px] origin-top bg-cobalt"
        />
        {PROCESS.map((step, i) => (
          <FadeIn as="li" key={step.title} delay={0.2 + i * 0.12} y={24} className="relative">
            <span className="absolute -left-16 top-0 grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-medium tabular-nums text-paper">
              0{i + 1}
            </span>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/65 sm:text-base">{step.body}</p>
          </FadeIn>
        ))}
      </ol>
    </PanelBody>
  );
}
