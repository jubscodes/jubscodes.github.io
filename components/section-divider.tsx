type Accent = "primary" | "secondary" | "tertiary" | "muted";

const accentColor: Record<Accent, string> = {
  primary: "text-primary/40",
  secondary: "text-secondary/40",
  tertiary: "text-tertiary/40",
  muted: "text-border",
};

export function SectionDivider({ accent = "muted" }: { accent?: Accent }) {
  return (
    <div aria-hidden className="my-16 w-full overflow-hidden">
      <div
        className={`whitespace-nowrap font-mono text-xs tracking-[0.2em] ${accentColor[accent]}`}
      >
        {"─".repeat(300)}
      </div>
    </div>
  );
}
