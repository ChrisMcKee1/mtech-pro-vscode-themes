# M Tech Themes for Visual Studio Code Changelog

## [0.9.1] - 2026-04-01

### Accessibility — Full 23-Theme Audit & Fixes
- Deep one-by-one expert audit of all 23 themes covering WCAG contrast, overlays, ANSI colors, brackets, scrollbars, and modern property coverage
- Fixed **Arctic Nord** terminal ansiBlack trap (was 1.45:1 — nearly invisible)
- Fixed **5 light themes** (Cosmic Void Light, Tokyo Day, Feisty Fusion Light, Neon Pink Light, Enchanted Grove) with invisible terminal ansiBlack (was same as background)
- Fixed **Morning Coffee** gold-background debug/warning text readability (2.33:1 → 5.19:1)
- Fixed **Cyberpunk Neon** selection/find overlay hierarchy (selectionHighlight was stronger than selection)
- Fixed **Enchanted Grove Dark** only WCAG failure — semanticTokenColors.newOperator (2.93:1 → 4.58:1)
- Fixed **Obsidian Moss** terminal ansiRed (3.55:1) and ansiMagenta (3.92:1) contrast failures
- Fixed **Graphite Bay** terminal ansiRed (3.79:1) and line number contrast (2.96:1)
- Fixed **OGE Light** tab text contrast (2.31:1 → readable) and restored ansiBlue from orange to actual blue
- Fixed **Sandstone Light** placeholder text (1.77:1 → 3:1+) and restored ansiBlue from orange to actual blue
- Fixed **Neon Pink Light** scrollbar visibility (was 1.85:1), comment/string contrast, duplicate bracket level
- Fixed **Feisty Fusion Light** accent gold used as text (3.13:1 → 4.5:1+) in ~10 UI properties
- Fixed **Arctic Nord Light** variable.parameter contrast (4.13:1 → 5.06:1) and terminal ansiGreen
- Fixed **Enchanted Grove** 7 UI contrast failures (badges, buttons, links, warnings)
- Fixed **Cosmic Void Light** 19 properties using Slate-400 (#94A3B8) that failed on light backgrounds
- Fixed **Tokyo Day** focusBorder (1.53:1 → visible), editorWarning (2.50:1), dark-theme token background leftover

### Terminal ANSI Bright Differentiation
- Added distinct bright ANSI variants across 8 themes where normal/bright pairs were identical
- Themes fixed: Tokyo Night, Cosmic Void, Digital Aqua, Feisty Fusion, Graphite Bay, Mystic Dusk, OGE Dark, Copper Bloom
- Each bright variant is now 15-20% lighter than its normal counterpart for proper bold/bright terminal rendering

### Code Quality — Dead Token Rule Cleanup
- Removed dead Rust-specific tokenColor rules from 20 themes (rule #128 was fully overridden by rule #129)
- Removed duplicate `comment keyword` scope from 21 themes (was defined in two conflicting rules)
- All themes now have clean, conflict-free tokenColor arrays

### Icon Themes
- Added `light` and `highContrast` variant sections to 3 key icon themes (Light, Tokyo Night, Arctic Nord) as templates
- Fixed Mystic Dusk and Tokyo Day icon themes — restored 172 missing `fileNames` associations

### Documentation — Skill Alignment
- Updated `docs/CONTRAST_REFERENCE.md` with HC 7:1 threshold, 60-30-10 rule, semantic highlighting, terminal ANSI, brackets, scrollbar, and icon theme guidance
- Updated `docs/ACCESSIBILITY_FRAMEWORK.md` with official VS Code doc URLs and comprehensive skill-aligned guidance
- Updated `docs/OVERLAY_AUDIT_PLAN.md` — marked as completed reference, aligned diff opacity to 25-35%
- Updated `docs/references/Syntax_Highlighting_Best_Practices.md` with M Tech guidelines appendix

### Agent & Prompt Improvements
- Enhanced all 4 `.github/agents/` definitions with vscode-theme-engineer skill awareness (ANSI inversion, brackets, scrollbars, semantic highlighting, icon variants, modern UI surfaces)
- Updated all 5 `.github/prompts/` with official docs fetch step, ANSI trap warnings, HC 7:1, bracket levels, icon variant guidance

### Test Suite Consolidation
- Removed 28 obsolete one-time fix/analysis scripts (6,268 lines of dead code)
- Added 3 new automated checks to contrast analyzer: terminal ANSI traps, semantic highlighting verification, scrollbar active state validation
- Fixed `lib/theme-utils.js` arrays — removed phantom themes, added missing light themes
- Updated test documentation to reflect streamlined suite
- Full test suite: 87/87 passed, 0 errors

### Quality
- Contrast analysis: 0 Critical, 0 High issues across all 23 themes
- All themes maintain 700+ color properties with modern VS Code API coverage
- All themes have `semanticHighlighting: true` and 6 bracket highlight levels

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
