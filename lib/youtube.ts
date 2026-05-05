const YOUTUBE_ID_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function getYouTubeId(url: string): string {
  const m = url.match(YOUTUBE_ID_RE);
  if (!m) throw new Error(`Invalid YouTube URL: ${url}`);
  return m[1];
}
