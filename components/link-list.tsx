import type { Link } from "@/lib/content";

type Accent = "primary" | "secondary" | "tertiary";

const accentHover: Record<Accent, string> = {
  primary: "hover:border-primary hover:text-primary",
  secondary: "hover:border-secondary hover:text-secondary",
  tertiary: "hover:border-tertiary hover:text-tertiary",
};

export function LinkList({ links, accent }: { links: Link[]; accent: Accent }) {
  if (links.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-8 py-6">
      <ul className="flex flex-wrap gap-4">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className={`rounded-[2px] border border-border px-4 py-3 font-mono text-xs uppercase tracking-wider text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${accentHover[accent]}`}
            >
              {l.label} →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
