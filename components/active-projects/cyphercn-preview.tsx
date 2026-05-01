export function CypherCnPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative flex min-h-[200px] flex-wrap items-center justify-center gap-3 border-b border-border bg-bg p-8"
    >
      {/* CRT scanlines overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Filled button */}
      <span className="pointer-events-none border border-fg bg-fg px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] text-bg">
        EXECUTE
      </span>

      {/* Ghost button */}
      <span className="pointer-events-none border border-fg bg-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] text-fg">
        [ GHOST ]
      </span>

      {/* Terminal button */}
      <span className="pointer-events-none border border-fg bg-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] text-fg">
        [ TERMINAL ]
      </span>

      {/* Bracket badge */}
      <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-primary">
        [ACTIVE]
      </span>

      {/* Tag badge */}
      <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
        &lt;SYSTEM&gt;
      </span>

      {/* Dot badge */}
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-fg">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        ONLINE
      </span>

      {/* Input */}
      <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
        <span className="text-white/50">&gt;</span> ENTER COMMAND_
      </span>
    </div>
  );
}
