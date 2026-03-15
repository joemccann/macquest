import dynamic from "next/dynamic";
import { SpaceBackground } from "@/components/SpaceBackground";
import {
  SEO_FEATURES,
  SEO_HIGHLIGHTS,
  SEO_MODE_CARDS,
  SITE_JSON_LD,
} from "@/lib/seo";

function LoadingShell() {
  return (
    <>
      <SpaceBackground />
      <main className="relative z-10 px-4 py-10 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="glass-panel grid gap-6 px-6 py-8 md:grid-cols-[1.3fr_0.9fr] md:px-10 md:py-10">
            <div className="flex flex-col gap-5">
              <p className="text-sm font-semibold tracking-[0.35em] text-white/55 uppercase">
                MacQuest
              </p>
              <div className="space-y-3">
                <h1
                  className="text-4xl font-bold tracking-tight md:text-6xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #f472b6 0%, #c084fc 25%, #818cf8 50%, #38bdf8 75%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Typing and spelling practice for kids on a MacBook Pro
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
                  MacQuest turns keyboard practice into a guided space adventure
                  with 12 progressive typing levels, 100 spelling words, spoken
                  prompts, and kid-friendly feedback.
                </p>
              </div>
              <ul className="grid gap-3 text-sm text-white/68 md:grid-cols-3">
                {SEO_HIGHLIGHTS.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="glass-panel flex flex-col gap-4 border border-white/6 px-5 py-5 text-left">
              <div className="flex items-center gap-3">
                <div
                  className="text-4xl"
                  role="img"
                  aria-label="Rocket preparing for launch"
                >
                  🚀
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.25em] text-white/55 uppercase">
                    Loading Status
                  </p>
                  <p className="text-lg font-semibold text-white/85">
                    Preparing your starship keyboard
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/65">
                The interactive game starts automatically as soon as the client
                finishes loading.
              </p>
              <div
                className="flex flex-col gap-3"
                role="status"
                aria-live="polite"
              >
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
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
            </aside>
          </section>

          <section
            className="grid gap-4 md:grid-cols-2"
            aria-label="MacQuest game modes"
          >
            {SEO_MODE_CARDS.map((mode) => (
              <article
                key={mode.title}
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6"
              >
                <h2 className="text-2xl font-semibold text-white">
                  {mode.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/72">
                  {mode.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/58">
                  {mode.detail}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 md:px-8">
            <h2 className="text-2xl font-semibold text-white">
              Why families use MacQuest
            </h2>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-white/68 md:grid-cols-2">
              {SEO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}

const KeyboardEngine = dynamic(
  () => import("@/components/KeyboardEngine").then((m) => m.KeyboardEngine),
  { loading: LoadingShell }
);

export default function Home() {
  return (
    <>
      <script
        id="seo-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: SITE_JSON_LD }}
      />
      <KeyboardEngine />
    </>
  );
}
