// Wrong-key phrases stored compactly, split at runtime
const WRONG_KEY_PHRASES = "Oops! Almost! Try again!|So close! You've got this!|Not quite — give it another shot!|Whoopsie daisy! Try the glowing key!|Keep looking, you'll find it!|That's a different key! Look for the glow!|Almost there, little explorer!|Try again, space buddy!|Look at the keyboard for the bright one!|That wasn't it, but you're so close!|Oops! Check the shiny key!|No worries! Just try one more time!|The right key is glowing for you!|Find the rainbow key!|Not that one! Look for the magic glow!|Every explorer makes detours! Try again!|Even astronauts miss sometimes! Go again!|Shake it off! You'll get the next one!|The glowing key is your target!|Almost had it! One more try!|That key was close but not the one!|Hmm, not quite! Check the sparkly key!|You're learning! Try the bright key!|Ooh, wrong planet! Find the right one!|That's okay! Look for the colorful key!".split("|");

export interface PhraseResult {
  text: string;
  audioFile: string;
}

const history: number[] = [];

export function getRandomWrongPhrase(): PhraseResult {
  const maxHistory = 10;
  const available = WRONG_KEY_PHRASES
    .map((_, i) => i)
    .filter((i) => !history.includes(i));

  const pool = available.length > 0 ? available : WRONG_KEY_PHRASES.map((_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)];

  history.push(idx);
  if (history.length > maxHistory) history.shift();

  return {
    text: WRONG_KEY_PHRASES[idx],
    audioFile: `/audio/wrong/${String(idx).padStart(2, "0")}.mp3`,
  };
}
