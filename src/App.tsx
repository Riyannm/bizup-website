import { MotionConfig } from 'framer-motion';
import SkipLink from './components/SkipLink';
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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {legalDoc ? (
        <LegalPage doc={legalDoc} />
      ) : (
        <>
          <SkipLink href="#intro" />
          <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
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
