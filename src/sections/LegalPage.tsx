import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import Logo from '../components/Logo';
import SkipLink from '../components/SkipLink';
import { BUSINESS, CONTACT } from '../data';
import { LEGAL_UPDATED, type LegalDoc } from '../legal';

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  useEffect(() => {
    document.title = `${doc.title} — ${BUSINESS.name}`;
    // index.html describes the home page, so point search engines at this page instead.
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://bizuptechnologies.com/${doc.slug}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.summary);
  }, [doc]);

  return (
    <>
      <SkipLink href="#content" />
      <header className="flex items-center justify-between gap-6 px-6 md:px-10 pt-6 md:pt-8 pb-10 sm:pb-14">
        <a href="/" aria-label={`${BUSINESS.name}, home`}>
          <Logo />
        </a>
        <a
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to site
        </a>
      </header>

      <main
        id="content"
        className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-24 md:pb-32"
      >
        <article className="mx-auto max-w-3xl">
          <h1 className="font-black uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.25rem, 6vw, 72px)' }}>
            {doc.title}
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-[#0C0C0C]/70">Last updated: {LEGAL_UPDATED}</p>
          <p className="mt-6 font-light leading-relaxed text-[#0C0C0C]/80" style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)' }}>
            {doc.summary}
          </p>

          {doc.sections.map(({ heading, blocks }) => (
            <section key={heading} className="mt-10 sm:mt-12">
              <h2 className="font-semibold leading-tight" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)' }}>
                {heading}
              </h2>
              {blocks.map((block, i) =>
                Array.isArray(block) ? (
                  <ul key={i} className="mt-4 flex list-disc flex-col gap-2 pl-5 text-base sm:text-lg font-light leading-relaxed text-[#0C0C0C]/80">
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="mt-4 text-base sm:text-lg font-light leading-relaxed text-[#0C0C0C]/80">
                    {block}
                  </p>
                ),
              )}
            </section>
          ))}

          <section className="mt-10 sm:mt-12 rounded-[32px] bg-[#F1F4F6] p-7 sm:p-9">
            <h2 className="font-semibold leading-tight" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)' }}>
              Contact
            </h2>
            <address className="mt-4 flex flex-col gap-1 text-base sm:text-lg not-italic leading-relaxed">
              <span className="font-medium">{BUSINESS.name}</span>
              <span className="font-light text-[#0C0C0C]/80">{BUSINESS.address || BUSINESS.location}</span>
              {BUSINESS.gstin && <span className="font-light text-[#0C0C0C]/80">GSTIN: {BUSINESS.gstin}</span>}
              <a href={`mailto:${CONTACT.email}`} className="mt-2 font-medium underline underline-offset-4">
                {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className="font-medium underline underline-offset-4">
                {CONTACT.phoneDisplay}
              </a>
            </address>
          </section>
        </article>
      </main>
    </>
  );
}
