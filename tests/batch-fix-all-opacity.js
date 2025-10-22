// Batch Fix All Selection/Diff Opacity Issues
// Systematic refactor respecting each theme's unique palette

const fs = require('fs');
const path = require('path');

// Contrast calculation helpers (same as previous scripts)
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
};

const rgbToHex = ({r, g, b}) => {
  return '#' + [r,g,b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
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

const blendColors = (foregroundHex, backgroundHex, opacity) => {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  
  return {
    r: Math.round(fg.r * opacity + bg.r * (1 - opacity)),
    g: Math.round(fg.g * opacity + bg.g * (1 - opacity)),
    b: Math.round(fg.b * opacity + bg.b * (1 - opacity))
  };
};

const opacityToHex = (opacity) => {
  return Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
};

// Theme-specific opacity strategies
const themeConfigs = [
  // Already fixed
  { name: 'Arctic Nord', status: '✅ Fixed (35/30)' },
  { name: 'OGE Light', status: '✅ Fixed (30/25)' },
  
  // URGENT - Enchanted Grove (HIGH priority, 7 issues)
  {
    name: 'Enchanted Grove',
    type: 'light',
    identity: 'Mystical forest (earthy greens, purples)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  
  // MEDIUM priority themes (fix in batch)
  {
    name: 'Arctic Nord Light',
    type: 'light',
    identity: 'Nordic winter (light variant)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'Classic',
    type: 'dark',
    identity: 'Traditional Monokai-inspired',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Cosmic Void Light',
    type: 'light',
    identity: 'Deep space (light variant)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'Cosmic Void',
    type: 'dark',
    identity: 'Deep space exploration',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Cyberpunk Neon',
    type: 'dark',
    identity: 'Electric neon (preserve vibrancy)',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Enchanted Grove Dark',
    type: 'dark',
    identity: 'Mystical forest night',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Feisty Fusion Light',
    type: 'light',
    identity: 'Industrial fusion (light)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'Feisty Fusion',
    type: 'dark',
    identity: 'Industrial fusion',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Machine',
    type: 'dark',
    identity: 'Industrial precision',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Moon',
    type: 'dark',
    identity: 'Purple moonlight',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Octagon',
    type: 'dark',
    identity: 'Balanced neutrals',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Ristretto',
    type: 'dark',
    identity: 'Coffee tones',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Spectrum',
    type: 'dark',
    identity: 'Rainbow spectrum',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Filter Sun',
    type: 'light',
    identity: 'Energetic brightness',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'Neon Pink Light',
    type: 'light',
    identity: 'Hot pink neon (light)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'OGE Dark',
    type: 'dark',
    identity: 'Elegant dark mode',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  },
  {
    name: 'Tokyo Day',
    type: 'light',
    identity: 'Tokyo Night (light variant)',
    targetSel: 0.30,
    targetDiffLine: 0.25,
    targetDiffText: 0.35,
    targetGutter: 0.40
  },
  {
    name: 'Tokyo Night',
    type: 'dark',
    identity: 'Neon-soaked night',
    targetSel: 0.35,
    targetDiffLine: 0.30,
    targetDiffText: 0.40,
    targetGutter: 0.50
  }
];

console.log('='.repeat(80));
console.log('BATCH SELECTION/DIFF OPACITY FIX - ALL THEMES');
console.log('='.repeat(80));
console.log('');
console.log(`Themes to process: ${themeConfigs.filter(t => !t.status).length}`);
console.log(`Already fixed: 2 (Arctic Nord, OGE Light)`);
console.log('');

const themesDir = path.join(__dirname, '..', 'themes');
let fixedCount = 0;
let skippedCount = 0;
const results = [];

themeConfigs.forEach(config => {
  if (config.status) {
    console.log(`⏭️  ${config.name}: ${config.status}`);
    skippedCount++;
    return;
  }
  
  const themePath = path.join(themesDir, `${config.name}.json`);
  
  if (!fs.existsSync(themePath)) {
    console.log(`⚠️  ${config.name}: File not found`);
    results.push({ name: config.name, status: 'NOT FOUND' });
    return;
  }
  
  console.log('');
  console.log(`🔧 Fixing ${config.name} (${config.identity})...`);
  
  try {
    let theme = fs.readFileSync(themePath, 'utf8');
    const themeObj = JSON.parse(theme);
    
    // Extract current colors
    const bg = themeObj.colors['editor.background'];
    const selectionCurrent = themeObj.colors['editor.selectionBackground'];
    
    if (!selectionCurrent) {
      console.log(`  ⚠️  No selection background defined`);
      results.push({ name: config.name, status: 'NO SELECTION' });
      return;
    }
    
    // Extract base color (remove opacity)
    const selectionBase = selectionCurrent.slice(0, 7);
    
    // Find diff colors
    const diffInsertedLine = themeObj.colors['diffEditor.insertedLineBackground'];
    const diffRemovedLine = themeObj.colors['diffEditor.removedLineBackground'];
    
    if (!diffInsertedLine || !diffRemovedLine) {
      console.log(`  ⚠️  Diff colors not fully defined`);
      results.push({ name: config.name, status: 'INCOMPLETE DIFFS' });
      return;
    }
    
    const diffInsertedBase = diffInsertedLine.slice(0, 7);
    const diffRemovedBase = diffRemovedLine.slice(0, 7);
    
    // Calculate new values
    const newSelOpacity = opacityToHex(config.targetSel);
    const newDiffLineOpacity = opacityToHex(config.targetDiffLine);
    const newDiffTextOpacity = opacityToHex(config.targetDiffText);
    const newGutterOpacity = opacityToHex(config.targetGutter);
    
    console.log(`  Selection: ${(config.targetSel*100).toFixed(0)}% (0x${newSelOpacity})`);
    console.log(`  Diff lines: ${(config.targetDiffLine*100).toFixed(0)}% (0x${newDiffLineOpacity})`);
    console.log(`  Diff text: ${(config.targetDiffText*100).toFixed(0)}% (0x${newDiffTextOpacity})`);
    console.log(`  Gutter: ${(config.targetGutter*100).toFixed(0)}% (0x${newGutterOpacity})`);
    
    // Update theme object
    themeObj.colors['editor.selectionBackground'] = `${selectionBase}${newSelOpacity}`;
    themeObj.colors['diffEditor.insertedLineBackground'] = `${diffInsertedBase}${newDiffLineOpacity}`;
    themeObj.colors['diffEditor.removedLineBackground'] = `${diffRemovedBase}${newDiffLineOpacity}`;
    
    // Update diff text if exists
    if (themeObj.colors['diffEditor.insertedTextBackground']) {
      const base = themeObj.colors['diffEditor.insertedTextBackground'].slice(0, 7);
      themeObj.colors['diffEditor.insertedTextBackground'] = `${base}${newDiffTextOpacity}`;
    }
    if (themeObj.colors['diffEditor.removedTextBackground']) {
      const base = themeObj.colors['diffEditor.removedTextBackground'].slice(0, 7);
      themeObj.colors['diffEditor.removedTextBackground'] = `${base}${newDiffTextOpacity}`;
    }
    
    // Update gutter if exists
    if (themeObj.colors['diffEditorGutter.insertedLineBackground']) {
      const base = themeObj.colors['diffEditorGutter.insertedLineBackground'].slice(0, 7);
      themeObj.colors['diffEditorGutter.insertedLineBackground'] = `${base}${newGutterOpacity}`;
    }
    if (themeObj.colors['diffEditorGutter.removedLineBackground']) {
      const base = themeObj.colors['diffEditorGutter.removedLineBackground'].slice(0, 7);
      themeObj.colors['diffEditorGutter.removedLineBackground'] = `${base}${newGutterOpacity}`;
    }
    
    // Write back to file
    fs.writeFileSync(themePath, JSON.stringify(themeObj, null, 2), 'utf8');
    
    console.log(`  ✅ Updated successfully`);
    fixedCount++;
    results.push({ name: config.name, status: 'FIXED', opacity: `${config.targetSel}/${config.targetDiffLine}` });
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: config.name, status: 'ERROR', error: error.message });
  }
});

console.log('');
console.log('='.repeat(80));
console.log('BATCH FIX SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`✅ Fixed: ${fixedCount} themes`);
console.log(`⏭️  Skipped: ${skippedCount} (already fixed)`);
console.log(`⚠️  Issues: ${results.filter(r => r.status !== 'FIXED' && r.status !== 'NOT FOUND').length}`);
console.log('');

if (results.length > 0) {
  console.log('Details:');
  results.forEach(r => {
    const icon = r.status === 'FIXED' ? '✅' : r.status === 'NOT FOUND' ? '⚠️' : '❌';
    console.log(`  ${icon} ${r.name}: ${r.status}${r.opacity ? ` (${r.opacity})` : ''}`);
  });
  console.log('');
}

console.log('Next steps:');
console.log('1. Run: .\\run-tests.cmd --contrast');
console.log('2. Verify: 58 HIGH issues → 0-5 remaining');
console.log('3. Manual test: Selection + diff in multiple themes');
console.log('4. Document: Update THEME_IMPROVEMENTS_ANALYSIS.md');
