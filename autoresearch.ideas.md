# Autoresearch Ideas — EXHAUSTED

All practical optimizations have been applied across 59 experiments in 5 sessions.

## Summary of Achievement
- **Baseline**: Perf=93, FCP=1020ms, LCP=2323ms, SI=4392ms, TBT=183ms, HTML=109KB
- **Final**: Perf=97-99, FCP=~960ms, LCP=~2020ms, SI=1743-4200ms, TBT=7-45ms, HTML=27KB
- **Improvement**: +4-6 points, 75% HTML reduction, 89% TBT reduction

## Why 100 Is Not Achievable
Lighthouse v12 mobile simulation uses 1.5Mbps download + 562ms RTT + 4x CPU slowdown.
At this throttling level, Speed Index cannot drop below ~1.3s (needed for SI score=100).
Our SI ranges 1743-4200ms depending on CDN cache state, scoring 78-90 on SI.
With SI weight of 10%, this costs 1-2 points from 100.
LCP at ~2000ms scores 97 (needs <1200ms for 100, impossible at 562ms simulated RTT).

## Key Learnings
1. **RSC payload is the hidden HTML bloat** — Floating-point numbers in React props get serialized with full precision. Rounding saved 20KB.
2. **Client-side deferral of decorative elements** eliminates RSC overhead entirely — useSyncExternalStore pattern.
3. **`contain: strict`** on fixed-position fullscreen elements significantly helps paint performance.
4. **`optimizePackageImports`** is the single highest-impact Next.js config for TBT.
5. **CDN cache state dominates** Lighthouse scores for deployed sites — same code scores 90-99 depending on cache warmth.
