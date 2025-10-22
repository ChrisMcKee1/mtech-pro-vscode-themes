# M Tech Themes - Test Suite Documentation

## Overview

The M Tech Themes test suite has been enhanced to support systematic theme refactoring workflows. Instead of manual contrast calculations and tracking, the test suite now provides automated accessibility analysis, refactor status tracking, and flexible execution modes.

## Quick Start

```cmd
# Run default structure validation
cd tests
.\run-tests.cmd

# Show available test modes
.\run-tests.cmd --help

# Run contrast analysis to identify accessibility issues
.\run-tests.cmd --contrast

# Check refactor progress across all themes
.\run-tests.cmd --status

# Run everything (structure + contrast + status)
.\run-tests.cmd --full
```

## Test Modes

### `--quick` (Default)
**Purpose**: Fast structure validation for continuous integration

**What it checks**:
- Theme-to-icon pairing correctness
- File existence (themes/*.json, icon-themes/*.json)
- Triple Source of Truth synchronization (package.json, main.js, browser.js)
- Orphaned files detection
- Command functionality simulation

**When to use**: Before committing changes, after adding/removing themes

**Runtime**: ~2-3 seconds

### `--contrast`
**Purpose**: Automated accessibility analysis and WCAG compliance checking

**What it checks**:
- Syntax highlighting contrast ratios (text must pass 4.5:1)
- UI element contrast (selections, diffs, brackets must pass 3:1)
- Low-opacity overlays that may be invisible
- Find system hierarchy (visual distinction between match types)
- Scrollbar hover feedback

**Output**:
- Critical issues: Syntax tokens failing 4.5:1 readability
- High issues: UI elements failing 3:1 visibility
- Medium issues: Low opacity, missing hierarchy
- Priority queue: Themes sorted by refactor urgency (URGENT/HIGH/MEDIUM/LOW)

**When to use**: 
- Before starting a theme refactor (identify issues)
- After completing a refactor (validate fixes)
- Periodic audits to catch regressions

**Runtime**: ~5-10 seconds (analyzes all 20 themes)

### `--status`
**Purpose**: Refactor progress dashboard and work tracking

**What it checks**:
- Parses THEME_IMPROVEMENTS_ANALYSIS.md for completed refactors
- Extracts grade improvements (D- → A-, etc.)
- Identifies pending themes needing refactor
- Calculates progress percentage
- Estimates remaining work based on averages

**Output**:
- Progress bar visualization
- Completed refactors with grade improvements
- Pending themes categorized by light/dark
- Recommendations for next refactors

**When to use**:
- Planning refactor sessions
- Reporting progress
- Prioritizing work

**Runtime**: ~1 second

### `--full`
**Purpose**: Comprehensive validation for release preparation

**What it runs**:
1. Command functionality tests
2. Mapping validation tests
3. Contrast analysis
4. Refactor status tracking

**When to use**: Before releasing new VSIX, major refactoring milestones

**Runtime**: ~10-15 seconds

## Test Scripts

### `test-command-functionality.js`
Simulates VS Code command execution and validates theme categorization logic.

**Key functions**:
- `getMatchingIconTheme()` - Tests icon pairing logic
- `getThemeCategories()` - Validates light/dark classification
- `simulateSetThemeAndIcons()` - Tests command integration

**Catches**:
- Missing icon theme files
- Incorrect fallback behavior
- Theme categorization errors

### `test-mapping-validation.js`
Validates the Triple Source of Truth synchronization and file structure.

**Key validations**:
- Package.json theme/icon contributions match physical files
- JavaScript configs (main.js/browser.js) are synchronized
- Theme-to-icon mappings functional
- No orphaned files

**Catches**:
- Missing JSON files
- Desynchronized configs
- Naming mismatches
- Orphaned icon themes

### `test-contrast-analysis.js` (OPTIMIZED)
Automated WCAG contrast analysis for accessibility compliance.

**Architecture**: Uses shared utilities from `tests/lib/`:
- `contrast-utils.js` - WCAG calculations (hexToRgb, calculateContrast, analyzeContrast)
- `terminal-output.js` - Formatted printing (printError, printSuccess, printWarning)
- `config-loader.js` - Theme file loading
- `theme-utils.js` - Theme classification (minimalist detection, design trade-offs)

**Key features**:
- Hex to RGB to luminance conversion
- Opacity blending calculations (foreground + alpha onto background)
- Contrast ratio calculations: (L_bright + 0.05) / (L_dark + 0.05)
- Design intention detection (minimalist themes, documented trade-offs)
- Actionable fix suggestions for every issue
- `--verbose` flag for detailed output (default: only failures)
- Category-specific checks:
  - Syntax highlighting (4.5:1 minimum, 3.5:1 for minimalist)
  - Brackets (3:1 minimum)
  - Selection/diffs (3:1 minimum, checks opacity, warns if > 60%/50%)
  - Find system (hierarchy detection)
  - Scrollbars (hover feedback detection)

**Output format**:
```
🌙 Theme Name (dark)
────────────────────────────────────────────────────────────

  SYNTAX:
    🚨 CRITICAL: Syntax token fails readability: keyword
       Color: #ff0080 | Contrast: 3.78:1
       Required: 4.5:1
       → FIX: Darken to #c0007d (achieves 4.67:1)

  SELECTION:
    ⚠️ HIGH: Selection invisible (low contrast)
       Color: #4a1a4a26 | Contrast: 1.36:1
       Opacity: 15%
       Required: 3:1
       → FIX: Increase opacity to 35% (recommended for dark themes)
```

**Priority Queue**:
- **URGENT**: Critical issues >= 5 OR (critical >= 2 AND high >= 3)
- **HIGH**: Critical >= 2 OR high >= 4
- **MEDIUM**: Critical >= 1 OR high >= 2 OR medium >= 5
- **LOW**: Minor issues only

### `test-refactor-status.js` (NEW)
Tracks refactor progress by parsing THEME_IMPROVEMENTS_ANALYSIS.md.

**Key features**:
- Regex pattern matching for refactor sections
- Grade extraction (e.g., "D- (45%) → A- (93%)")
- Properties modified count extraction
- Validation status detection
- Pending theme identification

**Output format**:
```
✅ REFACTORED THEMES:

✅ Cyberpunk Neon Light
   Grade: D- (45%) → A- (93%)
   +48 percentage points | 36 properties modified

⏳ PENDING REFACTOR:

  Dark Themes (11):
    🌙 Arctic Nord
    🌙 Tokyo Night
    ...

  Light Themes (5):
    ☀️ Filter Sun
    ☀️ OGE Light
    ...
```

**Save markdown summary**:
```cmd
node test-refactor-status.js --save
# Creates REFACTOR_STATUS.md with markdown table
```

## Workflow Integration

### Starting a New Refactor

```cmd
# 1. Identify issues
.\run-tests.cmd --contrast

# 2. Check refactor status
.\run-tests.cmd --status

# 3. Pick highest priority theme from contrast analysis URGENT queue
# 4. Use sequential thinking to plan fixes
# 5. Apply modifications
# 6. Validate

# 7. Run structure validation
.\run-tests.cmd --quick

# 8. Run contrast analysis to verify fixes
.\run-tests.cmd --contrast

# 9. Update THEME_IMPROVEMENTS_ANALYSIS.md
# 10. Check progress
.\run-tests.cmd --status
```

### Continuous Integration

```cmd
# Quick validation on every commit
.\run-tests.cmd --quick

# Weekly accessibility audit
.\run-tests.cmd --contrast

# Monthly progress review
.\run-tests.cmd --status
```

### Pre-Release Checklist

```cmd
# Full suite validation
.\run-tests.cmd --full

# Manual verification
# - Reload window
# - Test each refactored theme
# - Visual inspection of syntax, UI, diffs

# Update version in package.json
# Create VSIX
# Update CHANGELOG.md
```

## Understanding Test Output

### Success Indicators
- **✅ Green checkmarks**: All validations passed
- **77 successes**: Structure tests passed
- **0 errors**: No blocking issues
- **Clean themes**: No contrast issues detected

### Warning Indicators
- **⚠️ Yellow warnings**: Non-blocking issues
- **Missing monochrome variants**: Expected, not critical
- **Theme name mismatches**: Minor naming differences
- **Orphaned files**: Files not registered in package.json

### Error Indicators
- **❌ Red errors**: Critical failures
- **Contrast < 4.5:1**: Text readability failure
- **Contrast < 3:1**: UI visibility failure
- **Missing files**: Broken theme references

### Priority Levels
- **🚨 URGENT**: Multiple critical accessibility failures, refactor immediately
- **⚠️ HIGH**: Significant contrast issues, prioritize soon
- **ℹ️ MEDIUM**: Low opacity or hierarchy issues, schedule refactor
- **✅ CLEAN**: No significant issues, lowest priority

## Extending the Test Suite

### Adding New Contrast Checks

Edit `test-contrast-analysis.js` (uses shared utilities from `tests/lib/`):

```javascript
// Import shared utilities
const { analyzeContrast } = require('./lib/contrast-utils');
const { printError } = require('./lib/terminal-output');

// Add new category analysis
analyzeCustomComponent(theme, background, results) {
    const colors = theme.colors || {};
    const customColor = colors['custom.component.background'];
    
    if (customColor) {
        const analysis = analyzeContrast(customColor, background, true);
        
        if (!analysis.passes3) {
            printError('HIGH', 'Custom component fails visibility', {
                property: 'custom.component.background',
                color: customColor,
                contrast: analysis.contrast.toFixed(2) + ':1',
                required: '3:1',
                fix: 'Darken component background by 20-30%'
            });
            results.issues.push({
                severity: 'high',
                category: 'custom',
                property: 'custom.component.background',
                color: customColor,
                contrast: analysis.contrast.toFixed(2),
                required: '3:1',
                message: 'Custom component fails visibility'
            });
            this.stats.highIssues++;
        }
    }
}

// Call in analyzeTheme()
this.analyzeCustomComponent(theme, bg, results);
```

### Adding New Refactor Patterns

Edit `test-refactor-status.js`:

```javascript
// Extract additional metadata
const categoryPattern = /Category:\s*(.+)/i;
const categoryMatch = section.match(categoryPattern);

this.refactored.push({
    // ... existing fields
    category: categoryMatch ? categoryMatch[1] : 'General'
});
```

## Troubleshooting

### "Range out of order in character class"
**Cause**: Invalid regex character class  
**Fix**: Escape special characters in regex patterns

### "Cannot find path"
**Cause**: Running from wrong directory  
**Fix**: Always run from `tests/` directory or use absolute paths

### "File not found" errors
**Cause**: Theme/icon files missing  
**Fix**: Run `--quick` mode to identify missing files

### Contrast analysis shows 0 issues on known-bad theme
**Cause**: Theme JSON structure different than expected  
**Fix**: Check `editor.background` and `tokenColors` array format

### Status tracker shows "Unknown (0%)" grades
**Cause**: THEME_IMPROVEMENTS_ANALYSIS.md format doesn't match regex  
**Fix**: Ensure grade pattern follows: `D- (45%) → A- (93%)`

## Performance Notes

- **Quick mode**: 2-3 seconds (file checks, no color calculations)
- **Contrast mode**: 5-10 seconds (RGB/luminance math for ~20 themes)
- **Status mode**: 1 second (regex parsing of markdown)
- **Full mode**: 10-15 seconds (runs all tests sequentially)

**Optimization tip**: Use `--quick` during development, `--contrast` when finishing refactors, `--status` for planning.

## Mathematical Reference

### Contrast Ratio Formula
```
Contrast = (L_brighter + 0.05) / (L_darker + 0.05)
```

### RGB to Luminance
```javascript
// Normalize to 0-1, apply gamma correction
c = c / 255
c = (c <= 0.03928) ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4

// Calculate relative luminance
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
```

### Opacity Blending
```
Result_R = (Foreground_R × α) + (Background_R × (1 - α))
Result_G = (Foreground_G × α) + (Background_G × (1 - α))
Result_B = (Foreground_B × α) + (Background_B × (1 - α))
```

### Hex Opacity Reference
| Hex | Alpha | Opacity |
|-----|-------|---------|
| 0c  | 0.05  | 5%      |
| 14  | 0.08  | 8%      |
| 19  | 0.10  | 10%     |
| 26  | 0.15  | 15%     |
| 40  | 0.25  | 25%     |
| 4D  | 0.30  | 30%     |
| 59  | 0.35  | 35%     |
| 66  | 0.40  | 40%     |
| 80  | 0.50  | 50%     |
| 8C  | 0.55  | 55%     |

## WCAG Standards

### Contrast Requirements
- **Normal text (< 18pt)**: 4.5:1 minimum (AA), 7:1 enhanced (AAA)
- **Large text (≥ 18pt)**: 3:1 minimum (AA), 4.5:1 enhanced (AAA)
- **UI components**: 3:1 minimum (AA)
- **Graphical objects**: 3:1 minimum (AA)

### Industry Best Practices
- **Selection background**: 30-40% opacity, 3:1 contrast
- **Diff backgrounds**: 30% opacity, 3:1 contrast
- **Find highlights**: 30-50% opacity with visual hierarchy
- **Scrollbars**: Distinct rest/hover/active states
- **Comments**: 3:1 minimum (not 4.5:1 due to secondary nature)

## Future Enhancements

Potential additions to test suite:

1. **Color extraction utility**: Auto-detect "hot" colors likely to fail contrast
2. **Theme comparison**: Diff two themes to see differences
3. **Batch refactor**: Apply common fixes across multiple themes
4. **Visual regression**: Screenshot comparison between versions
5. **Token coverage**: Ensure all TextMate scopes are styled
6. **Icon coverage**: Validate icon mappings for common file types
7. **Performance testing**: Theme load time benchmarking

## Contributing

When adding tests:
1. Follow existing naming conventions (`test-*.js`)
2. Use ANSI color codes for output formatting
3. Export reusable functions for other tests
4. Document test purpose and usage in this file
5. Add to `run-tests.cmd` with appropriate flag

## License

MIT License - Same as M Tech Themes extension
