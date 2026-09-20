import Logo from '../components/Logo';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-14 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo className="h-14 w-auto sm:h-16" />
          <p className="mt-3 font-light text-[#D7E2EA]/70">Websites, apps &amp; automation.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex gap-6 sm:gap-8">
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="inline-block py-2 text-sm sm:text-base uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-[#D7E2EA]/15 pt-6 text-sm font-light text-[#D7E2EA]/60">
        © {new Date().getFullYear()} BizUp Technologies
      </p>
    </footer>
  );
}
