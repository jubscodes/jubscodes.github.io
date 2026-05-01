import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border bg-bg/90 px-12 backdrop-blur">
      <Link href="/" className="font-mono text-[15px] font-medium tracking-tight transition-colors hover:text-primary">
        jubs.studio
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-6 text-sm text-muted">
        <a
          href="https://github.com/jubscodes"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          github
        </a>
        <a
          href="https://x.com/hoffz_eth"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          x
        </a>
        <a
          href="https://www.linkedin.com/in/julia-hoffmann-/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          linkedin
        </a>
      </div>
    </nav>
  );
}
