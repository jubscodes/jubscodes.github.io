import { getYouTubeId } from "@/lib/youtube";

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const id = getYouTubeId(url);
  return (
    <div className="border border-border bg-surface">
      {title && (
        <p className="border-b border-border px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted">
          {title}
        </p>
      )}
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title ?? "Video"}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
