// 100 kindergarten spelling words — stored as single string, split once at init
export const SPELLING_WORDS: string[] = "cat,dog,sun,hat,red,big,run,sit,cup,bed,go,up,no,me,he,we,is,it,am,an,pig,bug,net,box,map,hen,pen,van,rug,fan,log,pot,pin,bat,fox,hug,zip,jam,hot,wet,the,and,see,can,you,was,are,but,not,she,his,her,did,get,new,all,had,one,our,out,jump,play,fish,duck,look,like,make,come,find,help,good,blue,down,away,said,they,that,this,with,have,black,green,white,brown,under,funny,little,pretty,yellow,three,where,there,please,after,sleep,water,happy,house,going,about".split(",");

export function getSpellingWord(index: number): string {
  return SPELLING_WORDS[index % SPELLING_WORDS.length];
}
