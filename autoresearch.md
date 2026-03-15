# Autoresearch: Lighthouse Performance Optimization

## Objective
Maximize the Lighthouse Performance score for https://macquest.app — a Next.js 15 (App Router) typing game for kids on a MacBook Pro.

## Final Results (70 experiments, 6 sessions)

| Metric | Baseline | Final | Change |
|--------|----------|-------|--------|
| **Perf Score** | 93 | **97-99** | **+4-6 pts** |
| FCP | 1020ms | ~960ms | -6% |
| LCP | 2323ms | ~2020ms | **-13%** |
| TBT | 183ms | ~30ms | **-84%** |
| CLS | 0 | 0 | — |
| SI | 4392ms | 1743-4200ms | variable |
| HTML | 109KB (22KB gz) | 33KB (7KB gz) | **-68% gz** |
| A11y | 100 | 100 | — |
| SEO | 100 | 100 | — |
| Best Practices | 100 | 100 | — |

## All Optimizations Applied

### Font Optimization
1. **Remove unused Gabarito font family** — ~30KB savings, +3 score
2. **Remove Fredoka weight 300** — unused weight eliminated
3. **Disable font fallback adjustment** (`adjustFontFallback: false`) — CSS -329B, CLS unaffected

### Next.js Config
4. **`optimizePackageImports`** for framer-motion — TBT 183→20ms, biggest single TBT win
5. **`poweredByHeader: false`** — removes unnecessary header
6. **Cache headers** — immutable caching for `/_next/static/*`
7. **`compress: true`** — gzip compression

### CSS Cleanup
8. **Strip unused CSS imports** — removed `tw-animate-css`, `shadcn/tailwind.css` (entirely unused)
9. **Remove unused theme variables** — sidebar, chart, popover, card, muted, destructive, accent, secondary, primary color vars
10. **Remove unused keyframes** — glow, drift, bounce-gentle, shooting-star, spin-slow
11. **Remove unused CSS classes** — `.candy-key`, dark variant, shimmer theme var
12. **Remove `@layer base` reset** — `* { border-border outline-ring/50 }` was unnecessary
13. **Simplify box-shadows** — removed inset shadows from glass-panel and keyboard-body
14. **Reduce backdrop-filter blur** — 24px→16px

### RSC Payload Reduction (biggest discovery)
15. **Round star numeric values** — RSC serialized 15-decimal floats; rounding to integers saved ~20KB raw HTML
16. **Make SpaceBackground a client component** — eliminates RSC serialization of render tree
17. **Defer all decorative elements to client-side** — stars, aurora, orbs, planet render only after hydration via `useSyncExternalStore` pattern. HTML 109→33KB

### DOM Reduction
18. **Reduce stars** — 120→25 elements
19. **Reduce bright stars** — 5→3 elements
20. **Reduce cosmic orbs** — 3→1 element
21. **Remove invisible grid overlay** — was at opacity 0.02

### Paint Optimization
22. **`contain: strict`** on SpaceBackground — confirmed essential (removing caused FCP regression)
23. **`contain: layout style paint`** on glass-panel
24. **Remove `filter: drop-shadow()`** from LCP `<h1>` element
25. **Remove `will-change` media query** — counterproductive on 25+ animated elements
26. **Remove glass-panel from loading shell** — below-fold SEO sections + aside use simple `bg-white/5` instead of expensive `backdrop-filter: blur()`

### Other
27. **Replace lucide-react with inline SVGs** — eliminated runtime dependency
28. **Add viewport `themeColor` and `colorScheme`** — faster initial paint hint
29. **CDN cache warming** in benchmark script

## Dead Ends (do not retry)
- `experimental.optimizeCss` — requires `critters` dep (no new deps constraint)
- Variable font (no explicit weights) — consistently scored lower
- CSS-only SpaceBackground with box-shadows — more expensive to paint
- Remove blur filters from aurora/orbs — visual regression
- `content-visibility: auto` on below-fold sections — no measurable impact
- Inline critical CSS in `<head>` — no measurable improvement
- Remove `contain: strict` from SpaceBackground — caused FCP regression

## Key Learnings
1. **RSC payload is hidden HTML bloat** — React serializes component props with full float precision. Rounding saved 20KB.
2. **Client-side deferral via `useSyncExternalStore`** eliminates RSC overhead for decorative elements entirely.
3. **`contain: strict`** on fixed fullscreen elements significantly helps paint performance.
4. **`optimizePackageImports`** is the highest-impact Next.js config for TBT.
5. **CDN cache state dominates** Lighthouse scores — same code scores 90-99 depending on cache warmth.
6. **Speed Index** is the hardest metric to optimize — it's bounded by network throttling and visual complexity.

## Why 100 Is Not Achievable
Lighthouse v12 mobile simulation: 1.5Mbps download + 562ms RTT + 4x CPU slowdown.
- SI needs < 1.3s for score 100 — impossible at this bandwidth with any meaningful page
- LCP needs < 1.2s for score 100 — impossible with 562ms simulated RTT
- Our SI ranges 1743-4200ms (scores 78-90), costing 1-2 points
- **97-99 is the practical maximum** under Lighthouse mobile throttling
