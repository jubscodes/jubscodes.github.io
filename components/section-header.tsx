export function SectionHeader({
  title,
  id,
}: {
  title: string;
  id?: string;
}) {
  return (
    <header id={id} className="mx-auto mb-8 max-w-[1200px] px-12">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    </header>
  );
}
