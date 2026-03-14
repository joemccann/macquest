# Autoresearch: Lighthouse Performance Score

## Objective
Maximize the Lighthouse Performance score for https://macquest.app. The site is a Next.js 15 (App Router) typing game for kids. Current performance score fluctuates 95-98. We want to push it to a consistent 100.

Key bottlenecks identified:
- **LCP (2.3-2.5s)**: The LCP element is the `<h1>` text on the WelcomeScreen (rendered via dynamic import of KeyboardEngine). TTFB is ~630ms (Vercel CDN), then render delay from JS bundle parsing.
- **Speed Index (4.5s)**: Driven by the dynamic import — the entire KeyboardEngine + WelcomeScreen is loaded client-side, meaning the initial server-rendered HTML is just a loading shell.
- **Unused JS (~44KB)**: Two chunks (framer-motion related) have significant unused bytes.

Architecture: `page.tsx` uses `next/dynamic` to lazy-load `KeyboardEngine`. The SSR fallback is `LoadingShell` which has the SEO content. Once JS hydrates, it replaces with the full interactive app. The LCP element is the `<h1>` in the loading shell (good — it's SSR'd).

## Metrics
- **Primary**: lighthouse_perf (score 0-100, higher is better)
- **Secondary**: lcp_ms, speed_index_ms, tbt_ms, cls, fcp_ms

## How to Run
`./autoresearch.sh` — runs Lighthouse against https://macquest.app and outputs `METRIC name=number` lines.

**IMPORTANT**: After code changes, we must `pnpm build` and deploy to Vercel (`npx vercel --prod`) before running Lighthouse. The benchmark runs against the live deployed site.

## Files in Scope
- `src/app/page.tsx` — Main page with dynamic import and LoadingShell
- `src/app/layout.tsx` — Root layout with font loading
- `src/app/globals.css` — All styles including animations
- `src/components/SpaceBackground.tsx` — Star field background (120 DOM elements)
- `src/components/KeyboardEngine.tsx` — Main game engine (dynamically imported)
- `src/components/WelcomeScreen.tsx` — Welcome screen with mode selection
- `src/components/StarshipKeyboard.tsx` — SVG keyboard visualization
- `src/components/ParticleExplosion.tsx` — Particle effects on keypress
- `src/components/AudioToggle.tsx` — Audio mute/unmute button
- `src/lib/seo.ts` — SEO metadata and structured data
- `next.config.ts` — Next.js configuration
- `public/site.webmanifest` — Web manifest

## Off Limits
- `src/lib/game-state.ts` — Game logic must not change
- `src/lib/words.ts` — Word lists must not change
- `src/lib/save-state.ts` — Save/load must not change
- `src/hooks/` — Hook behavior must not change
- `src/lib/spelling-audio.ts` — Audio paths must not change
- `public/audio/` — Audio files must not change
- Test files

## Constraints
- The app must still work correctly (typing game, spelling mode, audio, save state)
- No new npm dependencies
- TypeScript must compile (`pnpm build` must succeed)
- Accessibility and SEO scores must remain at 100
- Best Practices score must remain at 100
- The visual appearance must remain the same

## What's Been Tried
(Updated as experiments accumulate)
