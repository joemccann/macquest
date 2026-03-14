# Autoresearch Ideas

## Promising but Complex
- **Reduce Tailwind CSS output**: The remaining 34KB CSS is mostly Tailwind utility classes. Could try `content` config to scan only used classes, but Tailwind v4 already does this automatically. Might investigate if something is generating extra classes.
- **Replace framer-motion with CSS animations**: framer-motion adds ~46KB to shared JS. Many animations (WelcomeScreen floating emojis, button hover/tap) could be CSS-only. Major refactor.
- **Use CSS-only SpaceBackground**: Replace React-rendered stars with CSS-only implementation (radial-gradient dots, single element with box-shadows). Eliminates 60+ DOM nodes.
- **Split Fredoka into per-weight files**: Load only weight 700 initially (for bold headings), lazy-load 400/500/600 after first paint.
- **Inline critical CSS manually**: Extract the ~2KB of CSS needed for above-fold content and inline it in the HTML head. Eliminates CSS as render-blocking resource.
- **Server-side generate the loading shell as static HTML**: Instead of using next/dynamic loading, generate the full loading shell at build time and serve as pure HTML with minimal JS.

## Quick Tests Still Worth Trying
- **Remove `backdrop-filter` from loading shell glass-panels**: The blur effect is GPU-expensive and affects initial paint time. Could use solid semi-transparent background instead.
- **Reduce CSS custom properties**: Still ~20 unused CSS vars from Tailwind theme defaults.
- **Try `fetchPriority="high"` on font preload link**: Next.js may already do this but worth verifying.
