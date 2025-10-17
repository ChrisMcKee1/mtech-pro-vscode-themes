#!/usr/bin/env node

/**
 * Phase 2 Theme Fixes: Feisty Fusion, Filter Machine, Filter Octagon
 * Fixes menu/list visibility issues with palette-appropriate colors
 * 
 * Issues fixed per theme (9 properties each, 27 total):
 * - List hover/selection transparency (5% → solid backgrounds)
 * - Missing menu.selectionBackground
 * - Missing focus outlines (3 properties)
 * - Missing icon foregrounds (2 properties)
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Phase 2: Fixing Feisty Fusion, Filter Machine, Filter Octagon\n');

// ============================================================================
// 1. FEISTY FUSION - Warm, Energetic, Spirited
// ============================================================================
console.log('Fixing Feisty Fusion theme...');
const feistyPath = './themes/Feisty Fusion.json';
const feisty = JSON.parse(fs.readFileSync(feistyPath, 'utf8'));

// Fix list backgrounds (solid panel color instead of 5% transparent)
feisty.colors['list.hoverBackground'] = '#3a3d4b';           // Solid panel color
feisty.colors['list.activeSelectionBackground'] = '#3a3d4b'; // Solid panel color

// Add menu selection background (signature yellow)
feisty.colors['menu.selectionBackground'] = '#ffd76d';   // Signature yellow (matches badges, strings)
feisty.colors['menu.selectionForeground'] = '#282a3a';   // Dark editor pane (high contrast)

// Add focus outlines (bright yellow - energetic personality)
feisty.colors['list.focusOutline'] = '#ffe366';                // Bright yellow (matches focusBorder)
feisty.colors['list.focusAndSelectionOutline'] = '#ffe366';    // Bright yellow
feisty.colors['list.inactiveFocusOutline'] = '#ff9b5e';        // Orange (warm downshift)

// Add icon foregrounds
feisty.colors['list.activeSelectionIconForeground'] = '#ffd76d';      // Signature yellow
feisty.colors['list.inactiveSelectionIconForeground'] = '#9AA0A8';    // Muted gray (existing tertiary)

fs.writeFileSync(feistyPath, JSON.stringify(feisty, null, 2));
console.log('✅ Feisty Fusion theme fixed (9 properties)\n');

// ============================================================================
// 2. FILTER MACHINE - Cool, Industrial, Precise
// ============================================================================
console.log('Fixing Filter Machine theme...');
const machinePath = './themes/Filter Machine.json';
const machine = JSON.parse(fs.readFileSync(machinePath, 'utf8'));

// Fix list backgrounds (solid panel color instead of 5% transparent)
machine.colors['list.hoverBackground'] = '#3a4449';           // Solid panel color
machine.colors['list.activeSelectionBackground'] = '#3a4449'; // Solid panel color

// Add menu selection background (signature yellow)
machine.colors['menu.selectionBackground'] = '#ffed72';   // Signature yellow (matches badges, strings)
machine.colors['menu.selectionForeground'] = '#273136';   // Editor background (high contrast)

// Add focus outlines (cyan - industrial personality)
machine.colors['list.focusOutline'] = '#7cd5f1';                // Cyan (industrial tint)
machine.colors['list.focusAndSelectionOutline'] = '#7cd5f1';    // Cyan
machine.colors['list.inactiveFocusOutline'] = '#545f62';        // Dark gray (inactive downshift)

// Add icon foregrounds
machine.colors['list.activeSelectionIconForeground'] = '#ffed72';     // Signature yellow
machine.colors['list.inactiveSelectionIconForeground'] = '#8b9798';   // Muted gray (existing tertiary)

fs.writeFileSync(machinePath, JSON.stringify(machine, null, 2));
console.log('✅ Filter Machine theme fixed (9 properties)\n');

// ============================================================================
// 3. FILTER OCTAGON - Balanced, Geometric, Structured
// ============================================================================
console.log('Fixing Filter Octagon theme...');
const octagonPath = './themes/Filter Octagon.json';
const octagon = JSON.parse(fs.readFileSync(octagonPath, 'utf8'));

// Fix list backgrounds (solid panel color instead of 5% transparent)
octagon.colors['list.hoverBackground'] = '#3a3d4b';           // Solid panel color
octagon.colors['list.activeSelectionBackground'] = '#3a3d4b'; // Solid panel color

// Add menu selection background (signature yellow)
octagon.colors['menu.selectionBackground'] = '#ffd76d';   // Signature yellow (matches badges, strings)
octagon.colors['menu.selectionForeground'] = '#282a3a';   // Editor background (high contrast)

// Add focus outlines (geometric gray - balanced personality)
octagon.colors['list.focusOutline'] = '#696d77';                // Geometric gray (matches rulers)
octagon.colors['list.focusAndSelectionOutline'] = '#696d77';    // Geometric gray
octagon.colors['list.inactiveFocusOutline'] = '#535763';        // Inactive gray (downshift)

// Add icon foregrounds
octagon.colors['list.activeSelectionIconForeground'] = '#ffd76d';     // Signature yellow
octagon.colors['list.inactiveSelectionIconForeground'] = '#888d94';   // Muted gray (existing tertiary)

fs.writeFileSync(octagonPath, JSON.stringify(octagon, null, 2));
console.log('✅ Filter Octagon theme fixed (9 properties)\n');

// ============================================================================
// Summary
// ============================================================================
console.log('🎉 All 3 themes fixed successfully!');
console.log('\n📊 Summary:');
console.log('  - Feisty Fusion: 9 properties (bright yellow focus - energetic)');
console.log('  - Filter Machine: 9 properties (cyan focus - industrial)');
console.log('  - Filter Octagon: 9 properties (gray focus - geometric)');
console.log('  - Total: 27 properties fixed');
console.log('\n✨ Each theme maintains its unique personality with palette-appropriate colors');
console.log('\n🧪 Next: Run tests with `cd tests && .\\run-tests.cmd --quick`');
