// Batch Theme Analysis - Remaining 17 MEDIUM themes
// Focuses on research priorities: semantic correctness, critical contrast

const fs = require('fs');
const path = require('path');

const themes = [
  'Feisty Fusion', 'Filter Spectrum', 'Enchanted Grove Dark', 'Filter Machine',
  'Filter Octagon', 'Filter Ristretto', 'Tokyo Night', // 4-5 issues
  'Arctic Nord Light', 'Classic', 'Cosmic Void Light', 'Cosmic Void',
  'Cyberpunk Neon', 'Feisty Fusion Light', 'Filter Moon', 
  'Neon Pink Light', 'Tokyo Day', 'OGE Dark' // 2-3 issues
];

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

console.log('='.repeat(70));
console.log('BATCH THEME ANALYSIS - 17 MEDIUM Priority Themes');
console.log('Focus: Semantic correctness + Critical contrast');
console.log('='.repeat(70));
console.log('');

themes.forEach(themeName => {
  const themePath = path.join(__dirname, '..', 'themes', `${themeName}.json`);
  
  if (!fs.existsSync(themePath)) {
    console.log(`❌ ${themeName}: FILE NOT FOUND`);
    return;
  }
  
  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const bg = theme.colors?.['editor.background'] || '#000000';
  const fg = theme.colors?.['editor.foreground'] || '#ffffff';
  
  console.log(`\n📋 ${themeName.toUpperCase()} (${theme.type || 'unknown'})`);
  console.log(`   Background: ${bg}`);
  console.log('   ---');
  
  // Find token colors
  const tokens = theme.tokenColors || [];
  
  let keywordColor = null;
  let functionColor = null;
  let stringColor = null;
  let commentColor = null;
  
  tokens.forEach(token => {
    const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
    const color = token.settings?.foreground;
    
    if (scopes.some(s => s === 'keyword.control' || s === 'keyword')) keywordColor = color;
    if (scopes.some(s => s === 'entity.name.function' || s === 'support.function')) functionColor = color;
    if (scopes.some(s => s === 'string')) stringColor = color;
    if (scopes.some(s => s === 'comment' || s?.startsWith('comment '))) commentColor = color;
  });
  
  // SEMANTIC CHECK
  const issues = [];
  
  if (functionColor && stringColor && functionColor === stringColor) {
    issues.push(`   🚨 SEMANTIC: Functions=${functionColor} SAME as Strings (CRITICAL)`);
  }
  
  if (keywordColor && functionColor && keywordColor === functionColor) {
    issues.push(`   ⚠️  SEMANTIC: Keywords=${keywordColor} SAME as Functions`);
  }
  
  // CONTRAST CHECK (only if we have colors)
  if (keywordColor) {
    const contrast = getContrast(keywordColor, bg);
    if (contrast < 4.5) {
      issues.push(`   ❌ CONTRAST: Keywords ${keywordColor} = ${contrast.toFixed(2)}:1 (need 4.5:1)`);
    }
  }
  
  if (commentColor) {
    const contrast = getContrast(commentColor, bg);
    if (contrast < 4.0) {
      issues.push(`   ❌ CONTRAST: Comments ${commentColor} = ${contrast.toFixed(2)}:1 (need 4.0:1+)`);
    }
  }
  
  // SELECTION CHECK
  const selection = theme.colors?.['editor.selectionBackground'];
  if (selection) {
    const opacityMatch = selection.match(/([0-9a-fA-F]{2})$/);
    if (opacityMatch) {
      const opacity = parseInt(opacityMatch[1], 16) / 255;
      if (opacity < 0.30) {
        issues.push(`   ⚠️  OPACITY: Selection ${Math.round(opacity*100)}% (too low, recommend 30-50%)`);
      } else if (opacity > 0.60) {
        issues.push(`   ⚠️  OPACITY: Selection ${Math.round(opacity*100)}% (too high, recommend 30-50%)`);
      }
    }
  }
  
  if (issues.length === 0) {
    console.log('   ✅ No major semantic or contrast issues detected');
  } else {
    issues.forEach(issue => console.log(issue));
  }
});

console.log('');
console.log('='.repeat(70));
console.log('ANALYSIS COMPLETE');
console.log('Priority: Fix SEMANTIC issues first (functions/strings/keywords distinct)');
console.log('Then: Address CONTRAST failures <4.5:1');
console.log('Finally: Adjust OPACITY (selection/diffs)');
console.log('='.repeat(70));
