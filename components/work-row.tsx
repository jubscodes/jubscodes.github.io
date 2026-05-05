import Image from "next/image";
import NextLink from "next/link";
import { Container } from "./container";
import { MediaList } from "./media-list";
import type { MediaItem } from "@/lib/content";

type Accent = "primary" | "secondary" | "tertiary";

const accentBgHover: Record<Accent, string> = {
  primary: "group-hover:bg-primary/5 group-focus-within:bg-primary/5",
  secondary: "group-hover:bg-secondary/5 group-focus-within:bg-secondary/5",
  tertiary: "group-hover:bg-tertiary/5 group-focus-within:bg-tertiary/5",
};

const accentText: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export type WorkRowLink = { label: string; href: string; external?: boolean };

export type WorkRowItem = {
  slug: string;
  name: string;
  meta: string;
  cover?: { src: string; alt: string };
  outcome: string;
  tags: string[];
  links?: WorkRowLink[];
  media?: MediaItem[];
};

export function WorkRow({
  item,
  variant,
  accent,
}: {
  item: WorkRowItem;
  variant: "case-study" | "experience";
  accent: Accent;
}) {
  const isLink = variant === "case-study";
  const hasMedia = !!item.media?.length;
  const className = `group block w-full border-b border-border outline-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${accentBgHover[accent]}`;

  // Lift max-h when media is present (two stacked 16:9 embeds need more room).
  const maxHeight = hasMedia ? "1200px" : "480px";

  const tagsAndLinks = (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {item.tags.map((t) => (
          <span
            key={t}
            className="rounded-[2px] border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted"
          >
            {t}
          </span>
        ))}
      </div>
      {item.links && item.links.length > 0 && (
        <ul className="flex flex-wrap gap-3 pt-2">
          {item.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className={`font-mono text-xs uppercase tracking-wider ${accentText[accent]} hover:underline`}
              >
                {l.label} →
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const inner = (
    <Container variant="wide">
      <div className="flex flex-col gap-1 py-5 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-4">
          <span
            className={`font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-focus-within:rotate-90 max-md:rotate-90 ${accentText[accent]}`}
          >
            ▸
          </span>
          <span className="text-lg font-medium">{item.name}</span>
          {isLink && (
            <span
              className={`ml-auto font-mono text-xs md:hidden ${accentText[accent]}`}
            >
              view →
            </span>
          )}
        </div>
        <span className="pl-8 font-mono text-sm text-muted md:ml-auto md:pl-0">
          {item.meta}
        </span>
        {isLink && (
          <span
            className={`hidden font-mono text-xs opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-within:opacity-100 md:inline ${accentText[accent]}`}
          >
            view →
          </span>
        )}
      </div>

      <div
        className="max-h-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-[var(--row-max)] group-focus-within:max-h-[var(--row-max)] max-md:max-h-[var(--row-max)]"
        style={{ ["--row-max" as string]: maxHeight }}
      >
        {hasMedia ? (
          <div className="space-y-6 pb-8 md:pb-6">
            <MediaList items={item.media!} />
            <div className="space-y-4">
              <p className="text-base leading-relaxed">{item.outcome}</p>
              {tagsAndLinks}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 pb-8 md:grid-cols-2 md:pb-6">
            {item.cover && (
              <div className="relative aspect-video border border-border bg-surface">
                <Image
                  src={item.cover.src}
                  alt={item.cover.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}
            <div className="space-y-4">
              <p className="text-base leading-relaxed">{item.outcome}</p>
              {tagsAndLinks}
            </div>
          </div>
        )}
      </div>
    </Container>
  );

  if (isLink) {
    return (
      <NextLink href={`/projects/${item.slug}/`} className={className}>
        {inner}
      </NextLink>
    );
  }
  return (
    <div tabIndex={0} className={className}>
      {inner}
    </div>
  );
}
