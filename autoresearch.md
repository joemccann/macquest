# Autoresearch: Bundle Size Optimization

## Objective
Minimize the First Load JS bundle size for the main page (/) of MacQuest — a Next.js 15 typing game app. Currently at 156 KB First Load JS (54.3 KB page + 102 KB shared).

## Metrics
- **Primary**: first_load_kb (KB, lower is better) — total First Load JS reported by `next build`
- **Secondary**: page_kb, shared_kb, app_chunk_raw_kb, app_chunk_gz_kb, total_js_raw_kb, total_js_gz_kb, total_css_raw_kb, total_css_gz_kb

## How to Run
`./autoresearch.sh` — builds the app and outputs `METRIC name=number` lines from `next build` output.

## Files in Scope
- `src/components/KeyboardEngine.tsx` — Main game engine (777 lines, biggest component, imports framer-motion heavily)
- `src/components/WelcomeScreen.tsx` — Mode selection with about modal (463 lines, uses framer-motion)
- `src/components/StarshipKeyboard.tsx` — SVG keyboard (219 lines, uses framer-motion)
- `src/components/SpaceBackground.tsx` — Animated stars/nebula (186 lines, client component)
- `src/components/ParticleExplosion.tsx` — Particle effects (112 lines, uses framer-motion)
- `src/components/AudioToggle.tsx` — Audio toggle button (80 lines, uses framer-motion)
- `src/app/page.tsx` — Page with dynamic import of KeyboardEngine + SEO loading shell (151 lines)
- `src/app/layout.tsx` — Root layout with Fredoka font (36 lines)
- `src/lib/game-state.ts` — Game reducer + level definitions (349 lines)
- `src/lib/save-state.ts` — LocalStorage save/load (168 lines)
- `src/lib/seo.ts` — SEO metadata + structured data (133 lines)
- `src/lib/keyboard-layout.ts` — Keyboard position data (96 lines)
- `src/lib/phrases.ts` — Wrong-key phrases (52 lines)
- `src/lib/words.ts` — 100 spelling words (57 lines)
- `src/lib/spelling-audio.ts` — Audio path helpers (66 lines)
- `src/lib/audio-preference.ts` — Mute preference persistence (87 lines)
- `src/lib/utils.ts` — cn() utility using clsx + tailwind-merge (6 lines)
- `src/hooks/useSpeech.ts` — Audio playback hook (83 lines)
- `src/hooks/useGameKeyboard.ts` — Keyboard event hook (44 lines)
- `src/hooks/useMacShield.ts` — macOS shortcut interception (34 lines)
- `next.config.ts` — Next.js configuration
- `src/app/globals.css` — Global styles + animations

## Off Limits
- `public/` directory (audio files, images)
- `tests/` directory structure (but tests can be updated to match code changes)
- No removing features — all game modes, audio, animations must work
- `package.json` scripts

## Constraints
- All tests must pass (`npm run test`)
- TypeScript must compile (`npx tsc --noEmit`)
- No new dependencies (can remove unused ones)
- All features must remain functional
- Visual appearance should remain the same

## Key Architecture Notes
- The main page dynamically imports `KeyboardEngine` (code-split)
- `framer-motion` is the largest dependency (~46KB shared chunk) — already using `optimizePackageImports`
- `tailwind-merge` + `clsx` imported via `cn()` utility — only used in 2 Shadcn UI components
- The `@ai-sdk/anthropic` + `ai` packages are server-only (used in generate-phrase.ts action)
- Shadcn `card.tsx` and `progress.tsx` components exist but may not be used
- `class-variance-authority` is a Shadcn dependency

## What's Been Tried
(Starting fresh — no experiments yet)
