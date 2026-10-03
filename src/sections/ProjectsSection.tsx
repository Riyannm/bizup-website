import FadeIn from '../components/FadeIn';
import TiltCard from '../components/TiltCard';
import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import { PROJECTS, type Project } from '../data';

const VISUAL_HEIGHT = 'clamp(320px, min(34vw, 46vh), 460px)';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <FadeIn y={60} duration={0.9}>
      <TiltCard>
        <article className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-8">
          <div className="flex flex-col gap-3 px-2 pt-2 sm:px-3 lg:pt-0">
            <span className="accent-text font-black leading-none tabular-nums" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]/55">{project.category}</span>
            <h3 className="font-semibold leading-tight tracking-tight text-white" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)' }}>
              {project.name}
            </h3>
            <p className="font-light leading-relaxed text-[#FFFFFF]/70" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)' }}>
              {project.description}
            </p>
            <ul className="mt-1 flex flex-wrap gap-2" aria-label="Features">
              {project.features.map((f) => (
                <li key={f} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-[#FFFFFF]/80">
                  {f}
                </li>
              ))}
            </ul>
            <GhostButton href="#contact" className="mt-3 self-start">
              Build one like it
            </GhostButton>
          </div>
          <div style={{ height: VISUAL_HEIGHT }}>
            <WorkVisual type={project.visual} />
          </div>
        </article>
      </TiltCard>
    </FadeIn>
  );
}

export default function ProjectsSection() {
  return (
    <section id="work" data-stage="bars" data-spin="0.1" data-dim="0.3" data-mobile-dim="0.22" className="relative px-4 py-28 sm:px-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn y={20}>
            <span className="eyebrow">Selected work</span>
          </FadeIn>
          <FadeIn y={30} delay={0.05}>
            <h2 className="display mt-5 font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}>
              Real systems, shipped.
            </h2>
          </FadeIn>
          <FadeIn y={20} delay={0.1}>
            <p className="mt-5 font-light leading-relaxed text-[#FFFFFF]/70" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
              Client names are kept private, but every build below is real, working software. The previews use sample
              data.
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 flex flex-col gap-8 sm:gap-10">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
