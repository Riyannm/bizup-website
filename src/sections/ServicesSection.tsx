import { Check } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import PanelBody from '../wheel/PanelBody';
import { PRINCIPLES, SERVICES } from '../data';

export function ServicePanel({ index }: { index: number }) {
  const service = SERVICES[index];
  return (
    <PanelBody>
      <div className="lg:max-w-[50%]">
        <FadeIn y={20}>
          <span className="eyebrow">
            What we build · {String(index + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
          </span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <span
            className="mt-4 block font-black leading-none tabular-nums"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 8.5rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(61,123,255,0.6)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="mt-3 font-semibold tracking-tight text-white" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}>
            {service.name}
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.1}>
          <p className="mt-4 max-w-lg font-light leading-relaxed text-white/70" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            {service.description}
          </p>
        </FadeIn>
        {service.includes.length > 0 && (
          <FadeIn as="ul" y={20} delay={0.2} className="mt-6 grid gap-2.5 sm:mt-8 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/90">
                <Check className="h-4 w-4 shrink-0 text-[#3D7BFF]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </FadeIn>
        )}
      </div>
    </PanelBody>
  );
}

export function PrinciplesPanel() {
  return (
    <PanelBody>
      <FadeIn y={20}>
        <span className="eyebrow">How we work</span>
      </FadeIn>
      <FadeIn y={30} delay={0.05}>
        <h2 className="display mt-4 max-w-3xl font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2rem, 4.6vw, 4rem)' }}>
          Built around your business.
        </h2>
      </FadeIn>
      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <FadeIn key={p.title} delay={0.1 + i * 0.1} y={30} className="glass rounded-[28px] p-6 sm:rounded-[36px] sm:p-10">
            <span className="eyebrow">{p.eyebrow}</span>
            <h3 className="mt-3 text-lg font-medium leading-snug text-white sm:mt-4 sm:text-2xl">{p.title}</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-white/65 sm:mt-4 sm:text-base">{p.body}</p>
          </FadeIn>
        ))}
      </div>
    </PanelBody>
  );
}
