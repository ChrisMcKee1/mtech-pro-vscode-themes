const fs = require('fs');

// Classic Theme
console.log('Fixing Classic theme...');
const classic = JSON.parse(fs.readFileSync('./themes/Classic.json', 'utf8'));
classic.colors['list.activeSelectionBackground'] = '#3e3d32';
classic.colors['list.hoverBackground'] = '#3e3d32';
classic.colors['list.activeSelectionIconForeground'] = '#e6db74';
classic.colors['list.focusAndSelectionOutline'] = '#e6db74';
classic.colors['list.focusOutline'] = '#e6db74';
classic.colors['list.inactiveFocusOutline'] = '#A3A199';
classic.colors['list.inactiveSelectionIconForeground'] = '#A3A199';
classic.colors['menu.selectionBackground'] = '#e6db74';
classic.colors['menu.selectionForeground'] = '#272822';
classic.colors['menubar.selectionBackground'] = '#e6db74';
classic.colors['menubar.selectionForeground'] = '#272822';
fs.writeFileSync('./themes/Classic.json', JSON.stringify(classic));
console.log('✅ Classic theme fixed');

// Tokyo Night Theme
console.log('Fixing Tokyo Night theme...');
const tokyoNight = JSON.parse(fs.readFileSync('./themes/Tokyo Night.json', 'utf8'));
tokyoNight.colors['menu.selectionBackground'] = '#7aa2f7';
tokyoNight.colors['menu.selectionForeground'] = '#1a1b66';
tokyoNight.colors['menubar.selectionBackground'] = '#7aa2f7';
tokyoNight.colors['menubar.selectionForeground'] = '#1a1b66';
tokyoNight.colors['list.focusAndSelectionOutline'] = '#7aa2f7';
tokyoNight.colors['list.focusOutline'] = '#7aa2f7';
tokyoNight.colors['list.inactiveFocusOutline'] = '#3b4261';
tokyoNight.colors['list.activeSelectionIconForeground'] = '#1a1b66';
tokyoNight.colors['list.inactiveSelectionIconForeground'] = '#565f89';
fs.writeFileSync('./themes/Tokyo Night.json', JSON.stringify(tokyoNight));
console.log('✅ Tokyo Night theme fixed');

// Cyberpunk Neon Theme (Option B - keep light purple but use dark text)
console.log('Fixing Cyberpunk Neon theme...');
const cyberpunk = JSON.parse(fs.readFileSync('./themes/Cyberpunk Neon.json', 'utf8'));
cyberpunk.colors['list.hoverForeground'] = '#0d001a';  // Dark text on light purple
cyberpunk.colors['list.activeSelectionForeground'] = '#0d001a';  // Dark text on light purple
cyberpunk.colors['menu.selectionBackground'] = '#00ff99';
cyberpunk.colors['menu.selectionForeground'] = '#0d001a';
cyberpunk.colors['menubar.selectionBackground'] = '#00ff99';
cyberpunk.colors['menubar.selectionForeground'] = '#0d001a';
cyberpunk.colors['list.focusAndSelectionOutline'] = '#ff0080';
cyberpunk.colors['list.focusOutline'] = '#ff0080';
cyberpunk.colors['list.inactiveFocusOutline'] = '#cc33ff';
cyberpunk.colors['list.activeSelectionIconForeground'] = '#0d001a';
cyberpunk.colors['list.inactiveSelectionIconForeground'] = '#9966FF';
fs.writeFileSync('./themes/Cyberpunk Neon.json', JSON.stringify(cyberpunk));
console.log('✅ Cyberpunk Neon theme fixed');

console.log('\n🎉 All 3 themes fixed successfully!');
