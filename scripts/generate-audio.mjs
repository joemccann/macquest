#!/usr/bin/env node

/**
 * Generate pre-recorded audio files using ElevenLabs TTS API.
 *
 * Usage: ELEVEN_LABS_API_KEY=sk_... node scripts/generate-audio.mjs
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVEN_LABS_API_KEY env var");
  process.exit(1);
}

// Jessica - Playful, Bright, Warm
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL_ID = "eleven_turbo_v2_5";

const POSITIVE_PHRASES = [
  "Amazing job, space explorer!",
  "You're a typing superstar!",
  "Wow, your fingers are so fast!",
  "That was out of this world!",
  "You're zooming through the galaxy!",
  "Super duper typing powers!",
  "Your fingers are doing a happy dance!",
  "You're a keyboard wizard!",
  "Blast off! Perfect typing!",
  "The stars are cheering for you!",
  "You make typing look so easy!",
  "Keep going, little astronaut!",
  "Galactic genius right here!",
  "Your rocket is flying higher!",
  "What a cosmic champion!",
  "You nailed it, space cadet!",
  "Lightning fast fingers!",
  "The whole universe is proud!",
  "You're on fire like a shooting star!",
  "Woohoo, captain awesome!",
  "That key didn't stand a chance!",
  "Way to go, rocket ranger!",
  "Your typing is pure magic!",
  "Mission accomplished, explorer!",
  "Incredible typing powers activated!",
  "You just leveled up your awesomeness!",
  "The planets are lining up for you!",
  "Hyperdrive typing speed!",
  "You're a constellation of talent!",
  "That was stellar, truly stellar!",
  "Moonwalk-worthy keypress!",
  "You've got the golden touch!",
  "Nebula-powered fingers!",
  "Every star just winked at you!",
  "You're typing like a comet!",
  "Space high-five!",
  "Your keyboard loves you!",
];

const WRONG_KEY_PHRASES = [
  "Oops! Almost! Try again!",
  "So close! You've got this!",
  "Not quite — give it another shot!",
  "Whoopsie daisy! Try the glowing key!",
  "Keep looking, you'll find it!",
  "That's a different key! Look for the glow!",
  "Almost there, little explorer!",
  "Try again, space buddy!",
  "Look at the keyboard for the bright one!",
  "That wasn't it, but you're so close!",
  "Oops! Check the shiny key!",
  "No worries! Just try one more time!",
  "The right key is glowing for you!",
  "Find the rainbow key!",
  "Not that one! Look for the magic glow!",
  "Every explorer makes detours! Try again!",
  "Even astronauts miss sometimes! Go again!",
  "Shake it off! You'll get the next one!",
  "The glowing key is your target!",
  "Almost had it! One more try!",
  "That key was close but not the one!",
  "Hmm, not quite! Check the sparkly key!",
  "You're learning! Try the bright key!",
  "Ooh, wrong planet! Find the right one!",
  "That's okay! Look for the colorful key!",
];

async function generateAudio(text, outputPath) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.4,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  return buffer.length;
}

async function generateAll(phrases, dir, label) {
  await mkdir(dir, { recursive: true });
  let totalChars = 0;

  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    const filename = `${String(i).padStart(2, "0")}.mp3`;
    const outputPath = path.join(dir, filename);

    // Skip if already generated
    if (existsSync(outputPath)) {
      console.log(`  ⏭ [${label}/${filename}] already exists, skipping`);
      continue;
    }

    totalChars += phrase.length;
    const bytes = await generateAudio(phrase, outputPath);
    console.log(
      `  ✅ [${label}/${filename}] "${phrase}" (${bytes} bytes)`
    );

    // Rate limiting: ElevenLabs allows ~2-3 req/s on free tier
    await new Promise((r) => setTimeout(r, 500));
  }

  return totalChars;
}

async function main() {
  console.log("🎙️  Generating audio with ElevenLabs (Jessica voice)\n");

  console.log("📁 Positive phrases:");
  const posChars = await generateAll(
    POSITIVE_PHRASES,
    "public/audio/positive",
    "positive"
  );

  console.log("\n📁 Wrong-key phrases:");
  const wrongChars = await generateAll(
    WRONG_KEY_PHRASES,
    "public/audio/wrong",
    "wrong"
  );

  const total = posChars + wrongChars;
  console.log(`\n✨ Done! Used ~${total} characters of API quota.`);
  console.log(
    `   ${POSITIVE_PHRASES.length} positive + ${WRONG_KEY_PHRASES.length} wrong = ${POSITIVE_PHRASES.length + WRONG_KEY_PHRASES.length} files`
  );
}

main().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
