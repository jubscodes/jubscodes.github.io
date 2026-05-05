# GSP Case Study + Ipê City Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `get-shit-pretty` from an Experience entry to a full Case Study in Selected Work (with a ported `<AsciiHero/>` from `gsp.jubs.studio`), and create a new Ipê City Experience that hosts the Apr 15 2026 Shippit-presented workshop's recording + Slidev deck inline.

**Architecture:** Schema-light approach. `Experience` gains optional `media?: MediaItem[]`; `CaseStudy` gains optional `customHero?: CustomHero` (string discriminator). Three new presentational components (`<VideoEmbed/>`, `<SlidesEmbed/>`, `<MediaList/>`) plus a verbatim port of `<AsciiHero/>` from the GSP repo. `<CaseStudyHero/>` and `<WorkRow/>` (experience variant) get optional dispatch paths — existing case studies and experiences keep their current rendering untouched. Slidev deck builds to static and lives at `public/slides/design-engineering-apr15/` (manual build pipeline, documented).

**Tech Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · gray-matter · Vitest · Slidev (separate project, manual build into portfolio public/)

**Spec:** [`docs/superpowers/specs/2026-05-05-gsp-case-study-with-media.md`](../specs/2026-05-05-gsp-case-study-with-media.md)

---

## File Structure

### New files

```
components/
├── video-embed.tsx                          YouTube iframe wrapper
├── slides-embed.tsx                         Same-origin iframe + standalone link
├── media-list.tsx                           Dispatcher: video | slides
└── ascii-hero.tsx                           Verbatim port from GSP repo

content/
├── experiences/ipe-city.md                  New experience with media block
└── projects/get-shit-pretty.md              New case study with customHero

lib/
└── youtube.ts                               getYouTubeId(url) helper

public/
├── images/projects/get-shit-pretty/
│   └── cover.png                            Static OG/card thumbnail
└── slides/design-engineering-apr15/         Slidev `dist/` output
    ├── index.html
    ├── assets/...
    └── flow-mark.svg

docs/
└── slides-build.md                          Manual Slidev rebuild procedure
```

### Modified files

- `lib/content.ts` — add `MediaItem`, `CustomHero` types; extend `Experience` and `CaseStudy`
- `lib/content.test.ts` — add tests for `media` parsing, update real-content counts (4→5 case studies, 6→6 experiences)
- `components/case-study-hero.tsx` — add `customHero` prop + dispatch path
- `components/work-row.tsx` — add `media`-aware layout fork (single column, lifted max-h)
- `app/projects/[slug]/page.tsx` — pass `customHero` through to `<CaseStudyHero/>`
- `app/page.tsx` — pass `media` through to Experience `WorkRow` items

### Removed files

- `content/experiences/get-shit-pretty.md` — superseded by the case study at `content/projects/get-shit-pretty.md`

---

## Branch / Worktree Setup

All work on a new branch `feature/gsp-and-ipe-city`, isolated in `.claude/worktrees/gsp-and-ipe-city`. Independent of PR #3 (`feature/gallery-refactor`).

- [ ] **Setup: Create worktree**

Run:
```bash
cd /Users/jubs/Projects/jubscodes.github.io
git fetch origin main
git worktree add .claude/worktrees/gsp-and-ipe-city -b feature/gsp-and-ipe-city origin/main
cd .claude/worktrees/gsp-and-ipe-city
npm install
```

Expected: worktree exists at `.claude/worktrees/gsp-and-ipe-city`, branch checked out, `node_modules/` populated.

All subsequent commands assume CWD is `.claude/worktrees/gsp-and-ipe-city`.

---

## Stage 1: Types and Schema (`lib/content.ts`)

### Task 1: Add `MediaItem` and `CustomHero` types

**Files:**
- Modify: `lib/content.ts:5-6` (after the existing `Link` and `Image` types)

- [ ] **Step 1: Add the two type definitions**

Edit `lib/content.ts`. After line 6 (`export type Image = ...`), insert:

```ts
export type MediaItem =
  | { type: "video"; url: string; title?: string }
  | { type: "slides"; src: string; title?: string; standaloneUrl?: string };

export type CustomHero = "ascii-gsp";
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no new errors).

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat(content): add MediaItem and CustomHero types"
```

---

### Task 2: Extend `Experience` with `media`, `CaseStudy` with `customHero`

**Files:**
- Modify: `lib/content.ts:8-30` (CaseStudy type), `lib/content.ts:32-44` (Experience type)

- [ ] **Step 1: Extend `CaseStudy` type**

In `lib/content.ts`, locate the `CaseStudy` type (lines ~8-30). Add `customHero?: CustomHero;` as the last field (before the closing `}`):

```ts
export type CaseStudy = {
  // ...existing fields unchanged
  links: Link[];
  body: { context: string; whatIDid: string; outcome: string; deepDive?: string };
  customHero?: CustomHero;
};
```

- [ ] **Step 2: Extend `Experience` type**

In `lib/content.ts`, locate the `Experience` type (lines ~32-44). Add `media?: MediaItem[];` as the last field:

```ts
export type Experience = {
  // ...existing fields unchanged
  accent: "primary" | "secondary" | "tertiary";
  media?: MediaItem[];
};
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "feat(content): extend CaseStudy with customHero and Experience with media"
```

---

### Task 3: Add unit tests for the new fields

**Files:**
- Modify: `lib/content.test.ts` (add new test cases at the end of the existing `describe` blocks)

- [ ] **Step 1: Add `media` parsing test for experiences**

At the end of `lib/content.test.ts`, before the final `describe("real content loads", ...)` block (around line 198), insert a new describe block:

```ts
describe("Experience.media parsing", () => {
  it("parses a media array with video and slides items", async () => {
    mkdirSync(join(tmp, "experiences"));
    writeFileSync(
      join(tmp, "experiences", "with-media.md"),
      `---
slug: with-media
name: Talk
type: experience
published: true
meta: "Test · 2026"
outcome: "Did a talk"
tags: [talk]
links: []
accent: tertiary
media:
  - type: video
    url: https://www.youtube.com/watch?v=ABC123XYZ
    title: "Recording"
  - type: slides
    src: /slides/talk/
    title: "Deck"
---
`,
    );
    const [item] = await _testInternals.loadExperiences(join(tmp, "experiences"));
    expect(item.media).toHaveLength(2);
    expect(item.media?.[0]).toEqual({ type: "video", url: "https://www.youtube.com/watch?v=ABC123XYZ", title: "Recording" });
    expect(item.media?.[1]).toEqual({ type: "slides", src: "/slides/talk/", title: "Deck" });
  });

  it("treats missing media as undefined (optional)", async () => {
    mkdirSync(join(tmp, "experiences"));
    writeFileSync(join(tmp, "experiences", "no-media.md"), validExperienceMd({ slug: "no-media" }));
    const [item] = await _testInternals.loadExperiences(join(tmp, "experiences"));
    expect(item.media).toBeUndefined();
  });
});
```

- [ ] **Step 2: Add `customHero` parsing test for case studies**

In the same file, immediately after the previous block:

```ts
describe("CaseStudy.customHero parsing", () => {
  it("parses customHero when present", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(
      join(tmp, "projects", "custom.md"),
      validCaseStudyMd({ slug: "custom" }).replace(
        "links: []\n---",
        "links: []\ncustomHero: ascii-gsp\n---",
      ),
    );
    const [item] = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(item.customHero).toBe("ascii-gsp");
  });

  it("treats missing customHero as undefined (optional)", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(join(tmp, "projects", "default.md"), validCaseStudyMd({ slug: "default" }));
    const [item] = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(item.customHero).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run the new tests**

Run: `npm test -- --run lib/content.test.ts`
Expected: PASS for all new tests; the existing real-content count tests will still pass at this point (we haven't added/removed content yet).

- [ ] **Step 4: Commit**

```bash
git add lib/content.test.ts
git commit -m "test(content): cover media + customHero parsing"
```

---

## Stage 2: Embed components

### Task 4: YouTube ID helper

**Files:**
- Create: `lib/youtube.ts`
- Create: `lib/youtube.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/youtube.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getYouTubeId } from "@/lib/youtube";

describe("getYouTubeId", () => {
  it("extracts id from watch URL", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=C37nglGnTts")).toBe("C37nglGnTts");
  });
  it("extracts id from youtu.be short URL", () => {
    expect(getYouTubeId("https://youtu.be/C37nglGnTts")).toBe("C37nglGnTts");
  });
  it("ignores extra query params", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=C37nglGnTts&t=42")).toBe("C37nglGnTts");
  });
  it("throws on a non-YouTube URL", () => {
    expect(() => getYouTubeId("https://example.com/foo")).toThrow(/Invalid YouTube URL/);
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- --run lib/youtube.test.ts`
Expected: FAIL — module `@/lib/youtube` not found.

- [ ] **Step 3: Implement the helper**

Create `lib/youtube.ts`:

```ts
const YOUTUBE_ID_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function getYouTubeId(url: string): string {
  const m = url.match(YOUTUBE_ID_RE);
  if (!m) throw new Error(`Invalid YouTube URL: ${url}`);
  return m[1];
}
```

- [ ] **Step 4: Run test (expect PASS)**

Run: `npm test -- --run lib/youtube.test.ts`
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/youtube.ts lib/youtube.test.ts
git commit -m "feat(lib): add getYouTubeId helper"
```

---

### Task 5: `<VideoEmbed/>` component

**Files:**
- Create: `components/video-embed.tsx`

- [ ] **Step 1: Write the component**

Create `components/video-embed.tsx`:

```tsx
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/video-embed.tsx
git commit -m "feat(components): add VideoEmbed for YouTube iframes"
```

---

### Task 6: `<SlidesEmbed/>` component

**Files:**
- Create: `components/slides-embed.tsx`

- [ ] **Step 1: Write the component**

Create `components/slides-embed.tsx`:

```tsx
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
          rel="noreferrer"
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/slides-embed.tsx
git commit -m "feat(components): add SlidesEmbed for same-origin iframes"
```

---

### Task 7: `<MediaList/>` dispatcher

**Files:**
- Create: `components/media-list.tsx`

- [ ] **Step 1: Write the component**

Create `components/media-list.tsx`:

```tsx
import type { MediaItem } from "@/lib/content";
import { VideoEmbed } from "./video-embed";
import { SlidesEmbed } from "./slides-embed";

export function MediaList({ items }: { items: MediaItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => {
        if (item.type === "video") {
          return <VideoEmbed key={i} url={item.url} title={item.title} />;
        }
        if (item.type === "slides") {
          return (
            <SlidesEmbed
              key={i}
              src={item.src}
              title={item.title}
              standaloneUrl={item.standaloneUrl}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/media-list.tsx
git commit -m "feat(components): add MediaList dispatcher"
```

---

## Stage 3: AsciiHero port + CaseStudyHero extension

### Task 8: Port `<AsciiHero/>` from GSP repo

**Files:**
- Create: `components/ascii-hero.tsx` (verbatim copy from `~/Projects/get-shit-pretty/src/components/ascii-hero.tsx`)

- [ ] **Step 1: Copy the component**

Run:
```bash
cp ~/Projects/get-shit-pretty/src/components/ascii-hero.tsx components/ascii-hero.tsx
```

Expected: file copied. The source has `"use client"` at the top — required for the `useEffect`/`useRef` hooks to work.

- [ ] **Step 2: Verify no design-system imports leaked**

Run: `grep -nE "from \"@?\.\.|@/|@\\\\" components/ascii-hero.tsx`
Expected: only `from "react"` imports (no `@/` paths). If anything else appears, fail loudly — the port assumed zero coupling.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/ascii-hero.tsx
git commit -m "feat(components): port AsciiHero from GSP repo"
```

---

### Task 9: Extend `<CaseStudyHero/>` with `customHero` dispatch

**Files:**
- Modify: `components/case-study-hero.tsx` (current file is 47 lines)

- [ ] **Step 1: Update the component**

Replace the entire contents of `components/case-study-hero.tsx` with:

```tsx
import Image from "next/image";
import { Container } from "./container";
import { AsciiHero } from "./ascii-hero";
import type { CustomHero } from "@/lib/content";

type Accent = "primary" | "secondary" | "tertiary";

const accentBg: Record<Accent, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export function CaseStudyHero(props: {
  cover: string;
  name: string;
  role: string;
  period: string;
  company: string;
  location?: string;
  accent: Accent;
  customHero?: CustomHero;
}) {
  return (
    <header className="relative h-[60vh] min-h-[480px] w-full overflow-hidden bg-surface">
      {props.customHero === "ascii-gsp" ? (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <AsciiHero />
        </div>
      ) : (
        <Image
          src={props.cover}
          alt={`${props.name} cover`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg from-15% via-bg/55 to-bg/10"
      />
      <Container variant="narrow" className="absolute inset-x-0 bottom-0 py-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          {props.name}
        </h1>
        <div className={`mt-4 h-0.5 w-16 ${accentBg[props.accent]}`} />
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
          {props.role} · {props.company} · {props.period}
          {props.location && ` · ${props.location}`}
        </p>
      </Container>
    </header>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/case-study-hero.tsx
git commit -m "feat(case-study-hero): dispatch to AsciiHero when customHero=ascii-gsp"
```

---

## Stage 4: WorkRow extension + page wiring

### Task 10: Extend `<WorkRow/>` with media-aware layout fork

**Files:**
- Modify: `components/work-row.tsx` (current file is 130 lines)

- [ ] **Step 1: Replace the file**

Replace the entire contents of `components/work-row.tsx` with:

```tsx
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
                rel={l.external ? "noreferrer" : undefined}
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/work-row.tsx
git commit -m "feat(work-row): media-aware single-column layout fork"
```

---

### Task 11: Wire pass-throughs in `app/page.tsx` and `app/projects/[slug]/page.tsx`

**Files:**
- Modify: `app/page.tsx:60-73` (Experience mapping)
- Modify: `app/projects/[slug]/page.tsx` (CaseStudyHero invocation)

- [ ] **Step 1: Pass `media` to Experience WorkRow items**

In `app/page.tsx`, find the Experiences section (look for `experiences.map((e)`). Replace the item prop body so it includes `media: e.media`:

```tsx
<WorkRow
  key={e.slug}
  item={{
    slug: e.slug,
    name: e.name,
    meta: e.meta,
    cover: e.images?.[0],
    outcome: e.outcome,
    tags: e.tags,
    links: e.links,
    media: e.media,
  }}
  variant="experience"
  accent="tertiary"
/>
```

- [ ] **Step 2: Pass `customHero` to `<CaseStudyHero/>`**

Open `app/projects/[slug]/page.tsx`. Find the `<CaseStudyHero ... />` invocation. Add `customHero={caseStudy.customHero}` to the props.

If you can't find the exact invocation, search:
```bash
grep -n "CaseStudyHero" app/projects/[slug]/page.tsx
```

Then add the prop. Example expected diff:

```tsx
<CaseStudyHero
  cover={caseStudy.cover}
  name={caseStudy.name}
  role={caseStudy.role}
  period={caseStudy.period}
  company={caseStudy.company}
  location={caseStudy.location}
  accent={caseStudy.accent}
  customHero={caseStudy.customHero}
/>
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/projects/[slug]/page.tsx
git commit -m "feat(pages): wire media + customHero pass-throughs"
```

---

## Stage 5: Slidev build pipeline

### Task 12: Build the Slidev deck and copy into `public/`

**Files:**
- Create: `public/slides/design-engineering-apr15/` (Slidev `dist/` output)

- [ ] **Step 1: Build the deck**

Run:
```bash
cd ~/Projects/talks/design-engineering-apr15
npx slidev build slides.md --base /slides/design-engineering-apr15/
```

Expected: build succeeds, outputs to `~/Projects/talks/design-engineering-apr15/dist/`. The `--base` flag namespaces all asset paths under `/slides/design-engineering-apr15/`.

- [ ] **Step 2: Copy `dist/` into the portfolio's `public/`**

Run (from any CWD):
```bash
mkdir -p /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city/public/slides/design-engineering-apr15
rm -rf /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city/public/slides/design-engineering-apr15/*
cp -r ~/Projects/talks/design-engineering-apr15/dist/* /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city/public/slides/design-engineering-apr15/
```

Expected: `public/slides/design-engineering-apr15/index.html` exists; assets are inside.

- [ ] **Step 3: Verify the deck loads via Next dev**

```bash
cd /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/slides/design-engineering-apr15/
```

Expected: `200`. Then open `http://localhost:3000/slides/design-engineering-apr15/` in a browser and confirm slide 1 renders with custom typography and the orange `/gsp` accent. Stop the dev server (Ctrl+C in its terminal, or `kill %1`).

- [ ] **Step 4: Commit**

```bash
cd /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city
git add public/slides/design-engineering-apr15/
git commit -m "build(slides): bundle design-engineering-apr15 Slidev deck into public/"
```

---

### Task 13: Document the slides build procedure

**Files:**
- Create: `docs/slides-build.md`

- [ ] **Step 1: Write the doc**

Create `docs/slides-build.md`:

```markdown
# Embedding Slidev Decks

## Why this is manual

The portfolio statically exports to GitHub Pages. Slidev decks live in separate repos
(under `~/Projects/talks/<slug>/`) and need to be built and copied into the portfolio's
`public/slides/<slug>/` for embedding via iframe. v1 keeps this manual; automation is v1.1.

## Steps to (re)build a deck

1. Build the deck with the namespaced base path:

   ```bash
   cd ~/Projects/talks/<slug>
   npx slidev build slides.md --base /slides/<slug>/
   ```

   The `--base` flag is **load-bearing** — without it, Slidev assumes assets at root
   `/`, and they 404 when iframed under `/slides/<slug>/`.

2. Copy the build into the portfolio:

   ```bash
   mkdir -p public/slides/<slug>
   rm -rf public/slides/<slug>/*
   cp -r ~/Projects/talks/<slug>/dist/* public/slides/<slug>/
   ```

3. Test in dev:

   ```bash
   npm run dev
   # then open http://localhost:3000/slides/<slug>/
   ```

4. Commit the `public/slides/<slug>/` tree.

## Where decks live

By convention (see `~/Mugen/CLAUDE.md`):
- Standalone decks: `~/Projects/talks/<slug>/`
- Project-tied decks: `~/Projects/<project>/talks/<slug>/`

## Repo size note

A Slidev export is ~2-3MB. Acceptable for a handful of decks. At 3+ decks, consider
deploying decks separately (Vercel/GH Pages) and iframing the external URL instead.
```

- [ ] **Step 2: Commit**

```bash
git add docs/slides-build.md
git commit -m "docs: add slides-build procedure"
```

---

## Stage 6: Cover image capture

### Task 14: Capture the GSP ASCII hero PNG from `gsp.jubs.studio`

**Files:**
- Create: `public/images/projects/get-shit-pretty/cover.png`

The cover is used for the homepage card thumbnail and OG image. The case-study page itself shows the live `<AsciiHero/>`, so the still is a fallback only — but it's required because `cover` is a non-optional field on `CaseStudy`.

- [ ] **Step 1: Capture the screenshot**

Two options:

**Option A — `agent-browser` skill (preferred if available):**

Use the agent-browser skill to navigate to `https://gsp.jubs.studio` at a 1440×900 viewport (so the wide single-line ASCII variant renders, not the stacked one) and screenshot the hero element. Save the result to:

```
public/images/projects/get-shit-pretty/cover.png
```

**Option B — manual:**

1. Open `https://gsp.jubs.studio` in a browser at desktop width (≥1280px).
2. Wait for the shimmer animation to settle (~1 second).
3. Take a screenshot cropped to the hero block (the ASCII wordmark).
4. Save as `public/images/projects/get-shit-pretty/cover.png`. Recommended dimensions: ~1600×900 (16:9 keeps it usable as OG image).

- [ ] **Step 2: Verify the file**

Run:
```bash
ls -lh public/images/projects/get-shit-pretty/cover.png
file public/images/projects/get-shit-pretty/cover.png
```

Expected: PNG file, reasonable size (50-500KB for a screenshot at 1600×900).

- [ ] **Step 3: Commit**

```bash
mkdir -p public/images/projects/get-shit-pretty
git add public/images/projects/get-shit-pretty/cover.png
git commit -m "content(gsp): add ASCII hero cover image from gsp.jubs.studio"
```

---

## Stage 7: Content migration

### Task 15: Create `content/experiences/ipe-city.md`

**Files:**
- Create: `content/experiences/ipe-city.md`

- [ ] **Step 1: Write the file**

Create `content/experiences/ipe-city.md`:

```markdown
---
slug: ipe-city
name: Ipê City
type: experience
published: true
order: 1
meta: "Workshop Presenter · Florianópolis · Apr 2026"
outcome: "Presented a Shippit-branded design-engineering workshop at Ipê City, using GSP as the teaching vehicle to walk builders through the principles and skills of design engineering."
tags: [workshop, design-engineering, shippit, gsp, ipê-city]
accent: tertiary
links:
  - { label: "Ipê City", href: "https://ipe.city", external: true }
  - { label: "GSP", href: "https://gsp.jubs.studio", external: true }
media:
  - type: video
    url: https://www.youtube.com/watch?v=C37nglGnTts
    title: "Layer 2 — AI Skills for Design Engineering — Shippit workshop at Ipê City (Apr 15 2026)"
  - type: slides
    src: /slides/design-engineering-apr15/
    title: "Workshop deck (Shippit, presented at Ipê City)"
---
```

Body is intentionally empty — Experiences are frontmatter-only per `loadExperiences` in `lib/content.ts:138`.

- [ ] **Step 2: Verify it loads**

Run:
```bash
npm test -- --run lib/content.test.ts -t "real content loads"
```

Expected: the experiences count test will now FAIL (expected 6, got 7 — we added Ipê City but haven't yet removed the GSP experience). That's fine — the next tasks resolve it. For now, verify the failure is a count mismatch and not a parse error.

- [ ] **Step 3: Commit**

```bash
git add content/experiences/ipe-city.md
git commit -m "content(experiences): add ipe-city with workshop media"
```

---

### Task 16: Create `content/projects/get-shit-pretty.md`

**Files:**
- Create: `content/projects/get-shit-pretty.md`

- [ ] **Step 1: Write the file with placeholder body**

Create `content/projects/get-shit-pretty.md`:

```markdown
---
slug: get-shit-pretty
name: Get Shit Pretty
type: case-study
published: true
order: 0
role: Creator
company: Jubs Studio
period: "2025 – present"
start_date: "2025-09"
end_date: null
accent: secondary
hero_variant: cover
image_layout: strip
cover: /images/projects/get-shit-pretty/cover.png
images: []
customHero: ascii-gsp
outcome: "Open-source design-engineering toolkit for AI coding agents — color, typography, visuals, and pipeline skills shipped as an installable npm package."
tags: [npm-package, design-engineering, ai-tooling, personal-project]
links:
  - { label: "GitHub", href: "https://github.com/jubscodes/get-shit-pretty", external: true }
  - { label: "npm", href: "https://www.npmjs.com/package/get-shit-pretty", external: true }
  - { label: "gsp.jubs.studio", href: "https://gsp.jubs.studio", external: true }
---
## Context

TODO(jubs): One paragraph framing the problem GSP solves — what was missing in AI-assisted design work, and why a packaged design-engineering toolkit is the right shape for the answer.

## What I did

TODO(jubs): The key design + engineering moves. The dual-diamond pipeline (Branding + Project), the expertise-vs-pipeline skill split, the multi-runtime installer (Claude Code, OpenCode, Gemini, Codex), the zero-dependency npm package constraint.

## Outcome

TODO(jubs): Live at gsp.jubs.studio. Published on npm. Used in the Apr 15 2026 design-engineering workshop at Ipê City under the Shippit brand. (Numbers, downloads, public reception go here when available.)

## Deep Dive

TODO(jubs): Optional — architecture diagrams, the "expertise skills as knowledge owners + pipeline skills as orchestrators" pattern, or a walkthrough of one phase of the pipeline.
```

Note: `hero_variant: cover` is kept (it's already a valid enum value); the live `<AsciiHero/>` rendering is driven by `customHero: ascii-gsp` independently. The `cover` image still serves as the homepage card thumbnail and OG image.

- [ ] **Step 2: Verify it parses**

Run:
```bash
npm test -- --run lib/content.test.ts -t "real content loads"
```

Expected: case-studies count test FAILS (expected 4, got 5). Same as before — the count update comes in Task 18.

- [ ] **Step 3: Commit**

```bash
git add content/projects/get-shit-pretty.md
git commit -m "content(projects): add get-shit-pretty case study (placeholder body)"
```

---

### Task 17: Delete `content/experiences/get-shit-pretty.md`

**Files:**
- Remove: `content/experiences/get-shit-pretty.md`

- [ ] **Step 1: Delete the file**

Run:
```bash
git rm content/experiences/get-shit-pretty.md
```

- [ ] **Step 2: Commit**

```bash
git commit -m "content(experiences): remove get-shit-pretty (promoted to case study)"
```

---

### Task 18: Update real-content count assertions

**Files:**
- Modify: `lib/content.test.ts:198-211`

- [ ] **Step 1: Update the counts**

In `lib/content.test.ts`, find the `describe("real content loads", ...)` block. Replace its contents with:

```ts
describe("real content loads", () => {
  it("getCaseStudies parses 5 case studies", async () => {
    const { getCaseStudies } = await import("@/lib/content");
    const cs = await getCaseStudies();
    expect(cs.length).toBe(5);
    expect(cs.map((c) => c.slug).sort()).toEqual([
      "chainless",
      "get-shit-pretty",
      "heimdall",
      "luxy",
      "shippit",
    ]);
  });

  it("getExperiences parses 6 experiences", async () => {
    const { getExperiences } = await import("@/lib/content");
    const ex = await getExperiences();
    expect(ex.length).toBe(6);
    expect(ex.map((e) => e.slug)).toContain("ipe-city");
    expect(ex.map((e) => e.slug)).not.toContain("get-shit-pretty");
  });

  it("get-shit-pretty case study uses customHero", async () => {
    const { getCaseStudy } = await import("@/lib/content");
    const gsp = await getCaseStudy("get-shit-pretty");
    expect(gsp).not.toBeNull();
    expect(gsp?.customHero).toBe("ascii-gsp");
  });

  it("ipe-city experience has video + slides media", async () => {
    const { getExperiences } = await import("@/lib/content");
    const ipe = (await getExperiences()).find((e) => e.slug === "ipe-city");
    expect(ipe).toBeDefined();
    expect(ipe?.media).toHaveLength(2);
    expect(ipe?.media?.[0].type).toBe("video");
    expect(ipe?.media?.[1].type).toBe("slides");
  });
});
```

The experience count stays at 6 because we added Ipê City and removed get-shit-pretty (net zero).

- [ ] **Step 2: Run all tests**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/content.test.ts
git commit -m "test(content): update real-content counts and assert new fields"
```

---

## Stage 8: Visual verification

### Task 19: Visual smoke test on the dev server

This stage has no commits — it's a manual verification pass before opening the PR.

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city
npm run dev
```

Open `http://localhost:3000/`.

- [ ] **Step 2: Verify Selected Work**

Confirm:
- A 5th case-study row appears: **Get Shit Pretty**.
- Hovering it expands the row showing the GSP cover PNG, outcome, tags, GitHub/npm/gsp.jubs.studio links.
- Clicking it navigates to `/projects/get-shit-pretty/`.

- [ ] **Step 3: Verify the GSP case-study page**

On `/projects/get-shit-pretty/`:
- The hero region renders the **live ASCII art** (`<AsciiHero/>`) instead of a cover image. Watch for the shimmer animation (~400ms tick).
- Title, accent line, role/company/period strip render below.
- Body shows the placeholder `## Context` / `## What I did` / `## Outcome` / `## Deep Dive` sections (with TODOs).

- [ ] **Step 4: Verify Experiences**

Back on `/`, scroll to the Experiences section. Confirm:
- **Ipê City** experience row exists.
- **Get Shit Pretty** experience row no longer exists.
- Hovering the Ipê City row expands to show:
  - Video (YouTube `C37nglGnTts`) embedded at top
  - Slides iframe to `/slides/design-engineering-apr15/` below
  - Outcome text + tags + links beneath the media block
  - Layout is single-column (full width), not the 2-column image+text pattern other experiences use.

- [ ] **Step 5: Verify other experiences still use the 2-column layout**

Hover one of the other experience rows (e.g., `cursor-coffee`, `1st-aurora`). Confirm:
- Layout is still 2 columns: image left, outcome+tags+links right.
- Max height is still constrained (~480px).

- [ ] **Step 6: Verify the standalone slides URL**

Open `http://localhost:3000/slides/design-engineering-apr15/` directly. Confirm:
- Slidev deck loads with custom typography and the `/gsp` orange accent on slide 1.
- Arrow keys advance slides; presenter view at `/slides/design-engineering-apr15/presenter/` works.

- [ ] **Step 7: Stop the dev server**

Ctrl+C in the dev server terminal.

---

## Stage 9: Open PR

### Task 20: Push branch and open PR

- [ ] **Step 1: Push the branch**

```bash
cd /Users/jubs/Projects/jubscodes.github.io/.claude/worktrees/gsp-and-ipe-city
git push -u origin feature/gsp-and-ipe-city
```

- [ ] **Step 2: Open the PR**

Run:
```bash
gh pr create --title "GSP case study + Ipê City experience with workshop media" --body "$(cat <<'EOF'
## Summary

- Promotes **Get Shit Pretty** from an Experience to a full Case Study in Selected Work, with the live `<AsciiHero/>` from `gsp.jubs.studio` as the case-study page hero.
- Adds a new **Ipê City** Experience covering the Apr 15 2026 Shippit-presented design-engineering workshop, with the YouTube recording and Slidev deck embedded inline.
- Establishes a small `media: MediaItem[]` primitive on `Experience` and a `customHero: CustomHero` discriminator on `CaseStudy` — minimal schema, two concrete renderers.

## Spec & Plan

- Spec: `docs/superpowers/specs/2026-05-05-gsp-case-study-with-media.md`
- Plan: `docs/superpowers/plans/2026-05-05-gsp-and-ipe-city.md`

## Test plan

- [ ] `npm test` passes (lib/content + lib/youtube unit tests)
- [ ] `/` shows Get Shit Pretty in Selected Work and Ipê City in Experiences
- [ ] `/projects/get-shit-pretty/` renders the live AsciiHero
- [ ] Ipê City experience row expands to show video + slides + outcome
- [ ] Other experiences still render in the 2-column image+text layout
- [ ] `/slides/design-engineering-apr15/` loads the Slidev deck standalone
EOF
)"
```

Expected: PR URL printed.

---

## Self-Review Notes

This plan was self-reviewed against the spec on 2026-05-05:

- **Spec coverage:** All 11 sections of the spec map to one or more tasks.
- **Type consistency:** `CustomHero`, `MediaItem`, `customHero`, `media` are spelled identically across Tasks 1, 2, 3, 5-7, 9-11, 15, 16, 18.
- **No placeholders:** Body content for `get-shit-pretty.md` (Task 16) is the only intentional `TODO(jubs)` in the codebase — Julia writes the case-study body in a follow-up commit on the same branch before merge. All test code, component code, and config edits are spelled out in full.
- **`hero_variant` enum collision:** Resolved by keeping `hero_variant: "cover"` valid for GSP and dispatching purely off `customHero` — no enum change needed (Task 16 frontmatter, Task 9 component).
