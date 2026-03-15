# Bundle Size Optimization Ideas

## Explored & Applied
- ✅ Removed framer-motion entirely (CSS animations everywhere)
- ✅ SpaceBackground → pure CSS (box-shadow stars)
- ✅ Lazy-load: StarshipKeyboard, WelcomeScreen, AudioToggle, AboutModal, VictoryScreen, LevelCompleteScreen, ParticleExplosion
- ✅ Lazy-load generatePhrase server action
- ✅ Remove unused deps (clsx, tailwind-merge, cva, lucide-react, framer-motion)
- ✅ Compact all data strings (words, phrases, levels, level names)
- ✅ Remove unused CSS keyframes + theme variables
- ✅ Remove unused Shadcn components

## Dead Ends
- `output: 'export'` — incompatible with server actions + sitemap/robots routes
- `reactStrictMode: false` — no production bundle effect
- Merging save-state + audio-preference — shared patterns compress well via gzip
- Inlining hooks — breaks dedicated test files

## Remaining Opportunities (diminishing returns)
- The 102 KB shared is Next.js 15 + React 19 immovable runtime
- The 7 KB page chunk is mostly game-state reducer + localStorage logic + hooks — essential code
- Could try Preact compat layer but that's a new dependency
- Could try Pages Router instead of App Router (smaller runtime) but that's an architecture rewrite
