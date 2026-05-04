import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { SectionDivider } from "@/components/section-divider";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { WorkRow } from "@/components/work-row";
import { WorkList } from "@/components/work-list";
import { activeProjects } from "@/content/active-projects";
import { getCaseStudies, getExperiences } from "@/lib/content";

export default async function Home() {
  const caseStudies = await getCaseStudies();
  const experiences = await getExperiences();

  return (
    <main className="pt-16">
      <Hero />

      <SectionDivider accent="primary" />
      <section className="py-8">
        <SectionHeader title="Projects" id="projects" />
        <Container variant="wide" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {activeProjects.map((p) => (
            <ProjectCardActive key={p.name} project={p} />
          ))}
        </Container>
      </section>

      <SectionDivider accent="secondary" />
      <section className="py-8">
        <SectionHeader title="Selected Work" id="selected-work" />
        <WorkList>
          {caseStudies.map((c) => (
            <WorkRow
              key={c.slug}
              item={{
                slug: c.slug,
                name: c.name,
                meta: `${c.role} · ${c.period}`,
                cover: c.images?.[0] ?? { src: c.cover, alt: `${c.name} cover` },
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

      <SectionDivider accent="tertiary" />
      <section className="py-8">
        <SectionHeader title="Experiences" id="experiences" />
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

      <SectionDivider />
      <Manifesto />
      <SectionDivider />
      <TerminalInstall />
    </main>
  );
}
