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
 * The home page sections, in order, each with the camera shot behind it. The camera circles the
 * island as the page scrolls; `frame` keeps the monument on the side opposite the section's panel.
 */
const SERVICE_OBJECTS = ['browser', 'phone', 'conveyor'] as const;

export const PANELS: PanelDef[] = [
  { id: 'top', label: 'Home', shot: { angle: 19, distance: 36, height: 6, frame: 1.45 }, node: <HeroSection /> },
  { id: 'about', label: 'About', shot: { angle: 30, distance: 46, height: 18, frame: 1, object: 'globe' }, node: <AboutSection /> },
  ...SERVICES.map((s, i) => ({
    id: i === 0 ? 'services' : `service-${i + 1}`,
    label: s.name,
    shot: { angle: 75 + i * 45, distance: 34 + i * 3, height: [4, 11, 6][i], frame: i % 2 === 0 ? -1 : 1, object: SERVICE_OBJECTS[i] },
    node: <ServicePanel index={i} />,
  })),
  { id: 'how-we-work', label: 'How we work', shot: { angle: 215, distance: 58, height: 30, frame: 0, object: 'stack' }, node: <PrinciplesPanel /> },
  ...PROJECTS.map((p, i) => ({
    id: i === 0 ? 'work' : `work-${i + 1}`,
    label: p.name,
    shot: { angle: 245 + i * 18, distance: 44, height: 7 + i * 2, frame: 0, object: 'bars' as const },
    node: <ProjectPanel index={i} />,
  })),
  { id: 'process', label: 'Process', shot: { angle: 330, distance: 38, height: 12, frame: 1, object: 'stairs' }, node: <ProcessSection /> },
  { id: 'faq', label: 'FAQ', shot: { angle: 365, distance: 46, height: 5, frame: -1, object: 'orbit' }, node: <FaqSection /> },
  { id: 'contact', label: 'Contact', shot: { angle: 395, distance: 30, height: 3.5, frame: 1, object: 'cube' }, node: <ContactSection /> },
  { id: 'enquiry', label: 'Send a message', shot: { angle: 410, distance: 40, height: 9, frame: 0, object: 'cube' }, node: <EnquiryPanel /> },
];
