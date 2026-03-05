# TypingTales - MacQuest: The Typing Adventure

## Project Overview
A Next.js 15 (App Router) typing app for a 5-year-old on a MacBook Pro. Turns a professional machine into a playful, indestructible learning toy with Home Row focus.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS + "Space Glass" theme (backdrop-blur-xl, bg-white/20, rounded-3xl)
- **Animation**: Framer Motion (particle explosions on keypress)
- **UI Components**: Shadcn/UI (Progress, Card)
- **AI**: Vercel AI SDK for success phrases (typing mode)
- **Audio**: ElevenLabs pre-recorded MP3s (330+ clips), Web Speech API fallback
- **Deploy**: Vercel (Retina-optimized images)

## Key Design Decisions
- F & J keys highlighted as "Magic Buttons" (physical ridge awareness)
- System shortcuts (CMD+Q/W/R) intercepted via `useMacShield` hook
- Minimum 120px font size for letter display
- MacBook Pro 14/16-inch keyboard SVG layout
- Two game modes (Practice Typing / Spelling Words) accessible from welcome screen
- Spelling mode has dedicated audio: letter sounds, word prompts, word pronunciations, excited affirmations

## Core Components
- `useMacShield` - Hook to intercept/disable macOS system shortcuts
- `StarshipKeyboard` - SVG MacBook keyboard with rainbow gradient highlights
- `KeyboardEngine` - Main game engine component with mode-specific audio routing
- `WelcomeScreen` - Mode selection (Practice Typing / Spelling Words) with save state resume
- `useSpeech` - Audio playback with `speak()` for single clips and `speakSequence()` for chained clips
- `spelling-audio.ts` - Audio path helpers for letters, words, spell prompts, and affirmations
- Shadcn Progress/Card styled as spaceship controls
