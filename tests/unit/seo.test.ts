import { describe, expect, it } from "vitest";
import {
  SITE_DESCRIPTION,
  SITE_JSON_LD,
  SITE_KEYWORDS,
  SITE_TITLE,
  siteMetadata,
} from "@/lib/seo";

describe("site SEO config", () => {
  it("defines canonical, robots, and social metadata", () => {
    expect(siteMetadata.title).toBe(SITE_TITLE);
    expect(siteMetadata.description).toBe(SITE_DESCRIPTION);
    expect(siteMetadata.alternates?.canonical).toBe("/");
    expect(siteMetadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
    expect(siteMetadata.openGraph?.url).toBe("https://macquest.app");
    expect(siteMetadata.twitter?.card).toBe("summary_large_image");
    expect(siteMetadata.keywords).toEqual([...SITE_KEYWORDS]);
    expect(siteMetadata.manifest).toBe("/site.webmanifest");
  });

  it("serializes software application structured data", () => {
    const structuredData = JSON.parse(SITE_JSON_LD) as {
      "@type": string;
      name: string;
      isAccessibleForFree: boolean;
      offers: { price: string; priceCurrency: string };
      featureList: string[];
    };

    expect(structuredData["@type"]).toBe("SoftwareApplication");
    expect(structuredData.name).toBe("MacQuest");
    expect(structuredData.isAccessibleForFree).toBe(true);
    expect(structuredData.offers).toMatchObject({
      price: "0",
      priceCurrency: "USD",
    });
    expect(structuredData.featureList.length).toBeGreaterThanOrEqual(4);
  });
});
