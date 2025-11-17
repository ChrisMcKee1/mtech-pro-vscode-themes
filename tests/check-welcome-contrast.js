const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'themes');
const files = fs.readdirSync(themesDir).filter((f) => f.endsWith('.json'));

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.replace('#', '');
  if (clean.length === 8) clean = clean.slice(0, 6);
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
  ];
}

function srgbToLin(value) {
  const v = value / 255;
  if (v <= 0.04045) return v / 12.92;
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(srgbToLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(bg, fg) {
  const l1 = luminance(bg);
  const l2 = luminance(fg);
  if (l1 == null || l2 == null) return null;
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

function getForeground(colors, bgKey) {
  const expected = bgKey.replace('Background', 'Foreground');
  const baseStem = bgKey.replace('HoverBackground', '');
  const candidates = [
    expected,
    `${baseStem}Foreground`,
    'welcomePage.buttonHoverForeground',
    'welcomePage.tileHoverForeground',
    'welcomePage.buttonForeground',
    'welcomePage.tileForeground',
    'foreground',
    'editor.foreground',
  ];
  const key = candidates.find((candidate) => typeof colors[candidate] === 'string');
  return { key, value: key ? colors[key] : null };
}

const rows = [];

for (const file of files) {
  const full = path.join(themesDir, file);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  const colors = data.colors || {};
  const themeName = file.replace('.json', '');

  const hoverKeys = Object.keys(colors).filter(
    (key) => key.startsWith('welcomePage.') && key.endsWith('HoverBackground')
  );

  hoverKeys.forEach((bgKey) => {
    const bgColor = colors[bgKey];
    const { key: fgKey, value: fgColor } = getForeground(colors, bgKey);
    const ratio = bgColor && fgColor ? contrast(bgColor, fgColor) : null;
    rows.push({
      theme: themeName,
      backgroundKey: bgKey,
      backgroundColor: bgColor || '--',
      foregroundKey: fgKey || '(fallback)',
      foregroundColor: fgColor || '--',
      ratio,
    });
  });
}

rows.sort((a, b) => {
  const aRatio = a.ratio ?? 99;
  const bRatio = b.ratio ?? 99;
  if (aRatio === bRatio) {
    return `${a.theme}:${a.backgroundKey}`.localeCompare(`${b.theme}:${b.backgroundKey}`);
  }
  return aRatio - bRatio;
});

const fmt = (value) => (value ? value.toFixed(2) : '--');

for (const row of rows) {
  console.log(
    `${row.theme.padEnd(22)} | ${row.backgroundKey.padEnd(35)} | ${row.backgroundColor} vs ${row.foregroundColor} (${row.foregroundKey}) -> ${fmt(row.ratio)}`
  );
}
