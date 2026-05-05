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

Vibe coding is everywhere. New products keep showing up looking exactly like every other one: same shadcn components, same layouts, same sea of sameness. AI coding tools are powerful builders with zero design process.

The gap between design and code is shrinking, but only from one direction. Figma is learning to speak code (Code Connect, Dev Mode, MCP servers). Coding tools aren't learning to speak design.

GSP is the missing half of that bridge. A design engineering system that brings research, brand, design systems, UI patterns, accessibility, and critique into the tools developers already use. Brief to build, in your terminal.

## What I did

Designed and built GSP end to end: architecture, skill system, agents, installer, marketing site, npm package.

Two complete design cycles in one pipeline. Diamond 1 (Branding): brief, research, strategy, identity, guidelines. Diamond 2 (Project): brief, research, design, critique, build, review. Artifacts land in `.design/`, state recovers across sessions. `/gsp-start` picks up wherever you left off.

The system runs on two skill layers. Expertise skills own domain knowledge (color, typography, visuals, accessibility, style). Pipeline skills orchestrate workflow: they read or invoke expertise skills, never duplicate the knowledge. The filesystem is the integration layer; agents consume artifacts from disk.

Ships as a zero-dependency npm package. The installer translates Claude Code's native skill format into each runtime's expected layout. Same source, four runtimes: Claude Code, OpenCode, Gemini CLI, Codex CLI.

## Outcome

Live at gsp.jubs.studio. Published on npm as `get-shit-pretty`. 35 skills, 12 agents, 35 design style presets.

Presented at Ipê City in April 2026 under the Shippit brand: a design engineering workshop using GSP as the teaching vehicle for builders.

Still iterating. Style presets, brand pipeline, and project pipeline all in production; some skills (`project-build`, `project-critique`) keep getting refined as I run them on real work.

## Deep Dive

### Architecture: dual-diamond

Two complete design cycles you can run independently or together. Branding first if you're starting from scratch. Project loop if the brand is set. Each phase produces artifacts in `.design/` so the next phase has structured input rather than a fresh prompt.

### Two skill layers

- **Expertise skills** are knowledge owners. `gsp-color` owns OKLCH palette generation, `gsp-typography` owns scale and pairing, `gsp-visuals` owns imagery direction, `gsp-accessibility` owns WCAG checks, `gsp-style` owns 35 design-style presets.
- **Pipeline skills** are orchestrators. They handle state, phase gates, agent spawning, user interaction. They consume expertise skills via reads or explicit invocations.

The rule: pipeline skills never duplicate domain knowledge. When `project-design` needs typography rules, it reads from `gsp-typography`'s sibling files. Cross-skill references use relative paths so each skill stays self-contained.

### Multi-runtime installer

`bin/install.js` reads source from `gsp/skills/` and writes runtime-specific layouts:

| Runtime | Skills | Agents |
|---|---|---|
| Claude Code | `.claude/skills/` | `.claude/agents/` (12) |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` (12) |
| Gemini CLI | `.gemini/skills/` | `.gemini/agents/` (11, experimental) |
| Codex CLI | `.agents/skills/` | None (not supported) |

Skills are the single source. Tool names get mapped per runtime (`Bash` becomes `shell` for Codex, `run_shell_command` for Gemini). Invocation syntax gets rewritten too (`/gsp-` becomes `$gsp-` for Codex). One pack, four targets.

### What it teaches AI agents

The bet: encode design knowledge so AI agents enforce it automatically. Components as a system, not just code. Tokens as data. Critique as a step. Accessibility as a gate.

It's the same pattern I built into Shippit's design system rules and into client codebases (BWB Tokenization, Sherry Chat, Learn to Fly). GSP is that pattern packaged: installable, opinionated, pipeline-shaped.
