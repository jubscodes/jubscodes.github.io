export function ContentBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-8 py-10 md:grid-cols-[200px_1fr]">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="text-lg leading-relaxed">{children}</div>
    </section>
  );
}
