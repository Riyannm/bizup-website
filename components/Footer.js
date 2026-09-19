export default function Footer() {
  return (
    <footer className="border-t border-rule py-8">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-[22px]">
        <div className="text-xs text-fg-faint">© 2026 BizUp Technologies</div>
        <div className="flex gap-5.5 text-[13.5px] text-fg-soft">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="text-xs text-fg-faint">Websites, apps &amp; automation.</div>
      </div>
    </footer>
  );
}
