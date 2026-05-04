import Image from "next/image";
import type { Image as ImgT } from "@/lib/content";
import { Container } from "./container";

export function ImageStrip({ images }: { images: ImgT[] }) {
  if (images.length === 0) return null;
  return (
    <Container as="section" variant="narrow" className="py-10">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((img, i) => (
          <a
            key={i}
            href={img.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${img.alt} in new tab`}
            className="group relative block aspect-video overflow-hidden border border-border bg-surface transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-80"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </a>
        ))}
      </div>
    </Container>
  );
}
