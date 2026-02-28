const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const themesDir = path.join(repo, 'themes');
const targets = [
  'Copper Bloom',
  'Cosmic Void',
  'Cyberpunk Neon',
  'Digital Aqua',
  'Enchanted Grove Dark',
  'Feisty Fusion',
  'Graphite Bay',
  'Mystic Dusk',
  'Obsidian Moss',
  'OGE Dark',
  'Tokyo Night',
  'Evening Espresso',
];

function hexToRgba(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return null;
  const c = hex.slice(1);
  if (!(c.length === 6 || c.length === 8)) return null;
  const n = parseInt(c, 16);
  if (Number.isNaN(n)) return null;
  if (c.length === 6) return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  return { r: (n >> 24) & 255, g: (n >> 16) & 255, b: (n >> 8) & 255, a: (n & 255) / 255 };
}

function blend(fg, bg) {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

function srgb(v) {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(c) {
  return 0.2126 * srgb(c.r) + 0.7152 * srgb(c.g) + 0.0722 * srgb(c.b);
}

function contrast(c1, c2) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const checks = [
  ['foreground', 'sideBar.background', 'editor.background', 4.5],
  ['descriptionForeground', 'sideBar.background', 'editor.background', 4.5],
  ['disabledForeground', 'editor.background', 'editor.background', 4.5],
  ['input.placeholderForeground', 'input.background', 'editor.background', 4.5],
  ['panelTitle.inactiveForeground', 'panel.background', 'panel.background', 4.5],
  ['tab.inactiveForeground', 'tab.inactiveBackground', 'editor.background', 4.5],
  ['titleBar.inactiveForeground', 'titleBar.inactiveBackground', 'editor.background', 4.5],
  ['terminal.foreground', 'terminal.background', 'editor.background', 4.5],
  ['textPreformat.foreground', 'textCodeBlock.background', 'editor.background', 4.5],
];

let any = false;
for (const themeName of targets) {
  const filePath = path.join(themesDir, `${themeName}.json`);
  if (!fs.existsSync(filePath)) continue;
  const theme = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const colors = theme.colors || {};

  const failures = [];
  for (const [fgKey, bgKey, bgFallbackKey, min] of checks) {
    const fgRaw = colors[fgKey];
    const bgRaw = colors[bgKey] || colors[bgFallbackKey] || '#000000';
    const fg = hexToRgba(fgRaw);
    const bg = hexToRgba(bgRaw);
    if (!fg || !bg) continue;
    const finalFg = fg.a < 1 ? blend(fg, bg) : fg;
    const ratio = contrast(finalFg, bg);
    if (ratio < min) {
      failures.push({ fgKey, bgKey, ratio, fgRaw, bgRaw });
    }
  }

  if (failures.length > 0) {
    any = true;
    console.log(`\n${themeName}`);
    for (const failure of failures) {
      console.log(
        `  - ${failure.fgKey} on ${failure.bgKey} = ${failure.ratio.toFixed(2)} (${failure.fgRaw} on ${failure.bgRaw})`
      );
    }
  }
}

if (!any) {
  console.log('No failures under this check set.');
}
