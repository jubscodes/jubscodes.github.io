export function GspPipeline() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[200px] items-center justify-center border-b border-border bg-bg p-8"
    >
      <div className="flex w-full max-w-[320px] flex-col gap-1 font-mono text-[11px] text-muted">
        <div className="flex items-center gap-2 px-2 py-1 text-fg">
          <span className="w-4 flex-shrink-0 text-center text-[#22C55E]">✓</span>
          <span className="flex-1">/gsp:research</span>
          <span className="text-[10px]">TRENDS.md</span>
        </div>
        <div className="w-4 pl-1 text-center text-[10px] text-border-hover">↓</div>

        <div className="flex items-center gap-2 px-2 py-1 text-fg">
          <span className="w-4 flex-shrink-0 text-center text-[#22C55E]">✓</span>
          <span className="flex-1">/gsp:brand</span>
          <span className="text-[10px]">IDENTITY.md</span>
        </div>
        <div className="w-4 pl-1 text-center text-[10px] text-border-hover">↓</div>

        <div className="flex items-center gap-2 px-2 py-1 text-fg">
          <span className="w-4 flex-shrink-0 text-center text-[#22C55E]">✓</span>
          <span className="flex-1">/gsp:system</span>
          <span className="text-[10px]">SYSTEM.md</span>
        </div>
        <div className="w-4 pl-1 text-center text-[10px] text-border-hover">↓</div>

        <div className="flex items-center gap-2 px-2 py-1 text-secondary">
          <span className="w-4 flex-shrink-0 text-center text-secondary">▸</span>
          <span className="flex-1">/gsp:design</span>
          <span className="text-[10px]">running...</span>
        </div>
        <div className="w-4 pl-1 text-center text-[10px] text-border-hover">↓</div>

        <div className="flex items-center gap-2 px-2 py-1 text-border-hover">
          <span className="w-4 flex-shrink-0 text-center">○</span>
          <span className="flex-1">/gsp:build</span>
        </div>
      </div>
    </div>
  );
}
