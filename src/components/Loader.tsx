import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { markRevealed, onStageReady } from '../loader';

const MIN_MS = 2200; // long enough for the intro to read, even on a fast connection
const MAX_MS = 8000; // never hold the page hostage if the 3D stage is slow or unavailable
const RING = 2 * Math.PI * 96;
const ease = [0.76, 0, 0.24, 1] as const;

export default function Loader() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'gone'>('loading');
  const target = useRef(10);

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

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      offStage();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'opening') return;
    const t = window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      markRevealed();
      setPhase('gone');
    }, reduced ? 200 : 1100);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  const pct = Math.floor(shown);
  const open = phase !== 'loading';

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Two halves that part along the progress line when loading finishes. */}
          {(['top', 'bottom'] as const).map((half) => (
            <motion.div
              key={half}
              initial={false}
              animate={open && !reduced ? { y: half === 'top' ? '-100%' : '100%' } : { y: 0 }}
              transition={{ duration: 1, ease, delay: 0.15 }}
              className={`absolute inset-x-0 h-1/2 bg-paper ${half === 'top' ? 'top-0' : 'bottom-0'}`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    half === 'top'
                      ? 'radial-gradient(60% 90% at 50% 100%, rgba(0,71,171,0.07), transparent 70%)'
                      : 'radial-gradient(60% 90% at 50% 0%, rgba(0,71,171,0.07), transparent 70%)',
                }}
              />
            </motion.div>
          ))}

          {/* The line the halves split along. */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-cobalt"
            style={{ width: `${shown}%` }}
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          />

          <motion.div
            animate={open ? { opacity: 0, scale: reduced ? 1 : 1.15, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
            className="absolute inset-0"
          >
            <div className="absolute left-1/2 h-[220px] w-[220px] -translate-x-1/2" style={{ top: 'calc(50% - 248px)' }}>
              <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(11,11,12,0.08)" strokeWidth="2" />
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  fill="none"
                  stroke="#0047AB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - shown / 100)}
                  
                />
                <circle cx="110" cy="110" r="78" fill="none" stroke="rgba(11,11,12,0.18)" strokeWidth="1" strokeDasharray="2 7" />
              </svg>
              {!reduced && (
                <>
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="absolute left-1/2 top-[14px] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt" />
                  </motion.div>
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-[32px]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink" />
                  </motion.div>
                </>
              )}
              <div className="absolute inset-0 grid place-items-center">
                <motion.img
                  src="/favicon.svg"
                  alt=""
                  className="h-20 w-20"
                  animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-6 flex-col items-center">
              <span className="headline tabular-nums" style={{ fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}>
                {String(pct).padStart(3, '0')}
                <span className="ml-1 font-serif text-[0.45em] italic font-normal text-cobalt">%</span>
              </span>
              <span className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-ink/50">It&rsquo;s time to BizUp</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
