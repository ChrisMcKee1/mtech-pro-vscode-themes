# M Tech Themes for Visual Studio Code Changelog

## [0.10.6] - 2026-04-02

### New Command - Set Theme with Matched Icons
- Added new command "M Tech Themes: set theme with matched icons" (Ctrl+Shift+P)
- Picks a theme AND applies the matching standard color icon pack in one step
- Always uses the standard (non-monochrome) icons for a perfect family match
- Existing "set theme and icons" command still respects the monochrome setting

## [0.10.5] - 2026-04-02

### Re-release
- Clean rebuild of v0.10.4 to resolve stale artifact in prior release

## [0.10.4] - 2026-04-02

### UI Chrome - Complete Header Theming
- Title bar, command center, toolbar icons now use sidebar resting icon color across all 23 themes
- Added 6 missing header properties: toolbar.hoverBackground, toolbar.activeBackground, toolbar.hoverOutline, menubar.selectionBorder, menu.selectionBorder, commandCenter.debuggingBackground
- Set icon.foreground to match sidebar icons — controls back/forward arrows, layout toggles, all toolbar icons
- Fixed inactive window state: title bar no longer dims when VS Code loses focus
- Synced badge.background/foreground to theme accent colors for command center notifications
- Brightened dim sidebar icons in Enchanted Grove Dark, Evening Espresso, Graphite Bay, Obsidian Moss
- Darkened washed-out icons in Sandstone Light (was 1.85:1 contrast!), Feisty Fusion Light, Tokyo Day
- All icon contrast ratios now ≥3.0:1 against both sidebar and title bar backgrounds
- Fixed status bar hover white-on-white text in Arctic Nord, Cyberpunk Neon, Evening Espresso, Enchanted Grove (both), using transparent overlays
- Audited all hover states across 10 property pairs — fixed 11 issues in 9 themes
- Themed inputOption.active* toggle buttons (filter, regex, case toggles) with accent-tinted backgrounds
- Added checkbox.selectBackground, checkbox.selectBorder, checkbox.disabled.* to all themes

## [0.10.3] - 2026-04-02

### UI Chrome - Title Bar & Sidebar Icon Harmony
- Title bar (File, Edit, View, search bar, layout toggles) now uses each theme's sidebar icon accent color instead of neutral grays across 18 themes
- Fixed Copper Bloom sidebar hover bug: icons no longer jump from pink to jarring orange/yellow — stays in warm pink family
- Fixed jarring active border colors that clashed with icon hues in 5 themes:
  - Cyberpunk Neon: cyan border → magenta (matches pink icons)
  - Digital Aqua: yellow border/badge → cyan (matches aqua icons)
  - Graphite Bay: yellow border/badge → silver/steel blue (matches cool neutral)
  - Feisty Fusion: yellow border → mint (matches fusion palette)
  - Obsidian Moss: yellow border → Monokai green (matches moss identity)
- Fixed OGE Light active/inactive icons being identical — active now visually distinct
- Fixed Arctic Nord active icon from plain white to Nord Snow (#ECEFF4) for frost-blue continuity
- Aligned activityBar/activityBarTop consistency across 4 themes (Arctic Nord Light, Cosmic Void Light, Sandstone Light, Mystic Dusk)

## [0.10.2] - 2026-04-02

### Accessibility - Diff Editor Comment Contrast
- Fixed comment text unreadable on Copilot/diff green (inserted) and red (removed) backgrounds across all 23 themes
- 253 comment-family tokenColors scopes now achieve ≥3.5:1 contrast on all diff overlay backgrounds
- Includes primary comments, JSDoc annotations, docstrings, TODO/FIXME markers, git-status headers, and comment punctuation
- Dark themes: lightened comment colors + reduced diff overlay opacity (40%→31%, 35%→28%) for balanced readability
- Light themes: darkened comment colors for improved contrast against tinted diff backgrounds
- Each theme's palette identity preserved (hue maintained, only lightness adjusted)
- Cross-referenced all 23 theme agents' findings to catch inconsistently handled secondary scopes

## [0.10.1] - 2026-04-01

### Accessibility
- Deep per-theme accessibility audit across all 23 themes with dedicated analysis per theme identity
- Fixed invisible ANSI terminal colors in Arctic Nord (HIGH), Arctic Nord Light, Enchanted Grove, OGE Light, Sandstone Light, Tokyo Day
- Fixed find match highlight opacity hierarchy in Cosmic Void, Neon Pink Light, Morning Coffee, Graphite Bay
- Fixed invisible overlays (selections, hovers, folds) in Mystic Dusk, Cyberpunk Neon, Tokyo Night, Enchanted Grove Dark
- Fixed critical autocomplete widget visibility in Feisty Fusion and Copper Bloom
- Fixed unreadable find match text (dark-on-dark) in Mystic Dusk
- Fixed ANSI blue mapped to wrong color (orange) in OGE Dark
- Boosted indent guide, ruler, and structural line contrast across 6 themes
- All 23 themes now pass with 0 Critical, 0 High, 0 Medium issues

### Icon Themes
- Added 11 missing monochrome icon theme variants (Arctic Nord Light, Cosmic Void Light, Enchanted Grove Dark, Evening Espresso, Feisty Fusion Light, Morning Coffee, Mystic Dusk, Neon Pink Light, OGE Dark, OGE Light, Tokyo Day)
- All 23 themes now have both base and monochrome icon variants
- Total icon themes: 49 (23 base + 23 monochrome + 3 legacy)

### Configuration
- Fixed themeConfig.js ICON_THEMES missing 14 entries (monochrome icons and legacy fallbacks)
- Synchronized version across package.json and themeConfig.js
- getMatchingIconTheme() now correctly resolves monochrome variants for all themes
- Triple Source of Truth fully validated: package.json ↔ themeConfig.js ↔ disk files

### Quality
- 0 Critical, 0 High, 0 Medium accessibility issues across all 23 themes
- 98 structure validations passing, 0 errors
- All icon theme files exist and are properly registered

## [0.10.0] - 2026-04-01

### Accessibility
- Comprehensive WCAG accessibility audit and fixes across all 23 themes
- Improved terminal text readability in **Arctic Nord**, **Obsidian Moss**, **Graphite Bay**, and all light themes — ANSI colors now meet contrast standards
- Fixed invisible or hard-to-read text in **OGE Light** (tab labels), **Sandstone Light** (placeholders), **Neon Pink Light** (scrollbars, comments), **Feisty Fusion Light** (gold accent text), **Cosmic Void Light** (sidebar, status bar, line numbers)
- Fixed **Morning Coffee** debug/warning status bar readability
- Fixed **Tokyo Day** focus border visibility and warning squiggles
- Fixed **Enchanted Grove** badge, button, and link contrast; warning indicators
- Corrected selection and find-match highlight layering in **Cyberpunk Neon**

### Terminal
- Terminal bold/bright text now visually distinct from normal text in 8 themes: Tokyo Night, Cosmic Void, Digital Aqua, Feisty Fusion, Graphite Bay, Mystic Dusk, OGE Dark, Copper Bloom
- Restored correct ANSI blue color in **OGE Light** and **Sandstone Light** terminals (was incorrectly showing orange)

### Syntax Highlighting
- Cleaned up conflicting Rust syntax coloring rules across all themes
- Resolved duplicate comment keyword color definitions
- Fixed semantic token contrast for `new` operator in **Enchanted Grove Dark**

### Icon Themes
- Added light theme and high contrast icon color variants for Light, Tokyo Night, and Arctic Nord icon packs
- Fixed missing file name icon associations in Mystic Dusk and Tokyo Day icon packs

### Quality
- 0 critical or high accessibility issues remaining across all 23 themes
- All themes define 700+ color properties covering the latest VS Code features

## [0.9.0] - 2026-03-27

### Added
- Comprehensive VS Code theme color reference audit — all 23 themes now define 700+ color properties
- Tokyo Day fully rebuilt: 385 properties added (was only 330, now 715+)
- 16 universally-missing properties added across all themes:
  - `editor.selectionForeground`, `editorHoverWidget.foreground`, `widget.border`
  - `activityBar.activeBackground`, `terminal.selectionForeground`
  - `gitDecoration.renamedResourceForeground`, `sideBarSectionHeader.border`
  - `tab.activeBorderTop`
  - `editorGutter.commentGlyphForeground`, `editorGutter.commentUnresolvedGlyphForeground`
  - `statusBarItem.compactHoverBackground`
  - `multiDiffEditor.headerBackground/background/border`
  - `editorCommentsWidget.resolvedBorder/unresolvedBorder`

### Quality
- Zero critical property gaps remaining (245/245 critical, 157/157 important)
- Zero empty-string values across all themes
- Full test suite: 87/87 passed, 0 errors

## [0.8.1] - 2026-03-27

### Fixed
- Fixed `agentStatusIndicator.background` rendering as a green background bar across the command center in VS Code Insiders
- All 23 themes now use subtle title-bar-harmonized colors instead of vivid accent colors for the agent status indicator

## [0.8.0] - 2026-03-26

### Added
- 97 new VS Code theme color properties across all 23 themes for full VS Code Insiders compatibility
- Copilot inline edit gutter indicators and diff backgrounds
- Chat panel, inline chat input, and agent session UI colors
- Markdown alert block colors (note, tip, important, warning, caution)
- Tab selected state properties for new tab model
- Editor action list, sticky scroll gutter, and peek view sticky scroll colors
- Terminal sticky scroll and command guide colors
- Multi-cursor primary/secondary differentiation
- Editor placeholder, composition border, and fold placeholder colors
- Panel title badges, minimap chat highlights, and overview ruler inline chat markers
- Git blame decoration foreground
- Status bar offline state indicators
- Sash borders for profiles, chat management, and AI customization panels

### Fixed
- Empty-string values replaced with proper colors (diff move borders, offline status bar, find widget sash)

## 0.7.7 - Midnight Cortado Refresh & Visibility Improvements (2026-02-28)
### Highlights
- Reimagined **Evening Espresso** with a major visual redesign in the new Midnight Cortado direction.
- Improved scrollbar visibility across themes for clearer navigation in long files and panels.
- Fixed **Digital Aqua** overview ruler and find-selection visibility so search cues are consistently visible.
- Packaged release updates and version bump completed for `0.7.7`.

## 0.7.5 - Documentation & Marketplace Release
### Highlights
- Overhauled documentation (README.md) for direct VS Code Marketplace distribution focusing on automated workflows.
- Added standard OSS community files: SECURITY.md and CONTRIBUTING.md.
- Consolidated repository documentation layout to emphasize the Visual Studio Code extension listing over manual downloading.

## 0.7.4 - Deep Accessibility Pass & Contrast Overlay Enhancements
### Highlights
- Passed a major contrast and accessibility overhaul to resolve failures across 23 themes.
- Re-architected alpha channels for diff overlays, selections, and search highlights.
- Improved foreground legibility for comments and UI contrast in *Feisty Fusion, Graphite Bay, Mystic Dusk, Obsidian Moss, OGE Dark, and Tokyo Night*.
- Added 9 new theming controls and expanded tests to ensure WCAG validation for future updates.
- Fixed dynamic comment dimming and model info contrast issues.

## 0.6.6 - Welcome Contrast & Design Notes (November 2025)

### Highlights

- Documented design-first palettes (Morning Coffee, Arctic Nord family, Enchanted Grove, etc.) and taught the analyzer to log Γä╣∩╕Å trade-offs when ratios stay above the new floors (docs + `tests/lib/theme-utils.js`, `tests/test-contrast-analysis.js`).
- Expanded property coverage checks: `tests/analyze-theme-properties.js` now enforces selection/diff/list/button/tab/status/welcome groups plus background/foreground pairing, and `tests/check-welcome-contrast.js` spot-checks hover combos.
- Added missing UI colors (button secondary hover text, menubar selection background, status bar prominent/remote states, welcome page hover foregrounds, tab hover/active fills) across all refreshed themes.
- Re-tuned diff overlays, selections, and find highlights with palette-matched hues in 20+ themes (Arctic Nord + Light, Chroma Void, Copper Bloom, Cosmic Void + Light, Cyberpunk Neon, Digital Aqua, Enchanted Grove + Dark, Evening Espresso, Feisty Fusion + Light, Graphite Bay, Morning Coffee, Mystic Dusk, Neon Pink Light, OGE Dark/Light, Obsidian Moss, Sandstone Light, Tokyo Day/Night) so text never drowns under layered highlights.
- Arctic Nord dark + light now share the calmer warning palette and matching welcome hover colors introduced last week, so both variants keep Nord identity while presenting alerts that feel intentional instead of harsh.
- Morning Coffee received a targeted readability polish: stronger espresso selections/diffs, refreshed bracket spectrum, and warmer constant/function tones while keeping the cafe narrative intact.

---

## 0.6.5 - Diff & Text Visibility Fixes (October 2025)

### Bug Fixes

- Fixed scrollbar opacity blocking diff colors (all 23 themes - semi-transparent overlays)
- Fixed find highlight obscuring diffs (19 themes - theme-appropriate colors matching diff insert)
- Reduced diff background opacity to 25% standard, inserted text to 20%
- Fixed comment visibility (Enchanted Grove Dark, Evening Espresso - complete color redesign)
- Combined overlay opacity now ~48% (was 60-74%) ensuring readable text in all scenarios

---

## 0.6.4 - Coffee Themes (October 2025)

Γÿò **Two New Coffee-Themed Color Schemes** - Warm, inviting themes for all-day coding

### ≡ƒÄ¿ New Themes

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

### Γ£¿ Key Features

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

### ≡ƒÄ» Perfect For

- Coffee lovers who appreciate warm, natural aesthetics
- Developers who switch between light/dark modes throughout the day
- Teams requiring WCAG AA accessibility compliance
- Long coding sessions in varying lighting conditions

---

## 0.6.3 - Neon Pink Light Improvements (October 2025)

≡ƒÄ¿ **Neon Pink Light Theme Refinements** - Enhanced accessibility and visual consistency

### ≡ƒƒú Color Improvements

**Replaced Yellow with Purple Accent** (#9900CC):
- All yellow color variations (#ffff00) replaced with purple accent
- Affected 16 properties across UI and syntax highlighting
- Maintains neon pink/purple/green palette identity
- Better visual harmony with theme's vibrant aesthetic

**UI Elements Updated**:
- Charts, debug icons, lightbulb suggestions
- Git decorations (modified files)
- Terminal ANSI colors (yellow ΓåÆ purple)
- Extension star icons
- SCM graph colors

**Syntax Highlighting Updated**:
- Symbol icon colors (strings, text)
- Maintains readability while improving consistency

### ΓÖ┐ Accessibility Fixes

**Extensions Panel Hover Highlighting**:
- `list.hoverBackground`: Enhanced from `#f3e8ff` to `#e9d5ff` (deeper purple)
- `list.hoverForeground`: Updated to `#4a1a4a` (dark purple, no white text)
- Visible highlight distinction when hovering over extensions
- Dark text remains readable on light background

**Text Color Corrections**:
- Eliminated all white text on light backgrounds
- Ensured proper contrast ratios throughout theme
- All foreground colors now dark and readable

### Γ£¿ Visual Consistency

- Purple accent now used consistently across all UI elements
- No more jarring yellow color conflicts
- Cohesive neon pink/purple/green color palette
- Professional appearance while maintaining vibrant identity

---

## 0.6.0 - Initial Release (October 2025)

≡ƒÄë **Official Launch** - Professional themes with accessibility and unique identities

### ≡ƒÄ¿ 21 Distinctive Themes

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

### Γ£¿ Key Features

**≡ƒÄ» Accessibility First**:
- WCAG-compliant contrast ratios (4.5:1 text, 3:1 UI minimum)
- 30-40% opacity highlights (no invisible selections/diffs)
- Visible scrollbars in all states (rest/hover/active)
- Readable text on all background colors
- Off-black/off-white palettes (no pure #000000/#FFFFFF)

**≡ƒÄ¿ Matching Icon Packs**:
- 22 icon themes with color-coordinated file icons
- Monochrome variants for 13 themes
- Auto-pairing: Icons match your active theme automatically

**ΓÜí Smart Theme Commands**:
- `M Tech Themes: select theme` - Category-based picker (Light/Dark sections)
- `M Tech Themes: activate icons` - Apply matching icon theme
- `M Tech Themes: set theme and icons` - Atomically apply both
- Auto-dismissing notifications (3-second timeout, no manual close needed)

**≡ƒîê Design Philosophy**:
- Each theme has unique personality and color identity
- Temperature-consistent palettes (warm themes stay warm, cool stay cool)
- Dual system coverage (UI colors + syntax token colors)
- Multi-language tested (TypeScript, Python, HTML, CSS, Markdown, JSON)

### ≡ƒöº Technical Details

**Extension Capabilities**:
- Works in VS Code and Cursor
- Supports untrusted workspaces
- Browser and Node.js extension hosts
- Minimal resource footprint

**Configuration**:
- `techThemes.fileIconsMonochrome` - Enable monochrome icon variants

### ≡ƒôª What's Included

- 21 color themes (13 dark, 8 light)
- 22 icon themes (with monochrome variants)
- Comprehensive WCAG accessibility compliance
- Professional command palette integration
- Auto-pairing icon theme system

---

**License**: MIT  
**Repository**: [mtech-pro-vscode-themes](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes)  
**Issues**: [Report a bug](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues)
