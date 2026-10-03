import { MotionConfig } from 'framer-motion';
import { lazy, Suspense } from 'react';
import SkipLink from './components/SkipLink';
import Loader from './components/Loader';
import Header from './sections/Header';
import Page from './components/Page';
import { PANELS } from './panels';
import Footer from './sections/Footer';
import LegalPage from './sections/LegalPage';
import { LEGAL_DOCS } from './legal';

// The legal pages are the only routes besides home, so the path is matched by hand (see vercel.json rewrites).
const path = window.location.pathname.replace(/\/+$/, '');
const legalDoc = LEGAL_DOCS.find((doc) => `/${doc.slug}` === path);

// The WebGL stage loads after the page text, so content and search engines never wait on it.
const BlockStage = lazy(() => import('./three/BlockStage'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
      {legalDoc ? (
        <LegalPage doc={legalDoc} />
      ) : (
        <>
          <Loader />
          <SkipLink href="#intro" />
          <Suspense fallback={null}>
            <BlockStage />
          </Suspense>
          <Header />
          <main className="relative z-10" style={{ overflowX: 'clip' }}>
            <Page panels={PANELS} />
          </main>
        </>
      )}
      <Footer />
      </div>
    </MotionConfig>
  );
}
