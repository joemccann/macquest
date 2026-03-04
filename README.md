# MacQuest: The Typing Adventure

A typing game designed for young children learning the keyboard on a MacBook Pro. Turns a professional laptop into a playful, indestructible learning toy focused on Home Row keys.

## What It Does

MacQuest guides kids through progressive typing levels with a space-themed UI. A target letter is displayed at 140-180px, the matching key glows on an on-screen MacBook keyboard, and each correct keypress triggers particle explosions and spoken encouragement.

**Levels:**

1. **Magic Buttons** - F and J only (the keys with physical ridges)
2. **Home Row Fingers** - D, K, S, L added
3. **Full Home Row** - All home row keys including A, G, H, L, ;
4. **Home Row Master** - Mixed home row at speed

## Key Features

- **Mac Shield** - Intercepts CMD+Q, CMD+W, CMD+R and other system shortcuts so kids can't accidentally close the browser
- **Pre-recorded Voice Audio** - 60+ ElevenLabs MP3s for encouragement phrases, with Web Speech API fallback
- **AI-Generated Praise** - Vercel AI SDK generates unique celebration messages via Claude
- **Particle Explosions** - Framer Motion animations on every correct keypress
- **Space Glass UI** - Frosted glass panels, rainbow gradients, animated star background
- **SVG Keyboard** - Accurate MacBook Pro layout with rainbow glow on the target key

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with custom Space Glass theme
- **Framer Motion** for animations
- **Shadcn/UI** components
- **Vercel AI SDK** + Claude for dynamic phrases
- **ElevenLabs** pre-recorded audio

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome on a MacBook for the best experience (full-screen recommended).

### Environment Variables

```
ANTHROPIC_API_KEY=your_key_here
```

Required for AI-generated celebration phrases. The game works without it using fallback phrases.

## Project Structure

```
src/
  app/
    page.tsx              # Entry point, loads KeyboardEngine
    actions/              # Server actions (AI phrase generation)
  components/
    KeyboardEngine.tsx    # Main game loop and state management
    StarshipKeyboard.tsx  # SVG MacBook keyboard with glow effects
    WelcomeScreen.tsx     # Landing screen with animated start button
    ParticleExplosion.tsx # Confetti/particle effects
    SpaceBackground.tsx   # Animated starfield
  hooks/
    useMacShield.ts       # Blocks dangerous macOS shortcuts
    useGameKeyboard.ts    # Key event handling for gameplay
    useSpeech.ts          # Audio playback with synthesis fallback
  lib/
    game-state.ts         # Reducer-based game state and level definitions
    phrases.ts            # Encouragement phrase pools
    keyboard-layout.ts    # MacBook key positions and metadata
public/
  audio/
    positive/             # 37 ElevenLabs celebration clips
    wrong/                # 25 ElevenLabs gentle correction clips
```

## License

MIT
