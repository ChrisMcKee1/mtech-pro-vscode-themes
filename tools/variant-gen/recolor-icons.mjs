import { readFileSync, writeFileSync } from "node:fs";
const [, , inPath, outPath, mapPath] = process.argv;
const map = JSON.parse(readFileSync(mapPath, "utf8"));
const j = JSON.parse(readFileSync(inPath, "utf8"));
let changed = 0;
const missed = {};
function recolor(defs) {
  if (!defs) return;
  for (const k of Object.keys(defs)) {
    const c = defs[k].fontColor;
    if (!c) continue;
    const key = c.toLowerCase();
    if (map[key]) { defs[k].fontColor = map[key]; changed++; }
    else { missed[c] = (missed[c] || 0) + 1; }
  }
}
recolor(j.iconDefinitions);
recolor(j.light && j.light.iconDefinitions);
recolor(j.highContrast && j.highContrast.iconDefinitions);
writeFileSync(outPath, JSON.stringify(j, null, 2) + "\n");
console.log("recolored", changed, "missed", JSON.stringify(missed));
