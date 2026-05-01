import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";
import { SectionHeader } from "@/components/section-header";
import { ProjectCardActive } from "@/components/active-projects/project-card-active";
import { WorkRow, type WorkRowItem } from "@/components/work-row";
import { WorkList } from "@/components/work-list";
import { activeProjects } from "@/content/active-projects";

const placeholderCaseStudies: WorkRowItem[] = [
  {
    slug: "shippit",
    name: "Shippit",
    meta: "Design Engineer · 2025",
    cover: { src: "/images/projects/shippit/cover.png", alt: "Shippit dashboard" },
    outcome:
      "Built front-end for an agentic AI platform. Authored AI rules, refactored the codebase, established a design system that scales with the product.",
    tags: ["design-system", "react", "ai-rules", "refactoring"],
    links: [{ label: "Live site", href: "https://shippit.com", external: true }],
  },
  {
    slug: "notus",
    name: "Notus / Chainless",
    meta: "Cofounder · 2023",
    cover: { src: "/images/projects/notus/cover.png", alt: "Chainless app" },
    outcome:
      "Cofounded Notus and led product + design for Chainless, a Brazilian crypto fintech. Designed KYC and transaction UX. Launched at Blockchain Rio.",
    tags: ["product", "fintech", "crypto", "leadership"],
    links: [],
  },
  {
    slug: "heimdall",
    name: "Heimdall",
    meta: "Solo Designer · 2022",
    cover: { src: "/images/projects/heimdall/cover.png", alt: "Heimdall design system" },
    outcome:
      "Sole designer for a crypto data platform. Built a complete design system in Figma — typography, color, components — aligned with Tailwind for dev handoff.",
    tags: ["design-system", "figma", "tailwind", "data-viz"],
    links: [],
  },
];

const placeholderExperiences: WorkRowItem[] = [
  {
    slug: "avalanche-innovation-house",
    name: "Avalanche Innovation House",
    meta: "Builder Residency · Buenos Aires · 2024",
    outcome:
      "Three-month builder residency program. Post-Chainless launch incubation. Built and shipped alongside the global Avalanche builder cohort.",
    tags: ["residency", "crypto", "product", "latam"],
    links: [
      {
        label: "Program info",
        href: "https://avalanche.com/innovation-house",
        external: true,
      },
    ],
  },
  {
    slug: "best-layerzero",
    name: "Best LayerZero",
    meta: "Hackathon Win · 2023",
    outcome:
      "Won Best LayerZero project at ETHGlobal hackathon for cross-chain UX work.",
    tags: ["hackathon", "cross-chain", "recognition"],
    links: [],
  },
  {
    slug: "1st-aurora",
    name: "1st Place Aurora",
    meta: "Hackathon Win · 2022",
    outcome:
      "First place at Aurora-sponsored hackathon for an onchain rental product.",
    tags: ["hackathon", "near", "recognition"],
    links: [],
  },
  {
    slug: "cursor-coffee",
    name: "Cursor Coffee",
    meta: "Speaker · 2025",
    outcome:
      "Spoke about agentic IDE design at the Cursor Coffee community event.",
    tags: ["speaking", "ai-tools", "community"],
    links: [],
  },
];

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

      <section className="py-8">
        <SectionHeader title="Selected Work" accent="secondary" id="selected-work" />
        <WorkList>
          {placeholderCaseStudies.map((c) => (
            <WorkRow key={c.slug} item={c} variant="case-study" accent="secondary" />
          ))}
        </WorkList>
      </section>

      <Separator />

      <section className="py-8">
        <SectionHeader title="Experiences" accent="tertiary" id="experiences" />
        <WorkList>
          {placeholderExperiences.map((e) => (
            <WorkRow key={e.slug} item={e} variant="experience" accent="tertiary" />
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
