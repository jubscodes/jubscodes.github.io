export type SkillProject = {
  name: string;
  href?: string;
  period?: string;
};

export type Skill = {
  slug: string;
  name: string;
  years: number;
  projects: SkillProject[];
};

export const skills: Skill[] = [
  {
    slug: "design-systems",
    name: "Design systems",
    years: 4,
    projects: [
      { name: "Shippit (front-end + system)", href: "/projects/shippit/", period: "2025—" },
      { name: "BWB Tokenization (front-end lead)", period: "2025—" },
      { name: "Learn to Fly (Expo/RN refactor)", period: "2025" },
      { name: "Chainless (Nucleus customization)", href: "/projects/chainless/", period: "2023—24" },
      { name: "Heimdall (Figma → Tailwind)", href: "/projects/heimdall/", period: "2022—23" },
    ],
  },
  {
    slug: "front-end-engineering",
    name: "Front-end engineering",
    years: 2,
    projects: [
      { name: "Shippit (Remix · Convex · Shadcn)", href: "/projects/shippit/", period: "2025—" },
      { name: "BWB Tokenization (React Router 7)", period: "2025—" },
      { name: "Tools for the Commons (Nuxt · Vue)", period: "2025" },
      { name: "Founderhaus Base (Farcaster Mini App)", period: "2025" },
      { name: "Learn to Fly (Expo · NativeWind)", period: "2025" },
      { name: "jubs.studio (Next.js · Tailwind v4)", period: "2026" },
    ],
  },
  {
    slug: "ai-coding-tools",
    name: "AI coding tools",
    years: 1,
    projects: [
      { name: "Shippit AI rules (Cursor / Claude)", href: "/projects/shippit/", period: "2025—" },
      { name: "Get Shit Pretty", period: "2025—" },
      { name: "CypherCN registry", period: "2025—" },
      { name: "ETH Global · Onchain Agent on Base", period: "2025" },
    ],
  },
  {
    slug: "onchain-ux",
    name: "Onchain UX",
    years: 5,
    projects: [
      { name: "BWB Tokenization (real estate)", period: "2025—" },
      { name: "Chainless KYC + PIX/onchain", href: "/projects/chainless/", period: "2023—25" },
      { name: "The Gens (Aurora generative NFT)", period: "2023" },
      { name: "AnyDAO (LayerZero cross-chain)", period: "2022" },
      { name: "Heimdall (data viz)", href: "/projects/heimdall/", period: "2022—23" },
      { name: "Luxy (Syscoin NFT marketplace)", href: "/projects/luxy/", period: "2021—22" },
    ],
  },
  {
    slug: "blockchain",
    name: "Blockchain",
    years: 5,
    projects: [
      { name: "BWB Tokenization (real estate · EVM)", period: "2025—" },
      { name: "ETH Global · Onchain Agent on Base", period: "2025" },
      { name: "Chainless (PIX + onchain transactions)", href: "/projects/chainless/", period: "2023—25" },
      { name: "Notus Labs (multichain infra)", period: "2023—25" },
      { name: "The Gens (Aurora · NEAR)", period: "2023" },
      { name: "AnyDAO (LayerZero cross-chain)", period: "2022" },
      { name: "Heimdall (crypto data platform)", href: "/projects/heimdall/", period: "2022—23" },
      { name: "Luxy (Syscoin NFT marketplace)", href: "/projects/luxy/", period: "2021—22" },
    ],
  },
  {
    slug: "account-abstraction",
    name: "Account Abstraction",
    years: 3,
    projects: [
      { name: "BWB Tokenization (Privy embedded wallets)", period: "2025—" },
      { name: "Notus API (smart account infra)", period: "2024—25" },
      { name: "Chainless (gasless onchain UX via Notus)", href: "/projects/chainless/", period: "2023—25" },
    ],
  },
  {
    slug: "product-leadership",
    name: "Product leadership",
    years: 5,
    projects: [
      { name: "Notus Labs (Cofounder · Operations & Product)", period: "2023—25" },
      { name: "Chainless (Product + design lead)", href: "/projects/chainless/", period: "2023—25" },
      { name: "Florianópolis Urban Planning Platform", period: "2023" },
      { name: "Luxy (Cofounder · Project Leader)", href: "/projects/luxy/", period: "2021—22" },
    ],
  },
  {
    slug: "hackathon-shipping",
    name: "Hackathon shipping",
    years: 4,
    projects: [
      { name: "ETH Global · Onchain Agent on Base", period: "2025" },
      { name: "Avalanche Innovation House · Buenos Aires", period: "2024" },
      { name: "ETH Samba · 1st Aurora (The Gens)", period: "2023" },
      { name: "Avalanche Summit · Best LayerZero (AnyDAO)", period: "2022" },
    ],
  },
];
