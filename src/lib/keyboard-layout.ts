export interface KeyData {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMagic?: boolean;
}

// MacBook Pro keyboard layout — simplified to the rows that matter
// All coordinates in a 900x300 viewBox

const KEY_H = 44;
const KEY_W = 52;
const GAP = 4;
const ROW_GAP = 4;

function row(startX: number, startY: number, keys: { label: string; w?: number; isMagic?: boolean }[]): KeyData[] {
  let x = startX;
  return keys.map((k) => {
    const width = k.w ?? KEY_W;
    const key: KeyData = {
      label: k.label,
      x,
      y: startY,
      width,
      height: KEY_H,
      isMagic: k.isMagic,
    };
    x += width + GAP;
    return key;
  });
}

const row1Y = 8;
const row2Y = row1Y + KEY_H + ROW_GAP;
const row3Y = row2Y + KEY_H + ROW_GAP;
const row4Y = row3Y + KEY_H + ROW_GAP;
const row5Y = row4Y + KEY_H + ROW_GAP;

export const NUMBER_ROW: KeyData[] = row(8, row1Y, [
  { label: "`", w: KEY_W },
  { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" },
  { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" },
  { label: "-" }, { label: "=" },
  { label: "Delete", w: 80 },
]);

export const TOP_ROW: KeyData[] = row(8, row2Y, [
  { label: "Tab", w: 72 },
  { label: "Q" }, { label: "W" }, { label: "E" }, { label: "R" }, { label: "T" },
  { label: "Y" }, { label: "U" }, { label: "I" }, { label: "O" }, { label: "P" },
  { label: "[" }, { label: "]" },
  { label: "\\", w: 60 },
]);

export const HOME_ROW: KeyData[] = row(8, row3Y, [
  { label: "Caps", w: 82 },
  { label: "A" }, { label: "S" }, { label: "D" },
  { label: "F", isMagic: true },
  { label: "G" }, { label: "H" },
  { label: "J", isMagic: true },
  { label: "K" }, { label: "L" }, { label: ";" },
  { label: "'" },
  { label: "Return", w: 82 },
]);

export const BOTTOM_ROW: KeyData[] = row(8, row4Y, [
  { label: "Shift", w: 104 },
  { label: "Z" }, { label: "X" }, { label: "C" }, { label: "V" }, { label: "B" },
  { label: "N" }, { label: "M" }, { label: "," }, { label: "." }, { label: "/" },
  { label: "Shift", w: 104 },
]);

export const SPACE_ROW: KeyData[] = row(8, row5Y, [
  { label: "Fn", w: 44 },
  { label: "Ctrl", w: 44 },
  { label: "Opt", w: 52 },
  { label: "Cmd", w: 66 },
  { label: "Space", w: 300 },
  { label: "Cmd", w: 66 },
  { label: "Opt", w: 52 },
  { label: "Left", w: 44 },
  { label: "Up", w: 44 },
  { label: "Right", w: 44 },
]);

export const ALL_ROWS: KeyData[][] = [NUMBER_ROW, TOP_ROW, HOME_ROW, BOTTOM_ROW, SPACE_ROW];

export function findKeyByLabel(label: string): KeyData | undefined {
  for (const row of ALL_ROWS) {
    const found = row.find((k) => k.label.toUpperCase() === label.toUpperCase());
    if (found) return found;
  }
  return undefined;
}
