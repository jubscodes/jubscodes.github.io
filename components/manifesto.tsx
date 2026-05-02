import { Container } from "./container";

export function Manifesto() {
  const beliefs = [
    "I believe good design is a system, not a layer.",
    "Not something you add after the code works. Something that shapes how the code is written.",
    "I believe opinion is a feature.",
    "That every component should look like it belongs. That coherence is worth more than configuration.",
    "I build tools for the craft — not blank canvases.",
    "For the builders who ship, and the agents that assist them.",
    "Bland is a choice. I chose different.",
  ];
  return (
    <Container as="section" variant="wide" className="py-20">
      <p className="mb-10 font-mono text-xs uppercase tracking-[0.08em] text-muted">
        Manifesto
      </p>
      <div className="flex flex-col gap-6 max-w-[640px]">
        {beliefs.map((b, i) => (
          <p key={i} className="text-lg leading-relaxed text-fg">{b}</p>
        ))}
      </div>
    </Container>
  );
}
