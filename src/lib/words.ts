// 100 kindergarten spelling words in 5 tiers (easy → harder)
// Stored compactly as comma-separated strings to reduce bundle size

const TIER_DATA: [string, string][] = [
  ["Tiny Words", "cat,dog,sun,hat,red,big,run,sit,cup,bed,go,up,no,me,he,we,is,it,am,an"],
  ["Simple Words", "pig,bug,net,box,map,hen,pen,van,rug,fan,log,pot,pin,bat,fox,hug,zip,jam,hot,wet"],
  ["Sight Words", "the,and,see,can,you,was,are,but,not,she,his,her,did,get,new,all,had,one,our,out"],
  ["Action Words", "jump,play,fish,duck,look,like,make,come,find,help,good,blue,down,away,said,they,that,this,with,have"],
  ["Big Words", "black,green,white,brown,under,funny,little,pretty,yellow,three,where,there,please,after,sleep,water,happy,house,going,about"],
];

export const SPELLING_TIERS: { name: string; words: string[] }[] =
  TIER_DATA.map(([name, words]) => ({ name, words: words.split(",") }));

export const SPELLING_WORDS: string[] = SPELLING_TIERS.flatMap((t) => t.words);

export const WORDS_PER_ROUND = 5;

export function getSpellingWord(index: number): string {
  return SPELLING_WORDS[index % SPELLING_WORDS.length];
}
