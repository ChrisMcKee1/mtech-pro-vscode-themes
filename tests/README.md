# M Tech Themes - Test Suite

## Quick Reference

**Run Tests**: `.\run-tests.cmd [--quick|--contrast|--status|--full|--help]`

## Core Test Files

| File | Purpose |
|------|---------|
| `run-tests.cmd` | Main entry point — orchestrates all test modes |
| `test-contrast-analysis.js` | WCAG contrast analysis (syntax, UI, ANSI, semantic, brackets) |
| `test-mapping-validation.js` | Triple Source of Truth sync & theme-icon pairing |
| `test-command-functionality.js` | Extension command simulation & theme categorization |
| `test-refactor-status.js` | Refactor progress dashboard |

## Utility Library (`lib/`)

| File | Purpose |
|------|---------|
| `config-loader.js` | Theme file loading & package.json parsing |
| `contrast-utils.js` | WCAG luminance, contrast ratio & alpha blending math |
| `theme-utils.js` | Theme classification arrays, opacity targets, thresholds |
| `terminal-colors.js` | ANSI color codes for terminal output |
| `terminal-output.js` | Formatted printing (headers, sections, stats) |

## Audit Tools (Periodic Use)

| File | Purpose |
|------|---------|
| `comprehensive-property-audit.js` | Audit all themes against full VS Code property reference |
| `audit-missing-properties.js` | Detect missing properties from newer VS Code versions |

Run these when VS Code adds new theme properties or before major releases.

## Contrast Analysis Coverage

The `test-contrast-analysis.js` checks:

- **Syntax highlighting** — 4.5:1 text, 3.5:1 minimalist keywords, 4.0-6.0:1 comments
- **Selection & diffs** — 3:1 minimum, opacity caps (60% selection, 50% diff)
- **Text on highlights** — selected text readability (3:1+)
- **Find system** — visual hierarchy across 5 match types
- **Scrollbar states** — rest vs hover vs active (all 3 states)
- **Bracket levels** — 6 levels at 3:1+ each
- **Welcome page** — text contrast on hover backgrounds
- **Terminal ANSI colors** — ansiBlack trap (dark), ansiWhite trap (light), all 16 colors
- **Semantic highlighting** — `semanticHighlighting: true` enabled

## Overlay Standards

Canonical targets in `lib/theme-utils.js`:

- **Dark**: selection 35%, diff line 30%, diff text 40%, gutter 50%, cap 55%
- **Light**: selection 30%, diff line 25%, diff text 35%, gutter 40%, cap 48-50%
- **Find hierarchy**: match 30% / highlight 20% / range 15% / word 25% / strong 30%

## Workflow

```bash
.\run-tests.cmd --quick      # Pre-commit validation (2-3s)
.\run-tests.cmd --contrast   # Accessibility audit (5-10s)
.\run-tests.cmd --status     # Refactor progress (1s)
.\run-tests.cmd --full       # Pre-release validation (10-15s)
```

See `TEST_SUITE_DOCUMENTATION.md` for complete details.
