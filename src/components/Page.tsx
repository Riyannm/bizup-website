import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { onRevealed } from '../loader';

export type PanelDef = {
  id: string;
  label: string;
  /** data-stage, data-side, ... for the particle stage (see ParticleStage). */
  stage: Record<string, string>;
  node: ReactNode;
};

function stageAttrs(stage: Record<string, string>) {
  return Object.fromEntries(Object.entries(stage).map(([k, v]) => [`data-${k}`, v]));
}

/** The home page: one full-screen section per panel, with smooth scrolling once the loader opens. */
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
    <>
      {panels.map((panel) => (
        <section key={panel.id} id={panel.id} aria-label={panel.label} {...stageAttrs(panel.stage)} className="relative">
          {panel.node}
        </section>
      ))}
    </>
  );
}
