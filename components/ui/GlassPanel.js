export default function GlassPanel({ as: Tag = "div", strong = false, className = "", children, ...rest }) {
  return (
    <Tag
      className={`rounded-[20px] border border-glass-border-soft backdrop-blur-xl [-webkit-backdrop-filter:blur(24px)] ${className}`}
      style={{
        background: strong ? "var(--glass-bg-strong)" : "var(--glass-bg)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.5), 0 20px 40px -24px rgba(13,12,11,.25)",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
