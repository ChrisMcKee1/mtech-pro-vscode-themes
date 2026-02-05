# M Tech Themes - Test Suite

## Quick Reference

**Run Tests**: `.\run-tests.cmd [--quick|--contrast|--status|--full|--help]`

**Key Files**:

- `test-contrast-analysis.js` - Main contrast validation (WCAG compliance)
- `test-mapping-validation.js` - Theme-icon pairing verification
- `test-command-functionality.js` - Extension command testing
- `test-refactor-status.js` - Refactor progress tracking
- `TEST_SUITE_DOCUMENTATION.md` - Complete test suite documentation

## Active Scripts

### Production Tools (Keep - Essential)

- `fix-arctic-nord-opacity.js` - Reference implementation for opacity fixes (dual contrast validation)
- `fix-oge-light-opacity.js` - Light theme opacity reference (critical 75%→48% fix)
- `batch-fix-all-opacity.js` - Batch processor for opacity fixes across all themes
- `batch-analyze-themes.js` - Batch analysis for theme properties
- `calculate-nord-colors.js` - Nord palette research with authoritative color mappings

### Research Scripts (Keep - Reference)

- `research-comment-contrast.js` - Industry standard research (4.0-6.0:1 range established)
- `research-comment-scope-categories.js` - Comment scope categorization (test harness v2 basis)
- `analyze-all-comments.js` - Comprehensive comment analysis across themes
- `analyze-theme-properties.js` - Theme property analysis
- `calculate-arctic-light.js` - Arctic Nord Light specific calculations

## Archive Directory

**Location**: `./archive/`

**Archived Scripts** (Historical reference, work completed):

- Theme-specific analysis: `calculate-enchanted-grove*.js`, `calculate-tokyo-day.js`
- Individual fixes: `calculate-target.js`, `check-contrast.js`, `debug-arctic-nord.js`
- Strategy exploration: `calculate-light-opacity-strategy.js`, `calculate-light-selection-diff.js`
- Simple testers: `test-comments.js`, `test-selection-diff.js`
- Verification: `verify-opacity-blending.js`
- Semantic fixes: `find-string-color.js`, `semantic-fix-enchanted-grove.js`

**Archived Text Files** (Intermediate results):

- Arctic Nord analysis: `arctic-*.txt`
- Feisty Fusion analysis: `fusion-*.txt`
- Tokyo Day analysis: `tokyo-day-analysis.txt`
- Misc results: `temp-results.txt`, `final*.txt`

## Test Output Files (Keep - Active Results)

- `contrast-results.txt` - Latest contrast analysis
- `contrast-results-after.txt` - Post-fix contrast results
- `contrast-full-results.txt` - Comprehensive contrast report
- `full-results.txt` - Full test suite results
- `full-test-results.txt` - Complete validation results

## Workflow Patterns

### 1. Opacity Fix Workflow (Completed)

```bash
# Individual theme analysis
node fix-arctic-nord-opacity.js

# Light theme critical fix
node fix-oge-light-opacity.js

# Batch fix remaining themes
node batch-fix-all-opacity.js

# Validate
.\run-tests.cmd --contrast
```

### 2. Comment Contrast Research (Completed)

```bash
# Establish industry standards
node research-comment-contrast.js

# Analyze scope categories
node research-comment-scope-categories.js

# Update test harness (test-contrast-analysis.js)
# Result: 92 false positives eliminated
```

### 3. Theme Property Analysis

```bash
# Batch analyze all themes
node batch-analyze-themes.js

# Specific property deep-dive
node analyze-theme-properties.js
```

## Overlay Standards (Source Of Truth)

Canonical overlay targets live in `tests/lib/theme-utils.js` and the overlay plan in
`docs/OVERLAY_AUDIT_PLAN.md`.

- Dark themes: selection 35%, diff line 30%, diff text 40%, gutter 50%, combined cap 55%
- Light themes: selection 30%, diff line 25%, diff text 35%, gutter 40%, combined cap 48-50%
- Find hierarchy (all themes): match 30%, highlight 20%, range 15%, word 25%, word strong 30%

Legacy scripts retained for historical reference (do not use for current refactors):
- `fix-diff-opacity-25percent.ps1`
- `fix-diff-opacity-30percent.ps1`
- `fine-tune-find-opacity.ps1`

## Consolidation Summary

**Before**: 28 calculation scripts + 15 text files = 43 files  
**After**: 10 active scripts + 5 test output files + 18 archived = 33 files  
**Reduction**: 23% fewer top-level files, organized structure

**Key Improvements**:

- Separated active tools from historical reference
- Consolidated overlapping analysis scripts
- Archived completed one-time fixes
- Preserved research and reference implementations
- Maintained all test output for validation tracking

## Documentation

See `TEST_SUITE_DOCUMENTATION.md` for:

- Complete test mode descriptions
- Test harness architecture
- Validation criteria
- Enhancement history
- Usage examples
