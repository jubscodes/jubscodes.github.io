import { describe, it, expect } from "vitest";
import { getYouTubeId } from "@/lib/youtube";

describe("getYouTubeId", () => {
  it("extracts id from watch URL", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=C37nglGnTts")).toBe("C37nglGnTts");
  });
  it("extracts id from youtu.be short URL", () => {
    expect(getYouTubeId("https://youtu.be/C37nglGnTts")).toBe("C37nglGnTts");
  });
  it("ignores extra query params", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=C37nglGnTts&t=42")).toBe("C37nglGnTts");
  });
  it("throws on a non-YouTube URL", () => {
    expect(() => getYouTubeId("https://example.com/foo")).toThrow(/Invalid YouTube URL/);
  });
});
