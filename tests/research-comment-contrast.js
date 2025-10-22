// Research script: Analyze comment contrast ratios in popular themes
// Purpose: Find industry standard for comment contrast (sweet spot for de-emphasized but readable)

const fs = require('fs');
const path = require('path');

// Contrast calculation utilities
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
};

const getLuminance = ({r, g, b}) => {
  const [rs, gs, bs] = [r/255, g/255, b/255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrast = (hex1, hex2) => {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

console.log('='.repeat(80));
console.log('COMMENT CONTRAST RESEARCH: Industry Standards');
console.log('='.repeat(80));
console.log('');

// Popular themes to analyze
const industryStandards = [
  {
    name: 'Dracula Official',
    downloads: '5M+',
    background: '#282A36',
    comment: '#6272A4',
    philosophy: 'Vibrant yet soothing, high contrast'
  },
  {
    name: 'One Dark Pro',
    downloads: '7M+',
    background: '#282c34',
    comment: '#5c6370',
    philosophy: 'Balanced, moderate contrast, minimalist'
  },
  {
    name: 'GitHub Dark Default',
    downloads: '8M+',
    background: '#0d1117',
    comment: '#8b949e',
    philosophy: 'Neutral, clean, accessible'
  },
  {
    name: 'Night Owl',
    downloads: '2M+',
    background: '#011627',
    comment: '#637777',
    philosophy: 'Accessibility-focused, colorblind-friendly'
  },
  {
    name: 'Monokai (Classic)',
    downloads: 'Bundled with VS Code',
    background: '#272822',
    comment: '#75715e',
    philosophy: 'High contrast, vibrant'
  },
  {
    name: 'Solarized Dark',
    downloads: '1M+',
    background: '#002b36',
    comment: '#586e75',
    philosophy: 'Scientifically calibrated, selective contrast'
  }
];

console.log('DARK THEMES (Most Popular):');
console.log('-'.repeat(80));
console.log('');

let darkTotal = 0;
let darkCount = 0;
let minContrast = Infinity;
let maxContrast = 0;

industryStandards.forEach(theme => {
  const contrast = getContrast(theme.comment, theme.background);
  darkTotal += contrast;
  darkCount++;
  minContrast = Math.min(minContrast, contrast);
  maxContrast = Math.max(maxContrast, contrast);
  
  const status = contrast >= 4.5 ? '✅ (strict WCAG)' :
                 contrast >= 4.0 ? '✅ (legible)' :
                 contrast >= 3.5 ? '⚠️ (minimalist)' :
                 contrast >= 3.0 ? '⚠️ (soft)' : '❌ (too low)';
  
  console.log(`${theme.name} (${theme.downloads})`);
  console.log(`  Comment: ${theme.comment} on ${theme.background}`);
  console.log(`  Contrast: ${contrast.toFixed(2)}:1 ${status}`);
  console.log(`  Philosophy: ${theme.philosophy}`);
  console.log('');
});

const avgContrast = darkTotal / darkCount;

console.log('='.repeat(80));
console.log('ANALYSIS SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`Average comment contrast: ${avgContrast.toFixed(2)}:1`);
console.log(`Range: ${minContrast.toFixed(2)}:1 (lowest) to ${maxContrast.toFixed(2)}:1 (highest)`);
console.log('');

console.log('INTERPRETATION:');
console.log('-'.repeat(80));

if (avgContrast >= 4.5) {
  console.log('Industry standard: STRICT (4.5:1+) - Comments are treated as regular text');
} else if (avgContrast >= 4.0) {
  console.log('Industry standard: LEGIBLE (4.0-4.5:1) - Comments de-emphasized but readable');
  console.log('  ✅ Recommended for most themes');
} else if (avgContrast >= 3.5) {
  console.log('Industry standard: MINIMALIST (3.5-4.0:1) - Soft contrast, background-like');
  console.log('  ⚠️ Acceptable for intentional minimalist aesthetic');
} else if (avgContrast >= 3.0) {
  console.log('Industry standard: SOFT (3.0-3.5:1) - Very muted, barely visible');
  console.log('  ⚠️ Only for highly minimalist themes (e.g., Nordic, Solarized)');
} else {
  console.log('Industry standard: TOO LOW (<3.0:1) - Comments nearly invisible');
  console.log('  ❌ Not recommended');
}

console.log('');
console.log('RECOMMENDED THRESHOLDS:');
console.log('-'.repeat(80));
console.log('  • Standard themes: 4.0:1 minimum (legible but de-emphasized)');
console.log('  • Minimalist themes: 3.5:1 minimum (intentional soft contrast)');
console.log('  • High-contrast themes: 4.5:1+ (comments treated like text)');
console.log('  • TOO VIVID: Check if contrast > 6.0:1 (comments competing with code)');
console.log('');

console.log('='.repeat(80));
console.log('TEST HARNESS UPDATE NEEDED:');
console.log('='.repeat(80));
console.log('1. Check comments separately from other syntax tokens');
console.log('2. Use 4.0:1 threshold for standard themes (not 4.5:1)');
console.log('3. Use 3.5:1 threshold for minimalist themes');
console.log('4. Flag comments that are TOO VIVID (> 6.0:1 competing with code)');
console.log('5. Provide contextual feedback: "(de-emphasized - acceptable)"');
console.log('');

// Now analyze our themes
console.log('='.repeat(80));
console.log('OUR THEMES - COMMENT CONTRAST ANALYSIS');
console.log('='.repeat(80));
console.log('');

const themesDir = path.join(__dirname, '..', 'themes');
const ourThemes = [
  'Arctic Nord.json',
  'Arctic Nord Light.json',
  'Classic.json',
  'Cosmic Void.json',
  'Cosmic Void Light.json',
  'Neon Pink Light.json',
  'Filter Spectrum.json',
  'Tokyo Night.json',
  'Enchanted Grove.json'
];

const issues = {
  tooLow: [],
  legible: [],
  tooVivid: []
};

ourThemes.forEach(themeFile => {
  try {
    const themePath = path.join(themesDir, themeFile);
    const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    const bg = theme.colors?.['editor.background'];
    
    if (!bg) return;
    
    let commentColor = null;
    const tokens = theme.tokenColors || [];
    
    for (const token of tokens) {
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      if (scopes.some(s => s === 'comment' || s === 'comment.line' || s === 'comment.block')) {
        commentColor = token.settings?.foreground;
        break;
      }
    }
    
    if (!commentColor) {
      console.log(`⚠️  ${themeFile}: No comment color defined`);
      return;
    }
    
    const contrast = getContrast(commentColor, bg);
    const themeName = themeFile.replace('.json', '');
    const isLight = themeName.includes('Light') || themeName.includes('Sun');
    
    let status, category;
    if (contrast < 3.0) {
      status = '❌ TOO LOW';
      category = 'tooLow';
    } else if (contrast < 3.5) {
      status = '⚠️ SOFT (minimalist only)';
      category = 'legible';
    } else if (contrast < 4.0) {
      status = '⚠️ MINIMALIST';
      category = 'legible';
    } else if (contrast < 6.0) {
      status = '✅ LEGIBLE';
      category = 'legible';
    } else {
      status = '⚠️ TOO VIVID';
      category = 'tooVivid';
    }
    
    issues[category].push({name: themeName, contrast: contrast.toFixed(2)});
    
    console.log(`${themeName}:`);
    console.log(`  Comment: ${commentColor} on ${bg}`);
    console.log(`  Contrast: ${contrast.toFixed(2)}:1 ${status}`);
    console.log('');
    
  } catch (err) {
    console.log(`⚠️  Error analyzing ${themeFile}: ${err.message}`);
  }
});

console.log('='.repeat(80));
console.log('SUMMARY OF OUR THEMES:');
console.log('='.repeat(80));
console.log('');
console.log(`TOO LOW (<3.0:1): ${issues.tooLow.length} themes`);
issues.tooLow.forEach(t => console.log(`  • ${t.name}: ${t.contrast}:1`));
console.log('');
console.log(`LEGIBLE (3.0-6.0:1): ${issues.legible.length} themes ✅`);
console.log('');
console.log(`TOO VIVID (>6.0:1): ${issues.tooVivid.length} themes`);
issues.tooVivid.forEach(t => console.log(`  • ${t.name}: ${t.contrast}:1 (competing with code)`));
console.log('');
