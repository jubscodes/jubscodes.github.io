export function Footer() {
  return (
    <footer className="border-t border-border pt-12 pb-6">
      <div className="mx-auto max-w-[1200px] px-12">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
          <div>
            <div className="mb-2 font-mono text-[15px] font-medium">jubs.studio</div>
            <div className="text-sm text-muted">
              Design engineering solo studio.
              <br />
              For builders.
            </div>
          </div>
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Projects
            </div>
            <ul className="flex list-none flex-col gap-2">
              <li>
                <a
                  href="https://github.com/jubscodes/cyphercn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  CypherCN
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/jubscodes/get-shit-pretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  Get Shit Pretty
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Selected Work</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/projects/shippit/" className="hover:text-secondary">
                  Shippit
                </a>
              </li>
              <li>
                <a href="/projects/notus/" className="hover:text-secondary">
                  Notus / Chainless
                </a>
              </li>
              <li>
                <a href="/projects/heimdall/" className="hover:text-secondary">
                  Heimdall
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Connect
            </div>
            <ul className="flex list-none flex-col gap-2">
              <li>
                <a
                  href="https://github.com/jubscodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/hoffz_eth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/julia-hoffmann-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <div className="flex justify-between font-mono text-xs text-border-hover opacity-50">
            <span>{">_"} █</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
