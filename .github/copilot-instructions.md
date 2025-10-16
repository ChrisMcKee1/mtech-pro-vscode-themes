# M Tech Themes - Custom Instructions for AI Coding Agents

## Overview

This VS Code extension provides 20 professional color themes with matching icon packs, distributed as VSIX via GitHub releases. These instructions help AI agents understand the codebase architecture, maintain consistency, and follow accessibility best practices when modifying or creating themes.

**Purpose**: Guide AI coding agents to be immediately productive in this codebase by providing essential knowledge about architecture patterns, critical workflows, and project-specific conventions that aren't obvious from file inspection alone.

## Quick Reference

**Key Files**: `package.json`, `js/main.js`, `js/browser.js`, `themes/*.json`, `icon-themes/*.json`  
**Test Command**: `cd tests && run-tests.cmd`  
**Theme Preview**: F1 → "Developer: Reload Window"  
**Repository**: [mtech-pro-vscode-themes](../README.md)

## Critical Architecture Patterns

### 1. Theme-Icon Pairing System (Core Invariant)

Every theme MUST have a matching icon theme via naming convention:
- Color theme `"Tokyo Night"` → Icon theme `"Tokyo Night Icons"`
- Monochrome variant → `"Tokyo Night Monochrome Icons"`
- Fallback → `"Classic Icons"` (when specific icons don't exist)

**Implementation in `js/main.js`**:
```javascript
getMatchingIconTheme(themeName) {
    const baseIconTheme = `${themeName} Icons`;
    const monochromeIconTheme = `${themeName} Monochrome Icons`;
    
    if (this.fileIconsMonochrome && hasMonochrome) {
        return monochromeIconTheme;
    }
    return baseIconTheme || "Classic Icons";
}
```

### 2. Triple Source of Truth (Critical Synchronization)

Theme lists MUST stay synchronized across THREE locations:
1. `package.json` → `contributes.themes[]` and `contributes.iconThemes[]`
2. `js/main.js` → `THEME_CONFIG.themes` and `THEME_CONFIG.iconThemes`
3. `js/browser.js` → duplicate of main.js config (for browser context)

**When adding themes**: Update all three files + create JSON files in `themes/` and `icon-themes/`

### 3. File Naming Convention (Case-Sensitive)

- Theme files: `themes/Theme Name.json` (spaces allowed)
- Icon theme files: `icon-themes/Theme Name icon-theme.json` (lowercase "icon-theme")
- Icon theme ID in package.json: `"Theme Name Icons"` (capitalized, no hyphen)

## Key Workflows

### Testing Theme Consistency

The test suite provides automated validation and accessibility analysis:

```bash
cd tests

# Quick structure validation (DEFAULT) - 2-3 seconds
.\run-tests.cmd --quick

# Full accessibility analysis - 5-10 seconds
.\run-tests.cmd --contrast

# Refactor progress dashboard - 1 second
.\run-tests.cmd --status

# Run all tests - 10-15 seconds
.\run-tests.cmd --full

# Show available modes
.\run-tests.cmd --help
```

**Test Modes**:

- **`--quick`** (default): Fast structure validation
  - Theme-icon pairing correctness
  - File existence verification
  - Triple Source of Truth synchronization
  - Orphaned file detection
  - Command functionality simulation

- **`--contrast`**: Automated WCAG accessibility analysis
  - Calculates contrast ratios for syntax highlighting (4.5:1 minimum)
  - Validates UI elements (selection, diffs, brackets - 3:1 minimum)
  - Detects low-opacity overlays (invisible selections/diffs)
  - Identifies missing visual hierarchy (find system, scrollbars)
  - Prioritizes themes by refactor urgency (URGENT/HIGH/MEDIUM/LOW/CLEAN)

- **`--status`**: Refactor progress tracking
  - Parses THEME_IMPROVEMENTS_ANALYSIS.md for completed refactors
  - Shows grade improvements (D- → A-, percentage points gained)
  - Lists pending themes needing work
  - Estimates remaining effort

- **`--full`**: Comprehensive pre-release validation
  - Runs all tests sequentially
  - Use before packaging VSIX

### Building VSIX
No build step required for theme JSON. Manual VSIX creation via:
1. Ensure `package.json` version is updated
2. Package with `vsce package` (if installed)
3. Distribute via GitHub releases

### Theme Structure
Themes use VS Code's standard color token format:
- `colors`: UI elements (e.g., `"activityBar.background": "#161613"`)
- `tokenColors`: Syntax highlighting with TextMate scopes

Example scope pattern from `Classic.json`:
```json
{"scope": ["keyword.control"], "settings": {"foreground": "#f92672"}}
```

### Accessibility & Design Standards

**WCAG Contrast Requirements**:
- Normal text: **4.5:1** minimum contrast ratio (text to background)
- UI elements: **3:1** minimum contrast ratio
- High contrast themes: **7:1** for critical text
- Selection highlights: **3:1** against regular background, text must remain readable

**Critical Accessibility Rules**:
1. **Never use pure black (#000000)** - use dark gray/blue-tinted backgrounds (e.g., `#1e1e1e`, `#272822`)
2. **Test highlighted text** - selection colors must not make text unreadable
3. **Visible scrollbars** - define `scrollbarSlider.background`, `hoverBackground`, and `activeBackground`
4. **Color blindness** - don't rely on red/green alone; use icons, shapes, or lightness differences
5. **Semi-transparent overlays** - use alpha channels for find matches, line highlights (e.g., `#FFCC0033`)
6. **High contrast mode** - use `editorUnnecessaryCode.border` instead of opacity reduction

**Automated Testing Workflow**:
1. **Before refactoring**: Run `.\run-tests.cmd --contrast` to identify all accessibility issues
2. **During development**: Run `.\run-tests.cmd --quick` for fast validation (2-3s)
3. **After refactoring**: Run `.\run-tests.cmd --contrast` to verify fixes
4. **Track progress**: Run `.\run-tests.cmd --status` to see completed vs pending themes
5. **Pre-release**: Run `.\run-tests.cmd --full` for comprehensive validation

**Manual Verification** (after automated tests pass):
- Reload window (F1 → Developer: Reload Window)
- Activate refactored theme
- Test in TypeScript/JavaScript/Python files
- Use `Developer: Inspect Editor Tokens` to verify syntax coloring
- Check diff views, terminal ANSI colors, and all UI panels
- Validate scrollbar visibility in all states (rest/hover/active)

## Common Modifications

### Adding a New Theme
1. Create `themes/New Theme.json` with color definitions
2. Create `icon-themes/New Theme icon-theme.json` (or reuse existing mappings)
3. Add to `package.json`:
   ```json
   {"label": "New Theme", "uiTheme": "vs-dark", "path": "./themes/New Theme.json"}
   {"label": "New Theme Icons", "id": "New Theme Icons", "path": "./icon-themes/New Theme icon-theme.json"}
   ```
4. Add `"New Theme"` to `THEME_CONFIG.themes` in **both** `js/main.js` and `js/browser.js`
5. Add `"New Theme Icons"` to `THEME_CONFIG.iconThemes` in both files
6. **Validate with automated tests**:
   ```bash
   cd tests
   .\run-tests.cmd --quick      # Verify structure (2-3s)
   .\run-tests.cmd --contrast   # Check accessibility (5-10s)
   ```
7. Fix any issues identified by contrast analysis
8. Manual verification: Reload window, test in multiple languages

### Updating Theme Colors
Edit JSON directly in `themes/*.json`. Changes apply immediately on reload (F1 → "Developer: Reload Window").

### Extension Commands
Three registered commands in `js/main.js`:
- `tech_pro.select_theme` → Category picker (Light/Dark sections)
- `tech_pro.activate_icons` → Apply matching icon theme for current color theme
- `tech_pro.set_theme_and_icons` → Atomically set both theme + icons

## Theme Design Best Practices

### Color Palette Guidelines

**Background Colors**:
- Dark themes: Use off-black (e.g., `#272822`, `#1e1e1e`) never pure `#000000`
- Light themes: Use off-white or light gray to reduce glare, avoid pure `#FFFFFF` if possible
- Example: Classic uses `#272822` (dark gray-green), Night Owl uses dark blue-gray

**Syntax Color Strategy**:
- Limit palette to 4-6 main hues for consistency
- Common assignments: blue (keywords), green (strings), orange/yellow (constants), red (errors)
- Avoid neon/pure saturated colors on dark backgrounds (causes glare)
- Ensure color distinction for colorblind users (don't rely on red/green alone)

**Critical UI Elements** (must be clearly visible):
- Selection: `editor.selectionBackground` with **3:1** contrast, text readable on highlight
- Scrollbars: Define all states (`scrollbarSlider.background/hover/active`)
- Current line: `editor.lineHighlightBackground` with subtle transparency
- Find matches: Use semi-transparent overlays (e.g., `rgba(255, 204, 0, 0.2)`)
- Error/warning indicators: High contrast red/yellow even in low-contrast themes

### Light vs Dark Theme Differences

**Don't simply invert colors** - each requires separate optimization:

**Dark Theme Specifics**:
- Use slightly desaturated colors (softer on eyes in low light)
- Higher brightness text (`#fdfff1` vs pure white)
- Muted UI chrome to keep focus on editor content
- Example: Tokyo Night uses neon-soaked colors on dark blue-black

**Light Theme Specifics**:
- Requires different contrast tuning (more critical than dark)
- Use darker, more saturated accent colors
- Avoid pure white backgrounds (slight gray/warm tint better)
- Test in bright environments - colors may wash out
- Example: Filter Sun uses energetic brightness with proper contrast

### Multi-Language Testing

Always test themes across:
- JavaScript/TypeScript (complex syntax)
- Python (indentation-heavy)
- HTML/CSS (markup + styling)
- Markdown (mixed formatting)
- JSON (nested structures)
- Use `Developer: Inspect Editor Tokens` to verify token coloring

### Incremental Color Changes

When adjusting existing themes:
1. **Identify issues**: Run `.\run-tests.cmd --contrast` to see all accessibility problems
2. **Prioritize fixes**: Focus on URGENT/HIGH priority issues first
3. Change one color family at a time (e.g., all string colors)
4. **Quick validation**: Run `.\run-tests.cmd --quick` after each change (2-3s)
5. Test in real code files, not just samples
6. Verify related UI elements (status bar, tabs, panels)
7. Check both active/inactive states
8. **Verify fixes**: Run `.\run-tests.cmd --contrast` to confirm all issues resolved
9. **Track progress**: Run `.\run-tests.cmd --status` to update refactor tracking

**Common fixes identified by automated analysis**:
- Low-contrast comments: 2.3-2.8:1 → darken by 30-40%
- Invisible selections: 10-15% opacity → increase to 30-40%
- Invisible diffs: 10% opacity → increase to 30%
- Missing find hierarchy: all identical → use 50%/40%/30%/35% tiers
- Bracket invisibility: adjust saturated colors for light themes

## Project-Specific Conventions

### Theme Categorization
Light themes detected via keywords OR explicit list:
```javascript
const lightThemes = ["Filter Sun", "Tokyo Day", "Enchanted Grove", ...];
theme.includes("Light") || theme.includes("Sun") || lightThemes.includes(theme)
```

### Version Update Messages
`UPDATE_MESSAGES` object in `js/main.js` shows notifications on version changes. Uses `globalState` to track last shown version.

### Icon Theme Structure
Icons use font glyphs (`tech_pro_icons.woff`). Each icon defined via:
- `fontCharacter`: Unicode point (e.g., `"\\F101"`)
- `fontColor`: Theme color (e.g., `"#ab9df2"`)

File associations via `fileExtensions`, `fileNames`, and `languageIds` maps.

## Learning from Successful Themes

**Why Popular Themes Succeed**:

- **One Dark Pro** (7M+ installs): Balanced dark gray background with moderate contrast, harmonious colors, minimalist feel. Shows less is more.
- **Dracula Official** (5M+ installs): Dark purple background + vibrant neon accents. High contrast makes syntax pop. "Vibrant yet soothing" balance.
- **GitHub Theme** (8M+ installs): Familiar, clean, no-frills. Multiple variants (light/dark/high-contrast/colorblind). Proves neutrality works.
- **Night Owl** (2M+ installs): Explicitly designed for accessibility and colorblind users. Muted palette on dark blue background. Meaningful contrast over flashiness.
- **Shades of Purple** (1M+ installs): Bold creative standout with deep purple + neon. Shows playful themes can work if contrast is solid.

**Key Lessons**:
- Successful themes have a **clear design philosophy** (minimalist, vibrant, nostalgic, etc.)
- They offer **variants** for different preferences (dark/light/high-contrast/colorblind)
- They maintain **consistent branding** across the palette
- They prioritize **readability** while expressing personality
- They **iterate based on feedback** (Dracula Soft, Night Owl Light adjustments)

## Gotchas & Common Pitfalls

**Dual File Synchronization**:
- `main.js` and `browser.js` have identical `THEME_CONFIG`
- Keep both updated when adding/removing themes
- Browser.js is for web-based VS Code environments

**Naming Issues**:
- Icon file suffix: `icon-theme.json` NOT `Icon-Theme.json`
- Case sensitivity: Theme labels in package.json must match `THEME_CONFIG` exactly
- No hyphen in package.json icon ID: `"Theme Name Icons"` not `"Theme-Name-Icons"`

**Monochrome Fallback**:
- Not all themes have monochrome icons
- Check `THEME_CONFIG.iconThemes` list before assuming monochrome exists
- Fallback to `"Classic Icons"` if specific icon theme missing

## Related Resources

**VS Code Theme Documentation**:
- [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Color Theme Guide](https://code.visualstudio.com/api/extension-guides/color-theme)
- [Icon Theme Guide](https://code.visualstudio.com/api/extension-guides/file-icon-theme)

**Accessibility Guidelines**:
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [VS Code Accessibility](https://code.visualstudio.com/docs/editor/accessibility)

**Community References**:
- [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)
- [Dracula Official](https://draculatheme.com/)
- [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)
- [GitHub Theme](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme)
