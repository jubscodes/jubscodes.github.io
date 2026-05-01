import Image from "next/image";
import NextLink from "next/link";

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
  const className = `group block border-b border-border outline-none transition-colors ${accentBgHover[accent]}`;

  const inner = (
    <>
      <div className="flex items-center gap-4 px-4 py-5">
        <span
          className={`font-mono transition-transform duration-300 group-hover:rotate-90 group-focus-within:rotate-90 max-md:rotate-90 ${accentText[accent]}`}
        >
          ▸
        </span>
        <span className="text-lg font-medium">{item.name}</span>
        <span className="ml-auto font-mono text-sm text-muted">{item.meta}</span>
        {isLink && (
          <span
            className={`font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100 ${accentText[accent]}`}
          >
            view →
          </span>
        )}
      </div>

      <div className="max-h-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:max-h-[400px] group-focus-within:max-h-[400px] max-md:max-h-[400px]">
        <div className="grid gap-6 px-8 pb-6 md:grid-cols-2">
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
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
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
                      rel={l.external ? "noreferrer" : undefined}
                      className={`font-mono text-xs uppercase tracking-wider ${accentText[accent]} hover:underline`}
                    >
                      {l.label} →
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
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
