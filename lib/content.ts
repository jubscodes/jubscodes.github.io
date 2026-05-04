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
  body: { context: string; whatIDid: string; outcome: string; deepDive?: string };
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
  "slug",
  "name",
  "role",
  "company",
  "period",
  "start_date",
  "accent",
  "hero_variant",
  "image_layout",
  "cover",
  "outcome",
  "tags",
] as const;

const REQUIRED_EXPERIENCE_FIELDS = [
  "slug",
  "name",
  "meta",
  "outcome",
  "tags",
  "accent",
] as const;

function assertRequired(
  filename: string,
  data: Record<string, unknown>,
  fields: readonly string[],
): void {
  for (const field of fields) {
    const v = data[field];
    if (v === undefined || v === null || v === "") {
      throw new Error(
        `${filename}: required frontmatter field "${field}" is missing`,
      );
    }
  }
}

function extractBodySection(body: string, header: string): string {
  // Match `## <header>` to either next `## ` or end of string.
  // JS has no \Z, so we use $(?![\s\S]) to anchor to end-of-input.
  const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+|$(?![\\s\\S]))`,
    "m",
  );
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
    let deepDive: string | undefined;
    try {
      context = extractBodySection(content, "Context");
      whatIDid = extractBodySection(content, "What I did");
      outcomeBody = extractBodySection(content, "Outcome");
    } catch (e) {
      throw new Error(`${f}: ${(e as Error).message}`);
    }
    try {
      deepDive = extractBodySection(content, "Deep Dive");
    } catch {
      deepDive = undefined;
    }

    items.push({
      ...(data as Omit<CaseStudy, "type" | "body">),
      type: "case-study",
      body: { context, whatIDid, outcome: outcomeBody, deepDive },
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

function sortItems<T extends { order?: number; start_date?: string }>(
  items: T[],
): T[] {
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
