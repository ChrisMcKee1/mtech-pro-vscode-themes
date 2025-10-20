---
description: 'Build a new theme from scratch with complete palette, token strategy, and icon pairing'
mode: 'm-tech-theme-engineer'
---

# Create New Theme

You are a VS Code theme architect designing a complete, accessible theme for M Tech Themes from concept to implementation.

## Mission

Build a **production-ready theme** with palette, syntax tokens, UI surfaces, icon pairing, and Triple Source of Truth synchronization.

## Scope & Preconditions

- User provides theme concept (or use `/ideate-theme` first)
- Theme must fill a gap in current collection (21 themes)
- Follow [copilot-instructions.md](../copilot-instructions.md) architecture rules
- Meet WCAG AA accessibility minimums (4.5:1 text, 3:1 UI)
- Pass automated test suite before completion

## Workflow

### 1. Finalize Concept (If Not Provided)

If user hasn't run `/ideate-theme`, gather:
- **Theme Name**: 2-3 words, memorable
- **Category**: Dark/Light/High-Contrast
- **Design Philosophy**: Concept/vibe (e.g., "Nordic winter minimalism", "Neon cyberpunk energy")
- **Color Temperature**: Warm (orange/red) vs Cool (blue/cyan)
- **Target Audience**: Use case (long sessions, bright rooms, accessibility-focused)

**Research official palettes** if applicable:
- Nord themes → Nord 0-15 specification
- Dracula variants → Official Dracula palette
- Gruvbox-inspired → Gruvbox color system

### 2. Design Palette

**Background & Foreground** (establish first):
```
Dark Theme Example:
Background:     #1e1e1e (off-black, never pure #000000)
Foreground:     #d4d4d4 (soft white, readable)
Contrast:       12.6:1 (well above 4.5:1 minimum)

Light Theme Example:
Background:     #f8f8f8 (off-white, not glaring)
Foreground:     #2c2c2c (dark gray, readable)
Contrast:       14.1:1
```

**Syntax Palette** (4-6 core hues):
- **Keywords**: Control flow (if/for/class) - often blue
- **Strings**: Literals ("text") - often orange/green
- **Comments**: Documentation - muted but ≥4.5:1
- **Constants**: Fixed values (true/false/null) - bright for visibility
- **Errors**: Diagnostics - high-contrast red

Calculate contrast ratios for each:
```
Keywords:   #569cd6  →  7.2:1 ✅
Strings:    #ce9178  →  5.8:1 ✅
Comments:   #7fc76a  →  4.8:1 ✅ (lightened for accessibility)
Constants:  #4fc1ff  →  8.1:1 ✅
Errors:     #f44747  →  5.2:1 ✅
```

**UI Surfaces**:
```
Selection:          #264f784D (30% opacity - prevents double-layer obscurity)
  → 3.2:1 vs background, text remains readable
Line Highlight:     #2a2d2e26 (15% opacity - subtle)
Scrollbars:         bg #424242 / hover #4e4e4e / active #6e6e6e (visible in all states)
Diff Added:         #1e71454D (30% green - text readable when find overlays)
Diff Removed:       #a315154D (30% red)
Diff Modified:      #1b81a866 (40% blue - emphasize changed text)
Find Match:         #ffcc0080 (50% yellow - highest priority)
Find Match Other:   #ffcc0066 (40% - secondary matches)
```

### 3. Create Theme JSON

**File**: `themes/[New Theme].json`

Structure:
```json
{
  "name": "New Theme",
  "type": "dark",
  "colors": {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4",
    "editor.selectionBackground": "#264f784D",
    "editor.lineHighlightBackground": "#2a2d2e26",
    
    "scrollbarSlider.background": "#424242",
    "scrollbarSlider.hoverBackground": "#4e4e4e",
    "scrollbarSlider.activeBackground": "#6e6e6e",
    
    "diffEditor.insertedTextBackground": "#1e71454D",
    "diffEditor.removedTextBackground": "#a315154D",
    "diffEditor.modifiedTextBackground": "#1b81a866",
    
    "editor.findMatchBackground": "#ffcc0080",
    "editor.findMatchHighlightBackground": "#ffcc0066",
    
    // ... complete colors object (100+ properties)
  },
  "tokenColors": [
    {
      "scope": ["keyword.control", "storage.type"],
      "settings": {"foreground": "#569cd6"}
    },
    {
      "scope": ["string"],
      "settings": {"foreground": "#ce9178"}
    },
    // ... complete token definitions
  ]
}
```

**Reference existing themes** for complete property coverage:
- Read `themes/Classic.json` or `themes/Tokyo Night.json` for structure
- Ensure all critical properties defined (see THEME_CONTRAST_GUIDELINES.md)

### 4. Create/Reference Icon Theme

**File**: `icon-themes/[New Theme] icon-theme.json`

**Option A: Create Custom Icons** (for unique theme color):
```json
{
  "name": "New Theme Icons",
  "colors": {
    "folderForeground": "#569cd6",
    "fileForeground": "#d4d4d4",
    // ... icon colors matching theme palette
  },
  // ... file associations, folder mappings
}
```

**Option B: Reuse Existing** (for similar color palette):
- Classic Icons (neutral)
- Filter Series Icons (if in Filter family)
- Reference by name in pairing logic

### 5. Register in Triple Source of Truth

**A. package.json**:
```json
{
  "contributes": {
    "themes": [
      {
        "label": "New Theme",
        "uiTheme": "vs-dark",
        "path": "./themes/New Theme.json"
      }
    ],
    "iconThemes": [
      {
        "id": "New Theme Icons",
        "label": "New Theme Icons",
        "path": "./icon-themes/New Theme icon-theme.json"
      }
    ]
  }
}
```

**B. js/main.js** (THEME_CONFIG):
```javascript
const THEME_CONFIG = {
  themes: [
    // ... existing themes ...
    "New Theme"
  ],
  iconThemes: [
    // ... existing icon themes ...
    "New Theme Icons"
  ]
};
```

**C. js/browser.js** (duplicate of main.js):
```javascript
// Same THEME_CONFIG as main.js
```

### 6. Validate with Automated Tests

**Structure validation**:
```bash
cd tests
.\run-tests.cmd --quick
```

Checks:
- Theme-icon pairing correctness
- File existence verification
- Triple Source of Truth synchronization
- No orphaned files

**Accessibility analysis**:
```bash
.\run-tests.cmd --contrast
```

Checks:
- Syntax token contrast ≥ 4.5:1
- UI element contrast ≥ 3:1
- Selection/diff opacity (not invisible)
- Find match hierarchy (50%/40%/30% pattern)
- Scrollbar visibility

**Fix issues** identified by contrast analysis before proceeding.

### 7. Manual Validation

- F1 → "Developer: Reload Window"
- Activate new theme via Quick Pick or `/m-tech-themes`
- Test in multiple languages: TypeScript, JavaScript, Python, Markdown, JSON
- Verify:
  - [ ] Syntax colors distinct and readable
  - [ ] Selection highlights text without obscuring
  - [ ] Scrollbars visible (rest/hover/active states)
  - [ ] Diff views show clear added/removed/modified
  - [ ] Find matches have visual hierarchy
  - [ ] Terminal ANSI colors work

**Use "Developer: Inspect Editor Tokens"** to verify token scopes.

### 8. Document Creation

Update tracking in `THEME_IMPROVEMENTS_ANALYSIS.md`:
```markdown
## New Theme (v0.5.20)
- **Created**: [Date]
- **Concept**: [Design philosophy]
- **Palette**: [Main colors]
- **Accessibility**: All WCAG AA compliant (automated + manual verified)
- **Unique Features**: [What makes it special]
```

## Output Format

### Summary
- Theme name, category, design philosophy
- Gap filled in current collection
- Key accessibility wins (contrast ratios)

### Automated Analysis Results
```
Structure Tests (--quick):
✅ Theme-icon pairing valid
✅ All files exist
✅ Triple Source synchronized
✅ No orphaned files

Accessibility Tests (--contrast):
✅ All syntax tokens ≥ 4.5:1
✅ All UI elements ≥ 3:1
✅ Selection: 3.2:1, text readable
✅ Scrollbars visible in all states
✅ Find hierarchy: 50%/40%/30%
Grade: A (0 issues)
```

### Diffs
Unified diffs for all created/modified files with 3-5 lines context

### Verification Checklist
- [ ] `.\run-tests.cmd --full` passes (all modes)
- [ ] Manual testing in 3+ languages complete
- [ ] Selection/scrollbars/diffs validated
- [ ] Token inspector shows correct scopes
- [ ] THEME_IMPROVEMENTS_ANALYSIS.md updated

### Follow-ups
- Suggest companion variants (light/dark/monochrome)
- Recommend icon theme variations if needed

## Key Principles

✅ **Start with concept - colors serve the identity**  
✅ **Calculate contrast ratios before implementing**  
✅ **Define all critical properties (100+ colors, 50+ tokens)**  
✅ **Synchronize Triple Source of Truth atomically**  
✅ **Validate with automated tests before manual review**  
✅ **Document the creation in analysis tracking**

## Reference Documents

- [copilot-instructions.md](../copilot-instructions.md) - Theme structure and pairing rules
- [THEME_CONTRAST_GUIDELINES.md](../../THEME_CONTRAST_GUIDELINES.md) - Complete property checklist
- [THEME_IMPROVEMENTS_ANALYSIS.md](../../THEME_IMPROVEMENTS_ANALYSIS.md) - Successful themes case studies
- [tests/TEST_SUITE_DOCUMENTATION.md](../../tests/TEST_SUITE_DOCUMENTATION.md) - Test suite guide
