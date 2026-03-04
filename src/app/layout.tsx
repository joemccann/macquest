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
  description: "A magical typing game for young explorers",
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
