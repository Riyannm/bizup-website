import WorkVisual from '../components/WorkVisuals';
import { GhostButton } from '../components/Buttons';
import PanelBody from '../components/PanelBody';
import { PROJECTS } from '../data';

export function ProjectPanel({ index }: { index: number }) {
  const project = PROJECTS[index];
  return (
    <PanelBody glass={false}>
      <article className="card grid gap-6 rounded-[28px] p-4 sm:rounded-[36px] sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-8">
        <div className="flex flex-col gap-3 px-2 pt-2 sm:px-3 lg:pt-0">
          <span className="label">
            <b>(05.{index + 1})</b> Selected work
          </span>
          <span className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-ink/50">{project.category}</span>
          <h2 className="headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3rem)' }}>
            {project.name}
          </h2>
          <p className="line-clamp-3 text-[15px] leading-relaxed text-ink/70 sm:line-clamp-none sm:text-base">{project.description}</p>
          <ul className="mt-1 flex flex-wrap gap-2" aria-label="Features">
            {project.features.map((f) => (
              <li key={f} className="rounded-full border border-ink/10 bg-paper/60 px-3 py-1.5 text-xs font-medium text-ink/80">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <GhostButton href="#enquiry" className="hidden sm:inline-flex">
              Build one like it
            </GhostButton>
            <span className="text-xs text-ink/45">Client name kept private · sample data</span>
          </div>
        </div>
        {/* The previews are little dark app screens, framed like a device. */}
        <div className="rounded-[22px] bg-black p-2 ring-1 ring-white/10 sm:rounded-[26px] sm:p-3">
          <div className="h-[24svh] min-h-[150px] sm:h-[clamp(200px,min(30vw,36svh),420px)]">
            <WorkVisual type={project.visual} />
          </div>
        </div>
      </article>
    </PanelBody>
  );
}
