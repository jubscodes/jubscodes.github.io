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
