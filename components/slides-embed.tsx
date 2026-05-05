export function SlidesEmbed({
  src,
  title,
  standaloneUrl,
}: {
  src: string;
  title?: string;
  standaloneUrl?: string;
}) {
  const standalone = standaloneUrl ?? src;
  return (
    <div className="border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          {title ?? "Slides"}
        </p>
        <a
          href={standalone}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-wider text-secondary hover:underline"
        >
          Open in new tab ↗
        </a>
      </div>
      <div className="relative aspect-video">
        <iframe
          src={src}
          title={title ?? "Slides"}
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
