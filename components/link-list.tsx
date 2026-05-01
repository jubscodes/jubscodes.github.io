import type { Link } from "@/lib/content";

export function LinkList({ links }: { links: Link[] }) {
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
              className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-fg hover:border-secondary hover:text-secondary"
            >
              {l.label} →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
