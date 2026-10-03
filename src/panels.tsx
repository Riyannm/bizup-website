import type { PanelDef } from './components/Page';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import { PrinciplesPanel, ServicePanel } from './sections/ServicesSection';
import { ProjectPanel } from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import FaqSection from './sections/FaqSection';
import ContactSection, { EnquiryPanel } from './sections/ContactSection';
import { PROJECTS, SERVICES } from './data';

/**
 * The home page sections, in order. `stage` sets the 3D block formation beside each one
 * (see BlockStage for the attributes).
 */
const SERVICE_SHAPES = ['browser', 'phone', 'conveyor'];

export const PANELS: PanelDef[] = [
  { id: 'top', label: 'Home', stage: { stage: 'sculpture', side: 'right', y: '0.06', size: '0.82', spin: '0.12', 'mobile-y': '0.24', 'mobile-dim': '1' }, node: <HeroSection /> },
  { id: 'about', label: 'About', stage: { stage: 'globe', side: 'right', spin: '0.15' }, node: <AboutSection /> },
  ...SERVICES.map((s, i) => ({
    id: i === 0 ? 'services' : `service-${i + 1}`,
    label: s.name,
    stage: { stage: SERVICE_SHAPES[i], side: 'right', ...(i === 2 ? { size: '1.35' } : {}) },
    node: <ServicePanel index={i} />,
  })),
  { id: 'how-we-work', label: 'How we work', stage: { stage: 'stack', side: 'right', spin: '0.1', y: '0.05' }, node: <PrinciplesPanel /> },
  // The project cards fill the screen, so the blocks step aside while they're showing.
  ...PROJECTS.map((p, i) => ({
    id: i === 0 ? 'work' : `work-${i + 1}`,
    label: p.name,
    stage: { stage: 'bars', side: 'right', dim: '0', 'mobile-dim': '0' },
    node: <ProjectPanel index={i} />,
  })),
  { id: 'process', label: 'Process', stage: { stage: 'stairs', side: 'right' }, node: <ProcessSection /> },
  { id: 'faq', label: 'FAQ', stage: { stage: 'orbit', side: 'left', y: '-0.2' }, node: <FaqSection /> },
  { id: 'contact', label: 'Contact', stage: { stage: 'cube', side: 'right', spin: '0.2', size: '0.62' }, node: <ContactSection /> },
  { id: 'enquiry', label: 'Send a message', stage: { stage: 'cube', side: 'right', spin: '0.2', size: '0.62', dim: '0', 'mobile-dim': '0' }, node: <EnquiryPanel /> },
];
