# MacQuest: The Typing Adventure

![MacQuest Banner](https://raw.githubusercontent.com/joemccann/macquest/main/.github/banner.png)

A typing game designed for young children learning the keyboard on a MacBook Pro. Turns a professional laptop into a playful, indestructible learning toy that progresses through the entire keyboard — and then teaches spelling.

## Game Modes

### Practice Typing

Guides kids through 12 progressive levels that introduce the keyboard row by row. A target letter is displayed at 140-180px, the matching key glows on an on-screen MacBook keyboard, and each correct keypress triggers particle explosions and spoken encouragement.

| Level | Name | Keys |
|-------|------|------|
| 1 | Magic Buttons | F, J only (the keys with physical ridges) |
| 2 | Home Row Fingers | D, K, S, L |
| 3 | Full Home Row | A, S, D, F, G, H, J, K, L, ; |
| 4 | Home Row Master | Mixed home row review |
| 5 | Top Row Left | Q, W, E, R, T |
| 6 | Top Row Right | Y, U, I, O, P |
| 7 | Top Row Master | Full QWERTY row |
| 8 | Bottom Row Left | Z, X, C, V, B |
| 9 | Bottom Row Right | N, M, comma, period, / |
| 10 | Bottom Row Master | Full bottom row |
| 11 | Number Row | 1 through 0 |
| 12 | Full Keyboard Challenge | Random selection from all keys |

### Spelling Words

100 age-appropriate words to spell letter-by-letter, organized into 5 tiers of increasing difficulty:

| Tier | Name | Examples |
|------|------|---------|
| 1 | Tiny Words | cat, dog, sun, hat (3-letter CVC) |
| 2 | Simple Words | pig, bug, net, box (3-letter CVC) |
| 3 | Sight Words | the, and, see, can, you |
| 4 | Action Words | jump, play, fish, duck (4-5 letters) |
| 5 | Big Words | black, green, funny, little (5-7 letters) |

The full word is displayed above the target letter, with completed letters highlighted in green. Audio plays for each letter name, the full word, and an excited affirmation on completion.

## How to Play

### Practice Typing

1. Select **Practice Typing** on the home screen.
2. A large glowing letter appears on screen — find it on the keyboard below and press it.
3. A correct keypress triggers a particle explosion and praise. An incorrect key plays a gentle correction.
4. After pressing every letter in the level, a score summary appears. Press **Next Level** to continue.
5. Complete all 12 levels to reach the Victory screen.

### Spelling Words

1. Select **Spelling Words** on the home screen.
2. A word prompt plays aloud: *"Spell the word: cat"*. The word appears at the top of the screen.
3. The first letter glows on the keyboard. Press it to advance — each correct letter plays its name aloud.
4. Complete the whole word to hear it pronounced and receive an excited affirmation.
5. An incorrect letter plays "Try Again!" and the same letter must be pressed to continue.
6. Spell all 100 words to reach the Victory screen.

### Tips

- The **F** and **J** keys have a small ridge on them — these are the "Magic Buttons" that anchor both hands.
- Progress is saved automatically. A **Resume** button appears on the home screen if a session was interrupted.
- Press the floating **Home** button at any time to return to the mode selection screen.

## Scoring

Both modes use the same point system:

| Action | Points |
|--------|--------|
| Correct keypress | +100 |
| Wrong keypress | -100 (floor at 0) |
| Perfect level/word bonus | +500 if score was 0, otherwise 50–100% of earned points |

A level or word is "perfect" if no wrong keys were pressed. Perfect completions are tracked and shown on the Victory screen alongside the final score.

## Key Features

- **Mac Shield** — Intercepts CMD+Q, CMD+W, CMD+R, CMD+T, CMD+N, CMD+H so kids can't accidentally close the browser
- **330+ Audio Clips** — ElevenLabs pre-recorded MP3s: letter names, word pronunciations, "Spell the word" prompts, 30 excited affirmations, 45 encouragement phrases, and 25 gentle wrong-key corrections
- **AI-Generated Praise** — Unique celebration messages generated on the fly for the typing mode (falls back to pre-recorded clips if unavailable)
- **Particle Explosions** — Framer Motion animations on every correct keypress
- **Progress Persistence** — localStorage saves level, score, mode, and word index so kids can pick up exactly where they left off
- **Space Glass UI** — Frosted glass panels, rainbow gradients, animated star background
- **SVG Keyboard** — Accurate MacBook Pro layout with rainbow glow on the target key

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with custom Space Glass theme
- **Framer Motion** for animations
- **Shadcn/UI** components
- **ElevenLabs** pre-recorded audio (served as static MP3s — no API calls at runtime)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome on a MacBook for the best experience. Full-screen mode is recommended.

## Agent Workflow Notes

- Execution plans and verification notes live in `tasks/todo.md`.
- Session restart and handoff context live in `tasks/handoff.md`.
- The repo-local Codex skill install path is `.agents/skills/raisiqueira-claude-code-plugins-nextjs-expert/SKILL.md`.
- After installing or changing repo-local skills, restart Codex in this repo so the new skill definitions are loaded.

## Project Structure

```
src/
  app/
    page.tsx              # Entry point, loads KeyboardEngine
    actions/              # Server actions (AI phrase generation)
  components/
    KeyboardEngine.tsx    # Main game loop and state management
    StarshipKeyboard.tsx  # SVG MacBook keyboard with glow effects
    WelcomeScreen.tsx     # Landing screen with mode selection
    ParticleExplosion.tsx # Confetti/particle effects
    SpaceBackground.tsx   # Animated starfield
  hooks/
    useMacShield.ts       # Blocks dangerous macOS shortcuts
    useGameKeyboard.ts    # Key event handling for gameplay
    useSpeech.ts          # Audio playback and sequencing
  lib/
    game-state.ts         # Reducer-based game state and level definitions
    save-state.ts         # localStorage persistence for progress
    phrases.ts            # Typing mode encouragement phrase pools
    spelling-audio.ts     # Spelling mode audio path helpers
    words.ts              # 100 spelling words in 5 tiers
    keyboard-layout.ts    # MacBook key positions and metadata
scripts/
  generate-audio.mjs           # ElevenLabs batch generator for typing mode clips
  generate-spelling-audio.mjs  # ElevenLabs batch generator for spelling mode clips
public/
  audio/
    positive/             # 45 typing mode celebration clips
    wrong/                # 25 typing mode gentle correction clips
    spelling-positive/    # 30 excited spelling affirmations
    spelling-wrong/       # "Try Again" clip for spelling wrong keys
    letters/              # Letter/number/symbol pronunciation clips
    spell-word/           # 100 "Spell the word {word}" prompts
    words/                # 100 individual word pronunciations
```

## License

MIT
