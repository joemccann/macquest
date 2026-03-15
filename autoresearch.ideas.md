# Autoresearch Ideas

## Tried and Stale (DO NOT RETRY)
- ~~Variable font (no explicit weights)~~ — Consistently 96, vs 97-99 with explicit weights. May hurt.
- ~~CSS-only SpaceBackground with box-shadows~~ — Worse performance (box-shadow is more expensive to paint).
- ~~Remove blur filters from aurora/orbs~~ — Regression (Perf 93 vs 98).
- ~~content-visibility: auto~~ — Already in code from earlier experiment. Minimal impact.
- ~~will-change on animated elements~~ — Counterproductive (too many compositing layers).
- ~~Inline critical CSS in head~~ — No measurable improvement.

## Key Discovery
- **RSC payload size is huge** — The SpaceBackground's 60 star elements with 15-decimal-place numbers added ~30KB to HTML document. Rounding to integers/1 decimal saves ~20KB raw (~8KB gzip). This was the biggest win in session 3.

## Completed Since Last Update
- ✅ Stars reduced to 25 + bright stars to 3
- ✅ SpaceBackground made client component with useSyncExternalStore deferral
- ✅ Stars, aurora, orbs, planet all deferred to client-side only
- ✅ Invisible grid overlay removed
- ✅ Box-shadows simplified
- ✅ will-change media query removed
- ✅ contentVisibility removed (no impact)

## Remaining Ideas (diminishing returns)
- **Shorten SEO text** — Could save ~500B gzip. Risky for SEO score.
- **Replace framer-motion with CSS** — Only affects dynamic chunk, not initial load. Major refactor for no Lighthouse benefit.
- **Reduce Fredoka font subsets** — Hebrew/Latin-Extended subsets (~13KB) are lazy-loaded, not blocking.
- **Try Brotli compression** — Vercel already uses it. Can't control.
- **Server timing hints** — Add `Link: <preload>` headers for fonts/CSS. Vercel may already do this.

## Network Reality
- Lighthouse scores fluctuate ±5 points between runs due to CDN cache state and simulated throttling
- SI is the most volatile metric (2000-6800ms range on identical code)
- FCP and LCP are more stable indicators of real improvement
- Cache warming curl in autoresearch.sh helps but doesn't eliminate variance
