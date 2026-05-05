# GSP Case Study + Ipê City Experience with Workshop Media — Design Spec

**Date:** 2026-05-05
**Owner:** Julia Hoffmann Buratto (jubscodes)
**Project:** jubs.studio (`jubscodes/jubscodes.github.io`)
**Status:** Draft — pending review

---

## Summary

Two coordinated content additions to the portfolio:

1. **GSP becomes a Case Study in Selected Work.** Promote `get-shit-pretty` from an Experience entry to a full case-study page at `/projects/get-shit-pretty/`. Visual treatment uses a ported `<AsciiHero/>` component from `gsp.jubs.studio` in place of a standard cover image. The page is a case study about *the product* — no embedded recording or deck.

2. **Ipê City becomes an Experience covering the Apr 15 2026 workshop.** Create a new `content/experiences/ipe-city.md` entry. The entry covers Julia's **2026 return to Ipê City to present a design-engineering workshop**: a Shippit-presented session in which Julia, as workshop presenter, used GSP as the teaching vehicle to convey design-engineering principles and skills. The workshop produced a YouTube recording (`C37nglGnTts`) and a Slidev deck (`~/Projects/talks/design-engineering-apr15/`, built to static and hosted under the portfolio at `/slides/design-engineering-apr15/`). The Experience model gains optional `media` support; the homepage `WorkRow` gains a layout fork that renders embedded media full-width above the outcome/tags when present.

The two artifacts are related but separated by intent: **GSP = the tool** (case study about the product), **Ipê City = the moment** (the Apr 15 2026 Shippit-presented workshop Julia delivered, with the recording + deck as the public artifacts).

**Out of scope for this spec but flagged:** Julia was also an **Ipê Architect (Resident Builder) at Ipê City in Apr–May 2025** — a separate, prior engagement, currently captured in `~/Mugen/career/experiences/ipe-city.md` but not yet in the portfolio. This spec does **not** bundle the 2025 residency into the same entry. If/when the 2025 residency is promoted to the portfolio, it should be its own Experience entry distinct from this workshop one.

---

## 1. Goal & Scope

### Goals

- **Selected Work** gains a 4th case study (GSP) with a custom hero that signals design-engineering craft.
- **Experiences** gains a new entry (Ipê City) and the ability to host rich media (recording + deck) inline.
- A small, reusable `media` primitive that a future Experience or Case Study can adopt without re-architecting.

### In scope

**Schema + components:**

- Extend `Experience` type in `lib/content.ts` with optional `media?: MediaItem[]`.
- Extend `CaseStudy` type with optional `customHero?: CustomHero` (string discriminator, no `media` field on case studies in v1).
- Two embed components: `<VideoEmbed/>` (YouTube), `<SlidesEmbed/>` (same-origin iframe to a Slidev build).
- Port `<AsciiHero/>` from `~/Projects/get-shit-pretty/src/components/ascii-hero.tsx` into `components/ascii-hero.tsx` (verbatim, no design-system coupling at the source).
- Extend `<CaseStudyHero/>` to render `<AsciiHero/>` when `customHero === "ascii-gsp"`.
- Extend `<WorkRow/>` (variant `"experience"`) with a media-aware layout fork: when `item.media?.length`, render a full-width media block above the outcome/tags row (single-column expanded panel); otherwise keep the existing 2-column image + text layout.

**Slidev pipeline (manual, documented):**

- Build the Slidev deck at `~/Projects/talks/design-engineering-apr15/` with `--base /slides/design-engineering-apr15/`, copy `dist/` into `public/slides/design-engineering-apr15/`. Procedure documented in `docs/slides-build.md`.

**Content:**

- Create `content/projects/get-shit-pretty.md` (full case study, `published: true`, `customHero: ascii-gsp`, no `media` block).
- Add a static cover PNG at `public/images/projects/get-shit-pretty/cover.png` (homepage card thumbnail and OG image — captured from `gsp.jubs.studio`).
- Create `content/experiences/ipe-city.md` (`published: true`, `media` array with the recording + deck).
- Delete `content/experiences/get-shit-pretty.md` (superseded by the case study).

### Out of scope (v1)

- Generic `embed` media type for arbitrary iframes (Figma, CodeSandbox, Loom). Add when a real third use case appears.
- Slidev rebuild automation (CI step, npm `predev` script). v1 documents the manual flow.
- Lightbox or modal for embedded media. PR #3's gallery modal is image-only by design.
- Per-experience deep pages — Ipê City lives entirely in its expanded `WorkRow` panel.
- Mobile-specific Slidev fallback (e.g., "open in new tab" CTA on small viewports). Slidev's responsive defaults are acceptable for v1.
- Promoting other Experiences (`tools-for-the-commons`, `cursor-coffee`, etc.) to case studies.
- Adding `media` support to `CaseStudy` in this PR — defer until a case study actually needs it.

### Deferred to v1.1+

- **Slidev rebuild automation** — npm script or GH Actions step that builds + copies the deck.
- **Generic `<Embed/>` component** for Figma, CodeSandbox, Loom, etc.
- **Per-talk dedicated route** (`/talks/<slug>/`) if Julia gives more talks worth their own pages independent of an experience.
- **`media` on CaseStudy** if a case study eventually needs to embed recordings or demos.

---

## 2. Information Architecture

| Section | Item | URL | New / changed |
|---|---|---|---|
| Selected Work | Get Shit Pretty | `/projects/get-shit-pretty/` | **NEW** (4th case study) |
| Experiences | Ipê City | inline expanded panel on home | **NEW** experience |
| Experiences | Get Shit Pretty | — | **REMOVED** (promoted to case study) |

`getCaseStudies()` (in `lib/content.ts:173`) already iterates all `content/projects/*.md` files — adding the GSP MD makes it appear in Selected Work automatically. Same for `getExperiences()` and the new Ipê City MD.

---

## 3. Data Model

In `lib/content.ts`, extend the existing types:

```ts
export type MediaItem =
  | { type: "video"; url: string; title?: string }
  | { type: "slides"; src: string; title?: string; standaloneUrl?: string };

export type CustomHero = "ascii-gsp"; // discriminator — add literals as new heroes are ported

export type Experience = {
  // …existing fields
  media?: MediaItem[];
};

export interface CaseStudy {
  // …existing fields
  customHero?: CustomHero;
}
```

`customHero` is a string discriminator (not a component reference) so frontmatter stays plain YAML data. The renderer dispatches by value.

**Field semantics (MediaItem):**

- `video.url` — full YouTube watch URL (e.g., `https://www.youtube.com/watch?v=C37nglGnTts`). Component derives the embed URL.
- `slides.src` — same-origin iframe path, e.g., `/slides/design-engineering-apr15/`. Trailing slash required (Slidev's `index.html` resolves to it).
- `slides.standaloneUrl` — optional; defaults to `slides.src`. Used by the "Open in new tab ↗" affordance.
- `title` — used as `<iframe title>` for accessibility, and as the visible caption above the embed.

### Frontmatter — `content/projects/get-shit-pretty.md`

```yaml
---
slug: get-shit-pretty
name: Get Shit Pretty
role: Creator
company: Jubs Studio
period: 2025 – present
start_date: 2025-09-01
accent: secondary
hero_variant: custom
image_layout: stack
cover: /images/projects/get-shit-pretty/cover.png
customHero: ascii-gsp
outcome: …short outcome line for Selected Work row…
tags: [npm-package, design-engineering, ai-tooling, personal-project]
links:
  - { label: GitHub, url: https://github.com/jubscodes/get-shit-pretty }
  - { label: npm, url: https://www.npmjs.com/package/get-shit-pretty }
published: true
---
```

(Note `hero_variant: custom` is a placeholder field name — confirm against existing `hero_variant` enum in `lib/content.ts` during implementation. If `hero_variant` doesn't accept a `custom` value, `customHero` field alone drives the dispatch; `hero_variant` keeps an existing valid value.)

### Frontmatter — `content/experiences/ipe-city.md`

```yaml
---
slug: ipe-city
name: Ipê City
type: experience
accent: tertiary
meta: Workshop Presenter · Florianópolis · Apr 2026
outcome: …one-line outcome — Shippit-presented design-engineering workshop, Julia presenting, using GSP to teach principles + skills…
tags: [workshop, design-engineering, shippit, gsp, ipê-city]
links:
  - { label: Ipê City, url: https://ipe.city }
media:
  - type: video
    url: https://www.youtube.com/watch?v=C37nglGnTts
    title: "Layer 2 — AI Skills for Design Engineering — Shippit workshop at Ipê City (Apr 15 2026)"
  - type: slides
    src: /slides/design-engineering-apr15/
    title: "Workshop deck (Shippit, presented at Ipê City)"
published: true
---
```

The entry is scoped narrowly to the Apr 15 2026 workshop. The 2025 residency (Resident Builder / Ramp Center / tokenization) is intentionally **not** included here and remains in `~/Mugen/career/experiences/ipe-city.md` for now.

`gray-matter` parses arrays-of-objects out of YAML natively. The required-fields check at `lib/content.ts:61` (`REQUIRED_EXPERIENCE_FIELDS`) does not need `media` added (it's optional).

---

## 4. Components

### `<VideoEmbed url title>` (new)

- Parses YouTube ID from the watch URL (regex against `v=…` and `youtu.be/…`).
- Renders an `aspect-video` container with an `<iframe>` to `https://www.youtube-nocookie.com/embed/<id>`.
- Attributes: `loading="lazy"`, `allowfullscreen`, `referrerpolicy="strict-origin-when-cross-origin"`, `title={title}`.
- Border + bg matches `image-strip.tsx` (`border border-border bg-surface`).

### `<SlidesEmbed src title standaloneUrl>` (new)

- `aspect-video` container, `<iframe>` with `src={src}`, `title={title}`, `loading="lazy"`, `allowfullscreen`.
- Caption row above: `{title}` on the left, "Open in new tab ↗" link to `standaloneUrl ?? src` on the right.
- Same border/bg treatment as `<VideoEmbed/>`.

### `<MediaList items>` (new — small)

- Iterates `items`, dispatches to the right component by `type`.
- Vertical stack with `gap-6` (matches Tailwind defaults used elsewhere in the project).

### `<WorkRow/>` extension (variant `"experience"`)

- Add an optional `media?: MediaItem[]` field on `WorkRowItem`.
- When `media?.length`, change the expanded-panel layout:
  - **Single column**, full width.
  - Render `<MediaList items={media}/>` first.
  - Outcome / tags / links row below.
  - Remove the `aspect-video` cover image slot (the media block replaces it).
  - Lift the `max-h-[480px]` constraint on the expand container (or raise to `max-h-[1200px]`) so two stacked 16:9 embeds fit.
- When `media` is empty/undefined, keep the existing 2-column image + text layout untouched.
- Pass-through from `app/page.tsx`: include `media: e.media` in the `item` prop for Experiences.

### `<AsciiHero/>` (ported from GSP)

- Source: `~/Projects/get-shit-pretty/src/components/ascii-hero.tsx`. Copy verbatim into `components/ascii-hero.tsx` as a new client component (`"use client"` already present at source).
- Behavior preserved: full + stacked breakpoints, shimmer at 8% density on a 400ms tick, `aria-label="Get Shit Pretty"`, `aria-hidden` on the `<pre>`.
- No imports outside React — no design-system coupling, drops in cleanly.

### `<CaseStudyHero/>` extension

- Add an optional `customHero?: CustomHero` prop.
- When `customHero === "ascii-gsp"`: render `<AsciiHero/>` inside the same 60vh container in place of `<Image>`. The bottom title block (name / accent / role-company-period) still renders.
- The `cover` image stays required on the schema (used for homepage card thumbnail and OG image).
- Single `switch` on `customHero` keeps dispatch in one place.

### Wiring

- **`app/projects/[slug]/page.tsx`** — pass `customHero` through to `<CaseStudyHero/>`. No `<MediaList/>` rendering on case-study pages in v1.
- **`app/page.tsx`** — Experiences mapping at `app/page.tsx:60-73` adds `media: e.media` to the `WorkRow` item prop.

---

## 5. Slidev Build Pipeline (v1: manual, documented)

The deck lives at `~/Projects/talks/design-engineering-apr15/`. To embed it in the portfolio:

```bash
cd ~/Projects/talks/design-engineering-apr15
npx slidev build slides.md --base /slides/design-engineering-apr15/
# outputs to ./dist/
```

Then copy into the portfolio:

```bash
mkdir -p ~/Projects/jubscodes.github.io/public/slides/design-engineering-apr15
rm -rf ~/Projects/jubscodes.github.io/public/slides/design-engineering-apr15/*
cp -r dist/* ~/Projects/jubscodes.github.io/public/slides/design-engineering-apr15/
```

The `--base` flag makes Slidev emit asset references rooted at `/slides/design-engineering-apr15/` instead of `/`, so `/flow-mark.svg` and JS/CSS chunks resolve under the namespaced subpath.

This procedure is documented in `docs/slides-build.md` (new file). Automation is v1.1.

**Build size guard:** Slidev export is ~2-3MB. Committed to the repo via `public/slides/`. Acceptable for one deck; revisit at 3+ decks.

---

## 6. Content Migration

1. Author `content/projects/get-shit-pretty.md` — full case-study body. Mirror Shippit's structure (Context → What I did → Outcome → Deep Dive). Body content is Julia's to write; the spec only commits to the structural fields (no `media` block, `customHero: ascii-gsp`).
2. Add cover image at `public/images/projects/get-shit-pretty/cover.png`. **Source:** static screenshot of the ASCII hero from `https://gsp.jubs.studio` at desktop viewport (≥1024px so the full single-line wordmark renders, not the stacked variant). Captured manually or via the `agent-browser` skill. Used for homepage card thumbnail + OG meta only — the case-study page itself shows the live `<AsciiHero/>`.
3. Create `content/experiences/ipe-city.md` — fields per §3, including the `media` block. Body copy: short paragraph framing the **Apr 15 2026 workshop only** — naming **Shippit** as the presenting brand, **Julia** as the workshop presenter, and **GSP** as the teaching vehicle for design-engineering principles. Do **not** bundle the 2025 residency into this entry.
4. Delete `content/experiences/get-shit-pretty.md`.

---

## 7. Tests

- Extend `lib/content.test.ts` with cases for the new `media` field on `Experience`: empty/missing, video only, slides only, mixed array.
- Assert `customHero` is correctly typed and parsed for `CaseStudy`.
- Add a render assertion for the Ipê City `WorkRow` (or similar): `<iframe title="Layer 2 — AI Skills…">` is in the DOM when expanded.
- No e2e — visual confirmation via dev server is enough for v1.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Slidev `--base` path mismatches between local build and deployed `public/`. | Document the exact flag in `docs/slides-build.md`. Verify on dev server before commit. |
| YouTube embed blocked by privacy extensions. | Use `youtube-nocookie.com`. Caption the embed so absence is recoverable. |
| Iframe height collapse on some browsers. | Use `aspect-video` (Tailwind) — explicit ratio, no JS measurement. |
| Repo size growth from committed Slidev build. | One deck, ~3MB. Re-evaluate at 3+ decks (consider Git LFS or external deploy). |
| Two-source confusion if experience MD for GSP is left in place. | Delete it as part of the same PR. |
| Expand panel too tall with two stacked 16:9 embeds. | Lift `max-h` constraint *only* when `media?.length`. Existing experiences keep their compact layout. |
| `hero_variant` enum doesn't accept a `custom` value. | Resolve during implementation — either add a value or rely on `customHero` alone for dispatch. |

---

## 9. Implementation Order

1. Add `MediaItem` type, `CustomHero` type. Extend `Experience` with `media?: MediaItem[]`. Extend `CaseStudy` with `customHero?: CustomHero`. Update parsers/types in `lib/content.ts`.
2. Build `<VideoEmbed/>`, `<SlidesEmbed/>`, `<MediaList/>` components.
3. Port `<AsciiHero/>` from GSP into `components/ascii-hero.tsx`.
4. Extend `<CaseStudyHero/>` with `customHero` dispatcher (case `"ascii-gsp"` renders `<AsciiHero/>`).
5. Extend `<WorkRow/>` with media-aware layout fork (single column, lifted max-h, media block above outcome).
6. Wire pass-throughs in `app/page.tsx` (Experiences `media`) and `app/projects/[slug]/page.tsx` (`customHero`).
7. Build Slidev deck with `--base`, copy to `public/slides/design-engineering-apr15/`.
8. Capture homepage-card / OG cover PNG from `gsp.jubs.studio`, save to `public/images/projects/get-shit-pretty/cover.png`.
9. Create `content/experiences/ipe-city.md` (with `media` block).
10. Author `content/projects/get-shit-pretty.md` (Julia writes the body; structural fields, `customHero: ascii-gsp` come from this spec).
11. Delete `content/experiences/get-shit-pretty.md`.
12. Update tests.
13. `docs/slides-build.md` — manual rebuild procedure.

PR scope: all of the above on one branch (`feature/gsp-and-ipe-city`). Independent of PR #3 (`feature/gallery-refactor`). Steps 1–9 and 11–13 can land before step 10; the GSP case-study MD can ship with placeholder body copy and be filled in by Julia in a follow-up commit on the same branch before merge.

---

## 10. Open questions

- **GSP body voice** — case-study tone (matches Shippit/Heimdall) vs. talk-recap tone. Recommended: case-study tone. The page lives at `/projects/get-shit-pretty/`, not `/talks/`.
- **Ipê City body copy** — short framing for the Apr 15 2026 workshop. Body should make the attribution chain explicit (Shippit-presented, Julia presenting, GSP as teaching vehicle) and locate the workshop at Ipê City as venue. ~2-3 sentences.
- **Standalone slides URL** — keep at `/slides/design-engineering-apr15/` (current) or expose at a friendlier `/talks/ipe-city-design-engineering/`? v1: keep `/slides/` to avoid a redirect layer.

---

## 11. Resolved decisions

- **GSP placement (resolved 2026-05-05):** GSP is a full case study in Selected Work — not in Experiences. Per Julia: "get shit pretty should be a full case in selected works."
- **Workshop media placement (resolved 2026-05-05):** Recording + deck live on the **Ipê City Experience**, not on the GSP case study. Per Julia: "the presentation goes in experience in ipe city." GSP case study is about the product; Ipê City is about the moment.
- **Workshop framing (resolved 2026-05-05):** Julia was the **workshop presenter** (the human delivering the session); the workshop was **presented by Shippit** (the brand under which it ran); Julia used **GSP as the teaching vehicle** to convey design-engineering principles. Attribution chain: Ipê City (venue) → Shippit (presenting brand) → Julia (presenter) → GSP (teaching tool). Per Julia: "i was just a workshop host on ipe city, the workshop was presented by shippit and i used GSP to teach design engineering principles and skills."
- **Engagement scoping (resolved 2026-05-05):** The Ipê City Experience entry covers **only the Apr 15 2026 workshop**. Julia's prior engagement at Ipê City — **Apr–May 2025 as Ipê Architect / Resident Builder** (Ramp Center, tokenization) — is a separate, distinct engagement. It is **not** bundled into this entry and is not added to the portfolio in this spec. Per Julia: "last year i was an ipe architect, this year i just presented the workshop." If the 2025 residency is added to the portfolio later, it gets its own Experience entry.
- **Cover image source (resolved 2026-05-05):** static PNG screenshot of the ASCII hero at `gsp.jubs.studio` for homepage card / OG; live `<AsciiHero/>` component port for the case-study page hero. Per Julia: "use the asciiart from gsp.jubs.studio hero."
- **Publish status (resolved 2026-05-05):** `published: true` from day one for both items. Per Julia: "consider gsp live."
- **Slidev embedding approach (resolved 2026-05-05):** Approach A — `slidev build` with `--base`, copy `dist/` into portfolio `public/slides/<slug>/`, iframe same-origin. Single deploy pipeline; ~3MB cost per deck accepted.
- **Talks home convention (resolved 2026-05-05):** Standalone decks live at `~/Projects/talks/<slug>/`; project-tied decks at `~/Projects/<project>/talks/<slug>/`. Codified in `~/Mugen/CLAUDE.md`.
