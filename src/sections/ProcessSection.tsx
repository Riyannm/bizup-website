import FadeIn from '../components/FadeIn';
import { PROCESS } from '../data';

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative z-20 -mt-10 sm:-mt-12 md:-mt-14 bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32 sm:pb-36 md:pb-44"
    >
      <FadeIn y={40}>
        <h2
          className="text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Process
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mt-6 mb-16 sm:mb-20 md:mb-24 max-w-xl text-center font-light leading-relaxed text-[#0C0C0C]/70"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
        >
          From first call to launch, in three stages.
        </p>
      </FadeIn>

      <ol className="mx-auto grid max-w-6xl gap-4 sm:gap-6 md:grid-cols-3">
        {PROCESS.map(({ title, body }, i) => (
          <FadeIn
            as="li"
            key={title}
            delay={i * 0.12}
            className="flex flex-col gap-4 rounded-[32px] sm:rounded-[40px] bg-[#F1F4F6] p-7 sm:p-9"
          >
            <span className="font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 6vw, 88px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)' }}>
              {title}
            </h3>
            <p className="font-light leading-relaxed text-[#0C0C0C]/70" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
              {body}
            </p>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
