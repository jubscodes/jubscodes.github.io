import { Container } from "./container";

type Accent = "primary" | "secondary" | "tertiary";

const accent: Record<Accent, string> = {
  primary: "border-primary/30 text-primary",
  secondary: "border-secondary/30 text-secondary",
  tertiary: "border-tertiary/30 text-tertiary",
};

export function TagList({ tags, accent: a }: { tags: string[]; accent: Accent }) {
  return (
    <Container as="section" variant="narrow" className="pt-0 pb-12">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={`rounded-[2px] border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${accent[a]}`}>
            {t}
          </span>
        ))}
      </div>
    </Container>
  );
}
