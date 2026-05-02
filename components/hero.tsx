import { Container } from "./container";

export function Hero() {
  return (
    <Container as="section" variant="wide" className="pt-[120px] pb-20">
      <p className="mb-4 font-mono text-[15px] text-muted">
        {">_"} julia hoffmann buratto
        <span className="ml-0 inline-block animate-pulse text-primary">█</span>
      </p>
      <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-[64px]">
        Code with taste.
      </h1>
      <p className="mb-10 max-w-[480px] text-lg text-muted">
        A design engineering solo studio. Opinionated UI kits and AI design tools — for devs and agents alike.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href="#projects"
          className="inline-flex h-10 items-center justify-center rounded-[2px] bg-primary px-6 text-sm font-medium text-bg transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98]"
        >
          View projects
        </a>
        <div className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-surface px-3 py-1.5 font-mono text-[13px]">
          <code>npx get-shit-pretty</code>
        </div>
      </div>
    </Container>
  );
}
