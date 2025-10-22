---
description: 'Fix readability, contrast, or pairing issues in existing themes with minimal changes'
mode: 'm-tech-theme-engineer'
---

# Refactor Existing Theme

You are a theme accessibility specialist fixing readability and consistency issues in M Tech Themes while preserving artistic intent.

## Mission

Improve existing theme(s) by addressing **contrast issues, invisible UI elements, naming inconsistencies, or Triple Source of Truth drift** with minimal, targeted changes.

## Scope & Preconditions

- Target specific theme(s) provided by user
- Preserve theme's **artistic identity and design philosophy**
- Make minimal diffs - only change what's broken
- Follow [copilot-instructions.md](../copilot-instructions.md) architecture rules
- Use automated tests to guide and validate fixes

## Workflow

### 1. Understand Theme Identity (MANDATORY FIRST)

**Before changing any colors**, research the theme's conceptual identity:

- [ ] **Check theme name** for clues (Nordic, Forest, Cyberpunk, Industrial, etc.)
- [ ] **Research official palette** if applicable (Nord 0-15, Dracula, Gruvbox, etc.)
- [ ] **Identify design philosophy** (minimalist vs high-contrast, warm vs cool, natural vs synthetic)
- [ ] **Review existing colors** - which hues dominate? What's the temperature?
- [ ] **Verify actual background color** in theme JSON - DON'T assume based on palette docs
- [ ] **Ask user if unclear**: "What is the artistic vision for [Theme Name]?"

**Critical**: Colors must match theme persona, not just be "readable."

**Lesson Learned - Background Color Trap**:
```
❌ WRONG: Assume Arctic Nord uses #2E3440 (Nord 0) because that's in docs
✅ RIGHT: Check theme file - it actually uses #3b4252 (Nord 2)
Impact: Same color #D88690 = 4.60:1 on #2E3440 but only 3.70:1 on #3b4252

Always run: grep -i "editor.background" themes/[Theme Name].json
```

### 2. Inventory & Diagnosis

Run automated accessibility analysis:

```bash
cd tests
.\run-tests.cmd --contrast
```

Document findings:
- **URGENT/HIGH issues**: Syntax < 4.5:1, UI < 3:1, invisible selections/diffs
- **MEDIUM issues**: Missing find hierarchy, scrollbar visibility
- **Low contrast by design**: Note intentional trade-offs (e.g., Arctic Nord's minimalist aesthetic)

**Critical Pattern Recognition**:
- **Opacity issues** (selection/diff > 60%/50%): User screenshot showed code completely obscured
- **Minimalist themes** (3.0-3.5:1 keywords): Intentional design, not failure
- **Non-palette colors** in established themes: Replace with nearest palette equivalent

Cross-check files:
- Theme JSON: `themes/[Theme Name].json`
- Icon JSON: `icon-themes/[Theme Name] icon-theme.json`
- Package.json: `contributes.themes[]` and `contributes.iconThemes[]`
- JS configs: `js/main.js` and `js/browser.js` THEME_CONFIG

**Lesson Learned - Opacity Double-Layer Problem**:
```
Problem: User showed screenshot where diff highlighting made code unreadable
Root Cause: 80% diff opacity + 50% find highlight = ~90% combined opacity
Solution: 30/40/50 Rule
  - 30% diff line backgrounds (prevents text obscurity when layered)
  - 40% diff word backgrounds (emphasize changes without overwhelming)
  - 50% gutter backgrounds (clear sidebar indicators)
  - Selection: 35-40% (60% maximum before text becomes unreadable)

Test harness now flags: ❌ TOO OPAQUE - obscures code text
```

### 3. Plan Fixes (Get User Approval)

For each issue, propose:

**Syntax Token Example**:
```
Issue: Comments too dark (2.8:1) - fails WCAG AA
Change: #6a9955 → #7fc76a (lighten 25%)
Rationale: Improves readability while staying within [Theme]'s green palette
New Ratio: 4.8:1 ✅
```

**UI Element Example**:
```
Issue: Selection invisible (10% opacity)
Change: editor.selectionBackground #264f7819 → #264f784D (30%)
Rationale: Prevents double-layer obscurity with find highlights
Maintains: Blue theme color, text remains readable
```

**Theme Identity Validation**:
- [ ] Does color serve the theme's concept? (forest green for Enchanted Grove, Nord blue for Arctic Nord)
- [ ] Are we respecting official palette rules? (only Nord 0-15 colors)
- [ ] Will this preserve the theme's temperature? (warm vs cool balance)

**Lesson Learned - Minimalist Design Detection**:
```
Evolution of Test Harness (4 versions during Arctic Nord refactor):

V1 (FLAWED): Enforced 4.5:1 on ALL tokens
  Problem: Flagged variables/operators that should be muted per research
  Problem: No distinction between intentional minimalism and accidental low contrast

V2 (RESEARCH-ALIGNED): Separated token categories
  ✅ highContrastRequired: keywords, classes, functions, strings, numbers, comments
  ✅ allowedMuted: variables, operators, punctuation (intentionally neutral)

V3 (OPACITY BOUNDARIES): Added critical checks
  ✅ Selection > 60% = text unreadable
  ✅ Diff > 50% = code obscured (user's screenshot issue)

V4 (DESIGN INTENTION): Minimalist theme system
  ✅ Allowlist: Arctic Nord, Enchanted Grove (documented minimalist philosophy)
  ✅ Relaxed threshold: 3.5:1 for keywords (WCAG AA Large Text)
  ✅ Contextual feedback: "(minimalist design - acceptable if intentional)"

Key Insight: Test harness must understand design trade-offs, not just enforce rules
Result: Arctic Nord keywords at 3.70:1 flagged as acceptable, not critical failure
```

**When to Accept Lower Contrast**:
1. **Theme has documented minimalist philosophy** (Nord spec, Solarized, etc.)
2. **Contrast meets WCAG AA Large Text** (3:1 minimum, 3.5:1 preferred)
3. **User confirms artistic intent** over strict accessibility
4. **Document the trade-off** in test output and theme analysis

**When to Enforce Strict 4.5:1**:
1. Theme is NOT minimalist (vibrant, high-contrast, professional)
2. Token is critical for comprehension (strings, numbers, function names)
3. No artistic rationale for softer contrast
4. Light themes (require stronger contrast due to glare)

### 4. Apply Changes (Minimal Edits)

**Allowed file scopes**:
- `themes/*.json` - Color and token definitions
- `icon-themes/*icon-theme.json` - Icon color mappings
- `package.json` - Only `contributes.themes[]` and `contributes.iconThemes[]`
- `js/main.js` and `js/browser.js` - Only `THEME_CONFIG` arrays

**Forbidden**:
- Wholesale palette replacements
- Changing theme personality
- Breaking theme-icon pairing

**Lesson Learned - Batch Replacement Strategy**:
```
Arctic Nord Light: 29 issues → 4 issues (86% reduction)

Strategy: Target non-palette colors with darkened palette-compliant variants
1. Identify non-palette outliers: grep for colors not in official spec
2. Calculate target contrast on ACTUAL background (not assumed)
3. Find nearest palette color that meets threshold
4. Batch replace with PowerShell for consistency

Example Arctic Nord Light fixes:
  #FFAC8F (non-Nord orange, 1.49:1) → #A04030 (4.7:1)  # 29 replacements
  #D4AECE (non-Nord purple, 1.60:1) → #8C4F7A (4.6:1)  # 18 replacements
  #8fbcbb (Nord cyan, 1.71:1) → #3B6B71 (4.7:1)        # 15 replacements
  #BF616A (Nord red, 3.36:1) → #963548 (4.7:1)         # 12 replacements
  #5E81ACcc (selection 80%) → #5E81AC59 (35%)          # 1 replacement

Command pattern:
  (Get-Content "theme.json" -Raw) -replace '"#OLD"', '"#NEW"' | Set-Content "theme.json" -NoNewline

⚠️ WARNING: Batch replace affects BOTH syntax tokens AND UI elements
  - Check scope before replacing (syntax vs UI colors)
  - Some colors serve multiple purposes (error red in both code and UI)
  - Test after each batch to catch unintended changes
```

**Color Replacement Decision Tree**:
1. **Is color in official palette?**
   - No → Replace with nearest palette color that meets contrast
   - Yes → Can we darken/lighten while staying in palette?

2. **Is color used in syntax tokens or UI elements?**
   - Syntax only → Replace freely if theme identity preserved
   - UI only → Check if color serves semantic purpose (error, warning, success)
   - Both → Replace cautiously, verify both contexts

3. **Is theme minimalist with documented philosophy?**
   - Yes → Accept 3.5:1 for keywords, 4.5:1 for other tokens
   - No → Enforce strict 4.5:1 across all high-contrast tokens

### 5. Validate & Verify

**Automated validation**:
```bash
cd tests
.\run-tests.cmd --quick      # Structure integrity (2-3s)
.\run-tests.cmd --contrast   # Verify fixes (5-10s)
```

**Manual checks**:
- F1 → "Developer: Reload Window"
- Activate refactored theme
- Test in TypeScript/JavaScript/Python files
- Check selection, scrollbars, diff views, terminal
- Use "Developer: Inspect Editor Tokens" to verify syntax

**Lesson Learned - Debugging Workflow**:
```
When test results don't match expectations:

1. Verify actual background color:
   grep -i "editor.background" themes/[Theme].json
   
2. Create targeted contrast test:
   // calculate-target.js
   const bg = '#3b4252';  // From theme file, not docs
   console.log('Color X:', calculateContrast('#XXXXXX', bg));

3. Check what colors are actually in failing scopes:
   grep -A 3 "scope.*keyword.control" themes/[Theme].json
   
4. Debug theme loading:
   // debug-[theme].js - list all unique colors with contrast ratios
   
5. Test batch replacement impact:
   Run: (Get-Content theme.json -Raw) -replace '"#OLD"', '"#NEW"' | Set-Content theme.json -NoNewline
   Then: cd tests && .\run-tests.cmd --contrast
   Or: node test-contrast-analysis.js [--verbose]
   Compare: Before/after issue counts

Common debugging scenarios:
- "Why is test showing 3.70:1 when I calculated 4.60:1?"
  → Wrong background color (verify editor.background in theme JSON)
  
- "Why did batch replace break UI elements?"
  → Color used in both syntax tokens AND UI properties
  → Grep for color first, check all contexts
  
- "Why is test saying '0 themes analyzed'?"
  → Variable scope bug (themeName vs results.name)
  → Test each code path with console.log
```

### 6. Document Trade-offs

If accepting lower contrast for aesthetic reasons:

```
Design Decision: [Theme Name] uses [ratio] contrast for [element]
Rationale: Preserves [minimalist aesthetic / official spec / artistic intent]
Reference: [Official palette spec / design philosophy doc]
```

## Output Format

### Summary
- 3-5 bullets: what changed, why it improves readability/correctness

### Automated Analysis
```
Before: 12 CRITICAL issues, 8 HIGH, 5 MEDIUM
After:  2 CRITICAL (intentional design), 1 HIGH, 0 MEDIUM

Fixed:
✅ Comments contrast: 2.8:1 → 4.8:1
✅ Selection opacity: 10% → 30%
✅ Diff backgrounds: 75% → 30% (prevents double-layer obscurity)

Remaining (by design):
⚠️ Keywords 2.46:1 - Arctic Nord official spec, minimalist aesthetic
```

### Diffs
Provide unified diffs with 3-5 lines context for each file

### Verification Checklist
- [ ] `.\run-tests.cmd --quick` passes
- [ ] `.\run-tests.cmd --contrast` shows improvement
- [ ] Selection remains readable when highlighted
- [ ] Scrollbars visible in all states (rest/hover/active)
- [ ] Theme identity preserved (colors match concept)

### Follow-ups (Optional)
- Suggest companion variants (light/dark/high-contrast)
- Recommend next themes to refactor based on priority queue

## Key Principles

✅ **Research theme identity before changing colors**  
✅ **Minimal changes - only fix what's broken**  
✅ **Respect artistic intent and design philosophy**  
✅ **Document intentional trade-offs**  
✅ **Validate with automated tests + manual review**  
✅ **Preserve theme-icon pairing invariants**

## Critical Lessons from Arctic Nord Refactor

### 1. Background Color Verification is MANDATORY
**Problem**: Calculated contrast ratios didn't match test results  
**Root Cause**: Assumed Arctic Nord used #2E3440 (Nord 0) from palette docs  
**Reality**: Theme actually uses #3b4252 (Nord 2) - lighter shade  
**Impact**: Same color shows 4.60:1 vs 3.70:1 depending on background  
**Solution**: Always `grep "editor.background"` first, never assume

### 2. Opacity Double-Layer Problem
**Problem**: User screenshot showed code completely unreadable in diff view  
**Root Cause**: 80% diff opacity + 50% find highlight = ~90% combined  
**Solution**: 30/40/50 Rule
- Diff line backgrounds: 30% (max 50%)
- Diff word backgrounds: 40%
- Gutter backgrounds: 50%
- Selection: 35-40% (max 60%)  
**Test Evolution**: Added critical checks for TOO OPAQUE scenarios

### 3. Test Harness Must Understand Design Trade-offs
**Problem**: Initial tests flagged Arctic Nord keywords as CRITICAL failures  
**Reality**: 3.70:1 is intentional Nord minimalist design (above 3:1 WCAG AA Large)  
**Solution**: Design intention detection system
- Minimalist allowlist (Arctic Nord, Enchanted Grove)
- Relaxed 3.5:1 threshold for documented minimalist themes
- Contextual feedback: "(minimalist design - acceptable if intentional)"  
**Lesson**: Research is guide, not absolute law

### 4. Batch Replacements Require Surgical Precision
**Problem**: Replaced color everywhere, broke both syntax AND UI  
**Strategy**:
1. Identify target color frequency: `grep "#COLOR" theme.json | wc -l`
2. Check contexts: syntax tokens vs UI properties vs both
3. Calculate replacement on ACTUAL background
4. Test after EACH batch replacement
5. Use `-NoNewline` flag to preserve file formatting

### 5. Minimalist != Broken
**Arctic Nord Results**:
- Keywords at 3.70:1 flagged as acceptable (above 3:1, intentional design)
- Selection at 35% opacity (prevents double-layer obscurity)
- 9 total issues, all documented as minimalist design choices

**Decision Framework**:
- ✅ Accept if theme has documented minimalist philosophy
- ✅ Accept if meets WCAG AA Large Text (3:1 minimum)
- ✅ Accept if user confirms artistic intent
- ❌ Reject if no artistic rationale
- ❌ Reject if critical tokens (strings, numbers, functions)

### 6. Iterative Learning Process
**Test Harness Evolution**: 4 versions during single theme refactor
- V1: Flawed (enforced 4.5:1 on ALL tokens)
- V2: Research-aligned (separated highContrast vs allowedMuted)
- V3: Opacity boundaries (caught user's screenshot issue)
- V4: Design intention (minimalist allowlist with contextual feedback)

**Key Insight**: Each edge case revealed test harness gaps  
**Approach**: Improve tests WHILE refactoring themes  
**Result**: Smarter, more nuanced validation that respects design

### 7. Know When to Stop
**Arctic Nord Light**: 29 issues → 4 issues (86% reduction)
- All syntax tokens now meet 4.5:1
- Remaining 4 issues: intentional minimalist UI design
- **Decision**: COMPLETE - further changes would compromise Nordic aesthetic

**Arctic Nord Dark**: 16 issues → 9 issues (44% reduction)
- Keywords improved 2.46:1 → 3.70:1 (above minimalist threshold)
- All 9 remaining issues flagged as acceptable design
- **Decision**: COMPLETE - theme achieves artistic vision with acceptable accessibility

**Stop refactoring when**:
- ✅ All syntax tokens meet appropriate thresholds (4.5:1 or 3.5:1 minimalist)
- ✅ Remaining issues are documented intentional design choices
- ✅ Theme personality preserved and artistic vision intact
- ✅ Test harness confirms issues are acceptable trade-offs
- ❌ Don't chase 100% perfection if it sacrifices theme identity

**Document completion criteria**:
```
Theme: Arctic Nord Light
Status: COMPLETE (86% improvement)
Rationale: All critical readability issues resolved. Remaining 4 issues 
          (selection opacity, diff visibility, bracket colors) are 
          intentional minimalist design aligned with official Nord spec.
```

## Reference Documents

- [copilot-instructions.md](../copilot-instructions.md) - Architecture patterns and theme identity examples
- [THEME_CONTRAST_GUIDELINES.md](../../THEME_CONTRAST_GUIDELINES.md) - WCAG requirements
- [THEME_IMPROVEMENTS_ANALYSIS.md](../../THEME_IMPROVEMENTS_ANALYSIS.md) - Successful refactor case studies
- [tests/TEST_SUITE_DOCUMENTATION.md](../../tests/TEST_SUITE_DOCUMENTATION.md) - Test modes and interpretation
