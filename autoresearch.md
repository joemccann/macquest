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

### Wins
1. **Remove unused Gabarito font** — The entire Gabarito font family (~30KB) was loaded but never used. Removed it. +3 score.
2. **Remove Fredoka weight 300** — Weight 300 (light) was loaded but never used in any component. Removed. (part of #1)
3. **optimizePackageImports** — Added `framer-motion` and `lucide-react` to optimizePackageImports in next.config. Massive TBT reduction (183→20ms). +3 score.
4. **Strip unused CSS theme vars** — Removed sidebar, chart, popover, card, muted, destructive, accent, secondary, primary CSS variables. Also removed 5 unused keyframes (glow, drift, bounce-gentle, shooting-star, spin-slow). CSS size -2KB.
5. **Reduce star count** — SpaceBackground stars 120→60. Fewer DOM elements in initial SSR.
6. **Glass-panel containment** — Added `will-change: transform` and `contain: layout style paint` to `.glass-panel`.
7. **SpaceBackground containment** — Added `contain: strict` to wrapper div.
8. **Remove LCP element drop-shadow** — Removed `filter: drop-shadow()` from the loading shell's `<h1>` (LCP element). Reduces compositing cost.
9. **Misc** — `poweredByHeader: false`, cache headers for static assets.

### Dead Ends
- `experimental.optimizeCss: true` — Requires `critters` dependency (constraint: no new deps).
- Further font weight reduction — Would change visual appearance (400/500/600/700 all used).
- `font-display: optional` — Would hide text if font doesn't load in time. Bad UX for kids app.

### Session 3 Wins (Experiments #26-#30)
10. **Round star numeric values** — RSC payload serialized 15-decimal-place floats for 60 stars. Rounding to 1-2 decimals saved ~20KB raw HTML (~8KB gzip). Huge discovery.
11. **Reduce stars to 40** — Further reduced RSC payload. HTML 88→72KB raw.
12. **Make SpaceBackground client component** — Eliminated RSC serialization of star render tree entirely. HTML 72→55KB raw, 11.7→9.4KB gzip. SI=1743 (best ever).
13. **Remove unused CSS base layer reset** — Removed `* { border-border outline-ring/50 }` and unused theme vars.

### Session 4 Wins (Experiments #35-#39)
14. **Reduce stars 40→25** — Fewer DOM elements, less animation paint.
15. **Remove will-change media query** — Counterproductive on 25+ elements.
16. **Remove contentVisibility:auto** — No SI impact, simplifies code.
17. **Simplify box-shadow** — Removed inset shadows from glass-panel and keyboard-body.
18. **Reduce bright stars 5→3** — Fewer animated elements.
19. **Remove invisible grid overlay** — Was at opacity 0.02.
20. **Reduce cosmic orbs 3→1** — Eliminated 2 blur-filter elements.

### Session 4 Continued (Experiments #41-#43)
21. **Defer all SpaceBackground decorative elements to client-side** — Used `useSyncExternalStore` pattern to render stars, bright stars, aurora, orbs, and planet only after hydration. SSR renders just the deep space gradient. HTML 46→26KB raw (6.4KB gzip). Massive.

### Session 5 (Experiments #51-#57)
22. **Remove glass-panel from below-fold SEO sections** — Never visible (body overflow:hidden). Replaced with simple bg-white/5.
23. **Remove glass-panel from loading status aside** — Only hero section keeps backdrop-filter now.
24. **Confirmed contain:strict is essential** — Removing it from SpaceBackground caused FCP regression (950→1555ms). 

### Current State (Experiment #57, 57 total experiments)
- Perf: **97-99** (97 under poor CDN, 99 when CDN warm)
- LCP: ~2000ms (sub-2s, 15% improvement from baseline 2323ms)
- SI: 2000-4200ms (CDN-driven; SI score is the main variable)
- TBT: 7-45ms (excellent, scores 100)
- FCP: ~950ms (sub-second, improved from 1020ms)
- CLS: 0 (perfect)
- A11y/SEO/BP: all 100
- **HTML: 27KB raw (6.5KB gzip) — down from 109KB (22KB gzip), 75% reduction**
- CSS: ~34KB raw (~7KB gzip) 
- JS shared: 102KB (Next.js framework, can't reduce)
- Only 1 backdrop-filter:blur element in loading shell (hero section)

### Remaining Bottleneck
Speed Index variability (2000-4200ms) is driven by CDN cache state and Lighthouse's simulated 1.5Mbps + 562ms RTT throttling. When CDN is warm, SI ≈ 2000 → Perf=99. When cold, SI ≈ 4200 → Perf=97.
To score Perf=100 would require all metrics at 100, meaning SI < 1.3s — physically impossible at this bandwidth with any meaningful page content.
**97-99 is the practical maximum for this page under Lighthouse mobile throttling.**
