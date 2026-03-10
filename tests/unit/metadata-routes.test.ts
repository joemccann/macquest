import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("metadata routes", () => {
  it("publishes a permissive robots policy and sitemap location", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://macquest.app/sitemap.xml",
      host: "https://macquest.app",
    });
  });

  it("publishes the home page in the sitemap", () => {
    expect(sitemap()).toEqual([
      {
        url: "https://macquest.app",
        lastModified: new Date("2026-03-10"),
        changeFrequency: "weekly",
        priority: 1,
      },
    ]);
  });
});
