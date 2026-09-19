import { useEffect, useRef } from 'react';

// blue, violet, mist, cyan
const COLORS = ['#5C8CFF', '#8C5CF5', '#D7E2EA', '#45CCFF'];
const COLOR_WEIGHTS = [0.4, 0.3, 0.15, 0.15];

const MOUSE_RADIUS = 140; // px around the cursor that pushes dots away
const MOUSE_FORCE = 1.6;

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number; // wander direction
  speed: number;
  size: number;
  sprite: HTMLCanvasElement;
  twinkle: number;
};

/** Pre-renders a soft glowing dot per color, so each frame is just cheap image draws. */
function makeSprite(color: string) {
  const s = 32;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.25, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return c;
}

function pickColorIndex() {
  let p = Math.random();
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    if ((p -= COLOR_WEIGHTS[i]) <= 0) return i;
  }
  return 0;
}

/** Glowing dots that drift randomly and scatter away from the mouse. Fills its parent. */
export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = COLORS.map(makeSprite);
    const mouse = { x: -9999, y: -9999 };
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const seed = () => {
      // roughly one dot per 1,100 px², capped for performance
      const count = Math.min(1400, Math.round((width * height) / 1100));
      dots = Array.from({ length: count }, () => {
        const depth = Math.random(); // 0 = far, 1 = near
        const speed = 0.08 + depth * 0.32;
        const heading = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(heading) * speed,
          vy: Math.sin(heading) * speed,
          heading,
          speed,
          size: 3 + depth * 7 + (Math.random() < 0.03 ? 8 : 0),
          sprite: sprites[pickColorIndex()],
          twinkle: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dots) {
        const alpha = 0.45 + 0.4 * Math.sin(t * 0.0015 + d.twinkle);
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.drawImage(d.sprite, d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const step = () => {
      for (const d of dots) {
        // slow random wander
        d.heading += (Math.random() - 0.5) * 0.08;
        const baseX = Math.cos(d.heading) * d.speed;
        const baseY = Math.sin(d.heading) * d.speed;

        // push away from the cursor
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const push = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          d.vx += (dx / dist) * push;
          d.vy += (dy / dist) * push;
        }

        // ease back toward the calm drift speed
        d.vx = d.vx * 0.94 + baseX * 0.06;
        d.vy = d.vy * 0.94 + baseY * 0.06;
        d.x += d.vx;
        d.y += d.vy;

        // wrap around the edges
        if (d.x < -10) d.x = width + 10;
        else if (d.x > width + 10) d.x = -10;
        if (d.y < -10) d.y = height + 10;
        else if (d.y > height + 10) d.y = -10;
      }
    };

    const tick = (t: number) => {
      step();
      draw(t);
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (!frame && !reduced) frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
    io.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    resize();
    play();

    return () => {
      pause();
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
