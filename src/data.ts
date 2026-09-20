export const CONTACT = {
  email: 'hello@bizuptechnologies.com',
  phoneDisplay: '+91 91824 64926',
  phoneHref: 'tel:+919182464926',
  whatsappHref: 'https://wa.me/919182464926',
};

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

/* ---------- Marquee ---------- */

export const MARQUEE_ROWS = {
  builds: [
    'Websites',
    'Web apps',
    'Mobile apps',
    'Dashboards',
    'Automation',
    'Booking systems',
    'Inventory tools',
    'Reports',
  ],
  outcomes: [
    'No more spreadsheets',
    'No hand-offs',
    'Built around you',
    'Replies in 1 business day',
    'Runs itself',
    'Real software',
  ],
};

/* ---------- About ---------- */

export const ABOUT_TEXT =
  "At BizUp, you talk directly to the person building your project. No middlemen, no waiting. We keep you updated, make decisions quickly, and build software that fits the way your business works.";

export const ABOUT_FACTS = [
  { label: 'Based', value: 'India · remote-first' },
  { label: 'Response time', value: 'Within 1 business day' },
  { label: 'Focus', value: 'Small & growing businesses' },
  { label: 'Engagement', value: 'Direct, no hand-offs' },
];

/* ---------- Services ---------- */

export const PRINCIPLES = [
  {
    eyebrow: "How it's built",
    title: 'Real software, built around your business — not a template.',
    body: "Every project starts with how your team actually works, then gets built to fit that, instead of forcing you into someone else's workflow.",
  },
  {
    eyebrow: 'How we work together',
    title: 'Direct communication. Fast decisions. No account managers.',
    body: 'You talk straight to the person building it, from the first call to the day it ships and every fix after that.',
  },
];

export const SERVICES = [
  {
    name: 'Web development',
    description:
      'Marketing sites, booking pages, and full web apps that load fast and are easy for you to update.',
    includes: ['Business & landing sites', 'Customer-facing web apps', 'E-commerce & online stores', 'POS & gas station systems'],
  },
  {
    name: 'Mobile & software apps',
    description:
      'Custom tools built around how your team actually works — not a generic template.',
    includes: [],
  },
  {
    name: 'Business automation',
    description:
      'Dashboards, alerts, and workflows that replace manual tracking with something that runs itself.',
    includes: [],
  },
];

/* ---------- Work ---------- */

export type ProjectVisual = 'cash' | 'routes' | 'reports' | 'website';

export type Project = {
  category: string;
  name: string;
  description: string;
  features: string[];
  visual: ProjectVisual;
};

// Client names are kept private. The card previews use illustrative sample data.
export const PROJECTS: Project[] = [
  {
    category: 'Web app · Cash & operations',
    name: 'Cash management system',
    description:
      'Tracks every collection, payout, and bank deposit in one place, with a built-in warehouse module and role-based access so each person only sees what they need.',
    features: ['Cash ledger', 'Warehouse stock', 'Role & permission control'],
    visual: 'cash',
  },
  {
    category: 'Web app · Amusement operator',
    name: 'Machine & route tracking',
    description:
      'Shows where every amusement machine is, how much each one earns, and which stops are next on the collection and service route.',
    features: ['Machine locations', 'Revenue per machine', 'Route scheduling'],
    visual: 'routes',
  },
  {
    category: 'Web app · Multi-location retail',
    name: 'Inventory & automated reporting',
    description:
      'Stock levels across every store with low-stock alerts, plus daily, weekly, monthly, and yearly reports that build themselves.',
    features: ['Low-stock alerts', 'Reorder points', 'Scheduled reports'],
    visual: 'reports',
  },
  {
    category: 'Website · Vending & delivery',
    name: 'Vending & delivery company website',
    description:
      'A fast, mobile-friendly website that explains the services and turns visitors into machine and delivery requests.',
    features: ['Responsive design', 'Service pages', 'Enquiry forms'],
    visual: 'website',
  },
];

/* ---------- Process ---------- */

export const PROCESS = [
  {
    title: 'Understand the business',
    body: "A short call to map what's slow or manual today, and what a working version 1 needs to do.",
  },
  {
    title: 'Design & build in the open',
    body: 'You see working screens early and often — no black-box month before the first demo.',
  },
  {
    title: 'Ship it, then support it',
    body: 'Launch, train your team on it, and stay on for fixes and the next round of features.',
  },
];

/* ---------- FAQ ---------- */

// Draft answers — review before publishing, especially code ownership and payment terms.
export const FAQS = [
  {
    q: 'How long does a typical project take?',
    a: "It depends on scope — a business site moves faster than a custom app with automation behind it. After the first call you get a written plan with milestones, and you'll see working screens early rather than waiting for one big reveal.",
  },
  {
    q: 'Do you work with businesses outside your city?',
    a: "Yes. BizUp is based in India and remote-first, so discovery calls, demos, and handover all happen online wherever you're located.",
  },
  {
    q: "I don't have a design ready — do I need one?",
    a: 'No. We start from how your business actually works and design the screens with you, then build from there.',
  },
  {
    q: 'Who owns the code after the project?',
    a: "You do. Once the project is paid for, the code, accounts, and data are yours, and we'll hand over everything you need to keep running it.",
  },
  {
    q: 'What if something breaks after launch?',
    a: "You message the same person who built it. We stay on after launch for fixes and the next round of features, so you're never left hunting for a new developer.",
  },
  {
    q: 'How does payment work?',
    a: "Payments are split across project milestones, agreed up front before any work starts, so you're never paying for something you haven't seen.",
  },
];

export const PROJECT_TYPES = [
  'Website',
  'Mobile or software app',
  'Business automation',
  'Not sure yet',
];
