import type { PanelDef } from './components/Page';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import { PrinciplesPanel, ServicePanel } from './sections/ServicesSection';
import { ProjectPanel } from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import FaqSection from './sections/FaqSection';
import ContactSection, { EnquiryPanel } from './sections/ContactSection';
import { PROJECTS, SERVICES } from './data';

/** The home page sections, in order. The first sits over the live scene; the rest are on the content sheet. */
export const PANELS: PanelDef[] = [
  { id: 'top', label: 'Home', node: <HeroSection /> },
  { id: 'about', label: 'About', node: <AboutSection /> },
  ...SERVICES.map((s, i) => ({ id: i === 0 ? 'services' : `service-${i + 1}`, label: s.name, node: <ServicePanel index={i} /> })),
  { id: 'how-we-work', label: 'How we work', node: <PrinciplesPanel /> },
  ...PROJECTS.map((p, i) => ({ id: i === 0 ? 'work' : `work-${i + 1}`, label: p.name, node: <ProjectPanel index={i} /> })),
  { id: 'process', label: 'Process', node: <ProcessSection /> },
  { id: 'faq', label: 'FAQ', node: <FaqSection /> },
  { id: 'contact', label: 'Contact', node: <ContactSection /> },
  { id: 'enquiry', label: 'Send a message', node: <EnquiryPanel /> },
];
