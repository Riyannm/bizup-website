import Lenis from 'lenis';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { onRevealed } from '../loader';
import { PanelContext, wheel } from './state';

export type PanelDef = {
  id: string;
  label: string;
  /** data-stage, data-side, ... for the particle stage (see ParticleStage). */
  stage: Record<string, string>;
  /** Lets the panel scroll inside itself when its content is taller than the screen. */
  scroll?: boolean;
  node: ReactNode;
};

const STEP = 72; // degrees between neighbouring panels on the wheel
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

function stageAttrs(stage: Record<string, string>) {
  return Object.fromEntries(Object.entries(stage).map(([k, v]) => [`data-${k}`, v]));
}

function useGeometry() {
  const measure = () => {
    const w = window.innerWidth;
    return { radius: w * (w < 768 ? 1.1 : 0.92), perspective: Math.max(w * 1.1, 900), width: w };
  };
  const [g, setG] = useState(measure);
  useEffect(() => {
    const onResize = () => setG(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return g;
}

function Panel({ panel, index, turn, radius }: { panel: PanelDef; index: number; turn: MotionValue<number>; radius: number }) {
  const local = useTransform(turn, (t) => t - index);
  const distance = useTransform(local, (l) => Math.abs(l));
  const opacity = useTransform(distance, [0, 0.5, 1], [1, 0.75, 0]);
  const visibility = useTransform(distance, (d) => (d > 1.2 ? 'hidden' : 'visible'));
  const pointerEvents = useTransform(distance, (d) => (d > 0.45 ? 'none' : 'auto'));
  const [seen, setSeen] = useState(index === 0);
  const [front, setFront] = useState(index === 0);
  useMotionValueEvent(distance, 'change', (d) => {
    setFront(d < 0.5);
    // Content starts appearing as soon as the panel begins swinging in.
    if (d < 0.9) setSeen(true);
  });

  return (
    <PanelContext.Provider value={{ index, local, seen }}>
      <motion.section
        id={panel.id}
        aria-label={panel.label}
        {...stageAttrs(panel.stage)}
        className="absolute inset-0"
        style={{
          transform: `rotateY(${index * STEP}deg) translateZ(${radius}px)`,
          backfaceVisibility: 'hidden',
          opacity,
          visibility,
          pointerEvents,
        }}
        // Tabbing into a panel that isn't at the front turns the wheel to it.
        onFocusCapture={() => {
          if (!front) wheel.goTo(panel.id);
        }}
      >
        <div className={`h-full ${panel.scroll ? 'overflow-y-auto overscroll-contain' : ''}`} {...(panel.scroll ? { 'data-lenis-prevent': '' } : {})}>
          {panel.node}
        </div>
      </motion.section>
    </PanelContext.Provider>
  );
}

function Wheel({ panels }: { panels: PanelDef[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { radius, perspective, width } = useGeometry();
  const count = panels.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const turn = useTransform(scrollYProgress, (p) => Math.min(Math.max(p, 0), 1) * (count - 1));
  const rotateY = useTransform(turn, (t) => -t * STEP);
  // The camera pulls back a little mid-turn, so the curve of the wheel reads.
  const z = useTransform(turn, (t) => -radius - width * 0.22 * Math.sin(Math.PI * (t - Math.floor(t))));
  const bar = useTransform(scrollYProgress, (p) => `${Math.min(Math.max(p, 0), 1) * 100}%`);
  const [active, setActive] = useState(0);
  useMotionValueEvent(turn, 'change', (t) => setActive(Math.round(t)));

  useEffect(() => {
    const track = trackRef.current!;
    const scrollFor = (index: number) => {
      const top = track.getBoundingClientRect().top + window.scrollY;
      return top + (index / (count - 1)) * (track.offsetHeight - window.innerHeight);
    };

    const goTo = (id: string, immediate = false) => {
      const index = panels.findIndex((p) => p.id === (id === 'intro' ? panels[0].id : id));
      if (index < 0) return false;
      const target = scrollFor(index);
      const lenis = wheel.lenis;
      if (lenis && !immediate) {
        const hops = Math.abs(index - turn.get());
        lenis.scrollTo(target, { duration: Math.min(1 + hops * 0.18, 2.4), easing: ease });
      } else {
        window.scrollTo(0, target);
      }
      return true;
    };
    wheel.register({ getTurn: () => turn.get(), goTo });

    const lenis = new Lenis({ lerp: 0.09 });
    wheel.setLenis(lenis);
    lenis.stop();
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    // Settle on the nearest panel once scrolling stops.
    let snapTimer = 0;
    const offScroll = lenis.on('scroll', () => {
      clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        const t = turn.get();
        const nearest = Math.round(t);
        if (Math.abs(t - nearest) > 0.004 && t < count - 1) {
          lenis.scrollTo(scrollFor(nearest), { duration: 0.8, easing: ease });
        }
      }, 140);
    });

    // In-page links (#services, /#contact, ...) turn the wheel instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (!href || !(href.startsWith('#') || href.startsWith('/#'))) return;
      const id = href.slice(href.indexOf('#') + 1);
      if (goTo(id)) e.preventDefault();
    };
    document.addEventListener('click', onClick);

    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      const t = Math.round(turn.get());
      if (e.key === 'ArrowRight' && t < count - 1) goTo(panels[t + 1].id);
      else if (e.key === 'ArrowLeft' && t > 0) goTo(panels[t - 1].id);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);

    const offRevealed = onRevealed(() => {
      lenis.start();
      const hash = window.location.hash.slice(1);
      if (hash) goTo(hash, true);
    });

    return () => {
      offRevealed();
      offScroll();
      clearTimeout(snapTimer);
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
      wheel.register(null);
      wheel.setLenis(null);
      lenis.destroy();
    };
  }, [count, panels, turn]);

  return (
    <div ref={trackRef} style={{ height: `${count * 100}svh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ perspective }}>
        <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', z, rotateY }}>
          {panels.map((panel, i) => (
            <Panel key={panel.id} panel={panel} index={i} turn={turn} radius={radius} />
          ))}
        </motion.div>

        <nav
          aria-label="Page sections"
          className="absolute inset-x-0 bottom-4 z-20 mx-auto flex w-full max-w-6xl items-center gap-3 px-5 sm:bottom-6 sm:gap-5 sm:px-8"
        >
          <button
            type="button"
            aria-label="Previous section"
            disabled={active === 0}
            onClick={() => wheel.goTo(panels[active - 1].id)}
            className="glass grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-white transition-opacity disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="shrink-0 text-sm font-medium tabular-nums text-white">
            {String(active + 1).padStart(2, '0')}
            <span className="text-white/40"> / {String(count).padStart(2, '0')}</span>
          </span>
          <div className="relative h-px flex-1 bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 bg-[#3D7BFF] shadow-[0_0_10px_#3D7BFF]" style={{ width: bar }} />
          </div>
          <span className="hidden max-w-[30%] truncate text-xs uppercase tracking-[0.2em] text-white/60 sm:block">
            {panels[active].label}
          </span>
          <button
            type="button"
            aria-label="Next section"
            disabled={active === count - 1}
            onClick={() => wheel.goTo(panels[active + 1].id)}
            className="glass grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-white transition-opacity disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}

/** Reduced motion: the same panels, stacked as an ordinary page. */
function Stack({ panels }: { panels: PanelDef[] }) {
  return (
    <>
      {panels.map((panel) => (
        <section key={panel.id} id={panel.id} aria-label={panel.label} {...stageAttrs(panel.stage)} className="relative min-h-[100svh]">
          {panel.node}
        </section>
      ))}
    </>
  );
}

export default function PageWheel({ panels }: { panels: PanelDef[] }) {
  const reduced = useReducedMotion();
  return reduced ? <Stack panels={panels} /> : <Wheel panels={panels} />;
}
