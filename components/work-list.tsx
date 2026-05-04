export function WorkList({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="h-px w-full bg-border" />
      {children}
    </>
  );
}
