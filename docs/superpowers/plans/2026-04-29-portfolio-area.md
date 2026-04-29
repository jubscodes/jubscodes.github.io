# Portfolio Area Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a portfolio area to `jubs.studio` (3 case studies + 4 experiences with hover-expand rows) on a Next.js 16 + Tailwind v4 + shadcn static-export stack, deployed via GitHub Actions to GitHub Pages, with the live site untouched until the final cutover.

**Architecture:** Migrate the current single hand-authored `index.html` to a Next.js App Router project with static export (`output: 'export'`). Content authored as MD files parsed at build time by gray-matter; types validated and content sorted in `lib/content.ts`. UI is pure CSS (no client JS) — hover-expand uses Tailwind `group-hover:` and `group-focus-within:` modifiers. All work happens on `feature/portfolio-area` until Stage 7 cutover.

**Tech Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · shadcn/ui · gray-matter · Vitest (for `lib/content.ts` unit tests) · GitHub Actions (deploy)

**Spec:** [`docs/superpowers/specs/2026-04-29-portfolio-area-design.md`](../specs/2026-04-29-portfolio-area-design.md)

---

## File Structure

### New files

```
app/
├── layout.tsx                              root html, nav, footer wrappers
├── page.tsx                                home composition
├── globals.css                             Tailwind v4 + @theme tokens
└── projects/[slug]/page.tsx                dynamic case-study route

components/
├── nav.tsx                                 fixed top nav
├── hero.tsx                                "Code with taste."
├── manifesto.tsx                           4 paragraphs, static
├── terminal-install.tsx                    install block, static
├── footer.tsx                              brand + links + ASCII
├── section-header.tsx                      ASCII line + mono label + accent
├── work-row.tsx                            compact row, hover-expand
├── work-list.tsx                           wraps WorkRows with border-top
├── active-projects/
│   ├── project-card-active.tsx             big preview card (composition)
│   ├── cyphercn-preview.tsx                hand-coded markup (real components → v1.1)
│   └── gsp-pipeline.tsx                    GSP card preview
├── case-study-hero.tsx                     deep page hero
├── content-block.tsx                       Context / What I did / Outcome
├── image-strip.tsx                         3–5 screenshots
├── tag-list.tsx                            mono chips
├── link-list.tsx                           CTA links
└── prev-next-nav.tsx                       deep-page footer nav

content/
├── active-projects.ts                      CypherCN + GSP TS data
├── projects/
│   ├── shippit.md
│   ├── notus.md
│   └── heimdall.md
└── experiences/
    ├── avalanche-innovation-house.md
    ├── best-layerzero.md
    ├── 1st-aurora.md
    └── cursor-coffee.md

lib/
├── content.ts                              MD loader, validation, sort
└── content.test.ts                         unit tests for above

public/images/
├── projects/{shippit,notus,heimdall}/      cover + screenshots
└── experiences/                            thumbs

.github/workflows/deploy.yml                CI build → GH Pages

next.config.ts
components.json
tsconfig.json
package.json
vitest.config.ts
```

### Modified files

- `index.html` — **deleted** at end of Stage 2 (replaced by Next build output)
- `llms.txt` — moved into `public/`, expanded with case study summaries
- `robots.txt` — moved into `public/`
- `sitemap.xml` — moved into `public/`, regenerated to include new project URLs
- `CNAME` — kept at repo root (GH Actions copies into `out/`)

### Responsibility split

- **`lib/content.ts`** owns parsing, validating, sorting MD content. Pure functions. Unit-tested with Vitest. Throws on invalid frontmatter — build fails fast.
- **`components/work-row.tsx`** owns the compact-list-with-hover-expand interaction. Pure CSS via Tailwind. No `useState`. Used twice on home (case-study variant + experience variant).
- **`app/projects/[slug]/page.tsx`** owns case-study deep page composition. Reads `body.context`, `body.whatIDid`, `body.outcome` from the loader.
- **`components/active-projects/cyphercn-preview.tsx`** owns the visual preview of CypherCN. Hand-coded markup for v1; real CypherCN components import in v1.1 — scope contained to this file.

---

## Stage 1 — Scaffold (~30 min, 5 tasks)

### Task 1: Create feature branch

**Files:**
- Modify: git branch state

- [ ] **Step 1: Verify clean working tree**

Run: `git status`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Create and switch to feature branch**

Run: `git checkout -b feature/portfolio-area`
Expected: `Switched to a new branch 'feature/portfolio-area'`

- [ ] **Step 3: Push branch to origin to establish remote tracking**

Run: `git push -u origin feature/portfolio-area`
Expected: branch published, tracking set

---

### Task 2: Move existing static assets out of the way

**Files:**
- Modify: `index.html` (no change yet — will delete in Task 11)
- Move: `llms.txt` → `public/llms.txt`
- Move: `robots.txt` → `public/robots.txt`
- Move: `sitemap.xml` → `public/sitemap.xml`

- [ ] **Step 1: Create public/ directory**

Run: `mkdir -p public/images/projects public/images/experiences`

- [ ] **Step 2: Move existing static files into public/**

Run: `git mv llms.txt public/llms.txt && git mv robots.txt public/robots.txt && git mv sitemap.xml public/sitemap.xml`
Expected: 3 files relocated, tracked by git

- [ ] **Step 3: Verify CNAME stays at repo root**

Run: `ls CNAME`
Expected: `CNAME` (must remain at root for GH Actions to copy)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: relocate static assets into public/ for next.js scaffold"
```

---

### Task 3: Scaffold Next.js into the repo

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`, `postcss.config.mjs`

- [ ] **Step 1: Initialize package.json with exact dependencies**

Create `package.json`:

```json
{
  "name": "jubs-studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "preview": "python3 -m http.server -d out 8000",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
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
    "@tailwindcss/postcss": "^4.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated, no errors.

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".next"]
}
```

- [ ] **Step 4: Create next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 5: Create postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Create app/globals.css with Tailwind import (tokens come in Stage 2)**

```css
@import "tailwindcss";
```

- [ ] **Step 7: Create app/layout.tsx (placeholder — full version in Stage 2)**

```tsx
import "./globals.css";

export const metadata = {
  title: "jubs.studio",
  description: "Design Engineering — Julia Hoffmann Buratto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create app/page.tsx (placeholder)**

```tsx
export default function Home() {
  return <main>scaffold ok</main>;
}
```

- [ ] **Step 9: Create next-env.d.ts**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 10: Append build artifacts to .gitignore**

Read current `.gitignore` and append:

```
node_modules/
.next/
out/
*.tsbuildinfo
```

- [ ] **Step 11: Verify dev server boots**

Run: `npm run dev`
Expected: `Ready on http://localhost:3000` — visit, see "scaffold ok". Stop server with Ctrl-C.

- [ ] **Step 12: Verify production build works**

Run: `npm run build`
Expected: builds without errors, `out/index.html` exists.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js 16 + tailwind v4 + ts (placeholder app)"
```

---

### Task 4: Initialize shadcn

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/` (empty for now)

- [ ] **Step 1: Run shadcn init**

Run: `npx shadcn@latest init -d`
Expected: prompts for setup — accept defaults; select "New York" style or "Default"; pick `--cssVariables` yes; base color `Neutral`.

- [ ] **Step 2: Verify components.json was created**

Run: `cat components.json`
Expected: JSON config referencing `app/globals.css`, `components/ui`, `lib/utils.ts`.

- [ ] **Step 3: Verify lib/utils.ts exists with cn helper**

Run: `cat lib/utils.ts`
Expected: file contains `clsx` + `tailwind-merge` `cn()` helper.

- [ ] **Step 4: Build to ensure shadcn additions don't break export**

Run: `npm run build`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize shadcn/ui"
```

---

### Task 5: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `lib/content.test.ts` (smoke test only)

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Create lib/content.test.ts smoke test**

```ts
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: configure vitest for lib/ unit tests"
```

---

## Stage 2 — Visual parity (~3 hr, 6 tasks)

The goal here is "indistinguishable from live `jubs.studio` side-by-side". Verification is visual diff + side-by-side eye check. No unit tests for layout.

### Task 6: Port design tokens to Tailwind v4 @theme

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with full token set + base styles**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0A0A;
  --color-surface: #141414;
  --color-border: #262626;
  --color-border-hover: #3A3A3A;
  --color-fg: #E5E5E5;
  --color-muted: #8A8A8A;
  --color-primary: #00FF88;
  --color-secondary: #FF6B35;
  --color-tertiary: #A78BFA;

  --font-sans: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 2px;
}

@layer base {
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

- [ ] **Step 2: Add Google Fonts to app/layout.tsx**

Update `app/layout.tsx` `<head>` via `next/font/google`:

```tsx
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans-loaded", weight: ["400", "500", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-loaded", weight: ["400", "500"] });

export const metadata = {
  title: "Julia Hoffmann · Design Engineering · jubs.studio",
  description: "Design Engineer — Julia Hoffmann Buratto. Code with taste.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify dev server renders with correct dark bg + fonts**

Run: `npm run dev`
Expected: localhost:3000 shows `#0A0A0A` background, light text. Body uses Space Grotesk.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(theme): tailwind v4 @theme tokens + google fonts"
```

---

### Task 7: Port Nav component

**Files:**
- Create: `components/nav.tsx`
- Reference: read current `index.html` lines containing `<nav>` to get exact markup/links.

- [ ] **Step 1: Read current nav from index.html**

Run: `grep -n "<nav" index.html` to find line range, then `sed -n '<start>,<end>p' index.html` to read.

- [ ] **Step 2: Create components/nav.tsx**

```tsx
import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-bg/80 px-8 py-5 backdrop-blur">
      <Link href="/" className="font-mono text-sm font-medium tracking-tight">
        jubs.studio
      </Link>
      <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted">
        <a href="https://github.com/jubscodes" target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
        <a href="https://x.com/jubscodes" target="_blank" rel="noreferrer" className="hover:text-fg">X</a>
        <a href="https://linkedin.com/in/julia-hoffmann-/" target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Mount Nav in layout**

Update `app/layout.tsx` body:

```tsx
import { Nav } from "@/components/nav";
// ...
<body>
  <Nav />
  {children}
</body>
```

- [ ] **Step 4: Verify nav renders**

Run dev server, visit `localhost:3000`. Compare to live `jubs.studio` nav side-by-side: position, font, links, hover.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(nav): port nav component"
```

---

### Task 8: Port Hero + Manifesto + TerminalInstall + Footer

**Files:**
- Create: `components/hero.tsx`, `components/manifesto.tsx`, `components/terminal-install.tsx`, `components/footer.tsx`

These four are static blocks — port markup from `index.html` directly into JSX, swapping inline classes for Tailwind utilities.

- [ ] **Step 1: Read current hero markup**

Run: `grep -n "hero\|Code with taste" index.html` to locate.

- [ ] **Step 2: Create components/hero.tsx**

```tsx
export function Hero() {
  return (
    <section className="border-b border-border px-8 py-32">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {">"}_ design engineering · solo studio
        </p>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Code with taste.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Julia Hoffmann Buratto — Design Engineer building polished interfaces, design systems, and onchain UX.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider">
          <a href="#projects" className="border border-primary/30 bg-primary/5 px-4 py-2 text-primary hover:bg-primary/10">View work</a>
          <a href="#connect" className="border border-border px-4 py-2 text-muted hover:text-fg">Connect</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create components/manifesto.tsx**

Read current manifesto paragraphs from `index.html`, port verbatim:

```tsx
export function Manifesto() {
  return (
    <section className="border-b border-border px-8 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.08em] text-muted">─── manifesto ───</p>
        <div className="space-y-6 text-lg leading-relaxed text-fg">
          {/* PORT 4 paragraphs verbatim from index.html */}
        </div>
      </div>
    </section>
  );
}
```

(Engineer note: copy the 4 paragraphs from `index.html` exactly. Do not reword.)

- [ ] **Step 4: Create components/terminal-install.tsx**

Port the install terminal block from `index.html` verbatim. Keep mono font and JetBrains Mono color treatment.

```tsx
export function TerminalInstall() {
  return (
    <section className="border-b border-border bg-surface px-8 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.08em] text-muted">─── install ───</p>
        <div className="rounded border border-border bg-bg p-6 font-mono text-sm">
          <span className="text-primary">$</span> npx <span className="text-secondary">create-cyphercn-app</span>
        </div>
        <p className="mt-4 font-mono text-xs text-muted">
          {/* PORT subline verbatim */}
        </p>
      </div>
    </section>
  );
}
```

(Engineer note: copy the subline + any other terminal text verbatim from `index.html`.)

- [ ] **Step 5: Create components/footer.tsx**

Port footer markup from `index.html`. Keep brand block + Projects column + Connect column. Selected Work column will be added in Task 14.

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer id="connect" className="border-t border-border px-8 py-16">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
        <div>
          <p className="font-mono text-sm font-medium">jubs.studio</p>
          <p className="mt-2 text-sm text-muted">Design Engineering · Solo Studio</p>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Projects</p>
          <ul className="space-y-2 text-sm">
            <li><a href="https://cyphercn.com" className="hover:text-primary">CypherCN</a></li>
            <li><a href="https://npmjs.com/package/get-shit-pretty" className="hover:text-primary">GSP</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Connect</p>
          <ul className="space-y-2 text-sm">
            <li><a href="https://github.com/jubscodes" className="hover:text-fg">GitHub</a></li>
            <li><a href="https://x.com/jubscodes" className="hover:text-fg">X</a></li>
            <li><a href="https://linkedin.com/in/julia-hoffmann-/" className="hover:text-fg">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-5xl font-mono text-[10px] tracking-widest text-border">
        ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶
      </p>
    </footer>
  );
}
```

- [ ] **Step 6: Mount Footer in layout**

```tsx
// app/layout.tsx
import { Footer } from "@/components/footer";
// ...
<body>
  <Nav />
  {children}
  <Footer />
</body>
```

- [ ] **Step 7: Compose home page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <TerminalInstall />
    </main>
  );
}
```

- [ ] **Step 8: Visual diff check**

Run dev server. Open `localhost:3000` and live `https://jubs.studio` side-by-side. Verify: hero copy/spacing matches, manifesto paragraphs match verbatim, terminal block matches, footer matches. Tolerance: pixel-level differences from font rendering OK; copy/structure must match exactly.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: port hero, manifesto, terminal install, footer"
```

---

### Task 9: Port active-projects components (CypherCN + GSP)

**Files:**
- Create: `content/active-projects.ts`, `components/active-projects/project-card-active.tsx`, `components/active-projects/cyphercn-preview.tsx`, `components/active-projects/gsp-pipeline.tsx`

- [ ] **Step 1: Define active-project type and data**

Create `content/active-projects.ts`:

```ts
import type { ReactNode } from "react";
import { CypherCnPreview } from "@/components/active-projects/cyphercn-preview";
import { GspPipeline } from "@/components/active-projects/gsp-pipeline";

export type ActiveProject = {
  name: string;
  description: string;
  categories: { label: string; tone: "primary" | "tertiary" }[];
  href: string;
  install?: string;
  preview: ReactNode;
};

export const activeProjects: ActiveProject[] = [
  {
    name: "CypherCN",
    description: "Cypherpunk-styled component library. shadcn-compatible. CRT scanlines, phosphor glow, terminal aesthetic.",
    categories: [{ label: "WIP", tone: "tertiary" }, { label: "Library", tone: "primary" }],
    href: "https://cyphercn.com",
    install: "npx cyphercn@latest add button",
    preview: <CypherCnPreview />,
  },
  {
    name: "GSP",
    description: "get-shit-pretty — opinionated formatter for prettier-shy codebases.",
    categories: [{ label: "Beta", tone: "tertiary" }, { label: "CLI", tone: "primary" }],
    href: "https://npmjs.com/package/get-shit-pretty",
    install: "npx get-shit-pretty",
    preview: <GspPipeline />,
  },
];
```

- [ ] **Step 2: Create components/active-projects/cyphercn-preview.tsx**

Port the CypherCN preview markup from `index.html` verbatim. **Keep hand-coded** — real CypherCN component imports are deferred to v1.1 (per spec §1).

```tsx
export function CypherCnPreview() {
  return (
    <div className="relative overflow-hidden border border-border bg-bg p-6 font-mono">
      {/* PORT exact markup from index.html CypherCN preview block (button + badge + input mock-ups, scanline overlay) */}
    </div>
  );
}
```

(Engineer note: read `index.html` for the existing CypherCN card preview block and port markup + classes 1:1. If inline `style` attrs exist, convert to Tailwind classes that match the same colors/sizes.)

- [ ] **Step 3: Create components/active-projects/gsp-pipeline.tsx**

Port the GSP card preview from `index.html` verbatim.

```tsx
export function GspPipeline() {
  return (
    <div className="relative overflow-hidden border border-border bg-bg p-6">
      {/* PORT exact markup from index.html GSP preview block */}
    </div>
  );
}
```

- [ ] **Step 4: Create components/active-projects/project-card-active.tsx**

```tsx
import type { ActiveProject } from "@/content/active-projects";

export function ProjectCardActive({ project }: { project: ActiveProject }) {
  return (
    <a href={project.href} target="_blank" rel="noreferrer" className="group block border border-border transition-colors hover:border-border-hover">
      <div className="border-b border-border">{project.preview}</div>
      <div className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          {project.categories.map((c) => (
            <span
              key={c.label}
              className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                c.tone === "primary" ? "border-primary/30 text-primary" : "border-tertiary/30 text-tertiary"
              }`}
            >
              {c.label}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-medium">{project.name}</h3>
        <p className="text-sm text-muted">{project.description}</p>
        {project.install && (
          <code className="block border border-border bg-surface p-3 font-mono text-xs text-muted">
            <span className="text-primary">$</span> {project.install}
          </code>
        )}
      </div>
    </a>
  );
}
```

- [ ] **Step 5: Visual diff check**

Run dev server. The cards aren't yet on the home page — preview them by editing `app/page.tsx` temporarily to render `<ProjectCardActive>` instances. Confirm visual parity with live site, then revert the page edit (the section composition lands in Task 11).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(active-projects): cyphercn + gsp card components"
```

---

### Task 10: Section header + Projects section composition on home

**Files:**
- Create: `components/section-header.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create components/section-header.tsx**

```tsx
type Accent = "primary" | "secondary" | "tertiary";

const accentClass: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function SectionHeader({ title, accent, id }: { title: string; accent: Accent; id?: string }) {
  return (
    <header id={id} className="mb-10 px-8">
      <p className={`font-mono text-[10px] tracking-widest ${accentClass[accent]}`}>
        ─── {title.toUpperCase()} ───────────────────────────────────────────
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">{title}</h2>
    </header>
  );
}
```

- [ ] **Step 2: Add Projects section to home page**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { activeProjects } from "@/content/active-projects";

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="projects" className="border-b border-border py-24">
        <SectionHeader title="Projects" accent="primary" />
        <div className="mx-auto grid max-w-5xl gap-6 px-8 md:grid-cols-2">
          {activeProjects.map((p) => (
            <ProjectCardActive key={p.name} project={p} />
          ))}
        </div>
      </section>

      <Manifesto />
      <TerminalInstall />
    </main>
  );
}
```

- [ ] **Step 3: Final visual diff against live site**

Run dev server. Compare home page section-by-section with `https://jubs.studio`. All sections should match: nav, hero, projects (CypherCN + GSP cards), manifesto, terminal install, footer.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: section header + projects section composition"
```

---

### Task 11: Delete legacy index.html

**Files:**
- Delete: `index.html`

- [ ] **Step 1: Verify next build still works without index.html**

Run: `git rm index.html && npm run build`
Expected: build succeeds, `out/index.html` exists (Next-generated, not the legacy hand-coded one).

- [ ] **Step 2: Verify dev server still works**

Run: `npm run dev`
Expected: `localhost:3000` renders the Next-built version, identical to live site visually.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete legacy index.html (replaced by next.js build output)"
```

---

## Stage 3 — Section structure (~2 hr, 4 tasks)

Build `WorkRow` + `WorkList`, compose Selected Work + Experiences sections with hardcoded data. The MD pipeline lands in Stage 4.

### Task 12: Build WorkRow component

**Files:**
- Create: `components/work-row.tsx`

The hover-expand interaction is pure CSS — no client JS, no `useState`. Verification is browser-based (Vitest + RTL doesn't capture `:hover` reliably).

- [ ] **Step 1: Create components/work-row.tsx**

```tsx
import Image from "next/image";
import NextLink from "next/link";
import type { Link as ContentLink } from "@/lib/content";

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

export type WorkRowItem = {
  slug: string;
  name: string;
  meta: string;
  cover?: { src: string; alt: string };
  outcome: string;
  tags: string[];
  links?: ContentLink[];
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
        <span className={`font-mono transition-transform duration-300 group-hover:rotate-90 group-focus-within:rotate-90 max-md:rotate-90 ${accentText[accent]}`}>
          ▸
        </span>
        <span className="text-lg font-medium">{item.name}</span>
        <span className="ml-auto font-mono text-sm text-muted">{item.meta}</span>
        {isLink && (
          <span className={`font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100 ${accentText[accent]}`}>
            view →
          </span>
        )}
      </div>

      <div className="max-h-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:max-h-[400px] group-focus-within:max-h-[400px] max-md:max-h-[400px]">
        <div className="grid gap-6 px-8 pb-6 md:grid-cols-2">
          {item.cover && (
            <div className="relative aspect-video border border-border bg-surface">
              <Image src={item.cover.src} alt={item.cover.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          )}
          <div className="space-y-4">
            <p className="text-base leading-relaxed">{item.outcome}</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span key={t} className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: builds without errors. (Component is unused at this point — that's fine.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(work-row): compact list row with css hover-expand"
```

---

### Task 13: Build WorkList wrapper

**Files:**
- Create: `components/work-list.tsx`

- [ ] **Step 1: Create components/work-list.tsx**

```tsx
export function WorkList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl border-t border-border px-4">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(work-list): list wrapper for work rows"
```

---

### Task 14: Add Selected Work + Experiences sections to home (hardcoded data)

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/footer.tsx` (add Selected Work column)

- [ ] **Step 1: Add hardcoded WorkRow data inline in app/page.tsx**

Update `app/page.tsx`:

```tsx
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { WorkRow } from "@/components/work-row";
import { WorkList } from "@/components/work-list";
import { activeProjects } from "@/content/active-projects";

const placeholderCaseStudies = [
  {
    slug: "shippit",
    name: "Shippit",
    meta: "Design Engineer · 2025",
    cover: { src: "/images/projects/shippit/cover.png", alt: "Shippit dashboard" },
    outcome: "Built front-end for an agentic AI platform. Authored AI rules, refactored the codebase, established a design system that scales with the product.",
    tags: ["design-system", "react", "ai-rules", "refactoring"],
    links: [{ label: "Live site", href: "https://shippit.com", external: true }],
  },
  {
    slug: "notus",
    name: "Notus / Chainless",
    meta: "Cofounder · 2023",
    cover: { src: "/images/projects/notus/cover.png", alt: "Chainless app" },
    outcome: "Cofounded Notus and led product + design for Chainless, a Brazilian crypto fintech. Designed KYC and transaction UX. Launched at Blockchain Rio.",
    tags: ["product", "fintech", "crypto", "leadership"],
    links: [],
  },
  {
    slug: "heimdall",
    name: "Heimdall",
    meta: "Solo Designer · 2022",
    cover: { src: "/images/projects/heimdall/cover.png", alt: "Heimdall design system" },
    outcome: "Sole designer for a crypto data platform. Built a complete design system in Figma — typography, color, components — aligned with Tailwind for dev handoff.",
    tags: ["design-system", "figma", "tailwind", "data-viz"],
    links: [],
  },
];

const placeholderExperiences = [
  {
    slug: "avalanche-innovation-house",
    name: "Avalanche Innovation House",
    meta: "Builder Residency · Buenos Aires · 2024",
    outcome: "Three-month builder residency program. Post-Chainless launch incubation. Built and shipped alongside the global Avalanche builder cohort.",
    tags: ["residency", "crypto", "product", "latam"],
    links: [{ label: "Program info", href: "https://avalanche.com/innovation-house", external: true }],
  },
  {
    slug: "best-layerzero",
    name: "Best LayerZero",
    meta: "Hackathon Win · 2023",
    outcome: "Won Best LayerZero project at ETHGlobal hackathon for cross-chain UX work.",
    tags: ["hackathon", "cross-chain", "recognition"],
    links: [],
  },
  {
    slug: "1st-aurora",
    name: "1st Place Aurora",
    meta: "Hackathon Win · 2022",
    outcome: "First place at Aurora-sponsored hackathon for an onchain rental product.",
    tags: ["hackathon", "near", "recognition"],
    links: [],
  },
  {
    slug: "cursor-coffee",
    name: "Cursor Coffee",
    meta: "Speaker · 2025",
    outcome: "Spoke about agentic IDE design at the Cursor Coffee community event.",
    tags: ["speaking", "ai-tools", "community"],
    links: [],
  },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="projects" className="border-b border-border py-24">
        <SectionHeader title="Projects" accent="primary" />
        <div className="mx-auto grid max-w-5xl gap-6 px-8 md:grid-cols-2">
          {activeProjects.map((p) => (
            <ProjectCardActive key={p.name} project={p} />
          ))}
        </div>
      </section>

      <section id="selected-work" className="border-b border-border py-24">
        <SectionHeader title="Selected Work" accent="secondary" />
        <WorkList>
          {placeholderCaseStudies.map((c) => (
            <WorkRow key={c.slug} item={c} variant="case-study" accent="secondary" />
          ))}
        </WorkList>
      </section>

      <section id="experiences" className="border-b border-border py-24">
        <SectionHeader title="Experiences" accent="tertiary" />
        <WorkList>
          {placeholderExperiences.map((e) => (
            <WorkRow key={e.slug} item={e} variant="experience" accent="tertiary" />
          ))}
        </WorkList>
      </section>

      <Manifesto />
      <TerminalInstall />
    </main>
  );
}
```

- [ ] **Step 2: Drop placeholder cover images**

For each of `shippit`, `notus`, `heimdall`, place a temporary cover image at `public/images/projects/<slug>/cover.png`. Real images come in Stage 5; for now, any 1600×900 placeholder works. (Even a solid dark `#141414` PNG.)

Run: `mkdir -p public/images/projects/shippit public/images/projects/notus public/images/projects/heimdall`

Use any tool to drop a placeholder PNG (or copy an existing image from `~/Mugen/career/experiences/images/` if one exists).

- [ ] **Step 3: Add Selected Work column to footer**

Update `components/footer.tsx` to add a third column between Projects and Connect:

```tsx
<div>
  <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Selected Work</p>
  <ul className="space-y-2 text-sm">
    <li><a href="/projects/shippit/" className="hover:text-secondary">Shippit</a></li>
    <li><a href="/projects/notus/" className="hover:text-secondary">Notus / Chainless</a></li>
    <li><a href="/projects/heimdall/" className="hover:text-secondary">Heimdall</a></li>
  </ul>
</div>
```

Update grid to `md:grid-cols-4`.

- [ ] **Step 4: Browser verification — desktop hover**

Run: `npm run dev`
- Mouse hover over each Selected Work row → arrow rotates ▸→▾, body slides open in ~300ms, cover + outcome + tags render
- Mouse hover over each Experience row → same
- Click a Selected Work row → navigates to `/projects/shippit/` (will 404 until Stage 5; that's expected)
- Click an Experience row → does nothing (variant=experience)

- [ ] **Step 5: Browser verification — keyboard accessibility**

- Press Tab repeatedly through the page → focus visibly moves between rows
- When a row is focused, body should be expanded (via `:focus-within`)
- Enter on focused Selected Work row → navigates to deep page

- [ ] **Step 6: Browser verification — mobile**

Open devtools, switch to a 375px viewport.
- All rows should be pre-expanded (no hover on touch)
- Arrow pre-rotated to ▾
- "view →" CTA visible on case-study rows

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: selected work + experiences sections on home (placeholder data)"
```

---

### Task 15: Visual polish + rendering review

**Files:**
- Possibly minor adjustments to `components/work-row.tsx`, `components/section-header.tsx`

- [ ] **Step 1: Side-by-side compare with brainstorm demo**

Open `.superpowers/brainstorm/72715-1777437254/content/expand-on-hover.html` next to `localhost:3000`. Differences to expect: section header style is ours (matches existing site); row interactions should match the demo (arrow rotation, max-h transition, accent tint).

- [ ] **Step 2: Verify all 3 accent colors render correctly**

- Projects section header → green (`primary`)
- Selected Work section header → orange (`secondary`)
- Experiences section header → purple (`tertiary`)

- [ ] **Step 3: If any mismatches found, fix them inline and re-verify**

(Engineer judgement: if hover tint feels too strong or too weak, the spec calls for `5%` accent opacity — `bg-{accent}/5`. Don't go above `/10`.)

- [ ] **Step 4: Commit if any tweaks made**

```bash
git add -A
git commit -m "polish: accent tinting and visual rhythm for new sections"
```

---

## Stage 4 — MD pipeline (~2 hr, 5 tasks)

Replace hardcoded arrays with MD-driven content via gray-matter. `lib/content.ts` is pure logic — full TDD.

### Task 16: Define types + skeleton in lib/content.ts

**Files:**
- Create: `lib/content.ts` (types + empty exports for now)

- [ ] **Step 1: Create lib/content.ts**

```ts
export type Link = { label: string; href: string; external?: boolean };
export type Image = { src: string; alt: string };

export type CaseStudy = {
  slug: string;
  name: string;
  type: "case-study";
  published?: boolean;
  order?: number;
  role: string;
  company: string;
  company_url?: string;
  period: string;
  start_date: string;
  end_date: string | null;
  location?: string;
  accent: "primary" | "secondary" | "tertiary";
  hero_variant: "cover" | "text-only";
  image_layout: "strip" | "grid";
  cover: string;
  images: Image[];
  outcome: string;
  tags: string[];
  links: Link[];
  body: { context: string; whatIDid: string; outcome: string };
};

export type Experience = {
  slug: string;
  name: string;
  type: "experience";
  published?: boolean;
  order?: number;
  meta: string;
  outcome: string;
  tags: string[];
  links: Link[];
  images?: Image[];
  accent: "primary" | "secondary" | "tertiary";
};

export async function getCaseStudies(): Promise<CaseStudy[]> {
  throw new Error("not implemented");
}

export async function getExperiences(): Promise<Experience[]> {
  throw new Error("not implemented");
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  throw new Error("not implemented");
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(content): types and api skeleton"
```

---

### Task 17: Write failing tests for content loader

**Files:**
- Modify: `lib/content.test.ts`
- Create: `content/projects/test-fixture.md` (test-only fixture, deleted after)
  - Actually, we'll set up a temp dir per test to avoid coupling tests to real content. Use `mkdtempSync`.

- [ ] **Step 1: Replace lib/content.test.ts with real tests**

```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { _testInternals } from "@/lib/content";

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), "content-test-"));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("loadCaseStudies", () => {
  it("returns empty array when dir is empty", async () => {
    mkdirSync(join(tmp, "projects"));
    const result = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(result).toEqual([]);
  });

  it("parses a valid case study", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(
      join(tmp, "projects", "demo.md"),
      `---
slug: demo
name: Demo
type: case-study
published: true
order: 1
role: Engineer
company: ACME
period: 2025
start_date: 2025-01
end_date: null
accent: secondary
hero_variant: cover
image_layout: strip
cover: /img/demo.png
images: []
outcome: A demo project
tags: [demo]
links: []
---
## Context
context body

## What I did
what i did body

## Outcome
outcome body
`,
    );
    const [item] = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(item.slug).toBe("demo");
    expect(item.body.context).toContain("context body");
    expect(item.body.whatIDid).toContain("what i did body");
    expect(item.body.outcome).toContain("outcome body");
  });

  it("filters out items with published: false", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(join(tmp, "projects", "draft.md"), validCaseStudyMd({ slug: "draft", published: false }));
    writeFileSync(join(tmp, "projects", "live.md"), validCaseStudyMd({ slug: "live", published: true }));
    const result = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(result.map((c) => c.slug)).toEqual(["live"]);
  });

  it("sorts by order ascending when present", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(join(tmp, "projects", "a.md"), validCaseStudyMd({ slug: "a", order: 3 }));
    writeFileSync(join(tmp, "projects", "b.md"), validCaseStudyMd({ slug: "b", order: 1 }));
    writeFileSync(join(tmp, "projects", "c.md"), validCaseStudyMd({ slug: "c", order: 2 }));
    const result = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(result.map((c) => c.slug)).toEqual(["b", "c", "a"]);
  });

  it("falls back to start_date desc when order missing", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(join(tmp, "projects", "old.md"), validCaseStudyMd({ slug: "old", order: undefined, start_date: "2020-01" }));
    writeFileSync(join(tmp, "projects", "new.md"), validCaseStudyMd({ slug: "new", order: undefined, start_date: "2024-01" }));
    const result = await _testInternals.loadCaseStudies(join(tmp, "projects"));
    expect(result.map((c) => c.slug)).toEqual(["new", "old"]);
  });

  it("throws when required field is missing", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(
      join(tmp, "projects", "broken.md"),
      `---
slug: broken
type: case-study
---
## Context
x

## What I did
x

## Outcome
x
`,
    );
    await expect(_testInternals.loadCaseStudies(join(tmp, "projects"))).rejects.toThrow(/required/i);
  });

  it("throws when body sections are missing", async () => {
    mkdirSync(join(tmp, "projects"));
    writeFileSync(
      join(tmp, "projects", "nobody.md"),
      validCaseStudyMd({ slug: "nobody", body: "no sections here" }),
    );
    await expect(_testInternals.loadCaseStudies(join(tmp, "projects"))).rejects.toThrow(/Context|What I did|Outcome/);
  });
});

describe("loadExperiences", () => {
  it("parses frontmatter-only files", async () => {
    mkdirSync(join(tmp, "experiences"));
    writeFileSync(
      join(tmp, "experiences", "demo.md"),
      `---
slug: demo
name: Demo Experience
type: experience
published: true
order: 1
meta: "Test · 2024"
outcome: A demo experience
tags: [demo]
links: []
accent: tertiary
---
`,
    );
    const [item] = await _testInternals.loadExperiences(join(tmp, "experiences"));
    expect(item.slug).toBe("demo");
    expect(item.meta).toBe("Test · 2024");
  });

  it("skips published: false experiences", async () => {
    mkdirSync(join(tmp, "experiences"));
    writeFileSync(join(tmp, "experiences", "draft.md"), validExperienceMd({ slug: "draft", published: false }));
    writeFileSync(join(tmp, "experiences", "live.md"), validExperienceMd({ slug: "live", published: true }));
    const result = await _testInternals.loadExperiences(join(tmp, "experiences"));
    expect(result.map((e) => e.slug)).toEqual(["live"]);
  });
});

// fixture helpers
function validCaseStudyMd(overrides: Partial<{ slug: string; order?: number; published?: boolean; start_date?: string; body?: string }> = {}): string {
  const slug = overrides.slug ?? "fix";
  const orderLine = overrides.order !== undefined ? `order: ${overrides.order}\n` : "";
  const publishedLine = overrides.published !== undefined ? `published: ${overrides.published}\n` : "";
  const startDate = overrides.start_date ?? "2024-01";
  const body = overrides.body ?? `## Context\nctx\n\n## What I did\nwhat\n\n## Outcome\nout\n`;
  return `---
slug: ${slug}
name: ${slug}
type: case-study
${publishedLine}${orderLine}role: Engineer
company: ACME
period: ${startDate}
start_date: ${startDate}
end_date: null
accent: secondary
hero_variant: cover
image_layout: strip
cover: /img/c.png
images: []
outcome: o
tags: [t]
links: []
---
${body}`;
}

function validExperienceMd(overrides: Partial<{ slug: string; published?: boolean }> = {}): string {
  const slug = overrides.slug ?? "fix";
  const publishedLine = overrides.published !== undefined ? `published: ${overrides.published}\n` : "";
  return `---
slug: ${slug}
name: ${slug}
type: experience
${publishedLine}meta: "x"
outcome: o
tags: [t]
links: []
accent: tertiary
---
`;
}
```

- [ ] **Step 2: Run tests, verify all fail**

Run: `npm test`
Expected: tests fail because `_testInternals` is not exported and loaders are stubs.

- [ ] **Step 3: Commit failing tests**

```bash
git add -A
git commit -m "test(content): failing tests for md loader"
```

---

### Task 18: Implement content loader

**Files:**
- Modify: `lib/content.ts`

- [ ] **Step 1: Implement loadCaseStudies + loadExperiences + sort + validate**

Replace `lib/content.ts`:

```ts
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type Link = { label: string; href: string; external?: boolean };
export type Image = { src: string; alt: string };

export type CaseStudy = {
  slug: string;
  name: string;
  type: "case-study";
  published?: boolean;
  order?: number;
  role: string;
  company: string;
  company_url?: string;
  period: string;
  start_date: string;
  end_date: string | null;
  location?: string;
  accent: "primary" | "secondary" | "tertiary";
  hero_variant: "cover" | "text-only";
  image_layout: "strip" | "grid";
  cover: string;
  images: Image[];
  outcome: string;
  tags: string[];
  links: Link[];
  body: { context: string; whatIDid: string; outcome: string };
};

export type Experience = {
  slug: string;
  name: string;
  type: "experience";
  published?: boolean;
  order?: number;
  meta: string;
  outcome: string;
  tags: string[];
  links: Link[];
  images?: Image[];
  accent: "primary" | "secondary" | "tertiary";
};

const REQUIRED_CASE_STUDY_FIELDS = [
  "slug", "name", "role", "company", "period", "start_date",
  "accent", "hero_variant", "image_layout", "cover", "outcome", "tags",
] as const;

const REQUIRED_EXPERIENCE_FIELDS = [
  "slug", "name", "meta", "outcome", "tags", "accent",
] as const;

function assertRequired(filename: string, data: Record<string, unknown>, fields: readonly string[]): void {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`${filename}: required frontmatter field "${field}" is missing`);
    }
  }
}

function extractBodySection(body: string, header: string): string {
  const re = new RegExp(`^##\\s+${header}\\s*\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`, "m");
  const m = body.match(re);
  if (!m) throw new Error(`Body section "## ${header}" not found`);
  return m[1].trim();
}

async function loadCaseStudies(dir: string): Promise<CaseStudy[]> {
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  const items: CaseStudy[] = [];
  for (const f of files) {
    const raw = await readFile(join(dir, f), "utf-8");
    const { data, content } = matter(raw);

    assertRequired(f, data, REQUIRED_CASE_STUDY_FIELDS);

    let context: string, whatIDid: string, outcomeBody: string;
    try {
      context = extractBodySection(content, "Context");
      whatIDid = extractBodySection(content, "What I did");
      outcomeBody = extractBodySection(content, "Outcome");
    } catch (e) {
      throw new Error(`${f}: ${(e as Error).message}`);
    }

    items.push({
      ...(data as Omit<CaseStudy, "type" | "body">),
      type: "case-study",
      body: { context, whatIDid, outcome: outcomeBody },
    });
  }

  return sortItems(items.filter((i) => i.published !== false));
}

async function loadExperiences(dir: string): Promise<Experience[]> {
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  const items: Experience[] = [];
  for (const f of files) {
    const raw = await readFile(join(dir, f), "utf-8");
    const { data } = matter(raw);
    assertRequired(f, data, REQUIRED_EXPERIENCE_FIELDS);
    items.push({
      ...(data as Omit<Experience, "type">),
      type: "experience",
    });
  }

  return sortItems(items.filter((i) => i.published !== false));
}

function sortItems<T extends { order?: number; start_date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return (b.start_date ?? "").localeCompare(a.start_date ?? "");
  });
}

const CONTENT_ROOT = join(process.cwd(), "content");

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return loadCaseStudies(join(CONTENT_ROOT, "projects"));
}

export async function getExperiences(): Promise<Experience[]> {
  return loadExperiences(join(CONTENT_ROOT, "experiences"));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await getCaseStudies();
  return all.find((c) => c.slug === slug) ?? null;
}

export const _testInternals = { loadCaseStudies, loadExperiences };
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all 8 tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(content): md loader with gray-matter, validation, sort"
```

---

### Task 19: Author content MDs

**Files:**
- Create: `content/projects/shippit.md`, `content/projects/notus.md`, `content/projects/heimdall.md`
- Create: `content/experiences/avalanche-innovation-house.md`, `content/experiences/best-layerzero.md`, `content/experiences/1st-aurora.md`, `content/experiences/cursor-coffee.md`

(Engineer note: these MDs hold real content. Stage 5 authors deeper case-study body text — for now, write minimally valid bodies that pass validation. Outcome strings can match the Stage 3 placeholders.)

- [ ] **Step 1: Create content/projects/shippit.md**

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
hero_variant: cover
image_layout: strip
cover: /images/projects/shippit/cover.png
images:
  - { src: /images/projects/shippit/cover.png, alt: Shippit dashboard }
outcome: Built front-end for an agentic AI platform. Authored AI rules, refactored the codebase, established a design system that scales with the product.
tags: [design-system, react, ai-rules, typescript, refactoring]
links:
  - { label: "Live site", href: "https://shippit.com", external: true }
  - { label: "LinkedIn role", href: "https://linkedin.com/in/julia-hoffmann-/", external: true }
---
## Context
Placeholder. Stage 5 authors ~80 words on the company stage and problem space.

## What I did
Placeholder. Stage 5 authors ~80 words on the actual work.

## Outcome
Placeholder. Stage 5 authors ~80 words on what shipped and impact.
```

- [ ] **Step 2: Create content/projects/notus.md**

```yaml
---
slug: notus
name: Notus / Chainless
type: case-study
published: true
order: 2
role: Cofounder · Product & Design
company: Notus
company_url: https://notus.team
period: 2023 — 2024
start_date: 2023-01
end_date: 2024-09
location: São Paulo
accent: secondary
hero_variant: cover
image_layout: strip
cover: /images/projects/notus/cover.png
images:
  - { src: /images/projects/notus/cover.png, alt: Chainless app }
outcome: Cofounded Notus and led product + design for Chainless, a Brazilian crypto fintech. Designed KYC and transaction UX. Launched at Blockchain Rio. Managed the design team.
tags: [product, fintech, crypto, leadership, kyc]
links:
  - { label: "About Notus", href: "https://notus.team", external: true }
---
## Context
Placeholder. Stage 5 (Task 27) authors ~80 words on the founding stage and Brazilian crypto landscape.

## What I did
Placeholder. Stage 5 authors ~80 words on KYC, transactions, leadership, the launch.

## Outcome
Placeholder. Stage 5 authors ~80 words on launch metrics, recognition, and what's still active.
```

- [ ] **Step 3: Create content/projects/heimdall.md**

```yaml
---
slug: heimdall
name: Heimdall
type: case-study
published: true
order: 3
role: Solo Designer
company: Heimdall
period: 2022
start_date: 2022-01
end_date: 2022-12
location: Remote
accent: secondary
hero_variant: cover
image_layout: strip
cover: /images/projects/heimdall/cover.png
images:
  - { src: /images/projects/heimdall/cover.png, alt: Heimdall design system }
outcome: Sole designer for a crypto data platform. Built a complete design system in Figma — typography, color, components — aligned with Tailwind for dev handoff.
tags: [design-system, figma, tailwind, data-viz, crypto]
links: []
---
## Context
Placeholder. Stage 5 authors ~80 words on the project and the data-viz problem space.

## What I did
Placeholder. Stage 5 authors ~80 words on the design system: tokens, components, Figma → Tailwind handoff.

## Outcome
Placeholder. Stage 5 authors ~80 words on what shipped and where the system is used now.
```

- [ ] **Step 4: Create the 4 experience MDs**

`content/experiences/avalanche-innovation-house.md`:

```yaml
---
slug: avalanche-innovation-house
name: Avalanche Innovation House
type: experience
published: true
order: 1
meta: "Builder Residency · Buenos Aires · 2024"
outcome: Three-month builder residency program. Post-Chainless launch incubation. Built and shipped alongside the global Avalanche builder cohort.
tags: [residency, crypto, product, latam]
links:
  - { label: "Program info", href: "https://avalanche.com/innovation-house", external: true }
images:
  - { src: /images/experiences/avalanche-ih.png, alt: Innovation House mural }
accent: tertiary
---
```

`content/experiences/best-layerzero.md`:

```yaml
---
slug: best-layerzero
name: Best LayerZero
type: experience
published: true
order: 2
meta: "Hackathon Win · 2023"
outcome: Won Best LayerZero project at ETHGlobal hackathon for cross-chain UX work.
tags: [hackathon, cross-chain, recognition]
links: []
images: []
accent: tertiary
---
```

`content/experiences/1st-aurora.md`:

```yaml
---
slug: 1st-aurora
name: 1st Place Aurora
type: experience
published: true
order: 3
meta: "Hackathon Win · 2022"
outcome: First place at Aurora-sponsored hackathon for an onchain rental product.
tags: [hackathon, near, recognition]
links: []
images: []
accent: tertiary
---
```

`content/experiences/cursor-coffee.md`:

```yaml
---
slug: cursor-coffee
name: Cursor Coffee
type: experience
published: true
order: 4
meta: "Speaker · 2025"
outcome: Spoke about agentic IDE design at the Cursor Coffee community event.
tags: [speaking, ai-tools, community]
links: []
images: []
accent: tertiary
---
```

- [ ] **Step 5: Run tests against real content**

Add to `lib/content.test.ts` a smoke test that loads the real content:

```ts
describe("real content loads", () => {
  it("getCaseStudies parses 3 case studies", async () => {
    const { getCaseStudies } = await import("@/lib/content");
    const cs = await getCaseStudies();
    expect(cs.length).toBe(3);
    expect(cs.map((c) => c.slug).sort()).toEqual(["heimdall", "notus", "shippit"]);
  });

  it("getExperiences parses 4 experiences", async () => {
    const { getExperiences } = await import("@/lib/content");
    const ex = await getExperiences();
    expect(ex.length).toBe(4);
  });
});
```

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "content: 3 case studies + 4 experiences (placeholder bodies)"
```

---

### Task 20: Wire loader into home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace hardcoded arrays with loader calls**

```tsx
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { WorkRow } from "@/components/work-row";
import { WorkList } from "@/components/work-list";
import { activeProjects } from "@/content/active-projects";
import { getCaseStudies, getExperiences } from "@/lib/content";

export default async function Home() {
  const caseStudies = await getCaseStudies();
  const experiences = await getExperiences();

  return (
    <main>
      <Hero />

      <section id="projects" className="border-b border-border py-24">
        <SectionHeader title="Projects" accent="primary" />
        <div className="mx-auto grid max-w-5xl gap-6 px-8 md:grid-cols-2">
          {activeProjects.map((p) => (
            <ProjectCardActive key={p.name} project={p} />
          ))}
        </div>
      </section>

      <section id="selected-work" className="border-b border-border py-24">
        <SectionHeader title="Selected Work" accent="secondary" />
        <WorkList>
          {caseStudies.map((c) => (
            <WorkRow
              key={c.slug}
              item={{
                slug: c.slug,
                name: c.name,
                meta: `${c.role} · ${c.period}`,
                cover: { src: c.cover, alt: `${c.name} cover` },
                outcome: c.outcome,
                tags: c.tags,
                links: c.links.slice(0, 1),
              }}
              variant="case-study"
              accent="secondary"
            />
          ))}
        </WorkList>
      </section>

      <section id="experiences" className="border-b border-border py-24">
        <SectionHeader title="Experiences" accent="tertiary" />
        <WorkList>
          {experiences.map((e) => (
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
              }}
              variant="experience"
              accent="tertiary"
            />
          ))}
        </WorkList>
      </section>

      <Manifesto />
      <TerminalInstall />
    </main>
  );
}
```

- [ ] **Step 2: Verify static export still works**

Run: `npm run build`
Expected: builds without errors. `out/index.html` exists.

- [ ] **Step 3: Verify content removal flow**

Edit `content/projects/heimdall.md` and set `published: false`. Run `npm run dev`. Heimdall row should disappear from home. Restore `published: true` and confirm it returns.

- [ ] **Step 4: Verify content addition flow**

Create a 5th experience MD `content/experiences/test.md` with all required fields and `published: true`. Run `npm run dev`. The Experiences section should now show 5 rows. Delete the test MD before committing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(home): wire md loader into selected work + experiences"
```

---

## Stage 5 — Deep pages (~4 hr, 7 tasks)

Build the case-study deep page and author the actual content.

### Task 21: Build CaseStudyHero

**Files:**
- Create: `components/case-study-hero.tsx`

- [ ] **Step 1: Create components/case-study-hero.tsx**

```tsx
import Image from "next/image";

type Accent = "primary" | "secondary" | "tertiary";

const accent: Record<Accent, string> = {
  primary: "border-primary bg-primary",
  secondary: "border-secondary bg-secondary",
  tertiary: "border-tertiary bg-tertiary",
};

export function CaseStudyHero(props: {
  cover: string;
  name: string;
  role: string;
  period: string;
  company: string;
  location?: string;
  accent: Accent;
}) {
  return (
    <header className="border-b border-border">
      <div className="relative aspect-[16/9] w-full bg-surface">
        <Image src={props.cover} alt={`${props.name} cover`} fill className="object-cover" priority />
      </div>
      <div className="mx-auto max-w-5xl px-8 py-12">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">{props.name}</h1>
        <div className={`mt-4 h-0.5 w-16 ${accent[props.accent].replace("border-", "bg-").split(" ")[0]}`} />
        <p className="mt-6 font-mono text-sm uppercase tracking-wider text-muted">
          {props.role} · {props.company} · {props.period}
          {props.location && ` · ${props.location}`}
        </p>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(case-study): hero component"
```

---

### Task 22: Build ContentBlock

**Files:**
- Create: `components/content-block.tsx`

- [ ] **Step 1: Create components/content-block.tsx**

```tsx
export function ContentBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-8 py-10 md:grid-cols-[200px_1fr]">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="prose prose-invert max-w-none text-lg leading-relaxed">{children}</div>
    </section>
  );
}
```

(The prose styling can be plain — Tailwind v4 doesn't include the typography plugin by default. If `prose` classes don't render, replace with explicit text styles.)

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(case-study): content block component"
```

---

### Task 23: Build ImageStrip

**Files:**
- Create: `components/image-strip.tsx`

- [ ] **Step 1: Create components/image-strip.tsx**

```tsx
import Image from "next/image";
import type { Image as ImgT } from "@/lib/content";

export function ImageStrip({ images }: { images: ImgT[] }) {
  if (images.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-8 py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-video overflow-hidden border border-border bg-surface">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(case-study): image strip component"
```

---

### Task 24: Build TagList + LinkList

**Files:**
- Create: `components/tag-list.tsx`, `components/link-list.tsx`

- [ ] **Step 1: Create components/tag-list.tsx**

```tsx
type Accent = "primary" | "secondary" | "tertiary";

const accent: Record<Accent, string> = {
  primary: "border-primary/30 text-primary",
  secondary: "border-secondary/30 text-secondary",
  tertiary: "border-tertiary/30 text-tertiary",
};

export function TagList({ tags, accent: a }: { tags: string[]; accent: Accent }) {
  return (
    <section className="mx-auto max-w-5xl px-8 py-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={`border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${accent[a]}`}>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create components/link-list.tsx**

```tsx
import type { Link } from "@/lib/content";

export function LinkList({ links }: { links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-8 py-6">
      <ul className="flex flex-wrap gap-4">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-fg hover:border-secondary hover:text-secondary"
            >
              {l.label} →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(case-study): tag list + link list components"
```

---

### Task 25: Build PrevNextNav

**Files:**
- Create: `components/prev-next-nav.tsx`

- [ ] **Step 1: Create components/prev-next-nav.tsx**

```tsx
import Link from "next/link";

type Item = { slug: string; name: string };

export function PrevNextNav({ prev, next }: { prev: Item; next: Item }) {
  return (
    <nav className="mx-auto grid max-w-5xl grid-cols-2 gap-6 border-t border-border px-8 py-12">
      <Link href={`/projects/${prev.slug}/`} className="group block">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">◂ Previous case study</p>
        <p className="mt-2 text-2xl font-medium group-hover:text-secondary">{prev.name}</p>
      </Link>
      <Link href={`/projects/${next.slug}/`} className="group block text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Next case study ▸</p>
        <p className="mt-2 text-2xl font-medium group-hover:text-secondary">{next.name}</p>
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(case-study): prev/next nav"
```

---

### Task 26: Compose dynamic route /projects/[slug]

**Files:**
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the dynamic route**

```tsx
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/case-study-hero";
import { ContentBlock } from "@/components/content-block";
import { ImageStrip } from "@/components/image-strip";
import { TagList } from "@/components/tag-list";
import { LinkList } from "@/components/link-list";
import { PrevNextNav } from "@/components/prev-next-nav";
import { getCaseStudies, getCaseStudy } from "@/lib/content";

export async function generateStaticParams() {
  const all = await getCaseStudies();
  return all.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `${c.name} · ${c.role} · jubs.studio`,
    description: c.outcome,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getCaseStudies();
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const c = all[idx];
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  return (
    <article>
      <CaseStudyHero
        cover={c.cover}
        name={c.name}
        role={c.role}
        period={c.period}
        company={c.company}
        location={c.location}
        accent={c.accent}
      />
      <ContentBlock label="Context"><p>{c.body.context}</p></ContentBlock>
      <ContentBlock label="What I did"><p>{c.body.whatIDid}</p></ContentBlock>
      <ContentBlock label="Outcome"><p>{c.body.outcome}</p></ContentBlock>
      <ImageStrip images={c.images} />
      <TagList tags={c.tags} accent={c.accent} />
      <LinkList links={c.links} />
      <PrevNextNav prev={{ slug: prev.slug, name: prev.name }} next={{ slug: next.slug, name: next.name }} />
    </article>
  );
}
```

- [ ] **Step 2: Verify build produces 3 case study pages**

Run: `npm run build`
Expected: builds without errors. Verify `out/projects/shippit/index.html`, `out/projects/notus/index.html`, `out/projects/heimdall/index.html` all exist.

- [ ] **Step 3: Verify dev server renders deep page**

Run: `npm run dev`. Visit `localhost:3000/projects/shippit/`. Expected: hero with cover image, three content blocks, image strip, tag list, link list, prev/next nav. Click prev → navigates to heimdall. Click next from there → back to shippit (cycle).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(case-study): dynamic /projects/[slug] route"
```

---

### Task 27: Author real case study content

**Files:**
- Modify: `content/projects/shippit.md`, `content/projects/notus.md`, `content/projects/heimdall.md`

For each case study, replace the placeholder bodies with ~80-word actual content. Reference: `~/Mugen/career/experiences/` has factual source material; rewrite for hiring-manager scan.

- [ ] **Step 1: Author Shippit body**

Replace the three sections in `content/projects/shippit.md` with real content. Engineer: read `~/Mugen/career/experiences/shippit*.md` (if exists) for factual inputs. Write ~80 words each:

- **Context:** company stage, problem space, why DE work
- **What I did:** the actual work (AI rules, refactor, design system)
- **Outcome:** what shipped, what scaled, what's still active

- [ ] **Step 2: Author Notus / Chainless body**

Same pattern for `content/projects/notus.md`. Reference Mugen sources for KYC/transactions/Blockchain Rio launch facts.

- [ ] **Step 3: Author Heimdall body**

Same for `content/projects/heimdall.md`. Reference Mugen sources for design system / Figma → Tailwind handoff.

- [ ] **Step 4: Drop real cover + screenshots**

Copy real images from `~/Mugen/career/experiences/images/` into `public/images/projects/{shippit,notus,heimdall}/`. Update each MD's `images:` array to list the real files (3–5 per project).

- [ ] **Step 5: Re-run build, verify pages render with real content**

Run: `npm run build && npm run preview`
Visit `localhost:8000/projects/shippit/` etc. Confirm: real images, real copy, image strip shows 3–5 screenshots.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "content: author real case study bodies + drop screenshots"
```

---

## Stage 6 — SEO + AI signals (~1 hr, 1 task)

### Task 28: Update sitemap, llms.txt, JSON-LD

**Files:**
- Modify: `public/sitemap.xml`, `public/llms.txt`
- Modify: `app/layout.tsx` (add JSON-LD)

- [ ] **Step 1: Regenerate sitemap.xml**

Replace `public/sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jubs.studio/</loc></url>
  <url><loc>https://jubs.studio/projects/shippit/</loc></url>
  <url><loc>https://jubs.studio/projects/notus/</loc></url>
  <url><loc>https://jubs.studio/projects/heimdall/</loc></url>
</urlset>
```

- [ ] **Step 2: Update llms.txt with case study summaries**

Append to `public/llms.txt`:

```
## Selected work

### Shippit (2025–present, Design Engineer)
{copy outcome from content/projects/shippit.md}
URL: https://jubs.studio/projects/shippit/

### Notus / Chainless (2023, Cofounder)
{copy outcome from content/projects/notus.md}
URL: https://jubs.studio/projects/notus/

### Heimdall (2022, Solo Designer)
{copy outcome from content/projects/heimdall.md}
URL: https://jubs.studio/projects/heimdall/
```

- [ ] **Step 3: Move JSON-LD into app/layout.tsx**

Read existing JSON-LD from git history (`git show 0a32ab3:index.html | grep -A 50 application/ld+json`). Port the Person + Organization + SoftwareApplication blocks into `app/layout.tsx` as a `<script type="application/ld+json">` tag. Expand `Person.knowsAbout` with case-study-relevant terms (e.g., "Design systems", "Agentic UX", "Crypto KYC", "Data visualization").

```tsx
// inside RootLayout, before </body> or in <head>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        // Person, Organization, SoftwareApplication entries (port from existing index.html)
      ],
    }),
  }}
/>
```

- [ ] **Step 4: Verify build produces correct files**

Run: `npm run build`
Verify `out/sitemap.xml`, `out/llms.txt`, and `out/index.html` (JSON-LD inline).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(seo): expand sitemap, llms.txt, json-ld for case studies"
```

---

## Stage 7 — Deploy cutover (~30 min, 2 tasks)

### Task 29: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: cp CNAME out/CNAME
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Test workflow locally before pushing**

Run: `npm ci && npm test && npm run build && cp CNAME out/CNAME && ls out/`
Expected: `out/CNAME`, `out/index.html`, `out/projects/{shippit,notus,heimdall}/index.html` all present.

- [ ] **Step 3: Commit workflow**

```bash
git add -A
git commit -m "ci: github actions workflow for static export deploy"
```

---

### Task 30: Cutover

**Files:**
- Modify: GitHub repo settings (manual step)

- [ ] **Step 1: Push feature branch and open PR**

```bash
git push origin feature/portfolio-area
gh pr create --title "Portfolio area: 3 case studies + 4 experiences (Next.js migration)" --body "$(cat <<'EOF'
## Summary
- Migrate jubs.studio from single index.html to Next.js 16 + Tailwind v4 + shadcn (static export)
- Add Selected Work section (3 case studies with deep pages: Shippit, Notus, Heimdall)
- Add Experiences section (4 self-contained: Avalanche IH, Best LayerZero, 1st Aurora, Cursor Coffee)
- GitHub Actions deploy replacing branch-based GH Pages serving
- Visual parity with current site preserved (CypherCN aesthetic stays scoped to its preview card)

Spec: docs/superpowers/specs/2026-04-29-portfolio-area-design.md
Plan: docs/superpowers/plans/2026-04-29-portfolio-area.md

## Test plan
- [ ] Visual parity: side-by-side with live jubs.studio
- [ ] Hover-expand works on rows (mouse + keyboard tab)
- [ ] Mobile (≤720px) renders rows pre-expanded
- [ ] /projects/{shippit,notus,heimdall} all render
- [ ] Prev/next nav cycles
- [ ] Build artifact contains correct sitemap.xml, llms.txt, CNAME
- [ ] Lighthouse Performance/A11y/Best Practices/SEO ≥95

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Merge PR after CI passes**

Manual: review the GH Actions build artifact via the workflow run; verify `out/` contents look correct. Merge PR.

- [ ] **Step 3: Switch GH Pages source**

Manual: in GitHub repo Settings → Pages, change "Build and deployment" source from **Deploy from a branch** to **GitHub Actions**.

- [ ] **Step 4: Trigger production deploy**

The merge to `main` already triggers the workflow. Watch it complete in Actions tab.

- [ ] **Step 5: Verify production**

```bash
curl -I https://jubs.studio
curl -I https://jubs.studio/projects/shippit/
curl https://jubs.studio/sitemap.xml
```
Expected: all return 200, sitemap lists 4 URLs.

Run Lighthouse on `https://jubs.studio` and `https://jubs.studio/projects/heimdall/`. Expected: Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95.

- [ ] **Step 6: Rollback path (if production breaks)**

If the deployed site is broken: in GitHub repo Settings → Pages, switch source back to **Deploy from a branch: main / (root)**. The legacy `index.html` is gone (deleted in Task 11), so for true rollback you'd revert the merge commit — which restores `index.html` and the site comes back instantly when GH Pages republishes from main.

A safer pre-merge alternative: keep a `pre-portfolio-snapshot` tag on the commit just before this PR's merge, so `git revert` is clean if needed.

---

## Verification matrix (post-deploy)

| Check | How | Pass criteria |
|---|---|---|
| Visual parity | Side-by-side screenshot vs pre-migration screenshots | No regressions in nav/hero/projects/manifesto/install/footer |
| Hover-expand desktop | Mouse hover on each WorkRow | Arrow rotates, body slides open in ~300ms, accent tint at 5% |
| Hover-expand keyboard | Tab through rows | Focus visible, expand triggers on focus-within |
| Mobile responsive | Devtools 320 / 375 / 720px | No overflow, rows always-expanded ≤720px |
| MD-driven content | Toggle `published: false` on a case study | Item disappears |
| Adding new MD | Drop new experience MD with valid frontmatter | Appears on home without code change |
| Deep pages route | Visit `/projects/heimdall/` | Loads, prev/next cycles, image strip renders |
| Static export integrity | `find out -name index.html` | Every page has its index.html |
| Build fails on bad content | Remove a required frontmatter field | Build errors clearly, no deploy |
| Accessibility | Tab through home, run axe-core | Focus visible, no axe violations |
| Lighthouse | DevTools | Performance/A11y/Best Practices/SEO ≥95 |
| AI/SEO signals | View source on home + project page | JSON-LD valid, llms.txt has case study summaries, sitemap has 4 URLs |
| CypherCN scope | Inspect Selected Work / Experiences sections | No CRT scanlines, no terminal-style borders bleeding in |

---

## Summary

**Stages:** 7 · **Tasks:** 30 · **Estimate:** ~13 hours focused work, 2-3 working sessions over a week.

**Rollback:** Live site untouched until Task 30 Step 3 (GH Pages source switch). Stages 1–6 are entirely on `feature/portfolio-area`. If anything goes wrong post-cutover, switch GH Pages source back to branch and revert the merge commit.

**Deferred to v1.1:** Real CypherCN component imports inside `components/active-projects/cyphercn-preview.tsx` only.
