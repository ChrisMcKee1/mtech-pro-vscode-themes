const fs = require('fs');
const path = require('path');

console.log('🎨 Phase 6: Fixing Enchanted Grove, OGE Dark, OGE Light\n');

// Theme paths
const themesDir = path.join(__dirname, 'themes');
const enchantedGrovePath = path.join(themesDir, 'Enchanted Grove.json');
const ogeDarkPath = path.join(themesDir, 'OGE Dark.json');
const ogeLightPath = path.join(themesDir, 'OGE Light.json');

// Fix Enchanted Grove (Light Theme - Daytime Mystical Forest)
console.log('Fixing Enchanted Grove theme...');
const enchantedGrove = JSON.parse(fs.readFileSync(enchantedGrovePath, 'utf8'));

enchantedGrove.colors['list.hoverBackground'] = '#C0D8C0';                      // Light sage green (solid panel)
enchantedGrove.colors['list.activeSelectionBackground'] = '#C0D8C0';            // Light sage green (solid panel)
enchantedGrove.colors['menu.selectionBackground'] = '#DAA520';                  // Goldenrod yellow (SUNLIGHT MAGIC)
enchantedGrove.colors['menu.selectionForeground'] = '#000000';                  // Black text on goldenrod
enchantedGrove.colors['menubar.selectionForeground'] = '#DAA520';               // Goldenrod yellow
enchantedGrove.colors['list.focusOutline'] = '#228B22';                         // Forest green (DAYTIME LIFE - PRIMARY accent)
enchantedGrove.colors['list.focusAndSelectionOutline'] = '#228B22';             // Forest green
enchantedGrove.colors['list.inactiveFocusOutline'] = '#DAA520';                 // Goldenrod downshift (sunlight glow)
enchantedGrove.colors['list.activeSelectionIconForeground'] = '#228B22';        // Forest green icons
enchantedGrove.colors['list.inactiveSelectionIconForeground'] = '#808080';      // Light gray icons

fs.writeFileSync(enchantedGrovePath, JSON.stringify(enchantedGrove, null, 2), 'utf8');
console.log('✅ Enchanted Grove theme fixed (10 properties)');
console.log('   - Panels: Light sage green #C0D8C0 (light theme solid)');
console.log('   - Focus: Forest green #228B22 (DAYTIME LIFE - vs nighttime lime-green)');
console.log('   🌲 ENCHANTED GROVE SERIES COMPLETE: 2/2 themes (day + night)!\n');

// Fix OGE Dark (Professional Energy Dark Theme)
console.log('Fixing OGE Dark theme...');
const ogeDark = JSON.parse(fs.readFileSync(ogeDarkPath, 'utf8'));

ogeDark.colors['list.hoverBackground'] = '#374151';                             // Dark slate-gray (professional panel)
ogeDark.colors['list.activeSelectionBackground'] = '#374151';                   // Dark slate-gray (professional panel)
ogeDark.colors['menu.selectionBackground'] = '#FFB84D';                         // Golden amber (ENERGY SIGNATURE)
ogeDark.colors['menu.selectionForeground'] = '#1C1512';                         // Dark earth-toned on golden
ogeDark.colors['menubar.selectionForeground'] = '#FFB84D';                      // Golden amber
ogeDark.colors['list.focusOutline'] = '#FFB84D';                                // Golden amber (ENERGY WARMTH - PRIMARY accent)
ogeDark.colors['list.focusAndSelectionOutline'] = '#FFB84D';                    // Golden amber
ogeDark.colors['list.inactiveFocusOutline'] = '#FF8C42';                        // Burnt orange downshift (heat/energy)
ogeDark.colors['list.activeSelectionIconForeground'] = '#FFB84D';               // Golden amber icons
ogeDark.colors['list.inactiveSelectionIconForeground'] = '#B8BCC8';             // Light gray-blue icons

fs.writeFileSync(ogeDarkPath, JSON.stringify(ogeDark, null, 2), 'utf8');
console.log('✅ OGE Dark theme fixed (10 properties)');
console.log('   - Panels: Dark slate-gray #374151 (professional)');
console.log('   - Focus: Golden amber #FFB84D (ENERGY WARMTH - PRIMARY accent)\n');

// Fix OGE Light (Professional Energy Light Theme)
console.log('Fixing OGE Light theme...');
const ogeLight = JSON.parse(fs.readFileSync(ogeLightPath, 'utf8'));

ogeLight.colors['list.hoverBackground'] = '#E7E5E4';                            // Light taupe (professional panel)
ogeLight.colors['list.activeSelectionBackground'] = '#E7E5E4';                  // Light taupe (professional panel)
ogeLight.colors['menu.selectionBackground'] = '#C2514d';                        // Terracotta red (EARTH SIGNATURE)
ogeLight.colors['menu.selectionForeground'] = '#FBF9F7';                        // Warm cream text on terracotta
ogeLight.colors['menubar.selectionForeground'] = '#C2514d';                     // Terracotta red
ogeLight.colors['list.focusOutline'] = '#C2514d';                               // Terracotta red (EARTH WARMTH - PRIMARY accent)
ogeLight.colors['list.focusAndSelectionOutline'] = '#C2514d';                   // Terracotta red
ogeLight.colors['list.inactiveFocusOutline'] = '#D97706';                       // Amber-orange downshift (energy/heat)
ogeLight.colors['list.activeSelectionIconForeground'] = '#C2514d';              // Terracotta icons
ogeLight.colors['list.inactiveSelectionIconForeground'] = '#78716C';            // Warm gray-brown icons

fs.writeFileSync(ogeLightPath, JSON.stringify(ogeLight, null, 2), 'utf8');
console.log('✅ OGE Light theme fixed (10 properties)');
console.log('   - Panels: Light taupe #E7E5E4 (professional)');
console.log('   - Focus: Terracotta red #C2514d (EARTH WARMTH - PRIMARY accent)');
console.log('   🏢 OGE SERIES COMPLETE: 2/2 themes (energy + earth warmth)!\n');

// Summary
console.log('🎉 All 3 themes fixed successfully!\n');
console.log('📊 Summary:');
console.log('  - Enchanted Grove: 10 properties (forest green focus - completes series!)');
console.log('  - OGE Dark: 10 properties (golden amber focus - energy warmth)');
console.log('  - OGE Light: 10 properties (terracotta focus - earth warmth)');
console.log('  - Total: 30 properties fixed');
console.log('\n✨ Series Completed:');
console.log('   🌲 Enchanted Grove Series COMPLETE: 2/2 (day + night mystical forest)');
console.log('   🏢 OGE Series COMPLETE: 2/2 (professional energy industry themes)');
