import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { activeProjects } from "@/content/active-projects";

function Separator() {
  return (
    <div className="mx-auto max-w-[1200px] px-12">
      <hr className="my-16 border-0 border-t border-border" />
    </div>
  );
}

export default function Home() {
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
      <Manifesto />
      <Separator />
      <TerminalInstall />
    </main>
  );
}
