import FadeIn from '../components/FadeIn';
import ScrollText from '../components/ScrollText';
import PanelBody from '../components/PanelBody';
import { ABOUT_FACTS, ABOUT_TEXT } from '../data';

export default function AboutSection() {
  return (
    <PanelBody>
      <div className="lg:max-w-[58%]">
        <FadeIn y={16}>
          <span className="label">
            <b>(02)</b> About
          </span>
        </FadeIn>
        <ScrollText
          text={ABOUT_TEXT}
          className="mt-6 font-medium leading-[1.15] tracking-[-0.03em] text-ink"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.7rem)' }}
        />
      </div>
      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 lg:max-w-[58%]">
        {ABOUT_FACTS.map(({ label, value }, i) => (
          <FadeIn key={label} delay={i * 0.08} y={20} className="border-t border-ink/15 pt-4">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50">{label}</dt>
            <dd className="mt-2 text-lg font-medium tracking-tight sm:text-xl">{value}</dd>
          </FadeIn>
        ))}
      </dl>
    </PanelBody>
  );
}
