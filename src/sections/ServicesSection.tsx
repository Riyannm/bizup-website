import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import PanelBody from '../components/PanelBody';
import { PRINCIPLES, SERVICES } from '../data';

// A one-word italic accent for each service heading.
const ACCENTS = ['web', 'apps', 'automation'];

function Accented({ text, word }: { text: string; word: string }) {
  const at = text.toLowerCase().indexOf(word);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em>{text.slice(at, at + word.length)}</em>
      {text.slice(at + word.length)}
    </>
  );
}

// Panels alternate sides as the camera circles the island.
export function ServicePanel({ index }: { index: number }) {
  const service = SERVICES[index];
  return (
    <PanelBody side={index % 2 === 0 ? 'right' : 'left'}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="label">
          <b>(03.{index + 1})</b> What we build
        </span>
        <span className="text-sm tabular-nums text-ink/45">
          {String(index + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
        </span>
      </div>
      <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.6rem)' }}>
        <Accented text={service.name} word={ACCENTS[index]} />
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink/70 sm:text-xl">{service.description}</p>
      {service.includes.length > 0 && (
        <ul className="mt-8 border-t border-ink/15">
          {service.includes.map((item, i) => (
            <FadeIn
              as="li"
              key={item}
              delay={0.25 + i * 0.07}
              y={12}
              className="flex items-center justify-between border-b border-ink/15 py-3.5 text-[15px] font-medium sm:text-base"
            >
              {item}
              <ArrowUpRight className="h-4 w-4 text-cobalt" aria-hidden="true" />
            </FadeIn>
          ))}
        </ul>
      )}
    </PanelBody>
  );
}

export function PrinciplesPanel() {
  return (
    <PanelBody glass={false}>
      <div className="card rounded-[28px] p-6 sm:rounded-[36px] sm:p-10 lg:w-[62%]">
        <span className="label">
          <b>(04)</b> How we work
        </span>
        <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.6rem)' }}>
          Built around <em>your</em> business.
        </h2>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <FadeIn key={p.title} delay={0.15 + i * 0.12} y={30} className="card rounded-[24px] p-6 sm:rounded-[28px] sm:p-8">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-cobalt">{p.eyebrow}</span>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight sm:text-xl">{p.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{p.body}</p>
          </FadeIn>
        ))}
      </div>
    </PanelBody>
  );
}
