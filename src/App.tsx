import { MotionConfig } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import Lenis from 'lenis';
import SkipLink from './components/SkipLink';
import Loader from './components/Loader';
import { onRevealed } from './loader';
import Header from './sections/Header';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import FaqSection from './sections/FaqSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import LegalPage from './sections/LegalPage';
import { LEGAL_DOCS } from './legal';

// The legal pages are the only routes besides home, so the path is matched by hand (see vercel.json rewrites).
const path = window.location.pathname.replace(/\/+$/, '');
const legalDoc = LEGAL_DOCS.find((doc) => `/${doc.slug}` === path);

// The WebGL stage loads after the page text, so content and search engines never wait on it.
const ParticleStage = lazy(() => import('./three/ParticleStage'));

function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.1 });
    lenis.stop();
    const offRevealed = onRevealed(() => lenis.start());
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      offRevealed();
      lenis.destroy();
    };
  }, [enabled]);
}

export default function App() {
  useSmoothScroll(!legalDoc);
  return (
    <MotionConfig reducedMotion="user">
      {legalDoc ? (
        <LegalPage doc={legalDoc} />
      ) : (
        <>
          <Loader />
          <SkipLink href="#intro" />
          <div aria-hidden="true" className="page-glow fixed inset-0 z-0" />
          <Suspense fallback={null}>
            <ParticleStage />
          </Suspense>
          <Header />
          <main className="relative z-10" style={{ overflowX: 'clip' }}>
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <ServicesSection />
            <ProjectsSection />
            <ProcessSection />
            <FaqSection />
            <ContactSection />
          </main>
        </>
      )}
      <Footer />
    </MotionConfig>
  );
}
