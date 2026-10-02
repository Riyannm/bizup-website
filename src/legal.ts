import { BUSINESS, CONTACT } from './data';

// A block is a paragraph, or a bulleted list when it's an array.
export type LegalBlock = string | string[];

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; blocks: LegalBlock[] }[];
};

export const LEGAL_UPDATED = '2 October 2026';

const NAME = BUSINESS.name;

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary:
      'What personal data this website collects, why, who handles it, and the rights you have over it under India’s Digital Personal Data Protection Act, 2023.',
    sections: [
      {
        heading: 'Who we are',
        blocks: [
          `${NAME} is the trading name of an independent freelance software and automation practice based in India. For personal data collected through this website, ${NAME} is the "data fiduciary" under the Digital Personal Data Protection Act, 2023 (DPDP Act), which means we decide why and how that data is used and are responsible for it.`,
          `You can reach us about anything in this policy at ${CONTACT.email} or ${CONTACT.phoneDisplay}.`,
        ],
      },
      {
        heading: 'What we collect',
        blocks: [
          'We only collect what we need to reply to you:',
          [
            'Contact form: your name, your email address, the type of project you picked, the message you wrote, and a record that you ticked the consent box.',
            'Email, phone or WhatsApp: if you contact us directly, we receive your email address or phone number and whatever you choose to tell us.',
            'Server logs: like every website, our hosting provider automatically records technical details of each request, such as IP address, browser type, and the time of the visit. This is used to deliver the site and keep it secure.',
          ],
          'We do not ask for sensitive information such as government ID numbers, financial details, or health information, and we ask that you do not put any in the message box.',
          'This website does not use cookies, analytics, advertising pixels, or any other tracking. You do not need an account to use it.',
        ],
      },
      {
        heading: 'Why we use it',
        blocks: [
          [
            'To reply to your enquiry and understand what you need.',
            'To prepare a quote or proposal if you ask for one.',
            'To deliver and support the project if you become a client.',
            'To keep the business records that Indian tax and accounting law requires.',
          ],
          'We do not sell your data, we do not add you to a marketing list, and we do not use it for anything unrelated to your enquiry.',
        ],
      },
      {
        heading: 'Consent, and how to withdraw it',
        blocks: [
          'We process contact form data on the basis of your consent, which you give by ticking the box on the form before sending it. The form cannot be sent without it.',
          `You can withdraw your consent at any time by emailing ${CONTACT.email}. It is as easy as that one message. Once you do, we stop using your data and delete it, unless the law requires us to keep a record. Withdrawing consent does not affect anything we did before you withdrew it.`,
        ],
      },
      {
        heading: 'Who else handles your data',
        blocks: [
          'We use a small number of service providers to run this website and our inbox. They process data on our behalf, only for the purposes below:',
          [
            'Web3Forms: delivers contact form submissions to our email inbox.',
            'Vercel: hosts this website and keeps the server logs described above.',
            'Our email provider: stores the messages you send us and our replies.',
            'WhatsApp: only if you choose to message us there. WhatsApp’s own privacy policy applies to that conversation.',
          ],
          'Some of these providers store or process data on servers outside India. We do not share your data with anyone else unless the law requires it.',
        ],
      },
      {
        heading: 'How long we keep it',
        blocks: [
          [
            'Enquiries that do not become a project are deleted within 12 months of our last contact with you.',
            'Client records, such as proposals, invoices, and project correspondence, are kept for as long as tax and accounting law requires.',
            'You can ask us to delete your data sooner at any time.',
          ],
        ],
      },
      {
        heading: 'Your rights',
        blocks: [
          'Under the DPDP Act you have the right to:',
          [
            'Ask for a summary of the personal data we hold about you and what we have done with it.',
            'Ask us to correct, complete, or update it.',
            'Ask us to erase it.',
            'Withdraw your consent.',
            'Nominate another person to exercise these rights on your behalf if you die or become unable to act.',
            'Raise a grievance with us, and get a response.',
          ],
          `To use any of these rights, email ${CONTACT.email} from the address you used to contact us, so we can confirm it is you. There is no charge.`,
        ],
      },
      {
        heading: 'Grievances and complaints',
        blocks: [
          `If you are unhappy with how your data has been handled, email ${CONTACT.email} with the subject "Privacy grievance". We acknowledge every grievance within one business day and resolve it within 30 days.`,
          'If you are still not satisfied after that, you have the right to complain to the Data Protection Board of India.',
        ],
      },
      {
        heading: 'Children',
        blocks: [
          'This website is for businesses. It is not directed at anyone under 18, and we do not knowingly collect personal data from children. If you believe a child has sent us their details, tell us and we will delete them.',
        ],
      },
      {
        heading: 'Security',
        blocks: [
          'The site is served only over an encrypted (HTTPS) connection, and access to enquiries is limited to the people who need them to reply to you. If a data breach ever affects your personal data, we will tell you and the Data Protection Board of India as the law requires.',
        ],
      },
      {
        heading: 'Changes to this policy',
        blocks: [
          'If we change how we handle personal data, we will update this page and the date at the top. If a change means using your data for a new purpose, we will ask for your consent first.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    summary: 'The terms for using this website, and how they relate to the written agreement you get when you hire us.',
    sections: [
      {
        heading: 'About these terms',
        blocks: [
          `This website is run by ${NAME}, the trading name of an independent freelance software and automation practice based in India. By using the site you agree to these terms.`,
          'These terms cover the website. Any project we take on for you is covered by a separate written proposal or agreement that sets out the scope, price, timeline, and payment schedule. If that agreement and these terms ever disagree, the agreement wins.',
        ],
      },
      {
        heading: 'Using this website',
        blocks: [
          'You may browse the site and contact us through it for any lawful purpose. You agree not to:',
          [
            'Try to break, overload, or gain unauthorised access to the site or its hosting.',
            'Send spam, malicious code, or unlawful content through the contact form.',
            'Copy or scrape the site in bulk, or pass it off as your own.',
          ],
        ],
      },
      {
        heading: 'Quotes and proposals',
        blocks: [
          'The information on this website is a general description of what we do. It is not a binding offer. The introductory call is free and carries no obligation on either side.',
          'A project starts only when both of us have agreed a written proposal. Timelines depend on scope and are set out in that proposal.',
        ],
      },
      {
        heading: 'Payment',
        blocks: [
          'Project payments are split across milestones that are agreed in writing before any work starts. Applicable taxes are charged in addition where the law requires. Refunds and cancellations are covered by our Refund Policy.',
        ],
      },
      {
        heading: 'Who owns what',
        blocks: [
          `The text, design, logo, and code of this website belong to ${NAME}. You may not reuse them without our written permission.`,
          'For client projects: once a project is paid for in full, the code, accounts, and data we built for you are yours, and we hand over what you need to keep running it. Until then they remain with us. Open-source and third-party components stay under their own licences.',
        ],
      },
      {
        heading: 'Work shown on this site',
        blocks: [
          'The projects in the Work section describe software we have built. Client names are kept private, and the on-screen previews are illustrations that use sample data, not real client figures.',
        ],
      },
      {
        heading: 'Links and third-party services',
        blocks: [
          'The site links to services we do not control, such as WhatsApp and your email app. Their own terms and privacy policies apply once you leave this site.',
        ],
      },
      {
        heading: 'Liability',
        blocks: [
          'We work to keep this website accurate and available, but it is provided "as is", without any guarantee that it will always be online or free of errors. To the extent the law allows, we are not liable for losses that arise from using or relying on the website itself.',
          'Nothing in these terms limits any right you have under Indian law that cannot be limited by contract, including your rights under the Consumer Protection Act, 2019.',
        ],
      },
      {
        heading: 'Governing law',
        blocks: ['These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the courts of India.'],
      },
      {
        heading: 'Changes',
        blocks: ['We may update these terms from time to time. The current version is always on this page, with the date it was last updated at the top.'],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookies Policy',
    summary: 'The short version: this website does not set any cookies and does not track you.',
    sections: [
      {
        heading: 'We do not use cookies',
        blocks: [
          'This website does not set any cookies, and it does not store anything in your browser’s local storage. That is why you do not see a cookie banner here: there is nothing to accept or reject.',
          [
            'No analytics, such as Google Analytics.',
            'No advertising or social media pixels.',
            'No embedded videos, maps, or chat widgets.',
            'No fonts or scripts loaded from other companies’ servers.',
          ],
        ],
      },
      {
        heading: 'What does happen when you visit',
        blocks: [
          [
            'Server logs: our hosting provider, Vercel, records technical details of each request (such as IP address and browser type) to deliver the site and keep it secure. This does not involve cookies.',
            'Contact form: only when you press Send, your form details go to Web3Forms, which delivers them to our inbox. Nothing is sent before that.',
            'Links: the email, phone, and WhatsApp links open those apps. Once you are there, their own policies apply.',
          ],
        ],
      },
      {
        heading: 'If this ever changes',
        blocks: [
          'If we add anything that uses cookies or similar tracking, we will update this page first and ask for your consent before any non-essential cookie is set.',
        ],
      },
    ],
  },
  {
    slug: 'refunds',
    title: 'Refund Policy',
    summary: 'How cancellations and refunds work for projects with us.',
    sections: [
      {
        heading: 'Before you pay anything',
        blocks: [
          'The introductory call and the quote are free. Nothing is charged until you have agreed a written proposal, so there is nothing to refund at that stage.',
        ],
      },
      {
        heading: 'How billing works',
        blocks: [
          'Projects are paid in milestones that are agreed in writing before work starts. Each milestone has a defined piece of work attached to it, and you see that work before the next payment is due.',
        ],
      },
      {
        heading: 'When you get a refund',
        blocks: [
          [
            'You cancel before we have started a milestone you already paid for: that payment is refunded in full.',
            'You cancel partway through a milestone: you pay for the work completed up to that point, and the rest of that payment is refunded. You receive the work you paid for.',
            'We are unable to deliver something we agreed to: the amount paid for the undelivered part is refunded.',
            'You were charged twice or by mistake: the extra amount is refunded in full.',
          ],
        ],
      },
      {
        heading: 'What is not refundable',
        blocks: [
          [
            'Milestones that have been delivered and approved by you.',
            'Costs already paid to others on your behalf, such as domain names, hosting, software licences, and paid plugins. These are yours to keep.',
          ],
          'If something we built does not work as agreed, tell us. We fix it first, at no extra cost, rather than leaving you with a refund and no working software.',
        ],
      },
      {
        heading: 'How to ask for a refund',
        blocks: [
          `Email ${CONTACT.email} with your name and the project. We reply within one business day. Approved refunds are sent to your original payment method within 10 business days.`,
        ],
      },
      {
        heading: 'Your legal rights',
        blocks: [
          'This policy does not take away any right you have under Indian law, including the Consumer Protection Act, 2019. If your written proposal says something different about cancellations, the proposal applies.',
        ],
      },
    ],
  },
];
