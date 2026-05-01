type Accent = "primary" | "secondary" | "tertiary";

const accentClass: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function SectionHeader({
  title,
  accent,
  id,
}: {
  title: string;
  accent: Accent;
  id?: string;
}) {
  return (
    <header id={id} className="mx-auto mb-8 max-w-[1200px] px-12">
      <p
        className={`font-mono text-[10px] tracking-[0.2em] ${accentClass[accent]}`}
      >
        ─── {title.toUpperCase()} ───────────────────────────────────────────
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">{title}</h2>
    </header>
  );
}
