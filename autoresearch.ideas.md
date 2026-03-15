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

## Still Promising
- **Further reduce star count** — Each star saves ~300B RSC payload + DOM node. Currently at 40, could try 25-30.
- **Replace framer-motion with CSS animations** — NOT for performance (it's in dynamic chunk), but for reducing the dynamic chunk size (124KB → could be ~80KB). Only helps load time of interactive mode, not Lighthouse.
- **Reduce SEO text verbosity** — The loading shell duplicates text in both rendered HTML and RSC payload. Shorter SEO text = smaller document.
- **Move SpaceBackground back to client component** — As a server component, stars get serialized in RSC payload. As a client component, the star generation happens on the client with no RSC overhead. BUT the rendering would be delayed. Trade-off worth testing.

## Network Reality
- Lighthouse scores fluctuate ±5 points between runs due to CDN cache state and simulated throttling
- SI is the most volatile metric (2000-6800ms range on identical code)
- FCP and LCP are more stable indicators of real improvement
- Cache warming curl in autoresearch.sh helps but doesn't eliminate variance
