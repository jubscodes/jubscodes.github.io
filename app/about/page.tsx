import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContentBlock } from "@/components/content-block";
import { SectionDivider } from "@/components/section-divider";
import { getExperiences } from "@/lib/content";

const SITE_URL = "https://jubs.studio";
const PAGE_URL = `${SITE_URL}/about/`;
const PAGE_DESCRIPTION =
  "Julia Hoffmann Buratto — Design Engineer building AI tooling, design systems, and onchain UX. Cofounder at Notus. Currently at Shippit. Open to Design Engineer roles.";
const OG_IMAGE = "/images/projects/heimdall/cover.png";

export const metadata: Metadata = {
  title: "About — Julia Hoffmann · jubs.studio",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "profile",
    url: PAGE_URL,
    siteName: "jubs.studio",
    title: "About — Julia Hoffmann Buratto",
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "About Julia Hoffmann — Design Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hoffz_eth",
    creator: "@hoffz_eth",
    title: "About — Julia Hoffmann Buratto",
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function AboutPage() {
  const experiences = await getExperiences();
  return (
    <main className="pt-16">
      <Container as="header" variant="narrow" className="py-16">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          About
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
          Julia Hoffmann Buratto
        </h1>
        <div className="mt-4 h-0.5 w-16 bg-secondary" />
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
          Design Engineer · São Paulo · Open to roles
        </p>
      </Container>

      <SectionDivider />

      <ContentBlock label="Background">
        <p>
          Cofounded Notus in 2023 — a Brazilian crypto fintech — and led product + design
          for Chainless through public launch at Blockchain Rio. Before that, sole designer
          for Heimdall (crypto data platform), building a complete Figma-to-Tailwind design
          system. Currently building front-end + design systems at Shippit.
        </p>
      </ContentBlock>

      <ContentBlock label="What I do">
        <p>
          Design Engineer at the intersection of Figma and Tailwind. I build component
          libraries (CypherCN), AI coding tools (Get Shit Pretty), and onchain UX with care
          for both ends — the design system and the shipped code that uses it. I author AI
          rules files, refactor codebases for design coherence, and design+build directly
          inside AI IDEs like Cursor.
        </p>
      </ContentBlock>

      <ContentBlock label="Available for">
        <p>
          Design Engineer roles. Remote or São Paulo. Reach out via{" "}
          <a
            href="https://www.linkedin.com/in/julia-hoffmann-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:underline"
          >
            LinkedIn
          </a>{" "}
          or{" "}
          <a
            href="https://x.com/hoffz_eth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:underline"
          >
            X
          </a>
          .
        </p>
      </ContentBlock>

      <SectionDivider />

      <Container as="section" variant="narrow" className="py-12">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          Recognition
        </p>
        <ul className="flex flex-col gap-4">
          {experiences.map((e) => (
            <li
              key={e.slug}
              className="grid grid-cols-1 gap-1 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6"
            >
              <span className="text-base font-medium">{e.name}</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {e.meta}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
