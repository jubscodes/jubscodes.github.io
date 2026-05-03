import Link from "next/link";
import type { Skill } from "@/content/skills";
import { Container } from "./container";

export function SkillRow({ skill }: { skill: Skill }) {
  return (
    <div
      tabIndex={0}
      className="group block w-full border-b border-border outline-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-secondary/5 group-focus-within:bg-secondary/5 hover:bg-secondary/5 focus-within:bg-secondary/5"
    >
      <Container variant="narrow">
        <div className="flex flex-col gap-1 py-5 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-secondary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-focus-within:rotate-90 max-md:rotate-90">
              ▸
            </span>
            <span className="text-lg font-medium">{skill.name}</span>
          </div>
          <span className="pl-8 font-mono text-sm text-muted md:ml-auto md:pl-0">
            {skill.years}y · {skill.projects.length} {skill.projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        <div className="max-h-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-[480px] group-focus-within:max-h-[480px] max-md:max-h-[480px]">
          <ul className="flex flex-col gap-3 pb-8 pl-8 md:pb-6 md:pl-8">
            {skill.projects.map((p, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-4"
              >
                {p.href ? (
                  <Link
                    href={p.href}
                    className="text-base text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-secondary"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <span className="text-base text-fg">{p.name}</span>
                )}
                {p.period && (
                  <span className="font-mono text-xs uppercase tracking-wider text-muted md:ml-auto">
                    {p.period}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
