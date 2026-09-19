import { useEffect, useRef } from 'react';
import { MARQUEE_ROWS } from '../data';

const TEXT_SIZE = { fontSize: 'clamp(2.75rem, 8vw, 7.5rem)' };

function Dot() {
  return <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-[#D7E2EA]/40 sm:h-4 sm:w-4" />;
}

function Row({
  items,
  variant,
  rowRef,
}: {
  items: string[];
  variant: 'solid' | 'outline';
  rowRef: React.RefObject<HTMLDivElement>;
}) {
  const tripled = [...items, ...items, ...items];
  return (
    <div ref={rowRef} className="flex w-max items-center gap-6 sm:gap-10" style={{ willChange: 'transform' }}>
      {tripled.map((item, i) => (
        <div key={i} className="flex shrink-0 items-center gap-6 sm:gap-10">
          <span
            className={`whitespace-nowrap font-black uppercase leading-none tracking-tight ${variant === 'solid' ? 'hero-heading' : ''}`}
            style={
              variant === 'outline'
                ? { ...TEXT_SIZE, color: 'transparent', WebkitTextStroke: '1.5px rgba(215, 226, 234, 0.55)' }
                : TEXT_SIZE
            }
          >
            {item}
          </span>
          <Dot />
        </div>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOne = useRef<HTMLDivElement>(null);
  const rowTwo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section || !rowOne.current || !rowTwo.current) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      // Start each row one set to the left so neither edge ever shows a gap.
      const setOne = rowOne.current.scrollWidth / 3;
      const setTwo = rowTwo.current.scrollWidth / 3;
      rowOne.current.style.transform = `translateX(${offset - 200 - setOne}px)`;
      rowTwo.current.style.transform = `translateX(${-(offset - 200) - setTwo}px)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // Re-measure once Kanit has loaded, since the row widths depend on it.
    document.fonts?.ready.then(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-4 sm:gap-6 bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20"
    >
      <h2 className="sr-only">What we build: {MARQUEE_ROWS.builds.join(', ')}</h2>
      <div aria-hidden="true" className="flex flex-col gap-4 sm:gap-6">
        <Row items={MARQUEE_ROWS.builds} variant="solid" rowRef={rowOne} />
        <Row items={MARQUEE_ROWS.outcomes} variant="outline" rowRef={rowTwo} />
      </div>
    </section>
  );
}
