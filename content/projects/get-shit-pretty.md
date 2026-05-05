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
outcome: "Design engineering system for AI coding tools. Brings research, brand, design systems, and critique into the terminal, shipped as a zero-dependency npm package across Claude Code, OpenCode, Gemini, and Codex."
tags: [npm-package, design-engineering, ai-tooling, personal-project]
links:
  - { label: "GitHub", href: "https://github.com/jubscodes/get-shit-pretty", external: true }
  - { label: "npm", href: "https://www.npmjs.com/package/get-shit-pretty", external: true }
  - { label: "gsp.jubs.studio", href: "https://gsp.jubs.studio", external: true }
---
## Context

Vibe coding is everywhere, and most of it looks the same.

Same shadcn components. Same layouts. The "looks like AI made it" genre. AI coding tools are powerful builders with zero design process.

The gap between design and code is shrinking, but only from one direction. Figma is learning to speak code: Code Connect, Dev Mode, MCP servers. Coding tools aren't learning to speak design.

GSP is the missing half of that bridge. Research, brand, design systems, UI patterns, accessibility, and critique, packaged as skills your AI coding tool can run. Brief to build, in your terminal.

## What I did

End to end, solo. Architecture, skill system, 12 agents, multi-runtime installer, marketing site, npm package.

Opinionated by design: a dual-diamond pipeline, two skill layers, four runtimes from one source.

## Outcome

Live at gsp.jubs.studio. Published on npm as `get-shit-pretty`. 35 skills, 12 agents, 35 design style presets.

Presented at Ipê City in April 2026 under the Shippit brand: a design engineering workshop with GSP as the teaching vehicle.

Still iterating. Style presets, brand pipeline, and project pipeline are all in production. Some skills (`project-build`, `project-critique`) keep getting refined as I run them on real work.

## Deep Dive

### Architecture: dual-diamond

Two complete design cycles. Run them independently or together.

- **Diamond 1, Branding:** brief → research → strategy → identity → guidelines.
- **Diamond 2, Project:** brief → research → design → critique → build → review.

Branding first when you're starting fresh. Project loop when the brand is set. Each phase writes structured artifacts to `.design/` so the next phase has real input, not a re-prompt.

### Two skill layers, one rule

Pipeline skills never duplicate domain knowledge. When `project-design` needs typography rules, it reads `gsp-typography`'s sibling files. Cross-skill references use relative paths, so each skill stays self-contained and portable across runtimes.

Why split it this way? So you can invoke an expertise skill on its own (e.g. `gsp-color` to generate a palette) without booting the whole pipeline. And so pipeline skills don't bloat with knowledge they only loosely consume.

### Multi-runtime installer

`bin/install.js` reads source from `gsp/skills/` and writes runtime-specific layouts:

| Runtime | Skills | Agents |
|---|---|---|
| Claude Code | `.claude/skills/` | `.claude/agents/` (12) |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` (12) |
| Gemini CLI | `.gemini/skills/` | `.gemini/agents/` (11, experimental) |
| Codex CLI | `.agents/skills/` | None (not supported) |

Skills are the single source. Tool names get mapped per runtime: `Bash` becomes `shell` for Codex, `run_shell_command` for Gemini. Invocation syntax gets rewritten too: `/gsp-` becomes `$gsp-` for Codex. One pack, four targets.

### What it teaches AI agents

The bet: encode design knowledge so AI agents enforce it automatically.

- Components as a system, not just code.
- Tokens as data.
- Critique as a step.
- Accessibility as a gate.

It's the same pattern I built into [Shippit](/projects/shippit/)'s design system rules and into client codebases (BWB Tokenization, Sherry Chat, Learn to Fly). GSP is that pattern packaged: installable, opinionated, pipeline-shaped.

### Where it's running

- **[Shippit](/projects/shippit/):** the current shippit.app website was built with GSP. Earlier client work (BWB Tokenization, Founderhaus Base, Learn to Fly) used the precursor pattern that GSP eventually packaged, not GSP itself.
- **[Chainless](/projects/chainless/):** Kevin (Chainless CEO) built the new chainless.finance website with GSP himself. First third-party shipping it end to end.
- **This site, jubs.studio:** the portfolio you're reading was built with GSP. Brand pipeline for tokens and tone, project pipeline for components and pages.
