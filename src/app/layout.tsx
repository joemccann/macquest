import { Fredoka, Gabarito } from "next/font/google";
import { siteMetadata } from "@/lib/seo";
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

export const metadata = siteMetadata;

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
