import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/*
 * A retro computer built from CSS 3D faces. It turns toward the pointer like a head,
 * its eyes track the pointer, and when nobody moves the mouse it glances around.
 * All sizes are in `em`, so the whole thing scales from the root font size.
 */

const W = 20; // width
const H = 17; // height
const D = 15; // depth

const MAX_TURN = 35; // degrees left/right
const MAX_TILT = 18; // degrees up/down

function Face({ w, h, transform, style, children }: { w: number; h: number; transform: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `${w}em`,
        height: `${h}em`,
        marginLeft: `${-w / 2}em`,
        marginTop: `${-h / 2}em`,
        transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eye({ lookX, lookY }: { lookX: ReturnType<typeof useTransform<number, string>>; lookY: ReturnType<typeof useTransform<number, string>> }) {
  return (
    <motion.div
      className="h-[4.2em] w-[3.3em] rounded-[50%]"
      style={{
        x: lookX,
        y: lookY,
        background: 'radial-gradient(circle at 45% 40%, #ffffff 0%, #eef2ff 45%, #c9d6ff 100%)',
        boxShadow: '0 0 1.2em #9fb6ff, 0 0 3.2em rgba(92,140,255,0.8)',
      }}
      animate={{ scaleY: [1, 1, 0.08, 1, 1, 0.08, 1] }}
      transition={{ duration: 5.5, times: [0, 0.6, 0.63, 0.66, 0.9, 0.93, 0.96], repeat: Infinity }}
    />
  );
}

export default function LookAtComputer() {
  const rigRef = useRef<HTMLDivElement>(null);

  // -1..1 look direction; springs give the head-turn its weight
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const springX = useSpring(lookX, { stiffness: 70, damping: 14, mass: 0.9 });
  const springY = useSpring(lookY, { stiffness: 70, damping: 14, mass: 0.9 });

  const rotateY = useTransform(springX, (v) => v * MAX_TURN);
  const rotateX = useTransform(springY, (v) => -v * MAX_TILT);
  const eyeX = useTransform(springX, (v) => `${v * 1.1}em`);
  const eyeY = useTransform(springY, (v) => `${v * 0.8}em`);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      lookX.set(-0.25);
      lookY.set(0.05);
      return;
    }

    let lastMove = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: PointerEvent) => {
      const rig = rigRef.current;
      if (!rig) return;
      const r = rig.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      lookX.set(clamp((e.clientX - cx) / (window.innerWidth * 0.45)));
      lookY.set(clamp((e.clientY - cy) / (window.innerHeight * 0.45)));
      lastMove = performance.now();
    };

    // when idle, glance around every couple of seconds
    const idle = window.setInterval(() => {
      if (performance.now() - lastMove < 2500) return;
      lookX.set((Math.random() * 2 - 1) * 0.7);
      lookY.set((Math.random() * 2 - 1) * 0.4);
    }, 1800);

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.clearInterval(idle);
    };
  }, [lookX, lookY]);

  const side = 'linear-gradient(180deg, #c5ced6 0%, #8e99a3 100%)';

  return (
    <div
      className="relative select-none"
      style={{ fontSize: 'clamp(10px, 1.2vw, 17px)', width: `${W + 6}em`, height: `${H + 12}em` }}
      role="img"
      aria-label="A friendly retro computer that turns to look at your cursor"
    >
      {/* glow behind */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[40%] h-[26em] w-[26em] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #3b5bdb 0%, #5b2a9e 55%, transparent 100%)' }}
      />

      {/* stand (stays still, like a neck) */}
      <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2" style={{ top: `${H + 3}em` }}>
        <div
          className="mx-auto rounded-b-[0.6em]"
          style={{ width: '5em', height: '4.5em', background: 'linear-gradient(90deg, #7d8792, #c5ced6 45%, #8e99a3)' }}
        />
        <div
          className="rounded-[50%]"
          style={{ width: '15em', height: '2.2em', marginTop: '-0.6em', background: 'radial-gradient(ellipse at 50% 30%, #d7e0e6, #7d8792 75%)' }}
        />
        <div
          className="mx-auto rounded-[50%] opacity-60 blur-md"
          style={{ width: '18em', height: '1.6em', marginTop: '0.2em', background: 'rgba(0,0,0,0.9)' }}
        />
      </div>

      {/* the head */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '2em', width: `${W}em`, height: `${H}em`, perspective: '70em' }}>
        <motion.div
          ref={rigRef}
          className="relative h-full w-full"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          animate={{ y: ['0em', '-0.4em', '0em'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* back */}
          <Face w={W} h={H} transform={`rotateY(180deg) translateZ(${D / 2}em)`} style={{ background: '#7f8a94', borderRadius: '1.2em' }} />
          {/* sides */}
          <Face w={D} h={H} transform={`rotateY(-90deg) translateZ(${W / 2}em)`} style={{ background: side, borderRadius: '1em' }}>
            <div className="absolute left-[18%] right-[18%] top-[20%] flex flex-col gap-[0.7em]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-[0.35em] rounded-full bg-black/20" />
              ))}
            </div>
          </Face>
          <Face w={D} h={H} transform={`rotateY(90deg) translateZ(${W / 2}em)`} style={{ background: side, borderRadius: '1em' }}>
            <div className="absolute left-[18%] right-[18%] top-[20%] flex flex-col gap-[0.7em]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-[0.35em] rounded-full bg-black/20" />
              ))}
            </div>
          </Face>
          {/* top + bottom */}
          <Face w={W} h={D} transform={`rotateX(90deg) translateZ(${H / 2}em)`} style={{ background: 'linear-gradient(180deg, #d5dde3, #f1f5f8)', borderRadius: '1em' }} />
          <Face w={W} h={D} transform={`rotateX(-90deg) translateZ(${H / 2}em)`} style={{ background: '#6f7982', borderRadius: '1em' }} />

          {/* front */}
          <Face
            w={W}
            h={H}
            transform={`translateZ(${D / 2}em)`}
            style={{
              background: 'linear-gradient(180deg, #eef2f5 0%, #c3cdd5 100%)',
              borderRadius: '1.2em',
              boxShadow: 'inset 0 0.2em 0.4em rgba(255,255,255,0.7), inset 0 -0.4em 0.8em rgba(0,0,0,0.15)',
            }}
          >
            {/* screen */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '1.6em',
                right: '1.6em',
                top: '1.5em',
                height: '10.5em',
                borderRadius: '1.4em',
                background: 'radial-gradient(ellipse at 50% 40%, #1b1f28 0%, #07080a 100%)',
                boxShadow: 'inset 0 0 1.2em rgba(0,0,0,0.9), 0 0 0 0.35em #aab5be',
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 4px)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-[3.2em]">
                <Eye lookX={eyeX} lookY={eyeY} />
                <Eye lookX={eyeX} lookY={eyeY} />
              </div>
              <div
                aria-hidden="true"
                className="absolute -left-[20%] -top-[40%] h-[80%] w-[70%] rotate-[-20deg] rounded-full opacity-[0.07]"
                style={{ background: 'linear-gradient(180deg, #fff, transparent)' }}
              />
            </div>
            {/* lower panel: drive slot, label, power light */}
            <div className="absolute inset-x-[1.8em] bottom-[1.3em] flex items-center justify-between" aria-hidden="true">
              <span className="h-[0.7em] w-[7em] rounded-full bg-[#0C0C0C]/60 shadow-[inset_0_0.1em_0.2em_rgba(0,0,0,0.6)]" />
              <span className="text-[0.9em] font-black tracking-widest text-[#6b7580]">BIZUP</span>
              <span className="h-[0.7em] w-[0.7em] rounded-full bg-emerald-400 shadow-[0_0_0.6em_#34d399]" />
            </div>
          </Face>
        </motion.div>
      </div>
    </div>
  );
}
