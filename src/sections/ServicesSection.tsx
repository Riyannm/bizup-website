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

export function ServicePanel({ index }: { index: number }) {
  const service = SERVICES[index];
  return (
    <PanelBody className={index > 0 ? '!pt-0' : ''}>
      <div className="grid gap-8 border-t border-ink/15 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-14">
        <div>
          <FadeIn y={16}>
            <span className="label">
              <b>(03.{index + 1})</b> What we build
            </span>
          </FadeIn>
          <FadeIn y={30} delay={0.05}>
            <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.4rem)' }}>
              <Accented text={service.name} word={ACCENTS[index]} />
            </h2>
          </FadeIn>
        </div>
        <div className="lg:pt-12">
          <FadeIn y={20} delay={0.12}>
            <p className="text-lg leading-relaxed text-ink/65 sm:text-xl">{service.description}</p>
          </FadeIn>
          {service.includes.length > 0 && (
            <FadeIn as="ul" y={20} delay={0.2} className="mt-8 border-t border-ink/10">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between border-b border-ink/10 py-3.5 text-[15px] font-medium sm:text-base"
                >
                  {item}
                  <ArrowUpRight className="h-4 w-4 text-cobalt" aria-hidden="true" />
                </li>
              ))}
            </FadeIn>
          )}
          <FadeIn y={10} delay={0.25}>
            <p className="mt-8 text-sm text-ink/45 tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </p>
          </FadeIn>
        </div>
      </div>
    </PanelBody>
  );
}

export function PrinciplesPanel() {
  return (
    <PanelBody>
      <FadeIn y={16}>
        <span className="label">
          <b>(04)</b> How we work
        </span>
      </FadeIn>
      <FadeIn y={30} delay={0.05}>
        <h2 className="headline mt-6 max-w-3xl" style={{ fontSize: 'clamp(2.4rem, 5.4vw, 4.8rem)' }}>
          Built around <em>your</em> business.
        </h2>
      </FadeIn>
      <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <FadeIn key={p.title} delay={0.1 + i * 0.1} y={30} className="card rounded-[24px] p-6 sm:rounded-[28px] sm:p-8">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-cobalt">{p.eyebrow}</span>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight sm:text-xl">{p.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{p.body}</p>
          </FadeIn>
        ))}
      </div>
    </PanelBody>
  );
}
