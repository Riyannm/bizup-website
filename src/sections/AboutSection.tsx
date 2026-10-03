import FadeIn from '../components/FadeIn';
import ScrollText from '../components/ScrollText';
import PanelBody from '../wheel/PanelBody';
import { ABOUT_FACTS, ABOUT_TEXT } from '../data';

export default function AboutSection() {
  return (
    <PanelBody>
      <div className="lg:max-w-[56%]">
        <FadeIn y={20}>
          <span className="eyebrow">About BizUp</span>
        </FadeIn>
        <ScrollText
          text={ABOUT_TEXT}
          className="mt-5 font-medium leading-[1.2] tracking-tight text-white"
          style={{ fontSize: 'clamp(1.35rem, 2.9vw, 2.6rem)' }}
        />
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4">
          {ABOUT_FACTS.map(({ label, value }, i) => (
            <FadeIn key={label} delay={i * 0.08} y={24} className="glass rounded-3xl p-4 sm:p-6">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-[#3D7BFF]">{label}</dt>
              <dd className="mt-2 text-sm font-medium text-white sm:text-lg">{value}</dd>
            </FadeIn>
          ))}
        </dl>
      </div>
    </PanelBody>
  );
}
