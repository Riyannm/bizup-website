import { CheckCircle2, Loader2, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import FadeIn from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';
import { CONTACT, PROJECT_TYPES } from '../data';
import PanelBody from '../components/PanelBody';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// Free key from https://web3forms.com — set VITE_WEB3FORMS_KEY (or the older NEXT_PUBLIC_WEB3FORMS_KEY).
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY || import.meta.env.NEXT_PUBLIC_WEB3FORMS_KEY) as string | undefined;

const fieldClass =
  'w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/40 ' +
  'transition-colors duration-200 focus:border-cobalt focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-cobalt/25';

const labelClass = 'mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-ink/55';

export function EnquiryPanel() {
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
    <PanelBody>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <FadeIn y={20}>
            <span className="label">
              <b>(09)</b> Send a message
            </span>
          </FadeIn>
          <FadeIn y={30} delay={0.05}>
            <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}>
              What do you need <em>built</em>?
            </h2>
          </FadeIn>
          <FadeIn y={20} delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-ink/60" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)' }}>
              Free 20-minute call, no obligation. Replies within one business day.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} y={30}>
          {status === 'sent' ? (
            <div
              role="status"
              className="flex h-full min-h-[380px] flex-col items-center justify-center gap-4 card rounded-[32px] sm:rounded-[40px] p-8 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-cobalt" aria-hidden="true" />
              <p className="text-2xl font-semibold">Message sent.</p>
              <p className="max-w-xs text-ink/60">Thanks! You&apos;ll hear back within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card flex flex-col gap-4 rounded-[28px] sm:rounded-[36px] p-5 sm:p-7">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <p className="text-sm text-ink/55">
                Fields marked <span aria-hidden="true">*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="project_type" className={labelClass}>
                  Project type
                </label>
                <select id="project_type" name="project_type" defaultValue={PROJECT_TYPES[0]} className={`${fieldClass} cursor-pointer [.on-scene_&]:[color-scheme:dark]`}>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>
                  What do you need? <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  placeholder="A couple of lines about the business and what you're stuck on."
                  className={`${fieldClass} resize-y`}
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  value="Agreed"
                  required
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#0047AB]"
                />
                <label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed text-ink/70">
                  I agree that BizUp Technologies may use my name, email, and message to reply to this enquiry, as described in the{' '}
                  <a href="/privacy" className="font-medium text-cobalt underline underline-offset-4">
                    Privacy Policy
                  </a>
                  . I can withdraw this at any time by emailing {CONTACT.email}. <span aria-hidden="true">*</span>
                </label>
              </div>
              {status === 'error' && (
                <p role="alert" className="text-sm text-rose-700">
                  Something went wrong sending that. Please try again, or email {CONTACT.email}.
                </p>
              )}
              <ContactButton type="submit" arrow={status !== 'sending'} disabled={status === 'sending'} className="self-start">
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
    </PanelBody>
  );
}

// The camera frames the monument on the right, beside this panel.
export default function ContactSection() {
  return (
    <PanelBody side="left">
      <span className="label">
        <b>(08)</b> Get in touch
      </span>
      <h2 className="headline mt-6" style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5rem)' }}>
        Tell us what&apos;s <em>slow</em>.
      </h2>
      <p className="mt-5 text-lg text-ink/65 sm:text-xl">We&apos;ll tell you what it takes to fix it.</p>
      <FadeIn as="ul" delay={0.2} y={20} className="mt-8 border-t border-ink/15">
        {[
          { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
          { icon: Phone, label: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
          { icon: MessageCircle, label: `WhatsApp ${CONTACT.phoneDisplay}`, href: CONTACT.whatsappHref },
        ].map(({ icon: Icon, label, href }) => (
          <li key={href} className="border-b border-ink/15">
            <a
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex min-h-[56px] items-center gap-4 py-2 text-base font-medium transition-colors duration-200 hover:text-cobalt sm:text-lg"
            >
              <Icon className="h-5 w-5 shrink-0 text-cobalt" aria-hidden="true" />
              <span className="break-all">{label}</span>
            </a>
          </li>
        ))}
      </FadeIn>
      <div className="mt-8">
        <ContactButton href="#enquiry">Send a message</ContactButton>
      </div>
    </PanelBody>
  );
}
