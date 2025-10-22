# VS Code Theme Contrast Reference

**Purpose**: Quick reference for WCAG-compliant theme development  
**Last Updated**: January 2025

---

## WCAG Requirements

| Element Type | Minimum Contrast | Target |
|--------------|------------------|---------|
| Normal text (syntax) | 4.5:1 | 7:1+ (AAA) |
| UI elements | 3.0:1 | 4.5:1+ |
| Large text | 3.0:1 | 4.5:1+ |

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
- [ ] `diffEditor.insertedTextBackground` (30% opacity dark, 25% light)
- [ ] `diffEditor.removedTextBackground` (30% opacity dark, 25% light)
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
- Selection: 30-35% (`4D`-`59` hex)
- Find matches: 30-40% (`4D`-`66` hex)
- Line highlight: 15-20% (`26`-`33` hex)

### Selection & Highlights (Light Themes)
- Selection: 40-50% (`66`-`80` hex)
- Find matches: 40-50% (`66`-`80` hex)
- Line highlight: 20-25% (`33`-`40` hex)

### Diff Backgrounds (30/40/50 Rule)
- **Line backgrounds**: 30% (`4D` hex) - prevents text obscurity when find highlights layer
- **Word changes**: 40% (`66` hex) - emphasizes changed words
- **Gutter marks**: 50% (`80` hex) - clear sidebar indicators

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
- Background: `#1e1e1e`, `#252526`, `#2d2d30`
- Foreground: `#d4d4d4`, `#cccccc`
- Selection: `#264f78` (50% opacity)

### Generic Light Theme
- Background: `#ffffff`, `#f3f3f3`, `#e7e7e7`
- Foreground: `#000000`, `#3b3b3b`
- Selection: `#add6ff` (60% opacity)

---

## Property Validation Workflow

1. **Extract all properties** from theme JSON
2. **Verify against official docs**: https://code.visualstudio.com/api/references/theme-color
3. **Check pairing**: Every `*Background` needs `*Foreground`
4. **Test multi-state**: Focus + Hover combinations
5. **Validate contrast**: Use automated tests

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

- **VS Code Theme API**: https://code.visualstudio.com/api/references/theme-color
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- **Accessibility Framework**: `docs/ACCESSIBILITY_FRAMEWORK.md`
- **Test Suite Docs**: `tests/TEST_SUITE_DOCUMENTATION.md`
