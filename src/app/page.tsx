"use client";

import dynamic from "next/dynamic";

const KeyboardEngine = dynamic(
  () => import("@/components/KeyboardEngine").then((m) => m.KeyboardEngine),
  { ssr: false }
);

export default function Home() {
  return <KeyboardEngine />;
}
