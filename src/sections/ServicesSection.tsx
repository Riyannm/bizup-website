import { Check } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { PRINCIPLES, SERVICES } from '../data';

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32 sm:pb-36 md:pb-44"
    >
      <FadeIn y={40}>
        <h2
          className="mb-6 text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mb-16 sm:mb-20 md:mb-28 max-w-xl text-center font-light leading-relaxed text-[#0C0C0C]/70"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
        >
          Most clients start with one of these and grow into the others as the business scales.
        </p>
      </FadeIn>

      <ul className="mx-auto max-w-5xl">
        {SERVICES.map(({ name, description, includes }, i) => (
          <FadeIn
            as="li"
            key={name}
            delay={i * 0.1}
            className="flex items-start gap-5 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
            style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)', borderBottom: i === SERVICES.length - 1 ? '1px solid rgba(12, 12, 12, 0.15)' : undefined }}
          >
            <span
              className="shrink-0 font-black leading-none tabular-nums text-[#0C0C0C]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 sm:gap-3 pt-1 sm:pt-3">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {name}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)', opacity: 0.7 }}
              >
                {description}
              </p>
              {includes.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${name} includes`}>
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#0C0C0C]/15 px-3 py-1 text-xs sm:text-sm"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>
        ))}
      </ul>

      <div className="mx-auto mt-20 sm:mt-24 md:mt-32 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
        {PRINCIPLES.map(({ eyebrow, title, body }, i) => (
          <FadeIn key={eyebrow} delay={i * 0.1} className="flex flex-col gap-3">
            <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[#0C0C0C]/55">{eyebrow}</span>
            <h3 className="font-semibold leading-tight" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2rem)' }}>
              {title}
            </h3>
            <p className="font-light leading-relaxed text-[#0C0C0C]/70" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)' }}>
              {body}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
