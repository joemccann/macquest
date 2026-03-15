export interface KeyData {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMagic?: boolean;
}

const KEY_H = 44;
const KEY_W = 52;
const GAP = 4;

function buildRow(startX: number, startY: number, spec: string): KeyData[] {
  // spec format: "label:width:magic,label,label:width,..." 
  // width defaults to KEY_W, magic defaults to false
  let x = startX;
  return spec.split(",").map((s) => {
    const parts = s.split(":");
    const label = parts[0];
    const width = parts[1] ? parseInt(parts[1]) : KEY_W;
    const isMagic = parts[2] === "m";
    const key: KeyData = { label, x, y: startY, width, height: KEY_H, isMagic: isMagic || undefined };
    x += width + GAP;
    return key;
  });
}

const ROW_GAP = 4;
const r1Y = 8;
const r2Y = r1Y + KEY_H + ROW_GAP;
const r3Y = r2Y + KEY_H + ROW_GAP;
const r4Y = r3Y + KEY_H + ROW_GAP;
const r5Y = r4Y + KEY_H + ROW_GAP;

export const NUMBER_ROW: KeyData[] = buildRow(8, r1Y, "`:52,1,2,3,4,5,6,7,8,9,0,-,=,Delete:80");
export const TOP_ROW: KeyData[] = buildRow(8, r2Y, "Tab:72,Q,W,E,R,T,Y,U,I,O,P,[,],\\:60");
export const HOME_ROW: KeyData[] = buildRow(8, r3Y, "Caps:82,A,S,D,F:52:m,G,H,J:52:m,K,L,;,',Return:82");
export const BOTTOM_ROW: KeyData[] = buildRow(8, r4Y, "Shift:104,Z,X,C,V,B,N,M,.,/:104");

// Fix: comma and period need special handling
const BOTTOM_ROW_FIXED: KeyData[] = (() => {
  const row = buildRow(8, r4Y, "Shift:104,Z,X,C,V,B,N,M");
  // Manually add comma, period, slash, shift
  let x = row[row.length - 1].x + row[row.length - 1].width + GAP;
  for (const label of [",", ".", "/"]) {
    row.push({ label, x, y: r4Y, width: KEY_W, height: KEY_H });
    x += KEY_W + GAP;
  }
  row.push({ label: "Shift", x, y: r4Y, width: 104, height: KEY_H });
  return row;
})();

export const SPACE_ROW: KeyData[] = buildRow(8, r5Y, "Fn:44,Ctrl:44,Opt:52,Cmd:66,Space:300,Cmd:66,Opt:52,Left:44,Up:44,Right:44");

export const ALL_ROWS: KeyData[][] = [NUMBER_ROW, TOP_ROW, HOME_ROW, BOTTOM_ROW_FIXED, SPACE_ROW];

export function findKeyByLabel(label: string): KeyData | undefined {
  for (const row of ALL_ROWS) {
    const found = row.find((k) => k.label.toUpperCase() === label.toUpperCase());
    if (found) return found;
  }
  return undefined;
}
