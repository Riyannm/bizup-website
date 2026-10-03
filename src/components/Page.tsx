import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { onRevealed } from '../loader';
import Outro from '../sections/Outro';

export type PanelDef = {
  id: string;
  label: string;
  node: ReactNode;
};

/**
 * The home page: the hero over the live scene, then the content sheet (marked data-cover so the
 * scene can stop drawing behind it), then a closing shot of the scene. Smooth scrolling starts
 * once the loader opens.
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

  const [hero, ...rest] = panels;
  const section = (panel: PanelDef) => (
    <section key={panel.id} id={panel.id} aria-label={panel.label} className="relative">
      {panel.node}
    </section>
  );

  return (
    <>
      {section(hero)}
      <div data-cover className="relative z-10 rounded-t-[32px] bg-paper shadow-[0_-40px_80px_-30px_rgba(0,0,0,0.45)] sm:rounded-t-[48px]">
        {rest.map(section)}
      </div>
      <Outro />
    </>
  );
}
