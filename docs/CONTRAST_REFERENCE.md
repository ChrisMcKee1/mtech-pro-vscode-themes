# VS Code Theme Contrast Reference

**Purpose**: Quick reference for WCAG-compliant theme development  
**Last Updated**: June 2025  
**Official Source of Truth**: Always fetch https://code.visualstudio.com/api/references/theme-color before making changes — properties evolve with every VS Code release.

---

## WCAG Requirements

| Element Type | Minimum Contrast | Target | Standard |
|--------------|------------------|---------|----------|
| Normal text (syntax) | 4.5:1 | 7:1+ (AAA) | WCAG 2.1 AA |
| UI elements & graphical objects | 3.0:1 | 4.5:1+ | WCAG 2.1 AA |
| Large text (>18px or >14px bold) | 3.0:1 | 4.5:1+ | WCAG 2.1 AA |
| High contrast themes | 7.0:1 | 10:1+ | WCAG 2.1 AAA |

> **Design-first override (Path B — Established Palette Exemption)**: When a theme is based on an established, iconic palette (e.g., Nord, Dracula, Tokyo Night), we allow softer contrast to preserve the exact hex codes and aesthetic identity. Document the intent in `docs/ACCESSIBILITY_FRAMEWORK.md` and add the theme to `DESIGN_PRIORITY_THEMES` (see `tests/lib/theme-utils.js`). The contrast analyzer will log an ℹ️ informational note—as long as **syntax stays ≥ 3.0:1** and overlays stay above ~1.5:1—so we protect the look without hiding the ratios. Actual bugs (invisible find highlights, screaming comment punctuation) must still be fixed regardless of path.

> **Overlay visibility floor**: Selections/diffs are judged with a pragmatic floor of ~1.5:1 when opacities are within the documented ranges. Anything below 1.5:1 remains a high-priority issue.

---

## Core Design Rules

### 1. Contrast Inversion (Light ↔ Dark)

**Dark Theme → Light Theme**:
- Dark backgrounds (#2e3440, #3b4252) → Light backgrounds (#ECEFF4, #E5E9F0)
- Light foregrounds (#FFFFFF, #ECEFF4) → Dark foregrounds (#2E3440, #434C5E)

### 2. Property Pairing

**Every background MUST have a foreground**:
```json
// ✅ CORRECT
"menu.selectionBackground": "#ECEFF4",
"menu.selectionForeground": "#2E3440",

// ❌ WRONG (missing foreground)
"menu.selectionBackground": "#ECEFF4"
```

### 3. Multi-State Testing

Test all 7 combinations:
1. Hover alone
2. Focus alone
3. **Focus + Hover** (property precedence test)
4. Selection alone
5. Selection + Hover
6. Focus + Selection
7. Inactive window

**Property Precedence**: `focus` properties override `hover` properties when both states apply.

---

## Critical Property Checklist

### Selection & Highlighting
- [ ] `editor.selectionBackground` + `foreground`
- [ ] `editor.findMatchBackground` + `findMatchHighlightBackground` + `findRangeHighlightBackground`
- [ ] `editor.wordHighlightBackground` + `wordHighlightStrongBackground`

### Diff Views
- [ ] `diffEditor.insertedTextBackground` (25-35% opacity — must use transparency!)
- [ ] `diffEditor.removedTextBackground` (25-35% opacity — must use transparency!)
- [ ] `diffEditor.insertedLineBackground` + `removedLineBackground`

### Lists & Menus
- [ ] `list.hoverBackground` + `hoverForeground`
- [ ] `list.focusBackground` + `focusForeground`
- [ ] `list.activeSelectionBackground` + `activeSelectionForeground`
- [ ] `list.inactiveSelectionBackground` + `inactiveSelectionForeground`
- [ ] `menu.selectionBackground` + `selectionForeground`
- [ ] `menubar.selectionBackground` + `selectionForeground`

### Buttons & Inputs
- [ ] `button.background` + `foreground`
- [ ] `button.hoverBackground` + `hoverForeground`
- [ ] `button.secondaryHoverBackground` + `secondaryHoverForeground`
- [ ] `input.background` + `foreground`
- [ ] `inputOption.activeBackground` + `activeForeground`

### Tabs & Panels
- [ ] `tab.activeBackground` + `activeForeground`
- [ ] `tab.hoverBackground` + `hoverForeground`
- [ ] `editorGroupHeader.tabsBackground` + `tabsForeground`
- [ ] `panel.background` + `foreground` (if exists)

### Status Bar
- [ ] `statusBarItem.prominentBackground` + `prominentForeground`
- [ ] `statusBarItem.prominentHoverBackground` + `prominentHoverForeground`
- [ ] `statusBarItem.remoteBackground` + `remoteForeground`
- [ ] `statusBarItem.remoteHoverBackground` + `remoteHoverForeground`

### Scrollbars
- [ ] `scrollbarSlider.background` (semi-transparent or opaque)
- [ ] `scrollbarSlider.hoverBackground`
- [ ] `scrollbarSlider.activeBackground`

### Focus Indicators
- [ ] `list.focusOutline`
- [ ] `list.focusAndSelectionOutline`
- [ ] `list.inactiveFocusOutline`

---

## Opacity Guidelines

### Selection & Highlights (Dark Themes)
- Selection: 30-50% range (`4D`-`80` hex), 35% typical target (`59`)
- Find hierarchy: 30/20/15/25/30 (match/highlight/range/word/word-strong)
- Line highlight: 15-20% (`26`-`33` hex)

### Selection & Highlights (Light Themes)
- Selection: 30-50% range (`4D`-`80` hex), 30% typical target (`4D`)
- Find hierarchy: 30/20/15/25/30 (match/highlight/range/word/word-strong)
- Line highlight: 20-25% (`33`-`40` hex)

**If overlay contrast falls below ~1.5:1**: darken the base hue (keep the same color family) rather than pushing opacity higher, and document the palette in `LIGHT_THEME_TRADEOFFS` (`tests/lib/theme-utils.js`).

### Diff Background Targets
- **Line backgrounds**: 30% dark (`4D`) / 25% light (`40`)
- **Word changes**: 35% dark (`59`) / 30% light (`4D`)
- **Gutter marks**: 50% dark (`80`) / 40% light (`66`)

### Combined Overlay Caps
- Dark themes: 55% combined cap (selection + diff, find + diff)
- Light themes: 48-50% combined cap (selection + diff, find + diff)

**Why NOT 75-80%?**: High opacity causes double-layer obscurity when overlapped with find highlights.

---

## Common Color Palettes

### Arctic Nord (Official Palette)
**Dark Theme**:
- Background: `#2E3440`, `#3B4252`, `#434C5E`
- Foreground: `#ECEFF4`, `#E5E9F0`, `#D8DEE9`
- Accent: `#88C0D0` (Frost), `#81A1C1`, `#5E81AC`

**Light Theme**:
- Background: `#ECEFF4`, `#E5E9F0`, `#D8DEE9`
- Foreground: `#2E3440`, `#3B4252`, `#4C566A`
- Accent: `#5E81AC` (darker Frost)

### Generic Dark Theme
- Background: `#1e1e1e`, `#252526`, `#2d2d30` (never pure `#000000`)
- Foreground: `#d4d4d4`, `#cccccc`
- Selection: `#264f78` (50% opacity)

### Generic Light Theme
- Background: `#ffffff`, `#f3f3f3`, `#e7e7e7` (prefer off-white like `#fdfaf7` to reduce glare)
- Foreground: `#1a1a1a`, `#3b3b3b` (avoid pure `#000000`)
- Selection: `#add6ff` (60% opacity)

---

## Property Validation Workflow

1. **Extract all properties** from theme JSON
2. **Verify against official docs**: https://code.visualstudio.com/api/references/theme-color
3. **Check pairing**: Every `*Background` needs `*Foreground`
4. **Test multi-state**: Focus + Hover combinations
5. **Run coverage analyzer**: `node tests/analyze-theme-properties.js` lists any missing checklist entries or unmatched background/foreground pairs
6. **Validate contrast**: Use automated tests

---

## Common Mistakes

### ❌ Missing Foreground Property

```json
"button.secondaryHoverBackground": "#ECEFF4"
// Missing: "button.secondaryHoverForeground": "#2E3440"
```

### ❌ Property Precedence Oversight

```json
// BAD: Focus overrides hover in focus+hover state
"list.focusForeground": "#FFFFFF",    // White - takes precedence!
"list.hoverForeground": "#2E3440",    // Dark - ignored in focus+hover

// GOOD: Both properties work together
"list.focusForeground": "#ECEFF4",    // Readable
"list.hoverForeground": "#2E3440"
```

### ❌ Invalid Properties (Not in VS Code API)

```json
// These don't exist - use list.* properties instead
"scmGraph.historyItemHoverBackground": "#ECEFF4",  // ❌
"scmGraph.historyItemHoverForeground": "#2E3440"   // ❌
```

### ❌ Copying Dark → Light Without Inversion

```json
// BAD: Light theme using dark theme colors
"activityBar.background": "#ECEFF4",  // Light bg
"activityBar.foreground": "#FFFFFF"    // Light fg - no contrast!

// GOOD: Inverted for light theme
"activityBar.background": "#ECEFF4",
"activityBar.foreground": "#434C5E"    // Dark fg
```

---

## Pre-Release Checklist

### Automated Tests

- [ ] `.\run-tests.cmd --contrast` (accessibility analysis)
- [ ] `.\run-tests.cmd --quick` (structure validation)
- [ ] `.\run-tests.cmd --full` (comprehensive)

### Manual Tests

- [ ] GitLens commit graph (hover, focus, focus+hover)
- [ ] Command Palette (hover, selection)
- [ ] File Explorer (all list states)
- [ ] Search results
- [ ] Terminal (ANSI colors, selection)
- [ ] Diff views (additions, deletions)
- [ ] Settings UI (all input types)

### Property Validation

- [ ] All properties exist in official VS Code API
- [ ] All `*Background` properties have `*Foreground`
- [ ] Multi-state scenarios tested (focus+hover)
- [ ] No invalid/invented properties

---

## References

- **VS Code Theme Color Reference (Source of Truth)**: <https://code.visualstudio.com/api/references/theme-color>
- **VS Code Color Theme Guide**: <https://code.visualstudio.com/api/extension-guides/color-theme>
- **VS Code File Icon Theme Guide**: <https://code.visualstudio.com/api/extension-guides/file-icon-theme>
- **VS Code Product Icon Theme Guide**: <https://code.visualstudio.com/api/extension-guides/product-icon-theme>
- **WCAG Guidelines**: <https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html>
- **Accessibility Framework**: `docs/ACCESSIBILITY_FRAMEWORK.md`
- **Test Suite Docs**: `tests/TEST_SUITE_DOCUMENTATION.md`

---

## Additional Skill-Aligned Guidance

### Palette Architecture: 60-30-10 Rule

When designing or refactoring a theme, follow the **60-30-10** color distribution:

- **60% Dominant Base**: Primary backgrounds (editor, workbench). Avoid pure black (`#000000`) or pure white (`#FFFFFF`). Use deep neutrals or soft off-whites.
- **30% Secondary**: Structural UI elements (Activity Bar, Side Bar, inactive tabs). Use tints/shades of the base color, not entirely new hues.
- **10% Accent**: Highly saturated colors for active states, primary buttons, and critical markers.

### Semantic Highlighting

Always set `"semanticHighlighting": true` in theme JSON and define `semanticTokenColors` for richer, more accurate coloring beyond TextMate scopes.

### Terminal ANSI Color Inversion

- **Dark themes**: `terminal.ansiBlack` and `terminal.ansiBrightBlack` must be mapped to a lighter gray/white to be visible against dark backgrounds.
- **Light themes**: `terminal.ansiWhite` and `terminal.ansiBrightWhite` must be heavily darkened to be visible.

### Bracket Pair Colorization

Define all 6 levels of `editorBracketHighlight.foreground1` through `foreground6`. Use distinct but not overwhelming colors. Also define `editorBracketPairGuide.*` properties.

### Scrollbar 3-State Visibility

Define all three scrollbar states with progressive visibility:
- `scrollbarSlider.background` — unobtrusive at rest
- `scrollbarSlider.hoverBackground` — higher contrast on hover
- `scrollbarSlider.activeBackground` — highest contrast when actively scrolling

### File Icon Theme Variants

File icon themes should include `light` and `highContrast` overrides so icons are visible across all theme types:

```json
{
  "light": { /* icon overrides for light themes */ },
  "highContrast": { /* icon overrides for HC themes */ }
}
```

### Product Icon Themes

Product icon themes (replacing VS Code's built-in UI icons like codicons) are **separate** from file icon themes. See the [Product Icon Theme Guide](https://code.visualstudio.com/api/extension-guides/product-icon-theme).

### Newer Color Categories

Check coverage for recently added VS Code color properties:
- **Chat colors**: `chat.requestBackground`, `chat.slashCommandForeground`, etc.
- **Inline Chat**: `inlineChat.background`, `inlineChatInput.*`
- **Inline Edits**: `inlineEdit.gutterIndicator.*`, `inlineEdit.modifiedBackground`
- **Command Center**: `commandCenter.foreground/background/border`
- **Sticky Scroll**: `editorStickyScroll.*`, `sideBarStickyScroll.*`

> Always fetch https://code.visualstudio.com/api/references/theme-color for the latest complete list.
