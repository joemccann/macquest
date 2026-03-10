"use client";

import dynamic from "next/dynamic";
import { SpaceBackground } from "@/components/SpaceBackground";

function LoadingShell() {
  return (
    <>
      <SpaceBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel flex max-w-xl flex-col items-center gap-4 px-8 py-10 text-center">
          <div
            className="text-5xl"
            role="img"
            aria-label="Rocket preparing for launch"
          >
            🚀
          </div>
          <p className="text-sm font-semibold tracking-[0.4em] text-white/55 uppercase">
            MacQuest
          </p>
          <h1
            className="text-4xl font-bold tracking-tight md:text-5xl"
            style={{
              background:
                "linear-gradient(135deg, #f472b6 0%, #c084fc 25%, #818cf8 50%, #38bdf8 75%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 24px rgba(139, 92, 246, 0.28))",
            }}
          >
            Preparing your starship keyboard...
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70 md:text-lg">
            Loading the typing adventure so young explorers can jump straight
            into practice.
          </p>
          <div
            className="flex flex-col items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <div className="h-2 w-52 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-24 animate-pulse rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #38bdf8 100%)",
                }}
              />
            </div>
            <p className="text-sm font-medium text-white/55">Loading game</p>
          </div>
        </section>
      </main>
    </>
  );
}

const KeyboardEngine = dynamic(
  () => import("@/components/KeyboardEngine").then((m) => m.KeyboardEngine),
  { loading: LoadingShell, ssr: false }
);

export default function Home() {
  return <KeyboardEngine />;
}
