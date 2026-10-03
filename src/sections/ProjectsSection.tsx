import FadeIn from '../components/FadeIn';
import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import PanelBody from '../components/PanelBody';
import { PROJECTS } from '../data';


export function ProjectPanel({ index }: { index: number }) {
  const project = PROJECTS[index];
  return (
    <PanelBody>
      <FadeIn y={20} className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 sm:mb-6">
        <span className="eyebrow">
          Selected work · {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </span>
        <span className="text-xs text-white/45">Client names kept private · previews use sample data</span>
      </FadeIn>
      <FadeIn y={40} delay={0.05}>
        <article className="glass grid gap-5 rounded-[28px] p-4 sm:rounded-[36px] sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-8">
          <div className="flex flex-col gap-2.5 px-2 pt-2 sm:gap-3 sm:px-3 lg:pt-0">
            <span className="accent-text font-black leading-none tabular-nums" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">{project.category}</span>
            <h2 className="font-semibold leading-tight tracking-tight text-white" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.2rem)' }}>
              {project.name}
            </h2>
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
            <GhostButton href="#enquiry" className="mt-3 hidden self-start sm:inline-flex">
              Build one like it
            </GhostButton>
          </div>
          <div className="h-[24svh] min-h-[150px] sm:h-[clamp(200px,min(30vw,36svh),420px)]">
            <WorkVisual type={project.visual} />
          </div>
        </article>
      </FadeIn>
    </PanelBody>
  );
}
