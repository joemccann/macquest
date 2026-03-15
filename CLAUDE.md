# TypingTales - MacQuest: The Typing Adventure

## Project Overview
A Next.js 15 (App Router) typing app for a 5-year-old on a MacBook Pro. Turns a professional machine into a playful, indestructible learning toy with Home Row focus.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS + "Space Glass" theme (backdrop-blur-xl, bg-white/20, rounded-3xl)
- **Animation**: Pure CSS keyframes + transitions (framer-motion removed for bundle size)
- **AI**: Vercel AI SDK for success phrases (typing mode)
- **Audio**: ElevenLabs pre-recorded MP3s (330+ clips)
- **Deploy**: Vercel (Retina-optimized images)

## Key Design Decisions
- F & J keys highlighted as "Magic Buttons" (physical ridge awareness)
- System shortcuts (CMD+Q/W/R) intercepted via `useMacShield` hook
- Minimum 120px font size for letter display
- MacBook Pro 14/16-inch keyboard SVG layout
- Two game modes (Practice Typing / Spelling Words) accessible from welcome screen
- Spelling mode has dedicated audio: letter sounds, word prompts, word pronunciations, excited affirmations
- Aggressive code-splitting: only 6 KB of page-specific JS in the initial bundle

## Core Components
- `useMacShield` - Hook to intercept/disable macOS system shortcuts
- `StarshipKeyboard` - SVG MacBook keyboard with rainbow gradient highlights (lazy-loaded)
- `KeyboardEngine` - Main game engine component with mode-specific audio routing
- `WelcomeScreen` - Mode selection (Practice Typing / Spelling Words) with save state resume (lazy-loaded)
- `SpaceBackground` - Pure CSS animated starfield (box-shadow stars, gradient background)
- `AudioToggle` - Mute/unmute toggle (lazy-loaded)
- `useSpeech` - Audio playback with `speak()` for single clips and `speakSequence()` for chained clips
- `spelling-audio.ts` - Audio path helpers for letters, words, spell prompts, and affirmations (lazy-loaded)
- `ParticleExplosion` - CSS keyframe particle effects on correct keypress (lazy-loaded)
- `VictoryScreen` / `LevelCompleteScreen` - Post-game celebration screens (lazy-loaded)
- `AboutModal` - "What is MacQuest?" info modal for parents (lazy-loaded)

## Bundle Optimization
First Load JS reduced from 156 KB → 108 KB (-30.8%) through:
- Removed framer-motion entirely — all animations use CSS keyframes/transitions
- Removed unused deps: clsx, tailwind-merge, class-variance-authority, lucide-react
- Aggressive React.lazy code-splitting for all non-critical components
- SpaceBackground converted to pure CSS (box-shadow stars, no React runtime)
- Game data (words, phrases, audio helpers) lazy-loaded via dynamic import
- Words decoupled from game-state reducer (passed via action payloads)
- Compact string data formats for levels, words, phrases
