export function TerminalInstall() {
  return (
    <section className="mx-auto max-w-[1200px] px-12 pb-20">
      <div className="overflow-hidden rounded-[2px] border border-border bg-bg">
        <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted">
          ─ install ─
        </div>
        <div className="p-6 font-mono text-sm leading-[1.8]">
          <div className="flex gap-2">
            <span className="select-none text-primary">$</span>
            <span>npx get-shit-pretty</span>
          </div>
          <div className="flex gap-2">
            <span className="pl-4 text-muted">&nbsp;</span>
          </div>
          <div className="flex gap-2">
            <span className="select-none text-[#22C55E]">✓</span>
            <span>9 agents loaded</span>
          </div>
          <div className="flex gap-2">
            <span className="select-none text-[#22C55E]">✓</span>
            <span>11 skills installed</span>
          </div>
          <div className="flex gap-2">
            <span className="select-none text-[#22C55E]">✓</span>
            <span>Design pipeline: ready</span>
          </div>
          <div className="flex gap-2">
            <span className="pl-4 text-muted">&nbsp;</span>
          </div>
          <div className="flex gap-2">
            <span className="pl-4 text-muted">Ready. Your UI has taste now.</span>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="text-primary">{">"}</span>
            <span className="animate-pulse text-primary">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
