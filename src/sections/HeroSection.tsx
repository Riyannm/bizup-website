import FadeIn from '../components/FadeIn';
import ParticleField from '../components/ParticleField';
import LookAtComputer from '../components/LookAtComputer';
import { ContactButton } from '../components/Buttons';
import Logo from '../components/Logo';
import { NAV_LINKS } from '../data';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col" style={{ overflowX: 'clip' }}>
      {/* Drifting dots fill the whole hero, behind everything else. */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        aria-label="Primary"
        className="relative z-20 flex flex-col gap-2 px-6 md:px-10 pt-6 md:pt-8 sm:flex-row sm:items-center sm:gap-10 md:gap-14"
      >
        <a href="#" aria-label="BizUp Technologies, back to top" className="self-start">
          <Logo />
        </a>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 sm:gap-x-8 md:gap-x-10">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-block py-2 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse items-center justify-center gap-8 px-6 md:px-10 pb-14 pt-6 lg:flex-row lg:justify-between lg:gap-12 lg:pb-10">
        {/* left: intro + call to action */}
        <div className="w-full max-w-xl">
          <FadeIn delay={0.15} y={20}>
            <p className="max-w-md text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/55">
              Hey there, meet BizUp Technologies.
              <br />
              A freelance software &amp; automation studio for small and growing businesses.
            </p>
          </FadeIn>
          <FadeIn delay={0.25} y={24}>
            <h1
              className="mt-5 font-medium leading-[1.1] tracking-tight text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.6rem)' }}
            >
              Glad you stopped in.
              <br />
              <span className="hero-heading font-semibold">Now, what are we building?</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.4} y={20} className="mt-8">
            <ContactButton href="#contact">Get a free quote</ContactButton>
          </FadeIn>
        </div>

        {/* right: the computer that looks at you */}
        <FadeIn delay={0.3} y={30} duration={0.9} className="flex shrink-0 justify-center">
          <LookAtComputer />
        </FadeIn>
      </div>
    </section>
  );
}
