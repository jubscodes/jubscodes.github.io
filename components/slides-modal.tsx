"use client";

import { useEffect, useState } from "react";

export function SlidesModal({
  src,
  title,
  standaloneUrl,
}: {
  src: string;
  title?: string;
  standaloneUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = title ?? "Slides";
  const standalone = standaloneUrl ?? src;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-3 font-mono text-xs uppercase tracking-wider text-fg hover:bg-surface/80"
      >
        <span aria-hidden="true">▶</span>
        <span>{label}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-4"
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-3">
            <a
              href={standalone}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-xs uppercase tracking-wider text-secondary hover:underline"
            >
              Open in new tab ↗
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="font-mono text-xs uppercase tracking-wider text-muted hover:text-fg"
            >
              ESC ✕
            </button>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-video w-full max-w-6xl border border-border bg-surface"
          >
            <iframe
              src={src}
              title={label}
              loading="lazy"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
