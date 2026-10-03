import FadeIn from '../components/FadeIn';
import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import PanelBody from '../components/PanelBody';
import { PROJECTS } from '../data';

export function ProjectPanel({ index }: { index: number }) {
  const project = PROJECTS[index];
  return (
    <PanelBody>
      <FadeIn y={16} className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="label">
          <b>(05.{index + 1})</b> Selected work
        </span>
        <span className="text-xs text-ink/45">Client names kept private · previews use sample data</span>
      </FadeIn>
      <FadeIn y={40} delay={0.05}>
        <article className="card grid gap-6 rounded-[28px] p-4 sm:rounded-[32px] sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-8">
          <div className="flex flex-col gap-3 px-2 pt-2 sm:px-3 lg:pt-0">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50">{project.category}</span>
            <h2 className="headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3rem)' }}>
              {project.name}
            </h2>
            <p className="line-clamp-3 text-[15px] leading-relaxed text-ink/65 sm:line-clamp-none sm:text-base">{project.description}</p>
            <ul className="mt-1 flex flex-wrap gap-2" aria-label="Features">
              {project.features.map((f) => (
                <li key={f} className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink/75">
                  {f}
                </li>
              ))}
            </ul>
            <GhostButton href="#enquiry" className="mt-3 hidden self-start sm:inline-flex">
              Build one like it
            </GhostButton>
          </div>
          {/* The previews are little dark app screens, framed like a device. */}
          <div className="rounded-[22px] bg-ink p-2 sm:rounded-[26px] sm:p-3">
            <div className="h-[24svh] min-h-[150px] sm:h-[clamp(200px,min(30vw,36svh),420px)]">
              <WorkVisual type={project.visual} />
            </div>
          </div>
        </article>
      </FadeIn>
    </PanelBody>
  );
}
