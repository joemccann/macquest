// 100 kindergarten spelling words in 5 tiers (easy → harder)

export const SPELLING_TIERS: { name: string; words: string[] }[] = [
  {
    name: "Tiny Words",
    words: [
      "cat", "dog", "sun", "hat", "red",
      "big", "run", "sit", "cup", "bed",
      "go", "up", "no", "me", "he",
      "we", "is", "it", "am", "an",
    ],
  },
  {
    name: "Simple Words",
    words: [
      "pig", "bug", "net", "box", "map",
      "hen", "pen", "van", "rug", "fan",
      "log", "pot", "pin", "bat", "fox",
      "hug", "zip", "jam", "hot", "wet",
    ],
  },
  {
    name: "Sight Words",
    words: [
      "the", "and", "see", "can", "you",
      "was", "are", "but", "not", "she",
      "his", "her", "did", "get", "new",
      "all", "had", "one", "our", "out",
    ],
  },
  {
    name: "Action Words",
    words: [
      "jump", "play", "fish", "duck", "look",
      "like", "make", "come", "find", "help",
      "good", "blue", "down", "away", "said",
      "they", "that", "this", "with", "have",
    ],
  },
  {
    name: "Big Words",
    words: [
      "black", "green", "white", "brown", "under",
      "funny", "little", "pretty", "yellow", "three",
      "where", "there", "please", "after", "sleep",
      "water", "happy", "house", "going", "about",
    ],
  },
];

export const SPELLING_WORDS: string[] = SPELLING_TIERS.flatMap((t) => t.words);

export const WORDS_PER_ROUND = 5;

export function getSpellingWord(index: number): string {
  return SPELLING_WORDS[index % SPELLING_WORDS.length];
}
