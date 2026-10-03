/** First tab stop on the page: lets keyboard users jump past the navigation. Hidden until focused. */
export default function SkipLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#FFFFFF] focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:uppercase focus:tracking-widest focus:text-[#000000]"
    >
      Skip to content
    </a>
  );
}
