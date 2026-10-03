import FadeIn from '../components/FadeIn';
import ScrollText from '../components/ScrollText';
import { ABOUT_FACTS, ABOUT_TEXT } from '../data';

export default function AboutSection() {
  return (
    <section
      id="about"
      data-stage="globe"
      data-side="right"
      data-spin="0.12"
      className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-8 md:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="lg:max-w-[56%]">
          <FadeIn y={20}>
            <span className="eyebrow">About BizUp</span>
          </FadeIn>
          <ScrollText
            text={ABOUT_TEXT}
            className="mt-6 font-medium leading-[1.2] tracking-tight text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.3vw, 2.9rem)' }}
          />
          <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4">
            {ABOUT_FACTS.map(({ label, value }, i) => (
              <FadeIn key={label} delay={i * 0.08} y={24} className="glass rounded-3xl p-5 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#4FC3FF]">{label}</dt>
                <dd className="mt-2 text-base font-medium text-white sm:text-lg">{value}</dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
