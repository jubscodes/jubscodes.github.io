# Portfolio Area — Design Spec

**Date:** 2026-04-29
**Owner:** Julia Hoffmann Buratto (jubscodes)
**Project:** jubs.studio (`jubscodes/jubscodes.github.io`)
**Status:** Approved — ready for implementation planning

---

## Summary

Add a portfolio area to `jubs.studio` optimized for **Design Engineer hiring signal**. The area introduces two new home-page sections (Selected Work, Experiences) plus three deep case-study pages, generated from MD files via a Next.js + Tailwind v4 + shadcn stack. The migration replaces the current single hand-authored `index.html` with a static-exported Next.js site deployed via GitHub Actions to GitHub Pages. The current visual aesthetic — dark surface, JetBrains Mono labels, ASCII flourishes, restrained palette — is preserved.

---

## 1. Goal & Scope

### Goal

A portfolio area that signals "experienced Design Engineer" to hiring managers and recruiters researching Julia for DE roles. Optimizes for: scannable breadth + drillable depth + skill tags + tangible outcomes.

### Audience

Hiring managers, recruiters, engineering managers researching Julia for Design Engineer roles. Not optimized for clients, peers, or AI agents (those audiences would want different presentations).

### In scope

- Two new home-page sections: **Selected Work** (3 case studies, deep pages) and **Experiences** (4 short-form items, self-contained, no deep pages).
- Three deep pages: `/projects/shippit/`, `/projects/notus/`, `/projects/heimdall/`.
- Tight + visual deep page format (~250 words copy + image-forward).
- Compact-list-with-hover-expand interaction for both new sections.
- Three-accent color system (green / orange / purple).
- MD-driven content with frontmatter customization.
- Migration from single `index.html` to Next.js + Tailwind v4 + shadcn static site.
- GitHub Actions deploy pipeline replacing current branch-based GH Pages serving.
- Visual parity with the current site's restrained aesthetic.

### Out of scope (v1)

- Search / filter UI on the portfolio (only 7 items).
- Per-experience deep pages (Experiences live in their expanded panel).
- Blog / writing area.
- Astro / Eleventy / any framework other than Next.
- Analytics, comments, contact form.
- Lightbox / modal for image strip.
- Motion library (animations beyond pure CSS).
- Sync script between Mugen experience MDs and website MDs.
- Real CypherCN component integration (deferred to v1.1).

### Deferred to v1.1+

- **Real CypherCN integration in the home preview card.** Replace hand-coded `cypher-*` markup with imported `<CypherButton>`, `<CypherBadge>`, `<CypherInput>` components from the CypherCN registry. Scoped to one file (`components/active-projects/cyphercn-preview.tsx`). Ships once CypherCN is stable.
- Sync script between Mugen experience MDs and website MDs.
- Lightbox / modal for image strip.
- Motion library for richer animations.
- Blog / writing area.

---

## 2. Information Architecture

### Site tree

```
jubs.studio/
├── /                                 home page
│   ├─ Nav                            (existing — kept)
│   ├─ Hero                           "Code with taste."
│   ├─ Projects ░ green               (existing — CypherCN, GSP cards)
│   ├─ Selected Work ░ orange         NEW · 3 expandable rows · deep pages
│   │   ├─ ▸ Shippit
│   │   ├─ ▸ Notus / Chainless
│   │   └─ ▸ Heimdall
│   ├─ Experiences ░ purple           NEW · 4 expandable rows · self-contained
│   │   ├─ ▸ Avalanche Innovation House
│   │   ├─ ▸ Best LayerZero
│   │   ├─ ▸ 1st Place Aurora
│   │   └─ ▸ Cursor Coffee
│   ├─ Manifesto                      (existing — kept)
│   ├─ Terminal install               (existing — kept)
│   └─ Footer                         (existing — adds Selected Work link group)
│
├── /projects/shippit/                NEW deep page
├── /projects/notus/                  NEW deep page
└── /projects/heimdall/               NEW deep page
```

### Deep page template (applies to all 3 case studies)

```
Nav (same as home)
Hero
├─ Cover image
├─ H1: project name
├─ Accent line
└─ Role · Period · Company · Location  (mono metadata strip)

Three short blocks
├─ Context     (~80 words)
├─ What I did  (~80 words, can be bullets)
└─ Outcome     (~80 words)

Image strip (3–5 large screenshots)
Tag list (skill / stack chips)
Link list (live site, GitHub, LinkedIn role)
Prev / Next nav (cycles through case studies)
Footer (same as home)
```

### URL convention

`/projects/<slug>/index.html` — directories with `index.html` so URLs are clean (`jubs.studio/projects/heimdall` works, no `.html`). Configured via `trailingSlash: true` in `next.config.ts`.

### Navigation behavior

- Nav stays fixed at top across all pages.
- "jubs.studio" logo links to `/`.
- No new top-level nav items — home-page sections reached by anchors (`#selected-work`, `#experiences`).
- Footer gains a "Selected Work" link group alongside Projects + Connect.

---

## 3. Build System

### Stack

```
Next.js 16              App Router · static export · TypeScript
Tailwind CSS v4         design tokens via @theme
shadcn/ui               base primitives (Button, Card, …)
gray-matter             frontmatter parser
```

- `output: 'export'` in `next.config.ts` — Next emits a fully static `out/` directory. GitHub Pages serves it.
- `images: { unoptimized: true }` — required because GH Pages can't run Next's image optimization.
- `trailingSlash: true` — produces clean directory-with-index.html URLs.
- Tailwind v4 — design tokens in CSS via `@theme {}`, no JS config.

### Repo layout (after migration)

```
jubscodes.github.io/
├── app/                                   App Router
│   ├── layout.tsx                         root: <html>, nav, footer
│   ├── page.tsx                           home
│   ├── projects/[slug]/page.tsx           dynamic case study route
│   └── globals.css                        Tailwind + @theme tokens
│
├── components/
│   ├── ui/                                shadcn primitives
│   ├── active-projects/                   home-only big cards
│   │   ├── project-card-active.tsx
│   │   ├── cyphercn-preview.tsx           hand-coded for v1, real components in v1.1
│   │   └── gsp-pipeline.tsx
│   ├── work-row.tsx                       compact list row, hover-expand
│   ├── section-header.tsx                 ASCII flourish + accent
│   ├── case-study-hero.tsx
│   ├── content-block.tsx                  Context / What I did / Outcome
│   ├── image-strip.tsx
│   ├── tag-list.tsx
│   ├── link-list.tsx
│   ├── prev-next-nav.tsx
│   ├── nav.tsx
│   ├── hero.tsx
│   ├── manifesto.tsx
│   ├── terminal-install.tsx
│   └── footer.tsx
│
├── content/
│   ├── projects/                          3 .md files (case studies)
│   └── experiences/                       4 .md files (frontmatter-only)
│
├── lib/
│   ├── content.ts                         MD loader, gray-matter, types
│   └── routes.ts                          generateStaticParams from content
│
├── public/
│   ├── images/
│   │   ├── projects/{shippit,notus,heimdall}/
│   │   └── experiences/
│   ├── llms.txt                           static
│   ├── robots.txt
│   └── sitemap.xml                        regenerated by build
│
├── CNAME                                  must stay at repo root for GH Pages
├── next.config.ts
├── components.json                        shadcn config
├── tsconfig.json
├── package.json
├── .gitignore
├── README.md
└── docs/superpowers/specs/                this spec lives here
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

shadcn-installed components add their own peers (`class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`).

### Local dev

```bash
npm run dev          # next dev — localhost:3000, hot reload
npm run build        # next build → out/
npm run preview      # python3 -m http.server -d out 8000  (sanity check)
```

### Deploy pipeline

GitHub Actions workflow at `.github/workflows/deploy.yml`:

```
on push to main
├─ checkout
├─ setup-node 22
├─ npm ci
├─ npm run build           → outputs to out/
├─ copy CNAME into out/
└─ actions/deploy-pages@v4 → publishes out/
```

GitHub Pages source set to **"GitHub Actions"** (not "branch"). Push to main → CI builds → site updates. CNAME, DNS, custom domain all unchanged.

---

## 4. Components

15 components total. **All are React Server Components** (Next App Router default) — no client-side JS. The hover-expand interaction is pure CSS via Tailwind `group-hover:` and `group-focus-within:` modifiers. The site ships with zero application JS bundle apart from Next's runtime.

### Layout shell (every page)

| Component | Props | Notes |
|---|---|---|
| `Nav` | `currentPath?: string` | Fixed top bar. Logo links to `/`. External links to GitHub/X/LinkedIn. |
| `Footer` | — | Brand block · Projects · Selected Work · Connect · ASCII bottom bar. |

### Home only

| Component | Props | Notes |
|---|---|---|
| `Hero` | — | `Code with taste.` title + subtitle + 2 CTAs. |
| `ProjectCardActive` | `project: ActiveProject` | Existing big-preview cards (CypherCN, GSP). Slot for decorative preview. |
| `SectionHeader` | `title`, `accent: "primary" \| "secondary" \| "tertiary"` | ASCII top line + mono label + accent underline. |
| `WorkRow` | `item`, `variant: "case-study" \| "experience"` | The new compact-list row with hover-expand. See below. |
| `Manifesto` | — | Static markup, 4 paragraphs. |
| `TerminalInstall` | — | Static install terminal block. |

### Case-study deep pages

| Component | Props | Notes |
|---|---|---|
| `CaseStudyHero` | `cover`, `name`, `role`, `period`, `company`, `location?`, `accent` | Cover image + metadata strip. |
| `ContentBlock` | `label`, `body: ReactNode` | Used 3× per case study. |
| `ImageStrip` | `images: Image[]` | 3–5 screenshots, lazy-loaded via `next/image`. |
| `TagList` | `tags: string[]`, `accent` | Skill chips in mono. |
| `LinkList` | `links: { label, href, external? }[]` | Live site, GitHub, LinkedIn. |
| `PrevNextNav` | `prev`, `next` | Cycles through case studies. |

### `WorkRow` — interaction spec

```ts
type WorkRowProps = {
  item: {
    slug: string;
    name: string;
    meta: string;
    cover?: string;
    outcome: string;
    tags: string[];
    links?: Link[];
  };
  variant: "case-study" | "experience";
};
```

**Behavior:**

- **Default:** single-line row — `▸ name ··· meta`.
- **Hover or focus:** body slides open revealing cover image (left) + outcome paragraph + tag chips + link CTA (right). Arrow rotates ▸ → ▾. Subtle background tint at 5% accent opacity.
- **Click:** `case-study` variant navigates to `/projects/<slug>/`. `experience` variant does nothing (informational).
- **Mobile (≤720px):** body always rendered, arrow pre-rotated, no hover.

**Implementation:** Pure CSS with Tailwind `group`, `group-hover:`, `group-focus-within:`. `max-h` transition on body for slide animation. No `useState`, no JS event handlers.

```tsx
<a
  href={variant === "case-study" ? `/projects/${slug}/` : undefined}
  className="group block border-b border-border focus-within:bg-secondary/5 hover:bg-secondary/5"
  tabIndex={variant === "experience" ? 0 : undefined}
>
  <div className="flex items-center gap-4 py-5">
    <span className="font-mono text-muted transition-transform group-hover:rotate-90 group-focus-within:rotate-90">▸</span>
    <span className="text-lg font-medium">{name}</span>
    <span className="ml-auto font-mono text-sm text-muted">{meta}</span>
    {variant === "case-study" && (
      <span className="font-mono text-xs text-muted opacity-0 group-hover:opacity-100">view →</span>
    )}
  </div>
  <div className="max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-h-[300px] group-focus-within:max-h-[300px] max-md:max-h-[300px]">
    {/* preview + outcome + tags + links */}
  </div>
</a>
```

### Page composition

```tsx
// app/page.tsx — home
<>
  <Hero />
  <SectionHeader title="Projects" accent="primary" />
  <ProjectsGrid> {ProjectCardActive × 2} </ProjectsGrid>
  <SectionHeader title="Selected Work" accent="secondary" />
  <WorkList> {WorkRow variant="case-study" × 3} </WorkList>
  <SectionHeader title="Experiences" accent="tertiary" />
  <WorkList> {WorkRow variant="experience" × 4} </WorkList>
  <Manifesto />
  <TerminalInstall />
</>

// app/projects/[slug]/page.tsx — case study
<>
  <CaseStudyHero {...frontmatter} />
  <ContentBlock label="Context"     body={contextMd} />
  <ContentBlock label="What I did"  body={whatIDidMd} />
  <ContentBlock label="Outcome"     body={outcomeMd} />
  <ImageStrip images={frontmatter.images} />
  <TagList tags={frontmatter.tags} accent={frontmatter.accent} />
  <LinkList links={frontmatter.links} />
  <PrevNextNav prev={...} next={...} />
</>
```

`Nav` and `Footer` live in `app/layout.tsx` and wrap every page.

---

## 5. Content & Frontmatter Schema

### Active projects — TypeScript data

CypherCN and GSP are not in MD; their cards have custom JSX previews. They live in `content/active-projects.ts`:

```ts
export type ActiveProject = {
  name: string;
  description: string;
  categories: { label: string; tone: "primary" | "tertiary" }[];
  href: string;
  install?: string;
  preview: ReactNode;
};
```

### Case studies — `content/projects/<slug>.md`

```yaml
---
slug: shippit
name: Shippit
type: case-study
published: true
order: 1

role: Design Engineer
company: Shippit
company_url: https://shippit.com
period: 2025 — present
start_date: 2025-04
end_date: null
location: Remote

accent: secondary
hero_variant: cover               # cover | text-only (terminal deferred)
image_layout: strip               # strip | grid

cover: /images/projects/shippit/cover.png
images:
  - { src: /images/projects/shippit/dashboard.png, alt: Dashboard view }
  - { src: /images/projects/shippit/settings.png, alt: Settings panel }

outcome: Built front-end for an agentic AI platform. Authored AI rules, refactored the codebase, established a design system that scales with the product.
tags: [design-system, react, ai-rules, typescript, refactoring]

links:
  - { label: "Live site", href: "https://shippit.com", external: true }
  - { label: "LinkedIn role", href: "https://linkedin.com/in/julia-hoffmann-/", external: true }
---

## Context
~80 words. Why this work mattered, the company stage you joined, the problem space.

## What I did
~80 words. Bullets or prose. The actual work.

## Outcome
~80 words. What shipped, scale, recognition, what remains active.
```

The body sections (`## Context`, `## What I did`, `## Outcome`) are parsed and routed to the three `<ContentBlock>` slots on the deep page. Header strings must match exactly.

### Experiences — `content/experiences/<slug>.md`

**Frontmatter-only. No body.**

```yaml
---
slug: avalanche-innovation-house
name: Avalanche Innovation House
type: experience
published: true
order: 1

meta: Builder Residency · Buenos Aires · 2024
outcome: Three-month builder residency program. Post-Chainless launch incubation. Built and shipped alongside the global Avalanche builder cohort.
tags: [residency, crypto, product, latam]
links:
  - { label: "About the program", href: "https://avalanche.com/innovation-house", external: true }
images:
  - { src: /images/experiences/avalanche-ih-thumb.png, alt: Innovation House mural }

accent: tertiary
---
```

Adding a 5th experience is one new MD file. No code changes.

### Sort & filter

```ts
const sorted = items
  .filter(i => i.published !== false)
  .sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return (b.start_date ?? "").localeCompare(a.start_date ?? "");
  });
```

Explicit `order` wins; otherwise newest by `start_date`.

### TypeScript types

```ts
type CaseStudy = {
  slug: string; name: string; type: "case-study"; published?: boolean; order?: number;
  role: string; company: string; company_url?: string;
  period: string; start_date: string; end_date: string | null;
  location?: string;
  accent: "primary" | "secondary" | "tertiary";
  hero_variant: "cover" | "text-only";
  image_layout: "strip" | "grid";
  cover: string;
  images: { src: string; alt: string }[];
  outcome: string;
  tags: string[];
  links: { label: string; href: string; external?: boolean }[];
  body: { context: string; whatIDid: string; outcome: string };
};

type Experience = {
  slug: string; name: string; type: "experience"; published?: boolean; order?: number;
  meta: string;
  outcome: string;
  tags: string[];
  links: { label: string; href: string; external?: boolean }[];
  images?: { src: string; alt: string }[];
  accent: "primary" | "secondary" | "tertiary";
};
```

### Validation

`lib/content.ts` parses each MD with `gray-matter`, narrows to the right TS type, throws at build time if a required field is missing. Build fails fast — invalid content cannot deploy.

### Relationship to Mugen experience MDs

`~/Mugen/career/experiences/*.md` are the **factual canonical source-of-truth** for CVs (per Mugen's CLAUDE.md: factual data, no voice styling). Different schema (`cv: { eligible, summary, variants, type }`).

The website's `content/projects/*.md` and `content/experiences/*.md` are **presentation-tuned** — same underlying facts, different schema, different copy (rewritten for hiring-manager scan, not CV bullet style).

For v1: separate files, authored fresh. The site repo is self-contained. A sync script is deferred to v1.1+.

---

## 6. Visual & Interaction

### Three-accent system

| Accent | Token | Used for |
|---|---|---|
| `primary` (`#00FF88`) | active / live | Projects section header, CypherCN+GSP cards, hero CTA, terminal install ticks |
| `secondary` (`#FF6B35`) | shipped / past | Selected Work section header, case study deep-page accents, tag chips, prev/next nav |
| `tertiary` (`#A78BFA`) | events / recognition | Experiences section header, experience-row tags, expanded panel highlights |

Each accent is used **sparingly** — never as a fill on large surfaces. Only borders, label text, hover tints (≤5% opacity), and small decorative elements.

### Expand-on-hover (final spec)

| Property | Value |
|---|---|
| Trigger | `:hover` AND `:focus-within` |
| Open duration | 300ms |
| Easing | `cubic-bezier(0.2, 0.6, 0.2, 1)` |
| Arrow rotation | 90° (▸ → ▾), same duration |
| Background tint | `var(--accent) / 5%` opacity |
| Body padding | `0 32px 24px 32px` |
| Body grid | `1fr 1fr` (image left, detail right) |
| Mobile (≤720px) | Always expanded · arrow pre-rotated · tint always-on |

Pure CSS via Tailwind `group-hover:` / `group-focus-within:`. **Zero JS bundle.**

### Hero variants on case studies

For v1, all 3 case studies use `hero_variant: cover` (large product screenshot + name + accent line + metadata strip). The `text-only` variant is supported in the schema for future projects without imagery. The `terminal` variant is **deferred** (out of scope for v1 — would require CypherCN-level styling we're not building).

| Project | Hero variant |
|---|---|
| Shippit | `cover` |
| Notus / Chainless | `cover` |
| Heimdall | `cover` |

### Image strip

| Property | Value |
|---|---|
| Layout | Vertical stack on mobile, horizontal row on desktop |
| Image count | 3–5 per case study |
| Sizing | `next/image` with `sizes="(min-width: 1024px) 33vw, 100vw"` |
| Loading | Lazy via `next/image` |
| Click behavior | None for v1 — display only |
| Decoration | None — clean (scanline overlays stay only inside the CypherCN preview card) |
| Border | 1px `var(--border)`, 2px radius |

### Prev/Next nav (deep page bottom)

```
─── separator ─────────────────────────────────────
   ◂ Previous case study           Next case study ▸
   Heimdall                        Notus / Chainless
```

Two-column grid, mono labels, large-type project names. Cycles forever. `secondary` accent on hover.

### Responsive breakpoints

| Breakpoint | Tailwind | Behavior |
|---|---|---|
| ≤380px | (default) | Tightest — stacks, nav links hide except logo, padding 16px |
| ≤720px | `max-md:` | Mobile — WorkRow always-expanded, kit grid 1-col, image strip stacks |
| 720–1024px | `md:` | Tablet — image strip 1-col, hover-expand active |
| ≥1024px | `lg:` | Desktop — full layout, image strip 3-col |
| ≥1440px | `xl:` | Max width 1200px |

### Animation library

Pure CSS for v1 — handles expand-on-hover, arrow rotation, background tint transitions. No `motion` install. Adding a motion library is deferred to v1.1+ if specific interactions need it.

### Visual restraint

The new sections preserve the current site's aesthetic: dark surface (`#0A0A0A`), JetBrains Mono labels, ASCII flourishes, restrained palette. No CypherCN-level styling (CRT scanlines, phosphor glow, box-drawing borders) bleeds into the new portfolio area. The CypherCN aesthetic stays scoped to the CypherCN preview card on the home page.

---

## 7. Migration Plan & Verification

### 7 stages, each independently shippable / abandonable

```
Stage 1   Scaffold Next.js project on feature branch
Stage 2   Replicate current home page 1:1 (visual parity check)
Stage 3   Add new section components with placeholder data
Stage 4   Wire MD content pipeline (gray-matter, lib/content.ts)
Stage 5   Build deep pages (/projects/[slug])
Stage 6   SEO + AI signals (llms.txt, sitemap, JSON-LD)
Stage 7   GH Actions deploy + cutover from "branch" to "Actions" source
```

### Stage details

**Stage 1 — Scaffold** (~30 min)
- Branch: `feature/portfolio-area`.
- `npx create-next-app@latest --typescript --tailwind --app --no-src-dir` into a temp dir, then merge into repo root preserving `CNAME`, `llms.txt`, `robots.txt`, `sitemap.xml`.
- `next.config.ts`: `{ output: 'export', trailingSlash: true, images: { unoptimized: true } }`.
- Install `gray-matter`. Run `npx shadcn@latest init`.
- **Acceptance:** `npm run dev` → localhost:3000 shows blank Next welcome.

**Stage 2 — Visual parity** (~3 hr)
- Port nav, hero, projects (hardcoded CypherCN/GSP), manifesto, terminal install, footer to components.
- Tailwind v4 `@theme` block in `app/globals.css` mirrors current `:root` CSS vars 1:1.
- `cyphercn-preview.tsx` keeps the existing hand-coded markup (real components are v1.1).
- **Acceptance:** localhost:3000 indistinguishable from live `jubs.studio` side-by-side.

**Stage 3 — Section structure** (~2 hr)
- Add `SectionHeader`, `WorkRow`, `WorkList` components.
- Hardcode 3 case studies + 4 experiences as a TS array (placeholder data).
- Render Selected Work + Experiences sections on home with hover-expand working.
- **Acceptance:** hover-expand matches the working demo; tab-through is keyboard-accessible (focus visible, expand triggers).

**Stage 4 — MD pipeline** (~2 hr)
- Create 7 MD files in `content/projects/` and `content/experiences/`.
- Build `lib/content.ts` loader: read dir, parse with gray-matter, validate types, sort.
- Replace hardcoded array with `getCaseStudies()` / `getExperiences()` calls.
- **Acceptance:** setting `published: false` on a file removes it from home; adding a 5th experience MD shows it on home without code changes.

**Stage 5 — Deep pages** (~4 hr)
- `app/projects/[slug]/page.tsx` with `generateStaticParams()` from content.
- Build `CaseStudyHero`, `ContentBlock`, `ImageStrip`, `TagList`, `LinkList`, `PrevNextNav`.
- Author actual case study copy in the 3 MDs (Context · What I did · Outcome, ~80 words each).
- Drop screenshots into `public/images/projects/<slug>/`.
- **Acceptance:** `npm run build` produces `out/projects/{shippit,notus,heimdall}/index.html`. Each loads at `localhost:8000/projects/heimdall/` (via `python3 -m http.server -d out 8000`). Prev/next cycle works.

**Stage 6 — SEO/AI** (~1 hr)
- Regenerate `sitemap.xml` to include new project URLs.
- Update `llms.txt` with case study summaries.
- Expand `Person.knowsAbout` JSON-LD; consider adding `SoftwareApplication` entries for case studies that are open-source.
- **Acceptance:** post-deploy, `curl jubs.studio/sitemap.xml` lists 4 URLs (home + 3 projects).

**Stage 7 — Deploy cutover** (~30 min)
- `.github/workflows/deploy.yml`: checkout → setup-node 22 → `npm ci` → `npm run build` → copy `CNAME` into `out/` → `actions/deploy-pages@v4`.
- GH repo Settings → Pages: change source from "Deploy from branch" to "GitHub Actions".
- First push to `main` triggers build + deploy.
- **Acceptance:** `jubs.studio` and `jubs.studio/projects/heimdall/` both load correctly. Lighthouse Performance/Accessibility/Best Practices/SEO ≥95.

### Verification matrix

| Check | How | Pass criteria |
|---|---|---|
| Visual parity (Stage 2) | Side-by-side screenshot diff | No visible regressions |
| Hover-expand (Stage 3+) | Mouse hover + keyboard Tab | Both trigger expand; focus visible |
| Mobile responsive | Devtools at 320 / 380 / 720 / 1024 | No overflow, rows always-expanded ≤720px |
| MD-driven content (Stage 4) | Toggle `published: false` | Item disappears |
| Deep pages route correctly (Stage 5) | Visit `/projects/heimdall/` | Loads, prev/next work, image strip renders |
| Static export integrity (Stage 5+) | `out/` directory contents | Every page has `index.html` at correct path |
| Build fails on bad content | Remove a required frontmatter field | Build errors clearly, no deploy |
| Accessibility (Stage 7) | Tab through home, axe-core scan | Focus visible, no axe violations |
| Lighthouse (Stage 7) | DevTools | All four scores ≥95 |
| AI/SEO signals (Stage 6) | View source on home + project page | JSON-LD valid; meta tags complete |

### Rollback plan

The live site stays untouched on `main` until Stage 7. If anything goes wrong:

- **Stages 1–6:** work is on `feature/portfolio-area`; live site unaffected. Discard branch if needed.
- **At Stage 7 cutover:** if GH Actions deploys broken HTML, revert GH Pages source to "Deploy from branch: main". Live site reverts to current handcrafted `index.html` instantly.
- **Post-cutover regression:** revert the offending commit. CI rebuilds. Site fixed in ~3 min.

### Effort estimate

~13 hours focused work end-to-end. Realistically 2–3 working sessions over a week.

---

## 8. Decisions Log

For traceability of "why this and not the other thing":

| # | Decision | Alternatives considered | Why this won |
|---|---|---|---|
| 1 | Audience: hiring managers for DE roles | Clients · peers · AI agents | Aligns with current job-search context |
| 2 | 3 case studies + 4 experiences | All 25 experiences · directory-style | Tight curation = signal over noise for hiring scan |
| 3 | Cases: Shippit, Notus/Chainless, Heimdall | Sherry · Tools for the Commons · Luxy | User pick — strongest DE-fit work |
| 4 | Compact list with hover-expand | Two-section grid · big cards · directory page | User preference — delighter; matches terminal aesthetic |
| 5 | Two new sections (Selected Work + Experiences) | Single combined section · footer "Recognition" strip | Cleaner narrative — three time horizons |
| 6 | Three accent colors | Single accent · two accents | Visual rhythm, reuses existing tokens |
| 7 | Tight + visual deep page (~250 words) | Long-form scroll · image-led | Best for hiring-manager scan pattern |
| 8 | Next.js + Tailwind + shadcn | Custom Node SSR (B+) · Astro · Vite SPA | Aligns with user's daily stack; ecosystem of aesthetic blocks |
| 9 | All `cover` hero variants | Heimdall as `terminal` | User wants restrained look — no CypherCN styling outside CypherCN card |
| 10 | CypherCN deferred to v1.1 | Use across the site · use only in preview card · skip permanently | CypherCN is WIP; portfolio shouldn't depend on it. Real components in preview later when stable |
| 11 | GH Actions deploy with `output: 'export'` | Vercel · branch-based GH Pages | Stays on existing GH Pages infra; adds CI build, no DNS change |
| 12 | Pure CSS animation (no Motion lib) | `motion` from day one | Earn animation; don't default to it |

---

## 9. References

- Current site: `index.html` (487 lines, single file)
- Source content: `~/Mugen/career/experiences/*.md`
- Source images: `~/Mugen/career/experiences/images/`
- Existing JSON-LD: see current `index.html` lines 19–68
- Live URL: `https://jubs.studio` (DNS at Google Domains, served by GH Pages)
