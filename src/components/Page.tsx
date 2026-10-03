import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { onRevealed } from '../loader';
import Outro from '../sections/Outro';
import type { FormationName } from '../three/formations';

/**
 * Camera shot for a section: the camera circles the island at `angle` degrees, `distance` out and
 * `height` up. `frame` puts the monument on the right (positive) or left (negative) of the screen, or centred (0),
 * so it sits beside the section's panel. See LiveScene.
 */
export type Shot = {
  angle: number;
  distance: number;
  height: number;
  frame: number;
  /** What floats over the island: the 3D logo, or a block formation (see formations.ts). */
  object?: 'logo' | FormationName;
};

export type PanelDef = {
  id: string;
  label: string;
  shot: Shot;
  node: ReactNode;
};

export const shotAttrs = (s: Shot) => ({
  'data-shot': `${s.angle},${s.distance},${s.height},${s.frame}`,
  'data-object': s.object ?? 'logo',
});

/**
 * The home page: every section floats over the live scene, each with its own camera shot, then a
 * closing shot. Smooth scrolling starts once the loader opens.
 */
export default function Page({ panels }: { panels: PanelDef[] }) {
  useEffect(() => {
    // Every visit starts at the top with the intro, even from an old link ending in #work.
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.1 });
    lenis?.stop();
    let raf = lenis
      ? requestAnimationFrame(function loop(time) {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        })
      : 0;
    const offRevealed = onRevealed(() => lenis?.start());

    // In-page links (#work, /#contact from the footer...) scroll there without adding the
    // #section to the address, so a reload or a shared link doesn't land mid-page.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (!href || !(href.startsWith('#') || href.startsWith('/#'))) return;
      const target = document.getElementById(href.slice(href.indexOf('#') + 1));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target);
      else target.scrollIntoView();
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      offRevealed();
      cancelAnimationFrame(raf);
      lenis?.destroy();
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
