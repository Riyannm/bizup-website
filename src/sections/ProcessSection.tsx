import { motion, useReducedMotion, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import PanelBody from '../wheel/PanelBody';
import { usePanel } from '../wheel/state';
import { PROCESS } from '../data';

function Line() {
  const panel = usePanel();
  const reduced = useReducedMotion();
  // Fills as the panel turns to the front.
  const fill = useTransform(panel!.local, [-0.6, 0], [0, 1], { clamp: true });
  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleY: reduced ? 1 : fill }}
      className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-[#3D7BFF] to-[#0047AB] shadow-[0_0_12px_#3D7BFF]"
    />
  );
}

export default function ProcessSection() {
  const panel = usePanel();
  return (
    <PanelBody>
      <div className="lg:max-w-[52%]">
        <FadeIn y={20}>
          <span className="eyebrow">How it works</span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <h2 className="display mt-4 font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2rem, 4.8vw, 4.2rem)' }}>
            From first call to launch.
          </h2>
        </FadeIn>

        <ol className="relative mt-8 flex flex-col gap-7 pl-14 sm:mt-12 sm:gap-10 sm:pl-16">
          <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-white/10" />
          {panel ? (
            <Line />
          ) : (
            <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-[#3D7BFF] to-[#0047AB]" />
          )}
          {PROCESS.map((step, i) => (
            <FadeIn as="li" key={step.title} delay={0.15 + i * 0.12} y={24} className="relative">
              <span className="glass absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded-full text-sm font-medium tabular-nums text-[#3D7BFF] sm:-left-16">
                0{i + 1}
              </span>
              <h3 className="text-lg font-medium text-white sm:text-2xl">{step.title}</h3>
              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/70 sm:mt-3 sm:text-base">{step.body}</p>
            </FadeIn>
          ))}
        </ol>
      </div>
    </PanelBody>
  );
}
