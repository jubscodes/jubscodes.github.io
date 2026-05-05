import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CaseStudyHero } from "@/components/case-study-hero";
import { ContentBlock } from "@/components/content-block";
import { ImageStrip } from "@/components/image-strip";
import { TagList } from "@/components/tag-list";
import { LinkList } from "@/components/link-list";
import { PrevNextNav } from "@/components/prev-next-nav";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { caseStudyBreadcrumb } from "@/lib/structured-data";

const mdComponents = {
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-10 mb-3 text-xl font-semibold tracking-tight">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mt-6 mb-2 text-base font-semibold">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed text-fg">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 list-disc space-y-2 pl-5">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-5">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed text-fg">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-fg">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-secondary transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:underline"
    >
      {children}
    </a>
  ),
};

const SITE_URL = "https://jubs.studio";

export async function generateStaticParams() {
  const all = await getCaseStudies();
  return all.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return { title: "Not found" };
  const url = `${SITE_URL}/projects/${c.slug}/`;
  const title = `${c.name} · ${c.role} · jubs.studio`;
  const ogTitle = `${c.name} — ${c.role}`;
  return {
    title,
    description: c.outcome,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "jubs.studio",
      title: ogTitle,
      description: c.outcome,
      images: [{ url: c.cover, width: 1200, height: 630, alt: `${c.name} cover` }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hoffz_eth",
      creator: "@hoffz_eth",
      title: ogTitle,
      description: c.outcome,
      images: [c.cover],
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(caseStudyBreadcrumb(c.slug, c.name)),
        }}
      />
      <CaseStudyHero
        cover={c.cover}
        name={c.name}
        role={c.role}
        period={c.period}
        company={c.company}
        location={c.location}
        accent={c.accent}
        customHero={c.customHero}
      />
      <LinkList links={c.links} accent={c.accent} />
      <TagList tags={c.tags} accent={c.accent} />
      <ContentBlock label="Context"><p>{c.body.context}</p></ContentBlock>
      <ContentBlock label="What I did"><p>{c.body.whatIDid}</p></ContentBlock>
      <ContentBlock label="Outcome"><p>{c.body.outcome}</p></ContentBlock>
      {c.body.deepDive && (
        <ContentBlock label="Deep Dive">
          <ReactMarkdown components={mdComponents}>{c.body.deepDive}</ReactMarkdown>
        </ContentBlock>
      )}
      <ImageStrip images={c.images} />
      <PrevNextNav prev={{ slug: prev.slug, name: prev.name }} next={{ slug: next.slug, name: next.name }} accent={c.accent} />
    </article>
  );
}
