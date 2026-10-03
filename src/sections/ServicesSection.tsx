import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import { PRINCIPLES, SERVICES } from '../data';

const SHAPES = ['browser', 'phone', 'gear'] as const;
const SHORT = ['Web', 'Apps', 'Automation'];

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  // Highlight the tab for whichever service crosses the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    blocks.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="relative px-5 pt-28 sm:px-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={20}>
          <span className="eyebrow">What we build</span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <h2 className="display mt-5 max-w-3xl font-semibold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}>
            Websites, apps &amp; automation.
          </h2>
        </FadeIn>

        <div className="sticky top-[84px] z-20 mt-10 sm:top-[96px]">
          <ul className="glass inline-flex gap-1 rounded-full p-1.5" aria-label="Services">
            {SERVICES.map((s, i) => (
              <li key={s.name}>
                <a
                  href={`#service-${i + 1}`}
                  aria-current={active === i ? 'true' : undefined}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-xs font-medium uppercase tracking-widest transition-colors duration-300 sm:px-5 sm:text-sm ${
                    active === i ? 'bg-white text-[#000000]' : 'text-[#FFFFFF]/70 hover:text-white'
                  }`}
                >
                  <span className="tabular-nums opacity-60">0{i + 1}</span>
                  {SHORT[i]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {SERVICES.map((service, i) => (
          <article
            key={service.name}
            id={`service-${i + 1}`}
            ref={(el) => {
              blocks.current[i] = el;
            }}
            data-index={i}
            data-stage={SHAPES[i]}
            data-side="right"
            className="flex min-h-[100svh] items-center py-24"
          >
            <div className="lg:max-w-[50%]">
              <FadeIn y={30}>
                <span
                  className="block font-black leading-none tabular-nums"
                  style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(61,123,255,0.55)' }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-semibold tracking-tight text-white" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}>
                  {service.name}
                </h3>
              </FadeIn>
              <FadeIn y={20} delay={0.1}>
                <p className="mt-5 max-w-lg font-light leading-relaxed text-[#FFFFFF]/70" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)' }}>
                  {service.description}
                </p>
              </FadeIn>
              {service.includes.length > 0 && (
                <FadeIn as="ul" y={20} delay={0.2} className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  {service.includes.map((item) => (
                    <li key={item} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[#FFFFFF]/90">
                      <Check className="h-4 w-4 shrink-0 text-[#3D7BFF]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </FadeIn>
              )}
            </div>
          </article>
        ))}

        <div className="grid gap-4 pb-28 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1} y={30} className="glass rounded-[28px] p-7 sm:rounded-[36px] sm:p-10">
              <span className="eyebrow">{p.eyebrow}</span>
              <h3 className="mt-4 text-xl font-medium leading-snug text-white sm:text-2xl">{p.title}</h3>
              <p className="mt-4 font-light leading-relaxed text-[#FFFFFF]/65">{p.body}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
