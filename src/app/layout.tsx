import type { Metadata } from "next";
import { Fredoka, Gabarito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MacQuest: The Typing Adventure",
  description: "A magical typing adventure game for young explorers. 12 progressive keyboard levels plus 100 spelling words — built for kids on a MacBook Pro.",
  metadataBase: new URL("https://macquest.app"),
  openGraph: {
    title: "MacQuest: The Typing Adventure",
    description: "A magical typing adventure game for young explorers. 12 progressive keyboard levels plus 100 spelling words — built for kids on a MacBook Pro.",
    url: "https://macquest.app",
    siteName: "MacQuest",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "MacQuest: The Typing Adventure",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MacQuest: The Typing Adventure",
    description: "A magical typing adventure game for young explorers. 12 progressive keyboard levels plus 100 spelling words — built for kids on a MacBook Pro.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${gabarito.variable} font-[family-name:var(--font-fredoka)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
