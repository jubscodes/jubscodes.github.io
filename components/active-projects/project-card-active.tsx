import type { ActiveProject } from "@/content/active-projects";

const toneClass: Record<ActiveProject["categories"][number]["tone"], string> = {
  primary: "text-primary bg-primary/10 border-primary/20",
  secondary: "text-secondary bg-secondary/10 border-secondary/20",
  tertiary: "text-tertiary bg-tertiary/10 border-tertiary/20",
};

export function ProjectCardActive({ project }: { project: ActiveProject }) {
  return (
    <article className="overflow-hidden rounded-[2px] border border-border bg-surface transition-colors hover:border-border-hover">
      {/* Top ascii dashes */}
      <div
        aria-hidden="true"
        className="h-2 select-none overflow-hidden border-b border-border font-mono text-[8px] leading-none tracking-[0.1em] text-border-hover opacity-40"
      >
        ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶
      </div>

      {project.preview}

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-1.5">
          {project.categories.map((c) => (
            <span
              key={c.label}
              className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] ${toneClass[c.tone]}`}
            >
              {c.label}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-fg">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{project.description}</p>
        <div className="mt-1 flex items-center gap-3">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center rounded-[2px] bg-transparent px-3 text-[13px] font-medium text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-border"
          >
            Explore
          </a>
          {project.install && (
            <div className="inline-flex flex-1 items-center gap-2 overflow-hidden rounded-[2px] border border-border bg-surface px-3 py-1.5 font-mono text-[11px]">
              <code className="truncate text-[11px]">{project.install}</code>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
