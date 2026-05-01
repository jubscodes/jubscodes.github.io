import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { WorkRow } from "@/components/work-row";
import { WorkList } from "@/components/work-list";
import { activeProjects } from "@/content/active-projects";
import { getCaseStudies, getExperiences } from "@/lib/content";

function Separator() {
  return (
    <div className="mx-auto max-w-[1200px] px-12">
      <hr className="my-16 border-0 border-t border-border" />
    </div>
  );
}

export default async function Home() {
  const caseStudies = await getCaseStudies();
  const experiences = await getExperiences();

  return (
    <main className="pt-16">
      <Hero />
      <Separator />

      <section className="py-8">
        <SectionHeader title="Projects" accent="primary" id="projects" />
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-12 md:grid-cols-2">
          {activeProjects.map((p) => (
            <ProjectCardActive key={p.name} project={p} />
          ))}
        </div>
      </section>

      <Separator />

      <section className="py-8">
        <SectionHeader title="Selected Work" accent="secondary" id="selected-work" />
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

      <Separator />

      <section className="py-8">
        <SectionHeader title="Experiences" accent="tertiary" id="experiences" />
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

      <Separator />
      <Manifesto />
      <Separator />
      <TerminalInstall />
    </main>
  );
}
