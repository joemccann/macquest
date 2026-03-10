import type { Metadata } from "next";

export const SITE_URL = "https://macquest.app";
export const SITE_NAME = "MacQuest";
export const SITE_TITLE = "MacQuest: The Typing Adventure";
export const SITE_DESCRIPTION =
  "A magical typing adventure game for young explorers. 12 progressive keyboard levels plus 100 spelling words built for kids on a MacBook Pro.";

export const SITE_KEYWORDS = [
  "typing game for kids",
  "kids typing practice",
  "typing game for MacBook",
  "learn keyboard for children",
  "spelling game for kids",
  "MacQuest typing adventure",
] as const;

export const SEO_HIGHLIGHTS = [
  "12 progressive keyboard levels",
  "100 spelling words across five tiers",
  "Designed for kids learning on a MacBook Pro",
] as const;

export const SEO_MODE_CARDS = [
  {
    title: "Practice Typing",
    summary:
      "Guide kids from the F and J home-row anchors all the way to the full keyboard with glowing key hints and giant target letters.",
    detail:
      "Each correct keypress earns points, triggers particle effects, and plays encouraging audio so practice feels like play.",
  },
  {
    title: "Spelling Words",
    summary:
      "Practice 100 age-appropriate words letter by letter with spoken prompts, word playback, and gentle correction when a wrong key is pressed.",
    detail:
      "Word sets progress from simple CVC words to sight words and longer action words without changing the core game flow.",
  },
] as const;

export const SEO_FEATURES = [
  "Mac Shield blocks common browser shortcuts so young players cannot accidentally quit or reload the session.",
  "Audio clips cover letter names, word prompts, encouragement, and celebration moments for independent practice.",
  "Progress saves automatically so families can return to the same level, score, and spelling word later.",
  "The on-screen MacBook keyboard mirrors key positions and highlights the next target key in real time.",
] as const;

export const siteMetadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  keywords: [...SITE_KEYWORDS],
  category: "education",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  alternateName: SITE_TITLE,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser on macOS",
  browserRequirements: "Requires JavaScript, audio playback, and a keyboard",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Children learning keyboard and spelling skills",
    suggestedMinAge: 4,
    suggestedMaxAge: 9,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [...SEO_HIGHLIGHTS, ...SEO_FEATURES],
  keywords: SITE_KEYWORDS.join(", "),
};

export const SITE_JSON_LD = JSON.stringify(siteStructuredData);
