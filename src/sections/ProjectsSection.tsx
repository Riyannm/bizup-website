import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import { PROJECTS, type Project } from '../data';

// Width-driven height, also capped by viewport height so a stuck card fits on short screens.
const VISUAL_HEIGHT = 'clamp(330px, min(36vw, 44vh), 520px)';

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 md:top-32 h-[85vh] min-h-[640px]">
      <div>
        <motion.article
          style={{ scale: reducedMotion ? 1 : scale, top: index * 28, transformOrigin: 'top center' }}
          className="relative rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8"
        >
          <div className="mb-4 sm:mb-6 md:mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-8 px-2 sm:px-4">
            <span className="hero-heading font-black leading-none tabular-nums" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/60">{project.category}</span>
              <h3 className="font-medium uppercase leading-tight text-[#D7E2EA]" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}>
                {project.name}
              </h3>
              <p
                className="line-clamp-3 sm:line-clamp-none max-w-2xl font-light leading-relaxed text-[#D7E2EA]/70"
                style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)' }}
              >
                {project.description}
              </p>
              <ul className="mt-1 hidden flex-wrap gap-2 sm:flex" aria-label="Features">
                {project.features.map((f) => (
                  <li key={f} className="rounded-full border border-[#D7E2EA]/25 px-3 py-1 text-xs text-[#D7E2EA]/80">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <GhostButton href="#contact" className="hidden lg:inline-flex">
              Build one like it
            </GhostButton>
          </div>

          <div style={{ height: VISUAL_HEIGHT }}>
            <WorkVisual type={project.visual} />
          </div>
        </motion.article>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start start', 'end end'] });

  return (
    <section
      id="work"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24 sm:pb-32 md:pb-40"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Work
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mt-6 max-w-xl text-center font-light leading-relaxed text-[#D7E2EA]/75"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
        >
          Real systems we&apos;ve shipped. Client names are kept private, but every build below is real, working
          software. The previews use sample data.
        </p>
      </FadeIn>

      <div ref={listRef} className="mx-auto mt-12 sm:mt-16 max-w-6xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
