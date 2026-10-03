import type { PanelDef } from './wheel/PageWheel';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import { PrinciplesPanel, ServicePanel } from './sections/ServicesSection';
import { ProjectPanel } from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import FaqSection from './sections/FaqSection';
import ContactSection, { EnquiryPanel } from './sections/ContactSection';
import { PROJECTS, SERVICES } from './data';

/**
 * The rooms on the page wheel, in order. `stage` sets the particle shape behind each one
 * (see ParticleStage for the attributes).
 */
const SERVICE_SHAPES = ['browser', 'phone', 'gear'];

export const PANELS: PanelDef[] = [
  { id: 'top', label: 'Home', stage: { stage: 'logo', y: '0.17', 'mobile-y': '0.2', 'mobile-dim': '1' }, node: <HeroSection /> },
  { id: 'about', label: 'About', stage: { stage: 'globe', side: 'right', spin: '0.12' }, node: <AboutSection /> },
  ...SERVICES.map((s, i) => ({
    id: i === 0 ? 'services' : `service-${i + 1}`,
    label: s.name,
    stage: { stage: SERVICE_SHAPES[i], side: 'right' },
    node: <ServicePanel index={i} />,
  })),
  { id: 'how-we-work', label: 'How we work', stage: { stage: 'cubes', side: 'right', spin: '0.2', dim: '0.5', 'mobile-dim': '0.25', y: '0.18' }, node: <PrinciplesPanel /> },
  ...PROJECTS.map((p, i) => ({
    id: i === 0 ? 'work' : `work-${i + 1}`,
    label: p.name,
    stage: { stage: 'bars', spin: '0.1', dim: '0.28', 'mobile-dim': '0.2' },
    node: <ProjectPanel index={i} />,
  })),
  { id: 'process', label: 'Process', stage: { stage: 'helix', side: 'right', spin: '0.35' }, node: <ProcessSection /> },
  { id: 'faq', label: 'FAQ', scroll: true, stage: { stage: 'ring', spin: '0.15', dim: '0.3', 'mobile-dim': '0.2' }, node: <FaqSection /> },
  { id: 'contact', label: 'Contact', stage: { stage: 'hello', y: '0.17', 'mobile-y': '0.2', 'mobile-dim': '1' }, node: <ContactSection /> },
  { id: 'enquiry', label: 'Send a message', scroll: true, stage: { stage: 'hello', dim: '0.14', 'mobile-dim': '0.1', y: '0.17' }, node: <EnquiryPanel /> },
];
