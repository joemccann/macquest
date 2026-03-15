"use client";

import { m } from "framer-motion";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <m.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[#050714]/78 px-4 py-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <m.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="macquest-about-title"
        className="glass-panel relative w-full max-w-3xl overflow-hidden"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close MacQuest info modal"
          className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-lg text-white/55 transition-colors hover:text-white"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          ×
        </button>

        <div className="max-h-[85vh] overflow-y-auto px-6 py-7 md:px-10 md:py-9">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.35em] text-white/42 uppercase">
              For Parents
            </p>
            <h2
              id="macquest-about-title"
              className="mt-3 text-4xl font-bold tracking-tight md:text-5xl"
              style={{
                background:
                  "linear-gradient(135deg, #fce7f3 0%, #ddd6fe 30%, #bfdbfe 68%, #a7f3d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              What is MacQuest?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/72 md:text-lg">
              MacQuest is a playful typing adventure that turns a real
              keyboard into a guided learning space. Kids see a big target
              letter, find it on the keyboard, hear encouraging audio, and
              get immediate feedback so practice feels more like a game
              than a drill sheet.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.28em] text-cyan-200/62 uppercase">
                Built From Research
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                MacQuest started in PhD research around how young learners
                build fluency without getting overloaded. That early work
                pushed the design toward short feedback loops, tiny wins,
                and steady confidence-building.
              </p>
            </article>

            <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.28em] text-fuchsia-200/62 uppercase">
                The Science In Plain English
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                Kids learn faster when seeing, hearing, and doing line up
                together. MacQuest pairs visual targets, physical key
                presses, and spoken feedback so letter recognition, motor
                memory, and attention reinforce each other in one loop.
              </p>
            </article>

            <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.28em] text-emerald-200/62 uppercase">
                Why The Progression Works
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                The journey starts with F and J, the tactile anchor keys,
                then expands outward in carefully sized steps. That lowers
                cognitive load, keeps success frequent, and helps children
                build automaticity before the keyboard feels overwhelming.
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-[30px] border border-white/10 bg-white/5 px-6 py-5">
            <p className="text-lg font-semibold text-white/84">
              Under the hood, MacQuest is doing a few important things:
            </p>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-white/68 md:grid-cols-2">
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                Immediate correction keeps mistakes low-stakes and useful.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                Celebration and novelty help motivation stay high for
                longer sessions.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                Repetition with variation helps move letters and words
                from effortful recall toward fluency.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                The keyboard itself becomes part of the lesson, not just
                the device underneath it.
              </li>
            </ul>
          </div>

          <p className="mt-6 text-base leading-relaxed text-white/72">
            In other words: it looks like a bright little space mission,
            but underneath it is a carefully structured learning tool
            shaped by real research on feedback, motivation, and early
            skill-building.
          </p>

          <div className="mt-7 flex justify-end">
            <m.button
              type="button"
              onClick={onClose}
              className="relative cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="absolute -inset-2 rounded-full opacity-45"
                style={{
                  background: "linear-gradient(135deg, #34d399, #38bdf8, #8b5cf6)",
                  filter: "blur(14px)",
                }}
              />
              <div
                className="relative rounded-full px-6 py-3 text-base font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  boxShadow: "0 4px 24px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
                }}
              >
                Back to the cockpit
              </div>
            </m.button>
          </div>
        </div>
      </m.section>
    </m.div>
  );
}
