import { Container } from "./container";

export function ContentBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Container as="section" variant="narrow" className="grid gap-8 py-10 md:grid-cols-[200px_1fr]">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="text-lg leading-relaxed">{children}</div>
    </Container>
  );
}
