import { Fredoka } from "next/font/google";
import { siteMetadata } from "@/lib/seo";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  ...siteMetadata,
  other: {
    "color-scheme": "dark",
  },
};

export const viewport = {
  themeColor: "#060818",
  colorScheme: "dark" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-[family-name:var(--font-fredoka)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
