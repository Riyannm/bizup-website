import Logo from '../components/Logo';
import { BUSINESS, CONTACT } from '../data';
import { LEGAL_DOCS } from '../legal';

// Rooted at "/" so they also work from the legal pages.
const LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Contact', href: '/#contact' },
];

const linkClass = 'inline-block py-2 text-white transition-opacity duration-200 hover:opacity-70';

export default function Footer() {
  return (
    <footer className="relative z-10 rounded-t-[32px] bg-ink px-5 sm:rounded-t-[48px] sm:px-8 md:px-10 pt-14 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo className="h-14 w-auto sm:h-16" />
          <p className="mt-3 text-white/60">Websites, apps &amp; automation.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex gap-6 sm:gap-8">
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={`${linkClass} text-sm sm:text-base uppercase tracking-wider`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-6 border-t border-white/15 pt-6 sm:flex-row sm:justify-between">
        <address className="flex flex-col text-sm font-light not-italic leading-relaxed text-white/70">
          <span className="font-medium text-white">{BUSINESS.name}</span>
          <span>{BUSINESS.address || BUSINESS.location}</span>
          {BUSINESS.gstin && <span>GSTIN: {BUSINESS.gstin}</span>}
          <a href={`mailto:${CONTACT.email}`} className={linkClass}>
            {CONTACT.email}
          </a>
          <a href={CONTACT.phoneHref} className={linkClass}>
            {CONTACT.phoneDisplay}
          </a>
        </address>
        <nav aria-label="Legal">
          <ul className="flex flex-col sm:items-end">
            {LEGAL_DOCS.map(({ slug, title }) => (
              <li key={slug}>
                <a href={`/${slug}`} className={`${linkClass} text-sm`}>
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-6xl text-sm font-light text-white/60">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </p>
    </footer>
  );
}
