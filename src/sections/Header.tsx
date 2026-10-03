import { motion } from 'framer-motion';
import { ContactButton } from '../components/Buttons';
import Logo from '../components/Logo';
import { NAV_LINKS } from '../data';
import { useRevealed } from '../loader';

export default function Header() {
  const revealed = useRevealed();
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-x-3 top-3 z-50 sm:inset-x-6 sm:top-4"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-ink/[0.07] bg-white/85 py-1.5 pl-5 pr-1.5 shadow-[0_10px_40px_-20px_rgba(11,11,12,0.35)] sm:pl-6"
      >
        <a href="#top" aria-label="BizUp Technologies, back to top" className="shrink-0">
          <Logo onLight className="h-8 w-auto sm:h-9" />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.filter((l) => l.href !== '#contact').map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[15px] font-medium text-ink/70 transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <ContactButton href="#enquiry" className="!min-h-[42px] !py-1.5 !pl-5 !text-sm">
          Free quote
        </ContactButton>
      </nav>
    </motion.header>
  );
}
