// Brighten Tokyo Night and Filter Moon colors by 15-20%
// Preserve hue, increase lightness

const fs = require('fs');

function hexToHSL(hex) {
  // Remove #
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function HSLToHex(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function brightenColor(hex, percent = 20) {
  const hsl = hexToHSL(hex);
  
  // Increase lightness by percent, cap at 95
  hsl.l = Math.min(95, hsl.l + percent);
  
  // Slightly increase saturation to keep colors vibrant (5-10%)
  hsl.s = Math.min(100, hsl.s + 5);
  
  return HSLToHex(hsl.h, hsl.s, hsl.l);
}

// Colors that should NOT be brightened (already bright or backgrounds)
const skipColors = [
  '#ffffff', '#f7768e', '#e0af68', '#9ece6a', '#73daca', 
  '#ff9e64', '#bb9af7', '#7dcfff', '#2ac3de', '#7aa2f7'
];

function shouldBrighten(color) {
  if (!color || !color.startsWith('#')) return false;
  if (color.length !== 7) return false; // Skip opacity colors
  if (skipColors.includes(color.toLowerCase())) return false;
  
  const hsl = hexToHSL(color);
  // Only brighten if lightness is below 70%
  return hsl.l < 70;
}

// List of key colors to brighten in Tokyo Night
const tokyoNightColors = {
  // These need brightening based on user feedback
  'Comments': '#565f89',  // Current: too dim
  'Line numbers': '#3b4261',  // Too dim
  'Variables/identifiers': '#a9b1d6',  // Could be brighter
  'Properties': '#a9b1d6',  // Same as variables
  'Parameters': '#a9b1d6',  // Same
  'Punctuation': '#89ddff',  // OK but could be slightly brighter
};

console.log('Tokyo Night Color Brightening Analysis\n');
console.log('=' .repeat(60));

for (const [name, color] of Object.entries(tokyoNightColors)) {
  if (shouldBrighten(color)) {
    const brightened = brightenColor(color, 20);
    const hslOld = hexToHSL(color);
    const hslNew = hexToHSL(brightened);
    
    console.log(`\n${name}:`);
    console.log(`  Current:    ${color} (L: ${hslOld.l.toFixed(1)}%)`);
    console.log(`  Brightened: ${brightened} (L: ${hslNew.l.toFixed(1)}%)`);
    console.log(`  Increase:   +${(hslNew.l - hslOld.l).toFixed(1)}% lightness`);
  } else {
    console.log(`\n${name}: ${color} (skipped - already bright enough)`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\nRecommended replacements for Tokyo Night:\n');

const replacements = [
  { from: '#565f89', to: brightenColor('#565f89', 25), desc: 'Comments' },
  { from: '#3b4261', to: brightenColor('#3b4261', 30), desc: 'Line numbers' },
  { from: '#a9b1d6', to: brightenColor('#a9b1d6', 15), desc: 'Variables/identifiers' },
];

replacements.forEach(r => {
  console.log(`${r.desc}:`);
  console.log(`  ${r.from} → ${r.to}`);
});
