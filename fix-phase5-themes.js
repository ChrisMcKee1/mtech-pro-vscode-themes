#!/usr/bin/env node
/**
 * Phase 5: Fix Filter Sun, Feisty Fusion Light, Cosmic Void Light
 * 
 * Objectives:
 * 1. Complete Filter series (6/6) with golden amber sun energy
 * 2. Apply light theme strategies (solid panels + darker accents)
 * 3. Maintain personality-driven focus colors
 */

const fs = require('fs');
const path = require('path');

// Theme file paths
const FILTER_SUN_PATH = path.join(__dirname, 'themes', 'Filter Sun.json');
const FEISTY_FUSION_LIGHT_PATH = path.join(__dirname, 'themes', 'Feisty Fusion Light.json');
const COSMIC_VOID_LIGHT_PATH = path.join(__dirname, 'themes', 'Cosmic Void Light.json');

console.log('🎨 Phase 5: Fixing Filter Sun, Feisty Fusion Light, Cosmic Void Light\n');

// ============================================================================
// 1. FILTER SUN - Complete Filter Series with Golden Amber Sun Energy
// ============================================================================

console.log('Fixing Filter Sun theme...');

const filterSun = JSON.parse(fs.readFileSync(FILTER_SUN_PATH, 'utf8'));

// Panels: Medium warm tan (solid, not transparent 0c)
filterSun.colors['list.hoverBackground'] = '#ded5d0';
filterSun.colors['list.activeSelectionBackground'] = '#ded5d0';

// Menu: Golden amber selection (sun signature)
filterSun.colors['menu.selectionBackground'] = '#b16803';           // Golden amber (SUN ENERGY)
filterSun.colors['menu.selectionForeground'] = '#f8efe7';           // Light cream on golden
filterSun.colors['menubar.selectionForeground'] = '#b16803';        // Golden amber

// Focus: Golden amber (COMPLETES FILTER SERIES!)
filterSun.colors['list.focusOutline'] = '#b16803';                  // Golden amber (SUN ENERGY personality)
filterSun.colors['list.focusAndSelectionOutline'] = '#b16803';      // Golden amber
filterSun.colors['list.inactiveFocusOutline'] = '#B54623';          // Burnt orange downshift (warm sun tones)

// Icons: Golden amber + light gray
filterSun.colors['list.activeSelectionIconForeground'] = '#b16803'; // Golden amber
filterSun.colors['list.inactiveSelectionIconForeground'] = '#a59c9c'; // Light gray

fs.writeFileSync(FILTER_SUN_PATH, JSON.stringify(filterSun, null, '\t'));

console.log('✅ Filter Sun theme fixed (8 properties)');
console.log('   - Panels: Medium warm tan #ded5d0 (light theme solid)');
console.log('   - Focus: Golden amber #b16803 (SUN ENERGY - completes Filter series!)');
console.log('   🌈 FILTER SERIES COMPLETE: 6/6 themes with full rainbow spectrum!\n');

// ============================================================================
// 2. FEISTY FUSION LIGHT - Energetic Warm Fusion
// ============================================================================

console.log('Fixing Feisty Fusion Light theme...');

const feistyFusionLight = JSON.parse(fs.readFileSync(FEISTY_FUSION_LIGHT_PATH, 'utf8'));

// Panels: Light gray-warm (solid, not transparent 19/26)
feistyFusionLight.colors['list.hoverBackground'] = '#e5e7eb';
feistyFusionLight.colors['list.activeSelectionBackground'] = '#e5e7eb';

// Menu: Golden yellow selection (fusion signature)
feistyFusionLight.colors['menu.selectionBackground'] = '#b8860b';          // Golden yellow (FUSION ENERGY)
feistyFusionLight.colors['menu.selectionForeground'] = '#fdfaf7';          // Light warm text on golden
feistyFusionLight.colors['menubar.selectionForeground'] = '#b8860b';       // Golden yellow

// Focus: Golden yellow (ENERGETIC WARMTH personality)
feistyFusionLight.colors['list.focusOutline'] = '#b8860b';                 // Golden yellow (FUSION ENERGY)
feistyFusionLight.colors['list.focusAndSelectionOutline'] = '#b8860b';     // Golden yellow
feistyFusionLight.colors['list.inactiveFocusOutline'] = '#ff9b5e';         // Soft orange downshift (warm fusion)

// Icons: Golden yellow + light gray
feistyFusionLight.colors['list.activeSelectionIconForeground'] = '#b8860b'; // Golden yellow
feistyFusionLight.colors['list.inactiveSelectionIconForeground'] = '#888d94'; // Light gray

fs.writeFileSync(FEISTY_FUSION_LIGHT_PATH, JSON.stringify(feistyFusionLight, null, '\t'));

console.log('✅ Feisty Fusion Light theme fixed (8 properties)');
console.log('   - Panels: Light gray-warm #e5e7eb (light theme solid)');
console.log('   - Focus: Golden yellow #b8860b (FUSION ENERGY - maintains PRIMARY accent)\n');

// ============================================================================
// 3. COSMIC VOID LIGHT - Stellar Light Paradox
// ============================================================================

console.log('Fixing Cosmic Void Light theme...');

const cosmicVoidLight = JSON.parse(fs.readFileSync(COSMIC_VOID_LIGHT_PATH, 'utf8'));

// Panels: Medium slate-blue (solid, not transparent 0c)
cosmicVoidLight.colors['list.hoverBackground'] = '#E2E8F0';
cosmicVoidLight.colors['list.activeSelectionBackground'] = '#E2E8F0';

// Menu: Electric cyan selection (cosmic signature)
cosmicVoidLight.colors['menu.selectionBackground'] = '#7DD3FC';            // Electric cyan (COSMIC SIGNATURE)
cosmicVoidLight.colors['menu.selectionForeground'] = '#0F172A';            // Deep space black on cyan
cosmicVoidLight.colors['menubar.selectionForeground'] = '#7DD3FC';         // Electric cyan

// Focus: Emerald green (COSMIC LIGHT ENERGY - matches dark Cosmic Void)
cosmicVoidLight.colors['list.focusOutline'] = '#047857';                   // Emerald green (COSMIC LIGHT)
cosmicVoidLight.colors['list.focusAndSelectionOutline'] = '#047857';       // Emerald green
cosmicVoidLight.colors['list.inactiveFocusOutline'] = '#3B82F6';           // Bright blue downshift (stellar light)

// Icons: Electric cyan + light slate
cosmicVoidLight.colors['list.activeSelectionIconForeground'] = '#7DD3FC';  // Electric cyan
cosmicVoidLight.colors['list.inactiveSelectionIconForeground'] = '#64748B'; // Light slate-gray

fs.writeFileSync(COSMIC_VOID_LIGHT_PATH, JSON.stringify(cosmicVoidLight, null, '\t'));

console.log('✅ Cosmic Void Light theme fixed (8 properties)');
console.log('   - Panels: Medium slate-blue #E2E8F0 (light theme solid)');
console.log('   - Focus: Emerald green #047857 (COSMIC LIGHT - matches dark mode energy)\n');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('🎉 All 3 themes fixed successfully!\n');
console.log('📊 Summary:');
console.log('  - Filter Sun: 8 properties (golden amber focus - COMPLETES FILTER SERIES!)');
console.log('  - Feisty Fusion Light: 8 properties (golden yellow focus - fusion energy)');
console.log('  - Cosmic Void Light: 8 properties (emerald green focus - cosmic light)');
console.log('  - Total: 24 properties fixed\n');

console.log('✨ Major Milestone:');
console.log('   🌈 Filter Series COMPLETE: 6/6 themes with full color wheel coverage!');
console.log('   🎨 Light themes: 4 total (Tokyo Day, Filter Sun, Feisty Fusion Light, Cosmic Void Light)\n');

console.log('📋 Filter Series Evolution:');
console.log('   | Theme            | Focus Color | Personality        | Status      |');
console.log('   |------------------|-------------|--------------------|-------------|');
console.log('   | Filter Machine   | #06B6D4 Cyan    | Industrial precision | ✅ Phase 2 |');
console.log('   | Filter Octagon   | #71717A Gray    | Geometric sharpness  | ✅ Phase 2 |');
console.log('   | Filter Ristretto | #FD6883 Red     | Coffee warmth        | ✅ Phase 3 |');
console.log('   | Filter Spectrum  | #948AE3 Purple  | Rainbow brilliance   | ✅ Phase 3 |');
console.log('   | Filter Moon      | #E879F9 Magenta | Lunar moonlight      | ✅ Phase 4 |');
console.log('   | Filter Sun       | #b16803 Golden  | Sun energy           | ✅ Phase 5 |');
console.log('\n🚀 Ready for testing and git commit!');
