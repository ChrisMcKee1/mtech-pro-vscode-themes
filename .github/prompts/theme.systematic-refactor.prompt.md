# Systematic Theme Refactoring Workflow

You are a theme accessibility engineer working methodically through M Tech Themes' 21-theme collection, applying research-backed improvements while preserving each theme's artistic identity.

## Mission

**Systematically improve all themes** using an iterative, test-driven approach that balances WCAG accessibility with design philosophy, adapting both themes AND test harness as edge cases emerge.

## Critical Understanding: Two Validation Layers

**IMPORTANT**: Theme quality requires validating TWO separate dimensions:

### Layer 1: Accessibility (Automated)
- **What it checks**: Contrast ratios (4.5:1 / 3:1), opacity levels, UI visibility
- **Tools**: `.\run-tests.cmd --contrast` automated analysis
- **Catches**: Low-contrast text, excessive opacity, missing properties, invisible UI elements
- **Example violations**: Comments at 2.8:1 contrast, selection at 80% opacity, invisible scrollbars

### Layer 2: Semantic Correctness (Manual) **← MANDATORY, CANNOT BE AUTOMATED**
- **What it checks**: Appropriate color assignments per token type, visual hierarchy
- **Tools**: Your eyes + `Syntax coding research.md` + VS Code's "Inspect Editor Tokens"
- **Catches**: Wrong colors for token types (keywords same as variables, functions same as classes)
- **Example violations**: Blue functions (should be yellow/orange), red keywords (should be pink/purple), green numbers (should be orange)

**Why both layers matter**:
```javascript
// Example: Theme passes Layer 1 but FAILS Layer 2

// Layer 1 Automated Test Result: ✅ PASS
{
  keywords: { color: "#FF0000", contrast: 6.2 },  // 6.2:1 = passes WCAG ✅
  functions: { color: "#00FF00", contrast: 8.1 }  // 8.1:1 = passes WCAG ✅
}

// Layer 2 Manual Review: ❌ FAIL
{
  keywords: "#FF0000",    // RED keywords violate research (should be pink/purple)
  functions: "#00FF00"    // GREEN functions violate research (should be yellow/orange)
}

// Result: Technically accessible but semantically WRONG
// Users confused: why are keywords red? Why are functions green?
```

**Workflow Reality**:
- ❌ **WRONG**: Run automated tests → Fix contrast → Done
- ✅ **CORRECT**: Run automated tests → **Manual semantic review** → Fix BOTH contrast AND semantic issues → Done

**This prompt enforces BOTH layers. Do not skip semantic review.**

## Core Principles (Golden Rules)

1. **Research is guide, not law** - `Syntax coding research.md` provides best practices, but theme identity takes precedence
2. **Test harness evolves with themes** - When tests contradict artistic intent, improve the tests
3. **Background verification is mandatory** - Never assume colors from docs, always check theme JSON
4. **Opacity compounds across layers** - Selection + diff + find = must test combined visibility
5. **Minimalist ≠ Broken** - Document intentional design trade-offs vs failures
6. **Know when to stop** - 85%+ improvement with identity preserved = complete
7. **Semantic review is mandatory** - Automated tests catch accessibility, manual review catches correctness

## Pre-Work: Establish Context

### Step 1: Review Current State

```bash
cd tests
.\run-tests.cmd --status     # Check completed vs pending themes
.\run-tests.cmd --contrast   # Get priority queue (URGENT/HIGH/MEDIUM/LOW)
```

**Identify next target**:
- **URGENT priority** (critical syntax failures + high opacity issues)
- **User preference** (specific theme requested)
- **Family grouping** (complete all Filter variants together)

### Step 2: Understand Theme Identity (MANDATORY)

**Before touching any colors**, research:

**A. Check Theme Type**:
```bash
# Look for clues in theme name
Theme: Arctic Nord → Nordic winter minimalism (cool blues)
Theme: Enchanted Grove → Mystical forest (earthy greens, purples)
Theme: Cyberpunk Neon → Electric future (neon cyan, hot pink)
Theme: Filter Machine → Industrial precision (neutral grays)
```

**B. Identify Palette System**:

**Established Palette Themes** (strict compliance required):
- **Nord-based** (Arctic Nord, Tokyo Night if using Nord)
  - Research: Official Nord 0-15 specification
  - Rule: ONLY use palette colors, document any deviations
  
- **Dracula-based** themes
  - Research: Official Dracula color palette
  - Rule: Preserve signature colors (pink, cyan, purple)

- **Gruvbox-inspired** themes
  - Research: Gruvbox color system
  - Rule: Maintain warm retro aesthetic

**Thematic Palette Themes** (color serves concept):
- **Enchanted Grove**: Magical forest
  - Identity: Light Elves (light) vs Dark Elves (dark)
  - Colors: Forest greens (#228B22), mystical purples (#B48EAD), wood browns (#CD5C5C)
  - Rule: NO generic reds/corals - must feel "enchanted forest"

- **Cyberpunk Neon**: High-voltage cyber
  - Identity: Electric, futuristic, neon-soaked
  - Colors: Neon cyan (#00ff99), hot pink (#ff3366), deep purple (#4d1a4d)
  - Rule: Never mute the neon - opacity adjustments only

- **Cosmic Void**: Deep space exploration
  - Identity: Multi-color cosmic spectrum
  - Colors: Vibrant rainbow (red/orange/green/cyan/blue/purple)
  - Rule: Preserve spectrum diversity, don't force single-accent

**Custom Palette Themes** (consistent internal logic):
- **Filter Series**: Industrial precision
  - Each variant has distinct personality (Octagon, Ristretto, Spectrum, Machine, Moon, Sun)
  - Rule: Professional, balanced saturation

**C. Verify Actual Colors**:
```bash
# CRITICAL: Check actual background, don't assume from docs
grep -i "editor.background" themes/[Theme Name].json

# Example trap from Arctic Nord:
# Docs said: #2E3440 (Nord 0)
# Theme uses: #3b4252 (Nord 2)
# Impact: 0.90:1 contrast difference!
```

**D. Research Official Palette (if applicable)**:
- Nord themes: https://www.nordtheme.com/docs/colors-and-palettes
- Dracula: https://draculatheme.com/contribute
- Gruvbox: https://github.com/morhetz/gruvbox (color table)
- Tokyo Night: Check if using official Tokyo Night palette vs custom

**Research Checklist**:
- [ ] Theme name suggests concept? (Nature, Tech, Retro, Minimal, etc.)
- [ ] Official palette exists? (Document specification URL)
- [ ] Design philosophy documented? (Check copilot-instructions.md)
- [ ] Actual background verified in theme JSON?
- [ ] Dominant color temperature identified? (Warm/Cool/Neutral)
- [ ] Minimalist aesthetic? (Softer contrast intentional?)

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

## Workflow: Systematic Theme Improvement

### Phase 1: Analyze & Plan

**IMPORTANT**: Phase 1 requires **TWO validation layers**:

1. **Layer 1: Automated Testing** (Accessibility)
   - Validates contrast ratios (WCAG 4.5:1 / 3:1)
   - Checks opacity levels (selection, diffs)
   - Detects invisible UI elements
   - **What it catches**: Low-contrast text, excessive opacity, missing properties
   - **What it misses**: Wrong colors for token types (semantic violations)

2. **Layer 2: Manual Semantic Review** (Correctness) **← MANDATORY**
   - Validates appropriate color assignments per token type
   - Checks visual hierarchy matches research best practices
   - Verifies theme identity alignment
   - **What it catches**: Keywords using wrong hue, functions same as variables, strings indistinct
   - **What automated tests miss**: Semantic appropriateness (blue functions vs orange functions)

**Both layers are REQUIRED. Do not skip semantic review.**

#### 1.1 Run Automated Analysis (Layer 1: Accessibility)

```bash
cd tests
.\run-tests.cmd --contrast > contrast-results.txt
```

**Parse output for target theme**:
```
🌙 Theme Name (dark/light) - X issues
  
  CRITICAL (fails 4.5:1):
    ❌ Syntax token fails readability: [scope]
       Color: #XXXXXX | Contrast: N.N:1
       Required: 4.5:1
  
  HIGH (fails 3:1):
    ❌ Selection invisible (too low opacity)
       Color: #XXXXXX26 | Contrast: N.N:1
       Opacity: 15%
       Required: 3:1
  
  MEDIUM:
    ⚠️ Missing find hierarchy
    ⚠️ Scrollbar hover feedback unclear
```

**Categorize issues**:
```javascript
// Create tracking structure
{
  critical_syntax: [],      // Syntax tokens < 4.5:1 (or < 3.5:1 for minimalist)
  critical_ui: [],          // UI elements < 3:1
  high_opacity: [],         // Selection > 60%, diff > 50%
  medium_hierarchy: [],     // Find system lacks visual tiers
  low_polish: []           // Scrollbars, minor contrast improvements
}
```

#### 1.2 Manual Semantic Review (MANDATORY - DO NOT SKIP)

**CRITICAL**: Automated tests only check **contrast ratios and opacity**. They do NOT validate whether colors are **semantically correct** according to research best practices. This manual review is **REQUIRED** for every theme.

**Open side-by-side for manual inspection**:
1. `Syntax coding research.md` (research best practices)
2. `themes/[Theme Name].json` (current theme implementation)

**Manual Review Checklist** (Complete ALL items):

**Step 1: Verify Token Category Assignments** (Use Scope Inspector)

Open a code file in the theme, use `F1 → Developer: Inspect Editor Tokens and Scopes` and check:

- [ ] **Keywords** (`keyword.control`, `storage.type`, `storage.modifier`):
  - Research says: "Strong, distinct color to set them off from identifiers"
  - Current color: _________
  - Evaluation: Is it distinct from variables/functions? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Classes/Types** (`entity.name.class`, `entity.name.type`, `support.class`):
  - Research says: "Own color to distinguish from variables and functions"
  - Current color: _________
  - Evaluation: Different from functions and variables? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Functions** (`entity.name.function`, `support.function`):
  - Research says: "Warm color that pops, distinct from classes"
  - Current color: _________
  - Evaluation: Stands out, different from classes? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Strings** (`string.quoted`, `string.template`):
  - Research says: "Distinct color, easy to spot, helps catch unterminated strings"
  - Current color: _________
  - Evaluation: Clearly different from all other tokens? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Numbers/Constants** (`constant.numeric`, `constant.language`):
  - Research says: "Should catch the eye, often orange/gold, separate from strings"
  - Current color: _________
  - Evaluation: Distinct from strings and variables? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Comments** (`comment.line`, `comment.block`):
  - Research says: "Legible but de-emphasized, medium gray with good contrast (4.0:1+)"
  - Current color: _________
  - Evaluation: Readable but not distracting? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Variables** (`variable.other`, default text):
  - Research says: "Usually default foreground or neutral, let other tokens pop"
  - Current color: _________
  - Evaluation: Neutral, doesn't compete with keywords/classes? ✅ / ❌
  - Action: Keep / Change to _________

- [ ] **Operators** (`keyword.operator`, `punctuation`):
  - Research says: "Minimal coloring, default or subtle - don't distract"
  - Current color: _________
  - Evaluation: Subtle, not stealing attention? ✅ / ❌
  - Action: Keep / Change to _________

**Step 2: Check Semantic Consistency**

Test in actual code by looking at this TypeScript example:

```typescript
// Check if each token has appropriate visual hierarchy
export class UserService {  // "class" keyword + "UserService" class name
  private readonly API_URL = "https://api.example.com";  // const + string
  
  public async getUser(id: number): Promise<User> {  // keywords + function + types + number
    const response = await fetch(this.API_URL);  // variable + function + property
    return response.json();  // method call
  }
}
```

**Visual Hierarchy Verification** (look at the code with theme active):

- [ ] Can you instantly identify **keywords** (class, public, async, const, await, return)?
- [ ] Do **class names** (`UserService`, `User`, `Promise`) stand out from variables?
- [ ] Are **function names** (`getUser`, `fetch`, `json`) clearly functions, not variables?
- [ ] Do **strings** (`"https://..."`) pop out visually?
- [ ] Do **numbers** catch your eye immediately?
- [ ] Are **variables** (`response`, `id`) neutral, not competing with keywords?
- [ ] Is the **comment** readable but background-like?

**Step 3: Identify Semantic Issues**

Common problems found in manual review:

❌ **Classes same color as keywords** → User can't distinguish `class Order` (keyword) from `Order` (type)
❌ **Functions same color as variables** → Can't tell `fetchData` (function) from `data` (variable)
❌ **Strings same hue as numbers** → Green strings + yellow-green numbers = confusion
❌ **Keywords too muted** → Control flow (`if`, `return`) doesn't stand out
❌ **Comments invisible** → 2.5:1 contrast, strain to read
❌ **Variables colored like keywords** → Everything looks equally important (visual noise)
❌ **Operators too bright** → `=` and `+` stealing attention from actual code logic

**Step 4: Cross-Reference with Theme Identity**

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

**Step 5: Document Semantic Review Results**

Create a summary:

```markdown
### Semantic Review: [Theme Name]

**Scope Coverage** (are all major token types styled?):
- Keywords: ✅ Distinct blue
- Classes: ✅ Separate gold color
- Functions: ❌ Same color as keywords (ISSUE)
- Strings: ✅ Green, clearly distinct
- Numbers: ✅ Orange, pops out
- Comments: ⚠️ Contrast OK (4.2:1) but could be more distinct
- Variables: ✅ Default foreground, neutral

**Issues Found**:
1. **Functions identical to keywords** (#5E81AC blue)
   - Research violation: Functions should be distinct from keywords
   - User impact: Can't visually distinguish `async function getData()` - both words same color
   - Proposed fix: Change functions to warm color (#E67E22 orange) to match research
   - Theme identity check: Doesn't conflict (theme uses cool blues + warm accents)

2. **Comments too similar to disabled text** (#7F8C8D gray)
   - Research guidance: Comments should be legible, not invisible
   - Current: 4.2:1 contrast (passes) but looks disabled
   - Proposed fix: Slightly adjust to #6C7A89 for better distinction

**Semantic Improvements**:
- Change functions: #5E81AC → #E67E22 (keywords→warm)
- Adjust comments: #7F8C8D → #6C7A89 (more distinct from UI gray)
```

**Step 6: Compare with Reference Themes**

Look at how successful themes handle the same scope:

```bash
# Example: Check how Dracula handles functions vs keywords
grep -A 2 '"entity.name.function"' themes/reference-themes/dracula.json
# Result: Dracula uses green for functions, pink for keywords (distinct ✅)

# Check One Dark Pro
grep -A 2 '"entity.name.function"' themes/reference-themes/one-dark-pro.json
# Result: One Dark uses blue for functions, purple for keywords (distinct ✅)

# Current theme uses same blue for both (problem ❌)
```

**STOP CONDITION**: Do not proceed to Phase 2 (Execute Fixes) until:
- [ ] Manual semantic review completed for ALL major token types
- [ ] Visual hierarchy verified in actual code
- [ ] Semantic issues documented with rationale
- [ ] Proposed changes respect theme identity
- [ ] User confirms approach (if semantic changes are significant)

#### 1.3 Cross-Reference with Research (After Semantic Review)

**Open side-by-side**:
- Theme JSON: `themes/[Theme Name].json`
- Research: `Syntax coding research.md`
- Test harness: `tests/test-contrast-analysis.js` (uses shared utilities in `tests/lib/`)

**Check for contradictions**:

```javascript
// Example: Test says comments must be 4.5:1
// Research says: "Comments can be muted for de-emphasis"
// Theme philosophy: Minimalist aesthetic (Arctic Nord)
// Decision: Research + theme identity override test → accept 4.0:1 if intentional

// Document contradiction
const contradiction = {
  test_requirement: "4.5:1 for all text",
  research_guidance: "Comments can be muted if legible",
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
- [ ] Strings: Research requires distinct color, 4.5:1+ → **Enforce**
- [ ] Constants: Research says bright for visibility, 4.5:1+ → **Enforce**

#### 1.3 Create Fix Strategy

**Template for each issue**:
```javascript
{
  issue_id: "SYNTAX-001",
  scope: "keyword.control",
  current_color: "#BF616A",
  current_contrast: "2.46:1",
  background: "#3b4252", // VERIFIED in theme JSON
  
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
  meets_minimalist: true,        // Above 3.5:1
  meets_strict: false,           // Below 4.5:1
  
  // Justification
  decision: "ACCEPT 3.70:1",
  rationale: "Arctic Nord official spec uses intentionally softer contrast. " +
             "3.70:1 exceeds minimalist threshold (3.5:1) and WCAG AA Large (3:1). " +
             "Preserves Nordic minimalist aesthetic.",
  
  // Test harness action
  test_action: "ADD to minimalist allowlist, flag as '(minimalist design - acceptable)'"
}
```

#### 1.4 Decision Tree: When to Change Test vs Theme

```
┌─ Issue detected by test harness
│
├─ Does it contradict Syntax coding research.md?
│  ├─ YES
│  │  └─ Research is NEWER (2025) → Update test harness
│  │     Example: Test enforces 4.5:1 on variables, research says muted OK
│  │
│  └─ NO
│     └─ Continue to next check
│
├─ Is theme's approach documented as intentional design?
│  ├─ YES (copilot-instructions.md or palette spec)
│  │  └─ Does it meet WCAG AA Large Text (3:1)?
│  │     ├─ YES → Update test to accept (add to minimalist allowlist)
│  │     └─ NO → Fix theme (design intent doesn't override basic readability)
│  │
│  └─ NO (no documentation found)
│     └─ ASK USER: "Is [Theme]'s softer contrast intentional minimalism?"
│
├─ Does fix preserve theme's artistic identity?
│  ├─ YES → Fix theme
│  │  Example: Lighten Nord red from 2.46:1 → 3.70:1 stays Nordic
│  │
│  └─ NO → Document trade-off or find alternative
│     Example: Can't use Nord red at 4.5:1 without breaking palette
│     Solution: Accept 3.70:1 with documented rationale
│
└─ Is issue truly critical for readability?
   ├─ YES (syntax tokens, selection visibility)
   │  └─ Fix theme, preserve identity as much as possible
   │
   └─ NO (polish items like scrollbar shades)
      └─ Only fix if doesn't compromise aesthetic
```

### Phase 2: Execute Fixes

**PRE-FLIGHT CHECKLIST** (Complete BEFORE applying any changes):

- [ ] **Layer 1 Complete**: Automated contrast analysis run and parsed
- [ ] **Layer 2 Complete**: Manual semantic review finished with documented findings
- [ ] **Semantic issues identified**: Token type color assignments reviewed
- [ ] **Fix strategy created**: Both accessibility AND semantic fixes planned
- [ ] **Theme identity respected**: Proposed changes align with theme concept
- [ ] **User confirmation received**: If semantic changes are significant (changing token color families)

**STOP**: If any checklist item is incomplete, return to Phase 1. Do not proceed with fixes.

#### 2.1 Test Harness Updates (When Needed)

**When to update test harness**:
- Research contradicts current test logic
- Minimalist theme pattern emerges (Arctic Nord, Enchanted Grove)
- Opacity boundaries discovered (user screenshot issue)
- New edge case found (variables shouldn't require 4.5:1)

**Update pattern**:
```javascript
// tests/lib/theme-utils.js - Centralized theme classification

// 1. Add to minimalist themes list
const MINIMALIST_THEMES = [
  'Arctic Nord', 
  'Arctic Nord Light',
  'Enchanted Grove',
  'Enchanted Grove Dark'
  // Add new theme here if minimalist philosophy documented
];

// 2. Export from module for use in test-contrast-analysis.js
module.exports = { isMinimalistTheme, hasLightTradeoff, ... };
```
const isMinimalistTheme = minimalistThemes.some(name => results.name.includes(name));
const minimalistKeywordThreshold = 3.5; // WCAG AA Large Text
const threshold = (isMinimalistTheme && isKeywordScope) 
  ? minimalistKeywordThreshold 
  : 4.5;

// 3. Update contextual feedback
const designNote = (isMinimalistTheme && analysis.contrast >= 3.0)
  ? ' (minimalist design - acceptable if intentional)'
  : '';
```

**Test after harness update**:
```bash
cd tests
.\run-tests.cmd --contrast  # Uses optimized test with shared utilities
# Or direct: node test-contrast-analysis.js [--verbose]
# Verify: Previously flagged issues now show contextual feedback
```

**Document harness evolution**:
```markdown
## Test Harness v5 (Date)
- Added [Theme Name] to minimalist allowlist
- Rationale: [Design philosophy explanation]
- Threshold: 3.5:1 for keywords, 4.5:1 for other tokens
- Reference: [URL to palette spec or copilot-instructions.md]
```

#### 2.2 Theme Color Replacements

**Critical: Background Verification FIRST**
```bash
# Never skip this step!
grep -i "editor.background" themes/[Theme Name].json

# Example output:
"editor.background": "#3b4252"

# Use THIS color for contrast calculations, not docs/assumptions
```

**Strategy 1: Single Token Fix** (surgical precision)

```bash
# 1. Find all occurrences of target color
grep -n '"#BF616A"' themes/Arctic\ Nord.json

# Output shows line numbers and contexts:
# 245:        "foreground": "#BF616A"    // keyword.control scope
# 673:      "gitDecoration.conflictingResourceForeground": "#BF616A"

# 2. Verify contexts before replacing
# - Line 245: Syntax token (REPLACE)
# - Line 673: UI element for git conflicts (KEEP - semantic red)

# 3. Manual replacement for syntax token only
# Open theme JSON, edit line 245 specifically
```

**Strategy 2: Batch Replacement** (when color is palette-wide issue)

```bash
# Example: Arctic Nord Light had non-Nord colors across 29 instances

# Step 1: Document all occurrences
grep '"#FFAC8F"' themes/Arctic\ Nord\ Light.json | wc -l
# Output: 29

# Step 2: Check if color used in BOTH syntax and UI
grep -B 2 -A 2 '"#FFAC8F"' themes/Arctic\ Nord\ Light.json
# Review each context - are they all syntax tokens? Or mixed?

# Step 3: Calculate replacement
# Background: #ECEFF4 (verified in theme JSON)
# Target contrast: 4.7:1 (strict, not minimalist)
# Replacement: #A04030 (darkened orange staying in warm palette)

# Step 4: Batch replace with PowerShell
(Get-Content "themes/Arctic Nord Light.json" -Raw) -replace '"#FFAC8F"', '"#A04030"' | Set-Content "themes/Arctic Nord Light.json" -NoNewline

# Step 5: Test immediately
cd tests
.\run-tests.cmd --contrast
# Check: Did issues decrease? Any new issues introduced?
```

**Batch Replacement Checklist**:
- [ ] Background color verified in theme JSON
- [ ] Target contrast calculated on ACTUAL background
- [ ] All occurrences checked (syntax vs UI contexts)
- [ ] Replacement preserves theme palette/identity
- [ ] `-NoNewline` flag used (preserves file formatting)
- [ ] Test run immediately after replacement
- [ ] Before/after issue counts documented

**Strategy 3: Opacity Adjustments** (selection/diff/find)

```bash
# The 30/40/50 Rule (prevents double-layer obscurity)

# Selection: 35-40% (60% maximum)
# Find BEFORE:
"editor.selectionBackground": "#5E81ACcc"  # 80% - TOO OPAQUE

# Calculate effective color (for contrast verification):
# node debug script:
const bg = '#3b4252';
const selection = '#5E81AC';
const opacity = 0.35;
const effective = blendColors(selection, bg, opacity);
const contrast = calculateContrast(effective, bg);
// Must be >= 3:1 AND text must remain readable

# Find AFTER:
"editor.selectionBackground": "#5E81AC59"  # 35% - readable

# Diff backgrounds: 30% (50% maximum)
"diffEditor.insertedLineBackground": "#a3be8c19"   # 10% - invisible
"diffEditor.insertedLineBackground": "#a3be8c4D"   # 30% - visible ✅

"diffEditor.insertedTextBackground": "#a3be8c4D"   # 30%
"diffEditorGutter.insertedLineBackground": "#a3be8c4D"  # 30%

# Diff text: 40% (emphasize changed words)
"diffEditor.insertedTextBackground": "#a3be8c66"   # 40%

# Diff gutter: 50% (clear sidebar indicators)
"diffEditorGutter.insertedLineBackground": "#a3be8c80"  # 50%

# Find hierarchy: 50%/40%/30% (clear visual priority)
"editor.findMatchBackground": "#88c0d080"              # 50% - current match
"editor.findMatchHighlightBackground": "#88c0d066"     # 40% - other matches
"editor.findRangeHighlightBackground": "#88c0d04D"     # 30% - search range
```

**Opacity Hex Reference**:
```
5% = 0c     20% = 33    35% = 59    50% = 80    65% = a6    80% = cc
10% = 19    25% = 40    40% = 66    55% = 8c    70% = b3    85% = d9
15% = 26    30% = 4D    45% = 73    60% = 99    75% = bf    90% = e6
```

**CRITICAL: Highlighting Best Practices (Text-on-Highlight Validation)**

**The Dual Contrast Requirement**:

Most themes only check **highlight vs background** contrast (making the highlight visible), but MISS the critical check: **text vs highlight** contrast (keeping text readable when highlighted).

```javascript
// INCOMPLETE (what most themes do):
const highlightContrast = calculateContrast(highlight, background);
// Target: >= 3:1 (highlight visible)

// COMPLETE (what you MUST do):
const highlightContrast = calculateContrast(highlight, background);  // >= 3:1
const textContrast = calculateContrast(text, highlight);            // >= 4.5:1 (or 3:1 minimum)
// BOTH must pass!
```

**Why This Matters**:

When you increase highlight opacity to make it more visible (highlight vs background), you simultaneously DECREASE text readability (text vs highlight). Example from Arctic Nord:

- 60% selection opacity: Highlight 1.76:1 (fails), Text-on-highlight 4.97:1 (passes)
- But when compounded with diff: Text drops to 2.82:1 ❌ (FAIL - text obscured)
- Solution: Reduce to 40% selection, 30% diff → Text 3.94:1 ✅ (passes compounded)

**Compounding Formula** (MUST validate layered scenarios):

```javascript
// When highlights overlap (selection + diff + find):
combinedOpacity = 1 - (1 - opacity1) * (1 - opacity2) * (1 - opacity3)

// Example: 60% selection + 50% diff + 50% find
= 1 - (1 - 0.60) * (1 - 0.50) * (1 - 0.50)
= 1 - (0.40 * 0.50 * 0.50)
= 1 - 0.10
= 0.90 = 90% ❌ Text unreadable!

// Better: 40% selection + 30% diff + 50% find
= 1 - (0.60 * 0.70 * 0.50)
= 1 - 0.21
= 0.79 = 79% ⚠️ Borderline (but text remains >= 3:1 if validated)

// Best: 30% selection + 30% diff + 40% find
= 1 - (0.70 * 0.70 * 0.60)
= 1 - 0.294
= 0.706 = 71% ✅ Safe
```

**Safe Opacity Ranges** (based on Arctic Nord analysis + industry standards):

| Highlight Type | Recommended | Maximum | Industry Standard |
|----------------|-------------|---------|-------------------|
| Selection | 30-40% | 60% | 20-30% (One Dark Pro, Dracula, GitHub) |
| Diff lines | 25-30% | 50% | 20-30% |
| Diff text | 30-40% | 60% | 30-40% (emphasize changed words) |
| Find current | 40-50% | 60% | 40-50% |
| Find others | 30-40% | 50% | 30-40% |
| **Compounded total** | **< 70%** | **80%** | **40-50%** |

**Validation Checklist** (add to debugging scripts):

```javascript
// Example: calculate-[theme]-highlights.js
const bg = hexToRgb('#3b4252');  // ACTUAL theme background
const text = hexToRgb('#ECEFF4'); // ACTUAL theme text color
const selectionBase = hexToRgb('#5E81AC');

// Test proposed opacity
const selOpacity = 0.40;
const selectionBlended = blendColors(selectionBase, bg, selOpacity);

console.log('=== DUAL CONTRAST VALIDATION ===');
console.log('1. Highlight vs background:', getContrast(selectionBlended, bg).toFixed(2) + ':1');
console.log('   Target: >= 3:1 (UI visibility)');
console.log('2. Text vs highlight:', getContrast(text, selectionBlended).toFixed(2) + ':1');
console.log('   Target: >= 4.5:1 (ideal) or >= 3:1 (minimum)');
console.log('');

// Test compounding
const diffOpacity = 0.30;
const diffBlended = blendColors(insertedBase, selectionBlended, diffOpacity);
const compoundedOpacity = 1 - (1 - selOpacity) * (1 - diffOpacity);

console.log('=== COMPOUNDING ANALYSIS ===');
console.log('Selection (' + (selOpacity*100) + '%) + Diff (' + (diffOpacity*100) + '%):');
console.log('  Combined opacity:', (compoundedOpacity * 100).toFixed(0) + '%',
            compoundedOpacity <= 0.70 ? '✅ Safe' : compoundedOpacity <= 0.80 ? '⚠️ Borderline' : '❌ Too opaque');
console.log('  Text readability:', getContrast(text, diffBlended).toFixed(2) + ':1',
            getContrast(text, diffBlended) >= 3.0 ? '✅' : '❌ Text obscured!');
```

**When to Reduce Opacity** (decision tree):

```
Issue: Text becomes hard to read when highlighted

├─ Is individual highlight opacity > 50%?
│  ├─ YES → Reduce to 40% maximum (industry standard)
│  └─ NO → Continue
│
├─ Does compounded opacity exceed 70%?
│  ├─ YES → Reduce all highlights by 10-15 percentage points
│  └─ NO → Continue
│
├─ Does text-on-highlight contrast fail 3:1?
│  ├─ YES → Reduce opacity OR choose different highlight color
│  └─ NO → Current settings acceptable
│
└─ Compare to industry standards (20-30% typical)
   └─ If significantly higher, consider reduction for consistency
```

**Common Mistakes**:

1. ❌ Only checking highlight visibility, not text readability
2. ❌ Not testing compounded scenarios (selection + diff + find together)
3. ❌ Using 60%+ opacity without validation (makes highlights pop but obscures text)
4. ❌ Assuming "if it looks OK, it's OK" (need actual contrast calculations)
5. ❌ Copying opacity from dark theme to light theme (light needs different strategy)

**Manual Testing Required**:

Even with automated validation, you MUST manually test:
1. Select text in a file → Can you still read the selected text?
2. View diff with selection → Text readable with both highlights?
3. Find in diff view with selection → Text readable with triple compound?
4. Test in bright environment (light themes) and dark environment (dark themes)
5. Test with different syntax token colors (keywords, strings, comments all selected)

#### 2.3 Icon Theme Sync (If Needed)

**When to update icon theme**:
- Theme color palette changed significantly
- New theme created (needs matching icons)
- Icon colors don't match refactored theme

**File**: `icon-themes/[Theme Name] icon-theme.json`

```json
{
  "name": "Theme Name Icons",
  "colors": {
    "folderForeground": "#569cd6",  // Match theme's primary accent
    "fileForeground": "#d4d4d4",    // Match theme's foreground
    // Update if theme palette changed
  }
}
```

**Validation**:
- Icons should use theme's accent colors
- Folder/file colors should be distinguishable
- Test by viewing file explorer with theme active

#### 2.4 Triple Source of Truth Sync

**Only needed when**:
- Adding new theme
- Renaming theme
- Changing theme pairing logic

**Files to update** (all three required):

**A. package.json**:
```json
{
  "contributes": {
    "themes": [
      {
        "label": "Theme Name",
        "uiTheme": "vs-dark",
        "path": "./themes/Theme Name.json"
      }
    ],
    "iconThemes": [
      {
        "id": "Theme Name Icons",
        "label": "Theme Name Icons",
        "path": "./icon-themes/Theme Name icon-theme.json"
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
    "Theme Name"
  ],
  iconThemes: [
    // ... existing icon themes ...
    "Theme Name Icons"
  ]
};
```

**C. js/browser.js** (duplicate of main.js):
```javascript
// Exact same THEME_CONFIG as main.js
```

### Phase 3: Validate & Document

#### 3.1 Automated Validation

**Full test suite**:
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
BEFORE:
  🌙 Theme Name - 24 issues
  CRITICAL: 12 (syntax < 4.5:1)
  HIGH: 8 (UI < 3:1, opacity > 60%)
  MEDIUM: 4 (hierarchy, polish)

AFTER:
  🌙 Theme Name - 4 issues
  CRITICAL: 0
  HIGH: 0
  MEDIUM: 4 (all marked "minimalist design - acceptable")

Improvement: 83% reduction (24 → 4 issues)
```

#### 3.2 Manual Testing

**Reload theme**:
```
F1 → "Developer: Reload Window"
Ctrl+Shift+P → "M Tech Themes: Select Theme" → [Theme Name]
```

**Test scenarios**:

**A. Syntax Highlighting** (test in multiple languages):
```typescript
// TypeScript - test keywords, strings, constants, comments
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
# Python - test functions, classes, operators
class ThemeAnalyzer:
    def __init__(self, theme_name: str):
        self.name = theme_name  # property
        self.issues = []  # list
    
    def analyze(self) -> dict:
        """Docstring - may be different color than comment"""
        return {"status": "complete"}  # dict, string
```

**B. UI Element Visibility**:

```bash
# Selection readability
# 1. Select text (highlight should be visible)
# 2. Selected text must remain readable (not obscured)
# 3. Try selecting in different token types (keyword, string, comment)

# Diff view
# 1. Make a change to a file
# 2. View git diff (Source Control → file → inline diff)
# 3. Added lines: green background, text readable
# 4. Removed lines: red background, text readable
# 5. Modified lines: blue background, changed words emphasized

# Find functionality
# 1. Ctrl+F → search for word
# 2. Current match: brightest highlight (50%)
# 3. Other matches: secondary highlight (40%)
# 4. Can clearly distinguish current vs other
# 5. Search in diff view - both highlights visible without obscuring

# Scrollbars
# 1. Rest state: visible but subtle
# 2. Hover: clearly brightens/changes
# 3. Active (dragging): most prominent
# 4. Test in different panel sizes
```

**C. Use Token Inspector**:
```
F1 → "Developer: Inspect Editor Tokens and Scopes"
Click on various tokens to verify:
- Scope matches expected (keyword.control, string.quoted, etc.)
- Foreground color matches theme definition
- No tokens using default foreground unintentionally
```

#### 3.3 Create Debugging Scripts (When Needed)

**When contrast calculations don't match test results**:

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

// Test each problematic color
const tests = [
  {name: 'Keywords (original)', color: '#BF616A'},
  {name: 'Keywords (attempt 1)', color: '#D88690'},
  {name: 'Keywords (attempt 2)', color: '#E09AA5'},
  {name: 'Comments', color: '#7fc76a'},
  {name: 'Strings', color: '#A3BE8C'}
];

tests.forEach(test => {
  const contrast = getContrast(test.color, bg);
  const status = contrast >= 4.5 ? '✅' : contrast >= 3.5 ? '⚠️ (minimalist)' : '❌';
  console.log(`${status} ${test.name}: ${contrast.toFixed(2)}:1`);
});
```

**Run**:
```bash
node calculate-contrast-[theme].js
```

#### 3.4 Document Refactor

**Update THEME_IMPROVEMENTS_ANALYSIS.md**:

```markdown
## Theme Name Refactor (vX.X.X)
**Date**: October XX, 2025  
**Status**: ✅ COMPLETE  
**Priority**: URGENT → CLEAN  

### Theme Identity
- **Concept**: [Design philosophy]
- **Palette**: [Established spec or custom]
- **Temperature**: Warm/Cool/Neutral
- **Philosophy**: Minimalist/High-contrast/Balanced

### Issues Addressed
**Before**: 24 issues (12 CRITICAL, 8 HIGH, 4 MEDIUM)
- Syntax tokens: Keywords 2.46:1, comments 2.8:1, strings 3.2:1
- Selection: 80% opacity (text unreadable)
- Diffs: 10% opacity (invisible in bright environments)
- Find system: No hierarchy (all 15%)

**Changes Applied**:
1. **Keywords**: #BF616A → #D88690 (2.46:1 → 3.70:1)
   - Rationale: Minimalist threshold (3.5:1) exceeded, preserves [Palette] identity
   
2. **Selection**: 80% → 35% opacity
   - Rationale: Prevents double-layer obscurity with find highlights
   
3. **Diffs**: 10% → 30% opacity
   - Rationale: Visible in bright environments, text remains readable
   
4. **Find hierarchy**: 15% → 50%/40%/30% tiers
   - Rationale: Clear visual priority for current match

**After**: 4 issues (0 CRITICAL, 0 HIGH, 4 MEDIUM)
- All syntax tokens meet appropriate thresholds (4.5:1 or 3.5:1 minimalist)
- Remaining issues: Intentional minimalist UI design (documented)

### Test Harness Updates
- Added [Theme Name] to minimalist allowlist (v5)
- Rationale: [Official palette spec / documented design philosophy]
- Threshold: 3.5:1 for keywords, 4.5:1 for other tokens

### Design Trade-offs
**Accepted Lower Contrast**:
- Keywords at 3.70:1 (below strict 4.5:1)
- Justification: Official [Palette] specification uses intentionally softer contrast
- Meets WCAG AA Large Text (3:1) and minimalist threshold (3.5:1)
- Preserves theme's artistic identity

### Validation Results
```
Structure Tests (--quick): ✅ PASS
Accessibility Tests (--contrast): ✅ 4 issues (all acceptable)
Manual Testing: ✅ TypeScript/Python/Markdown validated
Token Inspector: ✅ All scopes correctly styled
```

### Completion Criteria Met
- [x] All syntax tokens meet appropriate thresholds
- [x] Selection/diff/find visibility verified
- [x] Scrollbars visible in all states
- [x] Theme identity preserved (83% improvement without compromising aesthetic)
- [x] Design trade-offs documented

**Grade**: B (82%) → A- (92%)  
**Next Theme**: [Name from priority queue]
```

## Decision Trees: Quick Reference

### Should I Update Test Harness or Theme?

```
Issue: Test flags [element] as failing

├─ Does Syntax coding research.md support this requirement?
│  ├─ NO → Update test harness (research is golden record)
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

### What Threshold Should I Enforce?

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

### When Is Theme Refactor Complete?

```
Current State: [X issues remaining]

├─ Are all CRITICAL issues resolved?
│  ├─ NO → Continue refactoring
│  └─ YES → Continue
│
├─ Are all HIGH issues resolved?
│  ├─ NO → Evaluate if acceptable trade-offs
│  └─ YES → Continue
│
├─ Are remaining issues documented as intentional design?
│  ├─ NO → Continue refactoring
│  └─ YES → Continue
│
├─ Has theme identity been preserved?
│  ├─ NO → Rollback last changes, find alternative
│  └─ YES → Continue
│
└─ Is improvement significant (>80% issue reduction)?
   ├─ YES → COMPLETE
   └─ NO → Continue if theme identity not at risk
```

## File Reference: When to Update

### Always Review
- `themes/[Theme Name].json` - Color definitions and token scopes
- `Syntax coding research.md` - Golden record for best practices
- `tests/test-contrast-analysis.js` - Test harness logic (uses shared `tests/lib/` utilities)

### Update When
- `tests/lib/theme-utils.js` - Add theme to minimalist list or design trade-offs
- `tests/test-contrast-analysis.js` - New edge case in analysis logic
- `themes/[Theme Name].json` - Contrast failures or invisible UI
- `icon-themes/[Theme Name] icon-theme.json` - Icon colors don't match refactored palette
- `package.json` - ONLY for new themes or renaming (contributes.themes/iconThemes)
- `js/main.js` + `js/browser.js` - ONLY for new themes or pairing logic changes
- `THEME_IMPROVEMENTS_ANALYSIS.md` - Document EVERY completed refactor
- `.github/copilot-instructions.md` - Document theme identity for future reference

### Never Update (Unless Explicitly Needed)
- `README.md` - Only for major milestones
- `CHANGELOG.md` - Only for releases
- `package.json` version - Only when preparing VSIX

## Common Pitfalls & Solutions

### Pitfall 1: Assuming Background Color
**Problem**: Calculated contrast doesn't match test results  
**Cause**: Used background from docs instead of theme JSON  
**Solution**: Always `grep "editor.background" themes/[Theme].json` first  
**Example**: Arctic Nord uses #3b4252 (Nord 2), not #2E3440 (Nord 0)

### Pitfall 2: Batch Replacing Without Context
**Problem**: Replaced color everywhere, broke UI elements  
**Cause**: Color used in both syntax tokens AND semantic UI properties  
**Solution**: Check all contexts before batch replacing  
```bash
grep -B 2 -A 2 '"#COLOR"' themes/[Theme].json
# Review each occurrence - syntax? UI? Both?
```

### Pitfall 3: Over-Optimizing Minimalist Themes
**Problem**: Enforced strict 4.5:1, lost theme's aesthetic  
**Cause**: Didn't check for intentional design philosophy  
**Solution**: Research palette spec, check copilot-instructions.md  
**Example**: Arctic Nord official spec uses softer contrast, 3.5:1 acceptable for keywords

### Pitfall 4: Ignoring Opacity Compounding
**Problem**: Code unreadable in diff views with find highlights  
**Cause**: High opacity selection (80%) + diff (50%) + find (50%) = ~95% combined  
**Solution**: Follow 30/40/50 Rule, test layered scenarios  
**Test**: Selection + diff + find all active simultaneously

### Pitfall 5: Not Evolving Test Harness
**Problem**: Test keeps flagging acceptable design choices  
**Cause**: Test harness doesn't understand minimalist themes or research nuances  
**Solution**: Update test harness when patterns emerge (3+ themes with same philosophy)  
**Example**: Added minimalist allowlist after Arctic Nord + Enchanted Grove

### Pitfall 6: Changing Colors Without Verification
**Problem**: "Fixed" color actually made contrast worse  
**Cause**: Didn't calculate contrast on actual background  
**Solution**: Use debugging scripts to verify before applying  
```javascript
// Always test BEFORE batch replacing
const contrast = getContrast(newColor, actualBackground);
console.log(`New contrast: ${contrast.toFixed(2)}:1`);
```

## Completion Checklist (Per Theme)

### Planning Phase
- [ ] Theme identity researched (concept, palette, philosophy)
- [ ] Actual background color verified in theme JSON
- [ ] Official palette specification reviewed (if applicable)
- [ ] Contrast analysis run and issues categorized
- [ ] Research cross-referenced with test requirements
- [ ] Fix strategy documented with decision tree rationale

### Execution Phase
- [ ] Test harness updated (if needed for new patterns)
- [ ] Colors replaced (surgical or batch with verification)
- [ ] Opacity adjustments applied (30/40/50 rule followed)
- [ ] Icon theme synced (if palette changed significantly)
- [ ] Triple Source of Truth updated (if new theme or renaming)

### Validation Phase
- [ ] `.\run-tests.cmd --quick` passes (structure integrity)
- [ ] `.\run-tests.cmd --contrast` shows improvement
- [ ] Manual testing in 3+ languages (TypeScript, Python, Markdown minimum)
- [ ] Selection readability verified (text visible when highlighted)
- [ ] Diff views tested (added/removed/modified all visible)
- [ ] Find functionality tested (current vs other matches distinguishable)
- [ ] Scrollbars tested (rest/hover/active all visible)
- [ ] Token inspector verified (scopes correctly mapped)
- [ ] Layered scenarios tested (selection + diff + find simultaneously)

### Documentation Phase
- [ ] THEME_IMPROVEMENTS_ANALYSIS.md updated with full refactor details
- [ ] Design trade-offs documented (if accepting lower contrast)
- [ ] Test harness evolution noted (if updated)
- [ ] Completion criteria met (80%+ improvement with identity preserved)
- [ ] Next theme identified from priority queue

## Iterative Approach: Expect Evolution

**Mental Model**: This is an **iterative learning process**, not a mechanical fix-all-themes procedure.

**Expect**:
- Test harness to evolve 3-4 times during first 5 themes
- New edge cases to emerge (opacity compounding, palette constraints)
- Decision trees to update as patterns crystallize
- Research/test contradictions requiring judgment calls

**Embrace**:
- Updating test harness when it contradicts research
- Asking user when design intent is unclear
- Documenting trade-offs when accessibility conflicts with artistry
- Stopping refactor at 85% if further changes compromise identity

**Document**:
- Every test harness evolution (version, rationale, impact)
- Every design trade-off (why accepted, what threshold met)
- Every new pattern discovered (add to this prompt for future themes)

## Success Metrics

**Per Theme**:
- Issue reduction: >80% (24 → 4 issues = 83% ✅)
- Grade improvement: +10 points minimum (B → A- = +10 ✅)
- Identity preservation: User says "still feels like [Theme]" ✅
- Validation: All test modes pass, manual testing confirms ✅

**Overall Collection**:
- All 21 themes achieve CLEAN or documented minimalist status
- Test harness understands all design patterns (minimalist, high-contrast, etc.)
- No contradictions between research and tests
- Complete documentation enables context-free resumption

## Next Steps After This Refactor

1. **Update priority queue**:
```bash
.\run-tests.cmd --contrast
# Note: Priority levels shift as themes are fixed
```

2. **Select next theme**:
- URGENT priority from queue (if any remain)
- User preference (specific request)
- Family grouping (complete all Filter variants)

3. **Start workflow from Step 1** (Understand Theme Identity)

4. **Update this prompt if new patterns emerge**:
- New design philosophy discovered
- New test harness edge case
- New opacity/contrast pattern
- New palette constraint type

## Emergency Recovery

**If you get stuck or lose context**:

1. **Check current state**:
```bash
cd tests
.\run-tests.cmd --status      # What's complete vs pending?
.\run-tests.cmd --contrast    # Current priority queue?
git status                     # Any uncommitted changes?
```

2. **Review last completed theme**:
```bash
grep -A 30 "COMPLETE" THEME_IMPROVEMENTS_ANALYSIS.md | tail -n 30
# See what approach worked last time
```

3. **Re-establish theme identity**:
- Read copilot-instructions.md for theme vision
- Check if official palette exists
- Verify actual background color in theme JSON

4. **Ask user for direction**:
- "Should I continue with [Theme] or switch to different priority?"
- "Is [Theme]'s design philosophy documented somewhere I missed?"
- "When accepting lower contrast, what's your preference: preserve identity or enforce strict WCAG?"

---

**Remember**: Research is the guide, theme identity is the goal, and the test harness is a tool that evolves. When in doubt, preserve artistic vision and document the trade-off.
