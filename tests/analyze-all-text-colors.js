// Comprehensive text color analysis for Tokyo Night and Filter Moon
// Find ALL text-related properties that might be too dim

const fs = require('fs');
const path = require('path');

function hexToHSL(hex) {
  hex = hex.replace('#', '');
  if (hex.length !== 6) return null;
  
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

function brightenColor(hex, percent = 15) {
  const hsl = hexToHSL(hex);
  if (!hsl) return hex;
  
  // Increase lightness
  hsl.l = Math.min(95, hsl.l + percent);
  // Slightly increase saturation for vibrancy
  hsl.s = Math.min(100, hsl.s + 3);
  
  return HSLToHex(hsl.h, hsl.s, hsl.l);
}

// Text-related property patterns (comprehensive list)
const textProperties = [
  // Direct foreground colors
  'foreground',
  '.foreground',
  'activeForeground',
  'inactiveForeground',
  
  // Specific text areas
  'editor.foreground',
  'editorLineNumber',
  'editorCursor',
  'list.',
  'tree.',
  'menu.',
  'tab.',
  'breadcrumb.',
  'statusBar.',
  'titleBar.',
  'sideBar.',
  'panel.',
  'terminal.',
  'input.',
  'dropdown.',
  'button.',
  'badge.',
  'notification.',
  'quickInput.',
  'peekView.',
  'suggestWidget.',
  'parameterHints.',
  'editorWidget.',
  'editorHoverWidget.',
  'debugConsole.',
  'welcomePage.',
  'walkThrough.',
  'gitDecoration.',
  'chat.',
  'inlineChat.',
  'editorGutter.',
  'editorOverviewRuler.',
  'editorError.foreground',
  'editorWarning.foreground',
  'editorInfo.foreground',
  'editorHint.foreground',
];

function analyzeTheme(themeName) {
  const themePath = path.join(__dirname, '..', 'themes', `${themeName}.json`);
  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  
  console.log('\n' + '='.repeat(80));
  console.log(`THEME: ${themeName}`);
  console.log('='.repeat(80));
  
  const dimColors = [];
  const colors = theme.colors || {};
  
  // Analyze all color properties
  for (const [key, value] of Object.entries(colors)) {
    // Check if it's a text-related property
    const isTextProperty = textProperties.some(pattern => key.includes(pattern));
    
    if (isTextProperty && typeof value === 'string' && value.startsWith('#')) {
      // Only check 6-character hex (no opacity)
      const cleanHex = value.slice(0, 7);
      if (cleanHex.length === 7) {
        const hsl = hexToHSL(cleanHex);
        
        if (hsl && hsl.l < 60) {  // Less than 60% lightness
          dimColors.push({
            property: key,
            color: cleanHex,
            lightness: hsl.l,
            brightened: brightenColor(cleanHex, 18)
          });
        }
      }
    }
  }
  
  // Sort by lightness (darkest first)
  dimColors.sort((a, b) => a.lightness - b.lightness);
  
  if (dimColors.length > 0) {
    console.log(`\nFound ${dimColors.length} dim text colors (< 60% lightness):\n`);
    
    dimColors.forEach((item, index) => {
      console.log(`${index + 1}. ${item.property}`);
      console.log(`   Current:    ${item.color} (L: ${item.lightness.toFixed(1)}%)`);
      console.log(`   Brightened: ${item.brightened}`);
      console.log('');
    });
    
    // Generate PowerShell replacement commands
    console.log('\n' + '-'.repeat(80));
    console.log('SUGGESTED REPLACEMENTS (PowerShell commands):');
    console.log('-'.repeat(80) + '\n');
    
    dimColors.forEach(item => {
      console.log(`# ${item.property} (${item.lightness.toFixed(1)}% → brighter)`);
      console.log(`(Get-Content "themes/${themeName}.json" -Raw) -replace '"${item.color}"', '"${item.brightened}"' | Set-Content "themes/${themeName}.json" -NoNewline`);
      console.log('');
    });
  } else {
    console.log('\n✓ No dim text colors found! All text is sufficiently bright.\n');
  }
  
  // Also check tokenColors for syntax highlighting
  console.log('\n' + '-'.repeat(80));
  console.log('SYNTAX TOKEN ANALYSIS (tokenColors):');
  console.log('-'.repeat(80) + '\n');
  
  const tokenColors = theme.tokenColors || [];
  const dimTokens = [];
  
  tokenColors.forEach(token => {
    if (token.settings && token.settings.foreground) {
      const fg = token.settings.foreground;
      if (fg.startsWith('#') && fg.length === 7) {
        const hsl = hexToHSL(fg);
        if (hsl && hsl.l < 55) {  // Syntax tokens should be even brighter
          dimTokens.push({
            name: token.settings.name || 'Unnamed',
            scope: Array.isArray(token.scope) ? token.scope.join(', ') : token.scope,
            color: fg,
            lightness: hsl.l,
            brightened: brightenColor(fg, 20)
          });
        }
      }
    }
  });
  
  dimTokens.sort((a, b) => a.lightness - b.lightness);
  
  if (dimTokens.length > 0) {
    console.log(`Found ${dimTokens.length} dim syntax tokens (< 55% lightness):\n`);
    
    dimTokens.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Scope: ${item.scope}`);
      console.log(`   Current:    ${item.color} (L: ${item.lightness.toFixed(1)}%)`);
      console.log(`   Brightened: ${item.brightened}`);
      console.log('');
    });
  } else {
    console.log('✓ All syntax tokens are sufficiently bright!\n');
  }
}

// Analyze both themes
['Tokyo Night', 'Filter Moon'].forEach(analyzeTheme);

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
console.log('\nReview the suggestions above and apply the brightenings that make sense.');
console.log('Remember: Tokyo Night = "dark with bright city lights" (not neon)');
console.log('');
