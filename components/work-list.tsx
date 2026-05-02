import { Container } from "./container";

export function WorkList({ children }: { children: React.ReactNode }) {
  return (
    <Container variant="wide" className="border-t border-border">
      {children}
    </Container>
  );
}
