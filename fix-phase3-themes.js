#!/usr/bin/env node
/**
 * Phase 3 Theme Fixes - Filter Ristretto, Filter Spectrum, Tokyo Day
 * 
 * Fixes 9 properties per theme (27 total):
 * - Filter Ristretto: Coffee/espresso warmth (red focus)
 * - Filter Spectrum: Rainbow vibrancy (purple focus)
 * - Tokyo Day: Urban daytime energy (green focus) - LIGHT THEME
 * 
 * All colors from existing theme palettes.
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Phase 3: Fixing Filter Ristretto, Filter Spectrum, Tokyo Day\n');

// Theme paths
const themesDir = path.join(__dirname, 'themes');
const ristrettoPath = path.join(themesDir, 'Filter Ristretto.json');
const spectrumPath = path.join(themesDir, 'Filter Spectrum.json');
const tokyoDayPath = path.join(themesDir, 'Tokyo Day.json');

// ============================================
// 1. FILTER RISTRETTO - Coffee/Espresso Warmth
// ============================================
console.log('Fixing Filter Ristretto theme...');
const ristretto = JSON.parse(fs.readFileSync(ristrettoPath, 'utf8'));

// Panel backgrounds (solid rich brown - espresso aesthetic)
ristretto.colors['list.hoverBackground'] = '#403838';
ristretto.colors['list.activeSelectionBackground'] = '#403838';

// Menu selection (golden amber - signature yellow)
ristretto.colors['menu.selectionBackground'] = '#f9cc6c';
ristretto.colors['menu.selectionForeground'] = '#2c2525';  // Editor background
ristretto.colors['menubar.selectionForeground'] = '#f9cc6c';

// Focus indicators (warm pink-red - COFFEE WARMTH personality)
ristretto.colors['list.focusOutline'] = '#fd6883';
ristretto.colors['list.focusAndSelectionOutline'] = '#fd6883';
ristretto.colors['list.inactiveFocusOutline'] = '#f38d70';  // Coral-orange (warm downshift)

// Icon colors
ristretto.colors['list.activeSelectionIconForeground'] = '#f9cc6c';
ristretto.colors['list.inactiveSelectionIconForeground'] = '#948a8b';

fs.writeFileSync(ristrettoPath, JSON.stringify(ristretto, null, 2) + '\n');
console.log('✅ Filter Ristretto theme fixed (9 properties)');
console.log('   - Panel: Rich brown #403838 (espresso aesthetic)');
console.log('   - Focus: Warm pink-red #fd6883 (coffee warmth personality)\n');

// ============================================
// 2. FILTER SPECTRUM - Rainbow Vibrancy
// ============================================
console.log('Fixing Filter Spectrum theme...');
const spectrum = JSON.parse(fs.readFileSync(spectrumPath, 'utf8'));

// Panel backgrounds (solid charcoal - darker than Ristretto)
spectrum.colors['list.hoverBackground'] = '#363537';
spectrum.colors['list.activeSelectionBackground'] = '#363537';

// Menu selection (lemon yellow - signature yellow)
spectrum.colors['menu.selectionBackground'] = '#fce566';
spectrum.colors['menu.selectionForeground'] = '#222222';  // Editor background
spectrum.colors['menubar.selectionForeground'] = '#fce566';

// Focus indicators (bright purple - RAINBOW VIBRANCY personality)
spectrum.colors['list.focusOutline'] = '#948ae3';
spectrum.colors['list.focusAndSelectionOutline'] = '#948ae3';
spectrum.colors['list.inactiveFocusOutline'] = '#5ad4e6';  // Electric cyan (rainbow downshift)

// Icon colors
spectrum.colors['list.activeSelectionIconForeground'] = '#fce566';
spectrum.colors['list.inactiveSelectionIconForeground'] = '#8b888f';

fs.writeFileSync(spectrumPath, JSON.stringify(spectrum, null, 2) + '\n');
console.log('✅ Filter Spectrum theme fixed (9 properties)');
console.log('   - Panel: Charcoal #363537 (darker than Ristretto)');
console.log('   - Focus: Bright purple #948ae3 (rainbow vibrancy personality)\n');

// ============================================
// 3. TOKYO DAY - Urban Daytime Energy (LIGHT THEME)
// ============================================
console.log('Fixing Tokyo Day theme (LIGHT THEME - inverted strategy)...');
const tokyoDay = JSON.parse(fs.readFileSync(tokyoDayPath, 'utf8'));

// Panel backgrounds (solid sky blue shades - NO TRANSPARENCY!)
tokyoDay.colors['list.hoverBackground'] = '#C8E6F5';       // Light sky blue (80% lightness)
tokyoDay.colors['list.activeSelectionBackground'] = '#A9D7EC';  // Medium sky blue (70% lightness)

// Menu selection (sky blue signature with DARK text)
tokyoDay.colors['menu.selectionBackground'] = '#87CEEB';
tokyoDay.colors['menu.selectionForeground'] = '#1B2838';   // Dark blue-gray (readable on light)
tokyoDay.colors['menubar.selectionForeground'] = '#87CEEB';

// Focus indicators (bright emerald green - DAYTIME ENERGY personality)
tokyoDay.colors['list.focusOutline'] = '#2ECC71';
tokyoDay.colors['list.focusAndSelectionOutline'] = '#2ECC71';
tokyoDay.colors['list.inactiveFocusOutline'] = '#95A5A6';  // Medium gray (neutral downshift)

// Icon colors (DARK icons for light theme)
tokyoDay.colors['list.activeSelectionIconForeground'] = '#1B2838';  // Dark blue-gray
tokyoDay.colors['list.inactiveSelectionIconForeground'] = '#7F8C8D';

fs.writeFileSync(tokyoDayPath, JSON.stringify(tokyoDay, null, 2) + '\n');
console.log('✅ Tokyo Day theme fixed (9 properties)');
console.log('   - Panel: Solid sky blues #C8E6F5 / #A9D7EC (NO transparency!)');
console.log('   - Focus: Bright emerald green #2ECC71 (daytime energy personality)');
console.log('   - Strategy: Dark text on light backgrounds (inverted from dark themes)\n');

// ============================================
// SUMMARY
// ============================================
console.log('🎉 All 3 themes fixed successfully!');
console.log('\n📊 Summary:');
console.log('  - Filter Ristretto: 9 properties (warm pink-red focus - coffee warmth)');
console.log('  - Filter Spectrum: 9 properties (bright purple focus - rainbow vibrancy)');
console.log('  - Tokyo Day: 9 properties (bright green focus - daytime energy)');
console.log('  - Total: 27 properties fixed');
console.log('\n✨ Each theme maintains its unique personality with palette-appropriate colors');
console.log('🌟 Tokyo Day introduces light theme strategy (solid colors, dark text, no transparency)');
console.log('\nNext: Run tests with `cd tests && .\\run-tests.cmd --quick`');
