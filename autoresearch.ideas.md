# Bundle Size Optimization Ideas

## Explored & Applied
- ✅ Removed framer-motion entirely (CSS animations everywhere)
- ✅ Lazy-load AboutModal, VictoryScreen, LevelCompleteScreen, ParticleExplosion
- ✅ Remove unused Shadcn components + deps
- ✅ CSS-only animations for all components
- ✅ Compact string data (phrases, words, keyboard layout)

## Ideas to Try
- SpaceBackground as pure CSS (remove React component + useSyncExternalStore) — stars via CSS box-shadow, aurora via CSS gradient animations
- Inline the small hooks (useMacShield, useGameKeyboard) directly into KeyboardEngine to avoid module overhead
- Move generate-phrase server action to an API route (eliminates RSC server reference overhead in client bundle)
- Try `output: 'export'` in next.config — static export may reduce shared Next.js runtime
- Merge save-state.ts + audio-preference.ts into one localStorage module (reduce module boilerplate)
- Check if `_not-found` page costs anything in shared chunks
- Audit CSS — are all the new animation keyframes tree-shaken if unused? Any duplicates?
- Try Brotli-aware optimizations (Next.js on Vercel serves Brotli; our gzip numbers may undercount savings)
