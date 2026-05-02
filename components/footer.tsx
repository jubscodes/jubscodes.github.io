import { SectionDivider } from "./section-divider";

type Accent = "primary" | "secondary" | "tertiary";

const accentHover: Record<Accent, string> = {
  primary: "hover:text-primary",
  secondary: "hover:text-secondary",
  tertiary: "hover:text-tertiary",
};

const links = {
  projects: [
    { label: "CypherCN", href: "https://github.com/jubscodes/cyphercn" },
    { label: "Get Shit Pretty", href: "https://github.com/jubscodes/get-shit-pretty" },
  ],
  selectedWork: [
    { label: "Shippit", href: "/projects/shippit/" },
    { label: "Notus / Chainless", href: "/projects/notus/" },
    { label: "Heimdall", href: "/projects/heimdall/" },
  ],
  connect: [
    { label: "GitHub", href: "https://github.com/jubscodes" },
    { label: "X", href: "https://x.com/hoffz_eth" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/julia-hoffmann-/" },
  ],
};

function FooterColumn({
  label,
  items,
  accent,
}: {
  label: string;
  items: { label: string; href: string }[];
  accent: Accent;
}) {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              {...(l.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`text-sm text-muted transition-colors ${accentHover[accent]}`}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <SectionDivider />
      <footer className="pt-4 pb-8">
        <div className="mx-auto max-w-[1200px] px-12">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-12">
            <div>
              <p className="font-mono text-[15px] font-medium">jubs.studio</p>
              <p className="mt-1 text-sm text-fg">Julia Hoffmann</p>
              <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-muted">
                Design engineering · Solo studio · For builders.
              </p>
            </div>
            <FooterColumn label="Projects" items={links.projects} accent="primary" />
            <FooterColumn label="Selected Work" items={links.selectedWork} accent="secondary" />
            <FooterColumn label="Connect" items={links.connect} accent="tertiary" />
          </div>
        </div>
        <div aria-hidden className="h-px w-full bg-border" />
        <div className="mx-auto max-w-[1200px] px-12 pt-6">
          <div className="flex flex-col gap-2 font-mono text-xs text-muted md:flex-row md:items-center md:justify-between">
            <span>© {year} Julia Hoffmann · jubs.studio</span>
            <span className="text-muted">{">_"} v0.1.0</span>
          </div>
        </div>
      </footer>
    </>
  );
}
