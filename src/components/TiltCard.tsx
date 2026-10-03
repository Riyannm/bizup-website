import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

/** A card that tilts toward the mouse in 3D, with a soft light following the cursor. */
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 160, damping: 18 });
  const springY = useSpring(y, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const glowX = useTransform(springX, (v) => `${v * 100}%`);
  const glowY = useTransform(springY, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(500px circle at ${glowX} ${glowY}, rgba(79,195,255,0.12), transparent 45%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  function onLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div style={{ perspective: 1400 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass relative h-full overflow-hidden rounded-[28px] sm:rounded-[36px]"
      >
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div className="relative h-full">{children}</div>
      </motion.div>
    </div>
  );
}
