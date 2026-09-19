import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import { ContactButton } from '../components/Buttons';
import { ABOUT_FACTS, ABOUT_TEXT } from '../data';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center gap-16 sm:gap-20 md:gap-24 px-5 sm:px-8 md:px-10 py-20"
    >
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About
          </h2>
        </FadeIn>

        <AnimatedText
          text={ABOUT_TEXT}
          className="max-w-[600px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />

        <FadeIn as="dl" y={20} className="grid w-full max-w-[640px] grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {ABOUT_FACTS.map(({ label, value }) => (
            <div key={label} className="text-center">
              <dt className="text-xs uppercase tracking-widest text-[#D7E2EA]/60">{label}</dt>
              <dd className="mt-1 text-sm sm:text-base font-medium text-[#D7E2EA]">{value}</dd>
            </div>
          ))}
        </FadeIn>
      </div>

      <FadeIn y={20} className="relative z-10">
        <ContactButton href="#contact">Start a project</ContactButton>
      </FadeIn>
    </section>
  );
}
