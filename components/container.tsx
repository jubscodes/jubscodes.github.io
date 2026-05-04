import { cn } from "@/lib/utils";

type ContainerProps = {
  variant?: "wide" | "narrow";
  className?: string;
  children: React.ReactNode;
  id?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
};

const variantClass: Record<NonNullable<ContainerProps["variant"]>, string> = {
  wide: "mx-auto max-w-[1200px] px-6 sm:px-8 md:px-12",
  narrow: "mx-auto max-w-[960px] px-6 sm:px-8",
};

export function Container({
  variant = "wide",
  className,
  children,
  id,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag id={id} className={cn(variantClass[variant], className)}>
      {children}
    </Tag>
  );
}
