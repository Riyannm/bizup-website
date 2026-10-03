import FadeIn from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';
import DaytimeToggle from '../components/DaytimeToggle';
import { shotAttrs } from '../components/Page';

// The live scene shows again here, from the camera's closing angle; the type sits bottom-left, clear of the monument.
export default function Outro() {
  return (
    <section aria-label="Start a project" className="relative min-h-[100svh]" {...shotAttrs({ angle: 440, distance: 26, height: 2.5, frame: 1 })}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-start justify-end px-5 pb-16 pt-28 text-white sm:px-8 md:px-10 [text-shadow:0_2px_30px_rgba(0,0,0,0.3)]">
        <FadeIn y={16}>
          <span className="label !text-white/80 [&>b]:!text-white">
            <b>(10)</b> Next
          </span>
        </FadeIn>
        <FadeIn y={30} delay={0.05}>
          <h2 className="headline mt-6 [&_em]:!text-white" style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}>
            Let&apos;s build
            <br />
            what&apos;s <em>next</em>.
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.15} className="mt-10 flex flex-wrap items-center gap-4">
          <ContactButton href="#enquiry" tone="light">
            Start a project
          </ContactButton>
          <DaytimeToggle />
        </FadeIn>
      </div>
    </section>
  );
}
