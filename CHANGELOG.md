# M Tech Themes for Visual Studio Code Changelog

## 0.6.5 - Diff & Text Visibility Fixes (October 2025)

### Bug Fixes

- Fixed scrollbar opacity blocking diff colors (all 23 themes - semi-transparent overlays)
- Fixed find highlight obscuring diffs (19 themes - theme-appropriate colors matching diff insert)
- Reduced diff background opacity to 25% standard, inserted text to 20%
- Fixed comment visibility (Enchanted Grove Dark, Evening Espresso - complete color redesign)
- Combined overlay opacity now ~48% (was 60-74%) ensuring readable text in all scenarios

---

## 0.6.4 - Coffee Themes (October 2025)

☕ **Two New Coffee-Themed Color Schemes** - Warm, inviting themes for all-day coding

### 🎨 New Themes

**Morning Coffee (Light)**:
- Warm cream/caramel/chocolate palette optimized for daytime coding
- Rich espresso text on cream backgrounds
- Inspired by coffee shop aesthetics with natural warmth
- Perfect for bright environments and long coding sessions

**Evening Espresso (Dark)**:
- Deep espresso/coffee grounds color scheme for low-light environments
- Cream text on dark roast backgrounds
- Sophisticated dark theme with warm undertones
- Perfect companion to Morning Coffee for all-day workflow

### ✨ Key Features

**Professional Coffee Shop Aesthetic**:
- Consistent warm color temperature throughout both themes
- Natural brown/tan/cream color palettes
- Sophisticated and calming for extended use
- Complementary light/dark pair for seamless day-to-night transitions

**WCAG 2.1 Level AA Compliant**:
- All syntax highlighting meets 4.5:1 minimum contrast (normal text)
- All UI elements meet 3:1 minimum contrast
- Clear selection highlights with readable text
- Visible scrollbars in all states (rest/hover/active)
- Professional accessibility standards throughout

**Smart Design Details**:
- 30/40/50% opacity hierarchy for diff backgrounds
- Off-black/off-white backgrounds (no harsh pure colors)
- Enhanced hover states for clear interaction feedback
- Complete terminal ANSI color support
- Optimized for TypeScript, Python, JavaScript, HTML, CSS, and Markdown

### 🎯 Perfect For

- Coffee lovers who appreciate warm, natural aesthetics
- Developers who switch between light/dark modes throughout the day
- Teams requiring WCAG AA accessibility compliance
- Long coding sessions in varying lighting conditions

---

## 0.6.3 - Neon Pink Light Improvements (October 2025)

🎨 **Neon Pink Light Theme Refinements** - Enhanced accessibility and visual consistency

### 🟣 Color Improvements

**Replaced Yellow with Purple Accent** (#9900CC):
- All yellow color variations (#ffff00) replaced with purple accent
- Affected 16 properties across UI and syntax highlighting
- Maintains neon pink/purple/green palette identity
- Better visual harmony with theme's vibrant aesthetic

**UI Elements Updated**:
- Charts, debug icons, lightbulb suggestions
- Git decorations (modified files)
- Terminal ANSI colors (yellow → purple)
- Extension star icons
- SCM graph colors

**Syntax Highlighting Updated**:
- Symbol icon colors (strings, text)
- Maintains readability while improving consistency

### ♿ Accessibility Fixes

**Extensions Panel Hover Highlighting**:
- `list.hoverBackground`: Enhanced from `#f3e8ff` to `#e9d5ff` (deeper purple)
- `list.hoverForeground`: Updated to `#4a1a4a` (dark purple, no white text)
- Visible highlight distinction when hovering over extensions
- Dark text remains readable on light background

**Text Color Corrections**:
- Eliminated all white text on light backgrounds
- Ensured proper contrast ratios throughout theme
- All foreground colors now dark and readable

### ✨ Visual Consistency

- Purple accent now used consistently across all UI elements
- No more jarring yellow color conflicts
- Cohesive neon pink/purple/green color palette
- Professional appearance while maintaining vibrant identity

---

## 0.6.0 - Initial Release (October 2025)

🎉 **Official Launch** - Professional themes with accessibility and unique identities

### 🎨 21 Distinctive Themes

**Dark Themes (13)**:
- **Obsidian Moss** - Jade-tinted dark gray with lime green accents
- **Graphite Bay** - Industrial blue-gray harbor aesthetic  
- **Copper Bloom** - Warm browns with peachy orange and dusty rose tones
- **Chroma Void** - Deep black with full ROYGBIV rainbow spectrum
- **Digital Aqua** - Technical cyan/teal with matrix-inspired precision
- **Mystic Dusk** - Deep purple twilight with violet moon glow
- **Cyberpunk Neon** - High-voltage cyber aesthetics with electric colors
- **Tokyo Night** - Neon-soaked colors on dark blue-black
- **Arctic Nord** - Nordic winter minimalism (Nord palette compliant)
- **OGE Dark** - Balanced neutral dark theme
- **Feisty Fusion** - Warm fusion of oranges and cyans
- **Cosmic Void** - Deep space with vibrant cosmic accents
- **Enchanted Grove Dark** - Mystical forest dark elf aesthetic

**Light Themes (8)**:
- **Sandstone Light** - Warm beige desert dawn palette
- **Tokyo Day** - Energetic daylight companion to Tokyo Night
- **Arctic Nord Light** - Nordic daylight (Nord palette compliant)
- **OGE Light** - Clean professional light theme
- **Feisty Fusion Light** - Warm light variant with fusion aesthetic
- **Cosmic Void Light** - Bright cosmic theme
- **Enchanted Grove** - Mystical forest light elf aesthetic
- **Neon Pink Light** - Vibrant pink-accented light theme

### ✨ Key Features

**🎯 Accessibility First**:
- WCAG-compliant contrast ratios (4.5:1 text, 3:1 UI minimum)
- 30-40% opacity highlights (no invisible selections/diffs)
- Visible scrollbars in all states (rest/hover/active)
- Readable text on all background colors
- Off-black/off-white palettes (no pure #000000/#FFFFFF)

**🎨 Matching Icon Packs**:
- 22 icon themes with color-coordinated file icons
- Monochrome variants for 13 themes
- Auto-pairing: Icons match your active theme automatically

**⚡ Smart Theme Commands**:
- `M Tech Themes: select theme` - Category-based picker (Light/Dark sections)
- `M Tech Themes: activate icons` - Apply matching icon theme
- `M Tech Themes: set theme and icons` - Atomically apply both
- Auto-dismissing notifications (3-second timeout, no manual close needed)

**🌈 Design Philosophy**:
- Each theme has unique personality and color identity
- Temperature-consistent palettes (warm themes stay warm, cool stay cool)
- Dual system coverage (UI colors + syntax token colors)
- Multi-language tested (TypeScript, Python, HTML, CSS, Markdown, JSON)

### 🔧 Technical Details

**Extension Capabilities**:
- Works in VS Code and Cursor
- Supports untrusted workspaces
- Browser and Node.js extension hosts
- Minimal resource footprint

**Configuration**:
- `techThemes.fileIconsMonochrome` - Enable monochrome icon variants

### 📦 What's Included

- 21 color themes (13 dark, 8 light)
- 22 icon themes (with monochrome variants)
- Comprehensive WCAG accessibility compliance
- Professional command palette integration
- Auto-pairing icon theme system

---

**License**: MIT  
**Repository**: [mtech-pro-vscode-themes](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes)  
**Issues**: [Report a bug](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues)
