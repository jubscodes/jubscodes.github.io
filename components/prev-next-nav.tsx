import Link from "next/link";
import { Container } from "./container";

type Accent = "primary" | "secondary" | "tertiary";
type Item = { slug: string; name: string };

const accentHover: Record<Accent, string> = {
  primary: "group-hover:text-primary",
  secondary: "group-hover:text-secondary",
  tertiary: "group-hover:text-tertiary",
};

export function PrevNextNav({ prev, next, accent }: { prev: Item; next: Item; accent: Accent }) {
  const hoverCls = `transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${accentHover[accent]}`;
  return (
    <>
      <div aria-hidden className="h-px w-full bg-border" />
      <Container as="nav" variant="narrow" className="grid grid-cols-2 gap-6 py-12">
        <Link href={`/projects/${prev.slug}/`} className="group block">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">◂ Previous case study</p>
          <p className={`mt-2 text-2xl font-medium ${hoverCls}`}>{prev.name}</p>
        </Link>
        <Link href={`/projects/${next.slug}/`} className="group block text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Next case study ▸</p>
          <p className={`mt-2 text-2xl font-medium ${hoverCls}`}>{next.name}</p>
        </Link>
      </Container>
    </>
  );
}
