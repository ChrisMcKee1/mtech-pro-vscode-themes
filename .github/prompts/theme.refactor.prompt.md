---
description: 'Improve existing theme(s) with accessibility and semantic correctness while preserving artistic identity'
mode: 'm-tech-theme-engineer'
---

# Theme Refactoring Workflow

You are a theme accessibility engineer improving M Tech Themes through systematic, research-backed refactoring that balances WCAG compliance with artistic vision.

## Mission

**Improve themes** using an iterative, test-driven approach that validates **both accessibility AND semantic correctness**, adapting themes and test harness as edge cases emerge while preserving each theme's unique identity.

## Core Principles

1. **Two validation layers required**: Accessibility (automated) + Semantic correctness (manual)
2. **Research guides, theme identity decides**: `Syntax_Highlighting_Best_Practices.md` provides best practices, but theme concept takes precedence
3. **Test harness evolves**: When tests contradict artistic intent or research, improve the tests
4. **Background verification is mandatory**: Never assume colors from docs, always verify in theme JSON
5. **Opacity compounds**: Selection + diff + find must be tested together
6. **Minimalist ≠ Broken**: Document intentional design trade-offs vs failures
7. **Know when to stop**: 80-85%+ improvement with identity preserved = complete

## Understanding Theme Validation: Two Critical Layers

**CRITICAL**: Theme quality requires validating TWO separate dimensions. **Both are mandatory**.

### Layer 1: Accessibility (Automated Testing)

**What it checks**:
- Contrast ratios: 4.5:1 for text, 3:1 for UI elements
- Opacity levels: Selection, diffs, find highlights
- UI element visibility: Scrollbars, brackets, diagnostics

**Tools**: `.\run-tests.cmd --contrast`

**What it catches**:
- Low-contrast text (comments at 2.8:1)
- Excessive opacity (selection at 80%)
- Invisible UI elements (scrollbars, diff backgrounds)

**What it MISSES**: Semantic correctness (wrong color assignments)

### Layer 2: Semantic Correctness (Manual Review) **← CANNOT BE AUTOMATED**

**What it checks**:
- Appropriate color assignments per token type
- Visual hierarchy matches research best practices
- Theme identity alignment

**Tools**: Your eyes + `Syntax_Highlighting_Best_Practices.md` + VS Code's "Inspect Editor Tokens"

**What it catches**:
- Keywords using wrong hue (blue vs pink/purple)
- Functions same color as variables (no distinction)
- Strings indistinct from numbers (visual confusion)

**Why both layers matter**:

```javascript
// Example: Passes Layer 1 (accessibility) but FAILS Layer 2 (semantic)

// ✅ Layer 1 Automated Test: PASS
{
  keywords: { color: "#FF0000", contrast: 6.2 },  // 6.2:1 passes WCAG ✅
  functions: { color: "#00FF00", contrast: 8.1 }  // 8.1:1 passes WCAG ✅
}

// ❌ Layer 2 Manual Review: FAIL
{
  keywords: "#FF0000",    // RED keywords violate research (should be pink/purple)
  functions: "#00FF00"    // GREEN functions violate research (should be yellow/orange)
}

// Result: Technically accessible but semantically WRONG
// User confusion: Why are keywords red? Why are functions green?
```

**Correct workflow**:
1. Run automated tests (`--contrast`) → Identify accessibility issues
2. Perform manual semantic review → Identify wrong color assignments
3. Fix BOTH types of issues
4. Validate with both layers again

---

## Workflow Overview

### Before You Start: Understand Theme Identity (MANDATORY)

**DO NOT change any colors until you understand**:

1. **Theme concept** (Nordic winter? Enchanted forest? Cyberpunk? Industrial?)
2. **Palette system** (Established like Nord 0-15? Custom? Thematic?)
3. **Design philosophy** (Minimalist vs high-contrast? Warm vs cool?)
4. **Actual background color** (verify in theme JSON, don't assume from docs)

**Critical Lesson - Background Color Trap**:
```bash
# ❌ WRONG: Assume Arctic Nord uses #2E3440 (Nord 0) from palette docs
# ✅ RIGHT: Verify actual background in theme JSON

grep -i "editor.background" themes/Arctic\ Nord.json
# Output: "editor.background": "#3b4252"  (Nord 2, not Nord 0!)

# Impact: Same color #D88690 shows:
#   4.60:1 contrast on #2E3440 (assumed)
#   3.70:1 contrast on #3b4252 (actual)
# That's a 0.90:1 difference!
```

**Research Checklist**:

- [ ] **Theme name analysis**: What does the name suggest? (Forest, Night, Cyber, Nordic, etc.)
- [ ] **Official palette check**: Does established spec exist? (Nord, Dracula, Gruvbox, Solarized)
- [ ] **Document review**: Check [copilot-instructions.md](../copilot-instructions.md) for documented philosophy
- [ ] **Background verification**: Grep actual `editor.background` color from theme JSON
- [ ] **Temperature identification**: Warm (orange/yellow/red) vs Cool (blue/cyan/purple) vs Neutral
- [ ] **Minimalist detection**: Softer contrast intentional? (Check palette spec or ask user)

**Theme Type Categories**:

**Established Palette Themes** (strict compliance required):
- **Nord-based** (Arctic Nord, Tokyo Night if Nord-derived)
  - Official spec: https://www.nordtheme.com/docs/colors-and-palettes
  - Rule: ONLY use Nord 0-15 colors, document any deviations
  
- **Dracula-based** themes
  - Official spec: https://draculatheme.com/contribute
  - Rule: Preserve signature colors (pink `#ff79c6`, cyan `#8be9fd`, purple `#bd93f9`)

- **Gruvbox-inspired** themes
  - Official spec: https://github.com/morhetz/gruvbox
  - Rule: Maintain warm retro aesthetic

**Thematic Palette Themes** (color serves concept):
- **Enchanted Grove**: Magical forest fairy tale
  - Identity: Light Elves (light mode) vs Dark Elves (dark mode)
  - Colors: Forest greens `#228B22`, mystical purples `#B48EAD`, wood browns `#CD5C5C`
  - Rule: NO generic reds/corals - must feel "enchanted forest"

- **Cyberpunk Neon**: High-voltage cyber aesthetics
  - Identity: Electric, futuristic, neon-soaked cityscapes
  - Colors: Neon cyan `#00ff99`, hot pink `#ff3366`, deep purples `#4d1a4d`
  - Rule: Never mute the neon - opacity adjustments only

- **Cosmic Void**: Deep space exploration
  - Identity: Multi-color cosmic spectrum
  - Colors: Vibrant rainbow (red/orange/green/cyan/blue/purple)
  - Rule: Preserve spectrum diversity, don't force single-accent

**Custom Palette Themes** (consistent internal logic):
- **Filter Series**: Industrial precision engineering
  - Each variant distinct (Octagon, Ristretto, Spectrum, Machine, Moon, Sun)
  - Rule: Professional, balanced saturation

**When to Ask User**:
- Theme name unclear (generic names like "Classic", "Light")
- No documentation found (new custom themes)
- Conflicting information (palette docs vs theme implementation)

**Question Templates**:
```
"What is the artistic vision for [Theme Name]?"
"Should [Theme Name] follow official [Palette] specification strictly?"
"Is the softer contrast in [Theme] intentional minimalism or oversight?"
"Are there palette colors I must preserve?"
```

---

## Phase 1: Analyze & Plan

### Step 1: Run Automated Analysis (Layer 1: Accessibility)

```bash
cd tests
.\run-tests.cmd --contrast
```

**Parse output for target theme**:
```
🌙 Theme Name (dark/light) - X issues
  
  CRITICAL (fails 4.5:1):
    ❌ Syntax token fails readability: keyword.control
       Color: #BF616A | Contrast: 2.46:1
       Required: 4.5:1
       → FIX: Lighten to #D88690 (achieves 3.70:1)
  
  HIGH (fails 3:1):
    ❌ Selection invisible (too low opacity)
       Color: #5E81AC1A | Contrast: 1.28:1
       Opacity: 10%
       Required: 3:1
       → FIX: Increase opacity to 35% (recommended)
  
  MEDIUM:
    ⚠️ Missing find hierarchy (all 15% opacity)
    ⚠️ Scrollbar hover feedback unclear
```

**Categorize issues** into tracking structure:
```javascript
{
  critical_syntax: [],      // Syntax tokens < 4.5:1 (or < 3.5:1 for minimalist)
  critical_ui: [],          // UI elements < 3:1
  high_opacity: [],         // Selection > 60%, diff > 50%
  medium_hierarchy: [],     // Find system lacks visual tiers
  low_polish: []           // Scrollbars, minor improvements
}
```

### Step 2: Perform Manual Semantic Review (Layer 2: MANDATORY)

**CRITICAL**: Automated tests only check contrast ratios and opacity. They do NOT validate whether colors are semantically correct according to research best practices. **This manual review is REQUIRED for every theme.**

**Open side-by-side**:
1. [Syntax_Highlighting_Best_Practices.md](../../docs/references/Syntax_Highlighting_Best_Practices.md) (research)
2. `themes/[Theme Name].json` (current implementation)

**Manual Review Checklist** (complete ALL items):

**A. Verify Token Category Assignments** (use Token Inspector):

Open code file in theme, use `F1 → Developer: Inspect Editor Tokens and Scopes`:

- [ ] **Keywords** (`keyword.control`, `storage.type`, `storage.modifier`)
  - Research: "Strong, distinct color to set them off from identifiers"
  - Current color: _________
  - Evaluation: Distinct from variables/functions? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Classes/Types** (`entity.name.class`, `entity.name.type`, `support.class`)
  - Research: "Own color to distinguish from variables and functions"
  - Current color: _________
  - Evaluation: Different from functions and variables? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Functions** (`entity.name.function`, `support.function`)
  - Research: "Warm color that pops, distinct from classes"
  - Current color: _________
  - Evaluation: Stands out, different from classes? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Strings** (`string.quoted`, `string.template`)
  - Research: "Distinct color, easy to spot, helps catch unterminated strings"
  - Current color: _________
  - Evaluation: Clearly different from all other tokens? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Numbers/Constants** (`constant.numeric`, `constant.language`)
  - Research: "Should catch the eye, often orange/gold, separate from strings"
  - Current color: _________
  - Evaluation: Distinct from strings and variables? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Comments** (`comment.line`, `comment.block`)
  - Research: "Legible but de-emphasized, medium gray, 4.0:1+ contrast"
  - Current color: _________
  - Evaluation: Readable but not distracting? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Variables** (`variable.other`, default text)
  - Research: "Usually default foreground or neutral, let other tokens pop"
  - Current color: _________
  - Evaluation: Neutral, doesn't compete with keywords/classes? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Operators** (`keyword.operator`, `punctuation`)
  - Research: "Minimal coloring, default or subtle - don't distract"
  - Current color: _________
  - Evaluation: Subtle, not stealing attention? ✅ / ❌
  - Action: Keep / Change to _________

**B. Test Visual Hierarchy in Code**:

```typescript
// Look at this example with theme active
export class UserService {  // "class" keyword + "UserService" class name
  private readonly API_URL = "https://api.example.com";  // const + string
  
  public async getUser(id: number): Promise<User> {  // keywords + function + types + number
    const response = await fetch(this.API_URL);  // variable + function + property
    return response.json();  // method call
  }
}
```

Visual checks:
- [ ] Can you instantly identify **keywords** (class, public, async, const, return)?
- [ ] Do **class names** stand out from variables?
- [ ] Are **function names** clearly functions, not variables?
- [ ] Do **strings** pop out visually?
- [ ] Do **numbers** catch your eye?
- [ ] Are **variables** neutral, not competing?
- [ ] Is **comment** readable but background-like?

**C. Identify Semantic Issues**:

Common problems:

❌ **Classes same color as keywords** → Can't distinguish `class Order` from `Order` type  
❌ **Functions same color as variables** → Can't tell `fetchData()` from `data`  
❌ **Strings same hue as numbers** → Green strings + yellow-green numbers = confusion  
❌ **Keywords too muted** → Control flow (`if`, `return`) doesn't stand out  
❌ **Comments invisible** → 2.5:1 contrast, strain to read  
❌ **Variables colored like keywords** → Visual noise, everything equally important  
❌ **Operators too bright** → `=` and `+` steal attention from logic

**D. Cross-Reference with Theme Identity**:

Before changing colors, verify against theme concept:

```javascript
{
  theme_identity: "Cyberpunk Neon",  // Example
  
  // Research says: Functions should be warm and pop
  research_recommendation: "Orange/warm color for functions",
  
  // Theme identity says: Neon electric, cool colors dominate
  theme_constraint: "Functions use neon cyan to match cyber aesthetic",
  
  // Decision tree:
  decision: "Keep neon cyan for functions",
  rationale: "Theme identity (cyberpunk cool neon) overrides research (warm),
             as long as functions are DISTINCT from classes/variables",
  validation: "Functions #00ff99 (cyan) vs Classes #ff0080 (pink) = clearly distinct ✅"
}
```

**E. Document Semantic Review**:

```markdown
### Semantic Review: [Theme Name]

**Issues Found**:
1. **Functions identical to keywords** (#5E81AC blue)
   - Research violation: Functions should be distinct from keywords
   - User impact: Can't visually distinguish `async function getData()` - both same color
   - Proposed fix: Change functions to warm color (#E67E22 orange)
   - Theme identity check: Doesn't conflict (theme uses cool blues + warm accents) ✅

2. **Comments too similar to disabled text** (#7F8C8D gray)
   - Current: 4.2:1 contrast (passes) but looks disabled
   - Proposed fix: Adjust to #6C7A89 for better distinction
```

**STOP CONDITION**: Do not proceed to Phase 2 until:
- [ ] Manual semantic review completed for ALL major token types
- [ ] Visual hierarchy verified in actual code
- [ ] Semantic issues documented with rationale
- [ ] Proposed changes respect theme identity
- [ ] User confirms approach (if semantic changes are significant)

### Step 3: Cross-Reference with Research

**Open side-by-side**:
- Theme JSON: `themes/[Theme Name].json`
- Research: [Syntax_Highlighting_Best_Practices.md](../../docs/references/Syntax_Highlighting_Best_Practices.md)
- Test harness: `tests/test-contrast-analysis.js` (uses shared `tests/lib/` utilities)

**Check for contradictions**:

```javascript
// Example: Test vs Research vs Theme Philosophy
const contradiction = {
  test_requirement: "4.5:1 for all text",
  research_guidance: "Comments can be muted if legible (4.0:1+)",
  theme_philosophy: "Minimalist Nordic spec allows softer contrast",
  
  decision: "Accept 4.0:1+ for comments in minimalist themes",
  action: "Update test harness with minimalist allowlist"
};
```

**Research Alignment Checklist**:
- [ ] Comments: Research allows muted (4.0:1+), test enforces 4.5:1 → **Update test**
- [ ] Variables: Research says neutral/muted OK → **Test should NOT flag**
- [ ] Keywords: Research + WCAG require 4.5:1 (or 3.5:1 minimalist) → **Enforce**
- [ ] Operators: Research says minimal coloring OK → **Test should NOT flag**
- [ ] Strings: Research requires distinct, 4.5:1+ → **Enforce**
- [ ] Constants: Research says bright, 4.5:1+ → **Enforce**

### Step 4: Create Fix Strategy

**Template for each issue**:
```javascript
{
  issue_id: "SYNTAX-001",
  scope: "keyword.control",
  current_color: "#BF616A",
  current_contrast: "2.46:1",
  background: "#3b4252", // VERIFIED in theme JSON (not assumed!)
  
  // Decision tree
  is_established_palette: true,  // Nord theme
  palette_constraints: "Must use Nord 0-15 only",
  is_minimalist_theme: true,     // Documented in copilot-instructions.md
  minimalist_threshold: "3.5:1", // WCAG AA Large Text
  
  // Research guidance
  research_says: "Keywords need distinct, strong color",
  research_threshold: "4.5:1 standard, 3.5:1 acceptable for minimalist",
  
  // Proposed fix
  proposed_color: "#D88690",     // Lightened Nord 11 red
  proposed_contrast: "3.70:1",
  meets_minimalist: true,        // Above 3.5:1 ✅
  meets_strict: false,           // Below 4.5:1 ❌
  
  // Justification
  decision: "ACCEPT 3.70:1",
  rationale: "Arctic Nord official spec uses intentionally softer contrast. " +
             "3.70:1 exceeds minimalist threshold (3.5:1) and WCAG AA Large (3:1). " +
             "Preserves Nordic minimalist aesthetic.",
  
  // Test harness action
  test_action: "ADD to minimalist allowlist in tests/lib/theme-utils.js"
}
```

### Step 5: Decision Trees

**When to Update Test Harness vs Theme**:

```
Issue: Test flags [element] as failing

├─ Does Syntax_Highlighting_Best_Practices.md support requirement?
│  ├─ NO → Update test harness (research is authoritative)
│  └─ YES → Continue
│
├─ Is theme's approach documented as intentional design?
│  ├─ YES
│  │  └─ Does it meet WCAG AA Large Text minimum (3:1)?
│  │     ├─ YES → Update test harness (add to allowlist)
│  │     └─ NO → Fix theme (basic readability not negotiable)
│  └─ NO → ASK USER for design intent
│
└─ Would fix compromise theme's artistic identity?
   ├─ YES → Document trade-off, accept lower contrast
   └─ NO → Fix theme
```

**What Threshold to Enforce**:

```
Token: [scope name]

├─ Is theme minimalist with documented philosophy?
│  ├─ YES
│  │  └─ Is token a keyword or control structure?
│  │     ├─ YES → 3.5:1 minimum (WCAG AA Large)
│  │     └─ NO → 4.5:1 standard
│  └─ NO → 4.5:1 standard
│
└─ Does research allow muted styling?
   ├─ YES (variables, operators, punctuation)
   │  └─ Don't flag at all
   └─ NO (keywords, strings, constants, comments)
      └─ Enforce appropriate threshold
```

---

## Phase 2: Execute Fixes

**PRE-FLIGHT CHECKLIST** (complete BEFORE applying changes):

- [ ] **Layer 1 complete**: Automated contrast analysis run and parsed
- [ ] **Layer 2 complete**: Manual semantic review finished with documented findings
- [ ] **Semantic issues identified**: Token type color assignments reviewed
- [ ] **Fix strategy created**: Both accessibility AND semantic fixes planned
- [ ] **Theme identity respected**: Proposed changes align with theme concept
- [ ] **User confirmation received**: If semantic changes are significant

**STOP**: If any checklist item incomplete, return to Phase 1.

### Step 1: Update Test Harness (When Needed)

**When to update**:
- Research contradicts current test logic
- Minimalist theme pattern emerges (3+ themes with same philosophy)
- Opacity boundaries discovered (user screenshot showing code obscured)
- New edge case found (variables shouldn't require 4.5:1)

**Update location**: `tests/lib/theme-utils.js` (centralized theme classification)

```javascript
// 1. Add to minimalist themes list
const MINIMALIST_THEMES = [
  'Arctic Nord', 
  'Arctic Nord Light',
  'Enchanted Grove',
  'Enchanted Grove Dark'
  // Add new theme here if minimalist philosophy documented
];

// 2. Export for use in test-contrast-analysis.js
module.exports = { isMinimalistTheme, hasLightTradeoff, ... };
```

**Test after update**:
```bash
cd tests
.\run-tests.cmd --contrast
# Or: node test-contrast-analysis.js --verbose
# Verify: Previously flagged issues now show contextual feedback
```

**Document evolution**:
```markdown
## Test Harness v6 (Oct 22, 2025)
- Added [Theme Name] to minimalist allowlist
- Rationale: [Design philosophy explanation]
- Threshold: 3.5:1 for keywords, 4.5:1 for other tokens
- Reference: [URL or copilot-instructions.md section]
```

### Step 2: Apply Theme Color Changes

**Critical: Background Verification FIRST**
```bash
# NEVER skip this step!
grep -i "editor.background" themes/[Theme Name].json

# Use THIS color for ALL contrast calculations
```

**Strategy A: Single Token Fix** (surgical precision):

```bash
# 1. Find all occurrences
grep -n '"#BF616A"' themes/Arctic\ Nord.json

# Output:
# 245:        "foreground": "#BF616A"    // keyword.control scope
# 673:      "gitDecoration.conflictingResourceForeground": "#BF616A"

# 2. Verify contexts before replacing
# Line 245: Syntax token → REPLACE ✅
# Line 673: UI element (git conflict red) → KEEP (semantic color) ❌

# 3. Manual edit line 245 only
```

**Strategy B: Batch Replacement** (when color is palette-wide issue):

```bash
# Example: Arctic Nord Light - 29 non-Nord colors

# Step 1: Document occurrences
grep '"#FFAC8F"' themes/Arctic\ Nord\ Light.json | wc -l
# Output: 29

# Step 2: Check contexts (syntax vs UI vs both)
grep -B 2 -A 2 '"#FFAC8F"' themes/Arctic\ Nord\ Light.json

# Step 3: Calculate replacement
# Background: #ECEFF4 (VERIFIED in theme JSON)
# Target: 4.7:1 (strict, not minimalist)
# Replacement: #A04030 (darkened, stays in warm palette)

# Step 4: Batch replace with PowerShell
(Get-Content "themes/Arctic Nord Light.json" -Raw) -replace '"#FFAC8F"', '"#A04030"' | Set-Content "themes/Arctic Nord Light.json" -NoNewline

# Step 5: Test immediately
cd tests
.\run-tests.cmd --contrast
```

**Batch Replacement Checklist**:
- [ ] Background verified in theme JSON
- [ ] Target contrast calculated on ACTUAL background
- [ ] All occurrences checked (syntax vs UI contexts)
- [ ] Replacement preserves theme palette/identity
- [ ] `-NoNewline` flag used (preserves formatting)
- [ ] Test run immediately after
- [ ] Before/after issue counts documented

**Strategy C: Opacity Adjustments** (selection/diff/find):

**The 30/40/50 Rule** (prevents double-layer obscurity):

```json
// Selection: 30-40% (60% maximum)
"editor.selectionBackground": "#5E81AC59",  // 35% - readable ✅

// Diff line backgrounds: 30% (50% maximum)
"diffEditor.insertedLineBackground": "#a3be8c4D",   // 30% - visible ✅
"diffEditor.removedLineBackground": "#bf616a4D",    // 30%
"diffEditor.modifiedLineBackground": "#5e81ac4D",   // 30%

// Diff word backgrounds: 40% (emphasize changes)
"diffEditor.insertedTextBackground": "#a3be8c66",   // 40%
"diffEditor.removedTextBackground": "#bf616a66",    // 40%
"diffEditor.modifiedTextBackground": "#5e81ac66",   // 40%

// Diff gutter: 50% (clear sidebar indicators)
"diffEditorGutter.insertedLineBackground": "#a3be8c80",  // 50%
"diffEditorGutter.removedLineBackground": "#bf616a80",   // 50%
"diffEditorGutter.modifiedLineBackground": "#5e81ac80",  // 50%

// Find hierarchy: 50%/40%/30% (visual priority)
"editor.findMatchBackground": "#88c0d080",              // 50% - current
"editor.findMatchHighlightBackground": "#88c0d066",     // 40% - others
"editor.findRangeHighlightBackground": "#88c0d04D"      // 30% - range
```

**Opacity Hex Reference**:
```
10% = 19    25% = 40    40% = 66    55% = 8c    70% = b3
15% = 26    30% = 4D    45% = 73    60% = 99    75% = bf
20% = 33    35% = 59    50% = 80    65% = a6    80% = cc
```

**CRITICAL: Text-on-Highlight Validation**

**The Dual Contrast Requirement**:

Most themes only check **highlight vs background** (visibility), but MISS **text vs highlight** (readability).

```javascript
// ❌ INCOMPLETE (what most themes do):
const highlightContrast = calculateContrast(highlight, background); // >= 3:1

// ✅ COMPLETE (what you MUST do):
const highlightContrast = calculateContrast(highlight, background);  // >= 3:1
const textContrast = calculateContrast(text, highlight);            // >= 4.5:1 (or 3:1 min)
// BOTH must pass!
```

**Why This Matters**:

When you increase highlight opacity (more visible), you simultaneously DECREASE text readability.

Example from Arctic Nord:
- 60% selection: Highlight 1.76:1 (fails ❌), Text-on-highlight 4.97:1 (passes ✅)
- But compounded with diff: Text drops to 2.82:1 (FAIL - text obscured ❌)
- Solution: 40% selection + 30% diff → Text 3.94:1 (passes ✅)

**Compounding Formula** (validate layered scenarios):

```javascript
// When highlights overlap (selection + diff + find):
combinedOpacity = 1 - (1 - opacity1) * (1 - opacity2) * (1 - opacity3)

// ❌ BAD: 60% selection + 50% diff + 50% find
= 1 - (0.40 * 0.50 * 0.50) = 0.90 = 90% (text unreadable)

// ⚠️ BORDERLINE: 40% selection + 30% diff + 50% find
= 1 - (0.60 * 0.70 * 0.50) = 0.79 = 79% (text barely readable)

// ✅ SAFE: 30% selection + 30% diff + 40% find
= 1 - (0.70 * 0.70 * 0.60) = 0.706 = 71% (text remains readable)
```

**Safe Opacity Ranges** (based on Arctic Nord analysis + industry standards):

| Highlight Type | Recommended | Maximum | Industry Standard |
|----------------|-------------|---------|-------------------|
| Selection | 30-40% | 60% | 20-30% |
| Diff lines | 25-30% | 50% | 20-30% |
| Diff text | 30-40% | 60% | 30-40% |
| Find current | 40-50% | 60% | 40-50% |
| Find others | 30-40% | 50% | 30-40% |
| **Compounded** | **< 70%** | **80%** | **40-50%** |

**Manual Testing Required**:

Even with automated validation, you MUST manually test:
1. Select text → Can you still read the selected text?
2. View diff with selection → Text readable with both highlights?
3. Find in diff with selection → Text readable with triple compound?
4. Test in bright environment (light themes) and dark (dark themes)
5. Test with different token colors selected (keywords, strings, comments)

### Step 3: Icon Theme Sync (If Needed)

**When to update**:
- Theme color palette changed significantly
- New theme created (needs matching icons)
- Icon colors don't match refactored theme

**File**: `icon-themes/[Theme Name] icon-theme.json`

```json
{
  "name": "Theme Name Icons",
  "colors": {
    "folderForeground": "#569cd6",  // Match theme's primary accent
    "fileForeground": "#d4d4d4"     // Match theme's foreground
  }
}
```

### Step 4: Triple Source of Truth Sync (Only When Needed)

**Update when**:
- Adding new theme
- Renaming theme
- Changing theme pairing logic

**Files** (all three required):
- `package.json` → `contributes.themes[]` and `contributes.iconThemes[]`
- `js/main.js` → `THEME_CONFIG.themes` and `THEME_CONFIG.iconThemes`
- `js/browser.js` → duplicate of `THEME_CONFIG`

See [copilot-instructions.md](../copilot-instructions.md) for detailed sync requirements.

---

## Phase 3: Validate & Document

### Step 1: Automated Validation

```bash
cd tests

# Structure integrity (2-3s)
.\run-tests.cmd --quick

# Accessibility analysis (5-10s)
.\run-tests.cmd --contrast

# Refactor progress (1s)
.\run-tests.cmd --status
```

**Parse results**:
```
BEFORE: 24 issues (12 CRITICAL, 8 HIGH, 4 MEDIUM)
AFTER:  4 issues (0 CRITICAL, 0 HIGH, 4 MEDIUM - all acceptable)

Improvement: 83% reduction (20 issues resolved)
```

### Step 2: Manual Testing

**Reload theme**:
```
F1 → "Developer: Reload Window"
Ctrl+Shift+P → "M Tech Themes: Select Theme" → [Theme Name]
```

**Test in multiple languages**:

```typescript
// TypeScript - keywords, strings, constants, comments
export class ThemeValidator {
  private readonly MAX_CONTRAST = 7.0;  // constant
  
  public validate(color: string): boolean {  // keyword, function
    // Comment - must be readable at 4.5:1+
    const hex = "#3b4252";  // string
    return true;  // keyword
  }
}
```

```python
# Python - functions, classes, operators
class ThemeAnalyzer:
    def __init__(self, theme_name: str):
        self.name = theme_name  # property
        self.issues = []  # list
    
    def analyze(self) -> dict:
        """Docstring - may be different color than comment"""
        return {"status": "complete"}  # dict, string
```

**UI Element Checks**:
- [ ] Selection: Text readable when highlighted
- [ ] Diff view: Added/removed/modified lines all visible, text readable
- [ ] Find: Current match vs other matches distinguishable
- [ ] Scrollbars: Rest/hover/active states all visible
- [ ] Layered scenario: Selection + diff + find all active simultaneously

**Use Token Inspector**:
```
F1 → "Developer: Inspect Editor Tokens and Scopes"
Verify:
- Scope matches expected (keyword.control, string.quoted, etc.)
- Foreground color matches theme definition
- No tokens using default foreground unintentionally
```

### Step 3: Create Debugging Scripts (When Needed)

**When calculations don't match test results**:

```javascript
// calculate-contrast-[theme].js
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
};

const getLuminance = ({r, g, b}) => {
  const [rs, gs, bs] = [r/255, g/255, b/255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrast = (hex1, hex2) => {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// CRITICAL: Use ACTUAL background from theme JSON
const bg = '#3b4252';  // NOT #2E3440 from docs!

console.log('Theme Name Contrast Analysis');
console.log('Actual background:', bg);
console.log('');

const tests = [
  {name: 'Keywords (original)', color: '#BF616A'},
  {name: 'Keywords (lightened)', color: '#D88690'},
  {name: 'Comments', color: '#7fc76a'},
  {name: 'Strings', color: '#A3BE8C'}
];

tests.forEach(test => {
  const contrast = getContrast(test.color, bg);
  const status = contrast >= 4.5 ? '✅' : contrast >= 3.5 ? '⚠️ (minimalist)' : '❌';
  console.log(`${status} ${test.name}: ${contrast.toFixed(2)}:1`);
});
```

### Step 4: Document Refactor

**Update docs/ACCESSIBILITY_FRAMEWORK.md** (or create THEME_IMPROVEMENTS_ANALYSIS.md):

```markdown
## [Theme Name] Refactor (vX.X.X)
**Date**: October 22, 2025  
**Status**: ✅ COMPLETE  
**Priority**: URGENT → CLEAN  

### Theme Identity
- **Concept**: [Design philosophy]
- **Palette**: [Established spec or custom]
- **Temperature**: Warm/Cool/Neutral
- **Philosophy**: Minimalist/High-contrast/Balanced

### Issues Addressed

**Before**: 24 issues (12 CRITICAL, 8 HIGH, 4 MEDIUM)
- Syntax: Keywords 2.46:1, comments 2.8:1, strings 3.2:1
- Selection: 80% opacity (text unreadable)
- Diffs: 10% opacity (invisible)
- Find: No hierarchy (all 15%)

**Changes Applied**:

1. **Keywords**: #BF616A → #D88690 (2.46:1 → 3.70:1)
   - Rationale: Exceeds minimalist threshold (3.5:1), preserves Nord identity
   
2. **Selection**: 80% → 35% opacity
   - Rationale: Prevents double-layer obscurity with find highlights
   
3. **Diffs**: 10% → 30% line / 40% text / 50% gutter
   - Rationale: 30/40/50 rule, visible in bright environments
   
4. **Find hierarchy**: 15% → 50%/40%/30% tiers
   - Rationale: Clear visual priority for current match

**After**: 4 issues (0 CRITICAL, 0 HIGH, 4 MEDIUM)
- All syntax tokens meet thresholds (4.5:1 or 3.5:1 minimalist)
- Remaining: Intentional minimalist UI design (documented)

### Test Harness Updates
- Added [Theme Name] to minimalist allowlist in tests/lib/theme-utils.js
- Rationale: Official Nord spec documented minimalist philosophy
- Threshold: 3.5:1 for keywords, 4.5:1 for other tokens

### Design Trade-offs

**Accepted Lower Contrast**:
- Keywords at 3.70:1 (below strict 4.5:1)
- Justification: Official Nord spec uses intentionally softer contrast
- Meets WCAG AA Large Text (3:1) and minimalist threshold (3.5:1)
- Preserves theme's artistic identity

### Validation Results
```
Structure (--quick): ✅ PASS
Accessibility (--contrast): ✅ 4 issues (all acceptable)
Manual Testing: ✅ TypeScript/Python/Markdown validated
Token Inspector: ✅ All scopes correctly styled
```

### Completion Criteria Met
- [x] All syntax tokens meet appropriate thresholds
- [x] Selection/diff/find visibility verified
- [x] Scrollbars visible in all states
- [x] Theme identity preserved (83% improvement)
- [x] Design trade-offs documented

**Grade**: D- (45%) → A- (93%)  
**Improvement**: +48 percentage points | 36 properties modified
```

---

## Critical Lessons Learned

### 1. Background Color Verification is MANDATORY

**Problem**: Calculated contrast ratios didn't match test results  
**Root Cause**: Assumed background from palette docs instead of verifying in theme JSON  
**Example**: Arctic Nord uses #3b4252 (Nord 2), not #2E3440 (Nord 0) from docs  
**Impact**: Same color shows 4.60:1 vs 3.70:1 depending on background (0.90:1 difference!)  
**Solution**: Always `grep "editor.background" themes/[Theme].json` first

### 2. Opacity Double-Layer Problem

**Problem**: User screenshot showed code completely unreadable in diff view  
**Root Cause**: 80% diff + 50% find = ~90% combined opacity  
**Solution**: 30/40/50 Rule
- Diff line backgrounds: 30% (max 50%)
- Diff word backgrounds: 40%
- Gutter backgrounds: 50%
- Selection: 35-40% (max 60%)

**Test Evolution**: Added TOO OPAQUE checks for compounded scenarios

### 3. Test Harness Must Understand Design Trade-offs

**Problem**: Tests flagged Arctic Nord keywords as CRITICAL failures  
**Reality**: 3.70:1 is intentional Nord minimalist design (above 3:1 WCAG AA Large)  
**Solution**: Design intention detection
- Minimalist allowlist (Arctic Nord, Enchanted Grove)
- Relaxed 3.5:1 threshold for documented minimalist themes
- Contextual feedback: "(minimalist design - acceptable if intentional)"

**Lesson**: Research guides, but theme identity decides

### 4. Batch Replacements Require Surgical Precision

**Problem**: Replaced color everywhere, broke both syntax AND UI  
**Strategy**:
1. Document frequency: `grep "#COLOR" theme.json | wc -l`
2. Check contexts: syntax vs UI vs both
3. Calculate on ACTUAL background
4. Test after EACH replacement
5. Use `-NoNewline` to preserve formatting

### 5. Minimalist ≠ Broken

**Arctic Nord Results**:
- Keywords 3.70:1 flagged as acceptable (intentional design)
- Selection 35% opacity (prevents obscurity)
- 9 issues remaining, all documented as minimalist choices

**Decision Framework**:
- ✅ Accept if documented minimalist philosophy
- ✅ Accept if meets WCAG AA Large Text (3:1)
- ✅ Accept if user confirms artistic intent
- ❌ Reject if no artistic rationale
- ❌ Reject if critical tokens (strings, numbers)

### 6. Iterative Learning Process

**Test Harness Evolution**: 4 versions during Arctic Nord refactor
- V1: Flawed (enforced 4.5:1 on ALL tokens)
- V2: Research-aligned (separated highContrast vs allowedMuted)
- V3: Opacity boundaries (caught user screenshot issue)
- V4: Design intention (minimalist allowlist with context)

**Key Insight**: Each edge case revealed test harness gaps  
**Approach**: Improve tests WHILE refactoring themes  
**Result**: Smarter validation respecting design

### 7. Know When to Stop

**Arctic Nord Light**: 29 issues → 4 issues (86% reduction)  
**Arctic Nord Dark**: 16 issues → 9 issues (44% reduction, all acceptable)

**Stop refactoring when**:
- ✅ All syntax tokens meet thresholds (4.5:1 or 3.5:1 minimalist)
- ✅ Remaining issues are documented intentional design
- ✅ Theme personality preserved, artistic vision intact
- ✅ Test harness confirms acceptable trade-offs
- ❌ Don't chase 100% if it sacrifices identity

---

## Common Pitfalls & Solutions

### Pitfall 1: Assuming Background Color
**Solution**: Always `grep "editor.background"` first, never assume

### Pitfall 2: Batch Replacing Without Context
**Solution**: `grep -B 2 -A 2 "#COLOR"` to review all contexts before replacing

### Pitfall 3: Over-Optimizing Minimalist Themes
**Solution**: Research palette spec, check [copilot-instructions.md](../copilot-instructions.md)

### Pitfall 4: Ignoring Opacity Compounding
**Solution**: Follow 30/40/50 Rule, test selection + diff + find simultaneously

### Pitfall 5: Not Evolving Test Harness
**Solution**: Update when patterns emerge (3+ themes with same philosophy)

### Pitfall 6: Changing Colors Without Verification
**Solution**: Use debugging scripts, calculate contrast before applying

---

## Completion Checklist (Per Theme)

### Planning Phase
- [ ] Theme identity researched (concept, palette, philosophy)
- [ ] Actual background verified in theme JSON
- [ ] Official palette reviewed (if applicable)
- [ ] Automated contrast analysis run
- [ ] Manual semantic review completed
- [ ] Research cross-referenced with tests
- [ ] Fix strategy documented

### Execution Phase
- [ ] Test harness updated (if new patterns)
- [ ] Colors replaced (surgical or batch with verification)
- [ ] Opacity adjustments applied (30/40/50 rule)
- [ ] Icon theme synced (if palette changed)
- [ ] Triple Source of Truth synced (if needed)

### Validation Phase
- [ ] `.\run-tests.cmd --quick` passes
- [ ] `.\run-tests.cmd --contrast` shows improvement
- [ ] Manual testing in 3+ languages
- [ ] Selection readability verified
- [ ] Diff views tested
- [ ] Find functionality tested
- [ ] Scrollbars tested (rest/hover/active)
- [ ] Token inspector verified
- [ ] Layered scenarios tested

### Documentation Phase
- [ ] Refactor documented with full details
- [ ] Design trade-offs explained
- [ ] Test harness evolution noted
- [ ] Completion criteria met
- [ ] Next theme identified

---

## Output Format

### Summary
- 3-5 bullets: what changed, why it improves readability/correctness

### Automated Analysis
```
Before: 24 issues (12 CRITICAL, 8 HIGH, 4 MEDIUM)
After:  4 issues (0 CRITICAL, 0 HIGH, 4 MEDIUM - all acceptable)

Fixed:
✅ Keywords: 2.46:1 → 3.70:1 (minimalist threshold exceeded)
✅ Selection: 80% → 35% (prevents text obscurity)
✅ Diffs: 10% → 30%/40%/50% (visible + readable)

Remaining (by design):
⚠️ Keywords 3.70:1 - Arctic Nord official spec, minimalist aesthetic
```

### Diffs
Provide unified diffs with 3-5 lines context for each file

### Verification Checklist
- [ ] Structure tests pass
- [ ] Contrast analysis shows improvement
- [ ] Selection readable when highlighted
- [ ] Scrollbars visible (rest/hover/active)
- [ ] Theme identity preserved

### Follow-ups (Optional)
- Suggest companion variants (light/dark/high-contrast)
- Recommend next themes from priority queue

---

## Reference Documents

- [copilot-instructions.md](../copilot-instructions.md) - Architecture patterns and theme identity
- [Syntax_Highlighting_Best_Practices.md](../../docs/references/Syntax_Highlighting_Best_Practices.md) - Research guidance
- [ACCESSIBILITY_FRAMEWORK.md](../../docs/ACCESSIBILITY_FRAMEWORK.md) - WCAG requirements and case studies
- [CONTRAST_REFERENCE.md](../../docs/CONTRAST_REFERENCE.md) - Detailed contrast guidelines
- [TEST_SUITE_DOCUMENTATION.md](../../tests/TEST_SUITE_DOCUMENTATION.md) - Test modes and interpretation

---

**Remember**: Research guides, theme identity decides, and the test harness evolves. When in doubt, preserve artistic vision and document the trade-off.
