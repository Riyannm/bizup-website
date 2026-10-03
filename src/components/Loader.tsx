import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { markRevealed, onStageReady } from '../loader';

const MIN_MS = 2800; // long enough for the show to read, even on a fast connection
const MAX_MS = 8000; // never hold the page hostage if the 3D stage is slow or unavailable
const WORDS = ['Websites', 'Apps', 'Automation', 'Dashboards', 'Booking systems', 'Reports', 'BizUp.'];
const ease = [0.76, 0, 0.24, 1] as const;

type Colour = 'ink' | 'cobalt' | 'white';
type Tile = { rank: number; colour: Colour; col: number; row: number; centre: boolean };

const FILLS: Record<Colour, string> = {
  ink: 'bg-ink',
  cobalt: 'bg-cobalt',
  white: 'border border-ink/10 bg-white',
};

/**
 * A screen-filling grid of tiles with a random fill order and colour. Tiles in the middle stay
 * empty so the counter always reads; the mosaic builds up around it.
 */
function useTiles() {
  return useMemo(() => {
    const w = window.innerWidth, h = window.innerHeight;
    const cols = w < 640 ? 6 : w < 1024 ? 9 : 12;
    const size = Math.ceil(w / cols);
    const rows = Math.ceil(h / size);
    const rx = w < 640 ? 0.62 : 0.36, ry = w < 640 ? 0.24 : 0.3;
    const order = Array.from({ length: cols * rows }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const tiles: Tile[] = order.map((rank, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const dx = ((col + 0.5) * size - w / 2) / (w * rx);
      const dy = ((row + 0.5) * size - h / 2) / (h * ry);
      const r = Math.random();
      return { rank, col, row, centre: dx * dx + dy * dy < 1, colour: r < 0.62 ? 'ink' : r < 0.86 ? 'cobalt' : 'white' };
    });
    const fillable = tiles.filter((t) => !t.centre).length;
    // Re-rank the outer tiles 0..n so the fill reaches all of them by 100%.
    tiles
      .filter((t) => !t.centre)
      .sort((a, b) => a.rank - b.rank)
      .forEach((t, k) => (t.rank = k));
    return { tiles, cols, rows, size, fillable };
  }, []);
}

/** One digit that drops in from above each time it changes, like a flip counter. */
function Digit({ digit, animate }: { digit: number; animate: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden text-center" style={{ height: '1em', width: '0.6em' }}>
      <motion.span
        key={digit}
        initial={animate ? { y: '-70%', opacity: 0 } : false}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="absolute inset-0 block"
        style={{ lineHeight: '1em' }}
      >
        {digit}
      </motion.span>
    </span>
  );
}

/** One mosaic tile; memoised so only tiles that change re-render each frame. */
const MosaicTile = memo(function MosaicTile({
  on,
  colour,
  open,
  delay,
  reduced,
}: {
  on: boolean;
  colour: Colour;
  open: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="relative bg-paper"
      animate={open ? (reduced ? { opacity: 0 } : { rotateY: 90, scale: 0.5, opacity: 0 }) : { rotateY: 0, scale: 1, opacity: 1 }}
      transition={open ? { duration: 0.55, delay: reduced ? 0 : delay, ease } : { duration: 0 }}
    >
      <div
        className={`absolute inset-[3px] rounded-[10px] transition-[transform,background-color] duration-300 ease-out ${
          on ? FILLS[colour] : 'border border-ink/[0.06]'
        }`}
        style={{ transform: on ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-14deg)' }}
      />
    </motion.div>
  );
});

export default function Loader() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'gone'>('loading');
  const [word, setWord] = useState(0);
  const [glitch, setGlitch] = useState<Set<number>>(new Set());
  const target = useRef(10);
  const { tiles, cols, rows, size, fillable } = useTiles();

  // Real progress: fonts, then the 3D stage. The counter eases toward it, but never faster than MIN_MS.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';

    document.fonts.ready.then(() => (target.current = Math.max(target.current, 45)));
    const offStage = onStageReady(() => (target.current = 100));
    const giveUp = window.setTimeout(() => (target.current = 100), MAX_MS);

    const start = performance.now();
    let value = 0;
    let raf = requestAnimationFrame(function tick(now) {
      const cap = Math.min(100, ((now - start) / MIN_MS) * 100);
      value += (Math.min(target.current, cap) - value) * 0.08;
      if (target.current === 100 && cap >= 100 && value > 99.4) value = 100;
      setShown(value);
      if (value < 100) raf = requestAnimationFrame(tick);
      else setPhase('opening');
    });

    const words = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 300);
    // A few random tiles flash a different colour, so the mosaic never sits still.
    const flicker = reduced
      ? 0
      : window.setInterval(() => {
          const next = new Set<number>();
          for (let k = 0; k < 4; k++) next.add(Math.floor(Math.random() * tiles.length));
          setGlitch(next);
        }, 110);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      clearInterval(words);
      clearInterval(flicker);
      offStage();
    };
  }, [reduced, tiles.length]);

  // The tiles flip away in a wave; the page starts its own entrance part-way through.
  useEffect(() => {
    if (phase !== 'opening') return;
    const reveal = window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      markRevealed();
    }, reduced ? 0 : 550);
    const done = window.setTimeout(() => setPhase('gone'), reduced ? 250 : 1700);
    return () => {
      clearTimeout(reveal);
      clearTimeout(done);
    };
  }, [phase, reduced]);

  const pct = Math.floor(shown);
  const filled = Math.floor((shown / 100) * fillable);
  const open = phase !== 'loading';
  const digits = String(pct).padStart(3, '0').split('').map(Number);

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="loader"
          role="progressbar"
          aria-label="Loading BizUp Technologies"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* The mosaic: tiles snap in as loading progresses, then flip away diagonally. */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 grid"
            style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)`, gridAutoRows: `${size}px`, perspective: 1200 }}
          >
            {tiles.map((tile, i) => {
              const on = !tile.centre && tile.rank < filled;
              return (
                <MosaicTile
                  key={i}
                  on={on}
                  colour={on && glitch.has(i) ? (tile.colour === 'cobalt' ? 'white' : 'cobalt') : tile.colour}
                  open={open}
                  delay={(tile.col + (rows - 1 - tile.row)) * 0.035}
                  reduced={!!reduced}
                />
              );
            })}
          </div>

          <motion.div
            animate={open ? { opacity: 0, scale: reduced ? 1 : 1.3 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeIn' }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* A spinning 3D cube, like the blocks on the site. */}
            {!reduced && (
              <div aria-hidden="true" className="mb-6" style={{ perspective: 600 }}>
                <div className="loader-cube">
                  {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => (
                    <span
                      key={face}
                      className={`loader-cube-face loader-cube-${face} ${['bg-cobalt', 'bg-ink', 'bg-white', 'bg-cobalt', 'bg-ink', 'bg-white'][i]}`}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="relative overflow-hidden font-serif italic text-cobalt" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', height: '1.25em' }}>
              <motion.span
                key={word}
                initial={reduced ? false : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="block whitespace-nowrap"
                style={{ lineHeight: '1.25em' }}
              >
                {WORDS[word]}
              </motion.span>
            </div>
            <div className="headline flex items-start tabular-nums text-ink" style={{ fontSize: 'clamp(6rem, 21vw, 19rem)', lineHeight: 1 }}>
              {/* The last digit changes too fast to animate; the others drop in. */}
              {digits.map((d, i) => (
                <Digit key={i} digit={d} animate={!reduced && i < 2} />
              ))}
              <span className="ml-[0.04em] font-serif text-[0.3em] font-normal italic text-cobalt">%</span>
            </div>
            <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.3em] text-ink/55">It&rsquo;s time to BizUp</span>
          </motion.div>

          <div className="absolute bottom-0 left-0 h-[3px] bg-cobalt" style={{ width: `${shown}%`, opacity: open ? 0 : 1 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
