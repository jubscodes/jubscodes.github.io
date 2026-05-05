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
