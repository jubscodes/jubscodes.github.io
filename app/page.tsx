import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { TerminalInstall } from "@/components/terminal-install";

function Separator() {
  return (
    <div className="mx-auto max-w-[1200px] px-12">
      <hr className="my-16 border-0 border-t border-border" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <Separator />
      <Manifesto />
      <Separator />
      <TerminalInstall />
    </main>
  );
}
