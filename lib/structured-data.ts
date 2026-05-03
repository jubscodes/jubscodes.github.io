export function caseStudyBreadcrumb(slug: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "jubs.studio", item: "https://jubs.studio" },
      { "@type": "ListItem", position: 2, name: "Selected Work", item: "https://jubs.studio#selected-work" },
      { "@type": "ListItem", position: 3, name, item: `https://jubs.studio/projects/${slug}/` },
    ],
  };
}

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jubs.studio/#person",
      "name": "Julia Hoffmann Buratto",
      "alternateName": "jubscodes",
      "jobTitle": "Design Engineer",
      "url": "https://jubs.studio",
      "mainEntityOfPage": "https://jubs.studio/about/",
      "sameAs": [
        "https://github.com/jubscodes",
        "https://x.com/hoffz_eth",
        "https://www.linkedin.com/in/julia-hoffmann-/",
      ],
      "knowsAbout": [
        "design engineering",
        "design systems",
        "UI components",
        "shadcn",
        "terminal UI",
        "AI coding tools",
        "developer tools",
        "Design systems",
        "Agentic UX",
        "AI rules",
        "Crypto KYC",
        "Onchain transactions",
        "Data visualization",
        "Figma to Tailwind handoff",
        "React Server Components",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://jubs.studio/#organization",
      "name": "jubs.studio",
      "url": "https://jubs.studio",
      "description":
        "Design engineering solo studio. Opinionated UI kits and AI design tools for developers and agents.",
      "founder": { "@type": "Person", "name": "Julia Hoffmann Buratto" },
      "knowsAbout": [
        "design engineering",
        "design systems",
        "UI components",
        "shadcn",
        "terminal UI",
        "AI coding tools",
        "developer tools",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "name": "CypherCN",
      "applicationCategory": "DeveloperApplication",
      "description":
        "Terminal-inspired shadcn component stylization. 60+ components with phosphor glow, CRT scanlines, box-drawing borders. Dark mode native. WCAG AA.",
      "url": "https://github.com/jubscodes/cyphercn",
      "author": { "@type": "Person", "name": "Julia Hoffmann Buratto" },
      "license": "https://opensource.org/licenses/MIT",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
    {
      "@type": "SoftwareApplication",
      "name": "Get Shit Pretty",
      "alternateName": "GSP",
      "applicationCategory": "DeveloperApplication",
      "description":
        "Design engineering for AI coding tools. 9 specialized agents, 11 skills. Research, brand, design system, UI, specs, review, build, launch — from your terminal.",
      "url": "https://github.com/jubscodes/get-shit-pretty",
      "author": { "@type": "Person", "name": "Julia Hoffmann Buratto" },
      "license": "https://opensource.org/licenses/MIT",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
    {
      "@type": "SoftwareApplication",
      "name": "Shippit",
      "applicationCategory": "BusinessApplication",
      "description":
        "Built front-end for an agentic AI platform. Authored AI rules, refactored the codebase, established a design system that scales with the product.",
      "url": "https://jubs.studio/projects/shippit/",
      "creator": { "@id": "https://jubs.studio/#person" },
      "operatingSystem": "Any",
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chainless",
      "applicationCategory": "FinanceApplication",
      "description":
        "Cofounded Notus and led product + design for Chainless, a Brazilian crypto fintech. Designed KYC and transaction UX. Launched at Blockchain Rio. Managed the design team.",
      "url": "https://jubs.studio/projects/chainless/",
      "creator": { "@id": "https://jubs.studio/#person" },
      "operatingSystem": "Any",
    },
    {
      "@type": "SoftwareApplication",
      "name": "Heimdall",
      "applicationCategory": "BusinessApplication",
      "description":
        "Sole designer for a crypto data platform. Built a complete design system in Figma — typography, color, components — aligned with Tailwind for dev handoff.",
      "url": "https://jubs.studio/projects/heimdall/",
      "creator": { "@id": "https://jubs.studio/#person" },
      "operatingSystem": "Any",
    },
  ],
};
