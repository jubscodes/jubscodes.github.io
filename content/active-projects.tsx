import type { ReactNode } from "react";
import { CypherCnPreview } from "@/components/active-projects/cyphercn-preview";
import { GspPipeline } from "@/components/active-projects/gsp-pipeline";

export type ActiveProject = {
  name: string;
  description: string;
  categories: { label: string; tone: "primary" | "secondary" | "tertiary" }[];
  href: string;
  install?: string;
  preview: ReactNode;
};

export const activeProjects: ActiveProject[] = [
  {
    name: "KIT.001 — CypherCN",
    description:
      "Terminal-inspired shadcn stylization. 60+ components. Phosphor glow, CRT scanlines, box-drawing borders. Dark mode native. WCAG AA.",
    categories: [
      { label: "UI Kit", tone: "primary" },
      { label: "Alpha", tone: "tertiary" },
    ],
    href: "https://github.com/jubscodes/cyphercn",
    install: "pnpm dlx shadcn@latest add @cyphercn/button",
    preview: <CypherCnPreview />,
  },
  {
    name: "GSP — Get Shit Pretty",
    description:
      "Design engineering for AI coding tools. 9 specialized agents, 11 skills. Research, brand, design system, UI, specs, review, build, launch — from your terminal.",
    categories: [{ label: "Dev Tool", tone: "secondary" }],
    href: "https://github.com/jubscodes/get-shit-pretty",
    install: "npx get-shit-pretty",
    preview: <GspPipeline />,
  },
];
