// Generates an EXACT color-swap variant of a theme or icon-theme JSON file.
//
// It deep-walks the JSON and rotates ONLY hex colors whose hue falls in the
// green/teal band [75,175] by a fixed delta, preserving saturation, lightness,
// and alpha. Every key, scope, ordering, and non-green accent (coral, gold,
// orange, blue, lavender) is left untouched — so the variant is structurally
// identical to the source and only the green base shifts to the target hue.
//
// Usage (from repo root):
//   node tools/variant-gen/make-variant.mjs --in "themes/Grove Night.json" \
//        --out "themes/Crimson Night.json" --delta -140 --name "Crimson Night"
//
// --name (optional) only rewrites the top-level "name" field (theme files).
// Icon-theme files: omit --name; colors are swapped, structure preserved.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const getArg = (n, fallback = null) => {
  const i = args.indexOf(`--${n}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

const inPath = getArg("in");
const outPath = getArg("out");
const delta = Number(getArg("delta"));
const newName = getArg("name");

if (!inPath || !outPath || Number.isNaN(delta)) {
  console.error("Required: --in <path> --out <path> --delta <degrees> [--name <themeName>]");
  process.exit(1);
}

const GREEN_BAND = [75, 175]; // inclusive hue window that defines the grove identity

const hexRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function expand(hex) {
  // returns { r,g,b, a (string|"") } from #rgb / #rrggbb / #rrggbbaa
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? h.slice(6, 8) : "";
  return { r, g, b, a };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      default: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0").toUpperCase();
  return `${to(r)}${to(g)}${to(b)}`;
}

let swapped = 0;
let preserved = 0;

function transformHex(hex) {
  const { r, g, b, a } = expand(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  // neutral (s===0) or out-of-band hues pass through unchanged
  if (s === 0 || h < GREEN_BAND[0] || h > GREEN_BAND[1]) {
    preserved++;
    return hex;
  }
  swapped++;
  return `#${hslToRgb(h + delta, s, l)}${a.toUpperCase()}`;
}

function walk(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      if (typeof node[i] === "string" && hexRe.test(node[i])) node[i] = transformHex(node[i]);
      else if (node[i] && typeof node[i] === "object") walk(node[i]);
    }
  } else if (node && typeof node === "object") {
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (typeof v === "string" && hexRe.test(v)) node[k] = transformHex(v);
      else if (v && typeof v === "object") walk(v);
    }
  }
}

const raw = await readFile(inPath, "utf8");
const json = JSON.parse(raw);
walk(json);
if (newName && typeof json.name === "string") json.name = newName;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, JSON.stringify(json, null, 2) + "\n", "utf8");

console.log(`${inPath} -> ${outPath}`);
console.log(`  delta ${delta}deg  swapped ${swapped} green hexes  preserved ${preserved}`);
