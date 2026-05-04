import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border bg-bg/90 px-6 backdrop-blur sm:px-8 md:px-12">
      <Link href="/" className="font-mono text-[15px] font-medium tracking-tight transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-primary">
        jubs.studio
      </Link>
      <Link
        href="/about/"
        className="ml-6 text-sm text-muted transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-fg md:ml-8"
      >
        about
      </Link>
      <div className="flex-1" />
      <div className="hidden items-center gap-6 text-sm text-muted md:flex">
        <a
          href="https://github.com/jubscodes"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-fg"
        >
          github
        </a>
        <a
          href="https://x.com/hoffz_eth"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-fg"
        >
          x
        </a>
        <a
          href="https://www.linkedin.com/in/julia-hoffmann-/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-fg"
        >
          linkedin
        </a>
      </div>
    </nav>
  );
}
