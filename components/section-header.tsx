import { Container } from "./container";

export function SectionHeader({
  title,
  id,
}: {
  title: string;
  id?: string;
}) {
  return (
    <Container as="header" variant="wide" id={id} className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    </Container>
  );
}
