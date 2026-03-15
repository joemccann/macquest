# Bundle Size Optimization Ideas

## Explored & Applied
- ✅ LazyMotion + m components (biggest win, -11 KB)
- ✅ Lazy-load AboutModal, VictoryScreen, LevelCompleteScreen, ParticleExplosion
- ✅ Remove unused Shadcn components + deps
- ✅ CSS-only animations for decorative emojis
- ✅ Compact string data (phrases, words)

## Ideas to Try
- Replace SpaceBackground with pure CSS (no React component) — the stars/aurora could be CSS-only using generated CSS custom properties. Saves the component code + useSyncExternalStore overhead.
- Move keyboard layout data to be computed from a compact format (e.g., "1234567890-=" instead of array of objects with x/y/width)
- Extract repeated inline style objects into shared constants (many gradient/shadow values are duplicated across components)
- Try `output: 'export'` in next.config to see if static export reduces runtime chunks
- Move useSpeech to use a simpler implementation without AbortController overhead
- Check if framer-motion's AnimatePresence can be replaced with CSS transitions for simple fade in/out
- Try importing from 'framer-motion/dom' for even smaller builds
- Server-side render the keyboard SVG as a static image, lazy-load interactive version
