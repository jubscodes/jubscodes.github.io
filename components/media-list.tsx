import type { MediaItem } from "@/lib/content";
import { VideoEmbed } from "./video-embed";
import { SlidesEmbed } from "./slides-embed";

export function MediaList({ items }: { items: MediaItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => {
        if (item.type === "video") {
          return <VideoEmbed key={i} url={item.url} title={item.title} />;
        }
        if (item.type === "slides") {
          return (
            <SlidesEmbed
              key={i}
              src={item.src}
              title={item.title}
              standaloneUrl={item.standaloneUrl}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
