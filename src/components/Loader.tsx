import { animate, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { markRevealed, onStageReady } from '../loader';

/**
 * Intro loader: five black blocks fill in like a progress bar, cut themselves into the
 * letters B-I-Z-U-P, slide together into a single ring, and the ring zooms toward the
 * viewer so the site appears through its hole.
 */

const MIN_MS = 2400; // long enough for the blocks to read, even on a fast connection
const MAX_MS = 8000; // never hold the page hostage if the 3D scene is slow or unavailable
const ease = [0.76, 0, 0.24, 1] as const;
const PAPER = '#F4F2EE';
const INK = '#0B0B0C';

type Phase = 'loading' | 'letters' | 'collapse' | 'zoom' | 'gone';

/** A rectangle path with its own radius per corner (tl, tr, br, bl), so corners can morph. */
function roundRect(x: number, y: number, w: number, h: number, [tl, tr, br, bl]: number[]) {
  return [
    `M${x + tl},${y}`,
    `H${x + w - tr}`,
    `Q${x + w},${y} ${x + w},${y + tr}`,
    `V${y + h - br}`,
    `Q${x + w},${y + h} ${x + w - br},${y + h}`,
    `H${x + bl}`,
    `Q${x},${y + h} ${x},${y + h - bl}`,
    `V${y + tl}`,
    `Q${x},${y} ${x + tl},${y}`,
    'Z',
  ].join(' ');
}

type Cut = { d: string; ox: number; oy: number };
type Letter = { width: number; corners: number[]; cuts: Cut[] };

// Heavy geometric letters on a 100-unit-tall grid. Each starts as a plain block and gets
// its shape from paper-coloured cut-outs that grow in.
const LETTERS: Letter[] = [
  {
    // B
    width: 84,
    corners: [6, 30, 30, 6],
    cuts: [
      { d: roundRect(26, 18, 30, 22, [10, 10, 10, 10]), ox: 41, oy: 29 },
      { d: roundRect(26, 58, 32, 24, [10, 10, 10, 10]), ox: 42, oy: 70 },
      { d: 'M84,43 L70,50 L84,57 Z', ox: 80, oy: 50 },
    ],
  },
  { width: 30, corners: [6, 6, 6, 6], cuts: [] }, // I
  {
    // Z
    width: 80,
    corners: [6, 6, 6, 6],
    cuts: [
      { d: 'M-1,25 L46,25 L-1,73 Z', ox: 14, oy: 41 },
      { d: 'M81,27 L81,75 L34,75 Z', ox: 66, oy: 59 },
    ],
  },
  {
    // U
    width: 82,
    corners: [6, 6, 40, 40],
    cuts: [{ d: roundRect(26, -2, 30, 66, [0, 0, 15, 15]), ox: 41, oy: 20 }],
  },
  {
    // P
    width: 76,
    corners: [6, 34, 6, 6],
    cuts: [
      { d: roundRect(26, 18, 28, 26, [10, 10, 10, 10]), ox: 40, oy: 31 },
      { d: roundRect(38, 64, 40, 38, [0, 0, 0, 0]), ox: 58, oy: 83 },
    ],
  },
];
const BLOCK = 72; // equal block width while loading, before each takes its letter's width

/** One block/letter. While loading its width fills with progress; then it cuts into its letter. */
function Glyph({ letter, fill, shaped, u }: { letter: Letter; fill: number; shaped: boolean; u: number }) {
  const w = shaped ? letter.width : BLOCK;
  const corners = shaped ? letter.corners : [4, 4, 4, 4];
  return (
    <motion.svg
      viewBox={`0 0 ${w} 100`}
      preserveAspectRatio="none"
      initial={false}
      animate={{ width: (shaped ? letter.width : BLOCK * fill) * u }}
      transition={shaped ? { duration: 0.35, ease } : { duration: 0.12, ease: 'linear' }}
      style={{ height: 100 * u, overflow: 'visible', display: 'block' }}
    >
      <motion.path initial={false} animate={{ d: roundRect(0, 0, w, 100, corners) }} transition={{ duration: 0.35, ease }} fill={INK} />
      {letter.cuts.map((c, i) => (
        <motion.path
          key={i}
          d={c.d}
          fill={PAPER}
          initial={{ scale: 0 }}
          animate={{ scale: shaped ? 1 : 0 }}
          transition={{ duration: 0.45, delay: shaped ? 0.3 + i * 0.06 : 0, ease }}
          style={{ transformOrigin: `${c.ox}px ${c.oy}px`, transformBox: 'view-box' }}
        />
      ))}
    </motion.svg>
  );
}

export default function Loader() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [zoom, setZoom] = useState({ scale: 1, hole: 1 });
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const target = useRef(10);

  // Real progress: fonts, then the 3D scene. Eased toward, but never faster than MIN_MS.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.fonts.ready.then(() => (target.current = Math.max(target.current, 45)));
    const offStage = onStageReady(() => (target.current = 100));
    const giveUp = window.setTimeout(() => (target.current = 100), MAX_MS);
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);

    const start = performance.now();
    let value = 0;
    let raf = requestAnimationFrame(function tick(now) {
      // rAF timestamps can be slightly earlier than `start`, so keep the cap at or above zero.
      const cap = Math.min(100, Math.max(0, ((now - start) / MIN_MS) * 100));
      value += (Math.min(target.current, cap) - value) * 0.08;
      if (target.current === 100 && cap >= 100 && value > 99.4) value = 100;
      setShown(value);
      if (value < 100) raf = requestAnimationFrame(tick);
      else setPhase(reduced ? 'zoom' : 'letters');
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      offStage();
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  // Letters hold for a beat, then slide together into the ring.
  useEffect(() => {
    if (phase === 'letters') {
      const t = window.setTimeout(() => setPhase('collapse'), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 'collapse') {
      const t = window.setTimeout(() => setPhase('zoom'), 650);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // The ring flies at the viewer; the site shows through its hole.
  useEffect(() => {
    if (phase !== 'zoom') return;
    const reveal = window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      markRevealed();
    }, reduced ? 0 : 150);
    if (reduced) {
      const done = window.setTimeout(() => setPhase('gone'), 200);
      return () => {
        clearTimeout(reveal);
        clearTimeout(done);
      };
    }
    // Big enough that the hole covers the whole screen.
    const hole = holeSize(size);
    const end = (Math.hypot(size.w, size.h) / Math.min(hole.w, hole.h)) * 1.25;
    const holeFade = animate(1, 0, { duration: 0.35, ease: 'easeOut', onUpdate: (v) => setZoom((z) => ({ ...z, hole: v })) });
    const fly = animate(1, end, {
      duration: 1.25,
      ease: [0.7, 0, 0.84, 0],
      onUpdate: (v) => setZoom((z) => ({ ...z, scale: v })),
      onComplete: () => setPhase('gone'),
    });
    return () => {
      clearTimeout(reveal);
      holeFade.stop();
      fly.stop();
    };
  }, [phase, reduced, size]);

  if (phase === 'gone') return null;

  const pct = Math.floor(shown);
  const shaped = phase !== 'loading';
  const u = unit(size);
  const ring = ringSize(size);
  const hole = holeSize(size);
  const cx = size.w / 2, cy = size.h / 2;
  const ringTransform = `translate(${cx} ${cy}) scale(${zoom.scale})`;

  return (
    <div
      role="progressbar"
      aria-label="Loading BizUp Technologies"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {phase !== 'zoom' && (
        <div className="absolute inset-0" style={{ background: PAPER }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex items-center"
              style={{ gap: 8 * u }}
              animate={phase === 'collapse' ? { opacity: 0, scale: 0.55 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              {LETTERS.map((letter, i) => (
                <motion.div
                  key={i}
                  animate={phase === 'collapse' ? { x: (2 - i) * 95 * u } : { x: 0 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <Glyph u={u} letter={letter} shaped={shaped} fill={Math.min(1, Math.max(0, (shown / 100) * LETTERS.length - i))} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* The ring forms where the letters meet. */}
          <motion.svg
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={phase === 'collapse' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease }}
            aria-hidden="true"
          >
            <g transform={`translate(${cx} ${cy})`}>
              <path d={ringPath(ring, hole)} fill={INK} fillRule="evenodd" />
            </g>
          </motion.svg>

          <span className="absolute left-5 top-5 text-xs font-medium uppercase tracking-[0.2em] text-ink/70 sm:left-8 sm:top-7">
            BizUp Technologies
          </span>
          <span className="absolute bottom-5 right-5 font-serif text-2xl italic tabular-nums text-ink sm:bottom-7 sm:right-8 sm:text-3xl">
            {String(pct).padStart(3, '0')}
          </span>
        </div>
      )}

      {phase === 'zoom' && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <mask id="loader-ring-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <rect width={size.w} height={size.h} fill="white" />
              <g transform={ringTransform}>
                <path d={pill(ring.w, ring.h)} fill="black" />
              </g>
            </mask>
          </defs>
          {/* Paper everywhere outside the ring... */}
          <rect width={size.w} height={size.h} fill={PAPER} mask="url(#loader-ring-mask)" />
          <g transform={ringTransform}>
            {/* ...the ring itself, and its hole fading open onto the site. */}
            <path d={ringPath(ring, hole)} fill={INK} fillRule="evenodd" />
            <path d={pill(hole.w, hole.h)} fill={PAPER} opacity={zoom.hole} />
          </g>
        </svg>
      )}
    </div>
  );
}

/** One unit of the letter grid in px: the word fits the screen, capped on big screens. */
function unit(size: { w: number; h: number }) {
  return Math.min(size.w * 0.0021, size.h * 0.0034, 2.4);
}

function ringSize(size: { w: number; h: number }) {
  const u = unit(size);
  return { w: 240 * u, h: 150 * u };
}

function holeSize(size: { w: number; h: number }) {
  const u = unit(size);
  return { w: 140 * u, h: 56 * u };
}

/** A pill (stadium) centred on 0,0. */
function pill(w: number, h: number) {
  const r = h / 2;
  return `M${-w / 2 + r},${-r} H${w / 2 - r} A${r},${r} 0 0 1 ${w / 2 - r},${r} H${-w / 2 + r} A${r},${r} 0 0 1 ${-w / 2 + r},${-r} Z`;
}

function ringPath(ring: { w: number; h: number }, hole: { w: number; h: number }) {
  return `${pill(ring.w, ring.h)} ${pill(hole.w, hole.h)}`;
}
