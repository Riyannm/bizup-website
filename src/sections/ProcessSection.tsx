import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import { PROCESS } from '../data';

export default function ProcessSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.7', 'end 0.6'] });

  return (
    <section
      id="process"
      data-stage="helix"
      data-side="right"
      data-spin="0.35"
      className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-8 md:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="lg:max-w-[52%]">
          <FadeIn y={20}>
            <span className="eyebrow">How it works</span>
          </FadeIn>
          <FadeIn y={30} delay={0.05}>
            <h2 className="display mt-5 font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}>
              From first call to launch.
            </h2>
          </FadeIn>

          <ol ref={listRef} className="relative mt-14 flex flex-col gap-12 pl-14 sm:pl-16">
            <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-white/10" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
              className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-[#4FC3FF] to-[#1E7BEA] shadow-[0_0_12px_#4FC3FF]"
            />
            {PROCESS.map((step, i) => (
              <FadeIn as="li" key={step.title} delay={i * 0.1} y={24} className="relative">
                <span className="glass absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded-full text-sm font-medium tabular-nums text-[#4FC3FF] sm:-left-16">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-medium text-white sm:text-2xl">{step.title}</h3>
                <p className="mt-3 max-w-md font-light leading-relaxed text-[#E6EEF5]/70">{step.body}</p>
              </FadeIn>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
