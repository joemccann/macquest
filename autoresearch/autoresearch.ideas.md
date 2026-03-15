# Bundle Size Optimization Ideas

## Explored & Applied
- ✅ Removed framer-motion entirely (CSS animations everywhere)
- ✅ SpaceBackground → pure CSS (box-shadow stars)
- ✅ Lazy-load: StarshipKeyboard, WelcomeScreen, AudioToggle, AboutModal, VictoryScreen, LevelCompleteScreen, ParticleExplosion
- ✅ Lazy-load: generatePhrase server action, phrases.ts, spelling-audio.ts, words.ts
- ✅ Decouple words from game-state reducer (action payloads)
- ✅ Remove unused deps (clsx, tailwind-merge, cva, lucide-react, framer-motion)
- ✅ Compact all data strings (words, phrases, levels, level names)
- ✅ Remove unused CSS keyframes + theme variables
- ✅ Minify save-state + audio-preference source
- ✅ Simplify getInitialState (no LEVELS dependency at init)

## Dead Ends
- `output: 'export'` — incompatible with server actions + sitemap/robots routes
- `reactStrictMode: false` — no production bundle effect
- Merging save-state + audio-preference — shared patterns compress well via gzip
- Inlining hooks — breaks dedicated test files
- Source-level minification (useSpeech) — webpack minifier already handles this

## Why We're Done
- 102 KB shared = Next.js 15 App Router + React 19 runtime (immovable floor)
- 6 KB page chunk = game state reducer + localStorage persistence + 3 hooks + lazy stubs (all essential)
- Every component except the core engine shell is lazy-loaded
- All data files (words, phrases, audio helpers) are lazy-loaded
- CSS handles all animations with zero JS library
