// Calculate contrast ratios for Arctic Nord Light fixes
// Background: #E5E9F0 (Nord Snow Storm 1)

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function blendColors(fg, bg, opacity) {
  return {
    r: Math.round(fg.r * opacity + bg.r * (1 - opacity)),
    g: Math.round(fg.g * opacity + bg.g * (1 - opacity)),
    b: Math.round(fg.b * opacity + bg.b * (1 - opacity))
  };
}

const bg = hexToRgb('#E5E9F0'); // Nord Snow Storm 1
console.log('Background #E5E9F0 luminance:', getLuminance(bg.r, bg.g, bg.b).toFixed(4));

console.log('\n=== SELECTION CONTRAST ===\n');
const selectionBase = hexToRgb('#5E81AC'); // Nord 10
console.log('Selection base #5E81AC (Nord 10):', getContrastRatio(bg, selectionBase).toFixed(2) + ':1');
console.log('Current @ 35%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.35)).toFixed(2) + ':1');
console.log('Proposed @ 50%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.50)).toFixed(2) + ':1');
console.log('Proposed @ 60%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.60)).toFixed(2) + ':1');

console.log('\n=== DIFF CONTRAST ===\n');
console.log('Inserted base #5E81AC (Nord 10):', getContrastRatio(bg, selectionBase).toFixed(2) + ':1');
console.log('Current @ 30%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.30)).toFixed(2) + ':1');
console.log('Proposed @ 50%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.50)).toFixed(2) + ':1');

const removedBase = hexToRgb('#BF616A'); // Nord 11
console.log('\nRemoved base #BF616A (Nord 11):', getContrastRatio(bg, removedBase).toFixed(2) + ':1');
console.log('Current @ 30%:', getContrastRatio(bg, blendColors(removedBase, bg, 0.30)).toFixed(2) + ':1');
console.log('Proposed @ 50%:', getContrastRatio(bg, blendColors(removedBase, bg, 0.50)).toFixed(2) + ':1');

console.log('\n=== BRACKET CONTRAST ===\n');
const currentBracket = hexToRgb('#a3be8c'); // Nord 14 Aurora Green
console.log('Current bracket #a3be8c (Nord 14):', getContrastRatio(bg, currentBracket).toFixed(2) + ':1');

// Try darker Nord alternatives
const nordBlue = hexToRgb('#2F6B91'); // Darker Nord-inspired blue
const nordDarkGreen = hexToRgb('#5E7A5E'); // Darkened Nord 14
const nordRed = hexToRgb('#963548'); // Already used for bracket 1
console.log('Option 1: #2F6B91 (darker blue):', getContrastRatio(bg, nordBlue).toFixed(2) + ':1');
console.log('Option 2: #5E7A5E (darkened green):', getContrastRatio(bg, nordDarkGreen).toFixed(2) + ':1');
console.log('Option 3: #963548 (Nord red already used):', getContrastRatio(bg, nordRed).toFixed(2) + ':1');

// ============================================================
// CRITICAL: TEXT READABILITY ON HIGHLIGHTS
// ============================================================
console.log('\n=== TEXT READABILITY ON HIGHLIGHTS (DUAL CONTRAST) ===\n');

const textColor = hexToRgb('#2E3440'); // Dark text on light background
console.log('Text color: #2E3440 (Nord 0 Polar Night)');
console.log('Text vs background:', getContrastRatio(bg, textColor).toFixed(2) + ':1 ✅\n');

// Selection text readability
console.log('SELECTION TEXT READABILITY:');
const selection35 = blendColors(selectionBase, bg, 0.35);
const selection60 = blendColors(selectionBase, bg, 0.60);
console.log('Text on selection @ 35%:', getContrastRatio(textColor, selection35).toFixed(2) + ':1', 
            getContrastRatio(textColor, selection35) >= 4.5 ? '✅ Excellent' : 
            getContrastRatio(textColor, selection35) >= 3.0 ? '⚠️ Acceptable (UI minimum)' : '❌ FAIL');
console.log('Text on selection @ 60%:', getContrastRatio(textColor, selection60).toFixed(2) + ':1',
            getContrastRatio(textColor, selection60) >= 4.5 ? '✅ Excellent' : 
            getContrastRatio(textColor, selection60) >= 3.0 ? '⚠️ Acceptable (UI minimum)' : '❌ FAIL');

// Diff text readability  
console.log('\nDIFF TEXT READABILITY:');
const inserted30 = blendColors(selectionBase, bg, 0.30);
const inserted50 = blendColors(selectionBase, bg, 0.50);
console.log('Text on inserted @ 30%:', getContrastRatio(textColor, inserted30).toFixed(2) + ':1',
            getContrastRatio(textColor, inserted30) >= 3.0 ? '✅' : '❌');
console.log('Text on inserted @ 50%:', getContrastRatio(textColor, inserted50).toFixed(2) + ':1',
            getContrastRatio(textColor, inserted50) >= 3.0 ? '✅' : '❌');

const removed30 = blendColors(removedBase, bg, 0.30);
const removed50 = blendColors(removedBase, bg, 0.50);
console.log('Text on removed @ 30%:', getContrastRatio(textColor, removed30).toFixed(2) + ':1',
            getContrastRatio(textColor, removed30) >= 3.0 ? '✅' : '❌');
console.log('Text on removed @ 50%:', getContrastRatio(textColor, removed50).toFixed(2) + ':1',
            getContrastRatio(textColor, removed50) >= 3.0 ? '✅' : '❌');

// ============================================================
// COMPOUNDING OPACITY (LAYERED HIGHLIGHTS)
// ============================================================
console.log('\n=== COMPOUNDING OPACITY ANALYSIS ===\n');

const selOpacity = 0.60;
const diffOpacity = 0.50;
const findOpacity = 0.50;

const sel_plus_diff = 1 - (1 - selOpacity) * (1 - diffOpacity);
const sel_plus_diff_plus_find = 1 - (1 - selOpacity) * (1 - diffOpacity) * (1 - findOpacity);

console.log('Selection (60%) + Diff (50%):');
console.log('  Combined opacity:', (sel_plus_diff * 100).toFixed(0) + '%',
            sel_plus_diff <= 0.70 ? '✅ Safe' : sel_plus_diff <= 0.80 ? '⚠️ Borderline' : '❌ Too opaque');

const selection_blended = blendColors(selectionBase, bg, selOpacity);
const selection_plus_diff_blended = blendColors(selectionBase, selection_blended, diffOpacity);
console.log('  Text readability on combined:', 
            getContrastRatio(textColor, selection_plus_diff_blended).toFixed(2) + ':1',
            getContrastRatio(textColor, selection_plus_diff_blended) >= 3.0 ? '✅' : '❌ Text obscured!');

console.log('\nSelection (60%) + Diff (50%) + Find (50%):');
console.log('  Combined opacity:', (sel_plus_diff_plus_find * 100).toFixed(0) + '%',
            sel_plus_diff_plus_find <= 0.70 ? '✅ Safe' : sel_plus_diff_plus_find <= 0.80 ? '⚠️ Borderline' : '❌ Too opaque');

const triple_compound = blendColors(selectionBase, selection_plus_diff_blended, findOpacity);
console.log('  Text readability on triple:', 
            getContrastRatio(textColor, triple_compound).toFixed(2) + ':1',
            getContrastRatio(textColor, triple_compound) >= 3.0 ? '✅' : '❌ Text obscured!');

// ============================================================
// RECOMMENDATIONS
// ============================================================
console.log('\n=== RECOMMENDATIONS ===\n');

const textOnSel60 = getContrastRatio(textColor, selection60);
const compoundOk = sel_plus_diff <= 0.80 && getContrastRatio(textColor, selection_plus_diff_blended) >= 3.0;

if (textOnSel60 >= 4.5 && compoundOk) {
  console.log('✅ Current settings (60% selection, 50% diff) are SAFE');
} else if (textOnSel60 >= 3.0 && compoundOk) {
  console.log('⚠️ Current settings are ACCEPTABLE but not ideal');
  console.log('   - Text readability: ' + textOnSel60.toFixed(2) + ':1 (meets UI minimum 3:1)');
  console.log('   - Consider: Reduce selection to 40% for better text contrast');
} else {
  console.log('❌ Current settings COMPROMISE text readability');
  console.log('   - Text on selection: ' + textOnSel60.toFixed(2) + ':1');
  console.log('   - Compounded opacity: ' + (sel_plus_diff * 100).toFixed(0) + '%');
  console.log('   - RECOMMENDED: Selection 35-40%, Diff 30%');
}

console.log('\nIndustry standard: Selection 20-30%, Diff 20-30%, Compounded ~40-50%');
