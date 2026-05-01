import Link from "next/link";

type Item = { slug: string; name: string };

export function PrevNextNav({ prev, next }: { prev: Item; next: Item }) {
  return (
    <nav className="mx-auto grid max-w-5xl grid-cols-2 gap-6 border-t border-border px-8 py-12">
      <Link href={`/projects/${prev.slug}/`} className="group block">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">◂ Previous case study</p>
        <p className="mt-2 text-2xl font-medium group-hover:text-secondary">{prev.name}</p>
      </Link>
      <Link href={`/projects/${next.slug}/`} className="group block text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Next case study ▸</p>
        <p className="mt-2 text-2xl font-medium group-hover:text-secondary">{next.name}</p>
      </Link>
    </nav>
  );
}
