import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { onRevealed } from '../loader';
import Outro from '../sections/Outro';

/**
 * Camera shot for a section: the camera circles the island at `angle` degrees, `distance` out and
 * `height` up. `frame` puts the monument on the right (positive) or left (negative) of the screen, or centred (0),
 * so it sits beside the section's panel. See LiveScene.
 */
export type Shot = { angle: number; distance: number; height: number; frame: number };

export type PanelDef = {
  id: string;
  label: string;
  shot: Shot;
  node: ReactNode;
};

export const shotAttrs = (s: Shot) => ({
  'data-shot': `${s.angle},${s.distance},${s.height},${s.frame}`,
});

/**
 * The home page: every section floats over the live scene, each with its own camera shot, then a
 * closing shot. Smooth scrolling starts once the loader opens.
 */
export default function Page({ panels }: { panels: PanelDef[] }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.1 });
    lenis.stop();
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    const offRevealed = onRevealed(() => {
      lenis.start();
      if (window.location.hash) lenis.scrollTo(window.location.hash, { immediate: true });
    });
    return () => {
      offRevealed();
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="on-scene">
      {panels.map((panel) => (
        <section key={panel.id} id={panel.id} aria-label={panel.label} className="relative" {...shotAttrs(panel.shot)}>
          {panel.node}
        </section>
      ))}
      <Outro />
    </div>
  );
}
