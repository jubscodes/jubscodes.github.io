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

describe("real content loads", () => {
  it("getCaseStudies parses 4 case studies", async () => {
    const { getCaseStudies } = await import("@/lib/content");
    const cs = await getCaseStudies();
    expect(cs.length).toBe(4);
    expect(cs.map((c) => c.slug).sort()).toEqual(["chainless", "heimdall", "luxy", "shippit"]);
  });

  it("getExperiences parses 4 experiences", async () => {
    const { getExperiences } = await import("@/lib/content");
    const ex = await getExperiences();
    expect(ex.length).toBe(4);
  });
});
