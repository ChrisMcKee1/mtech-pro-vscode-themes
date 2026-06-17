# M Tech Themes for Visual Studio Code Changelog

## [0.14.1] - 2026-06-17

### New themes (2) — now 31 total

- **Hurricanes** (Dark & Light) — a special edition celebrating the Carolina Hurricanes' 2026 Stanley Cup Championship. **Hurricanes Dark (Home)** is team red over a charcoal-black editor with aggressively red-forward syntax; **Hurricanes Light (Away)** is red over white and silver. Both ship with matching icon themes.
- Validated against the official VS Code Theme Color Reference (no unsupported keys) with 0 critical / 0 high accessibility issues.

## [0.14.0] - 2026-06-17

### New themes (6) — now 29 total

- **America250 Dark** & **America250 Light** — a red/white/blue theme commemorating the 2026 United States Semiquincentennial, with bracket-pair colors that flow like the official "250" ribbon. Includes matching icon themes.
- **Grove Night** — a deep, near-black green editor theme — plus three hue-swapped siblings: **Crimson Night**, **Ember Night**, and **Sapphire Night**. Each ships with matching standard and monochrome icon themes.

### Fixes & quality

- Validated every theme against VS Code's official Theme Color Reference and removed 800+ unsupported color keys that VS Code was silently ignoring — all 29 themes are now spec-compliant with no dead entries.
- Fixed the Welcome page tile hover making text unreadable on several themes (Grove Night, Enchanted Grove, Enchanted Grove Dark, Crimson Night, Ember Night, Sapphire Night, Evening Espresso, Cyberpunk Neon) — the hover state now uses an on-palette shade with clearly readable text.
- Improved deleted-line visibility in the diff view on Chroma Void and Cyberpunk Neon.
- Command Palette matched-letter highlighting now uses the supported `list.focusHighlightForeground` key so highlighted letters render reliably.
- 0 critical / 0 high accessibility issues across all 29 themes.

## [0.13.2] - 2026-06-16

- Fixed text selection still being hard to see in the Search view on Cosmic Void and Tokyo Night — selections now use each theme's bright accent so they're clearly visible.
- Systematic highlight-visibility pass across all 23 themes: text selection, find/word-occurrence highlights, selected rows in the sidebar / Command Palette / peek views, terminal selection, and bracket matches are now reliably visible against each theme's background — fixing cases where a highlight blended into the surface. Selected code text remains readable.

## [0.13.1] - 2026-06-16

- Fixed selection highlight visibility in the Search view — selecting text now shows a clearly visible highlight across all affected themes (Arctic Nord, Arctic Nord Light, Cosmic Void, Cosmic Void Light, Enchanted Grove, Feisty Fusion Light, Neon Pink Light, Obsidian Moss, OGE Dark, OGE Light, Tokyo Day).
- Added full VS Code 1.124 color coverage to all 23 themes: terminal IntelliSense suggestion icons, side bar title styling, and chart colors now match each theme's palette instead of falling back to defaults.

## [0.13.0] - 2026-06-11

### VS Code Token Modernization — all 23 themes

Every theme now exposes a unified, fully up-to-date color surface, with each new value tuned to that theme's own palette.

- 164 new tokens added per theme — terminal suggest icons, testing coverage & peek, notebook cells, merge editor, inlay hints, charts, numbered indent & bracket-pair guides, status-bar hovers, panel sections, welcome page, and more.
- 42 partial-coverage tokens normalized so they're defined consistently everywhere.
- Removed deprecated indent-guide keys (replaced by the current numbered variants).
- 0 critical / 0 high accessibility issues across all themes.

## [0.12.2] - 2026-05-26

- No user-facing changes — republish to refresh in-extension changelog only.

## [0.12.1] - 2026-05-26

- Smaller download — installation package size reduced by ~22% with no change to themes or icons.

## [0.12.0] - 2026-05-26

### VS Code 1.97 → 1.116 Sync (all 23 themes)

Second-pass synchronization with the official `microsoft/vscode` color registry covering everything introduced between January 2025 and May 2026 (post-1.96 deltas). Research delta verified against `extensions/theme-defaults/themes/*`, `src/vs/platform/theme/common/colors/*`, `chatColors.ts`, `inlineEdits/theme.ts`, `scmHistory.ts`, and `miscColors.ts`.

**76 new color keys identified, ~30–40 added per theme**, palette-tuned to each theme's persona — no programmatic fills. Coverage areas:

- **Inline Edits (NES) family** — `inlineEdit.originalBackground/Border`, `modifiedBackground/Border`, `tabWillAcceptOriginal/Modified*`, gutter indicator (`primaryBackground/Border`, `secondaryBackground/Border`).
- **Chat / Copilot UI** — `chat.thinkingShimmer`, `chat.requestBubbleBackground`, `chat.checkpointSeparator`, `chat.editedFileForeground`, `chat.linesAddedForeground/linesRemovedForeground`, `chat.inputWorkingBorderColor1/2/3` (animated gradient stroke).
- **Activity badges** — `activityWarningBadge.background/foreground`, `activityErrorBadge.background/foreground` (diagnostic severity dots).
- **Testing** — `testing.message.error.badgeBackground/Foreground/Border`, `testing.coveredMinimapBackground`, `testing.uncoveredMinimapBackground`.
- **Quick pick / suggest widget** — `quickInputList.focusHighlightForeground`, `editorSuggestWidget.selectedForeground/selectedIconForeground`.
- **Source Control Graph** — `scmGraph.historyItemHoverDefaultLabel*` chips.
- **Misc** — `scrollbar.background`, `textPreformat.border`, `minimap.chatEditHighlight`, `chart.line/axis/guide` family.

Skipped: `agents.*` namespace (Agent Sessions shell only — not part of standard workbench).

All themes pass structure validation (`tests/run-tests.cmd --quick`). Each theme tuned to its individual persona (Arctic Nord, Cyberpunk Neon, Tokyo Night, Enchanted Grove, etc.).

## [0.11.0] - 2026-04-30

### VS Code Property Audit & Modernization (all 23 themes)

Comprehensive audit against the official VS Code Theme Color Reference (snapshot 2026-04-29) plus `microsoft/vscode` source registries (`colorRegistry.ts`, `chatColors.ts`, `inlineEditsViewColors.ts`, etc.). Engine target raised from `^1.90.0` to `^1.94.0` so Copilot-era tokens (chat bubble, inline-edit accept borders, agent session, thinking shimmer, etc.) take effect on user installs.

**Audit deliverable:** `docs/VSCODE_PROPERTY_AUDIT.md` — full property catalogue (50+ areas), per-theme gap matrix, P0/P1/P2 priorities, per-theme palette persona briefs (Path A / Path B classification), and open risks. Source for all per-theme changes below.

**Universal addition (all 23 themes):**
- `testing.coverCountBadgeBackground` and `testing.coverCountBadgeForeground` — palette-derived per theme, ≥4.5:1 contrast.

**Per-theme palette-fit re-tunes** of already-defined Copilot-era tokens (chat request/bubble/code/shimmer/checkpoint/edited/linesAdded/Removed, `chatManagement.sashBorder`, agent session/status, `aiCustomizationManagement.sashBorder`, inline-edit tab-accept/body/gutter, gauge family, markdown alerts, tab selected variants, activity warning/error badges, multi-cursor, SCM graph lanes, editor action list, testing message-error badges, chat minimap markers, profile badges, sticky-scroll). Each theme tuned to its individual persona — no programmatic fills.

### Phase 3 Theme Property Modernization
- Added OGE Light testing coverage count badge colors and retuned Copilot-era chat, agent, gauge, tab, SCM graph, multi-cursor, profile, sash, and sticky-scroll tokens to the cream-paper warm graphite, teal, and orange brand palette.
- Added OGE Dark testing coverage count badge colors and retuned Copilot-era chat, agent, gauge, markdown alert, SCM graph, multi-cursor, profile, sash, and testing-error badge tokens to the safety-orange/mint corporate brand palette.
- Added Neon Pink Light testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge warning, tab, minimap, profile, and sash tokens to its hot-pink-on-pearl palette.
- Added Enchanted Grove testing coverage count badge colors and retuned Copilot-era chat, agent status, inline edit, and sash tokens to its minimalist sage/forest light palette.
- Added Enchanted Grove Dark testing coverage count badge colors and retuned Copilot-era chat, agent, gauge, inline edit, markdown alert, SCM graph, and profile badge tokens to its minimalist deep-forest palette.
- Added Mystic Dusk testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, tab, SCM graph, multi-cursor, and chat minimap tokens to its lavender-violet and mint twilight palette.
- Added Morning Coffee testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, markdown alert, SCM graph, profile, and action-list tokens to its espresso/mocha/caramel light palette.
- Added Obsidian Moss testing coverage count badge colors and retuned Copilot chat, agent status, gauge, and sash tokens to its Monokai cyan/chartreuse palette.
- Added Feisty Fusion Light testing coverage count badge colors and retuned Copilot-era chat, agent, gauge, activity warning, SCM graph, multi-cursor, profile, and sash tokens to its cream paper warm/cool palette.

### Phase 2 Theme Property Modernization
- Added Evening Espresso testing coverage count badge colors and retuned chat user, agent active indicator, checkpoint, and chat code-border tokens to its amber/cyan coffee palette.
- Added Feisty Fusion testing coverage count badge colors and retuned chat request bubbles, agent indicators, gauge foreground, and thinking shimmer to its cool cyan / warm-orange contrast palette.
- Added Cyberpunk Neon testing coverage count badge colors and retuned high-saturation chat, agent status, gauge warning, profile badge, and chat border tokens to the synthwave magenta/cyan/lime palette.
- Added Arctic Nord Light testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge, markdown alert, SCM graph, multi-cursor, minimap, and sash tokens to the Snow Storm Nord light palette.
- Added Arctic Nord testing coverage count badge colors and retuned Copilot-era chat bubble, agent status, and gauge warning tokens to the canonical Nord Frost overlay palette.
- Added Digital Aqua testing coverage count badge colors and retuned chat, agent indicator, profile badge, and chat code-border tokens to the canonical aqua/lime Monokai-Pro Aqua palette.
- Added Copper Bloom testing coverage count badge colors and retuned Copilot-era chat, agent session, gauge, tab, SCM graph, and chat minimap tokens to its warm copper-rose, sage, and mint palette.
- Added Cosmic Void Light testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge, tab, SCM graph, multi-cursor, minimap, profile, sash, and sticky-scroll tokens to the cool slate/indigo light palette.
- Added Cosmic Void testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, markdown alert, SCM graph, profile, and sash tokens to its emerald/sky deep-space palette.
- Added Chroma Void testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge, markdown alert, tab, SCM graph, multi-cursor, minimap, profile, and sash tokens to the strict-accessibility ROYGBIV spectrum palette.
- Added Graphite Bay testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, markdown alert, tab, SCM graph, minimap, profile, and sash tokens to the cool slate-blue Fusion palette.
- Added Sandstone Light testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge, markdown alert, tab, SCM graph, multi-cursor, minimap, profile, and sash tokens to the desert sandstone palette.
- Added Tokyo Night testing coverage count badge colors and retuned Copilot-era chat, agent session, inline edit, multi-cursor, SCM graph, sticky scroll, and badge tokens to canonical Tokyo Night palette values.
- Added Tokyo Day testing coverage count badge colors and retuned Copilot-era chat, agent, inline edit, gauge, markdown alert, tab, SCM graph, minimap, profile, sash, and badge tokens to its soft daylight Tokyo palette.

## [0.10.9] - 2026-04-15

### Patch — WCAG Contrast & New Token Audit

Comprehensive per-theme audit and fix for VS Code v1.100–v1.114 new UI color tokens. Each theme individually reviewed for palette consistency, WCAG compliance, and new token coverage.

**Contrast fixes across 14 themes (~50 color values):**
- Fixed light-theme gauge contrast failures (Morning Coffee, Sandstone Light, Feisty Fusion Light, Cosmic Void Light, Neon Pink Light, Tokyo Day, Enchanted Grove)
- Fixed illegible SCM Graph hover labels (Evening Espresso 1.65:1 → 7.68:1, Chroma Void 2.85:1 → 4.5:1)
- Fixed markdown alert contrast on light backgrounds (Tokyo Day, Neon Pink Light, Cosmic Void Light, Enchanted Grove Dark)
- Fixed testing badge contrast (Copper Bloom, Enchanted Grove Dark)
- Replaced off-palette grays with tinted variants (Tokyo Night, Arctic Nord Light)
- Deduplicated SCM Graph lane colors (Evening Espresso, Neon Pink Light)
- Added missing tokens to Chroma Void (chat.requestBubbleForeground, editorMinimap.inlineChatRemoved, scmGraph.historyItemHoverLabelBackground)
- Fixed Arctic Nord markdownAlert.caution and profileBadge contrast
- Darkened Enchanted Grove Light chat/warning/scmGraph colors for AA compliance (12 properties)
- Fixed Tokyo Day critical failures: gauge, chat lines, scmGraph lanes (11 properties)

**9 themes confirmed clean** (no changes needed): Obsidian Moss, Digital Aqua, Graphite Bay, Mystic Dusk, Feisty Fusion, OGE Light, OGE Dark, Cosmic Void, Cyberpunk Neon

## [0.10.8] - 2026-04-02

### Patch
- Re-release of v0.10.7 for marketplace version compatibility

## [0.10.7] - 2026-04-02

### Patch
- "Set Color Theme" now always applies matching icons automatically — no need to set icons separately
- Previously icons were only auto-applied if user already had tech icons active

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
