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
      <LinkList links={c.links} accent={c.accent} />
      <TagList tags={c.tags} accent={c.accent} />
      <ContentBlock label="Context"><p>{c.body.context}</p></ContentBlock>
      <ContentBlock label="What I did"><p>{c.body.whatIDid}</p></ContentBlock>
      <ContentBlock label="Outcome"><p>{c.body.outcome}</p></ContentBlock>
      <ImageStrip images={c.images} />
      <PrevNextNav prev={{ slug: prev.slug, name: prev.name }} next={{ slug: next.slug, name: next.name }} accent={c.accent} />
    </article>
  );
}
