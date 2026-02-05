// Calculate Nord-compliant color contrasts for Arctic Nord
// Background: #3b4252 (Nord 1)

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

const bg = hexToRgb('#3b4252'); // Nord 1
console.log('Background #3b4252 (Nord 1) luminance:', getLuminance(bg.r, bg.g, bg.b).toFixed(4));

console.log('\n=== NON-NORD vs NORD COLORS ===\n');

// Red colors
console.log('RED TOKENS:');
const currentRed = hexToRgb('#D88690');
const nordRed = hexToRgb('#BF616A');
console.log('Current #D88690:', getContrastRatio(bg, currentRed).toFixed(2) + ':1');
console.log('Nord 11 #BF616A:', getContrastRatio(bg, nordRed).toFixed(2) + ':1');

// Orange colors
console.log('\nORANGE TOKENS:');
const currentOrange = hexToRgb('#FFAC8F');
const nordOrange = hexToRgb('#D08770');
console.log('Current #FFAC8F:', getContrastRatio(bg, currentOrange).toFixed(2) + ':1');
console.log('Nord 12 #D08770:', getContrastRatio(bg, nordOrange).toFixed(2) + ':1');

// Comment colors
console.log('\nCOMMENT TOKENS:');
const currentComment = hexToRgb('#A1C9F1');
const nordCyan = hexToRgb('#88C0D0'); // Nord 8
const nordBlue1 = hexToRgb('#81A1C1'); // Nord 9
const nordBlue2 = hexToRgb('#5E81AC'); // Nord 10
console.log('Current #A1C9F1:', getContrastRatio(bg, currentComment).toFixed(2) + ':1');
console.log('Nord 8 #88C0D0 (Frost Cyan):', getContrastRatio(bg, nordCyan).toFixed(2) + ':1');
console.log('Nord 9 #81A1C1 (Frost Blue):', getContrastRatio(bg, nordBlue1).toFixed(2) + ':1');
console.log('Nord 10 #5E81AC (Frost Dark Blue):', getContrastRatio(bg, nordBlue2).toFixed(2) + ':1');

// Selection colors (for UI fixes)
console.log('\n=== SELECTION/DIFF COLORS ===\n');
const selectionBase = hexToRgb('#5E81AC'); // Nord 10
const insertedBase = hexToRgb('#88C0D0'); // Nord 8
const removedBase = hexToRgb('#BF616A'); // Nord 11

console.log('Selection base #5E81AC (Nord 10):', getContrastRatio(bg, selectionBase).toFixed(2) + ':1');
console.log('Inserted base #88C0D0 (Nord 8):', getContrastRatio(bg, insertedBase).toFixed(2) + ':1');
console.log('Removed base #BF616A (Nord 11):', getContrastRatio(bg, removedBase).toFixed(2) + ':1');

// Test opacity for selection/diffs
function blendColors(fg, bg, opacity) {
  return {
    r: fg.r * opacity + bg.r * (1 - opacity),
    g: fg.g * opacity + bg.g * (1 - opacity),
    b: fg.b * opacity + bg.b * (1 - opacity)
  };
}

console.log('\nSelection @ 35%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.35)).toFixed(2) + ':1');
console.log('Selection @ 50%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.50)).toFixed(2) + ':1');
console.log('Selection @ 60%:', getContrastRatio(bg, blendColors(selectionBase, bg, 0.60)).toFixed(2) + ':1');

console.log('\nInserted @ 30%:', getContrastRatio(bg, blendColors(insertedBase, bg, 0.30)).toFixed(2) + ':1');
console.log('Inserted @ 50%:', getContrastRatio(bg, blendColors(insertedBase, bg, 0.50)).toFixed(2) + ':1');

console.log('\nRemoved @ 30%:', getContrastRatio(bg, blendColors(removedBase, bg, 0.30)).toFixed(2) + ':1');
console.log('Removed @ 50%:', getContrastRatio(bg, blendColors(removedBase, bg, 0.50)).toFixed(2) + ':1');

// ============================================================
// CRITICAL: TEXT READABILITY ON HIGHLIGHTS
// ============================================================
console.log('\n=== TEXT READABILITY ON HIGHLIGHTS (DUAL CONTRAST) ===\n');

const textColor = hexToRgb('#ECEFF4'); // Nord 6 - typical light text on dark background
console.log('Text color: #ECEFF4 (Nord 6 Snow Storm)');
console.log('Text vs background:', getContrastRatio(bg, textColor).toFixed(2) + ':1 ✅\n');

// Selection text readability
console.log('SELECTION TEXT READABILITY:');
const selection35 = blendColors(selectionBase, bg, 0.35);
const selection40 = blendColors(selectionBase, bg, 0.40);
console.log('Text on selection @ 35% (canonical):', getContrastRatio(textColor, selection35).toFixed(2) + ':1', 
            getContrastRatio(textColor, selection35) >= 4.5 ? '✅ Excellent' : 
            getContrastRatio(textColor, selection35) >= 3.0 ? '⚠️ Acceptable (UI minimum)' : '❌ FAIL');
console.log('Text on selection @ 40% (stronger):', getContrastRatio(textColor, selection40).toFixed(2) + ':1',
            getContrastRatio(textColor, selection40) >= 4.5 ? '✅ Excellent' : 
            getContrastRatio(textColor, selection40) >= 3.0 ? '⚠️ Acceptable (UI minimum)' : '❌ FAIL');

// Diff text readability
console.log('\nDIFF TEXT READABILITY:');
const inserted30 = blendColors(insertedBase, bg, 0.30);
const inserted50 = blendColors(insertedBase, bg, 0.50);
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

// Canonical overlay targets for dark themes
const selOpacity = 0.35;
const diffOpacity = 0.30;
const findOpacity = 0.30;

const sel_plus_diff = 1 - (1 - selOpacity) * (1 - diffOpacity);
const sel_plus_diff_plus_find = 1 - (1 - selOpacity) * (1 - diffOpacity) * (1 - findOpacity);

console.log('Selection (35%) + Diff (30%):');
console.log('  Combined opacity:', (sel_plus_diff * 100).toFixed(0) + '%',
            sel_plus_diff <= 0.55 ? '✅ Under 55% cap' : '⚠️ Over 55% cap');

// Calculate actual color when compounded
const selection_blended = blendColors(selectionBase, bg, selOpacity);
const selection_plus_diff_blended = blendColors(insertedBase, selection_blended, diffOpacity);
console.log('  Text readability on combined:', 
            getContrastRatio(textColor, selection_plus_diff_blended).toFixed(2) + ':1',
            getContrastRatio(textColor, selection_plus_diff_blended) >= 3.0 ? '✅' : '❌ Text obscured!');

console.log('\nSelection (35%) + Diff (30%) + Find (30%):');
console.log('  Combined opacity:', (sel_plus_diff_plus_find * 100).toFixed(0) + '%',
            sel_plus_diff_plus_find <= 0.55 ? '✅ Under 55% cap' : '⚠️ Over 55% cap (triple stack)');

// Calculate actual color for triple compound
const triple_compound = blendColors(hexToRgb('#88C0D0'), selection_plus_diff_blended, findOpacity); // Assume cyan find
console.log('  Text readability on triple:', 
            getContrastRatio(textColor, triple_compound).toFixed(2) + ':1',
            getContrastRatio(textColor, triple_compound) >= 3.0 ? '✅' : '❌ Text obscured!');

// ============================================================
// RECOMMENDATIONS
// ============================================================
console.log('\n=== RECOMMENDATIONS ===\n');

const textOnSel35 = getContrastRatio(textColor, selection35);
const compoundOk = sel_plus_diff <= 0.55 && getContrastRatio(textColor, selection_plus_diff_blended) >= 3.0;

console.log('CANONICAL SETTINGS (35% selection, 30% diff):');
if (textOnSel35 >= 4.5 && compoundOk) {
  console.log('✅ SAFE - Text remains readable on all highlights');
  console.log('   - Text readability: ' + textOnSel35.toFixed(2) + ':1 ✅ Excellent');
  console.log('   - Compounded opacity: ' + (sel_plus_diff * 100).toFixed(0) + '% ✅ Safe');
  console.log('   - Compounded readability: ' + getContrastRatio(textColor, selection_plus_diff_blended).toFixed(2) + ':1 ✅');
} else if (textOnSel35 >= 3.0 && compoundOk) {
  console.log('⚠️ ACCEPTABLE but not ideal');
  console.log('   - Text readability: ' + textOnSel35.toFixed(2) + ':1 (meets UI minimum 3:1)');
  console.log('   - Consider: Reduce selection to 35% for better text contrast');
} else {
  console.log('❌ COMPROMISES text readability');
  console.log('   - Text on selection: ' + textOnSel35.toFixed(2) + ':1');
  console.log('   - Compounded opacity: ' + (sel_plus_diff * 100).toFixed(0) + '%');
  console.log('   - RECOMMENDED: Selection 35%, Diff 30%');
}

console.log('\nCanonical targets:');
console.log('   - Selection: 35% (dark) / 30% (light)');
console.log('   - Diff line: 30% (dark) / 25% (light)');
console.log('   - Diff text: 40% (dark) / 35% (light)');
console.log('   - Combined cap: 55% (dark) / 48-50% (light)');
