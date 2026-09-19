import { CheckCircle2, Loader2, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import FadeIn from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';
import { CONTACT, PROJECT_TYPES } from '../data';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// Free key from https://web3forms.com — put it in a `.env` file as VITE_WEB3FORMS_KEY=...
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const fieldClass =
  'w-full rounded-2xl border border-[#0C0C0C]/15 bg-[#F1F4F6] px-4 py-3.5 text-base text-[#0C0C0C] placeholder:text-[#0C0C0C]/45 ' +
  'transition-colors duration-200 focus:border-[#0C0C0C] focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#0C0C0C]/15';

const labelClass = 'mb-2 block text-sm font-medium uppercase tracking-wider text-[#0C0C0C]/70';

export default function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // No key configured yet: fall back to the visitor's email app.
    if (!WEB3FORMS_KEY) {
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject type: ${data.get('project_type')}\n\n${data.get('message')}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('New project enquiry')}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    data.append('access_key', WEB3FORMS_KEY);
    data.append('subject', 'New project enquiry — bizuptechnologies.com');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      className="relative z-40 -mt-10 sm:-mt-12 md:-mt-14 bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <FadeIn y={40}>
            <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[#0C0C0C]/55">Get in touch</span>
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 96px)' }}
            >
              Tell us what&apos;s slow.
            </h2>
            <p className="mt-4 font-light leading-snug text-[#0C0C0C]/70" style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}>
              We&apos;ll tell you what it takes to fix it.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="max-w-md font-light leading-relaxed text-[#0C0C0C]/70" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)' }}>
              Free 20-minute call, no obligation. Replies within one business day.
            </p>
          </FadeIn>
          <FadeIn as="ul" delay={0.2} y={20} className="flex flex-col gap-3">
            {[
              { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: Phone, label: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
              { icon: MessageCircle, label: `WhatsApp: ${CONTACT.phoneDisplay}`, href: CONTACT.whatsappHref },
            ].map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group inline-flex min-h-[44px] items-center gap-3 text-base sm:text-lg font-medium transition-opacity duration-200 hover:opacity-70"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0C0C0C] text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="break-all">{label}</span>
                </a>
              </li>
            ))}
          </FadeIn>
        </div>

        <FadeIn delay={0.15} y={30}>
          {status === 'sent' ? (
            <div
              role="status"
              className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-[32px] sm:rounded-[40px] bg-[#F1F4F6] p-8 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden="true" />
              <p className="text-2xl font-semibold">Message sent.</p>
              <p className="max-w-xs font-light text-[#0C0C0C]/70">Thanks! You&apos;ll hear back within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[32px] sm:rounded-[40px] border border-[#0C0C0C]/10 p-6 sm:p-8">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={fieldClass} />
                </div>
              </div>
              <div>
                <label htmlFor="project_type" className={labelClass}>Project type</label>
                <select id="project_type" name="project_type" defaultValue={PROJECT_TYPES[0]} className={`${fieldClass} cursor-pointer`}>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>What do you need?</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="A couple of lines about the business and what you're stuck on."
                  className={`${fieldClass} resize-y`}
                />
              </div>
              {status === 'error' && (
                <p role="alert" className="text-sm text-rose-700">
                  Something went wrong sending that. Please try again, or email {CONTACT.email}.
                </p>
              )}
              <ContactButton type="submit" tone="dark" arrow={status !== 'sending'} disabled={status === 'sending'} className="self-start">
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending
                  </>
                ) : (
                  'Send message'
                )}
              </ContactButton>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
