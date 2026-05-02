import Image from "next/image";
import { Container } from "./container";

type Accent = "primary" | "secondary" | "tertiary";

const accentBg: Record<Accent, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export function CaseStudyHero(props: {
  cover: string;
  name: string;
  role: string;
  period: string;
  company: string;
  location?: string;
  accent: Accent;
}) {
  return (
    <header className="border-b border-border">
      <div className="relative aspect-[16/9] w-full bg-surface">
        <Image src={props.cover} alt={`${props.name} cover`} fill className="object-cover" priority sizes="100vw" />
      </div>
      <Container variant="narrow" className="py-12">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">{props.name}</h1>
        <div className={`mt-4 h-0.5 w-16 ${accentBg[props.accent]}`} />
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
          {props.role} · {props.company} · {props.period}
          {props.location && ` · ${props.location}`}
        </p>
      </Container>
    </header>
  );
}
