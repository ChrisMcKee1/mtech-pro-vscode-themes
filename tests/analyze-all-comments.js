// Comprehensive comment analysis across ALL themes
// Purpose: Identify comment issues after implementing industry-standard thresholds

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
console.log('COMPREHENSIVE COMMENT ANALYSIS - ALL 21 THEMES');
console.log('Industry Standard: 4.0:1 (legible), 3.5:1 (minimalist), < 6.0:1 (not too vivid)');
console.log('='.repeat(80));
console.log('');

const themesDir = path.join(__dirname, '..', 'themes');
const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));

const minimalistThemes = ['Arctic Nord', 'Arctic Nord Light', 'Enchanted Grove'];

const results = {
  tooLow: [],        // < 3.5:1 (CRITICAL)
  minimalist: [],    // 3.5-4.0:1 (ACCEPTABLE for minimalist)
  optimal: [],       // 4.0-6.0:1 (IDEAL)
  tooVivid: [],      // > 6.0:1 (COMPETING WITH CODE)
  noComment: []      // No comment color defined
};

themeFiles.forEach(themeFile => {
  try {
    const themePath = path.join(themesDir, themeFile);
    const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    const bg = theme.colors?.['editor.background'];
    const themeName = themeFile.replace('.json', '');
    const isMinimalist = minimalistThemes.some(m => themeName.includes(m));
    
    if (!bg) {
      results.noComment.push({name: themeName, reason: 'No background'});
      return;
    }
    
    let commentColor = null;
    const tokens = theme.tokenColors || [];
    
    for (const token of tokens) {
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      if (scopes.some(s => s && (s === 'comment' || s.includes('comment.')))) {
        commentColor = token.settings?.foreground;
        break;
      }
    }
    
    if (!commentColor) {
      results.noComment.push({name: themeName, reason: 'No comment style'});
      return;
    }
    
    const contrast = getContrast(commentColor, bg);
    const isLight = themeName.includes('Light') || themeName.includes('Sun') || themeName.includes('Day');
    
    const entry = {
      name: themeName,
      contrast: contrast.toFixed(2),
      color: commentColor,
      background: bg,
      type: isLight ? 'light' : 'dark',
      minimalist: isMinimalist
    };
    
    if (contrast < 3.5) {
      results.tooLow.push({...entry, priority: 'CRITICAL'});
    } else if (contrast < 4.0) {
      results.minimalist.push({...entry, priority: isMinimalist ? 'OK' : 'LOW'});
    } else if (contrast <= 6.0) {
      results.optimal.push(entry);
    } else {
      results.tooVivid.push({...entry, priority: 'MEDIUM'});
    }
    
  } catch (err) {
    console.log(`⚠️  Error analyzing ${themeFile}: ${err.message}`);
  }
});

console.log('📊 RESULTS SUMMARY');
console.log('='.repeat(80));
console.log('');

console.log(`✅ OPTIMAL (4.0-6.0:1): ${results.optimal.length} themes`);
results.optimal.forEach(t => {
  console.log(`   ${t.name} (${t.type}): ${t.contrast}:1`);
});
console.log('');

console.log(`⚠️  MINIMALIST RANGE (3.5-4.0:1): ${results.minimalist.length} themes`);
results.minimalist.forEach(t => {
  const status = t.priority === 'OK' ? '✓ Minimalist theme' : '→ Consider increasing to 4.0:1';
  console.log(`   ${t.name} (${t.type}): ${t.contrast}:1 ${status}`);
});
console.log('');

console.log(`❌ TOO LOW (<3.5:1): ${results.tooLow.length} themes [CRITICAL]`);
results.tooLow.forEach(t => {
  console.log(`   ${t.name} (${t.type}): ${t.contrast}:1`);
  console.log(`      Current: ${t.color} on ${t.background}`);
  console.log(`      Action: Increase to 3.5:1 minimum (4.0:1 recommended)`);
});
console.log('');

console.log(`🔆 TOO VIVID (>6.0:1): ${results.tooVivid.length} themes [MEDIUM]`);
results.tooVivid.forEach(t => {
  console.log(`   ${t.name} (${t.type}): ${t.contrast}:1`);
  console.log(`      Current: ${t.color} on ${t.background}`);
  console.log(`      Action: Reduce to 4.0-6.0:1 range (de-emphasize)`);
});
console.log('');

if (results.noComment.length > 0) {
  console.log(`⚠️  NO COMMENT STYLE: ${results.noComment.length} themes`);
  results.noComment.forEach(t => {
    console.log(`   ${t.name}: ${t.reason}`);
  });
  console.log('');
}

console.log('='.repeat(80));
console.log('PRIORITY QUEUE');
console.log('='.repeat(80));
console.log('');
console.log(`1. CRITICAL (${results.tooLow.length}): Fix comments < 3.5:1`);
results.tooLow.forEach(t => console.log(`   • ${t.name}`));
console.log('');
console.log(`2. MEDIUM (${results.tooVivid.length}): Reduce comments > 6.0:1`);
results.tooVivid.forEach(t => console.log(`   • ${t.name}`));
console.log('');
console.log(`3. LOW (${results.minimalist.filter(t => t.priority === 'LOW').length}): Non-minimalist themes in 3.5-4.0:1 range`);
results.minimalist.filter(t => t.priority === 'LOW').forEach(t => console.log(`   • ${t.name}`));
console.log('');

console.log('='.repeat(80));
console.log('RECOMMENDED NEXT STEPS');
console.log('='.repeat(80));
console.log('1. Fix CRITICAL themes (too low contrast - readability issue)');
console.log('2. Fix MEDIUM themes (too vivid - competing with code)');
console.log('3. Review LOW themes (consider theme identity before changing)');
console.log('4. Run full contrast analysis to verify all improvements');
console.log('');
