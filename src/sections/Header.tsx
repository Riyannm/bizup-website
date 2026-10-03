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
      className="fixed inset-x-3 top-3 z-50 sm:inset-x-6 sm:top-5"
    >
      <nav
        aria-label="Primary"
        className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 sm:pl-6"
      >
        <a href="#top" aria-label="BizUp Technologies, back to top" className="shrink-0">
          <Logo className="h-8 w-auto sm:h-9" />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.filter((l) => l.href !== '#contact').map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-flex min-h-[44px] items-center rounded-full px-4 text-sm uppercase tracking-widest text-[#FFFFFF]/75 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <ContactButton href="#enquiry" className="!px-5 !py-2.5 !text-xs sm:!px-6">
          Free quote
        </ContactButton>
      </nav>
    </motion.header>
  );
}
