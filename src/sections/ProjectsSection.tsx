import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import { PROJECTS, type Project } from '../data';

const VISUAL_HEIGHT = 'clamp(200px, min(30vw, 38svh), 440px)';
const COUNT = PROJECTS.length;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="glass grid h-full gap-5 rounded-[28px] p-4 sm:rounded-[36px] sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-8">
      <div className="flex flex-col gap-2.5 px-2 pt-2 sm:gap-3 sm:px-3 lg:pt-0">
        <span className="accent-text font-black leading-none tabular-nums" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-white/55">{project.category}</span>
        <h3 className="font-semibold leading-tight tracking-tight text-white" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.2rem)' }}>
          {project.name}
        </h3>
        <p className="line-clamp-3 font-light leading-relaxed text-white/70 sm:line-clamp-none" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
          {project.description}
        </p>
        <ul className="mt-1 flex flex-wrap gap-2" aria-label="Features">
          {project.features.map((f) => (
            <li key={f} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
              {f}
            </li>
          ))}
        </ul>
        <GhostButton href="#contact" className="mt-3 hidden self-start sm:inline-flex">
          Build one like it
        </GhostButton>
      </div>
      <div style={{ height: VISUAL_HEIGHT }}>
        <WorkVisual type={project.visual} />
      </div>
    </article>
  );
}

/** Card width and wheel radius follow the viewport, so the curve looks the same on any screen. */
function useWheelSize() {
  const measure = () => {
    const vw = window.innerWidth;
    const card = Math.min(1080, vw * (vw < 768 ? 0.84 : 0.8));
    const gap = vw < 768 ? 40 : 150;
    const radius = card * 1.45;
    return { card, radius, step: ((card + gap) / radius) * (180 / Math.PI) };
  };
  const [size, setSize] = useState(measure);
  useEffect(() => {
    const onResize = () => setSize(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

function WheelCard({
  project,
  index,
  turn,
  step,
  radius,
}: {
  project: Project;
  index: number;
  turn: MotionValue<number>;
  step: number;
  radius: number;
}) {
  // Distance from the front of the wheel, in cards.
  const distance = useTransform(turn, (t) => Math.abs(index - t));
  const opacity = useTransform(distance, [0, 1, 2], [1, 0.45, 0.12]);
  const brightness = useTransform(distance, [0, 1], ['brightness(1)', 'brightness(0.55)']);

  return (
    <motion.div
      style={{
        gridArea: '1 / 1',
        transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
        backfaceVisibility: 'hidden',
        opacity,
        filter: brightness,
      }}
    >
      <ProjectCard project={project} index={index} />
    </motion.div>
  );
}

function Wheel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { card, radius, step } = useWheelSize();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  // Hold briefly on the first and last card so each gets a moment at the front.
  const turn = useTransform(scrollYProgress, [0.06, 0.94], [0, COUNT - 1], { clamp: true });
  const rotateY = useTransform(turn, (t) => -t * step);
  const bar = useTransform(scrollYProgress, [0.06, 0.94], ['0%', '100%'], { clamp: true });
  const [active, setActive] = useState(0);
  useMotionValueEvent(turn, 'change', (t) => setActive(Math.round(t)));

  return (
    <div ref={trackRef} style={{ height: `${COUNT * 100}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden pb-16 pt-20" style={{ perspective: 2200 }}>
        <motion.div
          className="grid"
          style={{ width: card, transformStyle: 'preserve-3d', z: -radius, rotateY }}
        >
          {PROJECTS.map((project, i) => (
            <WheelCard key={project.name} project={project} index={i} turn={turn} step={step} radius={radius} />
          ))}
        </motion.div>

        <div className="absolute inset-x-0 bottom-6 mx-auto flex w-full max-w-6xl items-center gap-5 px-5 sm:bottom-8 sm:px-8">
          <span className="text-sm font-medium tabular-nums text-white">
            {String(active + 1).padStart(2, '0')}
            <span className="text-white/40"> / {String(COUNT).padStart(2, '0')}</span>
          </span>
          <div className="relative h-px flex-1 bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 bg-[#3D7BFF] shadow-[0_0_10px_#3D7BFF]" style={{ width: bar }} />
          </div>
          <span className="hidden max-w-[40%] truncate text-xs uppercase tracking-[0.2em] text-white/55 sm:block">
            {PROJECTS[active].name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const reduced = useReducedMotion();

  return (
    <section id="work" data-stage="bars" data-spin="0.1" data-dim="0.3" data-mobile-dim="0.22" className="relative pt-28">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <FadeIn y={20}>
          <span className="eyebrow">Selected work</span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <h2 className="display mt-5 font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}>
            Real systems, shipped.
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.1}>
          <p className="mt-5 font-light leading-relaxed text-white/70" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
            Client names are kept private, but every build below is real, working software. The previews use sample
            data.
          </p>
        </FadeIn>
      </div>

      {reduced ? (
        <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-8 px-4 pb-28 sm:px-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      ) : (
        <Wheel />
      )}
    </section>
  );
}
