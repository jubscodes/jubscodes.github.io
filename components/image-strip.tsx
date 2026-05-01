import Image from "next/image";
import type { Image as ImgT } from "@/lib/content";

export function ImageStrip({ images }: { images: ImgT[] }) {
  if (images.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-8 py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-video overflow-hidden border border-border bg-surface">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
