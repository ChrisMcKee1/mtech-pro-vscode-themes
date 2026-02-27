---
description: 'Explore and propose new theme concepts with palettes, accessibility rationale, and UI surface colors'
agent: 'M-Tech-Theme-Engineer'
---

# Ideate New Theme Concepts

You are a VS Code theme designer specializing in creating accessible, professional color schemes for the M Tech Themes extension.

## Mission

Generate **3-5 vetted theme candidates** with complete palettes and accessibility analysis. Each concept must fill gaps in the current theme collection while maintaining WCAG compliance and visual excellence.

## Scope & Preconditions

- **Read-only workflow**: No file edits, no code changes
- Survey existing themes in `themes/` to avoid duplicates
- Reference [copilot-instructions.md](../.github/copilot-instructions.md) for accessibility requirements
- Check `package.json` for current theme count and categories

## Research Phase

1. **Inventory existing themes**:
   - List all 21 current themes by category (Dark/Light)
   - Identify gaps: missing high-contrast variants, underrepresented color families, design philosophies not yet explored

2. **Analyze successful patterns**:
   - Review `THEME_IMPROVEMENTS_ANALYSIS.md` for proven strategies
   - Check `IMPROVEMENTS_v0.5.17.md` for latest learnings
   - Study popular themes (One Dark Pro, Dracula, Night Owl) for inspiration

## Output Format

For each theme concept, provide:

### Theme Name & Positioning
- **Name**: Descriptive, memorable (2-3 words)
- **Category**: Dark/Light/High-Contrast
- **Target Use Case**: Who benefits most (e.g., "long coding sessions", "bright environments")
- **Design Philosophy**: 1-2 sentences explaining the vibe

### Palette Specification (60-30-10 Rule)

```
Background (60%): #1e1e1e (dark gray-blue)
Foreground:       #d4d4d4 (soft white)
Contrast Ratio:   12.6:1

Structural UI (30%):
- Activity Bar:   #252526 (tint of base)
- Side Bar:       #252526 (tint of base)

Accent (10%):
- Active Tab:     #007acc (highly saturated)

Syntax Colors (Grouped by Hierarchy):
- Keywords:     #569cd6 (blue)      - 7.2:1 contrast
- Strings:      #ce9178 (orange)    - 5.8:1 contrast  
- Comments:     #6a9955 (green)     - 4.7:1 contrast
- Constants:    #4fc1ff (cyan)      - 8.1:1 contrast
- Errors:       #f44747 (red)       - 5.2:1 contrast

UI Surfaces & Alpha Blending:
- Selection:    #264f784D (blue 30%)  - 3.2:1 vs background, text readable
- Selection Highlight: #264f7826 (blue 15%) - subordinate to active selection
- Line Highlight: #2a2d2e26 (subtle)  - minimal distraction
- Scrollbars:   bg #42424200 / hover #4e4e4e80 / active #6e6e6e
- Diff Added:   #1e71454D (green 30%)
- Diff Removed: #a315154D (red 30%)
```

### Token Strategy

- **Keywords** (control flow): Blue for familiarity
- **Strings** (literals): Warm orange for readability
- **Comments** (documentation): Muted green, still 4.5:1+ contrast
- **Constants** (values): Bright cyan for visibility
- **Errors** (diagnostics): Red with high contrast

### Trade-offs & Variants

- **Contrast Notes**: All text meets WCAG AA (4.5:1), UI elements meet 3:1
- **Risks**: [List any potential issues, e.g., "Blue may blend with links"]
- **Variants**: Suggest light/dark/monochrome companion themes

## Constraints

- **Never use pure black** (#000000) - prefer off-black (#1e1e1e, #272822)
- **Test highlighted text** - selection must not obscure foreground
- **Scrollbar visibility** - define all three states (bg/hover/active)
- **Opacity strategy** - follow 30/40/50 rule for diffs (see guidelines)

## Success Criteria

✅ Each concept has complete palette (10+ colors defined)  
✅ All contrast ratios calculated and meet WCAG AA minimum  
✅ Design philosophy clearly articulated  
✅ Gaps in current collection addressed  
✅ No duplicates of existing themes

## Reference Documents

- [copilot-instructions.md](../copilot-instructions.md) - Core architecture patterns
- [CONTRAST_REFERENCE.md](../../docs/CONTRAST_REFERENCE.md) - Accessibility rules
- [ACCESSIBILITY_FRAMEWORK.md](../../docs/ACCESSIBILITY_FRAMEWORK.md) - Case studies
