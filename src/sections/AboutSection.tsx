import FadeIn from '../components/FadeIn';
import ScrollText from '../components/ScrollText';
import PanelBody from '../components/PanelBody';
import { ABOUT_FACTS, ABOUT_TEXT } from '../data';

export default function AboutSection() {
  return (
    <PanelBody side="left">
      <span className="label">
        <b>(02)</b> About
      </span>
      <ScrollText
        text={ABOUT_TEXT}
        className="mt-6 font-medium leading-[1.18] tracking-[-0.03em] text-ink"
        style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2.2rem)' }}
      />
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7">
        {ABOUT_FACTS.map(({ label, value }, i) => (
          <FadeIn key={label} delay={0.2 + i * 0.08} y={20} className="border-t border-ink/15 pt-4">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50">{label}</dt>
            <dd className="mt-2 text-base font-medium tracking-tight sm:text-lg">{value}</dd>
          </FadeIn>
        ))}
      </dl>
    </PanelBody>
  );
}
